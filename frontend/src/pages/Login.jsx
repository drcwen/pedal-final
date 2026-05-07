import Navigation from "../components/layout/Navigation/NavigationPC"
import LoginSection from "../components/sections/LoginSection"

function Login() {

  return (
    <>

        <div className='min-w-full min-h-screen md:py-25 md:px-30 py-27 px-10 bg-[url(https://res.cloudinary.com/dp3vkgxtb/image/upload/v1777011902/mobile_bg_zwq1cf.png)] md:bg-[url(https://res.cloudinary.com/dp3vkgxtb/image/upload/v1777011902/hero_background_z70zpi.png)] bg-center bg-cover bg-no-repeat md:py-25 md:px-30 flex flex-col'>

            <Navigation />
            <LoginSection />

            
        </div>
      
    </>
  )
}

export default Login
