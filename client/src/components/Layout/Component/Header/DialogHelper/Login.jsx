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
import Register from './Register';
// eslint-disable-next-line react/prop-types
function Login({openLogin,handleClose,handleSetLogin,isEmailErrLogin,isPasswordErrLogin,handleLogin,handleClickOpen,openSignUp,isEmailErr,handleSignUp,selectedCountries,selectedGenres,handleChange}) {
    return (  <Dialog
        open={openLogin}
        onClose={handleClose}
        PaperProps={{
            component: 'form'
        }}
        >
        <DialogTitle textAlign='center' fontSize='30px'>Login</DialogTitle>
        <DialogContent>
            <DialogContentText maxWidth='400px'>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
            </DialogContentText>
            <TextField
            onChange={(e) => handleSetLogin(e,0)}
            autoFocus
            required
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            />
             {isEmailErrLogin && <span style={{color:'red',fontSize:'14px'}}>The email is wrong!!!. Please try again.</span>}
            <TextField
            onChange={(e) => handleSetLogin(e,1)}
            required
            margin="dense"
            name="password"
            label="password"
            type="password"
            fullWidth
            variant="standard"
            />
             {isPasswordErrLogin && <span style={{color:'red',fontSize:'14px'}}>The password is wrong!!!. Please try again.</span>}
            <div style={{height:"15px"}}></div>
       
            <Button fullWidth variant="outlined" color='warning' startIcon={<GoogleIcon />}>
                Continue with Google 
            </Button>
            <div style={{height:"15px"}}></div>
            <Button fullWidth variant="outlined" startIcon={<FacebookIcon />}>
            Continue with Facebook 
            </Button>
            <div style={{height:"25px"}}></div>
            <p style={{textAlign:'center'}}>Don't have any account? 
                <Register handleClickOpen={handleClickOpen} openSignUp= {openSignUp} handleClose={handleClose}
                handleSetLogin={handleSetLogin} isEmailErr={isEmailErr} handleSignUp ={handleSignUp}
                selectedCountries={selectedCountries} selectedGenres={selectedGenres} handleChange = {handleChange}/>              
            </p>
        </DialogContent>
        <DialogActions>
            <Button onClick={() =>handleClose(0)}>Cancel</Button>
            <Button variant="contained" color='primary' onClick={handleLogin}>Login</Button>
        </DialogActions>
    </Dialog> );
}

export default Login;