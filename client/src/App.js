import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Routes ,useNavigate , useLocation} from 'react-router-dom'
import {React,  useEffect, createContext,useReducer, useContext} from 'react';

import Signup from './components/screens/Signup';
import Login from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Home from './components/screens/Home';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword';
import SubscribedUserPost from './components/screens/SubscribedUserpost';
import {reducer,initialState} from './reducers/userReducer';


export const UserContext=createContext();

const Routing=()=>{

  const navigate=useNavigate();
  const location = useLocation();
  const [state,dispatch]=useContext(UserContext);  
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"));
    if(user){
     dispatch({type:"USER",payload:user});
      navigate('/');
    }else{
      // console.log(location);
      // console.log(" path nemdk "+location.pathname);
      if(!location.pathname.startsWith('/reset')){
        navigate('/signin');        
      }
      navigate('/signin');        
    }
  },[]);
  return(
    <Routes>
    <Route exact path="/" element={<Home/>}/>
    {/* <Route exact path="/allpost" element={<Home/>}/> */}
    <Route path="/signup" element={<Signup/>} />            
    <Route path="/signin" element={<Login/>} />
    <Route exact path="/profile" element={<Profile/>} />
    <Route path="/create" element={<CreatePost />} />
    <Route path="/profile/:userid" element={<UserProfile/>} />
    <Route path="/myfollowingpost" element={<SubscribedUserPost/>} />
    <Route exact path="/reset" element={<Reset/>} />
    <Route path="/reset/:token" element={<NewPassword/>} />

  </Routes>
  );
}


function App() {

  const [state,dispatch]= useReducer(reducer,initialState);
  
  return (
    <UserContext.Provider value={[state,dispatch]}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
