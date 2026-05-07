import { supabase } from "../lib/supabase"

function Dashboard() {

    const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.log(error.message)
    }
  }

  return (
    <>

        <div className='min-w-full min-h-screen md:py-25 md:px-30 py-27 px-10 bg-[url(https://res.cloudinary.com/dp3vkgxtb/image/upload/v1777011902/mobile_bg_zwq1cf.png)] md:bg-[url(https://res.cloudinary.com/dp3vkgxtb/image/upload/v1777011902/hero_background_z70zpi.png)] bg-center bg-cover bg-no-repeat md:py-25 md:px-30 flex flex-col'>

            <h1>Dashboard</h1>

            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded"
                >
                Logout
            </button>

            
        </div>
      
    </>
  )
}

export default Dashboard
