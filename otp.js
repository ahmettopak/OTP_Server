const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Basit bir kullanıcı veritabanı simülasyonu
const users = [
    { id: 1, email: 'kullanici@example.com', otp: '' }
];

// OTP kodu oluşturma
function generateOTP() {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}

// E-posta gönderme fonksiyonu
function sendOTP(email, otp) {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // E-posta sağlayıcınıza göre değiştirin
        auth: {
            user: 'email@example.com', // E-posta adresinizi buraya girin
            pass: 'your-email-password' // E-posta şifrenizi buraya girin
        }
    });

    const mailOptions = {
        from: 'email@example.com',
        to: email,
        subject: 'OTP Kodu',
        text: `OTP Kodunuz: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('E-posta gönderildi: ' + info.response);
        }
    });
}

// Kullanıcıya OTP kodunu gönderme
app.post('/send-otp', (req, res) => {
    const { email } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const otp = generateOTP();
    user.otp = otp;

    sendOTP(email, otp);

    res.json({ message: 'OTP Kodu e-posta olarak gönderildi.' });
});

// Kullanıcının OTP kodunu doğrulama
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    if (user.otp !== otp) {
        return res.status(401).json({ message: 'OTP Kodu geçersiz.' });
    }

    // OTP kodu başarıyla doğrulandı, işlemler burada gerçekleştirilebilir

    // Doğrulanan OTP kodunu sıfırla
    user.otp = '';

    res.json({ message: 'OTP Kodu doğrulandı.' });
});

app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});
