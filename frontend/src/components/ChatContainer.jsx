import {useEffect,useRef} from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import {formatMessageTime} from "../lib/utils.js"
function ChatContainer() {
    const {messages,getMessages, isMessagesLoading,selectedUser,subscribeTOMessages,unsubscribeTOMessages}=useChatStore();
    const {authUser} = useAuthStore();
    const messageEndRef=useRef(null);

    useEffect(()=>{
        getMessages(selectedUser._id);
        subscribeTOMessages();

        return ()=>unsubscribeTOMessages();
    },[selectedUser._id,getMessages,subscribeTOMessages,unsubscribeTOMessages])

    
    useEffect(()=>{
        if(messageEndRef.current && messages){
            messageEndRef.current.scrollIntoView({behavior:"smooth"});
        }
    },[messages])

    if(isMessagesLoading){
        return(
           <div className=" h-full w-full flex flex-col ">
                <ChatHeader/>
                <MessageSkeleton/>
                <MessageInput/>
            </div>
        )
    }

    return ( 
        <div className={` h-full w-full ${selectedUser?"block lg:block":"hidden lg:block"}`}>
            <div className=" h-full w-full flex flex-col overflow-auto ">
                <ChatHeader/>
                <div className="h-full overflow-y-auto p-4 ">
                    {messages.map((msg)=>(
                        <div key={msg._id}
                        className={`chat ${msg.senderId==authUser._id?"chat-end":"chat-start"}`}
                        ref={messageEndRef}
                        >
                            <div className="chat-image avatar">
                                <div className="size-10 rounded-full border">
                                    <img src={msg.senderId==authUser._id? authUser.profilePic || "/avatar.png":selectedUser.profilePic||"/avatar.png"} alt="profile pic" />
                                </div>
                            </div>
                            <div className="bg-base-100 chat-bubble">
                                {msg.image && (
                                    <img src={msg.image} alt="senderImg"  className="sm:max-w-[200px] rounded-md mb-2"/>
                                )}
                                {msg.text && <p>{msg.text}</p>}
                                <div className="chat-header mb-1 flex justify-end">
                                    <time  className="text-xs opacity-50">{formatMessageTime(msg.createdAt)}</time>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <MessageInput/>
            </div>
        </div>
     );
}

export default ChatContainer;