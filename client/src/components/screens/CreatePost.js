import React, { useState,useEffect } from 'react';
import M from 'materialize-css';
import photo from '../../photo.png';
import { useNavigate } from 'react-router';
// import './CreatePost.css';


const CreatePost = () => {
    const navigate=useNavigate
    const [title,setTitle] =useState("");
    const [body,setBody]= useState("");
    const [image,setImage]=useState("");
    const [url,setUrl]=useState(undefined);
    const [preview, setPreview] = useState("");

     const fetchPhoto = () => {
        const data=new FormData();
        data.append("file",image);
        data.append("upload_preset","insta-clone");
        data.append("cloud_name","renishcloud");
        fetch("https://api.cloudinary.com/v1_1/renishclould/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url);
            setPreview(data.url);
        })
        .catch(err=>{
            console.log(err);
        });
     }
    const postDetails=()=>{
        fetchPhoto();
        fetch("/createpost", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red daeken-3" });
                } else {
                    M.toast({ html: "created post successfully", classes: "#43a047 green darken-1" })
                    navigate('/');
                }
            }).catch(err => {
                console.log(err);
            })            
        }
        useEffect(() => {
            fetchPhoto();
        }, [image]);
        
          console.log(image);
          console.log(url);
          console.log(preview);
    return (
        <div className='profiletab cntiner'>
              <img alt='image preview' className='previewImage' src={preview ? preview : photo} draggable/>
             <div className="file-field input-field">
                    <span style={{color:"blue"}}>Select From Device</span>
                    <input  className="btn  #64b5f6 blue darken-1" type="file" onChange={(e)=> setImage(e.target.files[0])} />
            </div>
           <div style={{padding:"10px"}}>
            <div>
             <label className='label'>Title</label>
             <input className='input-field' type="text" placeholder='Add Caption Here'
             value={title} 
             onChange={(e)=>setTitle(e.target.value)}/>
           </div>
            <div>
             <label className='label'>Caption</label>
             <input className='input-field' type="text" placeholder='Add Caption Here'
              value={body} 
              onChange={(e)=>setBody(e.target.value)}/>
           </div>
            <button className="LoginBtn"
            onClick={()=>postDetails()}>
             Post
            </button>

            </div> 
        </div>
    );
}

export default CreatePost;
