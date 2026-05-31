
import Navigation from "../layout/Navigation/StaticNavigationPC"
import { IoMdArrowDropdown } from "react-icons/io";

function EBankPayment({payment, onClose}) {

   
  return (
    <>
        <div className='box-model flex flex-col gap-10 flex flex-col justify-center'>
            <Navigation/>

            <div className='flex flex-col gap-5'>
                <h1 className='text-3xl font-akagi font-bold text-[#6D7172]'>Pay with Card</h1>
            </div>

            <div className='lg:grid lg:grid-cols-2 flex flex-col lg:gap-30 gap-10'>

                <div className='flex flex-col gap-4'>

                    <div className='flex flex-col gap-2'>
                        <h1 className='text-lg font-akagi font-bold text-[#979B9D]'>Email</h1>
                        <div className='w-full bg-[#C6C6C6] rounded-lg px-2 py-1'>
                            <input
                                type="email"
                                className="w-full font-akagi font-md font-bold text-[#6D7172]"
                                placeholder="juandelacruz@gmail.com"
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <h1 className='text-lg font-akagi font-bold text-[#979B9D]'>Credit Card Number</h1>
                        <div className='w-full bg-[#C6C6C6] rounded-lg px-2 py-1'>
                            <input
                                type="text"
                                className="w-full font-akagi font-md font-bold text-[#6D7172]"
                                placeholder="•••• •••• ••••"
                                maxLength={19}
                                onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, ""); // remove non-numbers
                                    value = value.replace(/(.{4})/g, "$1-").trim();

                                    // remove extra dash at end
                                    if (value.endsWith("-")) {
                                    value = value.slice(0, -1);
                                    }

                                    e.target.value = value;
                                }}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <h1 className='text-lg font-akagi font-bold text-[#979B9D]'>Cardholder Name</h1>
                        <div className='w-full bg-[#C6C6C6] rounded-lg px-2 py-1'>
                            <input
                                type="text"
                                className="w-full font-akagi font-md font-bold text-[#6D7172]"
                                placeholder="Juan Dela Cruz"
                            />
                        </div>
                    </div>

                    <div className='w-full flex flex-row gap-3'>
                        <div className='w-full flex flex-col gap-2'>
                            <h1 className='text-lg font-akagi font-bold text-[#979B9D]'>Expiration Date</h1>

                            <div className='w-full bg-[#C6C6C6] rounded-lg px-2 py-1'>
                                <input
                                    type="text"
                                    className="w-full font-akagi font-md font-bold text-[#6D7172]"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, ""); // numbers only

                                        // limit to 4 digits
                                        value = value.slice(0, 4);

                                        // format as MM/YY
                                        if (value.length >= 3) {
                                        value = `${value.slice(0, 2)}/${value.slice(2)}`;
                                        }

                                        // validate month
                                        const month = parseInt(value.slice(0, 2));

                                        if (month > 12) {
                                        value = "12" + value.slice(2);
                                        } else if (month === 0) {
                                        value = "";
                                        }

                                        e.target.value = value;
                                    }}
                                />
                            </div>
                        </div>

                        <div className='w-full flex flex-col gap-2'>
                            <h1 className='text-lg font-akagi font-bold text-[#979B9D]'>CVV</h1>

                            <div className='w-full bg-[#C6C6C6] rounded-lg px-2 py-1'>
                               <input
                                    type="text"
                                    className="w-full font-akagi font-md font-bold text-[#6D7172]"
                                    placeholder="CVV"
                                    maxLength={3}
                                    onChange={(e) => {
                                        e.target.value = e.target.value.replace(/\D/g, "");
                                }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-auto flex flex-col gap-3'>
                    <div className='w-full flex flex-row justify-between gap-3'>
                        <h1 className='text-lg font-akagi font-bold text-gray'>Subtotal</h1>
                        <h1 className='text-lg font-akagi font-bold text-gray'>P250</h1>
                    </div>

                    <div className='w-full flex flex-row justify-between gap-3'>
                        <h1 className='text-lg font-akagi font-bold text-gray'>Tax</h1>
                        <h1 className='text-lg font-akagi font-bold text-gray'>P30</h1>
                    </div>

                    <div className='w-full h-0.5 bg-gray'></div>

                    <div className='w-full flex flex-row justify-between gap-3'>
                        <h1 className='text-xl font-akagi font-bold text-gray'>Total</h1>
                        <h1 className='text-xl font-akagi font-bold text-gray'>P300</h1>
                    </div>

                    <div className='w-full flex items-center justify-center rounded-lg bg-blue py-2'>
                        <h1 className='text-lg font-akagi font-bold text-white'>Place Rent</h1>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default EBankPayment
