import { fadeScale } from "../../animations/fadeScale"
import {buttonClickBounce} from "../../animations/buttonClickBounce"
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
import { fadeBack } from "../../animations/fadeBack"
import TextField from "../../components/ui/TextField"
import { useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { supabase } from "../../lib/supabase"

function ResetPassword() {

    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [reEnterPassword, setReEnterPassword] = useState("");

    const handleUpdatePassword = async (e) => {
        e.preventDefault()

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            console.log(error.message)
            alert(error.message)
        } else {
            alert("Password updated successfully!")
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
                <div className='bg-white md:rounded-3xl md:px-20 px-5 py-10 rounded-xl md:py-20 flex flex-col gap-10 md:gap-10'>

                    <div className='items-center text-center flex flex-col gap-10'>

                        <h1 className='md:text2xl text-3xl font-bold tracking-wide text-darkblue'>RESET <br/>PASSWORD</h1>

                        <form
                            onSubmit={handleUpdatePassword}
                            className='flex flex-col gap-10 items-center'>
                                
                            <div className='flex flex-col gap-5'>
                                
                                {/*Username*/}
                                <TextField type="password" 
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}/>

                                {/*Password*/}
                                <TextField type="password" 
                                            placeholder="Re-Enter Password"
                                            value={reEnterPassword}
                                            onChange={(e) => setReEnterPassword(e.target.value)}/>
                            </div>

                            {/*Login Button*/}
                            <motion.button
                                whileHover={buttonClickBounce.whileHover}
                                whileTap={buttonClickBounce.whileTap}
                                onHoverStart={buttonClickBounce.onHoverStart}
                                type="submit"
                            >
                                <div className='cursor-pointer hover:bg-navyblue transition-all duration-300 text-lg rounded-xl bg-blue w-fit px-6 py-2 font-akagi font-bold text-white'>Continue</div>
                            </motion.button>
                        </form>

                    </div>
       
                </div>
                
            </div>

        </motion.div>
    </div>

  )

  }

export default ResetPassword