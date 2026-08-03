import { useState } from 'react';


function Payment({total, setPayment}) {

    const [active, setActive] = useState("Cash");
    const [cashAmount, setCashAmount] = useState(null);

    const handleChange = (e) => {
        setCashAmount(e.target.value);

        if (!isNaN(value)) {
            setCashAmount(value);
        }
    };

  return (
    <>
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 sm:px-10 px-5 md:px-20 lg:px-60 xl:px-100">
            <div className="w-full bg-[#F0F0F0] p-6 rounded-xl font-akagi font-bold text-lg text-gray flex flex-col gap-5">
                <h1 className='text-3xl text-navyblue'>Payment</h1>

                <div className='border-2 border-blue rounded-xl w-fit'>
                    <div className='grid grid-cols-2'>
                        <div 
                            onClick={() => {setActive("Cash")}}
                            className={`${active === "Cash" ? "bg-blue text-[#ffffff]" : "text-blue"} rounded-tl-md rounded-bl-md text-center px-3 py-1 cursor-pointer`}>
                            Cash
                        </div>

                        <div 
                            onClick={() => {setActive("GCash")}}
                            className={`${active === "GCash" ? "bg-blue text-[#ffffff]" : "text-blue"} rounded-br-md rounded-tr-md text-center px-3 py-1 cursor-pointer`}>
                            GCash
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className='flex flex-row gap-2 items-center'>
                        <h1>Payment:</h1>
                        <h1 className='text-blue'>P{total}</h1>
                    </div>

                    <div className={`flex flex-row gap-2 items-center ${cashAmount === null || 0 ? "hidden" : undefined}`}>
                        <h1>Change:</h1>
                        <h1 className={`text-blue`}>P{cashAmount === null || 0 ? undefined : cashAmount - total}</h1>
                    </div>
                </div>

                {active === "Cash" &&
                    <div className='w-full rounded-xl p-3 font-akagi font-bold text-gray text-xl'>
                        
                        <div className='pb-5'>
                            <input 
                                placeholder="Amount"
                                value={cashAmount}
                                onChange={handleChange}
                                className='bg-gray border-2 border-gray w-full text-[#ffffff] rounded-xl focus:outline-none px-3 py-2 font-bold'/>
                        </div>
                        
                        <div className='grid grid-cols-3 gap-3'>
                            
                            <div
                                onClick={150 < total ? undefined : () => setCashAmount(150)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 150 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${150 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                150
                            </div>

                            <div
                                onClick={() => setCashAmount(200)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 200 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${200 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                200
                            </div>

                            <div
                                onClick={250 < total ? undefined : () => setCashAmount(250)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 250 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${250 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                250
                            </div>

                            <div
                                onClick={300 < total ? undefined : () => setCashAmount(300)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 300 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${300 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                300
                            </div>

                            <div
                                onClick={350 < total ? undefined : () => setCashAmount(350)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 350 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${350 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                350
                            </div>
                            
                            <div
                                onClick={450 < total ? undefined : () => setCashAmount(450)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 450 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${450 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                450
                            </div>

                            <div
                                onClick={500 < total ? undefined : () => setCashAmount(500)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 500 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${500 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                500
                            </div>

                            <div
                                onClick={1000 < total ? undefined : () => setCashAmount(1000)}
                                className={`
                                    rounded-lg p-3 border-2 border-gray text-center items-center justify-center
                                    ${cashAmount === 1000 ? "bg-gray text-[#ffffff]" : "text-gray"}
                                    ${1000 < total ? "pointer-events-none opacity-20" : "cursor-pointer"}
                                `}
                            >
                                1000
                            </div>

                            <div 
                                onClick={() => {setCashAmount(null)}}
                                className={`rounded-lg p-3 border-2 border-gray text-center items-center justify-center ${cashAmount === null ? `bg-gray text-[#ffffff]` : `text-gray   `}`}>
                                Custom
                            </div>

                        </div>

                    </div>
                                    
                }

                {active === "GCash" &&
                    <div className=''>
                        
                    </div>
                }

                <div className='flex flex-row justify-between'>
                    <div 
                        onClick={() => setPayment(false)}
                        className='rounded-lg px-2 py-1 border cursor-pointer '>
                        Close
                    </div>

                    <div className={`${cashAmount < total ? "pointer-events-none opacity-20" : undefined} rounded-lg px-2 py-1 cursor-pointer bg-blue text-[#ffffff]`}>
                        Continue
                    </div>
                </div>
            </div>
        </div>
                                
    </>
  )
}

export default Payment
