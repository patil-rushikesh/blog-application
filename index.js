const express = require('express');
const path = require('path');
const ejs = require('ejs');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const cookieParser = require('cookie-parser');
const { connectMongoDB } = require('./connect');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const Blod = require(`./models/blog`);
const Blog = require('./models/blog');

// Creating instance
const app = express();
const PORT = 3000;


// Passing URL of Database
connectMongoDB("mongodb://127.0.0.1:27017/rushikeshblogs")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));



// Setting up the frontend
app.set("view engine", "ejs");
app.set("views", path.resolve('./views'));



app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))
// Routes
app.get('/',async (req, res) => { 
    const allBlogs = await Blog.find({}).sort("createdAt");
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});



// Middleware
app.use('/user', userRoute);
app.use('/blog', blogRoute);



// Listening on the port and checking the connection
app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
});
