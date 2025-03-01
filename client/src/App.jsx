import { Routes,Route } from 'react-router-dom';
import {DefaultLayout} from './components/Layout';
import { publicRoute } from './Routers';
import { Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserContextProvider from './UserContext';
import MovieContextProvider from './MovieContext';
function App() {

  return (
    <div className="App">
        <UserContextProvider>
          <MovieContextProvider>
            <Routes>
              {publicRoute.map((item,index)=>{
                
                 const Comp = item.component;
                 let Layout = DefaultLayout;
    
                 if(item.layout){
                  Layout = item.layout;
                 }else if(item.layout === null){
                  Layout = Fragment;
                 }
    
                 return <Route key={index} path={item.path} element={<Layout><Comp/></Layout>}/>
              })}
            </Routes>
          </MovieContextProvider>
        </UserContextProvider>
    </div>
  )
}

export default App
