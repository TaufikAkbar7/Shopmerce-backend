const { Product } = require("../models/products");
const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");

exports.createProduct = asyncHandler(async (req, res) => {
  //buat variabel baru untuk membungkus req ke dalam validationResult
  const error = validationResult(req);

  //cek apakah terjadi error pada validasi data
  if (!error.isEmpty()) {
    const err = new Error("Invalid value");
    err.errStatus = 400;
    err.data = error.array();
    throw err;
  }

  //cek apakah image sudah di upload oleh user
  if (!req.file) {
    const err = new Error("Image must be uploaded!");
    err.errStatus = 422;
    throw err;
  }

  const name = req.body.name;
  const image = req.file.path;
  const qty = req.body.qty;
  const harga = req.body.harga;
  const rating = req.body.rating;
  const detail = req.body.detail;
  const kategori = req.body.kategori;
  const seller = req.user._id;
  //pangil products dari models
  console.log(seller)
  const product = new Product({
    name: name,
    image: image,
    qty: qty,
    harga: harga,
    rating: rating,
    detail: detail,
    kategori: kategori,
    seller: seller
  });

  //save product
  const createProduct = await product.save();
  res
    .status(201)
    .json({ message: "Create Product Success", data: createProduct });
});

exports.getAllProducts = asyncHandler(async (req, res) => {
  //buat variabel untuk pagination
  //tanda + agar value dari variabel otomatis menjadi integer
  const currentPage = +req.query.page || 1;
  const perPage = +req.query.perPage || 4;
  const name = req.query.name || "";
  const category = req.query.category || "";
  const order = req.query.order || "";
  const min =
    req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
  const max =
    req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
  const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
  const categoryFilter = category ? { kategori: category } : {};
  const priceFilter = min && max ? { harga: { $gte: min, $lte: max } } : {};
  const sortOrder =
    order === "lowest"
      ? { harga: 1, createdAt: -1 }
      : order === "highest"
      ? { harga: -1, createdAt: -1 }
      : { _id: -1, createdAt: -1 };
      
  const count = await Product.countDocuments();
  const products = await Product.find({
    ...nameFilter,
    ...categoryFilter,
    ...priceFilter,
  })
    .sort(sortOrder)
    .skip((currentPage - 1) * perPage)
    .limit(perPage);
  res.status(200).json({
    message: "Get Data succesfully",
    total_product: count,
    current_page: currentPage,
    per_page: perPage,
    data: products
  });
});

exports.getProductById = asyncHandler(async (req, res) => {
  //buat variabel untuk get id dari route
  const getId = req.params.id;

  const product = await Product.findById(getId);
  res.status(200).json({ message: "Get Data Success", data: product });
});

exports.getCategories = asyncHandler(async (req, res) => {
  const product = await Product.find().distinct("kategori");
  res.status(200).json({ message: "Get Categories Success", data: product });
});

exports.getProductSeller = asyncHandler(async (req, res) => {
  const getSellerId = req.user._id;
  const sortByDesc = { createdAt: -1 };
  const products = await Product.find({ seller: getSellerId }).sort(sortByDesc);

  if(products){
    res.status(200).json({ message: "Get Products Seller Success", products });
  }else{
    res.status(404).json({ message: "Products Seller Not Found!" })
  }
})

exports.getUpdateById = asyncHandler(async (req, res) => {
  //buat variabel baru untuk membungkus req ke dalam validationResult
  const error = validationResult(req);

  //cek apakah terjadi error pada validasi data
  if (!error.isEmpty()) {
    const err = new Error("Invalid value");
    err.errStatus = 400;
    err.data = error.array();
    throw err;
  }

  //cek apakah image sudah di upload oleh user
  if (!req.file) {
    const err = new Error("Image must be uploaded!");
    err.errStatus = 422;
    throw err;
  }

  const name = req.body.name;
  const image = req.file.path;
  const qty = req.body.qty;
  const harga = req.body.harga;
  const rating = req.body.rating;
  const detail = req.body.detail;
  const getId = req.params.id;
  const kategori = req.body.kategori;
  const seller = req.user._id;

  const product = await Product.findById(getId);
  if (!product) {
    res.status(404).json({ message: "Product not found!" });
  }
  product.name = name;
  product.image = image;
  product.harga = harga;
  product.qty = qty;
  product.rating = rating;
  product.detail = detail;
  product.kategori = kategori;
  product.seller = seller;

  const updateProduct = await product.save();
  res.status(201).json({ message: "Product Updated", data: updateProduct });
});

exports.deleteProductById = asyncHandler(async (req, res) => {
  const getId = req.params.id;

  const product = await Product.findById(getId);
  if (!product) {
    res.status(404).json({ message: "Product not found!!" });
  }
  //remove image
  removeImage(product.image);

  //remove postingan atau blog
  const productRemove = await Product.findByIdAndRemove(getId);
  res.status(200).json({ message: "Product Deleted", data: productRemove });
});

const removeImage = (filePath) => {
  console.log(filePath);
  console.log(__dirname);

  ///home/kyousuke/Documents/Front_end_web/React_js/backend_blog/image/1616526926500-Screenshot 2021-02-15 14:36:01.png
  filePath = path.join(__dirname, "../../", filePath);
  fs.unlink(filePath, (error) => console.log(error));
};
