const express = require("express");
const { getAllProductDiscovery, createProductDiscovery, updateProductDiscovery, deleteProductDiscovery, getProductDiscoveryById } = require("../controllers/productDiscovery");
const { isAuth } = require('../../utils');
const router = express.Router();

router.get('/', getAllProductDiscovery);

router.get('/:id', isAuth, getProductDiscoveryById);

router.post('/create', isAuth, createProductDiscovery);

router.put('/update/:id', isAuth, updateProductDiscovery);

router.delete('/delete/:id', isAuth, deleteProductDiscovery);

module.exports = router;