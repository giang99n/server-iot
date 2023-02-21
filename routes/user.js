const express = require('express');
const router = express.Router();
const User = require('../models/User');
const moment = require('moment');

// router.get('/', auth(['customer', 'admin']), async (req, res) => {
router.get('/userList', async (req, res) => {
    try {
        User.find({}, function(err, users) {
            return res.status(200).json({
                code:200,
                users,
            });
     
          });
    
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.query.id });
            return res.status(200).json({
                code:200,
                user,
            });
    
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.patch('/update/:id', async (req, res) => {
    try {
        User.findOneAndUpdate({_id: req.params.id},
            {
                $set : {
                    name: req.body.name,
                    email: req.body.email,
                    role: req.body.role,
                }
            },
            { new: true },
            (err, user) =>{
                if (err) {
                    res.status(400).json({ message: err });
                  } else  res.status(200).json({
                    user
                });
            }  
           
        );
        
    
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



module.exports = router;
