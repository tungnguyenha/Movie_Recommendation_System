import classNames from "classnames/bind";
import styles from './style.module.scss';

import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import axios from "axios";
import { notify } from "../../components/Layout/Component/Notify";
import { UserContext } from "../../UserContext";
import { useContext } from "react";

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
function UserAdm() {
    const {listUsers,setListUsers,setAmountUser} = useContext(UserContext);
    const columns = [
        {
            name:"userId",
            options:{
                customBodyRender:(value) => <p style={{textAlign:'center',}}>{value}</p>
            }
        },
        {
            name: "userName",
            options:{
                customBodyRender:(value) => <p style={{textAlign:'center',}}>{value}</p>
            }
        },
        {
            name: "email",
            options:{
                customBodyRender:(value) => <p style={{maxWidth: '100px',whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'}}>{value}</p>
            }
        },{
            name: "password",
            options:{
                customBodyRender:(value) => <p style={{textAlign:'center'}}>{value}</p>
            }
        },{
            name: "gender",
            options:{
                customBodyRender:(value) => <Box sx={{width:'80px'}}> <Button fullWidth variant="contained" color={value==0?'success':(value==1?'primary':'warning')}>{value==0?'female':(value==1?'male':'other')}</Button></Box>
            }
        },{
            name: "Remove",
            options:{
                customBodyRender:(value,data) => <IconButton onClick={() => handleRemoveUser(data.rowData[0])} aria-label="delete">
                                                    <DeleteIcon color="warning" />
                                                </IconButton>
            }
        }
    ];
    const handleRemoveUser = (id) =>{
    console.log('id: ',id);
    axios.delete(import.meta.env.VITE_DELETE_USER+id)
    .then(() =>{
        const updatedMovies = listUsers.filter(mv => mv.userId !== id);
        setListUsers(updatedMovies);
        setAmountUser(pre => pre-1);
        notify('The user is removed');
    })
    .catch(err => console.log('err remove: ',err));
    }
       
    const options = {
        rowsPerPageOptions:[6,12],
        selectableRows:'none',
        rowsPerPage: 6
    };

    return ( <div className={cx('movie')}>
                <div className={cx('movie-box')}>
                    <h1>User</h1>           
                    <ThemeProvider theme={getMuitheme()}>
                        <MUIDataTable
                            title={"User Manager"}
                            data={listUsers}
                            columns={columns}
                            options={options}
                        />
                    </ThemeProvider>
                </div>
    </div> );
}

export default UserAdm;