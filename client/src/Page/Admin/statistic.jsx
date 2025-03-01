import classNames from "classnames/bind";
import styles from './style.module.scss';
import { PieChart } from '@mui/x-charts/PieChart';
import MUIDataTable from "mui-datatables";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
const columns = ["Name", "Company", "City", "State"];


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
function StatisticAdm() {
      

      const [user,setUser] = useState();
      useEffect(()=>{
          fetch('https://dummyjson.com/users')
            .then(res => res.json())
            .then((data)=> setUser(data?.users))
      },[])
      const columns = [
        {
            name: "age"
        },{
            name: "gender",
            options:{
                customBodyRender:(value) => <p>{value}</p>
            }
        }
       ];
    
       
       const options = {
         rowsPerPageOptions:[5,7,9,12],
         selectableRows:false,
         rowsPerPage: 6
       };

    return ( <div className={cx('statistic')}>
                <h1>Thống kê</h1>           
                <ThemeProvider theme={getMuitheme()}>
                    <MUIDataTable
                        title={"User List"}
                        data={user}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>
            </div>
        
     );
}

export default StatisticAdm;