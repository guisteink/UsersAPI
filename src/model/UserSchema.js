const mongoose = require("../config/database.js");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = new Schema({
    gender: {
        type: String,
        default: "N/A",
        enum: ['Male', 'Female', 'N/A'],
    },
    name: {
        type: Object,
        title: { type: String },
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
        }
    },
    location: {
        type: Object,
        street: { type: String },
        city: { type: String },
        state: { type: String },
        postcode: { type: Number },
        coordinates: {
            type: Object,
            latitude: { type: Number },
            longitude: { type: Number }
        },
        timezone: {
            type: Object,
            offset: { type: Number },
            description: { type: String }
        }
    },
    email: { type: String },
    login: {
        type: Object,
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true,
            selected: false
        },
        // uuid: { type: String },
        salt: { type: String },
        md5: { type: String },
        sha1: { type: String },
        sha256: { type: String }
    },
    dob: {
        type: Object,
        date: { type: Date },
        age: { type: Number }
    },
    registered: {
        type: Object,
        date: { type: Date },
        age: { type: Number }
    },
    phone: {
        type: Number,
        required: true
    },
    cell: { type: Number },
    picture: {
        type: Object,
        large: { type: String },
        medium: { type: String },
        thumbnail: { type: String }
    },
    nat: { type: String }
}, { collection: 'users' });

UserSchema.pre("save", async function () {
    const birth = Math.round((new Date().getTime() - new Date(this.dob.date).getTime()) / (31536000000))
    this.dob.age = birth;
    const now = new Date(Date.now())
    this.registered.data = now;
    const hash = await bcrypt.hash(this.login.password, 10)
    this.login.password = hash
})
module.exports = mongoose.model("User", UserSchema)