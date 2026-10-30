import { supabase } from "../../lib/supabase";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

import { MdOutlineAccountCircle, MdWork } from "react-icons/md";
import { RiEdit2Line, RiArrowDropDownLine } from "react-icons/ri";
import { IoPersonSharp, IoCloseSharp } from "react-icons/io5";

import StaticNavigation from "../layout/Navigation/StaticNavigationPC";

function CustomerProfile({
    fullName,
    role,
    email,
    contact,
    id,
    branch,
    firstName,
    lastName,
    username
}) {

    const [edit, setEdit] = useState(false);

    const [editUsername, setEditUsername] = useState(username || "");
    const [editEmail, setEditEmail] = useState(email || "");
    const [editFirstName, setEditFirstName] = useState(firstName || "");
    const [editLastName, setEditLastName] = useState(lastName || "");
    const [editRole, setEditRole] = useState(role || "");
    const [editContact, setEditContact] = useState(contact || "");

    const [editPin, setEditPin] = useState("");
    const [changePin, setChangePin] = useState(false);

    const [editPassword, setEditPassword] = useState("");
    const [changePassword, setChangePassword] = useState(false);

    const [roleDropDown, setRoleDropDown] = useState(false);

    const [loading, setLoading] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    const [feedback, setFeedback] = useState({
        type: "",
        message: ""
    });

    // Keep the fields synchronized if the profile props change.
    useEffect(() => {
        setEditUsername(username || "");
        setEditEmail(email || "");
        setEditFirstName(firstName || "");
        setEditLastName(lastName || "");
        setEditRole(role || "");
        setEditContact(contact || "");
    }, [username, email, firstName, lastName, role, contact]);

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
    };

    const clearFeedback = () => {
        setFeedback({ type: "", message: "" });
    };

    // Reset editable fields to their original values.
    const resetFields = () => {
        setEditFirstName(firstName || "");
        setEditLastName(lastName || "");
        setEditUsername(username || "");
        setEditEmail(email || "");
        setEditContact(contact || "");
        setEditRole(role || "");

        setEditPin("");
        setEditPassword("");

        setChangePin(false);
        setChangePassword(false);
        setRoleDropDown(false);

        clearFeedback();
    };

    // Validate profile information.
    const validateProfile = () => {
        const first = editFirstName.trim();
        const last = editLastName.trim();
        const user = editUsername.trim();
        const phone = editContact.trim();

        if (!first || !last || !user) {
            return "First name, last name, and username are required.";
        }

        if (first.length < 2 || last.length < 2) {
            return "First name and last name must contain at least 2 characters.";
        }

        if (user.length < 3) {
            return "Username must contain at least 3 characters.";
        }

        if (!/^[a-zA-Z0-9_.]+$/.test(user)) {
            return "Username can only contain letters, numbers, underscores, and periods.";
        }

        // Contact number is optional, but must be valid if provided.
        if (phone) {
            const cleanPhone = phone.replace(/[\s()-]/g, "");

            if (!/^(09\d{9}|\+639\d{9})$/.test(cleanPhone)) {
                return "Enter a valid Philippine mobile number (09XXXXXXXXX or +639XXXXXXXXX).";
            }
        }

        if (!["admin", "cashier", "archive", "customer"].includes(editRole)) {
            return "Please select a valid account position.";
        }

        return null;
    };

    // Save profile information only.
    const updateProfile = async () => {
        if (loading) return;

        clearFeedback();

        const validationError = validateProfile();

        if (validationError) {
            showFeedback("error", validationError);
            return;
        }

        setLoading(true);

        try {
            // Get the currently authenticated user.
            const { data: { user }, error: authError } =
                await supabase.auth.getUser();

            if (authError) throw authError;

            if (!user) {
                throw new Error("You are not logged in.");
            }

            console.log("Authenticated user ID:", user.id);
            console.log("Profile ID being updated:", id);
            console.log("IDs match:", user.id === id);

            const cleanContact = editContact.trim().replace(/[\s()-]/g, "");

            const { data, error } = await supabase
                .from("profiles_mod")
                .update({
                    first_name: editFirstName.trim(),
                    last_name: editLastName.trim(),
                    username: editUsername.trim(),
                    contact: cleanContact
                })
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;

            console.log("Updated profile:", data);

            showFeedback("success", "Profile updated successfully.");

            setEdit(false);

        } catch (error) {
            console.error("PROFILE UPDATE ERROR:", error);

            showFeedback(
                "error",
                error.message || "Unable to update profile."
            );

        } finally {
            setLoading(false);
        }
    };

    // Save admin PIN separately.
    const handleUpdatePin = async () => {
        if (loading) return;

        clearFeedback();

        if (!/^\d{6}$/.test(editPin)) {
            showFeedback("error", "Your PIN must contain exactly 6 digits.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase
                .from("pin_mod")
                .upsert(
                    {
                        admin_id: id,
                        pin: editPin
                    },
                    {
                        onConflict: "admin_id"
                    }
                );

            if (error) {
                throw error;
            }

            setEditPin("");
            setChangePin(false);

            showFeedback("success", "Admin PIN updated successfully.");

        } catch (error) {
            console.error("Error updating PIN:", error);

            showFeedback(
                "error",
                error.message || "Unable to update your PIN. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    // Reset employee password using your existing Edge Function.
    const handleResetPassword = async () => {
        if (isResettingPassword) return;

        clearFeedback();

        if (!editPassword) {
            showFeedback("error", "Please enter a new password.");
            return;
        }

        if (editPassword.length < 8) {
            showFeedback("error", "Password must contain at least 8 characters.");
            return;
        }

        setIsResettingPassword(true);

        try {
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
                throw error;
            }

            // Check whether your Edge Function returned an application-level error.
            if (data?.error) {
                throw new Error(data.error);
            }

            setEditPassword("");
            setChangePassword(false);

            showFeedback("success", "Password updated successfully.");

        } catch (error) {
            console.error("Error resetting password:", error);

            showFeedback(
                "error",
                error.message || "Unable to reset the password. Please try again."
            );

        } finally {
            setIsResettingPassword(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#F2F2F2] flex">
            <StaticNavigation />

            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex flex-col flex-1 min-w-0 lg:min-h-screen md:p-7 gap-5"
            >

                <div className="flex flex-col bg-[#ffffff] mt-20 w-full min-h-0 flex-1 rounded-xl md:p-10 md:px-3 py-15 px-7 md:py-7 gap-6 overflow-y-auto scrollbar-none">

                    {/* Profile Header */}
                    <div className="flex flex-row justify-between md:items-center">

                        <div className="w-full flex flex-row justify-between gap-5 items-center">

                            <div className="flex flex-row gap-2 items-center">

                                <MdOutlineAccountCircle className="lg:text-8xl xl:text-9xl text-7xl text-[#148BB8]" />

                                <div className="flex flex-col gap-1">

                                    <div className="flex flex-row flex-wrap gap-3 font-akagi font-bold text-[#505050] items-center">

                                        <h1 className="md:text-2xl text-md">
                                            {fullName || `${firstName || ""} ${lastName || ""}`}
                                        </h1>

                                        <div className="px-2 py-0.5 bg-[#148BB8] rounded-md">
                                            <h1 className="text-xs md:text-md text-[#ffffff] uppercase tracking-wide">
                                                {role}
                                            </h1>
                                        </div>

                                    </div>

                                    <div className="flex flex-row gap-1 md:gap-3 font-akagi font-bold text-[#505050] items-center">

                                        <h1 className="md:text-lg text-xs font-medium first-letter:uppercase">
                                            {role} Account
                                        </h1>

                                        <h1 className="md:text-lg text-xs font-medium">•</h1>

                                        <h1 className="md:text-lg text-xs font-medium">
                                            {branch || "Main Branch"}
                                        </h1>

                                    </div>

                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    if (edit) {
                                        resetFields();
                                        setEdit(false);
                                    } else {
                                        clearFeedback();
                                        setEdit(true);
                                    }
                                }}
                                className={`w-fit h-fit flex cursor-pointer gap-3 px-3 py-2 border-2 ${
                                    edit
                                        ? "border-red-500 text-red-500"
                                        : "border-blue text-[#148BB8]"
                                } items-center font-akagi font-bold md:text-xl rounded-xl`}
                            >
                                {!edit ? (
                                    <RiEdit2Line className="md:text-xl text-lg" />
                                ) : (
                                    <IoCloseSharp className="md:text-xl text-lg" />
                                )}

                                <span className="text-md md:flex hidden">
                                    {!edit ? "Edit Profile" : "Cancel"}
                                </span>
                            </button>

                        </div>

                    </div>

                    {/* Feedback Message */}
                    {feedback.message && (
                        <div
                            className={`w-full rounded-lg px-4 py-3 text-sm font-akagi font-bold border ${
                                feedback.type === "success"
                                    ? "bg-green-50 border-green-300 text-green-700"
                                    : "bg-red-50 border-red-300 text-red-600"
                            }`}
                        >
                            {feedback.message}
                        </div>
                    )}

                    <div className="w-full h-0.5 bg-gray/50 rounded-full" />

                    {/* Basic Information */}
                    <div className="w-full flex flex-col gap-5 md:px-5 tracking-wide">

                        <div className="flex flex-row gap-3 items-center font-akagi font-bold text-[#505050] text-lg md:text-xl">
                            <IoPersonSharp className="text-[#148BB8] text-2xl" />
                            Basic Information
                        </div>

                        <div className="flex flex-col md:grid md:grid-cols-2 gap-3 font-akagi text-sm md:text-lg text-[#505050]">

                            {/* First Name */}
                            <div className="flex flex-col">
                                <h1 className="font-medium">First Name</h1>

                                {!edit ? (
                                    <h1 className="font-bold">{editFirstName || "-"}</h1>
                                ) : (
                                    <input
                                        value={editFirstName}
                                        onChange={(e) => setEditFirstName(e.target.value)}
                                        placeholder="Enter first name"
                                        className="bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray"
                                    />
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="flex flex-col">
                                <h1 className="font-medium">Last Name</h1>

                                {!edit ? (
                                    <h1 className="font-bold">{editLastName || "-"}</h1>
                                ) : (
                                    <input
                                        value={editLastName}
                                        onChange={(e) => setEditLastName(e.target.value)}
                                        placeholder="Enter last name"
                                        className="bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray"
                                    />
                                )}
                            </div>

                            {/* Username */}
                            <div className="flex flex-col">
                                <h1 className="font-medium">Username</h1>

                                {!edit ? (
                                    <h1 className="font-bold">{editUsername || "-"}</h1>
                                ) : (
                                    <input
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                        placeholder="Enter username"
                                        className="bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray"
                                    />
                                )}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                                <h1 className="font-medium">Email Address</h1>
                                <h1 className="font-bold">{editEmail || "-"}</h1>
                                {edit && (
                                    <p className="text-xs text-gray-500">
                                        Email address cannot be changed here.
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col">

                                <h1 className="font-medium">Password</h1>

                                {!edit ? (
                                    <h1 className="font-bold">***********</h1>
                                ) : (
                                    <div className="flex flex-row flex-wrap items-center gap-2">

                                        {!changePassword ? (
                                            <>
                                                <h1 className="font-bold">***********</h1>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        clearFeedback();
                                                        setChangePassword(true);
                                                    }}
                                                    className="cursor-pointer rounded-lg bg-yellow px-4 py-1 text-sm font-akagi font-bold text-navyblue hover:opacity-80 transition"
                                                >
                                                    Change
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    type="password"
                                                    value={editPassword}
                                                    onChange={(e) => setEditPassword(e.target.value)}
                                                    disabled={isResettingPassword}
                                                    placeholder="Enter new password"
                                                    className="w-52 bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray disabled:opacity-50"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={handleResetPassword}
                                                    disabled={isResettingPassword || !editPassword}
                                                    className="flex items-center justify-center gap-2 min-w-[90px] rounded-lg bg-yellow px-4 py-1 font-akagi font-bold text-navyblue transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {isResettingPassword ? (
                                                        <>
                                                            <span className="w-4 h-4 border-2 border-navyblue/30 border-t-navyblue rounded-full animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        "Submit"
                                                    )}
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={isResettingPassword}
                                                    onClick={() => {
                                                        setChangePassword(false);
                                                        setEditPassword("");
                                                        clearFeedback();
                                                    }}
                                                    className="text-red-500 font-bold text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}

                                    </div>
                                )}

                            </div>

                            {/* Contact Number */}
                            <div className="flex flex-col">
                                <h1 className="font-medium">Contact Number</h1>

                                {!edit ? (
                                    <h1 className="font-bold">{editContact || "-"}</h1>
                                ) : (
                                    <input
                                        type="tel"
                                        value={editContact}
                                        onChange={(e) => setEditContact(e.target.value)}
                                        placeholder="09XXXXXXXXX"
                                        maxLength={13}
                                        className="bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray"
                                    />
                                )}
                            </div>

                            {/* Employee ID */}
                            {role !== "customer" && (
                                <div className="flex flex-col">
                                    <h1 className="font-medium">Employee ID</h1>
                                    <h1 className="font-bold">{id}</h1>
                                </div>
                            )}

                            {/* Admin PIN */}
                            {role === "admin" && (
                                <div className="flex flex-col">

                                    <h1 className="font-medium">Admin PIN</h1>

                                    <div className="flex flex-row flex-wrap items-center gap-2">

                                        {!changePin ? (
                                            <>
                                                <h1 className="font-bold">******</h1>

                                                {edit && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            clearFeedback();
                                                            setChangePin(true);
                                                        }}
                                                        className="cursor-pointer rounded-lg bg-yellow px-4 py-1 text-sm font-akagi font-bold text-navyblue hover:opacity-80 transition"
                                                    >
                                                        Change
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <input
                                                    type="password"
                                                    value={editPin}
                                                    onChange={(e) => {
                                                        const value = e.target.value
                                                            .replace(/\D/g, "")
                                                            .slice(0, 6);

                                                        setEditPin(value);
                                                    }}
                                                    inputMode="numeric"
                                                    pattern="[0-9]{6}"
                                                    maxLength={6}
                                                    placeholder="Enter new PIN"
                                                    className="w-52 bg-gray/20 font-bold focus:outline-none px-3 py-1 rounded-lg border border-gray"
                                                />

                                                <button
                                                    type="button"
                                                    disabled={loading || !/^\d{6}$/.test(editPin)}
                                                    onClick={handleUpdatePin}
                                                    className={`rounded-lg px-4 py-1 text-sm font-akagi font-bold transition ${
                                                        /^\d{6}$/.test(editPin) && !loading
                                                            ? "cursor-pointer bg-yellow text-darkblue hover:opacity-80"
                                                            : "cursor-not-allowed bg-gray/30 text-gray"
                                                    }`}
                                                >
                                                    {loading ? "Saving..." : "Submit"}
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={loading}
                                                    onClick={() => {
                                                        setChangePin(false);
                                                        setEditPin("");
                                                        clearFeedback();
                                                    }}
                                                    className="text-red-500 font-bold text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                    {/* Work Details */}
                    {role !== "customer" && (
                        <>
                            <div className="w-full h-0.5 bg-gray/50 rounded-full" />

                            <div className="w-full flex flex-col gap-5 md:px-5 tracking-wide">

                                <div className="flex flex-row gap-3 items-center font-akagi font-bold text-[#505050] text-lg md:text-xl">
                                    <MdWork className="text-[#148BB8] text-2xl" />
                                    Work Details
                                </div>

                                <div className="flex flex-col gap-3 font-akagi text-sm md:text-lg text-[#505050]">

                                    {/* Position */}
                                    <div className="flex flex-col">

                                        <h1 className="font-medium">Position</h1>

                                        <div className={`w-fit ${edit ? "" : "border border-[#505050]/30"} rounded-lg ${!edit ? "px-2 py-1" : ""}`}>

                                            {!edit ? (
                                                <h1 className="font-bold first-letter:uppercase">
                                                    {editRole}
                                                </h1>
                                            ) : (
                                                <div
                                                    onClick={() => setRoleDropDown(!roleDropDown)}
                                                    className="relative cursor-pointer w-80 rounded-lg border border-gray bg-gray/30 px-3 py-1 flex justify-between items-center font-bold"
                                                >

                                                    <h1 className="first-letter:uppercase">
                                                        {editRole}
                                                    </h1>

                                                    <RiArrowDropDownLine className="text-xl" />

                                                    {roleDropDown && (
                                                        <div className="absolute top-full left-0 w-full bg-[#ffffff] rounded-lg border border-[#9E9E9E] z-50 mt-1 shadow-lg">

                                                            {["cashier", "admin", "archive"].map((position) => (
                                                                <div
                                                                    key={position}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEditRole(position);
                                                                        setRoleDropDown(false);
                                                                    }}
                                                                    className="px-3 py-2 hover:bg-gray/70 hover:text-[#ffffff] rounded-md capitalize"
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

                                    {/* Branch */}
                                    <div className="flex flex-col">
                                        <h1 className="font-medium">Branch/Location</h1>
                                        <h1 className="font-bold">{branch || "Main Branch"}</h1>
                                    </div>

                                </div>

                            </div>
                        </>
                    )}

                    {/* Save Profile Button */}
                    {edit && (
                        <button
                            type="button"
                            onClick={updateProfile}
                            disabled={loading}
                            className="w-fit flex items-center justify-center gap-2 min-w-[90px] rounded-lg bg-yellow font-akagi font-bold text-lg text-navyblue px-3 py-1 transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-navyblue/30 border-t-navyblue rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    )}

                </div>

            </motion.div>
        </div>
    );
}

export default CustomerProfile;