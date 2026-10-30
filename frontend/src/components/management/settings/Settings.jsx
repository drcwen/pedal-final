import { supabase } from "../../../lib/supabase"
import Sidebar from "../sidebar/Sidebar"
import SidebarMobile from "../sidebar/SidebarMobile"
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import { motion } from "motion/react"
import { useNavigate } from "react-router-dom";
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdRemove } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";

function Settings({role}) {

    const [activeTab, setActiveTab] = useState("operatingHours");

    const [percent, setPercent] = useState("%");

    const [paymentOccurence, setPaymentOccurence] = useState("Periodic");

    const [periodicOccurence, setPeriodicOccurence] = useState("Every transaction");
    
    const [type, setType] = useState(null);

    const [percentage, setPercentage] = useState(null);

    const [dateOccurence, setDateOccurence] = useState(null);

    const [checked, setChecked] = useState(null);

    const [schedule, setSchedule] = useState([]);

    const [deductions, setDeductions] = useState([]);

    const [date, setDate] = useState("");
    const [event, setEvent] = useState("");

    const [nonWorking, setNonWorking] = useState([]);

    const [loading, setLoading] = useState(false);

    const [dropDown, setDropDown] = useState(false);

    const [savingSchedule, setSavingSchedule] = useState(false);
    const [scheduleMessage, setScheduleMessage] = useState({
        type: "",
        text: ""
    });

    const periodicOccurenceOption = [
        "Every transaction",
        "Annually",
        "Bi-annually",
        "Quarterly",
        "Monthly"
    ]

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const minDate = tomorrow.toLocaleDateString("en-CA", {
        timeZone: "Asia/Manila"
    });

    const [open, setOpen] = useState(false);

    const handleChange = (event) => {
        setPaymentOccurence(event.target.value);
    };

    const [rentalRules, setRentalRules] = useState([]);
    const [rulesLoading, setRulesLoading] = useState(false);
    const [rulesSaving, setRulesSaving] = useState(false);

    const [newRuleTitle, setNewRuleTitle] = useState("");
    const [newRuleContent, setNewRuleContent] = useState("");

    const [editingRuleId, setEditingRuleId] = useState(null);
    const [editRuleTitle, setEditRuleTitle] = useState("");
    const [editRuleContent, setEditRuleContent] = useState("");

    const [rulesMessage, setRulesMessage] = useState({
        type: "",
        text: ""
    });

    const isAdmin = String(role).toLowerCase() === "admin";

    const handleAdd = async () => {
        const {data, error} = await supabase
            .from("revenue_deductions_mod")
            .insert({
                "type": type,
                "calculation": percent === "%" ? "Percentage" : "Fixed Amount",
                "value": percentage,
                "occurence": paymentOccurence === "Periodic" ? periodicOccurence : undefined,
                "deadline": paymentOccurence === "One-time" ? dateOccurence : undefined
            })
        
        if(error) {
            console.log(error);
            return;
        }

        await fetchRevenueDeductions();

        setType("");
        setPercentage(null);
        setDateOccurence(null);
        setPercent("%");
        setPercentage(0);
    }

    const deleteRevenueDeduction = async (id) => {
        const {data, error} = await supabase
            .from("revenue_deductions_mod")
            .delete()
            .eq("id", id)
        
        if(error) {
            console.log(error);
            return;
        }

        setDeductions((prev) => prev.filter((deduction) => deduction.id !== id));

    }

    const fetchRevenueDeductions = async () => {
        const {data, error} = await supabase
            .from("revenue_deductions_mod")
            .select("*");
        
        if (error) {
            console.log(error);
            return;
        }

        setDeductions(data);
    }

    const handleScheduleChange = (id, field, value) => {
        setSchedule((prev) =>
            prev.map((sched) =>
                sched.id === id
                    ? { ...sched, [field]: value }
                    : sched
            )
        );
    };

    const saveSchedule = async () => {
        if (savingSchedule) return;

        try {
            setSavingSchedule(true);
            setScheduleMessage({ type: "", text: "" });

            for (const sched of schedule) {
                const { error } = await supabase
                    .from("operating_hours_mod")
                    .update({
                        availability: sched.availability,
                        opening: sched.opening,
                        closing: sched.closing
                    })
                    .eq("id", sched.id);

                if (error) {
                    throw error;
                }
            }

            await fetchSchedule();

            setScheduleMessage({
                type: "success",
                text: "Operating hours saved successfully!"
            });
        } catch (error) {
            console.error("Error saving schedule:", error);

            setScheduleMessage({
                type: "error",
                text: "Failed to save operating hours. Please try again."
            });
        } finally {
            setSavingSchedule(false);
        }
    };

    const fetchSchedule = async () => {
        const { data, error } = await supabase
            .from("operating_hours_mod")
            .select("*");

        if (error) {
            console.error(error);
            return;
        }

        setSchedule(data || []);
    };

    const fetchNonWorking = async () => {
        const {data, error} = await supabase
            .from("non_working_days_mod")
            .select("*");
        
        if(error) {
            console.error(error);
            return;
        }

        setNonWorking(data || []);

    }

    const deleteNonWorking = async (id) => {
        const {data, error} = await supabase
            .from("non_working_days_mod")
            .delete()
            .eq("id", id)
        
        if(error) {
            console.error(error);
            return;
        }

        setNonWorking((prev) => prev.filter((non) => non.id !== id));

    }

    const submitNonWorking = async () => {

        try {
            setLoading(true);
            
            const {data, error} = await supabase
                .from("non_working_days_mod")
                .insert({
                    date: date,
                    event_name: event
                })

                if(error) {
                    console.error(error);
                    return
                }
                
            await fetchNonWorking();
            setEvent("");
            setDate("");

        } catch(err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchRentalRules = async () => {
        setRulesLoading(true);

        const { data, error } = await supabase
            .from("rental_rules_mod")
            .select("id, title, content, display_order, is_active")
            .order("display_order", { ascending: true });

        if (error) {
            console.error("Error fetching rental rules:", error);

            setRulesMessage({
                type: "error",
                text: "Failed to load rules and regulations."
            });
        } else {
            setRentalRules(data || []);
        }

        setRulesLoading(false);
    };

    // ADD A NEW RULE
    const addRentalRule = async () => {
        if (rulesSaving) return;

        const title = newRuleTitle.trim();
        const content = newRuleContent.trim();

        if (!title || !content) {
            setRulesMessage({
                type: "error",
                text: "Please enter both a rule title and description."
            });
            return;
        }

        try {
            setRulesSaving(true);
            setRulesMessage({ type: "", text: "" });

            const nextOrder =
                rentalRules.length > 0
                    ? Math.max(
                        ...rentalRules.map((rule) => rule.display_order || 0)
                    ) + 1
                    : 1;

            const { error } = await supabase
                .from("rental_rules_mod")
                .insert({
                    title,
                    content,
                    display_order: nextOrder,
                    is_active: true
                });

            if (error) throw error;

            setNewRuleTitle("");
            setNewRuleContent("");

            await fetchRentalRules();

            setRulesMessage({
                type: "success",
                text: "New rule added successfully!"
            });
        } catch (error) {
            console.error("Error adding rental rule:", error);

            setRulesMessage({
                type: "error",
                text: "Failed to add the rule. Please try again."
            });
        } finally {
            setRulesSaving(false);
        }
    };

    // START EDITING A RULE
    const startEditingRule = (rule) => {
        setEditingRuleId(rule.id);
        setEditRuleTitle(rule.title);
        setEditRuleContent(rule.content);
        setRulesMessage({ type: "", text: "" });
    };

    // CANCEL EDITING
    const cancelEditingRule = () => {
        setEditingRuleId(null);
        setEditRuleTitle("");
        setEditRuleContent("");
    };

    // SAVE CHANGES TO AN EXISTING RULE
    const saveRentalRule = async (id) => {
        if (rulesSaving) return;

        const title = editRuleTitle.trim();
        const content = editRuleContent.trim();

        if (!title || !content) {
            setRulesMessage({
                type: "error",
                text: "The title and description cannot be empty."
            });
            return;
        }

        try {
            setRulesSaving(true);
            setRulesMessage({ type: "", text: "" });

            const { error } = await supabase
                .from("rental_rules_mod")
                .update({
                    title,
                    content
                })
                .eq("id", id);

            if (error) throw error;

            setEditingRuleId(null);
            setEditRuleTitle("");
            setEditRuleContent("");

            await fetchRentalRules();

            setRulesMessage({
                type: "success",
                text: "Rule updated successfully!"
            });
        } catch (error) {
            console.error("Error updating rental rule:", error);

            setRulesMessage({
                type: "error",
                text: "Failed to update the rule. Please try again."
            });
        } finally {
            setRulesSaving(false);
        }
    };

    // ACTIVATE OR DEACTIVATE A RULE
    const toggleRentalRule = async (rule) => {
        setRulesMessage({ type: "", text: "" });

        const { error } = await supabase
            .from("rental_rules_mod")
            .update({
                is_active: !rule.is_active
            })
            .eq("id", rule.id);

        if (error) {
            console.error("Error changing rule status:", error);

            setRulesMessage({
                type: "error",
                text: "Failed to update the rule status."
            });
            return;
        }

        await fetchRentalRules();

        setRulesMessage({
            type: "success",
            text: `Rule ${rule.is_active ? "deactivated" : "activated"} successfully!`
        });
    };

    // DELETE A RULE
    const deleteRentalRule = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this rule?"
        );

        if (!confirmed) return;

        setRulesMessage({ type: "", text: "" });

        const { error } = await supabase
            .from("rental_rules_mod")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting rule:", error);

            setRulesMessage({
                type: "error",
                text: "Failed to delete the rule. Please try again."
            });
            return;
        }

        setRentalRules((prev) => prev.filter((rule) => rule.id !== id));

        setRulesMessage({
            type: "success",
            text: "Rule deleted successfully!"
        });
    };

    useEffect(() => {
        fetchSchedule();
        fetchRevenueDeductions();
        fetchNonWorking();
        fetchRentalRules();
    }, []);

    console.log("event", event);
        console.log("date",date);

  return (
    <>

        <div className='w-full h-screen bg-[#F2F2F2] flex'>
            <Sidebar active={'settings'} userRole={role}/>
            

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }} 
                className='flex-1 lg:p-5'>

                <SidebarMobile active={'pos'}/>
                    
                <div className='w-full h-full p-10 bg-[#ffffff] rounded-xl flex flex-col gap-5'>
                    
                    <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>System Settings</h1>

                    <div className='flex flex-row gap-5 font-akagi font-medium text-gray'>
                        <h1 
                            onClick={() => {setActiveTab("operatingHours")}}
                            className={`hover:underline duration-300 transition-all cursor-pointer
                            ${activeTab === "operatingHours" ? "text-navyblue text-bold" : "text-gray/90"}`}
                        >Operating Hours</h1>

                        <h1 
                            onClick={() => {setActiveTab("revenueDeductions")}}
                            className={`hover:underline duration-300 transition-all cursor-pointer
                            ${activeTab === "revenueDeductions" ? "text-navyblue text-bold" : "text-gray/90"}`}
                        >
                            Revenue Deductions
                        </h1>

                        <h1
                            onClick={() => setActiveTab("rentalRules")}
                            className={`hover:underline duration-300 transition-all cursor-pointer ${
                                activeTab === "rentalRules"
                                    ? "text-navyblue text-bold"
                                    : "text-gray/90"
                            }`}
                        >
                            Rules & Regulations
                        </h1>
                        
                        
                    </div>

                    {activeTab === "operatingHours" &&
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full flex-1 min-h-0 md:grid md:grid-cols-2 flex flex-col rounded-xl bg-[#ebebeb] overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2] border border-gray/60"
                        >
                            <div className='w-full p-5 md:border-r-1 md:border-gray/60 flex flex-col gap-5'>

                                {/*Title*/}
                                <div className='w-full flex flex-col gap-1'>
                                    <h1 className='md:text-2xl text-xl font-akagi font-bold tracking-wide text-blue'>Operating Hours</h1>
                                    <h1 className='md:text-md text-sm font-akagi font-medium text-gray'>The unchecked date below will be unavailable for reservation.</h1>
                                </div>

                                {schedule.map((sched) => (
                                    <div 
                                        key={sched.id}
                                        className="w-full flex flex-col font-akagi font-medium text-gray gap-2"
                                    >

                                        <div className="flex flex-row gap-2">
                                            <input 
                                                type="checkbox"
                                                className="w-4"
                                                checked={sched.availability}
                                                onChange={(e) =>
                                                    handleScheduleChange(
                                                        sched.id,
                                                        "availability",
                                                        e.target.checked
                                                    )
                                                }
                                            />

                                            <h1>{sched.day}</h1>
                                        </div>

                                        <div className="w-full flex flex-row justify-between items-center gap-3">

                                            <input 
                                                type="time"
                                                className="w-full rounded-lg border border-gray px-2 py-1 focus:outline-none"
                                                value={sched.opening || ""}
                                                onChange={(e) =>
                                                    handleScheduleChange(
                                                        sched.id,
                                                        "opening",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            -

                                            <input 
                                                type="time"
                                                className="w-full rounded-lg border border-gray px-2 py-1 focus:outline-none"
                                                value={sched.closing || ""}
                                                onChange={(e) =>
                                                    handleScheduleChange(
                                                        sched.id,
                                                        "closing",
                                                        e.target.value
                                                    )
                                                }
                                            />

                                        </div>
                                    </div>
                                ))}

                                <div className="flex flex-col items-start gap-3">
                                    <button
                                        type="button"
                                        onClick={saveSchedule}
                                        disabled={savingSchedule}
                                        className={`w-fit rounded-lg px-4 py-2 font-akagi font-bold text-navyblue transition-all ${
                                            savingSchedule
                                                ? "bg-yellow/50 cursor-not-allowed"
                                                : "bg-yellow hover:opacity-80 cursor-pointer"
                                        }`}
                                    >
                                        {savingSchedule ? (
                                            <span className="flex items-center gap-2">
                                                <span className="w-4 h-4 border-2 border-navyblue/30 border-t-navyblue rounded-full animate-spin" />
                                                Saving...
                                            </span>
                                        ) : (
                                            "Save"
                                        )}
                                    </button>

                                    {scheduleMessage.text && (
                                        <div
                                            role="status"
                                            aria-live="polite"
                                            className={`w-full rounded-lg border px-3 py-2 font-akagi text-sm font-medium ${
                                                scheduleMessage.type === "success"
                                                    ? "bg-blue/10 border-blue text-blue"
                                                    : "bg-red-50 border-red-200 text-red-700"
                                            }`}
                                        >
                                            {scheduleMessage.text}
                                        </div>
                                    )}
                                </div>
                                <div className='block md:hidden w-full h-0.5 bg-black/20 rounded-xl'/>
                            </div>

                            <div className='pb-10 w-full p-5 md:border-r-1 md:border-gray/60 flex flex-col gap-5'>

                                {/*Title*/}
                                <div className='w-full flex flex-col gap-1'>
                                    <h1 className='md:text-2xl text-xl font-akagi font-bold tracking-wide text-blue'>Special Non-Working Day/s</h1>
                                    <h1 className='md:text-md text-sm font-akagi font-medium text-gray'>The dates below will be unavailable for reservation.</h1>
                                </div>

                                <div className='grid grid-cols-[60px_1fr] gap-2 items-center font-akagi font-bold text-gray'>
                                    <h1>Day:</h1>
                                    <input 
                                        value={date} 
                                        onChange={(e) => setDate(e.target.value)} 
                                        type="date"
                                        min={minDate}
                                        className="w-fit rounded-lg border border-gray px-3 py-1 focus:outline-none"
                                    />

                                    <h1>Event:</h1>
                                    <input 
                                        value={event} 
                                        onChange={(e) => {setEvent(e.target.value)}} 
                                        type='text' 
                                        className='w-fit rounded-lg border border-gray px-3 py-1 focus:outline-none'
                                    />
                                </div>

                                <div 
                                    onClick={submitNonWorking}
                                    className={`cursor-pointer ${
                                        event === "" || date === "" ? "hidden" : "block"
                                    } 
                                    
                                    ${loading ? "disabled opacity-20" : "bg-yellow"} w-fit rounded-lg px-4 py-1 font-akagi font-bold text-navyblue`}
                                >
                                    Add
                                </div>

                                <div className='flex flex-col gap-1 font-akagi font-bold text-gray'>

                                        <div className='hidden md:block items-center text-center md:grid md:grid-cols-[100px_1fr_20px] px-2 rounded-lg font-akagi text-gray  font-medium'>
                                            <div className=''>
                                                Date
                                            </div>

                                            <div className=''>
                                                Event
                                            </div>

                                        </div>

                                        
                                        <div className='flex flex-col gap-2'>
                                            {nonWorking.map((non) => (
                                                <div className='border border-gray/50 md:items-center md:gap-3 md:text-center font-medium flex flex-col md:grid md:grid-cols-[100px_1fr_20px] p-2 rounded-lg'>
                                                    <div className=''>
                                                        {non.date}
                                                    </div>

                                                    <div className=''>
                                                        {non.event_name}
                                                    </div>

                                                    <IoMdRemove 
                                                        onClick={() => deleteNonWorking(non.id)}
                                                        className='cursor-pointer text-xl'/>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        
                                        
                                        
                                </div>
                                
                            </div>

                        </motion.div>
                    }

                    {activeTab === "revenueDeductions" &&
                        <>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full rounded-xl bg-[#ebebeb] border border-gray/60"
                            >
                                <div className='w-full p-5 md:border-r-1 md:border-gray/60 flex flex-col gap-5'>

                                    {/*Title*/}
                                    <div className='w-full flex flex-col gap-1'>
                                        <h1 className='md:text-2xl text-xl font-akagi font-bold tracking-wide text-blue'>Add a Revenue Deduction</h1>
                                    </div>

                                    <div className='w-full lg:grid lg:grid-cols-2 flex flex-col gap-3 font-akagi font-bold text-gray'>
                                        <div className='flex flex-col gap-1'>
                                            <h1>Type</h1>
                                            <input onChange={(e) => setType(e.target.value)} value={type} type='text' className='px-2 py-1 rounded-lg border border-gray focus:outline-none'/>

                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <h1>Percentage/Amount</h1>
                                            <div className='flex flex-row gap-3'>
                                                <input onChange={(e) => setPercentage(e.target.value)} value={percentage} type='number' className='w-full px-2 py-1 rounded-lg border border-gray focus:outline-none'/>
                                                <div className='grid grid-cols-2 rounded-lg border border-blue'>
                                                    <div 
                                                        onClick={() => {setPercent("%")}}
                                                        className={`${percent === "%" ? "bg-blue text-[#ffffff]" : "text-blue"} px-4 py-1 rounded-tl-md rounded-bl-md`}>
                                                        %
                                                    </div>

                                                    <div 
                                                        onClick={() => {setPercent("P")}}
                                                        className={`${percent === "P" ? "bg-blue text-[#ffffff]" : "text-blue"} px-4 py-1 rounded-tr-md rounded-br-md text-[#ffffff]`}>
                                                        P
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-3'>
                                            <div className='flex flex-col gap-1'>
                                                <h1>Payment Occurence</h1>
                                                <div className='flex flex-row gap-10 px-3'>
                                                    <div className='flex flex-row gap-1'>
                                                        <input type='radio' value='Periodic' checked={paymentOccurence === 'Periodic'} onChange={handleChange}/>
                                                        <h1 className='font-medium'>Periodic</h1>
                                                    </div>

                                                    <div className='flex flex-row gap-1'>
                                                        <input type='radio' value='One-time' checked={paymentOccurence === 'One-time'} onChange={handleChange}/>
                                                        <h1 className='font-medium'>One-time</h1>
                                                    </div>
                                                </div>
                                            </div>

                                            {paymentOccurence === "Periodic" &&
                                                <>
                                                    <div className="relative flex flex-row gap-5">
                                                        <div className="relative">
                                                            <div 
                                                                onClick={() => {setOpen(!open)}}
                                                                className="w-50 flex flex-row items-center justify-between border border-gray/60 px-2 py-1 rounded-lg text-md font-medium cursor-pointer">
                                                                {periodicOccurence}
                                                                <IoMdArrowDropdown className="text-xl" />
                                                            </div>

                                                            {open &&
                                                                <div className="absolute top-full left-0 mt-1 w-50 bg-white border border-gray/60 rounded-lg shadow-md z-50">
                                                                    {periodicOccurenceOption.map((option) => (
                                                                        <div
                                                                            key={option}
                                                                            onClick={() => {
                                                                                setPeriodicOccurence(option);
                                                                                setOpen(false);
                                                                            }}
                                                                            className="py-2 px-2 cursor-pointer hover:bg-gray-100"
                                                                        >
                                                                            {option}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            }   
                                                        </div>
                                                    </div>
                                                </>
                                            }

                                            {paymentOccurence === "One-time" &&
                                                <div className='flex flex-row gap-5'>
                                                    <div className='w-fit flex flex-row items-center justify-between border border-gray/60 px-2 py-1 rounded-lg text-md font-medium'>
                                                        <input type='date' value={dateOccurence} onChange={(e) => setDateOccurence(e.target.value)}/>
                                                    </div>
                                                </div>
                                            }
                                        </div>

                                        
                                    </div>

                                    <div
                                        onClick={handleAdd}
                                        className={`${
                                            paymentOccurence === "Periodic" &&
                                            (!type || percentage === null)
                                                ? "hidden"
                                                : "block"
                                        } ${
                                            paymentOccurence === "One-time" &&
                                            (!type || percentage === null || !dateOccurence)
                                                ? "hidden"
                                                : "block"
                                        } bg-yellow rounded-lg px-3 py-1 w-fit font-bold text-navyblue font-akagi cursor-pointer hover:scale-110 transition-all duration-300`}
                                    >
                                        Submit
                                    </div>

                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="w-full rounded-xl bg-[#ebebeb] border border-gray/60"
                            >
                                <div className='w-full p-5 md:border-r-1 md:border-gray/60 flex flex-col gap-5'>

                                    {/*Title*/}
                                    <div className='w-full flex flex-col gap-1'>
                                        <h1 className='md:text-2xl text-xl font-akagi font-bold tracking-wide text-blue'>Revenue Deductions</h1>

                                        <div className='items-center w-full hidden md:grid md:grid-cols-[1fr_50px_1fr_1fr_1fr_20px] px-3 py-1 rounded-xl font-akagi font-bold text-gray text-center'>
                                                <h1>Type</h1>
                                                <h1>%</h1>
                                                <h1>Amount</h1>
                                                <h1>Period</h1>
                                                <h1>Due Date</h1>

                                            </div>
                                        <div className='w-full rounded-xl md:p-2 py-2 font-akagi font-medium text-gray md:text-center flex flex-col gap-2'>
                                            
                                            {deductions.map((deduction) => (
                                                <div 
                                                    key={deduction.id}
                                                    onClick={() => {setDropDown(!dropDown)}}
                                                    className='w-full flex flex-col bg-[#ffffff] border border-gray/40 py-2 px-2 rounded-xl'>

                                                    <div 
                                                        
                                                        className='items-center w-full md:grid md:grid-cols-[1fr_50px_1fr_1fr_1fr_20px] flex justify-between text-center'
                                                    >
                                                        <h1>{deduction.type}</h1>
                                                        <h1 className='hidden md:block'>{deduction.calculation === "Percentage" ? deduction.value : "-"}</h1>
                                                        <h1 className='hidden md:block'>{deduction.calculation === "Fixed Amount" ? "P"+deduction.value : "-"}</h1>
                                                        <h1 className='hidden md:block'>
                                                            {deduction.occurence || "-"}
                                                        </h1>

                                                        <h1 className='hidden md:block'>
                                                            {deduction.deadline || "-"}
                                                        </h1>
                                                        <IoMdRemove  
                                                            onClick={() => deleteRevenueDeduction(deduction.id)}
                                                            className='text-red-500 hidden md:block text-xl cursor-pointer'
                                                        />
                                                        <RiArrowDropDownLine 
                                                            onClick={() => {dropDown(!dropDown)}}
                                                            className='text-xl md:hidden'/>
                                                            
                                                    </div>

                                                    {dropDown &&
                                                        <div className='pt-2 md:hidden block items-start'>
                                                            <div className='grid grid-cols-[80px_1fr] gap-2'>
                                                                <h1 className='font-bold'>Percent:</h1>
                                                                <h1>{deduction.calculation === "Percentage" ? deduction.value + "%" : "-"}</h1>
                                                            </div>

                                                            <div className='grid grid-cols-[80px_1fr] gap-2'>
                                                                <h1 className='font-bold'>Amount:</h1>
                                                                <h1>{deduction.calculation === "Fixed Amount" ? "P"+deduction.value : "-"}</h1>
                                                            </div>

                                                            <div className='grid grid-cols-[80px_1fr] gap-2'>
                                                                <h1 className='font-bold'>Occurence:</h1>
                                                                <h1>{deduction.occurence || "-"}</h1>
                                                            </div>

                                                            <div className='grid grid-cols-[80px_1fr] gap-2'>
                                                                <h1 className='font-bold'>Deadline:</h1>
                                                                <h1>{deduction.deadline || "-"}</h1>
                                                            </div>

                                                            <div className='flex justify-end text-red-500'>
                                                                <IoMdRemove
                                                                    onClick={() => deleteRevenueDeduction(deduction.id)}
                                                                />
                                                            </div>
                                                            
                                                        </div>
                                                    }
                                                    
                                                
                                                </div>
                                            ))}
                                            

                                        </div>

                                    </div>

                                </div>
                            </motion.div>
                        </>
                    }

                    {activeTab === "rentalRules" && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full flex-1 min-h-0 overflow-y-auto rounded-xl border border-gray/60 bg-[#ebebeb]"
                        >
                            <div className="flex flex-col gap-6 p-5">

                                {/* HEADER */}
                                <div className="flex flex-col gap-1">
                                    <h1 className="text-xl font-akagi font-bold tracking-wide text-blue md:text-2xl">
                                        Rules & Regulations
                                    </h1>

                                    <p className="text-sm font-akagi font-medium text-gray">
                                        Manage the rules displayed to customers before checkout.
                                        Changes apply to the active rules stored in Supabase.
                                    </p>
                                </div>

                                {/* FEEDBACK MESSAGE */}
                                {rulesMessage.text && (
                                    <div
                                        role="status"
                                        aria-live="polite"
                                        className={`rounded-lg border px-3 py-2 font-akagi text-sm font-medium ${
                                            rulesMessage.type === "success"
                                                ? "border-blue bg-blue/10 text-blue"
                                                : "border-red-200 bg-red-50 text-red-700"
                                        }`}
                                    >
                                        {rulesMessage.text}
                                    </div>
                                )}

                                {!isAdmin ? (
                                    <div className="rounded-xl border border-gray/40 bg-[#ffffff] p-5 font-akagi text-gray">
                                        Only administrators can manage rules and regulations.
                                    </div>
                                ) : (
                                    <>
                                        {/* ADD NEW RULE */}
                                        <div className="flex flex-col gap-4 rounded-xl border border-gray/40 bg-[#ffffff] p-5">
                                            <h2 className="font-akagi text-lg font-bold text-blue">
                                                Add a New Rule
                                            </h2>

                                            <div className="flex flex-col gap-1 font-akagi font-bold text-gray">
                                                <label htmlFor="newRuleTitle">
                                                    Rule Title
                                                </label>

                                                <input
                                                    id="newRuleTitle"
                                                    type="text"
                                                    value={newRuleTitle}
                                                    onChange={(e) =>
                                                        setNewRuleTitle(e.target.value)
                                                    }
                                                    placeholder="e.g. Return Your Bike on Time"
                                                    maxLength={150}
                                                    className="w-full rounded-lg border border-gray px-3 py-2 font-medium focus:outline-none focus:border-blue"
                                                />
                                            </div>

                                            <div className="flex flex-col gap-1 font-akagi font-bold text-gray">
                                                <label htmlFor="newRuleContent">
                                                    Rule Description
                                                </label>

                                                <textarea
                                                    id="newRuleContent"
                                                    value={newRuleContent}
                                                    onChange={(e) =>
                                                        setNewRuleContent(e.target.value)
                                                    }
                                                    placeholder="Enter the rule and its details..."
                                                    rows={4}
                                                    className="w-full resize-y rounded-lg border border-gray px-3 py-2 font-medium focus:outline-none focus:border-blue"
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={addRentalRule}
                                                disabled={rulesSaving}
                                                className={`flex w-fit items-center gap-2 rounded-lg px-4 py-2 font-akagi font-bold text-navyblue transition ${
                                                    rulesSaving
                                                        ? "cursor-not-allowed bg-yellow/50"
                                                        : "cursor-pointer bg-yellow hover:opacity-80"
                                                }`}
                                            >
                                                <FaPlus />
                                                {rulesSaving ? "Saving..." : "Add Rule"}
                                            </button>
                                        </div>

                                        {/* EXISTING RULES */}
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <h2 className="font-akagi text-lg font-bold text-blue">
                                                    Existing Rules
                                                </h2>

                                                <span className="font-akagi text-sm text-gray">
                                                    {rentalRules.length} total
                                                </span>
                                            </div>

                                            {rulesLoading ? (
                                                <div className="rounded-xl bg-[#ffffff] p-8 text-center font-akagi text-gray">
                                                    Loading rules...
                                                </div>
                                            ) : rentalRules.length === 0 ? (
                                                <div className="rounded-xl bg-[#ffffff] p-8 text-center font-akagi text-gray">
                                                    No rules have been added yet.
                                                </div>
                                            ) : (
                                                rentalRules.map((rule, index) => (
                                                    <div
                                                        key={rule.id}
                                                        className="flex flex-col gap-4 rounded-xl border border-gray/40 bg-[#ffffff] p-4 md:p-5"
                                                    >
                                                        {editingRuleId === rule.id ? (
                                                            <>
                                                                <div className="flex flex-col gap-1 font-akagi font-bold text-gray">
                                                                    <label>
                                                                        Rule Title
                                                                    </label>

                                                                    <input
                                                                        type="text"
                                                                        value={editRuleTitle}
                                                                        onChange={(e) =>
                                                                            setEditRuleTitle(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        maxLength={150}
                                                                        className="w-full rounded-lg border border-gray px-3 py-2 font-medium focus:outline-none focus:border-blue"
                                                                    />
                                                                </div>

                                                                <div className="flex flex-col gap-1 font-akagi font-bold text-gray">
                                                                    <label>
                                                                        Rule Description
                                                                    </label>

                                                                    <textarea
                                                                        value={editRuleContent}
                                                                        onChange={(e) =>
                                                                            setEditRuleContent(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        rows={4}
                                                                        className="w-full resize-y rounded-lg border border-gray px-3 py-2 font-medium focus:outline-none focus:border-blue"
                                                                    />
                                                                </div>

                                                                <div className="flex flex-wrap gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            saveRentalRule(rule.id)
                                                                        }
                                                                        disabled={rulesSaving}
                                                                        className="rounded-lg bg-yellow px-4 py-2 font-akagi font-bold text-navyblue transition hover:opacity-80 disabled:opacity-50"
                                                                    >
                                                                        {rulesSaving
                                                                            ? "Saving..."
                                                                            : "Save Changes"}
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={cancelEditingRule}
                                                                        disabled={rulesSaving}
                                                                        className="rounded-lg border border-gray px-4 py-2 font-akagi font-bold text-gray transition hover:bg-gray/10"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                                        <h3 className="font-akagi text-lg font-bold text-blue">
                                                                            {index + 1}. {rule.title}
                                                                        </h3>

                                                                        <p className="whitespace-pre-line break-words font-akagi font-medium leading-relaxed text-gray">
                                                                            {rule.content}
                                                                        </p>

                                                                        <span
                                                                            className={`w-fit rounded-full px-3 py-1 text-xs font-akagi font-bold ${
                                                                                rule.is_active
                                                                                    ? "bg-blue/10 text-blue"
                                                                                    : "bg-gray/20 text-gray"
                                                                            }`}
                                                                        >
                                                                            {rule.is_active
                                                                                ? "Active"
                                                                                : "Inactive"}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-wrap gap-2 border-t border-gray/20 pt-4">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            startEditingRule(rule)
                                                                        }
                                                                        className="rounded-lg bg-blue px-4 py-2 font-akagi font-bold text-[#ffffff] transition hover:opacity-80"
                                                                    >
                                                                        Edit
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            toggleRentalRule(rule)
                                                                        }
                                                                        className={`rounded-lg px-4 py-2 font-akagi font-bold transition hover:opacity-80 ${
                                                                            rule.is_active
                                                                                ? "bg-gray/20 text-gray"
                                                                                : "bg-yellow text-navyblue"
                                                                        }`}
                                                                    >
                                                                        {rule.is_active
                                                                            ? "Deactivate"
                                                                            : "Activate"}
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            deleteRentalRule(rule.id)
                                                                        }
                                                                        className="rounded-lg bg-red-100 px-4 py-2 font-akagi font-bold text-red-600 transition hover:bg-red-200"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                    
                </div>
            </motion.div>
        </div>
    </>
  )
}

export default Settings
