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

function NavigationPC() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  const [user, setUser] = useState(null);

  const [showProfileOptions, setShowProfileOptions] = useState(false);

  const [firstName, setFirstName] = useState("");

  const [notificationCount, setNotificationCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

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

  useEffect(() => {
      if (!user?.id) {
          setNotificationCount(0);
          setCartCount(0);
          return;
      }

      const fetchCounts = async () => {
          // Count unread notifications
          const { count: notifications, error: notificationError } =
              await supabase
                  .from("notifications_mod")
                  .select("id", { count: "exact", head: true })
                  .eq("recipient_id", user.id)
                  .eq("is_read", false);

          if (notificationError) {
              console.error("Notification count error:", notificationError);
          } else {
              setNotificationCount(notifications || 0);
          }

          // Count cart items
          const { count: cart, error: cartError } = await supabase
              .from("orders_mod")
              .select("id", { count: "exact", head: true })
              .eq("user_id", user.id)
              .is("transaction_id", null);

          if (cartError) {
              console.error("Cart count error:", cartError);
          } else {
              setCartCount(cart || 0);
          }
      };

      fetchCounts();

      // Listen for notification and cart changes
      const channel = supabase
          .channel(`customer-navigation-${user.id}`)

          .on(
              "postgres_changes",
              {
                  event: "*",
                  schema: "public",
                  table: "notifications_mod",
                  filter: `recipient_id=eq.${user.id}`,
              },
              () => {
                  fetchCounts();
              }
          )

          .on(
              "postgres_changes",
              {
                  event: "*",
                  schema: "public",
                  table: "orders_mod",
                  filter: `user_id=eq.${user.id}`,
              },
              () => {
                  fetchCounts();
              }
          )

          .subscribe();

      return () => {
          supabase.removeChannel(channel);
      };
  }, [user?.id]);

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
            <li className={navDesign} onClick={() => navigate("/reviews")}>Reviews</li>
          </ul>

          <div className='flex flex-row gap-8'>

            {/* Notifications */}
            <div className="relative">
                <HiMiniBellAlert
                    onClick={() => navigate("/notifications")}
                    className="text-white text-xl text-shadow-lg hover:text-yellow transition-all cursor-pointer duration-300 hover:scale-110"
                />

                {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold font-akagi">
                        {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                )}
            </div>

            {/* Cart */}
            <div className="relative">
                <IoMdCart
                    className="text-white text-xl text-shadow-lg hover:text-yellow transition-all cursor-pointer duration-300 hover:scale-110"
                    onClick={() => navigate("/cart")}
                />

                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-yellow text-red-500 text-[10px] font-bold font-akagi">
                        {cartCount > 99 ? "99+" : cartCount}
                    </span>
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
          className={`w-full h-2 transition-all duration-300 
            ${scrolled ? 'bg-blue opacity-100' : 'bg-transparent opacity-0'}`}
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

export default NavigationPC;