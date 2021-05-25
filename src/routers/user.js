const express = require('express')
const auth = require('../middleware/auth')
const tasks = require('../models/tasks')
const User = require('../models/users')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, accountDeleteEmail } = require('../emails/mail')

// const { route } = require('./task')
const router = express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    const token = user.getToken()
    user.tokens.push({ token })
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }

    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByEmailPass(req.body.email, req.body.password)
        const token = user.getToken()
        user.tokens.push({ token })
        await user.save()
        res.send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        console.log("yaha aa raha");
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    } 

    // User.find({}).then((users) => {
    //     res.send(users)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

// router.get('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)
//         if(!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch(e) {
//         res.status(500).send(e)
//     }

//     // User.findById(req.params.id).then((user) => {
//     //     if(!user) {
//     //         return res.status(404).send()
//     //     }
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send(e)
//     // })
// })

router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const updates = Object.keys(req.body)
    const validRequest = updates.every((update) => allowedUpdates.includes(update))
    if(!validRequest) {
        return res.status(400).send({ error: 'Cannot update one or more specified fields!' })
    }

    try {
        // const user = await User.findById(req.params.id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // if(!user) {
        //     res.status(404).send()
        // }
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        // await tasks.deleteMany({ belongsTo: req.user._id })         // OR a pre method can be written which will run before remove() executes
        accountDeleteEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})

const upload = multer({
    limits: {
        fileSize: 3*1024*1024
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Allowed file extensions: *.jpg/*.jpeg/*.png'))
        }
        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('imagefilename'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 300, height: 300 }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('okie')
},(error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(404).send(e)
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error('No avatar found!')
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send(e)
    }
})

module.exports = router