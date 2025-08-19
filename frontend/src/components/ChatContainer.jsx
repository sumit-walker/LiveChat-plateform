import {useEffect,useRef,useState} from "react";
import { MoreHorizontal } from "lucide-react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import {formatMessageTime} from "../lib/utils.js"
function ChatContainer() {
    const {messages,getMessages, isMessagesLoading,selectedUser,subscribeTOMessages,unsubscribeTOMessages,deleteMessage,updateMessage}=useChatStore();
    const {authUser} = useAuthStore();
    const messageEndRef=useRef(null);
    const [editingMessageId,setEditingMessageId]=useState(null);
    const [editingText,setEditingText]=useState("");
    const [mobileActionsForId,setMobileActionsForId]=useState(null);

    useEffect(()=>{
        getMessages(selectedUser._id);
        subscribeTOMessages();

        return ()=>unsubscribeTOMessages();
    },[selectedUser._id,getMessages,subscribeTOMessages,unsubscribeTOMessages])

    
    useEffect(()=>{
        if(messageEndRef.current && messages){
            messageEndRef.current.scrollIntoView({behavior:"smooth"});
        }
    },[messages])

    if(isMessagesLoading){
        return(
           <div className=" h-full w-full flex flex-col ">
                <ChatHeader/>
                <MessageSkeleton/>
                <MessageInput/>
            </div>
        )
    }

    return ( 
        <div className={` h-full w-full ${selectedUser?"block lg:block":"hidden lg:block"}`}>
            <div className=" h-full w-full flex flex-col overflow-auto ">
                <ChatHeader/>
                <div className="h-full overflow-y-auto p-4 ">
                    {messages.map((msg)=>(
                        <div key={msg._id}
                        className={`chat ${msg.senderId==authUser._id?"chat-end":"chat-start"}`}
                        ref={messageEndRef}
                        >
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img src={msg.senderId==authUser._id? authUser.profilePic || "/avatar.png":selectedUser.profilePic||"/avatar.png"} alt="profile pic" />
                                </div>
                            </div>
                            <div
                                className="bg-base-100 chat-bubble relative group"
                                onClick={()=>{
                                    if(msg.senderId==authUser._id){
                                        setMobileActionsForId(prev=> prev===msg._id ? null : msg._id)
                                    }
                                }}
                            >
                                {msg.image && (
                                    <img src={msg.image} alt="senderImg"  className="sm:max-w-[200px] rounded-md mb-2"/>
                                )}
                                {editingMessageId===msg._id ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            className="input input-sm w-full"
                                            value={editingText}
                                            onChange={(e)=>setEditingText(e.target.value)}
                                        />
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={()=>{ updateMessage(msg._id, editingText); setEditingMessageId(null); setEditingText(""); }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="btn btn-xs"
                                            onClick={()=>{ setEditingMessageId(null); setEditingText(""); }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    msg.text && <p>{msg.text}</p>
                                )}
                                <div className="chat-header mb-1 flex justify-end">
                                    <time  className="text-xs opacity-50">{formatMessageTime(msg.createdAt)}</time>
                                </div>
                                {msg.senderId==authUser._id && (
                                    <div className="absolute -top-2 -right-2 hidden group-hover:flex items-center gap-1">
                                        <button
                                            onClick={()=>{ setEditingMessageId(msg._id); setEditingText(msg.text || ""); setMobileActionsForId(null); }}
                                            className="bg-primary text-white text-xs px-2 py-1 rounded shadow"
                                            title="Edit message"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={()=>deleteMessage(msg._id)}
                                            className="bg-error text-white text-xs px-2 py-1 rounded shadow"
                                            title="Delete message"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                                {msg.senderId==authUser._id && (
                                    <button
                                        className="absolute -top-2 -right-2 lg:hidden bg-base-300 rounded-full p-1 shadow"
                                        onClick={(e)=>{ e.stopPropagation(); setMobileActionsForId(prev=> prev===msg._id ? null : msg._id); }}
                                        title="More"
                                    >
                                        <MoreHorizontal className="size-4" />
                                    </button>
                                )}
                                {msg.senderId==authUser._id && mobileActionsForId===msg._id && (
                                    <div className="mt-2 flex gap-2 lg:hidden">
                                        <button
                                            onClick={()=>{ setEditingMessageId(msg._id); setEditingText(msg.text || ""); setMobileActionsForId(null); }}
                                            className="btn btn-xs btn-primary"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={()=>{ deleteMessage(msg._id); setMobileActionsForId(null); }}
                                            className="btn btn-xs btn-error"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <MessageInput/>
            </div>
        </div>
     );
}

export default ChatContainer;