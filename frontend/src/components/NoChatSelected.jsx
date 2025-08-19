import {MessageSquareMore} from "lucide-react"
function NoChatSelected() {
    return ( 
        <div className="w-full h-full hidden lg:block">
            <div className="w-full h-full flex flex-col items-center justify-center p-4  lg:p-16 bg-base-100/50">
                <div className="max-w-sm  text-center space-y-4 hidden lg:block">
                {/* Icon Display */}
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-xl  bg-primary/10 flex items-center justify-center animate-bounce">
                                <MessageSquareMore className="w-6 h-6  text-primary" />
                            </div>
                        </div>
                    </div>

                {/* Welcome Text */}
                    <h2 className="text-xl  lg:text-3xl font-bold">Welcome to TalkDesk!</h2>
                    <p className="text-sm text-base-content/60">
                        Select a conversation from the sidebar to start chatting
                    </p>
                </div>
            </div>
        </div>
     );
}

export default NoChatSelected;