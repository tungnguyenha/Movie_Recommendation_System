import style from '../style.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(style)

// eslint-disable-next-line react/prop-types
function MovieDisplay({handleIndexht,title,movie,indexrcm,handleDetailMovie,titleMovie}) {
    return ( <div className={cx('home-movie')}>
    <h3>{titleMovie}</h3>
    <ul>
        <div onClick={() => handleIndexht(0,title)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        </div>

        <div className={cx('home-movie-uld')} onClick={() => handleIndexht(1,title)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        </div>
        { movie.slice(indexrcm,indexrcm+6).map((item,index) =>{
            return <li key={index} onClick={() => handleDetailMovie(item.movieId)}>
                    <img src={item.poster} alt="" />
                    <span>{item.title}</span>
                </li>
        })
        }
    </ul>
</div> );
}

export default MovieDisplay;