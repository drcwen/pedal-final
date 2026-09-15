    import Sidebar from "../sidebar/Sidebar"
    import SidebarMobile from "../sidebar/SidebarMobile"
    import { useState, useEffect } from "react";
    import { motion } from "motion/react"
    import { FaPlus } from "react-icons/fa";
    import { FaTools } from "react-icons/fa";
    import BikeRow from "./Bikes/BikeRow"
    import { MdModeEditOutline } from "react-icons/md";
    import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
    import { RiImageAddFill } from "react-icons/ri";
    import GPSRow from "./GPS/GPSRow"
    import Maintenance from "./Bikes/Maintenance/Maintenance"
    import { supabase } from "../../../lib/supabase"

    function Inventory() {

        const [activeTab, setActiveTab] = useState("Bike");
        const [addType, setAddType] = useState(false);
        const [addGPS, setAddGPS] = useState(false);

        const [bikeTypes, setBikeTypes] = useState([]);
        const [gps, setGPS] = useState([]);

        const [maintenance, setMaintenance] = useState(false);

        // Add Bike Type Variables
        const [loading, setLoading] = useState(false);
        const [image, setImage] = useState(null);
        const [newBikeType, setNewBikeType] = useState("");
        const [capacity, setCapacity] = useState("");
        const [pricePerHour, setPricePerHour] = useState("");

        //Edit status of each bikes
        const [bikeEdit, setBikeEdit] = useState(false);
        const [fetchBikeCode, setFetchBikeCode] = useState(null);
        const [fetchBikeStatus, setFetchBikeStatus] = useState(false);
        const [dropDown, setDropDown] = useState(false);

        const [bikeError, setBikeError] = useState("");
        const [gpsError, setGpsError] = useState("");
        

        //Adding new GPS
        const [gpsName, setGpsName] = useState("");
        const [simNumber, setSimNumber] = useState("");
        const [confirmAddGps, setConfirmAddGps] = useState(false);
        const [gpsLoading, setGpsLoading] = useState(false);

        //Edit bike type details
        const [editBikeType, setEditBikeType] = useState(false);
        const [editBikeImage, setEditBikeImage] = useState(null);
        const [editBikeImageFile, setEditBikeImageFile] = useState(null);
        const [editBikeTypeId, setEditBikeTypeId] = useState(null);

        const [bikeType, setBikeType] = useState("");
        const [price, setPrice] = useState("");
        const [bikeCapacity, setBikeCapacity] = useState("");

        const [editLoading, setEditLoading] = useState(false);

        const handleEditBikeImage = (e) => {
            const file = e.target.files[0];

            if (!file) return;

            setEditBikeImageFile(file);

            const previewUrl = URL.createObjectURL(file);
            setEditBikeImage(previewUrl);
        };

        const handleEditBikeTypeSubmit = async () => {

            console.log("EDIT SUBMIT CLICKED");
            console.log("ID:", editBikeTypeId);
            console.log("Bike Type:", bikeType);
            console.log("Capacity:", bikeCapacity);
            console.log("Price:", price);
            console.log("Image File:", editBikeImageFile);

            if (!editBikeTypeId) {
                console.error("NO BIKE TYPE ID");
                return;
            }

            setEditLoading(true);

            try {

                let imageUrl = editBikeImage;

                // Only upload if a new image was selected
                if (editBikeImageFile) {

                    console.log("Uploading new image...");

                    imageUrl = await uploadImage(editBikeImageFile);

                    console.log("New image URL:", imageUrl);

                    if (!imageUrl) {
                        console.error("IMAGE UPLOAD FAILED");
                        return;
                    }
                }

                console.log("Updating Supabase...");

                const { data, error } = await supabase
                    .from("bike_types_mod")
                    .update({
                        name: bikeType,
                        capacity: Number(bikeCapacity),
                        price: Number(price),
                        image_url: imageUrl
                    })
                    .eq("id", editBikeTypeId)
                    .select();

                if (error) {
                    console.error("SUPABASE UPDATE ERROR:", error);
                    return;
                }

                console.log("UPDATED DATA:", data);

                await fetchBikes();

                setEditBikeType(false);

                setEditBikeImage(null);
                setEditBikeImageFile(null);
                setEditBikeTypeId(null);

                setBikeType("");
                setBikeCapacity("");
                setPrice("");

            } catch (error) {

                console.error("EDIT BIKE TYPE ERROR:", error);

            } finally {

                setEditLoading(false);

            }
        };

        const uploadImage = async (file) => {

            if (!file) return null;

            const formData = new FormData();

            formData.append("file", file);
            formData.append("upload_preset", "bike_type_upload");

            try {

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/dp3vkgxtb/image/upload`,
                    {
                        method: "POST",
                        body: formData
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error("Cloudinary response:", data);
                    throw new Error("Image upload failed");
                }

                return data.secure_url;

            } catch (error) {

                console.error("Cloudinary error:", error);
                return null;

            }
        };

        const fetchBikes = async () => {
            const { data, error } = await supabase
                .from("bike_types_mod")
                .select(`
                    *,
                    bikes_mod (
                        id,
                        code,
                        bike_type_id,
                        status
                    )
                `);

            if (!error) {
                setBikeTypes(data || []);
            } else {
                console.error("Error fetching bikes:", error);
            }
        };

        const fetchGPS = async () => {
            const {data, error} = await supabase
                .from("gps_mod")
                .select(`*`);

            if(!error) {
                setGPS(data || []);
            }

            console.log(data);
        }

        const handleGpsConfirmation = async () => {
            setGpsError("");
            setGpsLoading(true);

            const trimmedGpsName = gpsName.trim();
            const trimmedSimNumber = simNumber.trim();

            try {
                if (!trimmedGpsName) {
                    setGpsError("Please enter a GPS name.");
                    return;
                }

                if (!/^09\d{9}$/.test(trimmedSimNumber)) {
                    setGpsError("SIM number must be exactly 11 digits and start with 09.");
                    return;
                }

                const { data: existingGpsName, error: gpsNameError } = await supabase
                    .from("gps_mod")
                    .select("id")
                    .ilike("code", trimmedGpsName);

                if (gpsNameError) {
                    console.error("Error checking GPS name:", gpsNameError);
                    setGpsError("Unable to check GPS name.");
                    return;
                }

                if (existingGpsName?.length > 0) {
                    setGpsError("This GPS name already exists.");
                    return;
                }

                const { data: existingSim, error: simError } = await supabase
                    .from("gps_mod")
                    .select("id")
                    .eq("sim_number", trimmedSimNumber);

                if (simError) {
                    console.error("Error checking SIM number:", simError);
                    setGpsError("Unable to check SIM number.");
                    return;
                }

                if (existingSim?.length > 0) {
                    setGpsError("This SIM number is already registered.");
                    return;
                }

                setAddGPS(false);
                setConfirmAddGps(true);

            } catch (error) {
                console.error("GPS validation error:", error);
                setGpsError("Something went wrong. Please try again.");

            } finally {
                setGpsLoading(false);
            }
        };


        const handleGpsAdd = async () => {
            setGpsLoading(true);
            setGpsError("");

            const trimmedGpsName = gpsName.trim();
            const trimmedSimNumber = simNumber.trim();

            try {
                const { data, error } = await supabase
                    .from("gps_mod")
                    .insert({
                        code: trimmedGpsName,
                        sim_number: trimmedSimNumber,
                        status: "Available",
                        battery_life: "0"
                    })
                    .select();

                if (error) {
                    console.error("Error creating GPS:", error);

                    if (error.code === "23505") {
                        setGpsError("GPS name or SIM number already exists.");
                    } else {
                        setGpsError("Failed to add GPS.");
                    }

                    return;
                }

                console.log("GPS created:", data);

                await fetchGPS();

                setConfirmAddGps(false);
                setGpsName("");
                setSimNumber("");

            } catch (error) {
                console.error("Submit error:", error);
                setGpsError("Something went wrong. Please try again.");

            } finally {
                setGpsLoading(false);
            }
        };

        const handleSubmit = async () => {

            setBikeError("");

            if (!newBikeType.trim()) {
                setBikeError("Please enter a bike type name.");
                return;
            }

            if (!capacity) {
                setBikeError("Please enter the maximum capacity.");
                return;
            }

            if (!pricePerHour) {
                setBikeError("Please enter the rent price.");
                return;
            }

            setLoading(true);

            try {

                const { data: existingBike, error: checkError } = await supabase
                    .from("bike_types_mod")
                    .select("id, name")
                    .ilike("name", newBikeType.trim());

                if (checkError) {
                    console.error("Error checking bike type:", checkError);
                    setBikeError("Unable to check bike type. Please try again.");
                    return;
                }

                if (existingBike && existingBike.length > 0) {
                    setBikeError("This bike type already exists.");
                    return;
                }

                if (!image) {
                    setBikeError("Please select an image.");
                    return;
                }

                const imageUrl = await uploadImage(image);

                if (!imageUrl) {
                    setBikeError("Image upload failed.");
                    return;
                }

                const { data, error } = await supabase
                    .from("bike_types_mod")
                    .insert({
                        name: newBikeType.trim(),
                        image_url: imageUrl,
                        price: Number(pricePerHour),
                        capacity: Number(capacity),
                        is_for_kids: false,
                        is_solo: false
                    })
                    .select();

                if (error) {
                    console.error("Error creating bike:", error);

                    if (error.code === "23505") {
                        setBikeError("This bike type already exists.");
                    } else {
                        setBikeError("Failed to create bike type.");
                    }

                    return;
                }

                console.log("Bike created:", data);

                await fetchBikes();

                setAddType(false);

                setImage(null);
                setNewBikeType("");
                setCapacity("");
                setPricePerHour("");

            } catch (error) {

                console.error("Submit error:", error);
                setBikeError("Something went wrong. Please try again.");

            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {

            fetchBikes();
            fetchGPS();
        
        }, [])

    return (
        <>

            <div className='w-full h-screen md:bg-[#F2F2F2] flex'>
                <Sidebar active={'inventory'}/>

                {!maintenance ? (
                <>
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}  
                        className='flex-1 p-5'>

                            <SidebarMobile active={'inventory'}/>

                            <div className='flex flex-col bg-[#ffffff] w-full h-full rounded-xl md:p-10 px-3 py-7 gap-5 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#B9B9B9] scrollbar-track-[#E2E2E2]'>

                                <h1 className='md:text-4xl text-2xl font-akagi font-bold tracking-wide text-blue'>Inventory</h1>

                                <div className='md:flex md:flex-row md:justify-between flex flex-col gap-5 '>
                                    {/*Transaction Types*/}
                                        <div className='w-fit rounded-2xl border-3 border-blue grid grid-cols-2'>
                                            <div 
                                                onClick={() => setActiveTab("Bike")}
                                                className={`md:p-2 py-2 flex justify-center px-5 cursor-pointer rounded-tl-xl rounded-bl-xl transition-all
                                                    ${activeTab === "Bike" ? "bg-blue" : "bg-transparent hover:bg-blue/50 transition-all duration-300"}
                                                `}
                                            >
                                                <h1 
                                                    className={`text-md lg:text-lg font-akagi font-bold transition-all
                                                    ${activeTab === "Bike" ? "text-[#ffffff]" : "text-blue hover:text-[#ffffff] transition-all duration-300"}
                                                    `}
                                                >
                                                    Bike
                                                </h1>
                                            </div>

                                            <div 
                                                onClick={() => setActiveTab("gps")}
                                                className={`md:p-2 py-2 rounded-tr-xl rounded-br-xl flex justify-center px-5 cursor-pointer
                                                    ${activeTab === "gps" ? "bg-blue" : "bg-transparent hover:bg-blue/50 transition-all duration-300"}
                                                `}
                                            >
                                                <h1 className={`text-md lg:text-lg font-akagi font-bold px-5 transition-all
                                                    ${activeTab === "gps" ? "text-[#ffffff]" : "text-blue hover:text-[#ffffff] transition-all duration-300"}
                                                    `}>GPS</h1>
                                            </div>
                                        </div>

                                    {activeTab === "Bike" &&

                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}   
                                            className='flex md:flex-row gap-3'
                                        >
                                            <div 
                                                onClick={() => setMaintenance(true)}
                                                className='bg-gray/20 rounded-xl flex items-center px-3 cursor-pointer'>
                                                <FaTools className='text-lg md:text-xl text-red-500'/>
                                            </div>
                                            <div 
                                                onClick={() => {setAddType(true)}}
                                                className='w-fit cursor-pointer bg-blue hover:bg-blue/70 hover:text-[#ffffff] duration-300 transition-all items-center text-center rounded-xl flex flex-row justify-between gap-3 px-3 py-2 md:text-lg text-md font-akagi font-bold text-[#ffffff]'
                                            >
                                                <FaPlus className='text-md md:text-bold text-[#ffffff]'/>
                                                Bike Type
                                            </div>
                                        </motion.div>
                                    }

                                    {activeTab === "gps" &&

                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}   
                                            className='flex md:flex-row gap-3'
                                        >
                                            <div 
                                                onClick={() => {setAddGPS(true)}}
                                                className='w-fit cursor-pointer bg-blue hover:bg-blue/70 hover:text-[#ffffff] duration-300 transition-all items-center text-center rounded-xl flex flex-row justify-between gap-3 px-3 py-2 md:text-lg text-md font-akagi font-bold text-[#ffffff]'>
                                                <FaPlus className='text-md md:text-bold text-[#ffffff]'/>
                                                Add New GPS
                                            </div>
                                        </motion.div>
                                    }
                                </div>

                                {/*GPS Inventory*/}
                                {activeTab === "gps" &&

                                    <div className='flex flex-col gap-3'>
                                        <div className='hidden w-full md:grid md:grid-cols-[1fr_1fr_1fr_50px] gap-2 text-center items-center font-akagi font-bold text-[#9E9E9E]'>
                                            <div className=''>GPS Name</div>
                                            <div className=''>Battery Life</div>
                                            <div className=''>Status</div>
                                            <div className=''>
                                                
                                            </div>
                                            <div className=''>
                                                
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-2'>
                                            {gps.map((jipies) => (
                                                <GPSRow 
                                                    key={jipies.id}
                                                    name={jipies.code}
                                                    status={jipies.status}
                                                    battery={jipies.battery_life + `%`}
                                                    simNumber={jipies.sim_number}
                                                    availableData={jipies.available_data}
                                                />
                                            ))
                                            }
                                        </div>
                                    </div>
                                }

                                {/*Bike Inventory*/}
                                {activeTab === "Bike" &&

                                    <div className='flex flex-col gap-3'>
                                        <div className='hidden md:grid md:grid-cols-[70px_1fr_1fr_1fr_1fr_20px] gap-4 items-center text-center font-akagi font-bold text-gray'>
                                            <h1/>

                                            <h1>Type</h1>

                                            <h1>Max Capacity</h1>

                                            <h1>Rent Per Hour</h1>

                                            <h1></h1>

                                            <h1></h1>
                                        </div>

                                        <div className='flex flex-col gap-2'>

                                            {bikeTypes.map((bikeType) => (
                                                <BikeRow    
                                                    key={bikeType.id}
                                                    image={bikeType.image_url}
                                                    bikeType={bikeType.name}
                                                    capacity={bikeType.capacity}
                                                    price={bikeType.price}
                                                    bikes={bikeType.bikes_mod}
                                                    bikeTypeId={bikeType.id}
                                                    setBikeEdit={setBikeEdit}
                                                    setFetchBikeCode={setFetchBikeCode}
                                                    setFetchBikeStatus={setFetchBikeStatus}
                                                    setEditBikeType={setEditBikeType}
                                                    setEditBikeImage={setEditBikeImage}
                                                    setBikeType={setBikeType}
                                                    setPrice={setPrice}
                                                    setBikeCapacity={setBikeCapacity}
                                                    setEditBikeTypeId={setEditBikeTypeId}       
                                                    setBikeTypes={setBikeTypes}                                             
                                                />
                                            ))}
                                        </div>
                                    </div>
                                }
                            </div>

                            {/*Add GPS*/}
                            {addGPS === true &&
                                <div className='fixed inset-0 bg-black/60 z-50 front flex items-center justify-center'>
                                    <div className='bg-[#ffffff] p-5 rounded-xl flex flex-col gap-5'>

                                        <div className='flex flex-col gap-4 font-akagi font-bold text-gray'>
                                            <div className='flex flex-col gap-1'>
                                                <h1>New GPS Name</h1>
                                                <input 
                                                    value={gpsName}
                                                    onChange={(e) => setGpsName(e.target.value)}
                                                    type='text'
                                                    className='focus:outline-none font-medium bg-[#EBEBEB] text-[#505050]/50 rounded-lg py-1 px-2'
                                                    placeholder='Enter GPS name'
                                                />
                                            </div>

                                            <div className='flex flex-col gap-1'>
                                                <h1>New SIM Number</h1>
                                                <input
                                                    value={simNumber}
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/\D/g, "");

                                                        if (value.length <= 11) {
                                                            setSimNumber(value);
                                                        }
                                                    }}
                                                    type='text'
                                                    inputMode='numeric'
                                                    maxLength={11}
                                                    className='focus:outline-none font-medium bg-[#EBEBEB] text-[#505050]/50 rounded-lg py-1 px-2'
                                                    placeholder='Enter 11-digit SIM number'
                                                />
                                            </div>

                                            {gpsError && (
                                                <div className="text-red-500 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg">
                                                    {gpsError}
                                                </div>
                                            )}

                                            <div className='w-full flex flex-row gap-2 justify-end'>
                                                <div 
                                                    onClick={() => {setAddGPS(false), setSimNumber(""), setGpsName(""), setGpsError("")}}
                                                    className='bg-red-500 rounded-lg px-2 py-1 text-[#ffffff] hover:bg-red-500 transition-all duration-300 hover:scale-103 cursor-pointer'>
                                                    Cancel
                                                </div>

                                                <div 
                                                    onClick={handleGpsConfirmation}
                                                    className='bg-green-500 rounded-lg px-2 py-1 text-[#ffffff] hover:bg-green-500 transition-all duration-300 hover:scale-103 cursor-pointer'>
                                                    Save
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>    
                            }

                            {confirmAddGps && (
                                <div className='fixed inset-0 bg-black/60 z-100 flex items-center justify-center'>
                                    <div className='bg-[#ffffff] p-5 rounded-xl flex flex-col gap-5'>

                                        <div className='flex flex-col gap-4 font-akagi font-bold text-gray items-center'>

                                            <h1 className='text-2xl text-blue'>
                                                Confirm GPS Add
                                            </h1>

                                            <div className='flex flex-col gap-1 items-center'>
                                                <h1 className='text-md font-medium text-gray/70'>
                                                    Check the details of the GPS before adding.
                                                </h1>

                                                <h1 className='text-sm font-medium text-gray/70'>
                                                    Note: You can only archive the GPS after adding.
                                                </h1>
                                            </div>

                                            <div className='flex flex-col gap-2 py-5'>

                                                <div className='grid grid-cols-2 gap-2'>
                                                    <h1 className='font-medium'>
                                                        GPS Name:
                                                    </h1>

                                                    <h1>
                                                        {gpsName}
                                                    </h1>
                                                </div>

                                                <div className='grid grid-cols-2 gap-2'>
                                                    <h1 className='font-medium'>
                                                        Sim Number:
                                                    </h1>

                                                    <h1>
                                                        {simNumber}
                                                    </h1>
                                                </div>

                                            </div>

                                            {gpsError && (
                                                <div className="text-red-500 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg">
                                                    {gpsError}
                                                </div>
                                            )}

                                            <div className='w-full flex flex-row gap-2 justify-end'>

                                                <div
                                                    onClick={() => {setConfirmAddGps(false), setSimNumber(""), setGpsName(""), setGpsError("")}}
                                                    className='bg-red-500 rounded-lg px-2 py-1 text-[#ffffff] hover:bg-red-600 transition-all duration-300 hover:scale-103 cursor-pointer'
                                                >
                                                    Cancel
                                                </div>

                                                <div
                                                    onClick={gpsLoading ? undefined : handleGpsAdd}
                                                    className={`rounded-lg px-2 py-1 text-[#ffffff] transition-all duration-300
                                                        ${
                                                            gpsLoading
                                                                ? "bg-gray-400 cursor-not-allowed"
                                                                : "bg-green-400 hover:bg-green-500 cursor-pointer hover:scale-103"
                                                        }
                                                    `}
                                                >
                                                    {gpsLoading ? "Saving..." : "Save"}
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )}

                            {/*Add Bike Type*/}
                            {addType === true && 
                                <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center'>
                                    <div className='bg-[#ffffff] p-5 rounded-xl flex md:flex-row flex-col gap-5 items-center'>
                                        <div className="flex flex-col gap-2">
                                            <label
                                                htmlFor="bike-image"
                                                className="
                                                    flex flex-col items-center justify-center
                                                    w-full h-32
                                                    border-2 border-dashed border-[#D9D9D9]
                                                    rounded-xl
                                                    bg-[#F8F8F8]
                                                    cursor-pointer
                                                    hover:bg-[#F2F2F2]
                                                    hover:border-blue
                                                    transition
                                                "
                                            >
                                                <span className="text-2xl text-[#979B9D]">
                                                    +
                                                </span>

                                                <span className="font-akagi font-medium text-[#979B9D]">
                                                    {image
                                                        ? image.name
                                                        : "Click to upload image"
                                                    }
                                                </span>

                                                {!image && (
                                                    <span className="text-xs text-[#B0B0B0]">
                                                        PNG, JPG or JPEG
                                                    </span>
                                                )}
                                            </label>

                                            <input
                                                id="bike-image"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setImage(e.target.files[0])}
                                                className="hidden"
                                            />

                                        </div>

                                        <div className='flex flex-col gap-4 font-akagi font-bold text-gray'>
                                            <div className='flex flex-col gap-1'>
                                                <h1>New Bike Type</h1>
                                                <input 
                                                    value={newBikeType}
                                                    onChange={(e) => setNewBikeType(e.target.value)}
                                                    type='text'
                                                    className='focus:outline-none font-medium bg-[#EBEBEB] text-[#505050]/50 rounded-lg py-1 px-2'
                                                    placeholder='Enter bike type name'/>
                                            </div>

                                            <div className='flex flex-col gap-1'>
                                                <h1>Set Maximum Capacity</h1>
                                                <input 
                                                    value={capacity}
                                                    onChange={(e) => setCapacity(e.target.value)}
                                                    max='5'
                                                    type='number'
                                                    className='focus:outline-none font-medium bg-[#EBEBEB] text-[#505050]/50 rounded-lg py-1 px-2'
                                                    placeholder='Enter bike type name'/>
                                            </div>

                                            <div className='flex flex-col gap-1'>
                                                <h1>Set Rent Price Per Hour</h1>
                                                <div className='flex flex-row gap-3 items-center'>
                                                    <input 
                                                        value={pricePerHour}
                                                        onChange={(e) => setPricePerHour(e.target.value)}
                                                        type='number'
                                                        className='focus:outline-none font-medium bg-[#EBEBEB] text-[#505050]/50 rounded-lg py-1 px-2'
                                                        placeholder='Enter bike type name'/>

                                                    <h1 className='font-light'>pesos/hr</h1>
                                                </div>
                                            </div>

                                            {bikeError && (
                                                <div className="text-red-500 text-sm font-medium bg-red-50 px-3 py-2 rounded-lg">
                                                    {bikeError}
                                                </div>
                                            )}

                                            <div className='w-full flex flex-row gap-2 justify-end'>
                                                <div 
                                                    onClick={() => {setAddType(false)}}
                                                    className='bg-red-500 rounded-lg px-2 py-1 text-[#ffffff] hover:bg-red-500 transition-all duration-300 hover:scale-103 cursor-pointer'>
                                                    Cancel
                                                </div>

                                                <div
                                                    onClick={!loading ? handleSubmit : undefined}
                                                    className={`
                                                        rounded-lg px-3 py-2
                                                        text-[#ffffff]
                                                        transition-all duration-300
                                                        flex items-center justify-center
                                                        min-w-[70px]
                                                        ${
                                                            loading
                                                                ? "bg-gray-400 cursor-not-allowed"
                                                                : "bg-green-500 hover:bg-green-600 cursor-pointer hover:scale-103"
                                                        }
                                                    `}
                                                >
                                                    {loading ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                            <span>Saving...</span>
                                                        </div>
                                                    ) : (
                                                        "Save"
                                                    )}

                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>    
                                
                            }

                            {bikeEdit &&
                                <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-5'>
                                    <div className='bg-[#ffffff] w-100 rounded-xl flex flex-col gap-5 p-5 font-akagi font-bold text-gray'>
                                        <div className='w-full flex flex-col gap-4'>
                                            <div className='w-full flex flex-col gap-2'>
                                                <h1 className='text-black/65 text-xl'>Bike ID:</h1>
                                                <div className='bg-gray/20 rounded-lg px-3 py-1'>{fetchBikeCode}</div>
                                            </div>

                                            <div className='w-full flex flex-col gap-2'>
                                                <h1 className='text-black/65 text-xl'>Edit Status:</h1>

                                                <div className='relative'>
                                                    <div
                                                        onClick={() => setDropDown(!dropDown)}
                                                        className='bg-gray/20 rounded-lg px-3 py-1 flex flex-row justify-between items-center cursor-pointer'
                                                    >
                                                        <h1 >{fetchBikeStatus}</h1>
                                                        <RiArrowDropDownLine className='text-xl'/>
                                                    </div>

                                                    {fetchBikeStatus !== "Rented" && dropDown && (
                                                        <div className='absolute top-full left-0 w-full bg-gray/20 rounded-lg border border-gray/40 z-50 mt-1 shadow-lg'>
                                                            <div
                                                                onClick={() => {setFetchBikeStatus("Under Maintenance")
                                                                    setDropDown(!dropDown)
                                                                }}
                                                                className="text-md font-akagi font-medium text-[#6D7172] bg-[#e2e3e4] rounded-tl-md rounded-tr-md hover:bg-gray hover:text-white px-2 py-0.5 cursor-pointer"
                                                            >
                                                                Under Maintenance
                                                            </div>

                                                            <div
                                                                onClick={() => {setFetchBikeStatus("Lost")
                                                                    setDropDown(!dropDown)
                                                                }}
                                                                className="text-md font-akagi font-medium text-[#6D7172] bg-[#e2e3e4] rounded-tl-md rounded-tr-md hover:bg-gray hover:text-white px-2 py-0.5 cursor-pointer"
                                                            >
                                                                Lost
                                                            </div>

                                                            <div
                                                                onClick={() => {setFetchBikeStatus("Disposed")
                                                                    setDropDown(!dropDown)
                                                                }}
                                                                className="text-md font-akagi font-medium text-[#6D7172] bg-[#e2e3e4] rounded-tl-md rounded-tr-md hover:bg-gray hover:text-white px-2 py-0.5 cursor-pointer"
                                                            >
                                                                Disposed
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            
                                        </div>

                                        <div  className='pt-5 flex flex-row justify-between font-akagi font-bold text-gray'>
                                            <div 
                                                onClick={() => {setBikeEdit(false)}}
                                                className='rounded-lg border border-gray px-2 py-0.5 cursor-pointer'>
                                                Back
                                            </div>

                                            <div className='rounded-lg bg-green-400 text-[#ffffff] px-2 py-0.5 cursor-pointer'>
                                                Submit
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {editBikeType &&
                                <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-5'>
                                    <div className='bg-[#ffffff] rounded-xl flex flex-col gap-5 p-5 font-akagi font-bold text-gray'>
                                        <div className='flex flex-row gap-4 items-center'>
                                            <div className='flex flex-col gap-2'>
                                                <div className='flex flex-col gap-2'>

                                                    <label
                                                        htmlFor="edit-bike-image"
                                                        className='cursor-pointer'
                                                    >
                                                        <img
                                                            src={editBikeImage}
                                                            className='border border-gray/50 bg-gray/20 p-2 rounded-xl w-70 h-40 object-contain hover:opacity-70 transition-all duration-300'
                                                        />
                                                    </label>

                                                    <input
                                                        id="edit-bike-image"
                                                        type="file"
                                                        accept="image/png,image/jpeg,image/jpg"
                                                        onChange={handleEditBikeImage}
                                                        className="hidden"
                                                    />

                                                    <div className='flex justify-center'>
                                                        <label
                                                            htmlFor="edit-bike-image"
                                                            className='font-medium text-sm hover:underline cursor-pointer'
                                                        >
                                                            Change photo
                                                        </label>
                                                    </div>

                                                </div>
                                            </div>

                                            <div className='w-full flex flex-col gap-2'>

                                                <div className='flex flex-col gap-1'>
                                                    <h1 className='text-black/60'>Edit Bike Type</h1>
                                                    <input value={bikeType} onChange={(e) => setBikeType(e.target.value)} className='focus:outline-none bg-gray/20 rounded-md px-2 py-1 text-black/60 font-medium'/>
                                                </div>

                                                <div className='flex flex-col gap-1'>
                                                    <h1 className='text-black/60'>Edit Capacity</h1>
                                                    <input value={bikeCapacity} onChange={(e) => setBikeCapacity(e.target.value)} className='focus:outline-none bg-gray/20 rounded-md px-2 py-1 text-black/60 font-medium'/>
                                                </div>

                                                <div className='flex flex-col gap-1'>
                                                    <h1 className='text-black/60'>Edit Rent Price per Hour</h1>
                                                    <input type='number' value={price} onChange={(e) => setPrice(e.target.value)} className='focus:outline-none bg-gray/20 rounded-md px-2 py-1 text-black/60 font-medium'/>
                                                </div>

                                            </div>
                                        </div>
                                        

                                        <div  className='pt-5 flex flex-row justify-between font-akagi font-bold text-gray'>
                                            <div 
                                                onClick={() => {setEditBikeType(!editBikeType)}}
                                                className='rounded-lg border border-gray px-2 py-0.5 cursor-pointer'>
                                                Back
                                            </div>

                                            <div
                                                onClick={!editLoading ? handleEditBikeTypeSubmit : undefined}
                                                className={`
                                                    rounded-lg px-3 py-1 text-[#ffffff]
                                                    transition-all duration-300
                                                    flex items-center justify-center
                                                    min-w-[70px]

                                                    ${
                                                        editLoading
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-green-400 hover:bg-green-500 cursor-pointer"
                                                    }
                                                `}
                                            >
                                                {editLoading ? "Saving..." : "Submit"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                    </motion.div>
                </>
                ) : (
                    <>
                        <SidebarMobile active={'inventory'}/>
                        <Maintenance setMaintenance={setMaintenance} />
                    </>
                )
            }
            </div>
        </>
    )
    }

    export default Inventory
