const express = require("express");
const { body } = require("express-validator");
const { isAuth } = require("../../utils");
const {
  createProduct,
  getAllProducts,
  getCategories,
  getProductById,
  deleteProductById,
  getUpdateById,
  getProductSeller,
} = require("../controllers/products");

const router = express.Router();

//post
router.post(
  "/product/post",
  [
    body("name").isLength({ min: 5 }).withMessage("name not match!"),
    body("detail").isLength({ max: 500 }).withMessage("body not match!"),
  ],
  isAuth, createProduct
);

//read -> get all products
router.get("/products", getAllProducts);

//read -> get categoriesis
router.get("/product/categories", getCategories);

//read -> get product by ID
router.get("/product/:id", getProductById);

router.get("/products-seller", isAuth, getProductSeller);

//update -> put
router.put(
  "/product/post/:id",
  [
    body("name").isLength({ min: 5 }).withMessage("name not match!"),
    body("detail").isLength({ max: 500 }).withMessage("body not match!"),
  ],
  isAuth, getUpdateById
);

//delete -> delete product by ID
router.delete("/product/delete/:id", isAuth, deleteProductById);

module.exports = router;
