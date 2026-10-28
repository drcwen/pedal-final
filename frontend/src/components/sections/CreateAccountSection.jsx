import { buttonClickBounce } from "../../animations/buttonClickBounce"
import { motion } from "motion/react"
import BackButton from "../ui/BackButton"
import { fadeBack } from "../../animations/fadeBack"
import TextField from "../../components/ui/TextField"
import CompanyLogo from "../../components/ui/CompanyLogo"
import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { IoCloseSharp } from "react-icons/io5";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

function CreateAccountSection() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [loading, setLoading] = useState(false);

    const [popup, setPopup] = useState({
        show: false,
        title: "",
        message: "",
        type: "error",
    });

    const passwordsMatch =
        confirmPassword.length > 0 && password === confirmPassword

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (password !== confirmPassword) {
            setPopup({
                show: true,
                title: "Password Mismatch",
                message: "Your passwords do not match. Please check and try again.",
                type: "error",
            });
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        username: username,
                    },
                },
            });

            if (error) {
                console.log(error.message);

                setPopup({
                    show: true,
                    title: "Registration Failed",
                    message: error.message,
                    type: "error",
                });
            } else {
                console.log(data);

                setPopup({
                    show: true,
                    title: "Account Created",
                    message: data.user && !data.session
                        ? "Your account has been created. Please check your email to verify your account before logging in."
                        : "Your account has been created successfully!",
                    type: "success",
                });
            }
        } catch (error) {
            console.error(error);

            setPopup({
                show: true,
                title: "Something Went Wrong",
                message: "We couldn't process your registration. Please try again.",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className='flex flex-col items-center justify-center lg:grid lg:grid-cols-2 lg:gap-10 gap-10 lg:flex-1'>

            <CompanyLogo />

            <motion.div
                initial={fadeBack.initial}
                animate={fadeBack.animate}
                transition={fadeBack.transition}
            >

                <div className='md:h-full md:flex items-center justify-center'>

                    {/* Register Div */}
                    <div className='relative bg-white md:rounded-3xl md:px-15 px-8 py-10 rounded-xl md:py-20 flex flex-col gap-10 md:gap-10'>

                        {/* Back Button */}
                        <BackButton backRoute={"/login"} />

                        <div className='flex flex-col gap-10'>

                            <div className='flex flex-col gap-2 items-center justify-center'>
                                <h1 className='md:text-4xl font-akagi text-2xl font-bold tracking-wide text-darkblue'>
                                    REGISTER
                                </h1>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className='flex flex-col gap-10 items-center'
                            >

                                <div className='flex flex-col gap-3'>

                                    <div className='w-full flex lg:flex-row flex-col gap-3'>

                                        {/* First Name */}
                                        <TextField
                                            type="text"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />

                                        {/* Last Name */}
                                        <TextField
                                            type="text"
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />

                                    </div>

                                    {/* Email */}
                                    <TextField
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    {/* Username */}
                                    <TextField
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />

                                    {/* Password */}
                                    <TextField
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    {/* Confirm Password */}
                                    <TextField
                                        type="password"
                                        placeholder="Confirm Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />

                                    {confirmPassword.length > 0 && (
                                        <h1
                                            className={`text-sm font-akagi font-bold ${
                                                passwordsMatch
                                                    ? "text-[#6BB912]"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {passwordsMatch
                                                ? "Passwords match"
                                                : "Passwords do not match"}
                                        </h1>
                                    )}

                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    whileHover={!loading ? buttonClickBounce.whileHover : undefined}
                                    whileTap={!loading ? buttonClickBounce.whileTap : undefined}
                                    onHoverStart={!loading ? buttonClickBounce.onHoverStart : undefined}
                                    type="submit"
                                    disabled={loading}
                                    className={`rounded-xl transition-all duration-300 ${
                                        loading
                                            ? "cursor-not-allowed bg-gray-400"
                                            : "cursor-pointer bg-blue hover:bg-navyblue"
                                    }`}
                                >
                                    <div className="flex items-center justify-center gap-3 px-6 py-2 text-lg font-akagi font-bold text-[#ffffff]">

                                        {/* Loading Spinner */}
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

                                        {/* Button Text */}
                                        <span>
                                            {loading ? "Creating Account..." : "Next"}
                                        </span>

                                    </div>
                                </motion.button>

                            </form>

                        </div>

                    </div>

                </div>

            </motion.div>

            {/* Registration Popup */}
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

export default CreateAccountSection