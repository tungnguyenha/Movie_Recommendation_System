import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LogoutIcon from '@mui/icons-material/Logout';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function ProfileDown({handleLogout}) {
    return ( <Box sx={{backgroundColor: 'white !important',zIndex:'100',width:'170px', display:'flex',flexDirection:'column', padding:'10px',borderRadius:'10px', position:'absolute',bottom:'-205px',left:'-60px'}}>
    <Link style={{margin:'5px 0',textDecoration:'none',color:'black',fontWeight:'600',fontSize:'18px'}} to="/profile">
        <Button fullWidth variant="outlined" startIcon={<AccountBoxIcon />}>
                Profile
        </Button>
    </Link>
    <Link style={{margin:'5px 0',textDecoration:'none',color:'black',fontWeight:'600',fontSize:'18px'}} to="/favorite">
        <Button fullWidth variant="outlined" startIcon={<FavoriteBorderIcon />}>
            Sở thích
        </Button>   
    </Link>
    <Link style={{margin:'5px 0',textDecoration:'none',color:'black',fontWeight:'600',fontSize:'18px'}} to="/statistic">
        <Button fullWidth variant="outlined" startIcon={<AutoGraphIcon />}>
            Thống kê
        </Button>
    </Link>
    <Link to="/" style={{margin:'5px 0',textDecoration:'none',color:'black',fontWeight:'600',fontSize:'18px'}} >
        <Button onClick={handleLogout} fullWidth variant="outlined" startIcon={<LogoutIcon />}>
            Đăng xuất
        </Button>   
    </Link>

</Box> );
}

export default ProfileDown;