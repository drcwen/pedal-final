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
    const [newBikeType, setNewBikeType] = useState(null);
    const [capacity, setCapacity] = useState(null);
    const [pricePerHour, setPricePerHour] = useState(null);
    
    const uploadImage = async (file) => {
        if (!file) return null;

        const formData = new FormData();

        formData.append("file", file);
        formData.append(
            "upload_preset",
            "bike_type_upload"
        );

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
                console.error(data);
                throw new Error("Image upload failed");
            }

            return data.secure_url;

        } catch (error) {
            console.error("Cloudinary error:", error);
            return null;
        }
    };

    const handleSubmit = async () => {

        if (!image) {
            console.log("No image selected");
            return;
        }

        setLoading(true);

        try {
            const imageUrl = await uploadImage(image);

            if (!imageUrl) {
                console.log("Image upload failed");
                return;
            }

            const { data, error } = await supabase
                .from("bike_types_mod")
                .insert({
                    name: newBikeType,
                    image_url: imageUrl, // <-- Cloudinary URL
                    price: pricePerHour,
                    capacity: capacity,
                    is_for_kids: false,
                    is_solo: false
                })
                .select();

            if (error) {
                console.error(error);
                return;
            }

            console.log("Bike created:", data);

        } catch (error) {
            console.error("Submit error:", error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        
        const fetchGPS = async () => {
            const {data, error} = await supabase
                .from("gps_mod")
                .select(`*`);

            if(!error) {
                setGPS(data || []);
            }

            console.log(data);
        }

        const fetchBikes = async () => {
            const {data, error} = await supabase
                .from("bike_types_mod")
                .select(`*,
                    bikes_mod (
                    id,
                    code,
                    bike_type_id,
                    status
                    )`
                );

            if(!error) {
                setBikeTypes(data || []);
            }

            console.log(data);
        }

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
                                    <div className='hidden w-full md:grid md:grid-cols-[1fr_1fr_1fr_100px_50px] gap-2 text-center items-center font-akagi font-bold text-[#9E9E9E]'>
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
                                                className='focus:outline-none font-medium bg-[#EBEBEB] text-[#505050]/50 rounded-lg py-1 px-2'
                                                placeholder='Enter bike type name'/>
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <h1>New SIM Number</h1>
                                            <input 
                                                className='focus:outline-none font-medium bg-[#EBEBEB] text-[#505050]/50 rounded-lg py-1 px-2'
                                                placeholder='Enter bike type name'/>
                                        </div>

                                        <div className='flex flex-col gap-1'>
                                            <h1>New Unique ID/IMEI</h1>
                                            <input 
                                                className='focus:outline-none font-medium bg-[#EBEBEB] text-[#505050]/50 rounded-lg py-1 px-2'
                                                placeholder='Enter bike type name'/>

                                        </div>

                                        <div className='w-full flex flex-row gap-2 justify-end'>
                                            <div 
                                                onClick={() => {setAddGPS(false)}}
                                                className='bg-red-500 rounded-lg px-2 py-1 text-[#ffffff] hover:bg-red-500 transition-all duration-300 hover:scale-103 cursor-pointer'>
                                                Cancel
                                            </div>

                                            <div className='bg-green-500 rounded-lg px-2 py-1 text-[#ffffff] hover:bg-green-500 transition-all duration-300 hover:scale-103 cursor-pointer'>
                                                Save
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>    
                        }

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
