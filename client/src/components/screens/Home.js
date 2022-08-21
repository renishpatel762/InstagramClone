import React, { useEffect, useState, useContext } from 'react';
import './home.css';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState([]);
    const [state, dispatch] = useContext(UserContext);
    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                setData(result.posts);
            })
    }, []);

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        if(text==="" || text===null || text == " "){
            return;
        }
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result;
                    } else {
                        return item;
                    }
                })
                setData(newData);
            }).catch(err => {
                console.log(err);
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {//   this is back qoute
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }
   console.log(data);
    return (
        <div>
            <div className="cntiner">
                {
                    data.map(item => {
                        return (
                            <div className="card home-card" key={item._id}>

                           <div className='Post-top_Section'>     
                                <img src={item.postedBy.pic} className="HpPic"/>
                               <span>
                                   <Link to={ item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link>
                                    {item.postedBy._id == state._id
                                        && <i className="material-icons deleteBTn" 
                                        style={{float: "right"}}
                                        onClick={() => deletePost(item._id)}
                                        >delete</i>
                                    }</span>
                            </div>        
                                <div className="card-image">
                                    <img src={item.photo} alt="image" />
                                </div>
                        <div className="card-content" style={{padding:"10px"}}>
                            <div className="card-actions">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                    {item.likes.includes(state._id)
                                        ?
                                        <i className="material-icons"
                                            onClick={() => { unlikePost(item._id) }}
                                        >thumb_down</i>
                                        :
                                        <i className="material-icons"
                                            onClick={() => { likePost(item._id) }}
                                        >thumb_up</i>
                                    }
                             </div>       
                                    <span className="likes">{item.likes.length} likes</span>
                                    {/* <h6>{item.postedBy.name} : {item.title}</h6> */}
                                    <p className="caption">
                                         <span className="captioner">{item.postedBy.name}</span>{item.body}</p>

                                   
                                   <div className="commentSection"> 
                    {item.comments.length > 1 ? <span style={{color:"grey"}}>view all {item.comments.length} comments </span> : null}
                                   <br/>     
                                    {
                                        item.comments.map(record => {
                                            return (
                                                <>
                                    <span key={record._id}><span style={{ fontWeight: "450",  fontSize:"15px" }}>{record.postedBy.name} </span> {record.text}</span>
                                     <br/>
                                    </>
                                            )
                                        })
                                    }
                                    </div>
                                    <form className="AddComment" onSubmit={(e) => {
                                        e.preventDefault();
                                           makeComment(e.target[0].value, item._id);
                                    }}>
                                        <input type="text" placeholder="add a comment" />
                                        <button >Post</button>
                                    </form>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Home;
