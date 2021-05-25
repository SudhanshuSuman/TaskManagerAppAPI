const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid Email!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Invalid password: Should not contain "password"!')
            }
        },
        minLength: 7
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error('Invalid Age: Must be a positive integer!')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.virtual('userTasks', {
    ref: 'tasks',
    localField: '_id',
    foreignField: 'belongsTo'
})

userSchema.statics.findByEmailPass = async (email, password) => {
    const user = await users.findOne({ email })
    if(!user) {
        throw new Error('No user with the email and password found!')
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if(!passwordMatch) {
        throw new Error('No user with the email and password found!')
    }
    return user
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior
userSchema.methods.toJSON = function() {
    const user = this
    const obj = user.toObject()
    delete obj.password
    delete obj.tokens
    delete obj.avatar
    return obj
}

userSchema.methods.getToken = function() {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
    return token
}

userSchema.pre('save', async function(next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

userSchema.pre('remove', async function(next) {
    await Task.deleteMany({ belongsTo: this._id })
    next()
})

const users = mongoose.model('users', userSchema)

module.exports = users