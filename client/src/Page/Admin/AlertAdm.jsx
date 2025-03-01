import classNames from "classnames/bind";
import styles from './style.module.scss';

import MUIDataTable from "mui-datatables";
import { ThemeProvider, createTheme } from "@mui/material/styles";
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
function AlertAdm() {
    const {userSubs,setUserSubs,setAlert} = useContext(UserContext);
    const getBuyVipName = (type) =>{
        switch(type){
            case 1:
                return 'Month';
            case 2:
                return 'Quarter';
            case 3:
                return 'Year';
            case 4:
                return 'Month S';
        }
    }
    console.log('userSub: ',userSubs);
    const handleClickApproving = (value,index,data) =>{
        if(value == 1){
            const updateApproving = {
                userId: data[0],
                status: data[4],
                isType: data[3]
            }
            console.log('data: ',updateApproving);
            axios.put(import.meta.env.VITE_PUT_UPDATE_BUY_VIP, updateApproving)
            .then(result => {
                console.log('data: ',result.data)
                notify('approving success')
                setAlert(pre => pre - 1);
                const newData = [...userSubs];
                const approveData = newData[index];
                approveData.status = 2;
                approveData.startDay = result.data.startDay;
                approveData.endDay = result.data.endDay;
                newData[index] = approveData
                setUserSubs(newData);
            })
            .catch(err => console.log('failed to approving: ',err));
        }
    }
    const columns = [
        {
            name:"userId",
            options:{
                customBodyRender:(value) => <p style={{textAlign:'center'}}>{value}</p>
            }
        },
        {
            name: "startDay",
            options:{
                customBodyRender:(value) => <p>{value.split('T')[0]}</p>
            }
        },
        {
            name: "endDay",
            options:{
                customBodyRender:(value) => <p>{value.split('T')[0]}</p>
            }
        },{
            name: "isType",
            options:{
                customBodyRender:(value) => <p>{getBuyVipName(value)}</p>
            }
        },{
            name: "status",
            options:{
                customBodyRender:(value,data) => <Box sx={{width:'100px'}}> <Button onClick={() => handleClickApproving(value,data.rowIndex,data.rowData)} fullWidth variant="contained" color={value==1?'warning':'success'}>{value==1?'Processing':'Approved'}</Button></Box>
            }
        }
    ];
       
    const options = {
        rowsPerPageOptions:[6,12],
        selectableRows:'none',
        rowsPerPage: 6
    };

    return ( <div className={cx('movie')}>
                <div className={cx('alert-box')}>
                    <h1>User subscribe</h1>           
                    <ThemeProvider theme={getMuitheme()}>
                        <MUIDataTable
                            title={"User subscribe Manager"}
                            data={userSubs}
                            columns={columns}
                            options={options}
                        />
                    </ThemeProvider>
                </div>
    </div> );
}

export default AlertAdm;