import Navbar from "./components/Navbar.jsx"
import HomePage from './pages/HomePage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SettingPage from './pages/SettingPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import {Routes,Route, Navigate} from "react-router-dom"
import { useAuthStore } from "./store/useAuthStore.js"
import {Loader} from "lucide-react"
import {useEffect} from "react"
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore.js"
import SoundTest from "./components/SoundTest.jsx"
const App=()=> {

  const {authUser,checkAuth,isCheckingAuth,onlineUsers}= useAuthStore();
  const {theme}=useThemeStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth])


  if(isCheckingAuth && !authUser) return (
    <div className="flex justify-center items-center h-screen">
      <Loader className="size-10 animate-spin"/>
    </div>
  )
  return (
    <div  data-theme={theme} >
      <Navbar/>

      <Routes>
        <Route path="/" element={authUser? <HomePage/> : <Navigate to="/login"/> } />
        <Route path="/signup" element={!authUser ? <SignupPage/> : <Navigate to="/"/> } />
        <Route path="/login" element={!authUser? <LoginPage/> : <Navigate to="/"/>} />
        <Route path="/setting" element={<SettingPage/>} />
        <Route path="/profile" element={authUser? <ProfilePage/> : <Navigate to="/login"/>} />
      </Routes>
      <Toaster/>
      
      {/* Temporary Sound Test Component - Remove in production */}
      {authUser && <SoundTest />}
    </div>
  )
}

export default App
