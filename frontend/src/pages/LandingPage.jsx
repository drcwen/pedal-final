
import Hero from "../components/sections/HeroSection"
import Navigation from "../components/layout/Navigation/NavigationPC"
import LandingBikes from "../components/sections/LandingBikes"
import GallerySection from "../components/sections/GallerySection"

import { useEffect, useState } from "react"
import Lenis from "lenis";

function LandingPage() {

  useEffect(() => {
        const lenis = new Lenis({
        duration: 0.8,
        smooth: true,
        });

        function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);
  
  return (
    <>
        <div className='w-full'>
            <Navigation />
            <Hero />
            <LandingBikes />
            <GallerySection/>

        </div>
        

    </>
  )
}

export default LandingPage
