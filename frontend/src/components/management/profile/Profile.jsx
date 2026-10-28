import { supabase } from "../../../lib/supabase"
import Sidebar from "../sidebar/Sidebar"
import { MdDirectionsBike } from "react-icons/md";
import { motion } from "motion/react"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState, useEffect } from 'react';
import { MdOutlineAccountCircle } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { RiArrowDropDownLine } from "react-icons/ri";

function Profile({ fullName, role, email, contact, id, branch, firstName, lastName, username }) {


    const [edit, setEdit] = useState(false);
    const [editUsername, setEditUsername] = useState(username);
    const [editEmail, setEditEmail] = useState(email);
    const [editFirstName, setEditFirstName] = useState(firstName);
    const [editLastName, setEditLastName] = useState(lastName);
    const [editRole, setEditRole] = useState(role);
    const [editContact, setEditContact] = useState(contact);
    const [editPin, setEditPin] = useState("");
    const [changePin, setChangePin] = useState(false);
    const [editBranch, setEditBranch] = useState(branch);
    const [editPassword, setEditPassword] = useState("");

    const [simNumber, setSimNumber] = useState("");
    const [simNumberError, setSimNumberError] = useState("");

    const [changePassword, setChangePassword] = useState(false);

    const [roleDropDown, setRoleDropDown] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!editPassword) return;

        setIsResettingPassword(true);

        const { data, error } = await supabase.functions.invoke(
            "recover-employee",
            {
                body: {
                    userId: id,
                    password: editPassword
                }
            }
        );

        if (error) {
            console.error("Error resetting password:", error);
            setIsResettingPassword(false);
            return;
        }

        console.log(data);

        setEditPassword("");
        setChangePassword(false);
        setIsResettingPassword(false);
    };

    const updateProfile = async () => {
        if (role !== "admin" && editRole !== role) {
            setEditRole(role);
        }

        if (changePin && !/^\d{6}$/.test(editPin)) {
            return;
        }

        setLoading(true);

        try {
            const { error: profileError } = await supabase
                .from("profiles_mod")
                .update({
                    first_name: editFirstName,
                    last_name: editLastName,
                    username: editUsername,
                    contact: editContact,
                    role: role === "admin" ? role : editRole,
                })
                .eq("id", id);

            if (profileError) throw profileError;

            // Save the PIN only when the admin explicitly changes it.
            if (role === "admin" && changePin) {
                const { error: pinError } = await supabase
                    .from("pin_mod")
                    .upsert(
                        {
                            admin_id: id,
                            pin: editPin,
                        },
                        { onConflict: "admin_id" }
                    );

                if (pinError) throw pinError;
            }

            setEdit(false);
            setChangePin(false);
            setEditPin("");
            setRoleDropDown(false);
        } catch (error) {
            console.error("Error saving profile:", error.message);
        } finally {
            setLoading(false);
        }
    };
    

  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar userRole={role}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex flex-col flex-1 min-w-0 lg:min-h-screen md:p-7 gap-5'>

                <SidebarMobile active={'dashboard'}/>
                
                <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl md:p-15 md:px-10 py-15 px-7 gap-6 overflow-y-scroll scrollbar-none scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                                        
                    <div className='flex flex-row justify-between md:items-center'>
                        <div className='w-full flex flex-row justify-between gap-5 items-center'>

                            <div className='flex flex-row gap-2 items-center'>
                                <MdOutlineAccountCircle className='lg:text-8xl xl:text-9xl text-7xl text-[#148BB8] '/>
                                
                                <div className='flex flex-col gap-1'>
                                    {/*Name and Account Type*/}
                                    <div className='flex flex-row gap-3 font-akagi font-bold text-[#505050] items-center'>
                                        <h1 className='md:text-2xl text-md md:text-lg'>{fullName}</h1>
                                        <div className='px-2 py-0.5 bg-[#148BB8] rounded-md'>
                                            <h1 className='text-xs md:text-md text-[#ffffff] uppercase tracking-wide'>{role}</h1>
                                        </div>
                                    </div>
                                    
                                    {/*Details and Branch*/}
                                    <div className='flex flex-row gap-1 md:gap-3 font-akagi font-bold text-[#505050] items-center'>
                                        <h1 className='md:text-lg text-xs font-medium first-letter:uppercase'>{role} Account</h1>
                                        <h1 className='md:text-lg text-xs font-medium'>•</h1>
                                        <h1 className='md:text-lg text-xs font-medium'>Main Branch</h1>
                                    </div>

                                    
                                </div>

                            </div>

                            <div 
                                onClick={() => {
                                    if (edit) {
                                        setEditFirstName(firstName);
                                        setEditLastName(lastName);
                                        setEditRole(role);
                                        setEditEmail(email);
                                        setEditContact(contact);
                                        setEditUsername(username);
                                        setChangePin(false);
                                        setEditPin("");
                                        setEdit(false);
                                    } else {
                                        setEdit(true);
                                    }
                                }}
                                className={`w-fit h-fit flex cursor-pointer gap-3 px-3 py-2 border-2 ${edit ? "border-red-500 text-red-500" : "border-blue text-[#148BB8]"} items-center font-akagi font-bold md:text-xl rounded-xl`}>
                                {!edit ? <RiEdit2Line className='md:text-xl text-lg'/> : <IoCloseSharp className='md:text-xl text-lg'/>}
                                    {!edit ? <h1 className='text-md md:flex md:flex-row hidden'>Edit Profile</h1> : <h1 className='text-md md:flex md:flex-row hidden'>Cancel</h1>}
                            </div>
                        </div>

                    </div>

                    <div className='w-full h-0.5 bg-gray/50 rounded-full'/>
                    
                    {/*Basic Information*/}
                    <div className='w-full flex flex-col gap-5 md:px-5 tracking-wide'>
                        <div className=' flex flex-row gap-3 items-center font-akagi font-bold text-[#505050] text-lg md:text-xl'>
                            <IoPersonSharp className='text-[#148BB8] text-2xl'/>
                            Basic Information
                        </div>

                        <div className='flex flex-col md:grid md:grid-cols-2 gap-3 font-akagi text-sm md:text-lg text-[#505050]'>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>First Name</h1>
                                {!edit ? 
                                    <h1 className='font-bold'>{editFirstName}</h1> 
                                    : 
                                    <input 
                                        value={editFirstName}
                                        onChange={(e) => {setEditFirstName(e.target.value)}}
                                        className='bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray'/>
                                }
        
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Last Name</h1>
                                {!edit ? 
                                    <h1 className='font-bold'>{editLastName}</h1> 
                                    : 
                                    <input 
                                        value={editLastName}
                                        onChange={(e) => {setEditLastName(e.target.value)}}
                                        className='bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray'/>
                                }
        
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Username</h1>
                                {!edit ? 
                                    <h1 className='font-bold'>{editUsername}</h1> 
                                    : 
                                    <input 
                                        value={editUsername}
                                        onChange={(e) => {setEditUsername(e.target.value)}}
                                        className='bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray'/>
                                }
        
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Email Address</h1>
                                <h1 className='font-bold'>{editEmail}</h1> 
                                    
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Password</h1>
                                {!edit ? 
                                    <h1 className='font-bold'>***********</h1> 
                                    : 
                                    <div className='flex flex-row items-center gap-2'>
                                        {!changePassword ? (
                                            <h1 className='font-bold'>***********</h1>
                                        ) : (
                                            <input
                                                type='password'
                                                value={editPassword}
                                                onChange={(e) => setEditPassword(e.target.value)}
                                                disabled={isResettingPassword}
                                                placeholder='Enter new password'
                                                className='w-52 bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray disabled:opacity-50'
                                            />
                                        )}

                                        {!changePassword ? (
                                            <button
                                                type='button'
                                                onClick={() => setChangePassword(true)}
                                                className='cursor-pointer rounded-lg bg-yellow px-4 py-1 text-sm font-akagi font-bold text-navyblue hover:opacity-80 transition'
                                            >
                                                Change
                                            </button>
                                        ) : (
                                            <button
                                                type='button'
                                                onClick={handleResetPassword}
                                                disabled={isResettingPassword || !editPassword}
                                                className='flex items-center justify-center gap-2 min-w-[90px] rounded-lg bg-yellow px-4 py-1 font-akagi font-bold text-navyblue transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'
                                            >
                                                {isResettingPassword ? (
                                                    <>
                                                        <span className='w-4 h-4 border-2 border-navyblue/30 border-t-navyblue rounded-full animate-spin'></span>
                                                        <span>Saving...</span>
                                                    </>
                                                ) : (
                                                    'Submit'
                                                )}
                                            </button>
                                        )}
                                    </div>
                                }
                            </div>
                            

                            <div className="flex flex-col gap-1">
                                <h1 className="font-medium">SIM Number</h1>

                                {!edit ? (
                                    <h1 className="font-bold">
                                        {simNumber || "No SIM number available"}
                                    </h1>
                                ) : (
                                    <>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="off"
                                            maxLength={11}
                                            value={simNumber}
                                            onChange={(e) => {
                                                const digits = e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 11);

                                                setSimNumber(digits);

                                                if (digits.length === 0 || /^09\d{9}$/.test(digits)) {
                                                    setSimNumberError("");
                                                } else {
                                                    setSimNumberError(
                                                        "SIM number must start with 09 and contain exactly 11 digits."
                                                    );
                                                }
                                            }}
                                            placeholder="09XXXXXXXXX"
                                            className="bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray"
                                        />

                                        <p className="text-xs text-gray/70">
                                            {simNumber.length}/11 digits
                                        </p>

                                        {simNumberError && (
                                            <p className="text-sm text-red-500">
                                                {simNumberError}
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Employee ID</h1>
                                <h1 className='font-bold'>{id}</h1>
                            </div>

                            {role === "admin" && ( 
                                <div className='flex flex-col'> 
                                    <h1 className='font-medium'>Admin PIN</h1> 
                                    
                                    <div className='flex flex-row items-center gap-2'> 
                                        {!changePin ? ( 
                                            <> 
                                                <h1 className='font-bold'>******</h1> 
                                                    {edit && ( 
                                                        <button 
                                                            type='button' 
                                                            onClick={() => setChangePin(true)} 
                                                            className='cursor-pointer rounded-lg bg-yellow px-4 py-1 text-sm font-akagi font-bold text-navyblue hover:opacity-80 transition' > 
                                                                Change 
                                                        </button> )} 
                                            </> ) : ( 
                                                
                                            <> 
                                                <input
                                                    type='password'
                                                    value={editPin}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                                                        setEditPin(value);
                                                    }}
                                                    inputMode='numeric'
                                                    pattern='[0-9]{6}'
                                                    maxLength={6}
                                                    placeholder='Enter new PIN'
                                                    className='w-52 bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray'
                                                />
                                                    
                                                <button
                                                    type='button'
                                                    disabled={!/^\d{6}$/.test(editPin)}
                                                    onClick={() => {
                                                        setChangePin(false);
                                                        setEditPin("");
                                                        updateProfile();
                                                    }}
                                                    className={`rounded-lg px-4 py-1 text-sm font-akagi font-bold transition ${
                                                        /^\d{6}$/.test(editPin)
                                                            ? 'cursor-pointer bg-yellow text-darkblue hover:opacity-80'
                                                            : 'cursor-not-allowed bg-gray/30 text-gray'
                                                    }`}
                                                >
                                                    Submit
                                                </button>
                                            </> 
                                        )} 
                                    </div> 
                                </div> )}


                        </div>
                    </div>

                    <div className='w-full h-0.5 bg-gray/50 rounded-full'/>

                    {/*Work Details*/}
                    <div className='w-full flex flex-col gap-5 md:px-5 tracking-wide'>
                        <div className=' flex flex-row gap-3 items-center font-akagi font-bold text-[#505050] text-lg md:text-xl'>
                            <MdWork className='text-[#148BB8] text-2xl'/>
                            Work Details
                        </div>

                        <div className='flex flex-col gap-3 font-akagi text-sm md:text-lg text-[#505050]'>
                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Position</h1>
                                    <div className={`w-fit ${edit ? undefined : "border border-[#505050]/30"} rounded-lg ${!edit ? "px-2 py-1" : undefined}`}>
                                        {!edit || role === "admin" ? (
                                            <h1 className="font-bold first-letter:uppercase">
                                                {role}
                                            </h1>
                                        ) : (
                                            <div
                                                onClick={() => setRoleDropDown(!roleDropDown)}
                                                className="relative flex w-80 cursor-pointer items-center justify-between rounded-lg border border-gray bg-gray/30 px-3 py-1 font-bold"
                                            >
                                                <h1 className="first-letter:uppercase">{editRole}</h1>

                                                <RiArrowDropDownLine className="text-xl" />

                                                {roleDropDown && (
                                                    <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-[#9E9E9E] bg-[#ffffff]">
                                                        {["cashier", "admin", "archive"].map((position) => (
                                                            <div
                                                                key={position}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditRole(position);
                                                                    setRoleDropDown(false);
                                                                }}
                                                                className="rounded-md px-3 py-1 capitalize hover:bg-gray/70 hover:text-[#ffffff]"
                                                            >
                                                                {position}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                
                            </div>

                        </div>
                    </div>
                    
                    {edit && (
                        <button
                            type="button"
                            onClick={updateProfile}
                            disabled={
                                loading ||
                                !/^09\d{9}$/.test(simNumber) ||
                                (changePin && !/^\d{6}$/.test(editPin))
                            }
                            className="w-fit flex items-center justify-center gap-2 min-w-[90px] rounded-lg bg-yellow font-akagi font-bold text-lg text-navyblue px-3 py-1 transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-navyblue/30 border-t-navyblue rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    )}
                </div>

            </motion.div>
        </div>

      
    </>
  )
}

export default Profile
