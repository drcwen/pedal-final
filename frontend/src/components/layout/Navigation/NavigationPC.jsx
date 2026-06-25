import { useState, useEffect } from 'react';
import { IoMdCart } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import NavMobile from './NavMobile'
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase"
import ProfileClickOptions from "./ProfileClickOptions"

function NavigationPC() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  const [user, setUser] = useState(null);

  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const [firstName, setFirstName] = useState("");

  const navigate = useNavigate();

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  //Supabase
  useEffect(() => {

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)

      const firstName = data.user.user_metadata.name.split(" ")[0];
      setFirstName(firstName)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const navDesign =
    'font-akagi text-lg font-bold text-white text-shadow-lg hover:text-yellow transition-all duration-300 hover:scale-105 cursor-pointer';

  return (
    <>

      <div
        className={`w-full fixed top-0 left-0 z-50 transition-colors duration-300 ${
          scrolled ? 'bg-darkblue' : 'bg-transparent'
        }`}
      >
        <div className='md:px-30 md:py-5 px-10 py-5 flex justify-between flex-row items-center'>
          <div className='lg:flex hidden'>
            <h1 onClick={() => navigate("/")}
              className='font-akagi text-2xl cursor-pointer font-black tracking-wide text-white text-shadow-lg hover:text-yellow transition-all duration-300 hover:scale-110'>
              3JRemy
            </h1>
          </div>

          {/*Mobile Menu Button*/}
            <div className='lg:hidden flex'>
              <button onClick={() => setMenu(prev => !prev)}
                className='text-3xl text-white'>
                  {menu ? <IoClose /> : <IoMenu />}
                </button>
            </div>

          <ul className='hidden lg:flex flex flex-row gap-15'>
            <li className={navDesign} onClick={() => navigate("/")}>Home</li>
            <li className={navDesign} onClick={() => navigate("/reserve")}>Reserve</li>
            <li className={navDesign} onClick={() => navigate("/transactions")}>Transactions</li>
            <li className={navDesign} onClick={() => navigate("/")}>Reviews</li>
          </ul>

          <div className='flex flex-row gap-8'>
            <IoMdCart 
              className='text-white text-xl text-shadow-lg hover:text-yellow transition-all cursor-pointer duration-300 hover:scale-110' 
              onClick={() => navigate("/cart")}
              />

            
            { user ? (
              <div onClick={() => setShowProfileOptions(prev => !prev)}
              className='cursor-pointer'>

                <h1 className='text-white font-akagi font-bold hover:text-yellow transition-all'>
                  {user.user_metadata.first_name || "Profile"}
                </h1>

                
              </div>
            ): (
              <FaUserAlt onClick={() => navigate("/login")}
              className='text-white text-lg text-shadow-lg hover:text-yellow transition-all cursor-pointer duration-300 hover:scale-110'/>
            )}
            
          </div>

          {showProfileOptions  && (
            <ProfileClickOptions 
              myUser={user.user_metadata.first_name || "Profile"}
            />
          )}
        </div>

        <div
          className={`w-full h-2 transition-all duration-300 
            ${scrolled ? 'bg-blue opacity-100' : 'bg-transparent opacity-0'}`}
        ></div>

        

      </div>

      <div
        className={`fixed top-24 left-0 z-[999] w-full transform transition-transform duration-300
          ${menu ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        <NavMobile />
      </div>
    </>
    
  );
}

export default NavigationPC;