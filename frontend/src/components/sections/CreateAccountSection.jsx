import {buttonClickBounce} from "../../animations/buttonClickBounce"
import { motion } from "motion/react"
import BackButton from "../ui/BackButton"
import { fadeBack } from "../../animations/fadeBack"
import TextField from "../../components/ui/TextField"
import CompanyLogo from "../../components/ui/CompanyLogo"
import { useState } from "react";
import VerifyCode from "../ui/VerifyCode"
import axios from "axios";

function CreateAccountSection() {

    const [step, setStep] = useState(1);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordsMatch =
        confirmPassword.length > 0 && password === confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!passwordsMatch) {

            alert("Passwords do not match");
            return;
        } 

        try {
            const res = await axios.post("http://localhost:4000/users/check-existing",{ 
                email, 
                username 
            });

            if (res.data.success) {
                alert("Available username and email.");

                const sendRes = await axios.post("http://localhost:4000/auth/send-code", {
                    email
                })

                if (sendRes.data.success) {
                    alert("Code is sent to your email.");
                    setStep(2);
                }
            }

            } catch (err) {
                const message = err.response?.data?.message || err.message;
                console.log(message);
                alert(message);
            }
    }



  return (

    <div className='flex flex-col items-center justify-center lg:grid lg:grid-cols-2 lg:gap-10 gap-10 lg:flex-1'>

        <CompanyLogo />

        {step === 1 ? (
            <motion.div
                initial={fadeBack.initial}
                animate={fadeBack.animate}
                transition={fadeBack.transition}
            >
                <div className='md:h-full md:flex items-center justify-center'>

                    {/*Register Div*/}
                    <div className='relative bg-white md:rounded-3xl md:px-15 px-8 py-10 rounded-xl md:py-20 flex flex-col gap-10 md:gap-10'>

                        {/*Back Button*/}
                        <BackButton backRoute={"/login"}/>


                        <div className='flex flex-col gap-10'>
                            
                            <div className='flex flex-col gap-2 items-center justify-center'>
                                <h1 className='md:text-4xl text-2xl font-bold tracking-wide text-darkblue'>REGISTER</h1>
                            </div>

                            <form 
                                onSubmit={handleSubmit}
                                className='flex flex-col gap-10 items-center'>

                                <div className='flex flex-col gap-3'>
                            
                                    <div className='w-full flex lg:flex-row flex-col gap-3'>

                                        {/*First Name*/}
                                        <TextField Type="text" 
                                            Placeholder="First Name" 
                                            value={ firstName }
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />

                                        {/*Last Name*/}
                                        <TextField Type="text" 
                                            Placeholder="Last Name"
                                            value={ lastName }
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>

                                    {/*Email*/}
                                    <TextField Type="email" 
                                        Placeholder="Email"
                                        value={ email }
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                    {/*Username*/}
                                    <TextField Type="text" 
                                        Placeholder="Username"
                                        value={ username }
                                        onChange={(e) => setUsername(e.target.value)}
                                    />

                                    {/*Password*/}
                                    <TextField Type="password" 
                                        Placeholder="Password"
                                        value={ password }
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                    {/*Confirm Password*/}
                                    <TextField Type="password" 
                                        Placeholder="Confirm Password"
                                        value={ confirmPassword }
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />

                                    {confirmPassword.length > 0 && (
                                        <h1 className={`text-sm font-akagi font-bold ${
                                            passwordsMatch ? "text-[#6BB912]": "text-red-500"
                                        }`}
                                        >
                                            {passwordsMatch ? "Password match": "Password do not match"}
                                        </h1>
                                    )}
                                    
                                </div>

                                {/*Login Button*/}
                                <motion.button
                                    whileHover={buttonClickBounce.whileHover}
                                    whileTap={buttonClickBounce.whileTap}
                                    onHoverStart={buttonClickBounce.onHoverStart}
                                    type="submit"
                                >
                                    <div className='cursor-pointer hover:bg-navyblue transition-all duration-300 text-lg rounded-xl 
                                    bg-blue w-fit px-6 py-2 font-akagi font-bold text-white'>Next</div>

                                </motion.button>
                            </form>

                        </div>

                    
                    </div>
                    
                </div>

            </motion.div>

        ) : (

            <VerifyCode
                FirstName={firstName}
                LastName={lastName}
                Email={email}
                Username={username}
                Password={password}
            />

        )}
    </div>

  )

  }

export default CreateAccountSection