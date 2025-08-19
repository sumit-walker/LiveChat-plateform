import User from "../model/user.model.js";
import Message from "../model/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId,io } from "../lib/socket.js";
export const getUserForSidebar = async (req,res)=>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

        res.status(200).json(filteredUser);
    }catch(error){
        console.error("Error in getUserForSidebar",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

export const getMessage=async(req,res)=>{
    try{
        const {id:userToChatId}=req.params;
        const myId=req.user._id;

        const message = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ],
        });

        res.status(200).json(message);
    }catch(error){
        console.log("Error in getMessage controller",error.message);
        res.status(500).json({error:"Internal server error"});

    }
}


export const sendMessage = async(req,res)=>{
    try{
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;

        let imageUrl;
        let imagePublicId;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
            imagePublicId=uploadResponse.public_id;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
            imagePublicId,
        });

        await newMessage.save();



        //realtime functionality  == socket.io

        // const receiverSocketId=getReceiverSocketId(receiverId);
        // if(receiverSocketId){
        //     io.to(receiverId).emit("newMessage",newMessage);
        // }

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage)

    }catch(error){
        console.log("Error in senderMessage controller ", error.message);
        res.status(500).json({error:"Internal server error"});

    }
}

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const requesterId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.senderId.toString() !== requesterId.toString()) {
            return res.status(403).json({ message: "You can only delete your own messages" });
        }

        if (message.imagePublicId) {
            try {
                await cloudinary.uploader.destroy(message.imagePublicId);
            } catch (err) {
                console.log("Cloudinary destroy failed:", err.message);
            }
        }

        await Message.findByIdAndDelete(messageId);

        const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
        const payload = { messageId, senderId: message.senderId, receiverId: message.receiverId };
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", payload);
        }

        // also emit to sender's socket if connected (useful if multiple tabs)
        const senderSocketId = getReceiverSocketId(message.senderId.toString());
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageDeleted", payload);
        }

        res.status(200).json({ success: true, ...payload });
    } catch (error) {
        console.log("Error in deleteMessage controller ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        const requesterId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (message.senderId.toString() !== requesterId.toString()) {
            return res.status(403).json({ message: "You can only edit your own messages" });
        }

        if (typeof text === "string") {
            message.text = text;
        }

        await message.save();

        const payload = message;

        const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageUpdated", payload);
        }

        const senderSocketId = getReceiverSocketId(message.senderId.toString());
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageUpdated", payload);
        }

        res.status(200).json(payload);
    } catch (error) {
        console.log("Error in updateMessage controller ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}