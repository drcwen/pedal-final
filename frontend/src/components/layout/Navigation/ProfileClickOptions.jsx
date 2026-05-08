

function ProfileClickOptions( props ) {
  
  return (
    <>
        <div className='absolute top-20 right-17'>
            <div className='bg-blue rounded-2xl px-2 py-2 flex flex-start flex-col gap-2'>

                    <div className='bg-white rounded-xl px-10 py-2 hover:bg-yellow duration-300 transition-all cursor-pointer'>
                        <h1 className='font-akagi font-bold text-darkblue'>{props.myUser}</h1>
                    </div>


                <div className='bg-white rounded-xl px-10 py-2 hover:bg-yellow duration-300 transition-all cursor-pointer'>
                        <h1 className='font-akagi font-bold text-darkblue'>Logout</h1>
                    </div>

            </div>
        </div>
    </>
    
  );
}

export default ProfileClickOptions;