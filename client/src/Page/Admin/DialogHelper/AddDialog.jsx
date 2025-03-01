import classNames from "classnames/bind";
import styles from './dialog.module.scss';

import IconButton from '@mui/material/IconButton';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Fragment, useContext } from "react";
import Box from '@mui/material/Box';
import { useState } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { notify } from "../../../components/Layout/Component/Notify";
import { MovieContext } from "../../../MovieContext";
import { UserContext } from "../../../UserContext";
import CircularProgress from '@mui/material/CircularProgress';
import ShowVideoErr from "./ShowVideoErr";
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
function AddDialog({open,setOpen,handleClickOpen,handleClose,pathFilePoster,setPathFilePoster,pathFileUrls, setPathFileUrls}) {

    const {movieAdmin,setMovieAdmin, countryCode} = useContext(MovieContext);
    const {setAmountMovie} = useContext(UserContext);
    const [language, setLanguage] = useState('US');
    const [isVideo,setIsVideo] = useState(false);
    const [checkVideo,setCheckVideo] = useState(false);
    const [isCheckVideo, setIsCheckVideo] = useState(false);

    const [images,setImages] = useState();
    const [movie,setMovie] = useState({
        title: '',
        descriptions: '',
        urls: '',
        originalLanguage: '',
        poster: ''
      });
    
    const handleAddMovie = (e,type) =>{
        switch(type){
            case 'title':
                setMovie({
                    ...movie,
                    title: e.target.value
                });
                break;
            case 'desc':
                setMovie({
                    ...movie,
                    descriptions: e.target.value
                });
                break;
            case 'url':
                setMovie({
                    ...movie,
                    urls: e.target.value
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
            setPathFilePoster(result.data.result);
        })
        .catch(err => console.log('upload failed: ',err));

    };

    const handleVideoChange = (event) => {   
        const file = event.target.files[0];
        const pathFile = "C:/Users/ACER/Desktop/model/" + file.name ;
        setPathFileUrls(pathFile);
    };

    const handleDetectVideo = () =>{
        setIsVideo(true);
        const data = {
            url: pathFileUrls
        }
        axios.post(import.meta.env.VITE_POST_DECTECT_VIDEO_MODEL,data)
        .then(result =>{
            console.log('resultDetect: ',result.data);
            setIsVideo(false);
            if(result.data.safe == 1){
                const imageList = result.data.image_list;
                const convertImageList = (imageList) => {
                    return imageList.map((path) => {
                      const fileName = path.split('\\').pop();
                      return {
                        original: `../../../../public/${fileName}`,
                        thumbnail: `../../../../public/${fileName}`,
                        description: fileName,
                      };
                    });
                  };
                console.log('Convert: ',convertImageList);
                setImages(convertImageList(imageList));
                setCheckVideo(true);
            }else{
                setCheckVideo(false);
            }
            setIsCheckVideo(true);
        })
        .catch(err => console.log('err dectect video: ',err));
    }
    const handleClickAddMovie = () => {
        const updateMovie = {
            ...movie,
            poster: import.meta.env.VITE_GET_IMAGE + pathFilePoster
        }
        axios.post(import.meta.env.VITE_POST_CREATE_MOVIE,updateMovie)
        .then(() => {
            setAmountMovie(pre => pre + 1);
            console.log('moviecre: ', updateMovie)
            setMovieAdmin([updateMovie,...movieAdmin])
            setOpen(false);
            notify('The movie created success');
        })
        .catch(err => console.log('add movie err: ',err));
    }

    return ( <Fragment>
                <IconButton onClick={() => handleClickOpen('add')} aria-label="add">
                    <LibraryAddIcon color="primary" />
                </IconButton>
                <Dialog
                    open={open}
                    onClose={() => handleClose('add')}
                    maxWidth= 'md'
                >
                    <DialogTitle style={{textAlign:'center',fontSize:'28px'}}>Add Movie</DialogTitle>
                    <DialogContent style={{width:'550px'}}>
                            <form >
                                <Box sx={{margin:'10px 0'}}>
                                    <span>Title:</span><br />
                                    <TextField style={{width:'100%'}} onChange={e => handleAddMovie(e,'title')} id="filled-basic" value={movie?.title!=null ? movie?.title: ''} variant="outlined" />
                                </Box>
                                <Box sx={{margin:'10px 0'}}>
                                    <span>Descriptions:</span><br />
                                    <TextField style={{width:'100%'}} onChange={e => handleAddMovie(e,'desc')} id="filled-basic" value={movie?.descriptions!=null ? movie?.descriptions: ''} variant="outlined" />
                                </Box>
                                <Box sx={{margin:'10px 0'}}>
                                    <span>Urls</span>
                                    <Box sx={{height:'100px', border:'0.2px solid var(--borderLeftbar)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        <input type="file" id="fileInput"
                                            accept=".mp4,.mov,.avi"
                                            style={{ display: 'none' }} 
                                            onChange={(event) => handleVideoChange(event)}/>
                                        {pathFileUrls && <span>{pathFileUrls}</span>}
                                                <Box sx={{ display: 'flex', alignItems: 'center',marginLeft:'15px' }}>
                                                    <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
                                                    <span style={{ border: '1px solid #ccc', padding: '5px 10px', borderRadius: '4px' }}>
                                                        Upload Video
                                                    </span>
                                                    </label>
                                                </Box>
                                    </Box>
                                            <Box sx={{display:'flex', margin:'10px 0', alignItems:'center'}}>
                                                {
                                                !isCheckVideo ? 
                                                (!isVideo ? <span onClick={handleDetectVideo} className="btn btn-primary">Check</span>
                                                : <Box sx={{display:'flex'}}><span style={{margin:'0 10px'}}>Đang xử lý</span> <CircularProgress /></Box>)
                                                : checkVideo ? <ShowVideoErr images={images}/> : <span className="btn btn-success">Safe</span>
                                                }
                                            </Box>
                                </Box>
                                <Box sx={{margin:'10px 0'}}>
                                    <span>Original_language:</span><br />
                                    <FormControl required sx={{ m: 1, minWidth: 200 }}>
                                        <InputLabel id="demo-simple-select-required-label">Original_language</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-required-label"
                                            id="demo-simple-select-required"
                                            value={language}
                                            label="Original_language *"
                                            MenuProps = {MenuProps}
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
                                        {pathFilePoster ?
                                            <Box sx={{width:'100px !important',position: 'relative'}}>
                                                <IconButton onClick={() => setPathFilePoster('')} className={cx('delete_icon_avatar')} aria-label="delete" style={{position:'absolute', top:'5px',right:'5px'}}>
                                                    <DeleteIcon />
                                                </IconButton>
                                                <img style={{width:'100px', height:'100px', padding: '5px', borderRadius:'10px'}} src={import.meta.env.VITE_GET_IMAGE+pathFilePoster} alt="" />
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
                            </form>      
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => handleClose('add')}>Cancel</Button>
                    <Button onClick={handleClickAddMovie} color='primary'>Add</Button>
                    </DialogActions>
                </Dialog>
            </Fragment> );
}

export default AddDialog;