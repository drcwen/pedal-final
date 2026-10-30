import { useState, useEffect } from 'react';
import { IoMdCart } from "react-icons/io";
import { FaUserAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import NavMobile from './NavMobile'
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase"
import ProfileClickOptions from "./ProfileClickOptions"
import { HiMiniBellAlert } from "react-icons/hi2";

function StaticNavigationPC() {

  const [menu, setMenu] = useState(false);

  const [user, setUser] = useState(null);

  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const navigate = useNavigate();

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    let isMounted = true;
    let requestId = 0;

    const fetchUserProfile = async (authUser) => {
        const currentRequest = ++requestId;

        if (!authUser) {
            setUser(null);
            setFirstName("");
            return;
        }

        setUser(authUser);
        setFirstName("");

        const { data, error } = await supabase
            .from("profiles_mod")
            .select("id, first_name")
            .eq("id", authUser.id)
            .single();

        if (!isMounted || currentRequest !== requestId) return;

        if (error) {
            console.error("Profile fetch error:", error);
            return;
        }

        console.log("Logged-in user ID:", authUser.id);
        console.log("Profile retrieved:", data);

        setFirstName(data.first_name || "");
    };

    // Get the currently logged-in user
    supabase.auth.getUser().then(({ data, error }) => {
        if (error) {
            console.error("Auth error:", error.message);
            return;
        }

        fetchUserProfile(data.user);
    });

    // Listen for login/logout events
    const {
        data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
        fetchUserProfile(session?.user ?? null);
    });

    return () => {
        isMounted = false;
        requestId++;
        subscription.unsubscribe();
    };
}, []);

  const navDesign =
    'font-akagi text-lg font-bold text-white text-shadow-lg hover:text-yellow transition-all duration-300 hover:scale-105 cursor-pointer';

  return (
    <>

      <div
        className={`w-full fixed top-0 left-0 z-50 transition-colors duration-300 bg-darkblue`}
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
            <li className={navDesign} onClick={() => navigate("/reviews")}>Reviews</li>
          </ul>

          <div className='flex flex-row gap-8'>

            {/* Notifications Bell */}
            <div
              onClick={() => navigate("/notifications")}
              className="relative cursor-pointer"
            >
              <HiMiniBellAlert className="text-white text-xl text-shadow-lg hover:text-yellow transition-all duration-300 hover:scale-110" />

              {unreadNotificationsCount > 0 && (
                <div className="absolute -top-2 -right-3 min-w-4 h-4 px-1 rounded-full bg-red-500 flex items-center justify-center font-akagi font-bold text-white text-xs">
                  {unreadNotificationsCount > 99
                    ? "99+"
                    : unreadNotificationsCount}
                </div>
              )}
            </div>

            {/* Shopping Cart */}
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              <IoMdCart className="text-white text-xl text-shadow-lg hover:text-yellow transition-all duration-300 hover:scale-110" />

              {cartItemsCount > 0 && (
                <div className="absolute -top-2 -right-3 min-w-4 h-4 px-1 rounded-full bg-yellow flex items-center justify-center font-akagi font-bold text-red-600 text-xs">
                  {cartItemsCount > 99
                    ? "99+"
                    : cartItemsCount}
                </div>
              )}
            </div>

            { user ? (
              <div onClick={() => setShowProfileOptions(prev => !prev)}
              className='cursor-pointer'>

                <h1 className='text-white font-akagi font-bold hover:text-yellow transition-all'>
                  {firstName || "Profile"}
                </h1>

                
              </div>
            ): (
              <FaUserAlt onClick={() => navigate("/login")}
              className='text-white text-lg text-shadow-lg hover:text-yellow transition-all cursor-pointer duration-300 hover:scale-110'/>
            )}
            
          </div>

          {showProfileOptions && (
              <ProfileClickOptions 
                  myUser={firstName || "Profile"}
              />
          )}
        </div>

        <div
          className={`w-full h-2 transition-all duration-300 bg-blue opacity-100`}
        ></div>

        

      </div>

      <div
        className={`fixed top-19 left-0 z-[999] w-full transform transition-transform duration-300
          ${menu ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}
      >
        <NavMobile />
      </div>
    </>
    
  );
}

export default StaticNavigationPC;