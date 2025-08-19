import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import {Plus} from "lucide-react"
import { useState } from "react";
import UserProfileModal from "./UserProfileModal";

function ChatHeader() {
    const {selectedUser,setSelectedUser}=useChatStore();
    const {onlineUsers} =useAuthStore();
    const [showProfile,setShowProfile]=useState(false);
    const isOnline = selectedUser && onlineUsers.includes(selectedUser._id);
    return ( 
        <>
        <div className="h-18 w-full bg-base-300 border-b border-base-100 flex justify-between items-center px-5 py-4 ">
            <button className="flex flex- items-center gap-2" onClick={()=>setShowProfile(true)}>
                <img className="rounded-full size-13" src={selectedUser.profilePic || "/avatar.png"} alt="" />
                <div className="flex flex-col text-left">
                    <span>{selectedUser?.fullName}</span>
                    <span className="text-sm text-zinc-400">{isOnline ? "Online": "offine"}</span>
                </div>
            </button>
            <div>
                <Plus className={`rotate-45 hover:size-4  duration-100 `} onClick={()=>setSelectedUser(null)} />
            </div>
        </div>
        {showProfile && (
            <UserProfileModal user={selectedUser} isOnline={isOnline} onClose={()=>setShowProfile(false)} />
        )}
        </>
     );
}

export default ChatHeader;