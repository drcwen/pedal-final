
function TextField({ placeholder, type, value, onChange }) {

    return (
        <input className='w-full border border-2 focus:outline-none border-gray rounded-lg lg:rounded-xl md:px-3 px-2 py-1 md:py-1 font-akagi 
            md:text-md text-lg font-semibold text-gray' 
            type={type} 
            required 
            placeholder={placeholder} 
            value={ value } 
            onChange={ onChange } />
    )

}

export default TextField