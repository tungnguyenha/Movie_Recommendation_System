import classNames from "classnames/bind";
import styles from './style.module.scss';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState, useContext } from "react";
import axios from "axios";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { notify } from '../../components/Layout/Component/Notify';
import { UserContext } from "../../UserContext";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const cx = classNames.bind(styles);
function Profile() {
    const [pathFile, setPathFile] = useState('');
    const [isPassword,setIsPassword] = useState(false);
    const {user, setUser} = useContext(UserContext);
    const [valueGender, setValueGender] = useState(user?.gender == 0 ?'female': (user?.gender == 1?'male':'other'));
    const [isSamePassword,setIsSamePassword] = useState(false);
    const [userProfile,setUserProfile] = useState({
        userId: user.userId,
        email: user.email,
        userName: user.userName,
        avatar: user.avartar || "",
        gender: user.gender,
        phone: user.phone,
        password: user.password,
        newPassword: ""
      });

    const handleChangeProfile = (e,name) =>{
        switch(name){
            case 'username':
                setUserProfile({
                    ...userProfile,
                    userName: e.target.value
                })
                break;
            case 'phone':
                setUserProfile({
                    ...userProfile,
                    phone: e.target.value
                })
                break;
            case 'password':
                setUserProfile({
                    ...userProfile,
                    password: e.target.value
                })
                break;
            case 'newPassword':
                setUserProfile({
                    ...userProfile,
                    newPassword: e.target.value
                })
                break;
        }
    }

    const handleChange = (event) => {
        setValueGender(event.target.value);
        setUserProfile(pre => ({
            ...pre,
            gender: event.target.value
        }))
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('formfile', file);
        axios.post(import.meta.env.VITE_PUT_IMAGE,formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(result => {
            setPathFile(result.data.result);
            setUserProfile({
                ...userProfile,
                avatar: import.meta.env.VITE_GET_IMAGE + result.data.result
            })
        })
        .catch(err => console.log('upload failed: ',err));

    };

    const handleSubmit = async() => {
        if(isPassword){
            if(userProfile.password == user.password){
                axios.put(import.meta.env.VITE_PUT_CHANGE_PASSWORD,userProfile)
                .then(() => {
                    setUser(userProfile)
                    setIsSamePassword(false)
                    setIsPassword(false)
                    notify('Change Password success')})
                .catch(err => console.log('errChangePassword: ',err));
            }else{
                setIsSamePassword(true);
            }
        }else{
            axios.put(import.meta.env.VITE_PUT_UPDATE_PROFILE,userProfile)
                .then(() => {
                    setUser(userProfile);
                    notify('Change Profile success')})
                .catch(err => console.log('errChangeProfile: ',err));
        }
    }
    return ( <div className={cx('profile')}>
         <h1>Profile</h1>
        <div className={cx('profile-box')}>
            <div className={cx('profile-main')}>
                <h2>{isPassword ? 'Change Password':'Edit Profile'}</h2>
                <form >
                    {!isPassword && <Box>
                        <Box sx={{margin:'10px 0'}}>
                            <span>UserName:</span>
                            <TextField onChange={e => handleChangeProfile(e,'username')} id="filled-basic" value={userProfile?.userName!=null ? userProfile?.userName: ''} variant="outlined" />
                        </Box>
                        <Box sx={{margin:'10px 0'}}>
                        <TextField
                            id="filled-read-only-input"
                            label="Email"
                            defaultValue={userProfile.email}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="filled"
                            />
                        </Box>
                        <Box sx={{margin:'10px 0'}}>
                            <TextField
                                onChange={e => handleChangeProfile(e,'phone')}
                                id="standard-number"
                                label="Phone Number"
                                value={userProfile?.phone != null ? userProfile?.phone: '' }
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="standard"
                                />
                        </Box>
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={valueGender}
                                onChange={handleChange}
                            >
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                            </RadioGroup>
                        </FormControl>
                        <Box sx={{margin:'10px 0'}}>
                            <span>Avatar</span>
                            <Box sx={{height:'100px', border:'0.2px solid var(--borderLeftbar)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                <input type="file" id="fileInput"
                                    accept=".jpg,.png,.jpeg"
                                    style={{ display: 'none' }} 
                                    onChange={handleFileChange}/>
                                {pathFile ?
                                    <Box sx={{width:'100px !important',position: 'relative'}}>
                                        <IconButton onClick={() => setPathFile('')} className={cx('delete_icon_avatar')} aria-label="delete" style={{position:'absolute', top:'5px',right:'5px'}}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <img style={{width:'100px', height:'100px', padding: '5px', borderRadius:'10px'}} src={import.meta.env.VITE_GET_IMAGE+pathFile} alt="" />
                                    </Box>: <Box sx={{width:'50px !important'}}></Box>}
                                 <Box sx={{ display: 'flex', alignItems: 'center',marginLeft:'15px' }}>
                                    <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                                    <span style={{ border: '1px solid #ccc', padding: '5px 10px', borderRadius: '4px' }}>
                                        Upload
                                    </span>
                                    </label>
                                </Box>
                            </Box>
                        </Box>
                    </Box>}
                    {isPassword && <Box sx={{margin:'10px 0'}}>
                        <TextField
                            onChange={e => handleChangeProfile(e,'password')}
                            label="Current Password"
                            type="password"
                            autoComplete="current-password"
                            variant="filled"
                            />
                    </Box>}
                    {isPassword && <Box sx={{margin:'10px 0'}}>
                        <TextField
                            onChange={e => handleChangeProfile(e,'newPassword')}
                            label="New Password"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"
                            />
                        {isSamePassword && <span style={{color:'red',fontSize:'12px',marginTop:'5px'}}>The password not be the same!!!</span>}
                    </Box>}
                </form>
                    <Box sx={{margin:'10px 0 0 0',display:'flex',justifyContent:'space-between'}}>
                        <Box>
                            <button onClick={() => setIsPassword(pre => !pre)} className="btn btn-primary">{isPassword?'Edit profile': 'Change Password'}</button>
                        </Box>
                        <Box sx={{display:'flex',justifyContent:'end'}}>
                            <button onClick={handleSubmit} className="btn btn-success" >Save</button>
                        </Box>
                    </Box>
            </div>
        </div>
    </div> );
}

export default Profile;