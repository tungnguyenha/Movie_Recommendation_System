import axios from "axios";
import style from '../style.module.scss'
import classNames from 'classnames/bind';
import { useEffect, useState, useContext } from 'react';
import { MovieContext } from "../../../MovieContext";
import Box from '@mui/material/Box';
import {UserContext} from '../../../UserContext';
import { notify } from "../../../components/Layout/Component/Notify";
import {useNavigate} from 'react-router-dom';
import SlideShow from "./SlideShow";
import MovieDisplay from "./MovieDisplay";
import Poster from "./Poster";
const cx = classNames.bind(style);
function Home() {
    const {movieCol,setMovieCol,setSearchMovie,setOpenLogin} = useContext(MovieContext);
    const {user} = useContext(UserContext);
    const [indexbg,setIndexbg] = useState(0);
    const [indexht,setIndexht] = useState(0);
    const [indexclb,setIndexClb] = useState(0);
    const [indexnew,setIndexnew] = useState(0);
    const [indexrcm,setIndexrcm] = useState(0);

    const navigate = useNavigate();
    //----------------------------------------
    const handleIndexht = (index,check) =>{
        switch(check){
            case "ht":
                if(index==1){
                    if(indexht == movieCol.movieHot.length-6){
                        setIndexht(0);
                    }else{
                        setIndexht(pre => pre + 6);
                    }
                }else{
                    if(indexht == 0){
                        setIndexht(movieCol.movieHot.length-6);
                    }else{
                        setIndexht(pre => pre - 6);
                    }
                }
                break;
            case "rcm":
                if(index==1){
                    if(indexrcm == movieCol.movieRcm.length-6){
                        setIndexrcm(0);
                    }else{
                        setIndexrcm(pre => pre + 6);
                    }
                }else{
                    if(indexrcm == 0){
                        setIndexrcm(movieCol.movieRcm.length-6);
                    }else{
                        setIndexrcm(pre => pre - 6);
                    }
                }
                break;
            case "new":
                if(index==1){
                    if(indexnew == movieCol.movieNew.length-6){
                        setIndexnew(0);
                    }else{
                        setIndexnew(pre => pre + 6);
                    }
                }else{
                    if(indexnew == 0){
                        setIndexnew(movieCol.movieNew.length-6);
                    }else{
                        setIndexnew(pre => pre - 6);
                    }
                }
                break;
            case "col":
                if(index==1){
                    if(indexclb == movieCol.movieClb.length-6){
                        setIndexClb(0);
                    }else{
                        setIndexClb(pre => pre + 6);
                    }
                }else{
                    if(indexclb == 0){
                        setIndexClb(movieCol.movieClb.length-6);
                    }else{
                        setIndexClb(pre => pre - 6);
                    }
                }
                break;
            default :
                if(index==1){
                    if(indexbg == movieCol.movieHot.length-1){
                        setIndexbg(0);
                    }else{
                        setIndexbg(pre => pre + 1);
                    }
                }else{
                    if(indexbg == 0){
                        setIndexbg(movieCol.movieHot.length-1);
                    }else{
                        setIndexbg(pre => pre - 1);
                    }
                }
        }
    }

    useEffect(()=>{
        const timer = setTimeout(() => {
            if(indexbg == movieCol.movieHot.length-1){
                setIndexbg(0);
            }else{
                setIndexbg(pre => pre + 1); 
            }
        }, 3000);

        return () => clearTimeout(timer); 
    });

    // get movie
    useEffect(() =>{
        axios.get(import.meta.env.VITE_GET_MOVIE)
        .then( result =>{
            console.log('movie: ',result.data);
            const newMovie = {...movieCol};
            newMovie.movieNew = result.data.slice(0, 18);
            newMovie.movieHot = result.data.slice(18, 36);
            setSearchMovie(result.data);
            setMovieCol(newMovie);
        })
        .catch(err => console.log('errGet: ',err));
    },[])


    const handleDetailMovie =(index) =>{
        if(user == null){
            setOpenLogin(true);
        }else{
            axios.post(import.meta.env.VITE_POST_HISTORY,{userId:user.userId,movieId: index})
            .then(result => console.log('add to history: ',result))
            .catch(err => console.log('failed to add history: ', err));
            navigate(`/detail-movie/${index}`);
        }
    }

    const handleToFavorite = (index) =>{
        if(user == null){
            setOpenLogin(true);
        }else{
            const data =  {
                "userId": user.userId,
                "movieId": index
              }
            axios.post(import.meta.env.VITE_POST_FAVORITE,data)
            .then(result => {
                notify('Đã thêm vào phim yêu thích');
                console.log('add success: ',result)}
            )
            .catch(err => console.log('add failed: ',err));
        }
    }

    return ( 
        <div className={cx("home-page")}>
            <SlideShow/>
            {<Box sx={{display:'flex', justifyContent:'center'}}> <Poster movie={movieCol.movieHot}
            indexbg={indexbg} handleDetailMovie={handleDetailMovie}
            handleToFavorite={handleToFavorite} handleIndexht={handleIndexht} /></Box>}

            {movieCol.movieRcm && movieCol.movieRcm.length>0 && <MovieDisplay handleIndexht={handleIndexht}
            title="rcm" indexrcm={indexrcm} movie={movieCol.movieRcm}
            handleDetailMovie={handleDetailMovie} titleMovie="Phim Đề Xuất"/>}

            {movieCol.movieClb && movieCol.movieClb.length>0 && <MovieDisplay handleIndexht={handleIndexht}
            title="col" indexrcm={indexclb} movie={movieCol.movieClb}
            handleDetailMovie={handleDetailMovie} titleMovie="Phim Chọn Lọc"/>}

            {movieCol.movieHot && movieCol.movieHot.length>0 &&<MovieDisplay handleIndexht={handleIndexht}
            title="ht" indexrcm={indexht} movie={movieCol.movieHot}
            handleDetailMovie={handleDetailMovie} titleMovie="Phim Hot"/>}
            
            {movieCol.movieNew && movieCol.movieNew.length>0 && <MovieDisplay handleIndexht={handleIndexht}
            title="new" indexrcm={indexnew} movie={movieCol.movieNew}
            handleDetailMovie={handleDetailMovie} titleMovie="Phim Mới"/>}
    </div> );
}

export default Home;