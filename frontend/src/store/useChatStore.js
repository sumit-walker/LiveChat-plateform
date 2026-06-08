import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import { playNotificationSound } from "../lib/notificationSound";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    unseenMessages: {},
    notificationPulse: 0,
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,
_subscribed: false, // internal guard


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

    updateMessage: async (messageId, text) => {
        const { messages } = get();
        try {
            const res = await axiosInstance.put(`/messages/${messageId}`, { text });
            const updated = res.data;
            set({
                messages: messages.map((m) => (m._id === updated._id ? updated : m)),
            });
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Failed to update message";
            toast.error(message);
        }
    },
    incrementUnseen: (senderId) => {
    const { unseenMessages } = get();
    set({
      unseenMessages: {
        ...unseenMessages,
        [senderId]: (unseenMessages[senderId] || 0) + 1,
      },
    });
  },

  clearUnseen: (userId) => {
    const { unseenMessages } = get();
    const updated = { ...unseenMessages };
    delete updated[userId];
    set({ unseenMessages: updated });
  },

  // ✅ Subscribe ONCE regardless of selectedUser; decide inside handler
  subscribeTOMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("messageUpdated");
    socket.off("messageDeleted");
    set({ _subscribed: true });

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, messages, unseenMessages, users, notificationPulse } = get();
      const senderId = String(newMessage?.senderId || newMessage?.sender?._id || "");

      if (!senderId) return;

      const isActiveChat =
        selectedUser?._id && senderId === String(selectedUser._id);

      if (isActiveChat) {
        set({ messages: [...messages, newMessage] });
        return;
      }

      const sender = users.find((user) => String(user._id) === senderId);
      const preview = newMessage.text?.trim() || "Sent an image";

      set({
        unseenMessages: {
          ...unseenMessages,
          [senderId]: (unseenMessages[senderId] || 0) + 1,
        },
        notificationPulse: notificationPulse + 1,
      });

      playNotificationSound();

      if (sender) {
        toast(`${sender.fullName}: ${preview}`, { icon: "🔔" });
      } else {
        toast(`New message: ${preview}`, { icon: "🔔" });
      }

      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        new Notification(sender?.fullName || "New message", { body: preview });
      }
    });

    socket.on("messageUpdated", (updated) => {
      const { messages } = get();
      set({ messages: messages.map((m) => (m._id === updated._id ? updated : m)) });
    });

    socket.on("messageDeleted", ({ messageId }) => {
      const { messages } = get();
      set({ messages: messages.filter((m) => m._id !== messageId) });
    });
  },

  unsubscribeTOMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
    socket.off("messageDeleted");
    set({ _subscribed: false });
  },

    deleteMessage: async (messageId) => {
        const { messages } = get();
        try {
            await axiosInstance.delete(`/messages/${messageId}`);
            set({ messages: messages.filter((m) => m._id !== messageId) });
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || "Failed to delete message";
            toast.error(message);
        }
    },

  // ✅ Single source of truth: clear unseen here
  setSelectedUser: (user) => {
    set({ selectedUser: user });
    if (user?._id) {
      get().clearUnseen(user._id);
      // Optionally also load messages here:
      // get().getMessages(user._id);
    }
  },

    
}))



  
