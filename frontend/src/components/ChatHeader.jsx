import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import {Plus} from "lucide-react"

function ChatHeader() {
    const {selectedUser,setSelectedUser}=useChatStore();
    const {onlineUsers} =useAuthStore();
    return ( 
        <div className="h-18 w-full bg-base-300 border-b border-base-100 flex justify-between items-center px-5 py-4 ">
            <div className="flex flex- items-center gap-2">
                <img className="rounded-full size-13" src={selectedUser.profilePic || "/avatar.png"} alt="" />
                <div className="flex flex-col">
                    <span>{selectedUser?.fullName}</span>
                    <span className="text-sm text-zinc-400">{onlineUsers.includes(selectedUser._id) ? "Online": "offine"}</span>
                </div>
            </div>
            <div>
                <Plus className={`rotate-45 hover:size-4  duration-100 `} onClick={()=>setSelectedUser(null)} />
            </div>
        </div>
     );
}

export default ChatHeader;