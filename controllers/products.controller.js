import prisma from "../db/prisma.js";

import fs from "fs";
import path from "path";

import cloudinary from "cloudinary";
import dotenv from "dotenv";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a new product

export const createProduct = async (req, res) => {
  console.log(req.files[0]);

  try {
    const { title, desc, price: reqPrice, category } = req.body;
    console.log("category: ", category);
    const price = parseFloat(reqPrice);
    const rest = await cloudinary.uploader.upload(req.files[0].path);
    const imgs = [];
    imgs[0] = rest.secure_url;
    const product = { title, desc, imgs, price, category };

    await prisma.product.create({
      data: product,
    });
    return res
      .status(200)
      .json({ messaage: "The product has been added successfully!" });
  } catch (err) {
    console.log(err);
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params; // Access category from req.params

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;

    const skip = (page - 1) * limit;

    const products = await prisma.product.findMany({
      skip: skip,
      take: limit,
      where: {
        category: category, // Filter by category
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!products.length) { // Ensure this checks length
      return res.status(404).json({ message: "No products found!" });
    }

    return res.status(200).json({ products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product)
      return res.status("404").json({ message: "No Products has been found!" });
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: "Couldn't find the product!" });
  }
};

export const getProductByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const product = await prisma.product.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
    });

    if (!product)
      return res.status(404).json({ message: "No product has been found!" });

    return res.status(200).json({ product });
  } catch (err) {
    console.log(err);
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.imgs.length > 0) {
      const imageUrl = product.imgs[0];
      
      // Extract the public ID from the image URL
      const segments = imageUrl.split('/');
      const fileNameWithExt = segments.pop();
      const publicId = fileNameWithExt.split('.')[0]; 

      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Successfully deleted image with public ID: ${publicId}`);
      } catch (err) {
        console.error(`Error deleting image with public ID: ${publicId}`, err);
      }
    }

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a product

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, desc, price: reqPrice, category } = req.body;
    const price = parseFloat(reqPrice);

    if (req.files.length == 0) {
      await prisma.product.update({
        where: {
          id: id,
        },
        data: {
          title,
          desc,
          price,
          category,
        },
      });
    } else {
      const rest = await cloudinary.uploader.upload(req.files[0].path);
      const imgs = [];
      imgs[0] = rest.secure_url;
      const newProduct = { title, desc, imgs, price };
      await prisma.product.update({
        where: {
          id: id,
        },
        data: newProduct,
      });
    }

    return res
      .status(200)
      .json({ messaage: "The product has been upddated successfully!" });
  } catch (err) {
    console.log(err);
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.categories.findMany();

    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const createCategory = async (req, res) => {
  const { title } = req.body;
  try {
    const categories = await prisma.categories.create({
      data: {
        title,
      },
    });

    return res.status(200).json(categories);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  // console.log("id: ", id)
  try {
    await prisma.categories.delete({
      where: {
        id,
      },
    });

    return res
      .status(200)
      .json({ message: "Category has been removed successfully" });
  } catch (err) {
    console.log("err: ", err);
  }
};
