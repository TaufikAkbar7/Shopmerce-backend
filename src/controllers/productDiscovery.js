const { ProductDiscovery } = require("../models/products");
const asyncHandler = require("express-async-handler");
const path = require("path");
const fs = require("fs");

exports.createProductDiscovery = asyncHandler(async (req, res) => {
  //cek apakah image sudah di upload oleh user
  if (!req.file) {
    const err = new Error("Image must be uploaded!");
    err.errStatus = 422;
    throw err;
  }
  const name = req.body.name;
  const image = req.file.path;

  const productDiscovery = new ProductDiscovery({
    name: name,
    image: image,
  });
  const createProduct = await productDiscovery.save();
  res
    .status(201)
    .json({ message: "Create Product Discovery Success", createProduct });
});

exports.getProductDiscoveryById = asyncHandler(async (req, res) => {
  const getId = req.params.id;

  const products = await ProductDiscovery.findById(getId);
  res.status(200).json({ message: "Get Data Success", products });
})

exports.updateProductDiscovery = asyncHandler(async (req, res) => {
  //cek apakah image sudah di upload oleh user
  if (!req.file) {
    const err = new Error("Image must be uploaded!");
    err.errStatus = 422;
    throw err;
  }

  const name = req.body.name;
  const image = req.file.path;
  const getId = req.params.id;

  const getProduct = await ProductDiscovery.findById(getId);

  if (!getProduct) {
    res.status(404).json({ message: "Product Discovery not found!" });
  }

  getProduct.name = name;
  getProduct.image = image;

  const updateProduct = await getProduct.save();
  res.status(201).json({ message: "Product Discovery Updated", updateProduct });
});

exports.getAllProductDiscovery = asyncHandler(async (req, res) => {
  const sortByDesc = { createdAt: -1 };
  const count = await ProductDiscovery.countDocuments();
  const products = await ProductDiscovery.find().sort(sortByDesc);
  res.status(200).json({
    message: "Get Product Discovery Success",
    products,
    total_product_discovery: count,
  });
});

exports.deleteProductDiscovery = asyncHandler(async (req, res) => {
  const getId = req.params.id;

  const product = await ProductDiscovery.findById(getId);
  if (!product) {
    res.status(404).json({ message: "Product not found!!" });
  }
  //remove image
  removeImage(product.image);

  //remove postingan atau blog
  const productRemove = await ProductDiscovery.findByIdAndRemove(getId);
  res.status(200).json({ message: "Product Discovery Deleted", productRemove });
});

const removeImage = (filePath) => {
  console.log(filePath);
  console.log(__dirname);

  ///home/kyousuke/Documents/Front_end_web/React_js/backend_blog/image/1616526926500-Screenshot 2021-02-15 14:36:01.png
  filePath = path.join(__dirname, "../../", filePath);
  fs.unlink(filePath, (error) => console.log(error));
};
