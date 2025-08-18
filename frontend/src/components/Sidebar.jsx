import {useEffect,useState} from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeletons";
import {Users} from "lucide-react"

function Sidebar() {
    const {getUsers,users,selectedUser,setSelectedUser,isUserLoading} = useChatStore();

    const{onlineUsers}=useAuthStore();
    const [showOnlineOnly,setShowOnlineOnly]=useState(false);

    useEffect(()=>{
        getUsers();
    },[getUsers]);

    const filteredUsers=showOnlineOnly? users.filter((user)=> onlineUsers.includes(user._id)) :users;
    
    if(isUserLoading) return <SidebarSkeleton/>
    return ( 
        <div className={`h-full ${selectedUser? "hidden":"w-full"}  lg:w-100 border-r border-base-100 flex flex-col min-h-0 transition-all duration-200 `}>
           <div className="border-b border-base-100 w-full px-5 py-2">
                <div className="flex items-center gap-2">
                    <Users className="size-6"/>
                    <span className="font-medium hidden lg:block">Contacts</span>
                    <span className="text-xs text-zinc-500 hidden lg:block">({onlineUsers.length-1 } online)</span>

                </div>
           
             {/* TODO: Online filter toggle */}
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                        type="checkbox"
                        checked={showOnlineOnly}
                        onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                </div>
            </div>
        <div className="overflow-y-auto flex-1 w-full rounded-bl-2xl   ">
            
            {filteredUsers.map((user) => (
            <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`
                lg:w-full lg:p-2 lg:border-b lg:border-base-100 flex items-center  gap-3  p-3 
                hover:bg-base-100 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-100 ring-1 ring-base-300" : ""}
                `}
            >
                <div className="relative left-0 mx-auto lg:mx-0">
                <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.name}
                    className="size-12 object-cover rounded-full "
                />
                {onlineUsers.includes(user._id) && (
                    <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                    />
                )}
                </div>

                {/* User info - only visible on larger screens */}
                <div className=" text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
                </div>
            </button>
            ))}

            {
                filteredUsers.length===0 &&(
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )
            }
            
            </div>
        </div>
     );
}

export default Sidebar;