const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.createUser = (req, res, next) => {

    bcrypt.hash(req.body.password, 10).then(hash => {    
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(result => {
            res.status(201).json({
                message:"Sign Up Successful And User Created",
                result: result
            })
        }).catch(err => {
            res.status(500).json({
                message:'Invalid Authentication Credentials !'
            })
        });
    })   
}

exports.userLogin = (req, res, next) => {
    
    let fetchedUser;
    //STEP 1:
    User.findOne({ email: req.body.email }).then(user => {
            if(!user){
                return res.status(401).json({
                    message: "Authentication Failed !"
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        }).then(result => {
            if(!result){
                return res.status(401).json({
                    message: "Authentication Failed !"
                });     
            }

            // Step 2:
            const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, process.env.JWT_KEY, 
            {expiresIn: '1h' });
            //Step 3:
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            })
    
        }).catch(err => {
            return res.status(401).json({
                message: "Invalid Authentication Credentials !"
            })
        })  
    }