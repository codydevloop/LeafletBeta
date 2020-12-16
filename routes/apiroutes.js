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
        notes: req.body.notes,
        lat: req.body.lat,
        long: req.body.long,
        completed: req.body.completed
    });

    res.send(data)
});


router.put('/completed/:id', async (req, res) => {

    const data = await db.Customer.update(
        {completed: req.body.completed},
        {where:
            {id: req.params.id}
        }
    )   
    
    res.send(data);
});


// router.post('/new', async (req, res) => {
//     const data = await db.Customer.create({
//         lastname: req.body.lastname
//     });

//     res.send(data);
// })

module.exports = router;