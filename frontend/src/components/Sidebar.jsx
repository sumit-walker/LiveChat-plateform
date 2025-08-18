import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeletons";
import { Users } from "lucide-react";

function Sidebar() {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUserLoading,
    unseenMessages,
    subscribeTOMessages,
    unsubscribeTOMessages,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // ✅ ensure socket listener exists
  useEffect(() => {
    subscribeTOMessages();
    return () => unsubscribeTOMessages();
  }, [subscribeTOMessages, unsubscribeTOMessages]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  const handleSelectUser = (user) => {
    setSelectedUser(user); // unseen cleared inside store
  };

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <div
      className={`h-full ${
        selectedUser ? "hidden sm:flex sm:w-full lg:w-100" : "w-full lg:w-100"
      } 
      border-r border-base-100 flex flex-col min-h-0 transition-all duration-200`}
    >
      <div className="border-b border-base-100 w-full px-5 py-2">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
          <span className="text-xs text-zinc-500 hidden lg:block">
            ({Math.max(onlineUsers.length - 1, 0)} online)
          </span>
        </div>

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

      <div className="overflow-y-auto flex-1 w-full rounded-bl-2xl p-2">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => handleSelectUser(user)}
            className={`w-full lg:p-2 border-b border-base-100 flex items-center gap-3 p-3 
              hover:bg-base-100 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>

            {unseenMessages[user._id] && (
              <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                {unseenMessages[user._id]}
              </span>
            )}
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            {showOnlineOnly ? "No online users" : "No users"}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
