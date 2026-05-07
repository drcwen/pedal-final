import { fadeScale } from "../../animations/fadeScale"
import {buttonClickBounce} from "../../animations/buttonClickBounce"
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
import { fadeBack } from "../../animations/fadeBack"
import TextField from "../../components/ui/TextField"
import { useState } from "react";
import axios from "axios";
import { FaFacebookF } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";

function LoginSection() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:4000/users/login', {
                username,
                password
            });
            if(res.data.accessToken) {
                localStorage.setItem("token", res.data.accessToken);
                navigate("/");
            }
        } catch(err) {
            const message = err.response?.data?.message || err.message;
            console.log(message);
            alert(message);
        }
    }

  return (

    <div className='flex flex-col lg:flex lg:flex-col lg:grid lg:grid-cols-2 lg:gap-10 gap-10 lg:flex-1'>

        <motion.div
            initial={fadeScale.initial}
            animate={fadeScale.animate}
            transition={fadeScale.transition}
        >

            {/*3Jremy Title*/}
            <div className='lg:flex lg:h-full lg:items-center lg:justify-center'>
                <h1 className='lg:text-6xl lg:text-2xl text-3xl font-akagi text-center leading-tight font-black 
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
                <div className='bg-white md:rounded-3xl md:px-20 px-5 py-10 rounded-xl md:py-20 flex flex-col gap-10 md:gap-10'>

                    <div className='items-center text-center flex flex-col gap-10'>

                        <h1 className='md:text-5xl text-3xl font-bold tracking-wide text-darkblue'>LOGIN</h1>

                        <div className='flex flex-row gap-5 items-center justify-center'>

                                    {/*Facebook*/}
                                    <motion.button
                                        whileHover={buttonClickBounce.whileHover}
                                        whileTap={buttonClickBounce.whileTap}
                                        onHoverStart={buttonClickBounce.onHoverStart}
                                        type="submit"
                                    >
                                        <div className='w-fit px-2 py-2 flex rounded-xl bg-blue w-60 duration-300 transition-all'>
                                            <FaFacebookF className='text-xl text-white '/>
                                        </div>
                                    </motion.button>

                                    {/*Google*/}

                                    <motion.button
                                        whileHover={buttonClickBounce.whileHover}
                                        whileTap={buttonClickBounce.whileTap}
                                        onHoverStart={buttonClickBounce.onHoverStart}
                                        type="submit"
                                    >
                                        <div className='w-fit px-2 py-2 flex rounded-xl bg-white border border-gray-400 w-60 duration-300 transition-all'>
                                            <FaGoogle className='text-xl text-red-400'/>
                                        </div>

                                    </motion.button>
                                </div>

                        <form onSubmit={handleSubmit}
                            className='flex flex-col gap-10 items-center'>
                                
                            <div className='flex flex-col gap-5'>
                                
                                {/*Username*/}
                                <TextField Type="text" 
                                            Placeholder="Username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}/>

                                {/*Password*/}
                                <TextField Type="password" 
                                            Placeholder="Password"
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
                                <div className='cursor-pointer hover:bg-navyblue transition-all duration-300 text-lg rounded-xl bg-blue w-fit px-6 py-2 font-akagi font-bold text-white'>Login</div>
                            </motion.button>
                        </form>

                    </div>

                    <div className='flex flex-col gap-1'>

                        {/*Forgot Password*/}
                        <h1 onClick={() => navigate("/forgotpassword")}
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
    </div>

  )

  }

export default LoginSection