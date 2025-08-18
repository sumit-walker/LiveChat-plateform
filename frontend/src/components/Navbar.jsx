import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { MessageSquareMore, Settings, Users, LogOut, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {useThemeStore} from "../store/useThemeStore.js"
export default function Navbar() {
    const { logout, authUser } = useAuthStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const {theme}=useThemeStore();
    return (
        <header data-theme={theme} className="w-full bg-base-100 fixed top-0 flex justify-between items-center gap-2 pr-5 z-10">
            <Link to="/" className=" flex items-center gap-2">
                <div className="h-12 w-12 rounded-md ml-5 mt-2 bg-primary/10 flex justify-center items-center opacity-100 hover:opacity-100">
                    <MessageSquareMore className='size-8' />
                </div>
                <h1 className='text-2xl font-bold opacity-80 hover:opacity-100'>TalkDesk</h1>
            </Link>

            {/* Desktop links */}
            <div className="hidden sm:flex gap-5">
                <Link to="/setting" className="flex items-center gap-2">
                    <Settings className="opacity-50 transition-transform duration-300 hover:scale-125 hover:opacity-100 hover:rotate-90" />
                    <p>Settings</p>
                </Link>
                {authUser && (
                    <>
                        <Link to="/profile" className="flex items-center gap-2">
                            <Users className="opacity-50 hover:opacity-100" />
                            <span>Profile</span>
                        </Link>
                        <Link to="/login" className="flex items-center gap-2" onClick={logout}>
                            <LogOut className="opacity-50 hover:opacity-100" />
                            <span>Logout</span>
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile menu icon */}
            <div className="sm:hidden relative ">
                <button
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="p-2 focus:outline-none"
                    aria-label="Open menu"
                >
                    <Menu className="size-7 text-white" />
                </button>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-base-100  rounded-md shadow-lg flex flex-col z-20">
                        <Link
                            to="/setting"
                            className="flex items-center gap-2 px-4 py-2 "
                            onClick={() => setMenuOpen(false)}
                        >
                            <Settings className="hover:opacity-100" />
                            <span>Settings</span>
                        </Link>
                        {authUser && (
                            <>
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#3a2732]"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Users className="opacity-50" />
                                    <span>Profile</span>
                                </Link>
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-[#3a2732]"
                                    onClick={() => {
                                        logout();
                                        setMenuOpen(false);
                                    }}
                                >
                                    <LogOut className="opacity-50" />
                                    <span>Logout</span>
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}