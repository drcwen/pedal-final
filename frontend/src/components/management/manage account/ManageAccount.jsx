import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { useState, useEffect } from "react";
import { motion } from "motion/react"
import { IoArchive } from "react-icons/io5";
import { BsPersonPlusFill } from "react-icons/bs";
import AccountCard from "./AccountCard"
import { useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import { supabase } from "../../../lib/supabase"
import { RiArrowDropDownLine } from "react-icons/ri";

function ManageAccount() {

    const [activeTab, setActiveTab] = useState("Cashier");
    const navigate = useNavigate();

    const [archive, setArchive] = useState(false);
    const [addAccount, setAddAccount] = useState(false);

    const [adminAccounts, setAdminAccounts] = useState([]);
    const [cashierAccounts, setCashierAccounts] = useState([]);

    const [roleDropDown, setRoleDropDown]= useState(false);
    const [role, setRole] = useState("Set Role");
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail]  = useState("");
    const [password, setPassword]  = useState("");
    const [username, setUsername] = useState("");

    const [isCreating, setIsCreating] = useState(false);

    const fetchAdminAccounts = async () => {
        const { data, error } = await supabase
            .from("profiles_mod")
            .select("*")
            .eq("role", "admin");

        if (error) {
            console.error("Error fetching admin accounts:", error);
            return;
        }

        setAdminAccounts(data || []);
    };

    const fetchCashierAccounts = async () => {
        const { data, error } = await supabase
            .from("profiles_mod")
            .select("*")
            .eq("role", "cashier");

        if (error) {
            console.error("Error fetching cashier accounts:", error);
            return;
        }

        setCashierAccounts(data || []);
    };

    const handleCreateAccount = async () => {
        setIsCreating(true);

        const { data, error } = await supabase.functions.invoke(
            "create-employee",
            {
                body: {
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    contact: contact,
                    role: role
                }
            }
        );

        if (error) {
            console.error("Error creating account:", error);
            setIsCreating(false);
            return;
        }

        console.log(data);

        await fetchAdminAccounts();
        await fetchCashierAccounts();

        setIsCreating(false);

        setAddAccount(false);
    };

    useEffect(() => {
        fetchAdminAccounts();
        fetchCashierAccounts();
    }, []);
  return (
    <>

        <div className='w-full h-screen md:bg-[#F2F2F2] flex'>
            <Sidebar active={'accounts'}/>

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 p-5'>

                <SidebarMobile active={'accounts'}/>
                
                <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl md:p-10 px-3 py-7 gap-6 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>

                    <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Manage Accounts</h1>
                    
                    <div className='flex md:flex-row flex-col gap-5 md:justify-between'>

                        {/*Account Types*/}
                        <div className='w-fit rounded-2xl border-3 border-blue grid grid-cols-2'>
                            <div 
                                onClick={() => setActiveTab("Cashier")}
                                className={`md:p-2 py-2 flex justify-center px-5 cursor-pointer rounded-tl-xl rounded-bl-xl transition-all
                                    ${activeTab === "Cashier" ? "bg-blue" : "bg-transparent hover:bg-blue/50 transition-all duration-300"}
                                `}
                            >
                                <h1 
                                    className={`text-md lg:text-lg font-akagi font-bold transition-all
                                    ${activeTab === "Cashier" ? "text-[#ffffff]" : "text-blue hover:text-[#ffffff] transition-all duration-300"}
                                    `}
                                >
                                    Cashier
                                </h1>
                            </div>

                            <div 
                                onClick={() => setActiveTab("Admin")}
                                className={`md:p-2 py-2 rounded-tr-xl rounded-br-xl flex justify-center px-5 cursor-pointer
                                    ${activeTab === "Admin" ? "bg-blue" : "bg-transparent hover:bg-blue/50 transition-all duration-300"}
                                `}
                            >
                                <h1 className={`text-md lg:text-lg font-akagi font-bold px-5 transition-all
                                    ${activeTab === "Admin" ? "text-[#ffffff]" : "text-blue hover:text-[#ffffff] transition-all duration-300"}
                                    `}>Admin</h1>
                            </div>
                        </div>

                        {/*Search, Archive, and Add*/}
                        <div className='flex flex-row gap-4 items-center cursor-pointer'>
                            {/*Search*/}
                            <input className='bg-[#DBDBDB] focus:outline-none px-2 py-1 text-lg font-akagi font-bold text-[#9E9E9E] rounded-xl' placeholder='Search'/>
                            
                            {/*Archive Button*/}
                            <IoArchive 
                                onClick={() => setArchive(true)}
                                className='text-blue text-4xl hover:text-blue/70 transition-all duration-300'/>

                            {/*Add Account Button*/}
                            <BsPersonPlusFill 
                                onClick={() => setAddAccount(true)}
                                className='text-blue text-4xl hover:text-blue/70 transition-all duration-300'/>
                        </div>
                    </div>

                    <div className=''>
        
                        {activeTab === "Cashier" && 
                            <>
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}  
                                    className='w-full grid grid-cols-2 xl:grid-cols-5 lg:grid-grid-cols-4 md:grid-cols-3 gap-5 text-center'
                                >
                                    {cashierAccounts.map((cashier) => (
                                        <AccountCard
                                            onClick={() => navigate(`/accounts/${cashier.id}`)}
                                            key={cashier.id}
                                            fullName={cashier.first_name + " " + cashier.last_name}
                                            firstName={cashier.first_name}
                                            lastName={cashier.last_name}
                                        />
                                    ))}
                                    
                                </motion.div>
                            </>
                        }

                        {activeTab === "Admin" && 
                            <>
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}  
                                    className='w-full grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-5 text-center'
                                >

                                    {adminAccounts.map((admin) => (
                                        <AccountCard
                                            onClick={() => navigate(`/accounts/${admin.id}`)}
                                            key={admin.id}
                                            fullName={admin.first_name + " " + admin.last_name}
                                            firstName={admin.first_name}
                                            lastName={admin.last_name}
                                        />
                                    ))}
                                    
                                </motion.div>
                            </>
                        }

                    </div>

                    {/*Archive*/}
                    {archive === true &&
                        <>
                            <div className='fixed inset-0 bg-black/60 flex flex-col items-center justify-center p-10 xl:p-30'>

                                <div className='w-full h-full rounded-xl p-5 bg-[#ffffff] pt-7'>
                                    <div className='flex flex-row gap-1'>
                                        <IoChevronBack 
                                            onClick={() => setArchive(false)}
                                            className='text-3xl text-gray cursor-pointer'
                                        />
                                        {activeTab === 'Cashier' ? <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Cashier Archive</h1> : <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Admin Archive</h1>}
                                    </div>
                                </div>
                                
                                
                            </div>
                        </>
                    }

                    {/*Archive*/}
                    {addAccount === true &&
                        <>
                            <div className='fixed inset-0 bg-black/60 flex flex-col items-center justify-center p-10 xl:p-30'>

                                <div className='w-fit rounded-xl p-5 md:p-10 bg-[#ffffff] pt-7 flex flex-col gap-7'>
                                    <div className='flex flex-row gap-1'>

                                        <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Add Account</h1>
                                    </div>

                                    <div className='grid grid-cols-2 gap-3 font-akagi font-medium text-md md:text-lg text-gray items-center'>

                                        <h1>Role</h1>
                                        <div 
                                            onClick={() => {setRoleDropDown(!roleDropDown)}}
                                            className='relative rounded-lg border border-gray px-3 py-1 flex flex-row justify-between items-center'>
                                            {role}
                                            <RiArrowDropDownLine className='text-xl'/>

                                            {roleDropDown ? 
                                                <div className='absolute top-full left-0 w-full bg-white rounded-lg border border-[#9E9E9E] z-50 mt-1 '>
                                                    <div 
                                                        onClick={() => {setRole("cashier")}}
                                                        className='px-3 py-1 hover:bg-gray/70 hover:text-[#ffffff] rounded-md'>
                                                        Cashier
                                                    </div>

                                                    <div 
                                                        onClick={() => {setRole("admin")}}
                                                        className='px-3 py-1 hover:bg-gray/70 hover:text-[#ffffff] rounded-md'>
                                                        Admin
                                                    </div>
                                                </div> : undefined}
                                        </div>

                                        <h1>First Name</h1>
                                        <input 
                                            value={firstName}
                                            type='text'
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className='rounded-lg border border-gray px-3 py-1 focus:outline-none'/>

                                        <h1>Last Name</h1>
                                        <input 
                                            value={lastName}
                                            type='text'
                                            onChange={(e) => setLastName(e.target.value)}
                                            className='rounded-lg border border-gray px-3 py-1 focus:outline-none'/>

                                        <h1>Username</h1>
                                        <input 
                                            value={username}
                                            type='text'
                                            onChange={(e) => setUsername(e.target.value)}
                                            className='rounded-lg border border-gray px-3 py-1 focus:outline-none'/>

                                        <h1>Contact #</h1>
                                        <input 
                                            value={contact}
                                            type='number'
                                            onChange={(e) => setContact(e.target.value)}
                                            className='rounded-lg border border-gray px-3 py-1 focus:outline-none'/>

                                        <h1>Email</h1>
                                        <input 
                                            value={email}
                                            type='text'
                                            onChange={(e) => setEmail(e.target.value)}
                                            className='rounded-lg border border-gray px-3 py-1 focus:outline-none'/>

                                        <h1>Default Password</h1>
                                        <input 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type='password'
                                            className='rounded-lg border border-gray px-3 py-1 focus:outline-none'/>
                                    </div>

                                    <div className='flex flex-row justify-between gap-3 font-akagi font-bold text-[#ffffff]'>

                                        <div
                                            onClick={() => {
                                                if (!isCreating) {
                                                    setAddAccount(!addAccount);
                                                }
                                            }}
                                            className={`border border-gray text-gray rounded-lg px-3 py-1
                                                ${isCreating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                            `}
                                        >
                                            Cancel
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleCreateAccount}
                                            disabled={isCreating}
                                            className={`bg-yellow rounded-lg px-3 py-1 text-navyblue
                                                ${isCreating
                                                    ? 'opacity-70 cursor-not-allowed'
                                                    : 'cursor-pointer'
                                                }
                                            `}
                                        >
                                            {isCreating ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 border-2 border-navyblue border-t-transparent rounded-full animate-spin"></div>
                                                    Creating...
                                                </div>
                                            ) : (
                                                "Add Account"
                                            )}
                                        </button>

                                    </div>
                                </div>
                                
                                
                            </div>
                        </>
                    }
                </div>

            </motion.div>
        </div>
    </>
  )
}

export default ManageAccount
