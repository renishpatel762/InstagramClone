const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require('./config/keys');
const cors = require('cors');

mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log("connected to mongo!");
});
mongoose.connection.on('error', (err) => {
    console.log("error connecting!" + err);
});

// const customMiddleware =(req,res,next)=>{
//     console.log("Middleware executed!");
//     next(); 
// }
app.use(cors())
app.use(express.json());//use this before router

// mongoose.model
require('./model/user');
require('./model/post');


app.use(require('./routers/auth'));
app.use(require('./routers/user'));
// app.use(require('./routers/post'));

// require('./routers')(app);

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
        //if client will send req to any folder then we send index.html

    })
}

app.listen(PORT, () => {
    console.log("Server is running on PORT 5000");
});

// app.use(customMiddleware);

// app.get('/',(req,res)=>{
//     console.log("home");
//     res.send("Hello world");
// });

// app.get('/about',customMiddleware, (req,res)=>{
//     console.log("about");
//     res.send("About page");
// });