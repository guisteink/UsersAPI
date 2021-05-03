const UserSchema = require("../model/UserSchema");
const _ = require('lodash');
const httpStatus = require('../helpers/http-status')
const pagInfo = require('paginate-info')

class UserController {
    async create(req, res) {
        const data = req.body
        const user = new UserSchema({
            gender: _.get(data, 'gender')? _.get(data, 'gender'): 'N/A',
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

        await user
            .save()
            .then((response) => {
                if (response) return res.status(httpStatus.success).json(response)
                else return res.status(httpStatus.bad_request)
            })
            .catch((error) => {
                return res.status(httpStatus.server_error).json(error)
            })
    }

    async update(req, res) {
        const data = req.body;

        await UserSchema
            .findByIdAndUpdate(
                { _id: req.params.id },
                {
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
                },
                { new: true }
            )
            .then((response) => {
                if (response) return res.status(httpStatus.success).json(response)
            })
            .catch((error) => {
                return res.status(httpStatus.not_found).json(error)
            })

    }

    async delete(req, res) {
        await UserSchema
            .findOneAndDelete({
                _id: req.params.id
            })
            .then((response) => {
                if (response) return res.status(httpStatus.success).json(response)
            })
            .catch((error) => {
                return res.status(httpStatus.not_found).json(error)
            })
    }

    async show(req, res) {
        await UserSchema
            .findById(req.params.id)
            .then((response) => {
                if (response) return res.status(httpStatus.success).json(response)
            })
            .catch((error) => {
                return res.status(httpStatus.not_found).json(error)
            })
    }

    async getAll(req, res) {
        const { headers: { pagesize } } = req;
        const { limit, offset } = pagInfo.calculateLimitAndOffset(1, pagesize)

        try {
            const response = await UserSchema
                .find({})
                .limit(limit)
                .skip(offset)

            if (response) return res.status(httpStatus.success).json(response)
        }
        catch (err) {
            return res.status(httpStatus.server_error).json(error)
        }
    }


}
module.exports = new UserController()