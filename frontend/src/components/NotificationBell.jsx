import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { unlockNotificationAudio } from "../lib/notificationSound";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { unseenMessages, users, setSelectedUser, notificationPulse } = useChatStore();

  const totalUnseen = Object.values(unseenMessages).reduce(
    (sum, count) => sum + count,
    0
  );

  const notifications = Object.entries(unseenMessages)
    .map(([userId, count]) => {
      const user = users.find((member) => member._id === userId);
      return user ? { user, count } : null;
    })
    .filter(Boolean);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (notificationPulse === 0) return;

    setIsRinging(true);
    const timer = setTimeout(() => setIsRinging(false), 750);
    return () => clearTimeout(timer);
  }, [notificationPulse]);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const openChat = (user) => {
    setSelectedUser(user);
    navigate("/");
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => {
          unlockNotificationAudio();
          setOpen((prev) => !prev);
        }}
        className="relative p-2 rounded-md hover:bg-base-200 transition-colors"
        aria-label="Notifications"
      >
        <Bell
          className={`size-5 opacity-70 hover:opacity-100 ${
            isRinging ? "animate-bell-ring text-amber-400" : ""
          }`}
        />
        {totalUnseen > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 text-xs font-semibold bg-red-500 text-white rounded-full flex items-center justify-center">
            {totalUnseen > 9 ? "9+" : totalUnseen}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 max-h-80 overflow-y-auto bg-base-100 border border-base-300 rounded-lg shadow-lg z-30">
          <div className="px-4 py-3 border-b border-base-300 font-medium">
            Notifications
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-zinc-400 text-center">
              No new messages
            </p>
          ) : (
            <ul className="py-1">
              {notifications.map(({ user, count }) => (
                <li key={user._id}>
                  <button
                    type="button"
                    onClick={() => openChat(user)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-base-200 text-left"
                  >
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="size-10 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{user.fullName}</p>
                      <p className="text-sm text-zinc-400">
                        {count} new message{count > 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
