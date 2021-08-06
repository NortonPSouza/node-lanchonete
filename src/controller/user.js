const express = require('express');
const User = require('../model/user');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const Authorization = require('../services/verifyToken');

router.post('/user/register', Authorization, async (req, res) => {
    const { email, password, name } = req.body;

    if (!(email && password && name)) {
        return res.status(400).send("All input is required");
    }

    await User.findOne({ email }, (err, user) => {
        if (user) return res.status(409).send("User Already Exist.");
    });

    const encryptedPassword = await bcryptjs.hash(password, 10);

     
});

router.get('/user/list', Authorization, (req, res) => {
    User.find({}, (err, users) => {
        if (err) throw err;
        if (users.length == 0) return res.status(404).send('Not Found');
        return res.status(200).json(users);
    });
});

router.get('/user/:id', Authorization, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err || !user) return res.status(404).send('Not Found');
        return res.status(200).json(user);
    })
});

router.delete('/user/:id', Authorization, (req, res) => {
    try {
        User.deleteOne({ _id: req.params.id })
            .then(resp => { if (resp.ok) return res.status(200).send('User deleted successfully') })
            .catch(err => { return res.send(err) })
    }
    catch (err) {
        return res.status(500).send({ error: { status: 500, description: 'Operation error' } });
    }
});

router.put('/user/update/:id', Authorization, (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password)
        res.status(400).send({ error: { status: 'Param invalid' } });
    else {
        User.findOneAndUpdate({ _id: req.params.id }, req.body, (err, data) => {
            if (err) res.send(err);
            data.modifyAt = new Date();
            res.send(data);
        });
    }
});

router.patch('/user/update/password/:id', Authorization, (req, res) => {
    if (!req.body.password)
        res.status(400).send({ error: { status: 'Param invalid' } });
    else {
        User.findOneAndUpdate({ _id: req.params.id }, req.body.password, (err, data) => {
            if (err) res.send(err);
            res.send(data);
        });
    }
})

module.exports = app => app.use('/api/v1', router);