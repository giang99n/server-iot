const express = require('express');
const router = express.Router();
const Sensor = require('../models/Sensor');
const moment = require('moment');
const auth = require('../middlewares/auth');

// router.get('/', auth(['customer', 'admin']), async (req, res) => {
router.get('/', async (req, res) => {
    try {
        //ngày bắt đầu
        let datebegin = moment(Number.parseInt(req.query.begin)/1000);
        //ngày kết thúc
        let dateend = moment(Number.parseInt(req.query.end)/1000);
        //tính khoảng cách hai mốc thời gian
  
        let start = datebegin.valueOf();
        let end = dateend.valueOf();
    
        let range = end - start;
        let miniRange = range / 20; //20 khoảng thời gian
        const rs2 = await Sensor.findOne({
            createdDate: {
                $gte: datebegin.get('time'),
              
            },
        });
        console.log(rs2)

        //lấy thông tin theo các mốc thời gian
        const rs = await Sensor.find({
            createdDate: {
                $gte: datebegin.get('time'),
                $lte: dateend.get('time'),
            },
        }).sort({ field: 'asc', _id: -1 });

        //Biến lưu danh sách kết quả trung bình, kết quả trung bình chia làm 20 khoảng
        var result = [];
        for (let i = start; i < end; i += miniRange) {
            let value = {
                humidityAir: 0,
                temperature: 0,
                time: i,
            };

            //biến lưu số bản ghi trong một khoảng thời gian
            let count = 0;
            let arr = rs.filter((obj) => {
                return (
                    moment(obj.createdDate).valueOf() > i &&
                    moment(obj.createdDate).valueOf() < i + miniRange
                );
            });
            if (Array.isArray(arr) && arr.length) {
                arr.forEach((item, index) => {
                    if (item && item !== 'null' && item !== 'undefined') {
                        value.humidityAir += item.humidityAir;
                        value.temperature += item.temperature;
                        count++;
                    }
                });
            }
            //nếu trong khoảnh thời gian không có bản ghi nào thì count = 0 => 0/0 = null;
            if (count != 0) {
                value.humidityAir = value.humidityAir / count;
                value.temperature = value.temperature / count;
            }
            result.push(value);
        }
        return res.status(200).json({
                code:200,
                result,
        });
    } catch (error) {
        res.status(400).json({ message: err.message });
    }
});

// router.post('/create', async (req, res) => {
//     const dateString = '2023-03-05';
//     const date = new Date(dateString);
//     const timeStart  = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()-req.body.time);
//     const timeEnd = new Date(timeStart.getTime()+ (3600000));

//     console.log(timeStart);
//     console.log(timeEnd);
//     let currentTime = new Date(timeStart);
//     while (currentTime < timeEnd) {
//         const device = new Sensor({
//             humidityAir: req.body.humidityAir,
//             temperature: req.body.temperature,
//             gasVal: req.body.gasVal,
//             ppmVal: req.body.ppmVal,
//             createdDate: currentTime
//         });
//           try {
//             const savedDevice = await device.save();
//             //res.status(200).json(savedDevice);
//         } catch (err) {
//             res.status(400).json({ message: err.message });
//         }
//         currentTime.setMinutes(currentTime.getMinutes() + 10);
//     }
//     console.log('111');

    
  
// });

// router.post('/createdata', async (req, res) => {
//     const dateString = '2023-03-14';
//     const date = new Date(dateString);
//     const timeStart  = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()-req.body.time);
//     const timeEnd = new Date(timeStart.getTime()+ (3600000));

//     console.log(timeStart);
//     console.log(timeEnd);
//     let currentTime = new Date(timeStart);
//     while (currentTime < timeEnd) {
//         const device = new Sensor({
//             humidityAir: req.body.humidityAir,
//             temperature: req.body.temperature,
//             gasVal: req.body.gasVal,
//             ppmVal: req.body.ppmVal,
//             createdDate: currentTime
//         });
//           try {
//             const savedDevice = await device.save();
//             //res.status(200).json(savedDevice);
//         } catch (err) {
//             res.status(400).json({ message: err.message });
//         }
//         currentTime.setMinutes(currentTime.getMinutes() + 10);
//     }
//     console.log('111');

    
  
// });

module.exports = router;
