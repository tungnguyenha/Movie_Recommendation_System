import classNames from "classnames/bind";
import styles from './style.module.scss';
import { PieChart } from '@mui/x-charts/PieChart';
import Box from '@mui/material/Box';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import Table from 'react-bootstrap/Table';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../../UserContext";

const cx = classNames.bind(styles);
function Statistic() {
    const [data,setData] = useState();
    const [totalValue,setTotalValue] = useState(0);
    const {user} = useContext(UserContext);
    useEffect (() =>{
        axios.get(import.meta.env.VITE_GET_STATISTIC+user.userId)
        .then(result => {
            let newdata = [];
            [0,1,2,3,4].map((item, index) => (
                newdata.push({
                    id: index,
                    value: (result.data.accessTime[index]/60).toFixed(2),
                    label: result.data.country[index]
                  })
            ));
            const total = newdata.reduce((accumulator, currentValue) => accumulator + Number(currentValue.value), 0);
            setTotalValue(total.toFixed(2));
            setData(newdata);
        })
        .catch(err => console.log('errStatistic: ',err));
    },[]);
    console.log('data: ',totalValue);
    return ( <div className={cx('statistic')}>
                {data && <div className={cx('statistic-box')}>
                    <h1>Thống kê</h1>
                    <div className={cx('statistic-m')}>
                        <div className={cx('statistic-left')}>
                        <PieChart
                            series={[
                                {
                                data,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                },
                            ]}
                            height={200}
                            />
                        </div>
                        <div className={cx('statistic-right')}>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Quốc gia</th>
                                        <th>Lượng giờ truy cập(minute)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item,index) =>{
                                        return <tr key={index}>
                                                <td>{item.label}</td>
                                                <td>{item.value}</td>
                                        </tr>
                                    })}
                                    
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className={cx('statistic-gift')}>
                        <Box sx={{width: '90%',height:'3px',backgroundColor: 'white',position:'relative'}}>
                            <Box sx={{ width: `${totalValue/60*10}%`, height: '3px', backgroundColor: 'green', position:'absolute' }}>
                                <Box sx={{width:'15px',height:'15px',backgroundColor:'green', borderRadius:'50%', position:'absolute',right:'-5px',top:'-6px'}}></Box>
                            </Box>
                        </Box>
                        <div className={cx('statistic-gifticon')}>
                        <Tooltip title={`Bạn đã tích được ${totalValue} phút :<33`}>
                            <Fab color="primary" aria-label="add">
                                <CardGiftcardIcon color="pink" fontSize="large" />                       
                            </Fab>
                        </Tooltip>
                        </div>
                    </div>
                    <div className={cx('statistic-gift-s')}>
                        <Box sx={{ width: '90%',display: 'flex', justifyContent:'space-between', color:'white' }}>
                        {
                            Array.from({ length: 11 }, (_, index) => index + 1).map((item,index) =>{
                                return <span key={index}>{item-1}</span>
                            })
                        }
                        </Box>
                    </div>
                    <Box sx={{display:'flex',justifyContent:'center',color:'white',fontSize:'20px'}}><p>Tích đủ 10 giờ xem để nhận quà</p></Box>
                </div>}
            </div> );
     }
export default Statistic;