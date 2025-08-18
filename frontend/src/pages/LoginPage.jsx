import {useState} from "react"
import  {MessageSquareMore,Mail,Loader2 , LockKeyhole,Eye,EyeOff} from 'lucide-react'
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import {toast} from "react-hot-toast"
import { useThemeStore } from "../store/useThemeStore.js";
function LoginPage() {
    const {theme} =useAuthStore();
    const [showPwd,setShowPwd]=useState(false);
    const [formData,setFormData] = useState({
        email:"",
        password:""
    })

    const {login,isLoggingIn}=useAuthStore();

    

    const handleSubmit= (e)=>{
        e.preventDefault();
        login(formData);
    
    }

    return ( 
        <div data-theme={theme} className="min-h-screen grid grid-cols-1 lg:grid-cols-2 ">
            <div className="flex flex-col justify-center items-center gap-2 px-4 py-8 sm:px-8">
                <div className="h-10 w-10 flex justify-center items-center">
                    <MessageSquareMore className='size-10  opacity-50 hover:opacity-100'/>
                </div>
                <h1 className="text-2xl font-bold">Welcome Back</h1>
                <p className="text-center">Sign in to your account</p>

                <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-full max-w-sm'>
                    <div>
                        <Mail className='relative top-8 left-2 '/>
                        <input
                            type="email"
                            className='w-full h-10 p-4 pl-10 border-2  rounded-md bg-transparent '
                            name='email'
                            placeholder='you@explain.com'
                            onChange={(e)=>setFormData({...formData,email:e.target.value})}
                        />
                    </div>
                    <div>
                        <LockKeyhole className='relative top-8 left-2 text-[#71717B]'/>
                        <input
                            type={showPwd ? "text" :"password"}
                            className='w-full h-10 p-4 pl-10 border-2  rounded-md bg-transparent'
                            name='password'
                            placeholder='* * * * * * *'
                            onChange={(e)=>setFormData({...formData,password:e.target.value})}
                        />
                        {(formData.password.length > 0) && (
                            showPwd
                            ? <Eye className="relative left-72 bottom-5 transform -translate-y-1/2 text-[#71717B] cursor-pointer" onClick={()=>setShowPwd(false)}/>
                            : <EyeOff className="relative left-72 bottom-5 transform -translate-y-1/2 text-[#71717B] cursor-pointer" onClick={()=>setShowPwd(true)}/>
                        )}
                    </div>
                    <button type="submit" className="btn bg-[#FF9900] text-black border-[#e17d00] mt-5 w-full rounded-md">
                        {isLoggingIn ? (
                            <><span className="loading loading-spinner loading-sm"></span>Loading...</>
                        ) : "Sign in"}
                    </button>
                </form>
                <p className='text-[#71717B] text-center mt-2'>
                    Don't have an account? <a href="/signup" className='underline'>Create account</a>
                </p>
            </div>
            <AuthImagePattern
                title={"Welcome"}
                subtitle={"Sign in to continue your conversations and catch up with your message"}
            />
            
        </div>
    );
}

export default LoginPage;