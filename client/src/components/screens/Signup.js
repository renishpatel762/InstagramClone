import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './Login.css';
import M from 'materialize-css';
import user from '../../user.png';
const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [url, setUrl] = useState(undefined);
    const [image, setImage] = useState("");

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url]);

    const uploadPic = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "renishcloud");
        fetch("https://api.cloudinary.com/v1_1/renishclould/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                setUrl(data.url);
            })
            .catch(err => {
                console.log(err);
            });

    }
    const uploadFields = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid email", classes: "#c62828 red daeken-3" });
            return;
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red daeken-3" });
                } else {
                    M.toast({ html: data.message, classes: "#43a047 green darken-1" })
                    navigate('/');
                }
            }).catch(err => {
                console.log(err);
            })
    }
    useEffect(() => {
       uploadPic();
    }, [image])
    
    console.log(image);
    const PostData = () => {
        if (image) {
            uploadPic()
        } else {
            uploadFields()
        }
    }

    return (
        <div>
            <div className='My-container'>
          <div className='Logincard'>
           <h2 className='brand-logo' style={{"textAlign":"center"}}>Instagram</h2>
              <div style={{"textAlign" : "center"}}>
                <img className='profilePic' src={url ? url : user} alt='dp'/>
                <br/>
                <input type="file" class="custom-file-input" onChange={(e) => setImage(e.target.files[0])} />
                </div>
              <div>
                <label>Username</label>
                <input className='input-field' type="text" placeholder='ItsSpark69' 
                value={name}  onChange={(e) => setName(e.target.value)}/>
            </div>
         <div>
             <label>Email</label>
             <input className='input-field' type="text" placeholder='Spark3000@gmail.com'
              value={email} onChange={(e) => setEmail(e.target.value)}/>
         </div>
         <div>
              <label>Password</label>
             <input className='input-field' type="password" placeholder='Spark@3000' 
             value={password} onChange={(e) => setPassword(e.target.value)} />
         </div>
         <button className='LoginBtn' onClick={() =>PostData()}>SignUp</button><br/><br/>
         <span style={{"color":"grey","fontSize":"15px"}}> Already have an account ? Please <Link to="/SignIn"><span style={{"color":"blue","textDecoration":"underline"}}>Signin</span></Link> !!</span>
    </div>
 </div>
        </div>
    )
}

export default Signup;
