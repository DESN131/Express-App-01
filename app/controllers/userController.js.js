const bcrypt = require('bcrypt');
const User = require('../models/user');

const showpage = (req, res) => {
    // console.log('Play Video.');
    // res.render('index.ejs');
    res.redirect('/login');
};

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        const result = users.map(user => ({
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
            password: user.password,
            hashedPassword: user.hashedPassword,
        }));
        // res.json(users);
        // res.send(result);
        res.render('users', { users: result });
    } catch (err) {
        next(err);
    }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body);
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({ name, email, password, hashedPassword });
    res.status(201).json({message: 'Register success',success: true, name: name, email: email});
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ name }, { email: name }]
          });
        
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        console.log('User login.');
        
        res.status(200).json({message: 'Login successful', name: name});
    } catch (err) {
        next(err);
    }
};

const resetpassword = async (req, res, next) => {
    const { name, email, newpassword } = req.body;
    try {
        const user = await User.findOne({ name });
        if (user.email == email) {
            console.log(`User ${user.name} is setting new password`);
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
            user.password = newpassword;
            user.hashedPassword = hashedPassword;
            await user.save();
            console.log(`User ${user.name} set new password`);
            res.status(200).json({message: 'Reset successful', name: name});
        }
    } catch (error) {
        next(error);
    }
};

const download = (req, res) => {
    console.log('Start Download.');
    res.sendFile('');
};

const video = (req, res) => {
    res.sendFile('');
};

const showloginpage = (req, res) => {
    res.render('login');
}

const showregisterpage = (req, res) => {
    res.render('register');
}

const showresetpage = (req, res) => {
    res.render('reset');
}

module.exports = {
    getUsers,
    createUser,
    showpage,
    login,
    download,
    video,
    showloginpage,
    showregisterpage,
    resetpassword,
    showresetpage,
};
