import { useState } from 'react'
//import Header from './Header'
import Sidebar from './Sidebar'

import './style.css';
import { ToastContainer } from 'react-toastify';
// eslint-disable-next-line react/prop-types
function AdminLayout({children}) {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }
    return ( <div className='grid-container'>
        <ToastContainer/>
        <div className='content'>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
            <div className='content-right'>{children}</div>
        </div>
  </div> );
}

export default AdminLayout;