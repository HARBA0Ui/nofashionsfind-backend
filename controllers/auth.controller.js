import bcryptjs from "bcryptjs";
import prisma from "../db/prisma.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { username, password } = req.body;
  // console.log(username, password);
  try {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) return res.status(404).json({ message: "Admin not found!" });

    // console.log(admin);

    const passwordMatched = await bcryptjs.compare(password, admin.password);

    if (!passwordMatched) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    // generate cookie and send it to the user

    let age = 1000 * 60 * 60 * 24 * 7;
    // console.log(age);

    const { password: adminPassword, ...adminInfo } = admin;
    
    const token = jwt.sign(
      {
        id: admin.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: age,  
      })
      .status(200)
      .json(adminInfo);
  } catch (err) {
    res.status(500).json({ message: "Failed to login" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successfull" });
};