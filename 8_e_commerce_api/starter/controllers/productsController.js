const Product = require('../models/Product');
const { StatusCodes } = require("http-status-codes/");
const CustomError = require('../errors');

const createProduct = async (req, res) => {
    // this should done by only 'admin'
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
    // public route - anyone can access these products
    const products = await Product.find({});
    res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId }).populate('reviews');

    if (!product) {
        throw new CustomError.NotFoundError(`Not product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
    // this is also done by admin
    const { id: productId } = req.params;
    const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
        new: true,
        runValidators: true
    });


    if (!product) {
        throw new CustomError.NotFoundError(`No product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({ product });
};


const deleteProduct = async (req, res) => {

    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
        throw new CustomError.NotFoundError(`No product with id ${productId} `);
    }
    await product.remove();

    res.status(StatusCodes.OK).json({ msg: 'Success! product removed.' });
};

const uploadImage = async (req, res) => {
    if (!req.files) {
        throw new CustomError.BadRequestError('No file Uploaded');
    }

    const productImage = req.files.image;

    if (!productImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('Please upload image');
    }

    const maxSize = 1024 * 1024;

    if (productImage.size > maxSize) {
        throw new CustomError.BadRequestError('Please upload image less than 1MB');
    }

    const imagePath = path.join(__dirname, '../public/uploads' + `${productImage.name}`);
    await productImage.mv(imagePath);

    res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};



module.exports = {
    createProduct, getAllProducts, getSingleProduct, uploadImage, updateProduct, deleteProduct
};