import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"
import {useEffect, useState} from "react"
import { supabase } from "../src/lib/supabase"
import Dashboard from './pages/Dashboard'
import CreateAccount from "./pages/CreateAccount"

function App() {

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false);
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false);
    })

    return () => subscription.unsubscribe()
    }, [])

    if (loading) return <h1>Loading...</h1>;

  return (
    <>
      <Routes>

      {!session ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
          {/*<Route path="/createaccount" element={<Navigate to="/createaccount" />} />*/}
          <Route path="/createaccount" element={<CreateAccount />} />
        </>
      ) : (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      )}

    </Routes>
    </>
  )
}

export default App