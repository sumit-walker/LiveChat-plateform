import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore.js";
import {THEMES} from "../constants/index.js";
import {Send} from "lucide-react";
// import {Sent} from "lucide-react";

// const PREVIEW_MESSAGES=[
//   {id:1,content:"Hey! How's it going?",isSent:false},
//   {id:2,content:"I'm doing great! Just working on some new feature.",isSent:true},
// ]

function SettingPage() {
	const {theme,setTheme}=useThemeStore();
	const {authUser} =useAuthStore();

		return (
			<div className="max-h-full container mx-auto px-4 pt-20 max-w-5xl">
				<div>
					<h2 className="text-lg font-semibold">Theme</h2>
					<p className="text-sm text-base-content">Choose the theme for your interface</p>
				</div>
				<div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
					{THEMES.map((t)=>(
						<button key={t}
						className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors
							${theme===t ? "bg-base-200": "hover:bg-base-200/50"}`}
						onClick={()=>setTheme(t)}
						>
							<div className=" relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
								<div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
									<div className="rounded bg-primary"></div>
									<div className="rounded bg-secondary"></div>
									<div className="rounded bg-accent"></div>
									<div className="rounded bg-neutral"></div>
								</div>
							</div>
							<span className="text-[11px] font-medium truncate w-full text-center">
								{t.charAt(0).toUpperCase()+t.slice(1)}
							</span>
						</button>
					))}
				</div>
				<div className="mt-5 flex flex-col gap-5">
					<h2 className="text-2xl font-semibold">Preview</h2>
					<div className="h-100 w-full max-w-3xl  border border-base-100 rounded-2xl   flex flex-col  justify-end gap-0.5">
						<div className="h-20 w-full sm:max-w-xl  border-2 border-base-300 rounded-t-xl ml-0 sm:ml-25 flex items-center gap-5 ">
							<div className="h-10 w-10 border-2    rounded-full ml-5 flex justify-center items-center bg-primary/40"><h2 className="text-3xl font-normal ">J</h2></div>
							<div className="flex flex-col">
								<span className="text-xl font-semibold">{authUser?.fullName ||"John Doe"}</span>
								<span>Online</span>
							</div>
						</div>
						<div className="h-50 w-full sm:max-w-xl border-2 border-base-300  ml-0 sm:ml-25 flex flex-col p-4">
						 <div className="chat-start">
							 <div className="h-auto w-auto p-3 rounded-2xl chat-bubble bg-base-300 self-start flex flex-col justify-start">
								<span>Hey! How's it going</span>
								<span className="text-[12px] opacity-50">1:00 Am</span>
							</div>
						 </div>
							<div className="chat-end">
								<div  className="h-auto p-3 w-auto rounded-2xl chat-bubble bg-primary/70 self-end flex flex-col justify-start">
								<span>I am good! just working on new project</span>
								<span className="text-[12px] opacity-50">1:05 Am</span>

							</div>
							</div>
						</div>
						<div className="h-20 w-full sm:max-w-xl border-2  border-base-300  rounded-b-xl ml-0 sm:ml-25 mb-2 flex flex-row justify-center items-center gap-3">
							<div className="h-10 w-full sm:w-96 min border-2 rounded-l-3xl rounded-r-3xl flex justify-start items-center "> <span className="ml-5 truncate">This is a preview</span></div>
							<div className="h-10 w-15 border-2 rounded-l-3xl rounded-r-3xl flex justify-center items-center bg-primary/70 shrink-0"> <Send/></div>
						</div>
					</div>
				</div>
			</div>

		);
}

export default SettingPage;