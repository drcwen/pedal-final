import { Routes, Route, Navigate, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CreateAccount from "./pages/CreateAccount"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import LandingPage from "./pages/LandingPage"
import BikeExpand from "./components/layout/bikes/BikeExpand"
import Cart from "./pages/Cart"

import Reserve from "./pages/Reserve"

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isRecovery, setIsRecovery] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setLoading(false)

        // Detect password recovery flow
        if (event === "PASSWORD_RECOVERY") {
          setIsRecovery(true)
          navigate("/reset-password")
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [navigate])

  if (loading) return <h1>Loading...</h1>

  return (
    <Routes>
      {/* PASSWORD RECOVERY ROUTE */}
      {isRecovery && (
        <>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/reset-password" />} />
        </>
      )}

      {/* AUTH ROUTES (NOT LOGGED IN) */}
      {!session && !isRecovery && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" element={<LandingPage />} />
        </>
      )}

      {/* PROTECTED ROUTES (LOGGED IN) */}
      {session && !isRecovery && (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/reserve" element={<Reserve/>} />
          <Route path="/rent" element={<BikeExpand />} />
          <Route path="/cart" element={<Cart />} />
        </>
      )}
    </Routes>
  )
}

export default App