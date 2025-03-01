import { createContext, useState } from "react";
export const MovieContext = createContext({});
// eslint-disable-next-line react/prop-types
function MovieContextProvider({children}) {    
    const [movieCol,setMovieCol] = useState({
        movieNew: [],
        movieHot: [],
        movieRcm: [],
        movieClb: []
    });
    const [searchMovie,setSearchMovie] = useState([]);
    const [isOpenVip,setIsOpenVip] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);
    const [movieAdmin, setMovieAdmin] = useState(null);
    const [movieVoteCount,setMovieVoteCount] = useState(null);
    const [countryCode,setCountryCode] = useState(null)
    return ( <MovieContext.Provider value={{openLogin,setOpenLogin
    ,movieCol,setMovieCol,setSearchMovie,searchMovie,isOpenVip,countryCode,setCountryCode,
    setIsOpenVip,movieAdmin,setMovieAdmin,movieVoteCount,setMovieVoteCount}}>
        {children}
    </MovieContext.Provider> );
}

export default MovieContextProvider;