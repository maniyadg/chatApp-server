const { addMessage, getMessages } = require("../controllers/message.controller");
const { isAuth } = require("../utils/authenication");
const router = require("express").Router();

router.post("/addmsg/" , addMessage);
router.post("/getmsg/" , getMessages);

module.exports = router;