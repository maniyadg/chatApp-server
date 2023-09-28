const User = require("../models/users.models");
const bcrypt = require("bcrypt");
const localStorage = require('localStorage')
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET_KEY;
const { isAuth } = require("../utils/authenication");


module.exports.login = async (req, res, next) => {
  try{
    const {username, password} = req.body;
    const existingUser = await User.findOne({username});
    
    if(existingUser){
        const isValidUser = await bcrypt.compare(req.body.password, existingUser.password);

        if(isValidUser){
            const token =  jwt.sign({_id: existingUser._id}, JWT_SECRET); //Encrytion
            res.cookie('accessToken', token, {expire: new Date() + 86400000})
            localStorage.setItem('accessToken', token);

            return res.status(201).send({message: 'User signed-in successfully.' , status:'true' , token})
        }

        return res.status(401).send({message: 'Invalid credentials'})
    }

    res.status(400).send({message: 'User doesnot exist.'})

}catch(error){
    console.log('Error: ', error)
    res.status(500).send({message: 'Internal Server Error', error: error});
    
}
}

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong", status: false  });
  }
};

module.exports.getuser = async (req, res, next) => {
  try{
    const id = req.id;
    let user = await User.findById(id);

    if(user){;
        user = user.toObject();
        delete user["hashedPassword"];

        return res.status(200).send({success: true, user: user});
    }
    return res.status(400).send({success: false, message: 'User doesnt exist.'})
}catch(error){
    console.log('Error', error);
    res.status(500).send({message: 'Internal Server Error'});
}
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = async(req, res, next) => {
  try{
    await res.clearCookie('accessToken');
    res.status(200).send({message: 'User signed out successfully.'})
}catch(error){
    res.status(500).send({message: 'Internal Server Error'});
}
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
