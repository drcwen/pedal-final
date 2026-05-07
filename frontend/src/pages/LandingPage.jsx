
import Hero from "../components/sections/HeroSection"
import Navigation from "../components/layout/Navigation/NavigationPC"
import { useState } from "react";
import LandingBikes from "../components/sections/LandingBikes"

function LandingPage() {
  
  return (
    <>
        <div className='w-full'>
            <Navigation />
            <Hero />
            <LandingBikes />


        </div>
        

    </>
  )
}

export default LandingPage
