import { MdOutlineAccountCircle } from "react-icons/md";

function AccountCard({ onClick }) {

  return (
    <>

        <div 
            onClick={onClick}
            className='bg-[#EBEBEB] cursor-pointer border border-[#C8C8C8] p-3 rounded-xl flex flex-col gap-3 items-center justify-center'>
            <MdOutlineAccountCircle className='text-[#148BB8] text-6xl md:text-8xl'/>
            <h1 className='font-akagi font-bold text-md md:text-xl text-[#505050]'>Wendel Derraco</h1>
        </div>
    </>
  )
}

export default AccountCard
