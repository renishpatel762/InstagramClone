import React, { useContext, useEffect, useState } from 'react';
import './profile.css';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom'
//not getting data from backend

const Profile = () => {

    const [userProfile, setProfile] = useState(null);
    const [state, dispatch] = useContext(UserContext);
    const { userid } = useParams()
    const [showfollow, setShowFollow] = useState(state?!state.following.includes(userid):true);

    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //console.log(result)
                setProfile(result)
            })
    }, [])

    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false);
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true);             
        })
    }

    return (
        <>
            {userProfile ?  <div className='mainDiv'>
                           <div className='profilePage'>  
                           <div>
                                     <img className='ProfilePic'
                                       src={userProfile.user.pic}
                                                                          />
                           </div>
                           <div className='ContentContainer'>
                           <span style={{"fontWeight":"350","fontSize":"18px"}}>{userProfile.user.name}</span><br/>
                           <span style={{"fontSize":"12px"}}>{userProfile.user.email}</span>
                          
                           <div style={{"display":"flex","justifyContent":"space-between","width":"150%"}}>
                           <div><h6 style={{"textAlign":"center","fontWeight":"550","cursor":"pointer"}}>{userProfile.posts.length}</h6> 
                                 posts</div>
                           <div><h6 style={{"textAlign":"center","fontWeight":"550","cursor":"pointer"}}>{userProfile.user.followers.length}</h6> 
                                 follower</div>
                           <div><h6 style={{"textAlign":"center","fontWeight":"550","cursor":"pointer"}}>{userProfile.user.following.length} </h6> 
                                 following</div>
                         </div>
                            {showfollow ?
                                <button style={{margin:"10px"}} className="LoginBtn"
                                    onClick={() => followUser()}>
                                    Follow
                                </button>
                                :
                                <button style={{margin:"10px"}} className="LoginBtn"
                                    onClick={() => unfollowUser()}>
                                    UnFollow
                                </button>
                            }
                             </div>
                    </div>
                    <div className="Gallary">
                        {
                            userProfile.posts.slice(0).reverse().map(item => {
                                return (
                                    <img className="item" src={item.photo} alt={item.tile} />
                                )
                            })
                        }
                    </div>
                </div>
                :
                <h2>Loading...!</h2>
            }
        </>
    )
}
export default Profile;