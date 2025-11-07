import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'nrrrigesh@gmail.com',
    pass: 'lycs rqfu fsus ltwx'
  }
});

transporter.sendMail({
  from: '"MyApp" <nrrrigesh@gmail.com>',
  to: 'rakeshthulla2005@gmail.com',
  subject: 'Test Email',
  text: 'If you receive this, SMTP works!'
}, (err, info) => {
  if (err) {
    console.error('❌ Email failed:', err);
  } else {
    console.log('✅ Email sent:', info.response);
  }
});
