
import { RiArrowDropDownLine } from "react-icons/ri";
import { RiArrowDropUpLine } from "react-icons/ri";
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from 'react';
import OngoingBikesOrders from "./OngoingBikesOrders"
import { supabase } from "../../../../lib/supabase"

function Extend({extendOrder, setExtendOrder }) {

    
  return (
    <>
        
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg">
                <h1>Extend {extendOrder.type}</h1>

                <button onClick={() => setExtendOrder(null)}>
                    Close
                </button>
            </div>
        </div>
                                
    </>
  )
}

export default Extend
