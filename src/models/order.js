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

const defaultBoolean = {
  type: Boolean,
  default: false,
};

const defaultDate = { type: Date };

const orderSchema = new Schema(
  {
    orderItems: [
      {
        name: defaultString,
        qty: defaultNumber,
        image: defaultString,
        price: defaultNumber,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: {
      fullName: defaultString,
      address: defaultString,
      city: defaultString,
      phone: defaultNumber,
      postal_code: defaultNumber,
    },
    itemsPrice: defaultNumber,
    taxPrice: defaultNumber,
    totalPrice: defaultNumber,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPaid: defaultBoolean,
    paidAt: defaultDate,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
