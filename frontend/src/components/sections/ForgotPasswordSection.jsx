import {buttonClickBounce} from "../../animations/buttonClickBounce"
import { motion } from "motion/react"
import BackButton from "../ui/BackButton"
import { fadeBack } from "../../animations/fadeBack"
import CompanyLogo from "../../components/ui/CompanyLogo"
import TextField from "../../components/ui/TextField"
import { supabase } from "../../lib/supabase"
import { useState } from "react"
import { IoCloseSharp } from "react-icons/io5";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

function ForgotPasswordSection() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const [popup, setPopup] = useState({
        show: false,
        title: "",
        message: "",
        type: "error",
    });

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                console.log(error.message);

                setPopup({
                    show: true,
                    title: "Request Failed",
                    message: error.message,
                    type: "error",
                });
            } else {
                setPopup({
                    show: true,
                    title: "Check Your Email",
                    message: "If an account exists for this email, you may receive a password reset link. Please check your inbox.",
                    type: "success",
                });
            }
        } catch (error) {
            setPopup({
                show: true,
                title: "Something Went Wrong",
                message: "Unable to process your request. Please try again.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

  return (

    <div className='flex flex-col items-center justify-center lg:grid lg:grid-cols-2 lg:gap-10 gap-10 lg:flex-1 font-akagi'>

        <CompanyLogo />

        {/*Login Grid*/}
        <motion.div
            initial={fadeBack.initial}
            animate={fadeBack.animate}
            transition={fadeBack.transition}
        >
            <div className='md:h-full md:flex items-center justify-center'>
                <div className='relative bg-white md:rounded-3xl md:px-20 px-10 py-10 rounded-xl md:py-20 flex flex-col gap-10 md:gap-10'>

                    {/*Back Button*/}
                    <BackButton backRoute={"/login"}/>

                    <div className='flex flex-col gap-15'>
                        
                        <div className='flex flex-col gap-2'>
                            <h1 className='md:text-3xl text-2xl font-bold tracking-wide text-darkblue'>Find your account</h1>
                            <h1 className='md:text-xl text-md font-semibold tracking-wide text-gray'>Enter your email associated with <br className='hidden lg:flex'/> your account.</h1>
                        </div>

                        <form 
                        onSubmit={handleForgotPassword}
                        className='flex flex-col gap-10 items-center'>
                           
                           <TextField
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            {/*Next Button*/}
                            <motion.button
                                type="submit"
                                whileHover={!loading ? buttonClickBounce.whileHover : undefined}
                                whileTap={!loading ? buttonClickBounce.whileTap : undefined}
                                onHoverStart={!loading ? buttonClickBounce.onHoverStart : undefined}
                                disabled={loading}
                                className={`rounded-xl transition-all duration-300 ${
                                    loading
                                        ? "cursor-not-allowed bg-gray-400"
                                        : "cursor-pointer bg-blue hover:bg-navyblue"
                                }`}
                            >
                                <div className="flex items-center justify-center gap-3 px-6 py-2 text-lg font-akagi font-bold text-[#ffffff]">
                                    {loading && (
                                        <svg
                                            className="h-5 w-5 animate-spin"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                    )}

                                    <span>{loading ? "Sending..." : "Next"}</span>
                                </div>
                            </motion.button>
                        </form>

                    </div>

                   
                </div>
                
            </div>

        </motion.div>

        {/* Forgot Password Popup */}
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

export default ForgotPasswordSection