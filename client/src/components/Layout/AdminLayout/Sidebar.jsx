import { useContext } from 'react';
import 
{ BsGrid1X2Fill, BsFillArchiveFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill}
 from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../../UserContext';

// eslint-disable-next-line react/prop-types
function Sidebar({openSidebarToggle, OpenSidebar}) {
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    const handleNavigate = (path) =>{
        navigate(path);
    }
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <BsPeopleFill  className='icon_header'/> {user?.userName}
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>X</span>
            </div>

            <ul className='sidebar-list'>
                <li onClick={() => handleNavigate('/adm/home')} className='sidebar-list-item'>
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </li>
                <li onClick={() => handleNavigate('/adm/movie')} className='sidebar-list-item'>
                    <BsFillArchiveFill className='icon'/> Movie
                </li>
                <li onClick={() => handleNavigate('/adm/user')} className='sidebar-list-item'>
                    <BsPeopleFill className='icon'/> Customers
                </li>
                <li onClick={() => handleNavigate('/adm/vote-count')} className='sidebar-list-item'>
                    <BsListCheck className='icon'/> Vote-Count
                </li>
                <li onClick={() => handleNavigate('/adm/alert')} className='sidebar-list-item'>
                    <BsMenuButtonWideFill className='icon'/> Alert
                </li>
            </ul>
        </aside>
  )
}

export default Sidebar