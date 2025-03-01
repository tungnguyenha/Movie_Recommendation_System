import classNames from 'classnames/bind';
import style from '../Header.module.scss';
import { Fragment } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Avatar from '@mui/material/Avatar';
import CastleIcon from '@mui/icons-material/Castle';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import OfflineShareIcon from '@mui/icons-material/OfflineShare';
import HdrOnIcon from '@mui/icons-material/HdrOn';
import FontDownloadOffIcon from '@mui/icons-material/FontDownloadOff';
import ConnectedTvIcon from '@mui/icons-material/ConnectedTv';
import SecurityUpdateIcon from '@mui/icons-material/SecurityUpdate';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import FlareIcon from '@mui/icons-material/Flare';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { notify } from '../../Notify';

const cx = classNames.bind(style);
// eslint-disable-next-line react/prop-types
function Vip({handleClickOpen,user,isOpenVip,handleClose,setIsOpenVip,buyVip,setBuyVip,getAvatar}) {

    const handleBuyVip = (status, idBuyVip) =>{
        const data = {
            userId: user?.userId,
            status: status,
            isType: idBuyVip
        }
        if(status == 0){
            axios.put(import.meta.env.VITE_PUT_UPDATE_BUY_VIP,data)
            .then(() => {
                let newData = [...buyVip];
                newData.find(item => item.buyVipId === idBuyVip).isType = 1
                setBuyVip(newData);
                notify('Đang chờ xử lý');
            })
            .catch(err => console.log('err: ',err));
        }
    }

    return (  <Fragment>
        <Button onClick={() => handleClickOpen(2)} style={{marginLeft:'15px'}} variant="contained" color='warning' startIcon={<CastleIcon />}>
            VIP
        </Button>
        {user&&<Dialog
            maxWidth='md'
            open={isOpenVip}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle style={{backgroundColor:'var(--background-layout)'}} id="alert-dialog-title">
                <Box sx={{display:'flex',justifyContent:'space-between'}}>
                    <Box sx={{display:'flex', alignItems:'center'}}>
                        {
                        user&& getAvatar(user.avatar) == 2?
                            <Avatar alt="Remy Sharp" src={user.avatar}/>:
                            (getAvatar(user.avatar) == 0 ? <span style={{padding:'10px 13px', borderRadius:'50%'}} className="avatar text-bg-primary">{user.email[0].toUpperCase()}</span>
                        : <Avatar alt="Remy Sharp" src={user.avatar}/>)
                        }
                        <Box sx={{marginLeft:'10px',color:'white',lineHeight: '1.1'}}>
                            <b style={{fontSize:'14px'}}>{user?.userName ? user?.userName : user.email.split('@')[0] }</b><br />
                            <span style={{fontSize:'15px',color:'var(--textGray)'}}>Đăng ký VIP để tận hưởng kho phim</span>
                        </Box>
                    </Box>
                    <IconButton style={{backgroundColor:'white'}} onClick={() => setIsOpenVip(false)} aria-label="delete">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent style={{marginTop:'15px'}}>
            {buyVip && <Box sx={{display:'flex'}}>
                        {buyVip.map((item,index) =>{
                            return <div style={{backgroundColor: item.isType == 1?'var(--backgroundVipProcessing)': (item.isType == 2?'var(--backgroundVipApproved)':'var(--backgroundVip)')}}
                                     key={index} className={cx('buy-hover')}>
                                        <Box sx={{lineHeight:'1.1'}}>
                                            <b>{item.nameVip}</b><br />
                                            <small>{item.titleVip}</small>
                                        </Box>
                                        <div style={{height:'30px'}}></div>
                                        <Box sx={{lineHeight:'1.1'}}>
                                            <b>{item.priceVip}đ</b><br />
                                            <small style={{textDecoration:'line-through'}}>{item.subPriceVip}đ</small>
                                        </Box>
                                        <Box sx={{ marginTop:'10px'}}>
                                            <Button onClick={() => handleBuyVip(item.isType, item.buyVipId)}
                                            fullWidth variant="contained" 
                                            color={item.isType==0 ? 'primary': (item.isType==1 ? 'warning': 'success')}>
                                                {item.isType==0 ? 'Buy': (item.isType==1 ? 'Processing': 'Approved')}</Button>
                                        </Box>
                                    </div>
                        }) 
                         }
                    </Box>}
                 <h3 style={{textAlign:'center',margin:'20px 0'}}>Quyền lợi đăng ký VIP</h3>
                 <ul className={cx('priority-icon')}>
                        <li>
                            <IconButton aria-label="two devices">
                                <OfflineShareIcon/>
                            </IconButton>
                            <span>
                                Xem đồng thời trên 2 thiết bị
                            </span>
                        </li>
                        <li>
                            <IconButton aria-label="two devices">
                                <HdrOnIcon/>
                            </IconButton>
                            <span>1080P</span>
                        </li>
                        <li>
                            <IconButton aria-label="two devices">
                                <LocalFireDepartmentIcon/>
                            </IconButton>
                            <span>Phim Bộ hot xem ngay</span>
                        </li>
                        <li>
                            <IconButton aria-label="two devices">
                                <SecurityUpdateIcon/>
                            </IconButton>
                            <span>Tải xuống nội dung thành viên</span>
                        </li>
                        <li>
                            <IconButton aria-label="two devices">
                                <FontDownloadOffIcon/>
                            </IconButton>
                            <span>VIP được chặn quảng cáo</span>
                        </li>
                        <li>
                            <IconButton aria-label="two devices">
                                <LocationCityIcon/>
                            </IconButton>
                            <span>Dùng chung cho nhiều thiết bị</span>
                        </li>
                        <li>
                            <IconButton aria-label="two devices">
                                <FlareIcon/>
                            </IconButton>
                            <span>Phim bom tấn</span>
                        </li>
                        <li>
                            <IconButton aria-label="two devices">
                                <ConnectedTvIcon/>
                            </IconButton>
                            <span>Trải nghiệm rạp chiếu phim Dolby</span>
                        </li>
                    </ul> 
            </DialogContent>
        </Dialog>}
        </Fragment> );
}

export default Vip;