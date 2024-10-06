import nodemailer from "nodemailer";

export const orderEmail = async (req, res) => {
  const { username, tel, email, city, title, quantity, id } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASS,
      },
    });

    let mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: "🛒 New Order - NOFashionFinds 🛒",
      html: `
        <h1>New order received: <strong>${title} </strong>(id#${id})</h1>
        <h2><strong>Quantity:</strong> ${quantity}</h2>
        <h2><strong>Full Name:</strong> ${username}</h2>
        <h2><strong>Email:</strong> ${email}</h2>
        <h2><strong>Tel Number:</strong> ${tel}</h2>
        <h2><strong>City:</strong> ${city}</h2>
      `,
    };

    let info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Your order is placed successfully ☺" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.toString());
  }
};

export const contactEmail = async (req, res) => {
  const { email, desc } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_PASS,
      },
    });

    let mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: "✉️ New Contact - NOFashionFinds ✉️",
      html: `
        <h1>New Contact ✉️</h1>
        <h2><strong>Email:</strong> ${email}</h2>
        <h2><strong>Message:</strong></h2>
        <h3>${desc}</h3>
      `
    };

    let info = await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email was successfully sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.toString());
  }
};