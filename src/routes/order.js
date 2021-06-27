const express = require("express");
const { getOrderById, payOrder, createOrder, deleteOrder, getOrderMine, getTokenSnap } = require("../controllers/order");
const { isAuth } = require('../../utils');
const router = express.Router();

router.get('/mine', isAuth, getOrderMine);

router.post('/midtrans/:id', getTokenSnap);

router.get('/:id', getOrderById);

router.put('/pay/:id', payOrder);

router.post('/createOrder', isAuth, createOrder)

router.delete('/delete/:id', isAuth, deleteOrder);

module.exports = router;