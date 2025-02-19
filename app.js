const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localStratgy=require("passport-local");


const User=require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js")

const dbUrl=process.env.ATLASDB_URL;

main()
  .then((res) => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600 ,// time period in seconds
});

store.on("error",()=>{
  console.log("ERROR IN SESSION-STORE",err);
});

const sessionOPtion = {
  store,
  secret: process.env.SECRET, // Used to sign the session ID cookie
  resave: false, // Don't save the session if it hasn't been modified
  saveUninitialized: true, // Save a new session even if it hasn't been modified
  cookie: { 
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
   }, // For development, set secure to false; for production, use HTTPS and set secure: true
};

app.listen(8080, () => {
  console.log("app is listining");
});

   

app.use(session(sessionOPtion));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratgy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success").join(" "); // Join ensures it's a string
  res.locals.error = req.flash("error").join(" ");
  res.locals.currUser=req.user;
  next();
});

// app.get("/demo",async(req,res)=>{
//     const fakeUser=new User({
//       email:"ankitkabra2000@gmail.com",
//       username:"ankit",
//     });
//     let registerUser=await User.register(fakeUser,"alalal");
//     res.send(registerUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);
// page not found error

app.use("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

// error handling middle ware function

app.use((err, req, res, next) => {
  // Include status code in the response body (optional)
  let { statusCode = 500, message } = err;
  res.status(statusCode).render("error.ejs", { statusCode, message });
});
