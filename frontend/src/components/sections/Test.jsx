import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"

function Test() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      try {
        // 1. Get session (token)
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          console.log("No session found")
          setLoading(false)
          return
        }

        // 2. Call backend
        const response = await fetch("http://localhost:4000/profile", {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        })

        // 3. Convert response to JSON
        const data = await response.json()

        console.log("Backend response:", data)

        // 4. Save user to state
        setUser(data.user)

      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <h1>Profile</h1>

      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
        </div>
      ) : (
        <p>No user found</p>
      )}
    </div>
  )
}

export default Test