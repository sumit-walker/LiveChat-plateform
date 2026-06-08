import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const { onlineUsers, authUser, socket } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    if (authUser) getUsers();
  }, [authUser, getUsers]);

  useEffect(() => {
    if (!socket?.connected) return;
    subscribeTOMessages();
    return () => unsubscribeTOMessages();
  }, [socket, subscribeTOMessages, unsubscribeTOMessages]);

  const sortedUsers = [...users].sort((a, b) => {
    const aOnline = onlineUsers.includes(a._id);
    const bOnline = onlineUsers.includes(b._id);
    if (aOnline !== bOnline) return aOnline ? -1 : 1;
    return a.fullName.localeCompare(b.fullName);
  });

  const filteredUsers = showOnlineOnly
    ? sortedUsers.filter((user) => onlineUsers.includes(user._id))
    : sortedUsers;

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
          <span className="font-medium hidden lg:block">Members</span>
          <span className="text-xs text-zinc-500 hidden lg:block">
            ({users.length} total · {users.filter((user) => onlineUsers.includes(user._id)).length} online)
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

      {authUser && (
        <Link
          to="/profile"
          className="mx-2 mt-2 p-3 rounded-lg border border-base-100 bg-base-200/40 flex items-center gap-3 hover:bg-base-100 transition-colors"
        >
          <div className="relative flex-shrink-0">
            <img
              src={authUser.profilePic || "/avatar.png"}
              alt={authUser.fullName}
              className="size-12 object-cover rounded-full"
            />
            <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
          </div>
          <div className="text-left min-w-0">
            <div className="text-xs text-zinc-400 uppercase tracking-wide">You</div>
            <div className="font-medium truncate">{authUser.fullName}</div>
            <div className="text-sm text-zinc-400 truncate">{authUser.email}</div>
          </div>
        </Link>
      )}

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
            {showOnlineOnly ? "No members online" : "No other members yet"}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
