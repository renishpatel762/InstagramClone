import React, { useContext, useEffect, useState } from 'react';
import './profile.css';
import { UserContext } from '../../App';

//not getting data from backend
const Profile = () => {

    const [mypics, setPics] = useState([]);
    const [state, dispatch] = useContext(UserContext);
    const [image, setImage] = useState("");

    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result.mypost);
                setPics(result.mypost);
                // console.log("my pics"+mypics);
            })
    }, []);

    useEffect(() => {
        if (image) {
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "insta-clone");
            data.append("cloud_name", "renishcloud");
            fetch("https://api.cloudinary.com/v1_1/renishclould/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            console.log(result)
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }))
                            dispatch({ type: "UPDATEPIC", payload: result.pic })
                            window.location.reload();
                        })

                })
                .catch(err => {
                    console.log(err)
                })
        }
    }, [image]);

    const updatePhoto = (file)=>{
        setImage(file)
    }

    return (
        <div className='mainDiv'>
             <div className='profilePage'>  
                    <div>
                        <img className='ProfilePic'
                            src={state ? state.pic : "loading"}
                        />
                    </div>
                    <div className='ContentContainer'>
                    <span style={{"fontWeight":"350","fontSize":"18px"}}>{state ? state.name : "Loading.."}
                            {/* <img src={verified} style={{"width":"20px","height":"20px","marginLeft":"5px"}}/> */}
                    </span>
                    <br/>
                    <span style={{"fontSize":"12px"}}>{state ? state.email : "Loading.."}
                    </span>
                        <div style={{"display":"flex","justifyContent":"space-between","width":"150%"}}>
                           <div><h6 style={{"textAlign":"center","fontWeight":"550","cursor":"pointer"}}>{mypics.length}</h6> 
                                 posts</div>
                           <div><h6 style={{"textAlign":"center","fontWeight":"550","cursor":"pointer"}}>{state ? state.followers.length : "0"}</h6> 
                                 follower</div>
                           <div><h6 style={{"textAlign":"center","fontWeight":"550","cursor":"pointer"}}>{state ? state.following.length : "0"}</h6> 
                                 following</div>
                         </div>
                    </div>
                <br/>
                </div>
                <div className="file-field input-field" style={{ margin: "10px" }}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update pic</span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
            </div>
            <div className="Gallary">
                {
                    mypics.slice(0).reverse().map(item => {
                        return (
                            <img key={item._id} className="item" src={item.photo} alt={item.title} />
                        )
                    })
                }
            </div>
        </div>
    )
}
export default Profile;