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

router.post('/update/:id', async (req, res) => {
    try {
        User.findOneAndUpdate({_id: req.params.id},
            {
                $set : req.body
                // $set : {
                //     name: req.body.name,
                //     email: req.body.email,
                //     role: req.body.role,
                //     phone:req.body.phone,
                //     address:req.body.address,
                //     location:req.body.location
                // }
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
router.patch('/update/:id', async (req, res) => {
    try {
        User.findOneAndUpdate({_id: req.params.id},
            {
                $set : req.body
                // $set : {
                //     name: req.body.name,
                //     email: req.body.email,
                //     role: req.body.role,
                //     phone:req.body.phone,
                //     address:req.body.address,
                //     location:req.body.location
                // }
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

router.get('/count', async (req, res) => {
    const FIRST_MONTH = 1
    const LAST_MONTH = 12
    let monthsArray = ['January','February','March','April','May','June','July','August','September','October', 'November','December'];
    const MONTHS_ARRAY = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
    let end = new Date();
    let start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());
    try {
        User.aggregate([
            {
                $match: {
                  role: 'customer',
                  createdDate: {
                    $gte: start,
                    $lt: end
                  }
                }
              },
              {
                $group: {
                  _id: { $month: "$createdDate" },
                  count: { $sum: 1 }
                }
              },
              {
                $group: {
                  _id: null,
                  data: { $push: { month: "$_id", count: "$count" } }
                }
              },
              {
                $project: {
                  _id: 0,
                  data: {
                    $map: {
                      input: Array.from({ length: 12 }, (_, i) => i + 1),
                      as: "month",
                      in: {
                        $let: {
                          vars: { count: { $ifNull: [ { $arrayElemAt: [ "$data.count", { $subtract: [ "$$month", 1 ] } ] }, 0 ] } },
                          in: { month: "$$month", count: "$$count" }
                        }
                      }
                    }
                  }
                }
              }
          ], function(err, result) {
            res.status(200).json({ result: result[0].data });

          });       
    
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;
