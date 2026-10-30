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
import { IoCloseSharp } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";

function ManageAccount({role}) {

    const [activeTab, setActiveTab] = useState("Cashier");
    const navigate = useNavigate();

    const [archive, setArchive] = useState(false);
    const [addAccount, setAddAccount] = useState(false);

    const [adminAccounts, setAdminAccounts] = useState([]);
    const [archiveAccounts, setArchiveAccounts] = useState([]);
    const [cashierAccounts, setCashierAccounts] = useState([]);

    const [roleDropDown, setRoleDropDown]= useState(false);
    const [roles, setRoles] = useState("Set Role");

    const [checkingUsername, setCheckingUsername] = useState(false);
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contact, setContact] = useState("");
    const [email, setEmail]  = useState("");
    const [password, setPassword]  = useState("");
    const [username, setUsername] = useState("");

    const [isCreating, setIsCreating] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [validationErrors, setValidationErrors] = useState({});

    const [showAdminConfirmation, setShowAdminConfirmation] = useState(false);

    const validateAccountForm = async () => {
        const errors = {};

        if (roles === "Set Role") {
            errors.role = "Please select an account role.";
        }

        if (!firstName.trim()) {
            errors.firstName = "First name is required.";
        }

        if (!lastName.trim()) {
            errors.lastName = "Last name is required.";
        }

        if (!username.trim()) {
            errors.username = "Username is required.";
        }

        if (!/^09\d{9}$/.test(contact)) {
            errors.contact = "Contact number must start with 09 and contain exactly 11 digits.";
        }

        if (!/^[^\s@]+@[^\s@]+\.com$/i.test(email.trim())) {
            errors.email = "Please enter a valid .com email address.";
        } else {
            // Check whether the email already exists.
            try {
                const { data, error } = await supabase
                    .from("profiles_mod")
                    .select("id")
                    .ilike("email", email.trim())
                    .limit(1)
                    .maybeSingle();

                if (error) throw error;

                if (data) {
                    errors.email = "This email address is already registered.";
                }

            } catch (error) {
                console.error("Email check failed:", error);
                errors.email = "Unable to verify email. Please try again.";
            }
        }

        if (!password.trim()) {
            errors.password = "Default password is required.";
        }

        // Check whether the username already exists.
        if (username.trim()) {
            try {
                setCheckingUsername(true);

                const { data, error } = await supabase
                    .from("profiles_mod")
                    .select("id")
                    .ilike("username", username.trim())
                    .limit(1)
                    .maybeSingle();

                if (error) throw error;

                if (data) {
                    errors.username = "This username is already taken.";
                }

            } catch (error) {
                console.error("Username check failed:", error);
                errors.username = "Unable to verify username. Please try again.";
            } finally {
                setCheckingUsername(false);
            }
        }

        setValidationErrors(errors);

        return Object.keys(errors).length === 0;
    };
    

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

    const fetchArchiveAccounts = async () => {
        const { data, error } = await supabase
            .from("profiles_mod")
            .select("*")
            .eq("role", "archive");

        if (error) {
            console.error("Error fetching archive accounts:", error);
            return;
        }

        setArchiveAccounts(data || []);
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
        if (!(await validateAccountForm())) return;

        if (roles === "admin") {
            setShowAdminConfirmation(true);
            return;
        }

        createAccount();
    };

    const createAccount = async () => {
        setIsCreating(true);

        try {
            const { data, error } = await supabase.functions.invoke(
                "create-employee",
                {
                    body: {
                        email: email.trim().toLowerCase(),
                        password: password,
                        firstName: firstName,
                        lastName: lastName,
                        username: username.trim(),
                        contact: contact,
                        role: roles
                    }
                }
            );

            if (error) throw error;

            console.log(data);

            await fetchAdminAccounts();
            await fetchCashierAccounts();

            setAddAccount(false);
            setShowAdminConfirmation(false);

            // Reset form fields.
            setRoles("Set Role");
            setFirstName("");
            setLastName("");
            setUsername("");
            setContact("");
            setEmail("");
            setPassword("");
            setShowPassword(false);
            setValidationErrors({});

        } catch (error) {
            console.error("Error creating account:", error);
        } finally {
            setIsCreating(false);
        }
    };

    useEffect(() => {
        fetchAdminAccounts();
        fetchCashierAccounts();
        fetchArchiveAccounts();

        console.log(archiveAccounts);
    }, []);
  return (
    <>

        <div className='w-full h-screen md:bg-[#F2F2F2] flex'>
            <Sidebar active={'accounts'} userRole={role}/>

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
                            <div className='fixed inset-0 bg-black/60 z-100 flex flex-col items-center justify-center p-10 xl:p-30'>

                                <div className='w-full h-full rounded-xl p-8 bg-[#ffffff] flex flex-col gap-7'>
                                    <div className='flex justify-between'>
                                        <h1 className='md:text-3xl text-2xl font-akagi font-bold tracking-wide text-blue'>Archived Accounts</h1>
                                        <IoCloseSharp 
                                            onClick={() => setArchive(false)}
                                            className='text-3xl text-gray cursor-pointer'
                                        />
                                    </div>

                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}  
                                        className='w-full grid grid-cols-2 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 gap-5 text-center'
                                    >

                                        {archiveAccounts.map((archive) => (
                                            <AccountCard
                                                onClick={() => navigate(`/accounts/${archive.id}`)}
                                                key={archive.id}
                                                fullName={archive.first_name + " " + archive.last_name}
                                                firstName={archive.first_name}
                                                lastName={archive.last_name}
                                            />
                                        ))}
                                        
                                    </motion.div>
                                </div>
                                
                                
                            </div>
                        </>
                    }

                    {/*Archive*/}
                    {addAccount === true &&
                        <>
                            <div className='fixed inset-0 z-100 bg-black/60 flex flex-col items-center justify-center p-10 xl:p-30'>

                                <div className='w-fit rounded-xl p-5 md:p-10 bg-[#ffffff] pt-7 flex flex-col gap-7'>
                                    <div className='flex flex-row gap-1'>

                                        <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Add Account</h1>
                                    </div>

                                    <div className='grid grid-cols-2 gap-3 font-akagi font-medium text-md md:text-lg text-gray items-center'>

                                        <h1>Role</h1>
                                        <div className="relative">
                                            <div
                                                onClick={() => setRoleDropDown(!roleDropDown)}
                                                className={`relative rounded-lg border px-3 py-1 flex flex-row justify-between items-center cursor-pointer
                                                    ${validationErrors.role ? "border-red-500" : "border-gray"}
                                                `}
                                            >
                                                {roles}
                                                <RiArrowDropDownLine className="text-xl" />

                                                {roleDropDown && (
                                                    <div className="absolute top-full left-0 w-full bg-white rounded-lg border border-[#9E9E9E] z-50 mt-1">
                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setRoles("cashier");
                                                                setValidationErrors(prev => ({ ...prev, role: "" }));
                                                                setRoleDropDown(false);
                                                            }}
                                                            className="px-3 py-1 hover:bg-gray/70 hover:text-[#ffffff] rounded-md"
                                                        >
                                                            Cashier
                                                        </div>

                                                        <div
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setRoles("admin");
                                                                setValidationErrors(prev => ({ ...prev, role: "" }));
                                                                setRoleDropDown(false);
                                                            }}
                                                            className="px-3 py-1 hover:bg-gray/70 hover:text-[#ffffff] rounded-md"
                                                        >
                                                            Admin
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {validationErrors.role && (
                                                <p className="text-red-500 text-xs mt-1">{validationErrors.role}</p>
                                            )}
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

                                            <div className="w-full">
                                                <input
                                                    value={username}
                                                    type="text"
                                                    onChange={(e) => {
                                                        setUsername(e.target.value);

                                                        setValidationErrors(prev => ({
                                                            ...prev,
                                                            username: ""
                                                        }));
                                                    }}
                                                    className={`rounded-lg border px-3 py-1 focus:outline-none w-full
                                                        ${validationErrors.username ? "border-red-500" : "border-gray"}
                                                    `}
                                                />

                                                {validationErrors.username && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {validationErrors.username}
                                                    </p>
                                                )}

                                                {checkingUsername && (
                                                    <p className="text-gray text-xs mt-1">
                                                        Checking username...
                                                    </p>
                                                )}
                                            </div>

                                        <h1>Contact #</h1>
                                        <input
                                            value={contact}
                                            type="text"
                                            maxLength={11}
                                            placeholder="09XXXXXXXXX"
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");

                                                setContact(value);

                                                setValidationErrors(prev => ({
                                                    ...prev,
                                                    contact: ""
                                                }));
                                            }}
                                            className={`rounded-lg border px-3 py-1 focus:outline-none w-full
                                                ${validationErrors.contact ? "border-red-500" : "border-gray"}
                                            `}
                                        />

                                        {validationErrors.contact && (
                                            <p className="col-span-2 text-red-500 text-xs -mt-2">
                                                {validationErrors.contact}
                                            </p>
                                        )}

                                        <h1>Email</h1>
                                        <input
                                            value={email}
                                            type="text"
                                            placeholder="example@gmail.com"
                                            onChange={(e) => {
                                                setEmail(e.target.value);

                                                setValidationErrors(prev => ({
                                                    ...prev,
                                                    email: ""
                                                }));
                                            }}
                                            className={`rounded-lg border px-3 py-1 focus:outline-none w-full
                                                ${validationErrors.email ? "border-red-500" : "border-gray"}
                                            `}
                                        />

                                        {validationErrors.email && (
                                            <p className="col-span-2 text-red-500 text-xs -mt-2">
                                                {validationErrors.email}
                                            </p>
                                        )}

                                        <h1>Default Password</h1>
                                        <div className="relative w-full">
                                            <input
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);

                                                    setValidationErrors(prev => ({
                                                        ...prev,
                                                        password: ""
                                                    }));
                                                }}
                                                type={showPassword ? "text" : "password"}
                                                className={`rounded-lg border px-3 py-1 pr-10 focus:outline-none w-full
                                                    ${validationErrors.password ? "border-red-500" : "border-gray"}
                                                `}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray hover:text-blue transition-all"
                                            >
                                                {showPassword ? (
                                                    <FiEyeOff className="text-xl" />
                                                ) : (
                                                    <FiEye className="text-xl" />
                                                )}
                                            </button>
                                        </div>

                                        {validationErrors.password && (
                                            <p className="col-span-2 text-red-500 text-xs -mt-2">
                                                {validationErrors.password}
                                            </p>
                                        )}
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

                    {showAdminConfirmation && (
                        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-5">

                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-[#ffffff] rounded-2xl shadow-xl w-full max-w-md p-7 flex flex-col gap-5"
                            >
                                <div className="flex justify-between items-center">
                                    <h1 className="text-2xl font-akagi font-bold text-blue">
                                        Admin Account Confirmation
                                    </h1>

                                    <IoCloseSharp
                                        onClick={() => setShowAdminConfirmation(false)}
                                        className="text-2xl text-gray cursor-pointer hover:text-red-500"
                                    />
                                </div>

                                <div className="flex flex-col items-center text-center gap-3">

                                    <div className="w-16 h-16 rounded-full bg-yellow/20 flex items-center justify-center">
                                        <BsPersonPlusFill className="text-3xl text-yellow" />
                                    </div>

                                    <h2 className="text-xl font-bold font-akagi text-navyblue">
                                        Assigning a New Administrator
                                    </h2>

                                    <p className="text-gray font-akagi">
                                        You are about to create a new account with
                                        <span className="font-bold text-blue"> Admin </span>
                                        privileges.
                                    </p>

                                    <p className="text-sm text-gray font-akagi">
                                        This account will have administrative access to the system.
                                        Are you sure you want to proceed?
                                    </p>

                                    <div className="w-full bg-gray/10 rounded-xl p-3 text-left font-akagi">
                                        <p className="text-sm text-gray">New Administrator</p>
                                        <p className="font-bold text-navyblue">
                                            {firstName} {lastName}
                                        </p>
                                        <p className="text-sm text-gray">{email}</p>
                                    </div>

                                </div>

                                <div className="flex gap-3 font-akagi font-bold">

                                    <button
                                        type="button"
                                        disabled={isCreating}
                                        onClick={() => setShowAdminConfirmation(false)}
                                        className="flex-1 border border-gray text-gray rounded-lg py-2 hover:bg-gray/10 transition-all"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        disabled={isCreating}
                                        onClick={createAccount}
                                        className={`flex-1 bg-yellow text-navyblue rounded-lg py-2 transition-all
                                            ${isCreating ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow/80"}
                                        `}
                                    >
                                        {isCreating ? "Creating..." : "Confirm"}
                                    </button>

                                </div>

                            </motion.div>
                        </div>
                    )}
                </div>

            </motion.div>
        </div>
    </>
  )
}

export default ManageAccount
