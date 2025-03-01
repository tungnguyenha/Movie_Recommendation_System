import classNames from 'classnames/bind';
import style from './Footer.module.scss';
import Button from '@mui/material/Button';
import TvIcon from '@mui/icons-material/Tv';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AirplayIcon from '@mui/icons-material/Airplay';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import IconButton from '@mui/material/IconButton';
const cx = classNames.bind(style);
function Footer() {
    return ( <div className={cx('footer')}>
            <div className={cx('footer-box')}>
                <h4>Trải nghiệm tốt nhất chỉ có trên CYBERKNIGHT APP</h4>
                <p><span>CyberKnight</span>Tìm kiếm trong cửa hàng ứng dụng dành cho thiết bị di động</p>
                <ul className={cx('ul-first')}>
                    <li>
                        <Button variant="outlined" color="inherit" startIcon={<TvIcon />}>
                            Thiết bị đầu cuối máy tính
                        </Button>
                    </li>
                    <li>
                        <Button variant="outlined" color="inherit" startIcon={<PhoneAndroidIcon />}>
                            Điện thoại
                        </Button>
                    </li>
                    <li>
                        <Button variant="outlined" color="inherit" startIcon={<AirplayIcon />}>
                            Trên TV
                        </Button>
                    </li>
                    <li>
                        <Button variant="outlined" color="inherit" startIcon={<LiveTvIcon />}>
                            Trên trang web
                        </Button>
                    </li>
                </ul>
                <div>
                    <IconButton aria-label="delete">
                        <FacebookIcon color='primary'/>
                    </IconButton>
                    <IconButton aria-label="delete" color='warning'>
                        <InstagramIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color='primary'>
                        <TwitterIcon />
                    </IconButton>
                </div>
                <ul className={cx('ul-last')}>
                    <li>
                        <h6>Giới thiệu về chúng tôi</h6>
                        <span>Thông tin công ty</span>
                        <span>Giới thiệu dịch vụ sản phẩm</span>
                        <span>Cách xem</span>
                        <span>Quan hệ nhà đầu tư</span>
                    </li>
                    <li>
                        <h6>Hợp tác</h6>
                        <span>Đăng quảng cáo</span>
                        <span>Quan hệ kinh doanh</span>
                        <span>Hợp tác cài đặt trước</span>
                    </li>
                    <li>
                        <h6>Hỗ trợ và giúp đỡ</h6>
                        <span>Phản ánh ý kiến</span>
                        <span>Trung tâm phản hồi bảo mật</span>
                        <span>Câu hỏi thường gặp</span>
                    </li>
                    <li>
                        <h6>Điều khoản dịch vụ</h6>
                        <span>Điều khoản quyền riêng tư</span>
                        <span>Điều khoản sử dụng</span>
                    </li>
                </ul>
            </div>
        </div> );
}

export default Footer;