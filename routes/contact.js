const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/sendmail', async (req, res) => {
    let { name, email, message } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'hridayjuneja04@gmail.com',
            pass: 'mdej psmy dvrv wgwu',
        }
    });

    let mailOptions = {
        from: email,
        to: 'hridayjuneja04@gmail.com',
        subject: `New Contact from ${name}`,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
