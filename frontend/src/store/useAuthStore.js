import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL=import.meta.env.MODE==="development"?"http://localhost:1000":"/";
export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    checkAuth:async()=>{
        try{
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data});

            get().connectSocket()
        }catch(error){
            console.log("Error in checkAuth:",error);
            set({authUser:null});
        } finally{
            set({isCheckingAuth:false})
        }
    },

    signup :async(data)=>{
        set({isSigningUp:true});
        try{
            const res=await axiosInstance.post("/auth/signup",data);
            toast.success("Account created succcessfully");
            set({authUser:res.data});
            get().connectSocket();
        }catch(error){
            toast.error(error.response?.data?.message || "Signup failed");
            console.log("Error in Signup: ",error);
        }finally{
            set({isSigningUp:false})
        }
    },

    login:async(data)=>{
        set({isLoggingIn:true});
        try{
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Account logged in successfully");

            get().connectSocket();
        }catch(error){
            toast.error(error.response?.data?.message || "Login failed");
            console.log("Error in login: ",error);
        }finally{
            set({isLoggingIn:false})
        }
    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try{
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            console.log(res.data);
            toast.success("Profile uploaded successfully");
        }catch(error){
             toast.error(error.response?.data?.message || "Profile update failed");
             console.log("Error in updateProfile: ",error);
        }finally{
            set({isUpdatingProfile:false});
        }
        
    },

    updateBio:async(data)=>{
        set({isUpdatingProfile:true});
        try{
            const res=await axiosInstance.put("/auth/update-bio",data);
            set({authUser:res.data});
            toast.success("Bio is entered")
        }catch(error){
            toast.error(error.response?.data?.message || "Bio update failed");
            console.log("Error in UpdateBio: ",error);
        }finally{
            set({isUpdatingProfile:false})
        }
    },
    
    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("logged Out successfully")

            get().disconnectSocket();
        }catch(error){
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },
    connectSocket:()=>{
        const {authUser}=get()
        if(!authUser || get().socket?.connected) return ;

        const socket=io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        })
        socket.connect();
        set({socket:socket});
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds});
        })
    },
   
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect()
    }
}))