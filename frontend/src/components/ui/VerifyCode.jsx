import { fadeScale } from "../../animations/fadeScale"
import NumberField from "./NumberField"
import { motion } from "motion/react"
import {buttonClickBounce} from "../../animations/buttonClickBounce"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyCode({ FirstName, LastName, Username, Email, Password}) {

    const firstName = FirstName;
    const lastName = LastName;
    const username = Username;
    const email = Email
    const password = Password;

    const [code, setCode] = useState();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(email);
        console.log(code);

        try {
            const res = await axios.post("http://localhost:4000/auth/verify-code", {
                email,
                code
            });

            console.log(res.data);

            if (res.data.success) {
                alert("Correct code.");
                
                const createRes = await axios.post("http://localhost:4000/users/create-account", {
                    firstName,
                    lastName,
                    username,
                    email,
                    password
                });

                if(createRes.data.success) {
                    alert("Successfully created an account.");
                    navigate("/login");
                }
                return;
            } else {
                alert("Invalid code");
                return;
            }

        } catch (err) {
            const message = err.response?.data?.message || err.message;
            console.log(message);
            alert(message);
        }
    }

    return (

    <div className='fixed inset-0 flex items-center justify-center z-50'>

        <div className="absolute inset-0 bg-black/70" />

        <motion.div
            initial={fadeScale.initial}
            animate={fadeScale.animate}
            transition={fadeScale.transition}
            className="relative z-10"
        >
            <div className='px-10 py-10 bg-darkblue rounded-2xl flex flex-col gap-10 shadow-xl'>
                <div className='flex flex-col items-center justify-center gap-2'>
                    <h1 className='text-4xl font-akagi font-black text-yellow tracking-wide'>VERIFY CODE</h1>
                    <h1 className='text-md font-akagi font-semibold text-white'>Enter the code sent to your provided email.</h1>
                </div>  

                <div className=''>
                    <form 
                        onSubmit={handleSubmit}
                        className='flex flex-col items-center gap-10'>
                        <NumberField Placeholder="Enter 6-Digit Code"
                            Length="6" 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}/>

                        <motion.button
                            whileHover={buttonClickBounce.whileHover}
                            whileTap={buttonClickBounce.whileTap}
                            onHoverStart={buttonClickBounce.onHoverStart}
                            type="submit"
                        >
                            <div className='bg-blue rounded-lg px-3 py-2 w-fit shadow-xl cursor-pointer'>
                                <h1 className='text-xl font-akagi font-bold text-white'>Submit</h1>
                            </div>
                        </motion.button>
                    </form>
                </div>
            </div>

        </motion.div>

    </div>
    )
}

export default VerifyCode