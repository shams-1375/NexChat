import { Navigate, Route, Routes } from "react-router"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import ChatPage from "./pages/ChatPage"
import Onboarding from "./pages/Onboarding"
import Notifications from "./pages/Notifications"
import CallPage from "./pages/CallPage.jsx"
import { Toaster } from "react-hot-toast"
import PageLoader from "./components/PageLoader.jsx"
import useAuthUser from "./hooks/useAuthUser.js"
import Layout from "./components/Layout.jsx"
import { useThemeStore } from "./store/useThemeStore.js"

const App = () => {

  const { isLoading, authUser } = useAuthUser()
  const { theme } = useThemeStore()

  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  if (isLoading) return <PageLoader />

  return (
    <div data-theme={theme} >
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}><Home /></Layout>) : (<Navigate to={isAuthenticated ? "/login" : "/onboarding"} />)} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />} />
        <Route path="/chat/:id" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={false}><ChatPage /></Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)} />
        <Route path="/onboarding" element={isAuthenticated ? (!isOnboarded ? (<Onboarding />) : (<Navigate to="/" />)) : (<Navigate to="/login" />)} />
        <Route path="/notifications" element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}><Notifications /></Layout>) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)} />
        <Route path="/call/:id" element={isAuthenticated && isOnboarded ? (<CallPage />) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
