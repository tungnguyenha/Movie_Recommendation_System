
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import 'react-toastify/dist/ReactToastify.css';
import Checkbox from '@mui/material/Checkbox';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
// eslint-disable-next-line react/prop-types
function Register({handleClickOpen,openSignUp,handleClose,handleSetLogin,isEmailErr,handleSignUp,selectedCountries,selectedGenres,handleChange}) {
    
    return (  <Fragment>
        <Link onClick={() => handleClickOpen(0)}>Sign Up</Link>
        <Dialog
            open={openSignUp}
            onClose={handleClose}
            PaperProps={{
                component: 'form'
            }}
            >
            <DialogTitle textAlign='center' fontSize='30px'>Sign Up</DialogTitle>
            <DialogContent>
                <DialogContentText maxWidth='400px'>
                Are you ready enjoy the moment with our, please enter your email address here. We
                will send updates occasionally.
                </DialogContentText>
                <TextField
                onChange={(e) => handleSetLogin(e,2)}
                autoFocus
                required
                margin="dense"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                />
                {isEmailErr && <span style={{color:'red',fontSize:'14px'}}>The email alreay existing!!!. Please try again.</span>}
                <TextField
                onChange={(e) => handleSetLogin(e,3)}
                autoFocus
                required
                margin="dense"
                name="password"
                label="password"
                type="password"
                fullWidth
                variant="standard"
                />
                <div >
                    <h6>Chọn thể loại phim bạn yêu thích</h6>
                    <div style={{display:'flex', justifyContent:'space-evenly'}}>
                        <span style={{width:'33%'}}> <Checkbox checked={selectedGenres.Action} onChange={e => handleChange(e,0)} name="Action"/>Hành Động</span>
                        <span style={{width:'33%'}}><Checkbox checked={selectedGenres.War}  onChange={e => handleChange(e,0)} name="War"/>Chiến Tranh</span>
                        <span style={{width:'33%'}}><Checkbox checked={selectedGenres.Comedy }  onChange={e => handleChange(e,0)} name="Comedy" />Hài Hước</span>
                    </div>
                    <h6>Chọn quốc gia phim bạn yêu thích</h6>
                    <div style={{display:'flex', justifyContent:'space-evenly'}}>
                        <span style={{width:'33%'}}> <Checkbox checked={selectedCountries.Japan}  onChange={e => handleChange(e,1)} name="Japan"/>Nhật Bản</span>
                        <span style={{width:'33%'}}><Checkbox checked={selectedCountries.France}  onChange={e => handleChange(e,1)} name="France"/>Pháp</span>
                        <span style={{width:'33%'}}><Checkbox checked={selectedCountries.USA}  onChange={e => handleChange(e,1)} name="USA" />Mỹ</span>
                    </div>
                </div>
        
                <Button fullWidth variant="outlined" color='warning' startIcon={<GoogleIcon />}>
                    Continue with Google 
                </Button>
                <div style={{height:"15px"}}></div>
                <Button fullWidth variant="outlined" startIcon={<FacebookIcon />}>
                Continue with Facebook 
                </Button>
                <div style={{height:"25px"}}></div>
                <p style={{textAlign:'center'}}>Already have a account? <Link onClick={() => handleClickOpen(1)}>Login</Link>
                </p>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color='success' onClick={handleSignUp}>Sign Up</Button>
            </DialogActions>
            </Dialog>
    </Fragment>   );
}

export default Register;