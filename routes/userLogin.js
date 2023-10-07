const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
//  Middle ware Functions
const  fetchuser = require('../middlewares/fetchuser');

// User Schema Module imported here
const createUser = require("../models/User");

// MY EXPRESS VALIDATOR IMPORT
const { body } = require("express-validator");
const { query, validationResult } = require("express-validator");
const { json } = require("stream/consumers");

// Route-1= To create user or To Signup
router.post("/createuser", [
    // Here Authenticate the Information using the npm package express validator
    body("email", "Please enter a valid Email").isEmail().trim(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    try {
      // Make sure if there is error then show error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }

      // CHECK WHEATER THE USER EXIST ALREADY OR NOT
      let user = await createUser.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(401)
          .send({ success, error: "You already created account with this email" });
      }
      // To hash a password:
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      // Hash Generated End ===> Store hash in your password DB. <=====

      // If a New User Then ==>  User Creating Here.
      user = new createUser({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      await user.save();

      // =========> JSON WEB TOKEN ===> Generate Token here.
    //   const JWT_SECRET = "34502ABCabc";
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
      //   End of Json webtoken Creation
      success = true;
      //   res.send({ user });  //Sending Authentication Token
      res.send({ success, authtoken });
    } catch (error) {
      res.status(500).send({ error: "Internal Server error" });
    }
  }
);
// ==========> End of Route-1 <=========

// Route-2: If User exist then login ==> Route-2= login user
router.post("/loginuser", [ 
    body("email", "Please enter a valid Email").isEmail().trim(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    try {
      // Make sure if there is error then show error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const user = await createUser.findOne({ email });
      if (!user) {
        success = false;
          return res.status(401).send({ error: "Please try to login with correct credentials" });
        }
        
        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
          success = false;
            return res.status(401).send({ success, error: "Please try to login with correct credentials" });
        }

      // =========> JSON WEB TOKEN ===> Generate Token here.
    //   const JWT_SECRET = "34502ABCabc";
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
      //   End of Json webtoken Creation
      success = true;

      //   res.send({ user });  //Sending Authentication Token
      res.send({ success, authtoken });


      // LOGIN SUCCESSFULLY
    //   res.send({ user });
    } catch (error) {
      res.status(500).send({ error: "Internal server error" });
    }
  }
);
// Route 2 End

// Route-3: Get the user ==> Route-2= login user
router.post("/getuser", fetchuser, async(req, res)=> {
    try {
        userId = req.user.id;
        const user = await createUser.findById(userId).select('-password');
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({error: "Internal Server error"})
    }
});

module.exports = router;