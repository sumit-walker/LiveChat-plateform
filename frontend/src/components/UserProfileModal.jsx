import { X } from "lucide-react";

function UserProfileModal({ user, isOnline, onClose }) {
	if (!user) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />
			<div className="relative bg-base-200 rounded-xl shadow-xl w-11/12 max-w-sm p-5">
				<button
					onClick={onClose}
					className="absolute top-2 right-2 btn btn-ghost btn-xs"
					title="Close"
				>
					<X className="size-4" />
				</button>

				<div className="flex flex-col items-center text-center gap-3">
					<img
						src={user.profilePic || "/avatar.png"}
						alt={user.fullName}
						className="size-24 rounded-full object-cover border"
					/>
					<div>
						<div className="text-lg font-semibold">{user.fullName}</div>
						<div className="text-sm text-zinc-400">{user.email}</div>
						{user.bio && <div className="text-sm text-zinc-400">{user.bio}</div>}
					</div>
					<div>
						<span className={`px-2 py-0.5 rounded-full text-xs ${isOnline ? "bg-green-500/20 text-green-400" : "bg-zinc-500/20 text-zinc-300"}`}>
							{isOnline ? "Online" : "Offline"}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserProfileModal;


