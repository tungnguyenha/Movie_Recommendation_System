
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import 
{ BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
 from 'react-icons/bs'
 import 
 { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
 from 'recharts';

 import {useNavigate} from'react-router-dom';
import { UserContext } from '../../UserContext';
import { MovieContext } from '../../MovieContext';

function HomeAdmin() {

    const [countCountry,setCountCountry] = useState();
    const {setListUsers,amountUser,setAmountUser,amountMovie,
        setAmountMovie,setUserSubs,alert,setAlert} = useContext(UserContext);
    const {setMovieAdmin,setMovieVoteCount,setCountryCode} = useContext(MovieContext);

    const navigate = useNavigate();
    useEffect(() =>{
      axios.get(import.meta.env.VITE_GET_COUNT_COUNTRY_ADMIN)
      .then(result => {
        const countUser = result.data.countUser;
        const sumAccesTime = result.data.sumAccessTime;
        let myArray = [3, 6, 1, 0, 5, 2, 4];
        const newdata = myArray.map((item) =>{
          return {name:countUser[item].nameCountry,user: countUser[item].accessTime,minute:(sumAccesTime[item].accessTime/60).toFixed(2)}
        })
        setCountCountry(newdata);
      })
      .catch(err => console.log('get admin country err: ',err))

      axios.get(import.meta.env.VITE_GET_USER_ADMIN)
      .then(result => {
        setListUsers(result.data.listUser);
        setAmountUser(result.data.amount);
      })
      .catch(err => console.log('get user err: ', err));

      axios.get(import.meta.env.VITE_GET_MOVIE_ADMIN)
      .then(result => {
        setMovieAdmin(result.data.listMovie);
        setAmountMovie(result.data.amount);
       })
       .catch(err => console.log('err get movie: ',err));

       axios.get(import.meta.env.VITE_GET_USER_SUBS)
      .then(result => {
        setUserSubs(result.data.listUserSubs);
        setAlert(result.data.amount);
       })
       .catch(err => console.log('err get movie: ',err));

       axios.get(import.meta.env.VITE_GET_MOVIE_VOTE_COUNT)
      .then(result => {
            const updatedData = result.data.map(movie => {
              return { ...movie, voteCount: (movie.voteCount / 1000).toFixed(2) };
            });
            setMovieVoteCount(updatedData);
       })
       .catch(err => console.log('err get movie: ',err));

       axios.get(import.meta.env.VITE_GET_COUNTRY_CODE)
       .then(result => {
         setCountryCode(result.data);
        })
        .catch(err => console.log('err get movie: ',err));
    },[])
  
  const handleClickNavigate = (name) =>{
    switch(name){
        case 'movie':
            navigate('/adm/movie');
            break;
        case 'user':
            navigate('/adm/user');
            break;
        case 'alert':
            navigate('/adm/alert');
            break;
    }
  }
  return (
    <main className='main-container'>
        <div className='main-title'>
            <h3>DASHBOARD</h3>
        </div>

        <div className='main-cards'>
            <div className='card' onClick={() => handleClickNavigate('movie')}>
                <div className='card-inner'>
                    <h3>Movie</h3>
                    <BsFillArchiveFill className='card_icon'/>
                </div>
                <h1>{amountMovie}</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Country</h3>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </div>
                <h1>12</h1>
            </div>
            <div className='card' onClick={() => handleClickNavigate('user')}>
                <div className='card-inner'>
                    <h3>CUSTOMERS</h3>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1>{amountUser}</h1>
            </div>
            <div className='card' onClick={() => handleClickNavigate('alert')}>
                <div className='card-inner'>
                    <h3>ALERTS</h3>
                    <BsFillBellFill className='card_icon'/>
                </div>
                <h1>{alert}</h1>
            </div>
        </div>

        <div className='charts'>
            <ResponsiveContainer width="80%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={countCountry}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="minute" fill="#8884d8" />
                <Bar dataKey="user" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </main>
  )
}

export default HomeAdmin