const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/all', async (req, res) => {
    const data = await db.Customer.findAll();

    res.send(data);
});


router.post('/new', async (req, res) => {

    // console.log(req.body);
    // res.end();
     const data = await db.Customer.create({
        lastname: req.body.lastname,
        address: req.body.address,
        garage: req.body.garage,
        notes: req.body.notes
    });

    res.send(data)


});


// router.post('/new', async (req, res) => {
//     const data = await db.Customer.create({
//         lastname: req.body.lastname
//     });

//     res.send(data);
// })

module.exports = router;