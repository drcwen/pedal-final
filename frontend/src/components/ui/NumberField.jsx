
function NumberField({ Placeholder, Type, InputMode, Pattern, onChange, Length, value }) {

  const handleChange = (e) => {
    const value = e.target.value;

    // remove all non-numbers
    const onlyNumbers = value.replace(/\D/g, "");

    e.target.value = onlyNumbers;

    if (onChange) {
      onChange(e);
    }
  };
    return (
        <input className='w-full bg-white shadow-xl border border-2 text-center tracking-wider border-white rounded-xl md:px-3 px-2 py-1 md:py-2 font-akagi 
            md:text-xl text-lg font-semibold text-gray' 
            type={Type}
            value={value}
            required 
            placeholder={Placeholder} 
            inputMode={InputMode} 
            pattern={Pattern} 
            onChange={handleChange}
            maxLength={ Length }/>
    )

}

export default NumberField