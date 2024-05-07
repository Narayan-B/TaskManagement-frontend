import {Routes,Route,Link} from 'react-router-dom'
import Home from './components/Home';
import Register from "./components/Register";
import Login from './components/Login';
import Account from './components/Account';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import Task from './components/Task';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import UnAuthorized from './components/UnAuthorized';
// Inside your main component


export default function App() {
  const {user,handleLogin,handleLogout}=useAuth()
  useEffect(()=>{
    if(localStorage.getItem('token')){
      (async()=>{
        const response=await axios.get('http://localhost:5666/account',{
          headers:{
            authorization:localStorage.getItem('token')
          }
        })
        console.log(response.data)
        handleLogin(response.data)
      })()
    }

  },[handleLogin])

  return (
    <div>
      <h1>Task Management App</h1>
      <ToastContainer />
      <Link to='/'>Home ||</Link>
      {!user ?(
        <>
        <Link to='/register'>Register || </Link>
      <Link to='/login'>Login</Link> ||</>

      ):(
        <>
        <Link to='/dashboard'>Dashboard</Link>||
        <Link to='/account'>Account</Link>||
        <Link to='/' onClick={handleLogout}>Logout</Link>
        
        </>
      )}
      
      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path ='/account' element={<PrivateRoute permittedRoles={['employee','teamlead']}><Account/></PrivateRoute>}/>
        <Route path ='/dashboard' element={<PrivateRoute permittedRoles={['employee','teamlead']}><Dashboard/></PrivateRoute>}/>
        <Route path='/task' element={<PrivateRoute permittedRoles={['teamlead']}><Task/></PrivateRoute>}/>
       <Route path='/unauthorized' element={<UnAuthorized/>}/>

      </Routes>
      
      
  
    </div>
  );
}


