const express = require('express');
const router = express.Router();


const { getAllProducts, getSingleProduct, createProduct, uploadImage, updateProduct, deleteProduct } = require('../controllers/productsController');

const { authenticateUser } = require('../middleware/authentication');


router.route('/').get(getAllProducts).post(authenticateUser, createProduct);

router.route('/uploadImage').post(uploadImage);

router.route('/:id').get(getSingleProduct).patch(updateProduct).delete(deleteProduct);


module.exports = router;