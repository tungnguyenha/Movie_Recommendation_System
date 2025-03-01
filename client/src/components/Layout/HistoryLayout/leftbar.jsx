import classNames from 'classnames/bind';
import styles from './style.module.scss';
import images from '../../../assets/3.jpg';
import Button from '@mui/material/Button';
import {Link, useNavigate} from 'react-router-dom';
import { MovieContext } from "../../../MovieContext";
import { useContext } from 'react';
import { UserContext } from '../../../UserContext';

const cx = classNames.bind(styles);
function Leftbar() {
    const {setIsOpenVip} = useContext(MovieContext);
    const {user,setUser} = useContext(UserContext); 
    const navigate = useNavigate();
    const handleLogout = () =>{
        setUser(null);
        navigate('/');
    }
    return ( <div className={cx('history-left')}>
                <div>
                    <img src={user.avatar} alt="" />
                    <span>{user.userName}</span>
                </div>
                <div className={cx('history-left-btn')}>
                     <Button onClick={() => setIsOpenVip(2)} variant="contained" color='warning'>Gia Nhập VIP</Button>
                </div>
                <ul>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/history">Lịch sử xem</Link></li>
                    <li><Link to="/favorite">Sưu tập của tôi</Link></li>
                    <li><Link to="/statistic">Thống kê</Link></li>
                    <li onClick={handleLogout}><Link >Đăng xuất</Link></li>
                </ul>
            </div> );
}

export default Leftbar;