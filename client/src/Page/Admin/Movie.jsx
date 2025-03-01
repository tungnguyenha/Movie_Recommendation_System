import classNames from "classnames/bind";
import styles from './style.module.scss';

import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Fragment, useContext, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import axios from "axios";
import AddDialog from "./DialogHelper/AddDialog";
import EditDialog from "./DialogHelper/EditDialog";
import { notify } from "../../components/Layout/Component/Notify";
import { MovieContext } from "../../MovieContext";
import { UserContext } from "../../UserContext";

const cx = classNames.bind(styles);

const getMuitheme = () => createTheme({
    typography:{
        fontFamily:"Poppins",
    },
    palette:{
        background:{
            paper: "#1e293b",
            default: '0f172a'
        },
        mode: 'dark'
    },
    components:{
        MuiTableCell:{
            styleOverrides:{
                head:{
                    padding:" 10px 4px"
                },
                body:{
                    padding: "7px 15px",
                    color: "#e2e8f0"
                }
            }
        }
    }
})
function MovieAdm() {    
    const {movieAdmin,setMovieAdmin} = useContext(MovieContext);
    const [open, setOpen] = useState(false);
    const [openEdit,setOpenEdit] = useState(false);
    const [pathFilePoster, setPathFilePoster] = useState('');
    const [pathFileUrls, setPathFileUrls] = useState('');
    const [indexEdit,setIndexEdit] = useState(0);
    const {setAmountMovie} = useContext(UserContext);

    const handleClickOpen = (title) => {
        if(title == 'add'){
            setOpen(true);
        }else{
            setOpenEdit(true);
        }
    };

    const handleClose = (title) => {
        if(title == 'add'){
            setOpen(false);
        }else{
            setOpenEdit(false);
        }
    };
    const handleClickOpenEditDialog = (index) =>{
        handleClickOpen('edit');
        setIndexEdit(index);
    }

      const handleRemoveMovie = (id) =>{
        console.log('id: ',id);
        axios.delete(import.meta.env.VITE_DELETE_MOVIE+id)
        .then(() =>{
            const updatedMovies = movieAdmin.filter(mv => mv.movieId !== id);
            setMovieAdmin(updatedMovies);
            notify('The movie is removed');
            setAmountMovie(pre => pre -1);
        })
        .catch(err => console.log('err remove: ',err));
      }
      const columns = [
        {
            name:"movieId",
            options:{
                customBodyRender:(value) => <p style={{textAlign:'center',}}>{value}</p>
            }
        },
        {
            name: "title",
            options:{
                customBodyRender:(value) => <p style={{maxWidth: '100px',whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'}}>{value}</p>
            }
        },{
            name: "isType",
            options:{
                customBodyRender:(value) => <p style={{textAlign:'center',}}>{value==1?'New':(value==0?'normal':'Hot')}</p>
            }
        },{
            name: "originalLanguage",
            options:{
                customBodyRender:(value) => <p style={{textAlign:'center',}}>{value}</p>
            }
        },{
            name: "poster",
            options:{
                customBodyRender:(value) => <img width={80} height={80} src={value} alt="" />
            } 
        },{
            name: "voteCount",
            options:{
                customBodyRender:(value) => <p style={{textAlign:'center',}}>{value}</p>
            }
        },{
            name: "voteAverage",
            options:{
                customBodyRender:(value) => <p style={{textAlign:'center',}}>{value}</p>
            }
        },{
            name: "Add",
            options:{
                customBodyRender:() => <AddDialog open={open} setOpen={setOpen} handleClickOpen={handleClickOpen} 
                handleClose={handleClose} pathFilePoster={pathFilePoster} setPathFilePoster={setPathFilePoster}
                pathFileUrls={pathFileUrls} setPathFileUrls= {setPathFileUrls}
               />
            }
        },{
            name: "Edit",
            options:{
                customBodyRender:(value,data) => <Fragment>
                                                    <IconButton onClick={() => handleClickOpenEditDialog(data.rowIndex)} aria-label="edit">
                                                        <ModeEditIcon color="success" />
                                                    </IconButton>
                                                    {openEdit && indexEdit == data.rowIndex && <EditDialog openEdit={openEdit} setOpenEdit={setOpenEdit}
                                                                handleClose={handleClose} data={data.rowData} movie1={movieAdmin} setMovie1={setMovieAdmin}
                                                                />}
                                                  </Fragment> 
            }
        },{
            name: "Remove",
            options:{
                customBodyRender:(value,data) => <IconButton onClick={() => handleRemoveMovie(data.rowData[0])} aria-label="delete">
                                                    <DeleteIcon color="warning" />
                                                </IconButton>
            }
        }
       ];
    
       
       const options = {
         rowsPerPageOptions:[4,8,12],
         selectableRows:'none',
         rowsPerPage: 4
       };
    return ( <div className={cx('movie')}>
                <div className={cx('movie-box')}>
                    <h1>Movie</h1>           
                    <ThemeProvider theme={getMuitheme()}>
                        <MUIDataTable
                            title={"Movie Manager"}
                            data={movieAdmin}
                            columns={columns}
                            options={options}
                        />
                    </ThemeProvider>
                </div>
            </div>
        
     );
}

export default MovieAdm;