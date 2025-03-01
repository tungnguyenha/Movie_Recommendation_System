import classNames from "classnames/bind";
import styles from './dialog.module.scss';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { useContext, useState } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import { notify } from "../../../components/Layout/Component/Notify";
import { MovieContext } from "../../../MovieContext";

const cx = classNames.bind(styles);
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        },
    },
};
// eslint-disable-next-line react/prop-types
function EditDialog({openEdit,setOpenEdit,handleClose,data,movie1,setMovie1}) {
    
    const [valueType, setValueType] = useState(data[2] == 0 ?'normal': (data[2] == 1?'new':'hot'));
    const [movie,setMovie] = useState({
        movieId: data[0],
        title: data[1],
        isType: data[2],
        urls: '',
        originalLanguage: data[3],
        poster: data[4]
    });
    console.log('movie: ',movie)
    const [isPoster,setIsPoster] = useState(false);
    const {countryCode} = useContext(MovieContext);
    const [language, setLanguage] = useState();

    const handleChangeType = (event) => {
        setValueType(event.target.value);
        setMovie({
            ...movie,
            isType: event.target.value == 'normal' ? 0 : (event.target.value == 'new'?1:2)
        })
    };

    const handleAddMovie = (e,type) =>{
        switch(type){
            case 'title':
                setMovie({
                    ...movie,
                    title: e.target.value
                });
                break;
            case 'language':
                setLanguage(e.target.value);
                setMovie({
                    ...movie,
                    originalLanguage: e.target.value
                });
                break;
        }
    }
    
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
            setIsPoster(true);
            setMovie({
                ...movie,
                poster: result.data.result
            })
        })
        .catch(err => console.log('upload failed: ',err));

    };

    const handleClickEditMovie = () =>{
        axios.put(import.meta.env.VITE_PUT_UPDATE_MOVIE,movie)
        .then(() => {
            const index = movie1.findIndex(mv => mv.movieId === movie.movieId);
            const editMovie = {...movie1[index]};
            editMovie.title = movie.title;
            editMovie.descriptions = movie.descriptions;
            editMovie.isType = movie.isType;
            editMovie.originalLanguage = movie.originalLanguage;
            editMovie.urls = movie.urls;
            editMovie.poster = movie.poster;
            const updateMovie = [...movie1];
            updateMovie[index] = editMovie;
            setMovie1(updateMovie);
            setOpenEdit(false);
            notify('The movie edited success');
        })
        .catch(err => console.log('add movie err: ',err));
    }
    return (
                <Dialog
                    open={openEdit}
                    onClose={() => handleClose('edit')}
                    maxWidth= 'md'
                >
                    <DialogTitle style={{textAlign:"center", fontSize:"25px"}}>Edit Movie</DialogTitle>
                    <DialogContent style={{width:'550px'}}>
                            <form >
                                <Box sx={{margin:'10px 0'}}>
                                    <span>Title:</span><br />
                                    <TextField style={{width:'100%'}} onChange={e => handleAddMovie(e,'title')} id="filled-basic" value={movie?.title!=null ? movie?.title: ''} variant="outlined" />
                                </Box>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Type</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        value={valueType}
                                        onChange={handleChangeType}
                                    >
                                        <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                                        <FormControlLabel value="new" control={<Radio />} label="New" />
                                        <FormControlLabel value="hot" control={<Radio />} label="Hot" />
                                    </RadioGroup>
                                </FormControl> 
                                <Box sx={{margin:'10px 0'}}>
                                <span>Original_language:</span><br />
                                    <FormControl required sx={{ m: 1, minWidth: 200 }}>
                                        <InputLabel id="demo-simple-select-required-label">Original_language</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-required-label"
                                            id="demo-simple-select-required"
                                            value={language}
                                            label="Original_language *"
                                            onChange={(e) => handleAddMovie(e,'language')}
                                        >
                                        {countryCode.map((item,index) =>{
                                            return <MenuItem key={index} value={item.countryId}>{item.nameContry}</MenuItem>
                                        })}
                                        </Select>
                                        <FormHelperText>Required</FormHelperText>
                                    </FormControl>
                                </Box>
                                <Box sx={{margin:'10px 0'}}>
                                    <span>Poster</span>
                                    <Box sx={{height:'100px', border:'0.2px solid var(--borderLeftbar)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        <input type="file" id="fileInput"
                                            accept=".jpg,.png,.jpeg"
                                            style={{ display: 'none' }} 
                                            onChange={(e) => handleFileChange(e,'poster')}/>
                                            <Box sx={{width:'100px !important',position: 'relative'}}>
                                                <IconButton onClick={() => {setMovie({...movie,poster:''}); setIsPoster(false)}} className={cx('delete_icon_avatar')} aria-label="delete" style={{position:'absolute', top:'5px',right:'5px'}}>
                                                    <DeleteIcon />
                                                </IconButton>
                                                <img style={{width:'100px', height:'100px', padding: '5px', borderRadius:'10px'}} src={isPoster ? import.meta.env.VITE_GET_IMAGE+movie.poster : movie.poster} alt="" />
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center',marginLeft:'15px' }}>
                                                <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                                                <span style={{ border: '1px solid #ccc', padding: '5px 10px', borderRadius: '4px' }}>
                                                    Upload
                                                </span>
                                                </label>
                                            </Box>
                                        </Box>
                                </Box>
                            </form>      
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => handleClose('edit')}>Cancel</Button>
                    <Button onClick={handleClickEditMovie} color="success">Edit</Button>
                    </DialogActions>
                </Dialog>)
}

export default EditDialog;