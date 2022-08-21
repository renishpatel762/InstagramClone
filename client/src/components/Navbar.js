import React, { useContext , useRef ,useEffect, useState} from 'react'
import { Link , useNavigate} from 'react-router-dom';
import { UserContext } from '../App';
import tab from '../icons/tab.png';
import user from '../icons/user.png';
import fav from '../icons/fav.png';
import home from '../icons/hut.png'
import M from 'materialize-css';

const Navbar = () => {
    const searchModal=useRef(null); 
    const [ state, dispatch ] = useContext(UserContext);
    const [userDetails,setUserDetails] =useState([]);
    const [search,setSearch]=useState(userDetails);

    const navigate=useNavigate();
    
    useEffect(() => {
        M.Modal.init(searchModal.current)        
    }, []);

    const renderList = () => {
        if (state) {
            return [
                <>
                <div className='right_Nav'>
                <li key="1"><i data-target="modal1" className="large material-icons modal-trigger icons"  style={{color:"black"}}>search</i></li>
                <li key="2"><Link to="/myfollowingpost"><img src={fav} className="icons" /></Link></li>
                <li key="3"><Link to="/create"><img src={tab} className="icons" /></Link></li>
                <li key="4"><Link to="/profile"><img src={user} className="icons" /></Link></li>
                <li key="5">
                <button className='logOutbtn'
                    onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"ClEAR"})
                        navigate('/signin')
                    }}>
                    logout
                </button>
                </li>
                </div>
                <button className='logOutbtn2'
                    onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"ClEAR"})
                        navigate('/signin')
                    }}>
                    logout
                   </button>
                <div className='right_Nav2'>
                <li key="1"><Link to="/"><img src={home} className="icons" /></Link></li>
                <li key="2"><i data-target="modal1" className="large material-icons modal-trigger icons"  style={{color:"black"}}>search</i></li>
                <li key="3"><Link to="/create"><img src={tab} className="icons" /></Link></li>
                <li key="4"><Link to="/myfollowingpost"><img src={fav} className="icons" /></Link></li>
                <li key="5"><Link to="/profile"><img src={user} className="icons" /></Link></li>
                </div>
                </>
                ]
        } else {
            return [
                <li><Link key="6" to="/signin">Signin</Link></li>,
                <li><Link key="7" to="/signup">Signup</Link></li>
            ]
        }
    }

    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
            console.log(results);
            setUserDetails(results.user);
        })
    }
    return (
        <div>
            <nav style={{boxShadow:"none",borderBottom:"1px solid #cacaca"}} className="navBar">
                <div className="nav-wrapper white">
                    <Link to={state ? "/" : "/signin"} className="brandLogo">Instagram</Link>
                    <ul id="nav-mobile" className="right ">
                        {renderList()}
                    </ul>
                </div>
                <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
                    <div className="modal-content" style={{padding:"10px"}}>
                    <input
                        type="text"
                        placeholder="Search Users"
                        value={search}
                        onChange={(e) => fetchUsers(e.target.value)}
                    />
                   <ul className="collection">
                        {userDetails.map(item=>{
                            return <Link to={item._id!== state._id ? "/profile/"+item._id : '/profile'} onClick={()=>{
                                M.modal.getInstance(searchModal.current).close();
                                setSearch('');
                            }}> <li className="collection-item">{item.email}</li></Link>
                        })}
                    </ul>
                    </div>
                    <div className="modal-footer">
                    <button  className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;