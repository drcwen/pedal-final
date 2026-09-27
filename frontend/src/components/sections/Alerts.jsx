
import Navigation from "../../components/layout/Navigation/StaticNavigationPC"
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useParams } from "react-router-dom";

function Alerts() {

    const { bikeId } = useParams();

    const [bike, setBike] = useState(null);
    const [loading, setLoading] = useState(true);
    const [concern, setConcern] = useState("");
    const [response, setResponse] = useState("");
    const [responseType, setResponseType] = useState("");

    const submitAlert = async () => {

        if (!concern.trim()) {
            setResponse("Please specify your concern or issue.");
            setResponseType("error");
            return;
        }

        setLoading(true);
        setResponse("");

        const { error } = await supabase
            .from("alerts_mod")
            .insert({
                bike_id: bike.id,
                bike_type_id: bike?.bike_types_mod?.id,
                concern: concern.trim(),
                status: "Ongoing"
            });

        if (error) {

            console.error("Error adding alert:", error);

            setResponse("Failed to send your alert. Please try again.");
            setResponseType("error");

        } else {

            setResponse(
                "Your alert has been sent successfully. The rent shop has been notified."
            );
            setResponseType("success");

            // Clear the textarea after successful submission
            setConcern("");
        }

        setLoading(false);
    };


    useEffect(() => {

        const fetchBike = async () => {

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

                console.error("Error fetching bike:", error);
                setBike(null);

            } else {

                setBike(data);
            }

            setLoading(false);
        };

        fetchBike();

    }, [bikeId]);


    if (loading && !bike) {
        return <div>Loading bike information...</div>;
    }

    if (!bike) {
        return <div>Bike not found.</div>;
    }


    return (
        <>

            <div className="w-full min-h-screen bg-[#f7f7f7]">

                <Navigation />

                <div className="w-full flex flex-col gap-10 py-30 px-7 lg:px-20 font-akagi font-bold text-gray">

                    <div className="flex flex-col gap-1">

                        <h1 className="text-4xl tracking-wide font-extrabold text-blue">
                            Alerts
                        </h1>

                        <h1 className="text-md font-medium text-gray">
                            Send alert to the rent shop for emergencies and concerns.
                        </h1>

                    </div>


                    <div className="lg:w-1/2 w-full flex flex-col gap-2 lg:text-xl">

                        <div className="grid grid-cols-[100px_1fr] gap-2">

                            <h1>Bike ID:</h1>

                            <h1 className="font-medium">
                                {bike.code}
                            </h1>

                        </div>


                        <div className="grid grid-cols-[100px_1fr] gap-2">

                            <h1>Bike Type:</h1>

                            <h1 className="font-medium">
                                {bike?.bike_types_mod?.name}
                            </h1>

                        </div>


                        <div className="flex flex-col gap-2">

                            <h1>Concern/Issue:</h1>

                            <textarea
                                onChange={(e) => setConcern(e.target.value)}
                                value={concern}
                                placeholder="Specify your concern/issue here"
                                rows={6}
                                disabled={loading}
                                className="focus:outline-none lg:text-lg text-md font-medium text-gray px-3 py-1 bg-gray/20 rounded-xl"
                            />

                        </div>

                    </div>


                    <div className="flex flex-col gap-3">

                        <div
                            onClick={!loading ? submitAlert : undefined}
                            className={`w-fit rounded-lg text-white font-akagi font-bold px-3 py-0.5
                                ${
                                    loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue cursor-pointer"
                                }`}
                        >
                            {loading ? "Loading..." : "Submit"}
                        </div>


                        {response && (

                            <div
                                className={`w-fit px-4 py-2 rounded-lg font-medium text-sm
                                    ${
                                        responseType === "success"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {response}
                            </div>

                        )}

                    </div>

                </div>

            </div>

        </>
    )
}

export default Alerts
