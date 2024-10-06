import nodemailer from "nodemailer";
import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const admin = await prisma.admin.findFirst({
    where: {
      email,
    },
  });

  if (!admin) {
    return res.send({ Status: "Invalid Email!" });
  }

  const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24H",
  });

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.APP_PASS,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Reset Password Link",
    text: `http://localhost:5173/login/new-pass/${admin.id}/${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      return res.send({ Status: "success" });
    }
  });
};

export const resetPassword = async(req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const cryptedPassword= await bcryptjs.hash(password, 10);
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.send({ Status: "error with the token!" });
    } else {
      await prisma.admin.update({
        where: { id },
        data: {
          password: cryptedPassword,
        },
      });

      return res.send({ Status: "success" });
    }
  });
};