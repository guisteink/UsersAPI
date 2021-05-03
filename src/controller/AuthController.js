const express = require('express')
const UserSchema = require('../model/UserSchema')
const _ = require('lodash');
const httpStatus = require('../helpers/http-status')
const router = express.Router()
const bcrypt = require("bcryptjs")
const authConfig = require("../config/auth.json");
const jwt = require("jsonwebtoken");

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

async function userExists(req) {
    const data = req.body;
    const findUser = await UserSchema.findOne({
        'login.username': {
            $eq: _.get(data, 'login.username')
        }
    })
    return findUser ? 1 : 0
}

router.post("/register", async (req, res) => {
    if (await userExists(req)) {
        return res.status(httpStatus.bad_request).json({ error: "User already exists" })
    }
    const data = req.body
    const user = new UserSchema({
        gender: _.get(data, 'gender'),
        name: {
            first: _.get(data, 'name.first'),
            last: _.get(data, 'name.last')
        },
        location: {
            street: _.get(data, 'location.street'),
            city: _.get(data, 'location.city'),
            state: _.get(data, 'location.state'),
            postcode: _.get(data, 'location.postcode'),
            coordinates: {
                latitude: _.get(data, 'location.coordinates.latitude'),
                longitude: _.get(data, 'location.coordinates.longitude')
            },
            timezone: {
                offset: _.get(data, 'location.timezone.offset'),
                description: _.get(data, 'location.timezone.description')
            }
        },
        email: _.get(data, 'email'),
        login: {
            username: _.get(data, 'login.username'),
            password: _.get(data, 'login.password')
        },
        dob: {
            date: _.get(data, 'dob.date'),
            age: _.get(data, 'dob.age')
        },
        registered: {
            date: _.get(data, 'registered.date'),
            age: _.get(data, 'registered.age')
        },
        phone: _.get(data, 'phone'),
        cell: _.get(data, 'cell'),
        picture: {
            large: _.get(data, 'picture.large'),
            medium: _.get(data, 'picture.medium'),
            large: _.get(data, 'picture.large')
        },
        nat: _.get(data, 'nat')
    })

    const findUser = await user.save()
    if (findUser) {
        return res.status(httpStatus.success).json({
            findUser,
            token: generateToken({ id: findUser.id })
        })
    } else {
        return res.status(httpStatus.bad_request).json({ error: "Registration failed" })
    }
})

router.post("/login", async (req, res) => {
    const data = req.body;
    const findUser = await UserSchema.findOne({
        'login.username': {
            $eq: _.get(data, 'username')
        }
    })
    if (!_.isEmpty(findUser)) {
        if (!await bcrypt.compare(_.get(data, 'password'), findUser.login.password)) {
            return res.status(httpStatus.bad_request).json({ error: "Invalid password" })
        }
        findUser.login.password = undefined;
        return res.status(httpStatus.success).json({
            findUser,
            token: generateToken({ id: findUser.id }),
        })
    }
    else {
        return res.status(httpStatus.not_found).json({
            error: "User not found"
        })
    }

})

module.exports = (server) => server.use("/auth", router);