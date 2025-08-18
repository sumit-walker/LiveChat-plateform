import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,

    getUsers:async()=>{
        set({isUserLoading:true});
        try{
            const res=await axiosInstance.get("/messages/users");
            set({users:res.data});
        }catch(error){
            const message = error?.response?.data?.message || error?.message || "Failed to load users";
            toast.error(message);
        }finally{
            set({isUserLoading:false});
        }
    },


    getMessages:async(userId)=>{
        set({isMessagesLoading:true});
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});
        }catch(error){
            const message = error?.response?.data?.message || error?.message || "Failed to load messages";
            toast.error(message);
        }finally{
            set({isMessagesLoading:false});
        }
    },

    sendMessage: async(messagesData)=>{
        const {selectedUser,messages}=get();
        try{
            console.log(selectedUser._id,messagesData)
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messagesData);
            set({messages:[...messages,res.data]})
        }catch(error){
            const message = error?.response?.data?.message || error?.message || "Failed to send message";
            toast.error(message)
        }
    },

    subscribeTOMessages:()=>{
        const {selectedUser}=get();
        if(!selectedUser) return;

        const socket=useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            if(!(newMessage.senderId===selectedUser._id)) return
            set({
                messages:[...get().messages,newMessage]
            });
        });

    },

    unsubscribeTOMessages:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser:(selectedUser)=>{
        set({selectedUser})
    },

    
}))