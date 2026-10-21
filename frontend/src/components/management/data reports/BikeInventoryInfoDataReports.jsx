import { supabase } from "../../../lib/supabase"
import { useState, useEffect } from "react";

function BikeInventoryInfoDataReports({ bikeCode, bikeId, status, startDate, endDate }) {

    const [loading, setLoading] = useState(true);
    const [rentalStats, setRentalStats] = useState({
        rental_count: 0,
        total_rental_hours: 0,
        total_earnings: 0,
    });

    const fetchBikeRentalStats = async (bikeId, startDate, endDate) => {
        const { data, error } = await supabase.rpc(
            "get_bike_rental_stats",
            {
                p_start_date: startDate,
                p_end_date: endDate,
                p_bike_id: bikeId,
            }
        );

        if (error) {
            console.error("Error fetching bike rental stats:", error);
            return null;
        }

        return data?.[0] ?? {
            rental_count: 0,
            total_rental_hours: 0,
            total_earnings: 0,
        };
    };

    useEffect(() => {
        let isMounted = true;

        const loadRentalStats = async () => {
            if (!bikeId || !startDate || !endDate) {
                setLoading(false);
                return;
            }

            setLoading(true);

            const stats = await fetchBikeRentalStats(
                bikeId,
                startDate,
                endDate
            );

            if (isMounted) {
                if (stats) {
                    setRentalStats(stats);
                }

                setLoading(false);
            }
        };

        loadRentalStats();

        return () => {
            isMounted = false;
        };
    }, [bikeId, startDate, endDate]);

    const formatCurrency = (amount) =>
        `₱${Number(amount ?? 0).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;



  return (
    <>

            <div className='md:px-3 px-6 bg-[#ffffff] border border-[#C9C9C9] rounded-lg py-2 flex flex-row justify-between md:grid md:grid-cols-[1fr_1fr_1fr_1fr_30px] gap-2 font-akagi font-bold text-gray text-md text-center'>
                <div className=''>
                    {bikeCode}
                </div>

                <div className="hidden md:block">
                    {loading ? "Loading..." : rentalStats.rental_count}
                </div>

                <div className="hidden md:block">
                    {loading
                        ? "Loading..."
                        : formatCurrency(rentalStats.total_earnings)}
                </div>

                <div className=''>
                    {status}
                </div>

                <div className='flex items-center justify-center'>
                    
                </div>
          </div>
    </>
  )
}

export default BikeInventoryInfoDataReports
