// if(process.env.NODE_ENV != "production"){
//     require('dotenv').config()

// }


// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const session = require("express-session");
// const MongoStore=require('connect-mongo');
// const flash = require("connect-flash");

// const ejsMate = require("ejs-mate");

// const Listing = require("./models/listing");
// const Review = require("./models/review");

// const listingRoutes = require("./routes/listing");
// const reviewRoutes = require("./routes/review");

// const ExpressError = require("./utils/ExpressError");
// const wrapAsync = require("./utils/wrapAsync");

// const passport =require("passport");
// const LocalStrategy=require("passport-local");
// const User=require("./models/user.js")

// const listingRouter=require("./routes/listing.js");
// const reviewRouter=require("./routes/review.js");
// const userRouter=require("./routes/user.js");

// // const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl=process.env.ATLASDB_URL;

// // mongoose.connect(MONGO_URL)
// //     .then(() => console.log("Connected to DB"))
// //     .catch(err => console.log(err));

// mongoose.connect(dbUrl)
//     .then(() => console.log("Connected to DB"))
//     .catch(err => console.log(err));

// app.engine("ejs", ejsMate);
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.use(express.static(path.join(__dirname, "public")));

// // Session & flash
// const sessionOptions={
//     store,
//     secret: "mysupersecretcode",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires:Date.now()+7*24*6*60*1000,
//         httpOnly: true,
//         maxAge: 7*24*60*60*1000
//     },
// };

// const store = MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:"mysupersecretcode",

//     },
//     touchAfter:24*3600,
// });
// store.on("error",()=>{
//     console.log("Error In MONGO SESSION STORE",err);
// })

// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


// // Flash middleware
// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
   
//     res.locals.error = req.flash("error");
//     res.locals.currUser=req.user;
//     next();
// });


// //Demo User
// // app.get("/demouser",async(req,res)=>{
// //     let fakeUser=new User({
// //         email:"student@gmail.com",
// //         username:"Shubham"
// //     });
// //  let registeredUser=await User.register(fakeUser,"helloworld");
// //  res.send(registeredUser);
// // })

// // Routes
// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/",userRouter)

// // Root
// // app.get('/', (req, res) => {
// //     res.render('home', { currUser: req.user || null });
// // });

// // Error handler
// app.use((err, req, res, next) => {
//     const { statusCode = 500, message = "Something went wrong" } = err;
//     res.status(statusCode).render("error", { err, message });
// });

// app.listen(8080, () => {
//     console.log("Server running on port 8080");
// });


if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");

const Listing = require("./models/listing");
const Review = require("./models/review");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

const ExpressError = require("./utils/ExpressError");
const wrapAsync = require("./utils/wrapAsync");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Database URL
const dbUrl = process.env.ATLASDB_URL;

// Connect to MongoDB Atlas
mongoose.connect(dbUrl)
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.log("❌ MongoDB Connection Error:", err));

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ✅ Create Mongo Session Store FIRST
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // time in seconds
});

store.on("error", (err) => {
    console.log("❌ Error in Mongo Session Store:", err);
});

// ✅ Then define session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

// Session & Flash middleware
app.use(session(sessionOptions));
app.use(flash());

// Passport authentication setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & current user middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ✅ Root Route
app.get("/", (req, res) => {
    res.redirect("/listings"); // Redirect to main listings page
});


// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { err, message });
});

// Start server
app.listen(8080, () => {
    console.log("🚀 Server running on port 8080");
});
