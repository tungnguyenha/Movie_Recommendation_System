// eslint-disable-next-line react/prop-types
function Filter({setIsCountry,handleColabrate,isCountry,country,title,pos}) {
    return ( <div onMouseEnter={() => setIsCountry(true)} onMouseLeave={() => setIsCountry(false)}>
    <button>{title}</button>
    {isCountry && (
        <ul>
            {country?.map((item, index) => (
                <li key={index} onClick={() => handleColabrate(pos == 0 ? item.nameContry: item.nameGenre,pos)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                    </svg>
                    <span>{pos == 0 ? item.nameContry: item.nameGenre}</span>
                </li>
            ))}
        </ul>
    )}
</div> );
}

export default Filter;