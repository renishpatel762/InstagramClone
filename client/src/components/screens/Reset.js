import {React,useState, useContext} from 'react';
import { Link,useNavigate } from 'react-router-dom';

import './Login.css';
import M from 'materialize-css'
import { UserContext } from '../../App';

const Reset = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const PostData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Invalid email", classes: "#c62828 red daeken-3" });
            return;
        }
        fetch("/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red daeken-3" });
                } else {
                                        
                    M.toast({ html: data.message, classes: "#43a047 green darken-1" })
                    navigate('/sigin');
                }
            }).catch(err => {
                console.log(err);
            })
    }
    return (
        <div>
            <div className="mycard ">
                <div className="card auth-card input-field">
                    <h2>Instagram</h2>
                    <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className="btn waves-effect #64b5f6 blue darken-1"
                        onClick={() => PostData()}>
                        Reset Password
                    </button>

                </div>
            </div>
        </div>
    )
}

export default Reset;
