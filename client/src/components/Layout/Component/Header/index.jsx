import classNames from 'classnames/bind';
import style from './Header.module.scss';
import { useEffect, useState, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { UserContext } from "../../../../UserContext";
import { MovieContext } from "../../../../MovieContext";
import { notify,notifyErr } from '../Notify';
import { ToastContainer, toast } from 'react-toastify';
import iconWebTeam from '../../../../assets/icon-web-team.jpg';
import 'react-toastify/dist/ReactToastify.css';
import ProfileDown from './ProfileDown';
import Login from './DialogHelper/Login';
import Vip from './DialogHelper/Vip';
import Filter from './DialogHelper/Filter';

const cx = classNames.bind(style);

function Header() {
    const {user,setUser,buyVip,setBuyVip} = useContext(UserContext);
    const {movieCol,setMovieCol,searchMovie,setSearchMovie,isOpenVip,setIsOpenVip,openLogin, setOpenLogin} = useContext(MovieContext);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [isCountry,setIsCountry] = useState(false);
    const [isGenre,setIsGenre] = useState(false);
    const [isAvatar,setIsAvatar] = useState(false);
    const [country,setCountry] = useState();
    const [genre,setGenre] = useState();
    const [isEmailErr,setIsEmailErr] = useState(false);
    const [isEmailErrLogin,setIsEmailErrLogin] = useState(false);
    const [isPasswordErrLogin,setIsPasswordErrLogin] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const userLogin = useRef({
        Email: '',
        Password: ''
      });
    const userSignUp = useRef({
        Email:'',
        Password:''
    })
    const [selectedCountries, setSelectedCountries] = useState({
        Japan: true,
        France: false,
        USA: false,
    });
    const [selectedGenres, setSelectedGenres] = useState({
        Action: false,
        War: true,
        Comedy: false,
    });

    const handleChange = (event,type) => {
    if(type==0){
        setSelectedGenres({
            ...selectedGenres,
            [event.target.name]: event.target.checked,
            });
    }else{
        setSelectedCountries({
            ...selectedCountries,
            [event.target.name]: event.target.checked,
        });
    }
    };
    const handleSetLogin = (e, check) =>{
        if(isEmailErrLogin == true){
            setIsEmailErrLogin(false);
            setIsPasswordErrLogin(false);
        }
        switch(check){
            case 0:
                userLogin.current.Email = e.target.value;
                break;
            case 1:
                userLogin.current.Password = e.target.value;
                break;
            case 2:
                userSignUp.current.Email = e.target.value;
                break;
            default :
                userSignUp.current.Password = e.target.value;
        }
    }

    const handleLogout = () =>{
        setUser(null);
    }
    //get user
    const handleLogin = () =>{
        axios.post(import.meta.env.VITE_POST_SIGNIN,userLogin.current)
        .then(async data => {
            notify('Login success');
            setUser(data.data);
            if(data.data.role == 1){
                navigate('/adm/home');
            }

            let userSub = data.data.subModals;
            let buyVIP = data.data.buyVips;

            let buyVipIdDict = {};
            buyVIP.forEach(item => {
                buyVipIdDict[item.buyVipId] = true;
            });

            buyVIP.forEach(item => {
                const matchedSub = userSub.find(sub => sub.isType === item.buyVipId);
                item.isType = matchedSub ? matchedSub.status : 0;
            });
            setBuyVip(buyVIP);
            const result = await axios.get(import.meta.env.VITE_GET_RECOMMEND_LIST_MOVIE_ID + data.data.userId);
            console.log('data: ', result.data);

            axios.post(import.meta.env.VITE_GET_RECOMMEND,result.data)
            .then(result => {
                const newMovie = {...movieCol};
                newMovie.movieRcm = result.data;
                setMovieCol(newMovie);
                setSearchMovie([...searchMovie,...result.data])
                })
            .catch(err => console.log('err2: ',err));
        })
        .catch(err => {
            if(err.response?.data?.status == 400){
                console.log('err: Login');
                setIsEmailErrLogin(true);
            }else{
                setIsPasswordErrLogin(true);
            }
        });
    }

    //create user
    const handleSignUp = () =>{

        if(userSignUp.current.Email == '' || userSignUp.current.Password ==''){
            notifyErr("Email or Password is empty!!!")
        }else{
            if(userSignUp.current.Email)
            axios.post(import.meta.env.VITE_POST_SIGNUP,userSignUp.current)
            .then(userCre => {
                console.log('userCre: ',userCre.data);
                const getCountryCodes = () => {
                    const countryMap = {
                      Japan: 'JP',
                      France: 'FR',
                      USA: 'US',
                    };
                
                    return Object.entries(selectedCountries)
                      .filter(([country, isSelected]) => isSelected)
                      .map(([country]) => countryMap[country]);
                  };
                  const myContries = getCountryCodes();
                
                  const getGenreCodes = () => {
                    const genreMap = {
                      Action: 28,
                      War: 10752,
                      Comedy: 35,
                    };
                
                    return Object.entries(selectedGenres)
                      .filter(([genre, isSelected]) => isSelected)
                      .map(([genre]) => genreMap[genre]);
                  };
                
                  const myGenres = getGenreCodes();

                 const myData = {
                    userId: userCre.data.responseCode,
                    genres: myGenres,
                    countries: myContries
                  }
                  axios.post(import.meta.env.VITE_POST_CREATE_RATING_LIST,myData)
                  .then(result => {
                      const newData = {
                          userId : myData.userId,
                          listMovieId: result.data.genres
                        }
                        axios.post(import.meta.env.VITE_POST_CREATE_RATING_LIST_MODEL,newData)
                        .then(() =>{
                            axios.get(import.meta.env.VITE_GET_TRAIN_MODEL)
                            .then(() =>{
                                notify('The account has created successful');
                                setIsEmailErr(false);
                            })
                            .catch(err => console.log('err train-model: ',err))
                        })
                        .catch(err => console.log('err rating-model: ',err));
                  })
                  .catch(err => console.log('err create rating: ', err));
            })
            .catch(() => setIsEmailErr(true));
        }
    }
    //handle Close the dialog login
    function handleClose() {
        setOpenLogin(false);
        setOpenSignUp(false);
        setIsOpenVip(false);
    }
    
    const handleClickOpen = (check) => {
        if(check == 0){
            setOpenSignUp(true);
        }else if(check == 1){
            setOpenLogin(true);
            setOpenSignUp(false);
        }else{
            setIsOpenVip(true);
        }
    };

    // get country and genre
    useEffect(()=> {
        axios.get(import.meta.env.VITE_GET_GENRE)
        .then(result => setGenre(result.data))
        .catch(err => console.log(err));
        axios.get(import.meta.env.VITE_GET_COUNTRY)
        .then(result => setCountry(result.data))
        .catch(err => console.log(err));
    },[])

    //get by country
    const handleColabrate = (colabrate,check) =>{
        if(check == 0){
            axios.get(import.meta.env.VITE_GET_BY_COUNTRY+colabrate)
            .then(result =>{
                var newMovieCol = {...movieCol};
                newMovieCol.movieClb = result.data;
                setMovieCol(newMovieCol);
                window.scroll({
                    top: 900, 
                    behavior: 'smooth' 
                });
            })
            .catch(err => console.log(err))
        }else{
            axios.get(import.meta.env.VITE_GET_BY_GENRE+colabrate)
            .then(result => {
                setMovieCol(result.data)
                window.scroll({
                    top: 900, 
                    behavior: 'smooth' 
                });
            })
            .catch(err => console.log(err))
        }
    }
    const handleDetailMovie =(index) =>{
        if(user == null){
            setSearch('');
            setOpenLogin(true);
        }else{
            axios.post(import.meta.env.VITE_POST_HISTORY,{userId:user.userId,movieId: index})
            .then(result => console.log('add to history: ',result))
            .catch(err => console.log('failed to add history: ', err));
            setSearch('');
            navigate(`/detail-movie/${index}`);
        }
    }
    const handleToHistory = () =>{
        if(user == null){
            setOpenLogin(true)
        }else{
            navigate('/history')
        }
    }
    
    const handleDisplayRecommand = () =>{
        if(user == null){
            toast.warning('you need to login!!!',{
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }else{
            window.scroll({
                top: 500, 
                behavior: 'smooth' 
            });
        }
    }

    const getAvatar = (avatar) =>{
        if(user.avatar){
            const check = avatar.split(':')[0];
            switch(check){
                case 'http':
                    return 1;
                case 'https':
                    return 2;
            }
        }else{
            return 0;
        }
    }
    return ( <div className={cx('header')}>
                <div className={cx('header-left')}>
                    <Link to="/">
                        <img src={iconWebTeam} alt="" />
                    </Link>
                    <div>
                        <button onClick={handleDisplayRecommand} >Đề Xuất</button>
                    </div>
                    <Filter setIsCountry={setIsCountry} title="Quốc gia" isCountry={isCountry} country={country} handleColabrate={handleColabrate} pos={0} />
                    <Filter setIsCountry={setIsGenre} title="Thể Loại" isCountry={isGenre} country={genre} handleColabrate={handleColabrate} pos={1} />
                </div>
                <ToastContainer/>
                <div className={cx('header-right')}>
                    <div className={cx('header-right-search')}>
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm phim..." />
                        <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>icon/search</title><g id="控件" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="icon/search" fill="#FFFFFF" fillRule="nonzero"><path d="M11.5,4 C15.6421356,4 19,7.35786438 19,11.5 C19,13.2425442 18.4057323,14.8462897 17.408807,16.1196265 L20.1793786,18.890165 C20.3746408,19.0854272 20.3746408,19.4020097 20.1793786,19.5972718 L19.4722718,20.3043786 C19.2770097,20.4996408 18.9604272,20.4996408 18.765165,20.3043786 L15.9775948,17.5173134 C14.7279648,18.4487017 13.1783637,19 11.5,19 C7.35786438,19 4,15.6421356 4,11.5 C4,7.35786438 7.35786438,4 11.5,4 Z M11.5,6 C8.46243388,6 6,8.46243388 6,11.5 C6,14.5375661 8.46243388,17 11.5,17 C14.5375661,17 17,14.5375661 17,11.5 C17,8.46243388 14.5375661,6 11.5,6 Z" id="形状结合"></path></g></g></svg>
                    {search !='' && <ul>
                    {searchMovie
                        .filter((item) => {
                            return search.toLowerCase() === ''
                            ? item
                            : item.title.toLowerCase().includes(search);
                        })
                        .map((item, index) =>{
                            return <li key={index}>
                                <p onClick={() => handleDetailMovie(item.movieId)}>{index} {item.title}</p>
                            </li>
                        })
                    }
                    </ul>}
                    </div>
                    <div className={cx('header-history')}>
                        <p onClick={() => handleToHistory()}>
                            <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><title>icon/history</title><g id="控件" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="icon/playlist/normal" fill="#FFFFFF"><path d="M16,6 C21.5228475,6 26,10.4771525 26,16 C26,21.5228475 21.5228475,26 16,26 C10.4771525,26 6,21.5228475 6,16 C6,10.4771525 10.4771525,6 16,6 Z M16,8 C11.581722,8 8,11.581722 8,16 C8,20.418278 11.581722,24 16,24 C20.418278,24 24,20.418278 24,16 C24,11.581722 20.418278,8 16,8 Z" id="形状结合" fillRule="nonzero"></path><path d="M15.5,11 L16.5,11 C16.7761424,11 17,11.2238576 17,11.5 L17,13.7 L17,13.7 L17,15.9 C17,16.1761424 16.7761424,16.4 16.5,16.4 L15.5,16.4 C15.2238576,16.4 15,16.1761424 15,15.9 L15,13.7 L15,13.7 L15,11.5 C15,11.2238576 15.2238576,11 15.5,11 Z" id="矩形"></path><path d="M17.0414317,14.2544733 L18.0414317,14.2544733 C18.317574,14.2544733 18.5414317,14.478331 18.5414317,14.7544733 L18.5414317,16.7544733 L18.5414317,16.7544733 L18.5414317,18.7544733 C18.5414317,19.0306157 18.317574,19.2544733 18.0414317,19.2544733 L17.0414317,19.2544733 C16.7652893,19.2544733 16.5414317,19.0306157 16.5414317,18.7544733 L16.5414317,16.7544733 L16.5414317,16.7544733 L16.5414317,14.7544733 C16.5414317,14.478331 16.7652893,14.2544733 17.0414317,14.2544733 Z" id="矩形备份" transform="translate(17.541432, 16.754473) rotate(124.000000) translate(-17.541432, -16.754473) "></path></g></g></svg>
                            <span >Lịch sử xem</span>
                        </p>
                    </div>
                    {user ?
                    <Box sx={{display:'flex',alignItems:'center'}}><span style={{marginRight:'10px'}}>{user.userName==null?user.email.split('@')[0] : user.userName}</span> 
                    <Box onMouseEnter={() => setIsAvatar(true)} onMouseLeave={() => setIsAvatar(false)} sx={{position:'relative'}}>
                        {
                           user&& getAvatar(user.avatar) == 2?
                            <Avatar alt="Remy Sharp" src={user.avatar}/>:
                            (getAvatar(user.avatar) == 0 ? <span style={{padding:'10px 13px', borderRadius:'50%'}} className="avatar text-bg-primary">{user.email[0].toUpperCase()}</span>
                        : <Avatar alt="Remy Sharp" src={user.avatar}/>)
                        }
                        {
                            isAvatar && <ProfileDown handleLogout={handleLogout}/>
                        }
                    </Box>
                    </Box>:
                    <div>
                        <Tooltip title="Login">
                                <Button onClick={() => setOpenLogin(true)} variant="contained">Login</Button>
                        </Tooltip>         
                        <Login openLogin={openLogin} handleClose={handleClose} handleSetLogin={handleSetLogin}
                        isEmailErrLogin={isEmailErrLogin} isPasswordErrLogin={isPasswordErrLogin} handleLogin={handleLogin}
                        handleClickOpen={handleClickOpen} openSignUp={openSignUp} isEmailErr={isEmailErr}
                        handleSignUp={handleSignUp} selectedCountries={selectedCountries} selectedGenres={selectedGenres} handleChange = {handleChange}/>
                        
                    </div>
                    
                    }
                       <Vip handleClickOpen={handleClickOpen} user={user} isOpenVip={isOpenVip}
                       handleClose={handleClose} setIsOpenVip={setIsOpenVip} buyVip={buyVip}
                       setBuyVip={setBuyVip} getAvatar={getAvatar}/>
                </div>
        </div> );
}

export default Header;