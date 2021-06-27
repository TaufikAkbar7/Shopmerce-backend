const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//variabel template type data string
const defaultString = {
  type: String,
  required: true,
};

//variabel template type data number
const defaultNumber = {
  type: Number,
  required: true,
};

const ProductSchema = new Schema(
  {
    name: defaultString,
    qty: defaultNumber,
    harga: defaultNumber,
    detail: defaultString,
    image: defaultString,
    kategori: defaultString,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  {
    timestamps: true,
  }
);

const ProductDiscoverySchema = new Schema(
  {
    name: defaultString,
    image: defaultString
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model("Product", ProductSchema, "product");
const ProductDiscovery = mongoose.model("ProductDiscovery", ProductDiscoverySchema);
module.exports = { Product, ProductDiscovery };
