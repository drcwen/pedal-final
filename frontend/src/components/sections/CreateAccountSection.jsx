import { buttonClickBounce } from "../../animations/buttonClickBounce"
import { motion } from "motion/react"
import BackButton from "../ui/BackButton"
import { fadeBack } from "../../animations/fadeBack"
import TextField from "../../components/ui/TextField"
import CompanyLogo from "../../components/ui/CompanyLogo"
import { useState } from "react"
import { supabase } from "../../lib/supabase"

function CreateAccountSection() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const passwordsMatch =
        confirmPassword.length > 0 && password === confirmPassword

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            alert("Passwords do not match")
            return
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    username: username
                }
            }
        })

        if (error) {
            console.log(error.message)
            alert(error.message)
        } else {
            console.log(data)
            alert("Account created successfully!")
        }
    }

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
                                <h1 className='md:text-4xl text-2xl font-bold tracking-wide text-darkblue'>
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
                                    whileHover={buttonClickBounce.whileHover}
                                    whileTap={buttonClickBounce.whileTap}
                                    onHoverStart={buttonClickBounce.onHoverStart}
                                    type="submit"
                                >

                                    <div
                                        className='cursor-pointer hover:bg-navyblue transition-all duration-300 text-lg rounded-xl 
                                        bg-blue w-fit px-6 py-2 font-akagi font-bold text-white'
                                    >
                                        Next
                                    </div>

                                </motion.button>

                            </form>

                        </div>

                    </div>

                </div>

            </motion.div>

        </div>

    )
}

export default CreateAccountSection