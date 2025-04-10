const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController.js');

router.get('/', controller.showpage);

router.get('/user', controller.getUsers);

router.post('/register', controller.createUser);
router.get('/register', controller.showregisterpage);

router.get('/login', controller.showloginpage);
router.post('/login', controller.login);

router.get('/download', controller.download);
router.get('/video', controller.video);


module.exports = router;
