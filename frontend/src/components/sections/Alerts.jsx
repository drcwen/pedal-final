import Navigation from "../../components/layout/Navigation/StaticNavigationPC"
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

function Alerts({bikeId}) {

    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getBike = async () => {

            setLoading(true);

            const { data, error } = await supabase
                .from("bikes_mod")
                .select(`
                    *,
                    bike_types_mod (
                        *
                    )
                `)
                .eq("id", bikeId)
                .single();

            if (error) {
                console.error("Error getting bike:", error);
                setBike(null);
            } else {
                setBike(data);
            }

            setLoading(false);
        };

        if (bikeId) {
            getBike();
        }

    }, [bikeId]);


    if (loading) {
        return <div>Loading bike information...</div>;
    }

    if (!bike) {
        return <div>Bike not found.</div>;
    }

  return (
    <>

        <div className='w-full min-h-screen bg-[#f7f7f7]'>

            <Navigation />     
            <div className='w-full flex flex-col gap-10 py-30 px-7 lg:px-20 font-akagi font-bold text-gray'>
                <div className='flex flex-col gap-1'>
                    <h1 className='text-4xl tracking-wide font-extrabold text-blue'>Alerts</h1>
                    <h1 className='text-md font-medium text-gray'>Send alert to the rent shop for emergencies and concerns.</h1>
                </div>
                <div className='lg:w-1/2 w-full flex flex-col gap-2 lg:text-xl'>
                    <div className='grid grid-cols-[100px_1fr] gap-2'>
                        <h1>Bike ID:</h1>
                        <h1 className='font-medium'>{bike.code}</h1>
                    </div>

                    <div className='grid grid-cols-[100px_1fr] gap-2'>
                        <h1>Bike Type:</h1>
                        <h1 className='font-medium'>{bike?.bike_types_mod?.name}</h1>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <h1>Concern/Issue:</h1>
                        <textarea 
                            type='text' 
                            placeholder='Specify your concern/issue here'
                            rows={6}
                            className='focus:outline-none lg:text-lg text-md font-medium text-gray px-3 py-1 bg-gray/20 rounded-xl'/>
                    </div>
                </div>
            </div>
        </div>
        

    </>
  )
}

export default Alerts
