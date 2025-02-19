const User = require("../models/user.js");
module.exports.renderSignupForm=(req, res) => {
    res.render("./users/signup.ejs");
  }

module.exports.signup=async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({
        username,
        email,
      });
      const newRigisterd = await User.register(newUser, password);
      req.login(newRigisterd,(err,next)=>{
          if(err){
           return next(err);
          }
          req.flash("success", "user registered successfully");
          res.redirect("/listings");
      });
     
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }  

module.exports.renderLoginForm=(req, res) => {
    res.render("./users/login.ejs");
  }  

module.exports.login= async(req, res)=> {
    req.flash("success","welcome back to wonderlust");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    return res.redirect(redirectUrl);
  }  

module.exports.logout=async(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        next(err);
      }else{
        req.flash("success","You are logged out success!");
        res.redirect("/listings");
}})
}  