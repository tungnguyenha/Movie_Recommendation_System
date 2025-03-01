import { useContext } from 'react';
import classNames from "classnames/bind";
import styles from './style.module.scss';
import 
{ BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
from 'recharts';
import { MovieContext } from '../../MovieContext';

const cx = classNames.bind(styles);
function VoteCountMovie() {
    const {movieVoteCount} = useContext(MovieContext);
    return ( <div className={cx('movie')}>
        <div className={cx('movie-box')}>
        <h1>Vote-Counts</h1>
        <div className='charts'>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                width={500}
                height={300}
                data={movieVoteCount}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="voteCount" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="voteAverage" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
        </div>
    </div> );
}

export default VoteCountMovie;
