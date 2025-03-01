import style from '../style.module.scss';
import classNames from 'classnames/bind';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import imgleft from '../../../assets/imageLeft.jpg';
import imgright from '../../../assets/imageRight.jpg';

const cx = classNames.bind(style)

// eslint-disable-next-line react/prop-types
function Poster({movie,handleIndexht,indexbg,handleDetailMovie,handleToFavorite}) {
    return (
        <Box sx={{display:'flex',alignItems:'center', justifyContent:'space-between',width:'100%', height: '600px', padding:'30px', backgroundColor:'rgb(140, 137, 137)'}}>
            <Box sx={{width:'23%',height:'100%', padding:'20px'}}>
                <img style={{width:'100%',height:'100%', borderRadius:'10px'}} src={imgleft} alt="" />
            </Box>
            <div className={cx('home-adv')} style={{ backgroundImage: `url(${movie[indexbg]?.poster})` }}>
                <div onClick={() => handleIndexht(0,"a")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>
            
                <div className={cx('home-inf')}>
                    <h1>{movie[indexbg]?.title}</h1>
                    <p>
                        <svg width="16px" height="16px" viewBox="0 0 28 27" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="V1.12.0_UI_4391_Watch-Page-Add-Rating" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><g id="4391-6_1920_info" transform="translate(-948.000000, -906.000000)" fill="#1CC749" fillRule="nonzero"><g id="Group-10-Copy-10" transform="translate(906.000000, 880.000000)"><g id="ic/star_green" transform="translate(40.000000, 24.000000)"><path d="M16.7983826,2.56356746 L19.7968803,11.2875241 L29.1657516,11.3941138 C29.9719564,11.4033379 30.3057022,12.4128653 29.6590696,12.8853446 L22.1424877,18.3829131 L24.9344802,27.1724634 C25.17436,27.9288402 24.3014061,28.55198 23.643301,28.0938493 L16.0005215,22.7674392 L8.35669898,28.0928244 C7.69963687,28.5509551 6.82563997,27.9267904 7.06551979,27.1714385 L9.85751226,18.3818882 L2.34093036,12.8843197 C1.69429781,12.4118404 2.02804364,11.402313 2.83424842,11.3930889 L12.2031197,11.2864992 L15.2016174,2.56254256 C15.4602704,1.81231509 16.5407725,1.81231509 16.7983826,2.56356746 Z" id="Star"></path></g></g></g></g></svg>
                        <span>{movie[indexbg]?.voteAverage}</span>
                        <b>2024</b>
                    </p>
                    <div>
                        {movie[indexbg]?.genres && movie[indexbg]?.genres.map((item,index) =>{
                            return <span key={index}>{item}</span>
                        })}
                    </div>
                    <p className={cx('home-inf-desc')}>{movie[indexbg]?.descriptions}</p>
                    <Box sx={{ '& > :not(style)': { m: 1 } }}>
                        <Fab style={{zIndex:10}} onClick={() => handleDetailMovie(movie[indexbg]?.movieId)} color="success" aria-label="add">
                            <PlayCircleIcon />
                        </Fab>
            
                        <Fab style={{zIndex:10}} onClick={() => handleToFavorite(movie[indexbg]?.movieId)} color="primary" aria-label="add">
                            <BookmarkAddIcon />
                        </Fab>
                    </Box>
                </div>
                <div className={cx('home-adv-lt')} onClick={() => handleIndexht(1,"a")}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </div>
            <Box sx={{width:'23%',height:'100%', padding:'20px'}}>
                <img style={{width:'100%',height:'100%', borderRadius:'10px'}} src={imgright} alt="" />
            </Box>
        </Box>);
}

export default Poster;