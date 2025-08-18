import {useChatStore } from "../store/useChatStore.js";
import NoChatSelected from "../components/NoChatSelected.jsx"
import ChatContainer from "../components/ChatContainer.jsx"
import Sidebar from "../components/Sidebar.jsx"
// import {UserRoundSearch} from "lucide-react"
function HomePage() {
    
    const {selectedUser}=useChatStore();
    
    return ( 
        <>
        <div className="h-screen bg-base-200 flex flex-col  lg:p-6">
            <div className="h-full w-full max-w-7xl bg-base-300 self-center   lg:mt-15 rounded-xl sm:rounded-2xl mt-17 overflow-hidden flex flex-col">
                <div className="h-full w-full flex flex-row ">
                  <Sidebar/>
                  { selectedUser ? <ChatContainer/>: <NoChatSelected  />}
                </div>
            </div>
        </div>
        </>
     );
}

export default HomePage;