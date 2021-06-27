const Order = require("../models/order");
// const { validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const midtransClient = require("midtrans-client");
const { v4: uuidv4 } = require('uuid');
// const midtransClient = require('midtrans-client'); // use this if installed via NPM
require("dotenv/config");

exports.createOrder = asyncHandler(async (req, res) => {
  const order_items = req.body.orderItems;
  const shipping_address = req.body.shippingAddress;
  const item_price = req.body.itemsPrice;
  const tax_price = req.body.taxPrice;
  const total_price = req.body.totalPrice;
  const user = req.user._id;

  if (req.body.orderItems.length === 0) {
    res.status(400).json({ message: "Cart is empty" });
  } else {
    const order = new Order({
      orderItems: order_items,
      shippingAddress: shipping_address,
      itemsPrice: item_price,
      taxPrice: tax_price,
      totalPrice: total_price,
      user: user,
    });
    const saveOrder = await order.save();
    res.status(201).json({ message: "New Order Created", saveOrder });
  }
});

exports.getOrderMine = asyncHandler(async (req, res) => {
  const sortByDesc = { createdAt: -1 };
  const findUser = { user: req.user._id };
  const order = await Order.find(findUser).sort(sortByDesc)
  if (order) {
    res.status(200).json({ message: "Find order/user mine success", order });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const getId = req.params.id;
  const order = await Order.findById(getId);
  if (order) {
    res.status(200).json({ message: "Find order success", order });
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

exports.deleteOrder = asyncHandler(async (req, res) => {
  const getId = req.params.id;
  const order = await Order.findById(getId);
  if (order) {
    const deleteOrder = await order.remove();
    res.status(200).json({ message: "Order Deleted", data: deleteOrder });
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

exports.getTokenSnap = asyncHandler(async (req, res) => {
  // initialize snap client object
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.SERVER_KEY,
    clientKey: process.env.CLIENT_KEY,
  });

  const getId = req.params.id;
  const order = await Order.findById(getId).populate("user", "email");
  const taxItems = {
    id: uuidv4(),
    price: order.taxPrice,
    name: "Tax",
    quantity: 1
  };
  const mapItemDetails = order.orderItems.map((item) => {
    return {
      id: item._id,
      price: item.price,
      quantity: item.qty,
      name: item.name,
    };
  });
  const concatArray = mapItemDetails.concat(taxItems);
  console.log(order);
  // prepare Snap API parameter ( refer to: https://snap-docs.midtrans.com ) minimum parameter example:
  let parameter = {
    transaction_details: {
      order_id: order._id,
      gross_amount: order.totalPrice,
    },
    item_details: concatArray,
    customer_details: {
      first_name: order.shippingAddress.fullName,
      email: order.user.email,
      phone: order.shippingAddress.phone,
      billing_address: {
        first_name: order.shippingAddress.fullName,
        email: order.user.email,
        phone: order.shippingAddress.phone,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        postal_code: order.shippingAddress.postal_code,
      },
      shippingAddress: {
        first_name: order.shippingAddress.fullName,
        email: order.user.email,
        phone: order.shippingAddress.phone,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        postal_code: order.shippingAddress.postal_code,
      },
    },
    credit_card: {
      secure: true,
    },
  };
  console.log(parameter);
  // create transaction
  snap
    .createTransaction(parameter)
    .then((transaction) => {
      // transaction token
      let transactionToken = transaction.token;
      
      console.log("transactionToken:", transactionToken);
      res.status(200).json({ message: "get token success", transactionToken });
      res.setHeader("name");
      // transaction redirect url
      let transactionRedirectUrl = transaction.redirect_url;
      console.log("transactionRedirectUrl:", transactionRedirectUrl);
      res
        .status(200)
        .json({ message: "get token success", transactionRedirectUrl });
    })
    .catch((e) => {
      console.log("Error occured:", e.message);
    });
});

exports.payOrder = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const order = await Order.findById(id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();

    const updateOrder = await order.save();
    res.status(201).json({ message: "Order Paid Success", updateOrder });
  } else {
    res.status(404).json({ message: "Order Not Found" });
  }
});
