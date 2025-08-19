import {useRef,useState} from "react";
import { useChatStore } from "../store/useChatStore";
import {Send,Image,X} from "lucide-react"
import toast from "react-hot-toast";
function MessageInput() {
    const [text,setText]= useState("");
    const[imagePreview,setImagePreview]=useState(null);
    const [isImageSending, setIsImageSending] = useState(false);
    const fileInputRef=useRef(null);
    const {sendMessage}=useChatStore();
     
    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        if(!file.type.startsWith("image/")){
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend=()=>{
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const removeImage=()=>{
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value="";
    };

    const handleSendMessage=async(e)=>{
        e.preventDefault();
        if(!text.trim() && !imagePreview) return;

        setIsImageSending(true);
        toast.loading("Sending message...");
        try{
            await sendMessage({
                text:text.trim(),
                image:imagePreview,
            });

            //clear form

            setText("");
            setImagePreview(null);
            if(fileInputRef.current) fileInputRef.current.value="";
        }catch(error){
            console.error("Failed to send message:",error);
        }finally{
            setIsImageSending(false);
            toast.dismiss();
        }
    }
    return ( 
        <div className="w-full p-4">
             {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                <div className="relative bg-base-100 p-2">
                    <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-30 h-20 object-cover rounded-lg border border-zinc-700"
                    />
                    <button
                    onClick={removeImage}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-100
                    flex items-center justify-center"
                    type="button"
                    >
                    <X className="size-3" />
                    </button>
                </div>
                </div>
            )}
            <form onSubmit={handleSendMessage} className=" flex items-center gap-2">
                <input type="text" 
                placeholder="Type a message......." 
                className="w-full input input-accent rounded-lg input-sm sm:input-md"
                value={text} onChange={(e)=>setText(e.target.value)}/>

                <input type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageChange} />
                
                <button type="button" className="btn btn-lg btn-circle sm:flex" onClick={()=>fileInputRef.current?.click()}><Image/></button>

                <button type="submit" className="btn btn-lg btn-circle" disabled={!text.trim() && !imagePreview}>
                    {isImageSending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <Send className="size-5" />
                    )}
                </button>
            </form>            
        </div>
     );
}

export default MessageInput;