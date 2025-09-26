const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Register User
exports.register = async (req,res) => {
    try {
        
        const { username, email, password, avatar } = req.body;

        if(!username || !email || !password){
            return res.status(400).json({
                message: "All fields are required execpt avatar(not compulsory)"
            });
        }

        let user = await User.findOne({email});
        if(user)
        {
            return res.status(400).json({message: "User already exists"});
        }

        const hash = await bcrypt.hash(password, 15);
        
        user = new User({ username, email, password: hash, avatar });
        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, username, email, avatar } });

    } catch (error) {
        res.status(500).json({msg: error.message});
    }
};


// Login user
exports.login = async (req,res) => {
    try {
        
        const { email, password } = req.body;

        if(!email || !password)
        {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const user = await User.findOne({ email });
        
        if(!user)
        return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch)
            return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, username: user.username, email, avatar: user.avatar } });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};