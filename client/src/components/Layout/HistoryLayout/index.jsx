import Footer from "../Component/Footer";
import Header from "../Component/Header";
import Leftbar from "./leftbar";

import classNames from 'classnames/bind';
import styles from './style.module.scss';

const cx = classNames.bind(styles);
// eslint-disable-next-line react/prop-types
function DefaultLayout({children}) {
    return ( <div className={cx('history-layout')}>
        <div className={cx('history-header')}>
            <Header/>
        </div>
        <div className={cx("content")}>
            <Leftbar/>
            <div className={cx('content-child')}>
                {children}
            </div>
        </div>
        <Footer/>
    </div> );
}

export default DefaultLayout;