import {useState,useRef} from "react"
import  {MessageSquareMore,User,Loader2 ,Mail, LockKeyhole,Eye,EyeOff} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore';
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import {toast} from "react-hot-toast"
import { useThemeStore } from "../store/useThemeStore.js"

function SignupPage() {
    const {theme}=useThemeStore();
    
    const {signup,isSigningup} = useAuthStore();
    const [showPwd,setShowPwd]=useState(false);
    const passwordRef=useRef(null);

    const [formData,setFormData] = useState({
        firstName:"",
        email:"",
        password:""
    })

    const validateForm = ()=>{

        if(!formData.fullName.trim()) return toast.error("Full name is required");
        if(!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if(formData.password.length>0 && formData.password.length<6) return toast.error("Password must be more than 6 character")
        if(!formData.password.trim()) return toast.error("Password is required")

        return true
    }

    

    const handleSubmit= (e)=>{
        e.preventDefault();

        const success = validateForm()
        if(success===true) signup(formData)
    
    }



    
    return ( 
        <div data-theme={theme} className="min-h-screen grid grid-cols-1 lg:grid-cols-2 ">
            <div className="flex flex-col justify-center items-center gap-2 px-4 py-8 sm:px-8">
                <div className="h-10 w-10 flex justify-center items-center ">
                    <MessageSquareMore className='size-10  opacity-50   transition-transform duration-300 hover:scale-125'/>
                </div>
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-center">Get started with your free account</p>

                <form onSubmit={handleSubmit} className='flex flex-col gap-2 w-full max-w-sm'>
                    <div className="relative">
                        <User className='absolute top-2.5 left-3 text-[#71717B]'/>
                        <input
                            type="text"
                            className='w-full h-10 p-4 pl-10 border-2 rounded-md bg-transparent text-white'
                            name='fullName'
                            placeholder='John Doe'
                            onChange={(e)=>setFormData({...formData,fullName:e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <Mail className='absolute top-2.5 left-3 text-[#71717B]'/>
                        <input
                            type="email"
                            className='w-full h-10 p-4 pl-10 border-2 rounded-md bg-transparent '
                            name='email'
                            placeholder='you@explain.com'
                            onChange={(e)=>setFormData({...formData,email:e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <LockKeyhole className='absolute top-2.5 left-3 text-[#71717B]'/>
                        <input
                            type={showPwd ? "text" :"password"}
                            className='w-full h-10 p-4 pl-10 border-2  rounded-md bg-transparent '
                            name='password'
                            placeholder='* * * * * * *'
                            ref={passwordRef}
                            onChange={(e)=>setFormData({...formData,password:e.target.value})}
                        />
                        {(formData.password.length > 0) && (
                            showPwd
                            ? <Eye className="relative left-85 bottom-8 text-[#71717B] cursor-pointer" onClick={()=>setShowPwd(false)}/>
                            : <EyeOff className="relative left-85 bottom-8 text-[#71717B] cursor-pointer" onClick={()=>setShowPwd(true)}/>
                        )}
                    </div>
                    <button type="submit" className="btn bg-[#FF9900] text-black border-[#e17d00] mt-5 w-full rounded-md">
                        {isSigningup ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>Loading...
                            </>
                        ) : "Create Account"}
                    </button>
                </form>
                <p className='text-[#71717B] text-center mt-2'>
                    Already have an account? <a href="/login" className='underline text-white'>SignIn</a>
                </p>
            </div>
                <AuthImagePattern
                    title={"Join our community"}
                    subtitle={"Connect with friends, share moments, and stay in touch with your loved ones"}
                />
            
        </div>
    );
}

export default SignupPage;