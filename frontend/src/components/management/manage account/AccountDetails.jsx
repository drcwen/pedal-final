import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState } from "react";
import { motion } from "motion/react"
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdOutlineAccountCircle } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
import { IoPersonSharp } from "react-icons/io5";
import { MdWork } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";

function AccountDetails({ fullName, role, email, contact, id, branch, firstName, lastName, username }) {

    const navigate = useNavigate();

    const [edit, setEdit] = useState(false);
    const [editUsername, setEditUsername] = useState(username);
    const [editEmail, setEditEmail] = useState(email);
    const [editFirstName, setEditFirstName] = useState(firstName);
    const [editLastName, setEditLastName] = useState(lastName);
    const [editRole, setEditRole] = useState(role);
    const [editContact, setEditContact] = useState(contact);
    const [editBranch, setEditBranch] = useState(branch);

    const [roleDropDown, setRoleDropDown] = useState(false);

  return (
    <>

        <div 
            className='w-full h-screen md:bg-[#F2F2F2] flex'
        >
            <Sidebar active={'accounts'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 p-5'>

                <SidebarMobile active={'accounts'}/>
                
                <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl md:p-10 px-3 py-7 gap-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>
                        
                    <div
                        onClick={() => navigate("/accounts")}
                        className="w-fit flex items-center cursor-pointer"
                    >
                        <IoChevronBack className="text-3xl text-gray hover:text-[#148BB8] transition-colors" />
                    </div>

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
                                <h1 className='font-medium'>Contact Number</h1>
                                {!edit ? 
                                    <h1 className='font-bold'>{editContact}</h1> 
                                    : 
                                    <input 
                                        value={editContact}
                                        onChange={(e) => {setEditContact(e.target.value)}}
                                        className='bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray'/>
                                }
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Employee ID</h1>
                                <h1 className='font-bold'>{id}</h1>
                            </div>

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
                                        {!edit ? 
                                            <h1 className='font-bold first-letter:uppercase'>{editRole}</h1> 
                                            : 
                                            <div 
                                                onClick={() => {setRoleDropDown(!roleDropDown)}}
                                                className='relative cursor-pointer w-80 rounded-lg border border-gray bg-gray/30 px-3 py-1 flex justify-between items-center font-bold'>
                                                <h1 className='first-letter:uppercase'>{editRole}</h1>
                                                <RiArrowDropDownLine className='text-xl'/>

                                                {roleDropDown ? 
                                                    <div className='absolute top-full left-0 w-full bg-white rounded-lg border border-[#9E9E9E] z-50 mt-1 '>
                                                        <div 
                                                            onClick={() => {setEditRole("Cashier")}}
                                                            className='px-3 py-1 hover:bg-gray/70 hover:text-[#ffffff] rounded-md'>
                                                            Cashier
                                                        </div>

                                                        <div 
                                                            onClick={() => {setEditRole("Admin")}}
                                                            className='px-3 py-1 hover:bg-gray/70 hover:text-[#ffffff] rounded-md'>
                                                            Admin
                                                        </div>
                                                    </div> : undefined}

                                                {/*<input 
                                                value={editRole}
                                                onChange={(e) => {setEditRole(e.target.value)}}
                                                className='bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray'/>*/}
                                            </div>
                                            
                                        }
                                    </div>
                                
                            </div>

                            <div className='flex flex-col'>
                                <h1 className='font-medium'>Branch/Location</h1>
                                <h1 className='font-bold'>{branch}</h1>
                            </div>

                        </div>
                    </div>
                    
                    {edit ? 
                        <div className='w-fit rounded-lg bg-yellow font-akagi font-bold text-lg text-navyblue px-3 py-1'>
                            Submit
                        </div> : undefined
                    }
                </div>

            </motion.div>
        </div>
    </>
  )
}

export default AccountDetails
