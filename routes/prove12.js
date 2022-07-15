const express = require('express')
const router = express.Router()
const users = ['admin'] 
router.get('/', (req, res, next) => {
    res.render('pages/login', {
        title: 'Virtual Tallow Chat',
        path: '/proveActivities/12'
    })
})

router.post('/login', (req, res, next) => {
    console.log(req.body.userName);
    var userName = req.body.userName.trim();
    console.log("Login " + userName);
    console.log(users);
    if(users.includes(userName)){
        return res.status(400).send({error: "The Nickname is already in use, please choose another one."});
    }    

    users.push(userName);
    req.session.user = userName;
       
    return res.status(200).send({userName:userName});    
})

// Render chat screen.
router.get('/chat', (req, res, next) => {
    res.render('pages/chat', {
        title: 'Prove Activity 12',
        path: '/proveActivities/12',
        user: req.session.user 
    })
})

router.get('/leaveChat',(req,res,next) => {
    console.log("leaveChat");    
    if(req.query.userName !== undefined){
        var index = users.indexOf(req.query.userName);
        if(index > -1) {
            users.splice(index, 1)
        }
    }
    res.render('pages/login', {
        title: 'Virtual Tallow Chat',
        path: '/proveActivities/12'
    })
});

module.exports = router
