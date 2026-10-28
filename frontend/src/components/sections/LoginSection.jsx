import { fadeScale } from "../../animations/fadeScale"
import {buttonClickBounce} from "../../animations/buttonClickBounce"
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
import { fadeBack } from "../../animations/fadeBack"
import TextField from "../../components/ui/TextField"
import { useState, useEffect } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { supabase } from "../../lib/supabase"
import { IoCloseSharp } from "react-icons/io5";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

function LoginSection() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [popup, setPopup] = useState({
        show: false,
        title: "",
        message: "",
        type: "error",
    });

    useEffect(() => {
        console.log("useEffect ran")

        const getToken = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            console.log("SESSION:", session)
        }

        getToken()
    }, [])

    const SignInWithGoogle = async () => {
        
        const {error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            option: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        })

        if(error) {
            console.log(error.message);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email: username,
            password: password,
        });

        if (error) {
            console.log(error.message);

            setPopup({
                show: true,
                title: "Login Failed",
                message: error.message,
                type: "error",
            });

            return;
        }

        console.log("Logged in", data);

        setPopup({
            show: true,
            title: "Login Successful",
            message: "You have successfully logged in.",
            type: "success",
        });

        // Navigate after successful login if needed.
        // navigate("/dashboard");
    };

  return (

    <div className='flex flex-col lg:flex lg:flex-col lg:grid lg:grid-cols-2 lg:gap-10 gap-10 lg:flex-1'>

        <motion.div
            initial={fadeScale.initial}
            animate={fadeScale.animate}
            transition={fadeScale.transition}
        >

            {/*3Jremy Title*/}
            <div className='lg:flex lg:h-full lg:items-center lg:justify-center'>
                <h1 className='lg:text-6xl text-3xl font-akagi text-center leading-tight font-black 
                text-yellow [text-shadow:2px_2px_8px_rgba(0,0,0,0.8)]'>3Jremy's <br/> Rent A Bike!</h1>
            </div>
        </motion.div>

    
        {/*Login Grid*/}
        <motion.div
            initial={fadeBack.initial}
            animate={fadeBack.animate}
            transition={fadeBack.transition}
        >
            <div className='md:h-full md:flex items-center justify-center'>
                <div className='bg-[#ffffff] md:rounded-3xl md:px-20 px-5 py-10 rounded-xl md:py-20 flex flex-col gap-10 md:gap-10'>

                    <div className='items-center text-center flex flex-col gap-10'>

                        <h1 className='md:text-5xl text-3xl font-black font-akagi tracking-wide text-darkblue'>LOGIN</h1>

                        <div className='flex flex-row gap-5 items-center justify-center'>

                                    {/*Facebook*/}
                                    <motion.button
                                        whileHover={buttonClickBounce.whileHover}
                                        whileTap={buttonClickBounce.whileTap}
                                        onHoverStart={buttonClickBounce.onHoverStart}
                                        type="submit"
                                    >
                                        <div className='w-fit px-2 py-2 flex rounded-xl bg-blue duration-300 transition-all'>
                                            <FaFacebookF className='text-xl text-[#ffffff] '/>
                                        </div>
                                    </motion.button>

                                    {/*Google*/}

                                    <motion.button
                                        whileHover={buttonClickBounce.whileHover}
                                        whileTap={buttonClickBounce.whileTap}
                                        onHoverStart={buttonClickBounce.onHoverStart}
                                        type="submit"
                                        onClick={SignInWithGoogle}
                                    >
                                        <div className='w-fit px-2 py-2 flex rounded-xl bg-[#ffffff] border border-gray-400 w-60 duration-300 transition-all'>
                                            <FaGoogle className='text-xl text-red-400'/>
                                        </div>

                                    </motion.button>
                                </div>

                        <form
                            onSubmit={handleSubmit}
                            className='flex flex-col gap-10 items-center'>
                                
                            <div className='flex flex-col gap-5'>
                                
                                {/*Username*/}
                                <TextField type="text" 
                                            className='focus:outline-none'
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}/>

                                {/*Password*/}
                                <TextField type="password" 
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}/>
                            </div>

                            {/*Login Button*/}
                            <motion.button
                                whileHover={buttonClickBounce.whileHover}
                                whileTap={buttonClickBounce.whileTap}
                                onHoverStart={buttonClickBounce.onHoverStart}
                                type="submit"
                            >
                                <div className='cursor-pointer hover:bg-navyblue transition-all duration-300 text-lg rounded-xl bg-blue w-fit px-6 py-2 font-akagi font-bold text-[#ffffff]'>Login</div>
                            </motion.button>
                        </form>

                    </div>

                    <div className='flex flex-col gap-1'>

                        {/*Forgot Password*/}
                        <h1 onClick={() => navigate("/forgot-password")}
                            className='md:text-lg text-sm font-akagi font-bold text-darkblue hover:text-navyblue hover:scale-101 
                            cursor-pointer duration-300 transition-all underline'>Forgot password?</h1>
                        
                        <div className='flex flex-row gap-2'>

                            {/*No account*/}
                            <h1 className='md:text-lg text-sm font-akagi font-semibold 
                            text-darkblue'>No account yet? </h1>

                            {/*Create account*/}
                            <h1 onClick={() => navigate("/createaccount")}
                                className='md:text-lg text-sm font-akagi font-bold text-darkblue hover:text-navyblue hover:scale-101 
                                cursor-pointer duration-300 transition-all underline'>Create account</h1>

                        </div>
                    </div>
                </div>
                
            </div>

        </motion.div>

        {/* Login Popup */}
            {popup.show && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-5">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative w-full max-w-md rounded-2xl bg-[#ffffff] p-8 shadow-2xl"
                    >
                        {/* Close Icon */}
                        <button
                            type="button"
                            onClick={() =>
                                setPopup((previous) => ({
                                    ...previous,
                                    show: false,
                                }))
                            }
                            className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-darkblue"
                        >
                            <IoCloseSharp className="text-2xl" />
                        </button>

                        {/* Popup Icon */}
                        <div className="mb-5 flex justify-center">
                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-full ${
                                    popup.type === "error"
                                        ? "bg-red-100 text-red-500"
                                        : "bg-green-100 text-green-500"
                                }`}
                            >
                                {popup.type === "error" ? (
                                    <FaExclamationCircle className="text-3xl" />
                                ) : (
                                    <FaCheckCircle className="text-3xl" />
                                )}
                            </div>
                        </div>

                        {/* Popup Message */}
                        <div className="mb-6 text-center">
                            <h2 className="mb-3 font-akagi text-2xl font-black text-darkblue">
                                {popup.title}
                            </h2>

                            <p className="break-words font-akagi text-base text-gray-600">
                                {popup.message}
                            </p>
                        </div>

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() =>
                                setPopup((previous) => ({
                                    ...previous,
                                    show: false,
                                }))
                            }
                            className="w-full rounded-xl bg-blue px-6 py-3 font-akagi font-bold text-[#ffffff] transition duration-300 hover:bg-navyblue"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
    </div>
    

  )

  }

export default LoginSection