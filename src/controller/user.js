const User = require('../model/user');
const bcryptjs = require('bcryptjs');
const MySQL = require('../database/mysql');

class Users {

    constructor(app) {
        this._app = app;
    }

    static async Register(req, res) {
        const { email, password, name } = req.body;

        if (!(email && password && name)) {
            return res.status(400).send("All input is required");
        }

        await User.findOne({ email }, (err, user) => {
            if (user) return res.status(409).send("User Already Exist.");
        });

        const encryptedPassword = await bcryptjs.hash(password, 10);

        await User.create({
            name,
            email,
            password: encryptedPassword,
        });

        res.status(201).json('user created');
    }

    static async List(req, res) {
        User.find({}, (err, users) => {
            if (err) throw err;
            if (users.length == 0) return res.status(404).send({ error: { description: 'User Not Found' } });
            return res.status(200).json(users);
        });
    }

    static async ListUser(req, res) {
        User.findById(req.params.id, (err, user) => {
            if (err || !user) return res.status(404).send({ error: { description: 'User Not Found' } });
            return res.status(200).json(user);
        });
    }

    static DeleteUser(req, res) {
        try {
            User.deleteOne({ _id: req.params.id })
                .then(resp => { if (resp.ok) return res.status(200).send('User deleted successfully') })
                .catch(err => { return res.send(err) })
        }
        catch (err) {
            return res.status(404).send({ error: { description: 'User Not Found' } });
        }
    }

    static UpdateUser(req, res) {
        if (!req.body.name || !req.body.email || !req.body.password)
            res.status(400).send({ error: { status: 'Param invalid' } });
        else {
            User.findOneAndUpdate({ _id: req.params.id }, req.body, (err, data) => {
                if (err) res.send(err);
                data.modifyAt = new Date();
                return res.status(200).send('User updated successfully');
            });
        }
    }

    static UpdatePassword(req, res) {
        if (!req.body.password)
            res.status(400).send({ error: { status: 'Param invalid' } });
        else {
            User.findOneAndUpdate({ _id: req.params.id }, req.body.password, (err, data) => {
                if (err) res.send(err);
                res.send(data);
            });
        }
    }
}

module.exports = Users;