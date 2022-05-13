const Router = require ("express");
const User = require ("../models/User");
const bcrypt = require ("bcryptjs");
const config = require ("config");
const jwt = require ("jsonwebtoken");
const {check, validationResult} = require("express-validator");
const router = new Router();

router.post('/registration',
    [
        check('email', "Incorrect email").isEmail(),
        check('password',"Password must be longer than 3 and shorter 12").isLength({min:3, max:12})
    ],
    async(req, res) => {
    try{
        console.log(req.body)
        const errors = validationResult(req)
            if (!errors.isEmpty()){
                return res.status(400).json({message:`User with email ${email} already exists`})
            }
        const {email, password} = req.body

        const candidate = await User.findOne({email})// to verify if a user with this email already exists in DB

        if(candidate) {  // if user is not empty, then return status code 400
            return res.status(400).json({message: `User with email ${email} already exists`})
        }

        const hashPassword = await bcrypt.hash(password, 8)
        const user = new User({email: email, password: hashPassword});
        await user.save()
        return res.json({message: "User was created"});

    }catch (e) {
        console.log(e);
        res.send({message: "Server error"})
    }
})


router.post('/login',

    async(req, res) => {
        try{

            const {email, password} = req.body
            const user = await User.findOne({email})
                 if(!User){
                    return res.status(404).json({message: "User not found"})
                }
            const isPassValid = bcrypt.compare(password, user.password)
            if(!isPassValid){
                return res.status(400).json({message: "Invalid password"})
            }

            const token = jwt.sign({id: user.id}, config.get("secretKey"), {expiresIn: "1h"})
            return res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    diskSpace: user.diskSpace,
                    usedSpace: user.usedSpace,
                    avatar: user.avatar
                }
            })
        }catch (e) {
            console.log(e);
            res.send({message: "Server error"})
        }
    })



module.exports = router