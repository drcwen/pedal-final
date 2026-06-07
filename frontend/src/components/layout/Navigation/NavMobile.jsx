
import { useNavigate } from "react-router-dom";

function NavMobile() {

  const navigate = useNavigate();
  
  return (
    <>
        <div className='w-full h-screen bg-blue'>
            <div className='w-full pt-20 flex flex-col gap-5 items-center px-10'>
              
              {/*Home*/}
              <div
                onClick={() => navigate("/")} 
                className='w-full px-4'>
                <h1 className='text-2xl font-akagi font-bold text-white'>Home</h1>
              </div>

              <div className='h-0.5 bg-white/20 w-full rounded-lg'/>

              {/*Home*/}
              <div
                onClick={() => navigate("/reserve")}  
                className='w-full px-4'>
                <h1 className='text-2xl font-akagi font-bold text-white'>Reserve</h1>
              </div>

              <div className='h-0.5 bg-white/20 w-full rounded-lg'/>

              {/*Home*/}
              <div
                onClick={() => navigate("/transactions")}  
                className='w-full px-4'>
                <h1 className='text-2xl font-akagi font-bold text-white'>Transactions</h1>
              </div>

              <div className='h-0.5 bg-white/20 w-full rounded-lg'/>

              {/*Home*/}
              <div
                onClick={() => navigate("/")} 
                className='w-full px-4'>
                <h1 className='text-2xl font-akagi font-bold text-white'>Reviews</h1>
              </div>

              <div className='h-0.5 bg-white/20 w-full rounded-lg'/>
            </div>
        </div>
    </>
    
  );
}

export default NavMobile;