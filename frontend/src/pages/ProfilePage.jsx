import {useEffect,useState} from "react";
import {User,Mail,Pencil,Camera} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
function ProfilePage() {
    const { authUser, isUpdatingProfile, updateProfile,updateBio } = useAuthStore();
    const[selectedImg,setSelectedImg]=useState(null);
    const[write,setWrite]= useState(false);
    const[bio,setBio] = useState("");
    const [hoverBtn,setHoverBtn]=useState(false);

    const clickBio=()=>{
        setWrite(true);
    }
    

    const handleImageUpload =async(e)=>{
        e.preventDefault();// Prevent the default form submission behavior.

        const file = e.target.files[0];// Get the first file selected by the user (e.g., from an <input type="file" />).
        if(!file) return;

        const reader=new FileReader();// Create a new FileReader instance — this lets you read files as Base64, text, etc.
        reader.readAsDataURL(file);// Read the selected file and convert it to a Base64 data URL 
        reader.onload=async()=>{
            const base64Image =reader.result;// Get the converted Base64 image from the reader.
            setSelectedImg(base64Image);//Save the image to local state
        
            await updateProfile({profilePic:base64Image});//Send the image to your backend or serve
          }

        
      }

      const handleBio=async()=>{
        if(bio.length>120){
          toast.error("Bio is to long");
          return;
        }
        console.log(bio)
        await updateBio({bio})
        setWrite(false);
      }

      
      

    
  return (
    <div className="flex flex-col justify-center  mt-8 items-center min-h-screen bg-base-100 gap-10 ">
        <div className="w-full sm:w-120 sm:h-140 max-w-xl rounded-lg bg-base-300 p-5 flex flex-col justify-between"> 
            <div className=" flex flex-col items-center gap-3">
                <h1 className="text-2xl  font-bold">Profile</h1>
                <h2>Your frofile information</h2>
            </div>
             <div className="flex flex-col items-center gap-4">
                <div className="relative">
                <img
                    src={selectedImg || authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-32 rounded-full object-cover border-4 "
                />
                <label
                    htmlFor="avatar-upload"
                    className={`
                    absolute bottom-0 right-0 
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                     ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                    `}
                >
                    <Camera className="w-5 h-5 text-base-200" />
                    <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e)=>handleImageUpload(e)}
                    disabled={isUpdatingProfile}
                    />
                </label>
                </div>
                <p className="text-sm text-zinc-400">
                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                </p>
            </div>
            

            <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-normal text-[#71717B]">About</h1>
                        <p className={write?"hidden":"ml-5 mt-1"}>{bio||authUser.bio}</p>
                    </div>
                    <Pencil onClick={clickBio} className={write? "hidden":""}/>
                    
                </div>
                <div className="flex items-center">
                    <input type="text"  onChange={(el)=>setBio(el.target.value)} className={write?"h-10 w-full border-2 border-[#2f1f20] bg-[#3c3c3c]  ":"hidden"}/>
                    <button type="submit" onMouseEnter={()=>setHoverBtn(true)} onMouseLeave={()=>setHoverBtn(false)} className={!write?"hidden":"btn bg-[#170c16]"} onClick={handleBio}>{hoverBtn?"Done":bio.length+"/120"}</button>
                </div>
                    
                <div>
                    
                    <span className="flex  gap-2 text-[#71717B]"><User/>Full Name</span>
                    <input type="text"  value={authUser?.fullName} className="w-full h-10 p-4 border-2 border-base-100 rounded-md bg-transparent text-white" />  
                </div>
                <div>
                    
                    <span className="flex  gap-2 text-[#71717B]"><Mail/>Full Name</span>
                    <input type="text"  value={authUser?.email} className="w-full h-10 p-4 border-2 border-base-100 rounded-md bg-transparent text-white" />  
                </div>
            </div>
        </div>
        <div className="w-full sm:w-120 sm:h-34 max-w-xl rounded-lg  bg-base-300 p-3"> 
            <h1 className="text-2xl font-normal">Account Information</h1>
            <div className="p-4 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>Member since</span>
                  <span>{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <hr  className="text-[#71717B]"/>
                <div className="flex justify-between">
                  <span>Account status</span>
                  <span className="text-green-400">{authUser?"Active":"Not-Active"}</span>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ProfilePage;