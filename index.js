const axios = require('axios');
const express = require('express');
const multer = require('multer');

const FormData = require('form-data');
const fs = require('fs');

const app = express()

const storage = multer.diskStorage({ // ในส่วนนี้จะเป็น config ของ Multer ว่าจะให้เก็บไฟล์ไว้ที่ไหน และ Rename ชื่อไฟล์
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
})
const upload = multer({ storage: storage }) // ใส่ Config ลงไป

var publicDir = require('path').join(__dirname, './uploads')
app.use(express.static(publicDir))

app.all('/', upload.single('file'), async (req, res) => {
    let data = new FormData();
    data.append('file', fs.createReadStream(req.file.path));

    let config = {
        method: 'POST',
        url: 'https://api.cloudflare.com/client/v4/accounts/39aa4ea3c7a7d766adc4428933324787/images/v1',
        headers: {
            'Authorization': 'Bearer LpMNSFUw7gmxpn4ZZ7P2ZAcReF6Q-HlbIWqthbO0',
            ...data.getHeaders()
        },
        data: data
    };

    axios(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            res.status(200).send(response.data)
        })
        .catch((error) => {
            console.log(error);
            res.status(400).send(error.message)
        });

})
app.listen(process.env.PORT || 3000)