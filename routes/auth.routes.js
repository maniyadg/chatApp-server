const {
    login,
    register,
    getAllUsers,
    setAvatar,
    logOut,
    getuser,
  } = require("../controllers/auth.controller");
const { isAuth } = require("../utils/authenication");

  
  const router = require("express").Router();
  
  router.post("/login", login);
  router.post("/register", register);
  router.get("/allusers", isAuth , getuser);
  router.get("/allusers/:id" , getAllUsers);
  router.post("/setavatar/:id" , setAvatar);
  router.get("/logout",logOut);
  
  module.exports = router;