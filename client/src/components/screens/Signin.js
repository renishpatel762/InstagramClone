import {React,useState, useContext} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './Login.css';
import M from 'materialize-css'
import { UserContext } from '../../App';

const Signin = () => {
    const [state,dispatch]= useContext(UserContext);
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid email", classes: "#c62828 red daeken-3" });
            return;
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password,
                email
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red daeken-3" });
                } else {
                    localStorage.setItem("jwt",data.token);
                    localStorage.setItem("user",JSON.stringify(data.user));
                    dispatch({type:"USER",payload:data.user});
                    M.toast({ html: "Login Successfully", classes: "#43a047 green darken-1" })
                    navigate('/');
                }
            }).catch(err => {
                console.log(err);
            })
    }
    console.log("Hello renish");
    return (
        <div className='My-container'>
       <div className='Logincard'>
        <h2 className='brand-logo' style={{"textAlign":"center"}}>Instagram</h2>
             
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
            <button className='LoginBtn' onClick={() =>PostData()}>Signin</button><br/><br/>
            <span style={{"color":"grey","fontSize":"15px"}}>Don't have an Account? Please <Link to="/SignUp"><span style={{"color":"blue","textDecoration":"underline"}}>SignUp</span></Link> !!</span>
       </div>
    </div>
    )
}

export default Signin;
