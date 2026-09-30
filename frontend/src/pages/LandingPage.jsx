
import Hero from "../components/sections/HeroSection"
import Navigation from "../components/layout/Navigation/NavigationPC"
import LandingBikes from "../components/sections/LandingBikes"
import GallerySection from "../components/sections/GallerySection"
import { useEffect, useState } from "react"
import Lenis from "lenis";


function LandingPage() {

  const galleryImages = [ 
    { id: 1, title: "Explore La Mesa", desc: "Enjoy a relaxing ride around the park.", url: "https://res.cloudinary.com/dp3vkgxtb/image/upload/v1790756750/gallery_05_num92f.jpg", span: "col-span-2 row-span-2", }, 
    { id: 2, title: "Ride Together", desc: "Make every ride memorable.", url: "https://res.cloudinary.com/dp3vkgxtb/image/upload/v1790756764/portrait_02_v0b1sh.jpg", span: "col-span-1 row-span-1", }, 
    { id: 3, title: "Your Perfect Ride", desc: "Choose the bike that fits your adventure.", url: "https://res.cloudinary.com/dp3vkgxtb/image/upload/v1790756765/potrait_05_nbl8vv.jpg", span: "col-span-1 row-span-1", }, 
    { id: 4, title: "Adventure Awaits", desc: "Discover more places by bike.", url: "https://res.cloudinary.com/dp3vkgxtb/image/upload/v1790756750/gallery_02_dk4hvq.jpg", span: "col-span-1 row-span-2", }, 
    { id: 5, title: "Fun With Friends", desc: "Bring your friends along.", url: "https://res.cloudinary.com/dp3vkgxtb/image/upload/v1790756764/portrait_01_mukqoq.jpg", span: "col-span-1 row-span-1", }, 
    { id: 6, title: "Ready To Ride", desc: "Book your bike today.", url: "https://res.cloudinary.com/dp3vkgxtb/image/upload/v1790756750/gallery_04_nazyge.jpg", span: "col-span-2 row-span-1", }, 
    
  ];


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
            <GallerySection 
              imageItems={galleryImages} 
              title="Gallery" 
              description="Explore the experience waiting for you at La Mesa Eco Park." 
            />

        </div>
        

    </>
  )
}

export default LandingPage
