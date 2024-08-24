const Order = require("../models/Order");
const Product = require("../models/Product.js");

const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = 'someRandomValue';
    return { client_secret, amount };
};


const getAllOrders = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};


const getSingleOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
        throw new CustomError.NotFoundError(`No order with id: ${orderId}`);
    }

    checkPermissions(req.user, order.user);
    res.status(StatusCodes.OK).json({ order });
};

// quite a big one
const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1) {
        throw new CustomError.BadRequestError('No cart items provided');
    }
    if (!tax || !shippingFee) {
        throw new CustomError.BadRequestError("Please provide tax and shipping fee");
    }

    let orderItems = [];
    let subTotal = 0;

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product });
        if (!dbProduct) {
            throw new CustomError.NotFoundError(`No product with id:${item.product}`);
        }

        const { name, price, image, _id } = dbProduct;

        const singleOrderItem = {
            amount: item.amount,
            name,
            price, image, product: _id
        };

        // add item to order
        orderItems = [...orderItems, singleOrderItem];

        // calculate subtotal
        subTotal += item.amount * price;

        // calculate total
        const total = tax + shippingFee + subTotal;
        // get client secret
        const paymentIntent = await fakeStripeAPI({
            amount: total,
            currency: 'usd'
        });

        const order = await Order.create({
            orderItems, total, subTotal, tax, shippingFee, client_secret: paymentIntent.client_secret,
            user: req.user.userId
        });

        res.status(StatusCodes.CREATED).json({ order, client_secret: order.clientSecret });
    }


};

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
        throw new CustomError.NotFoundError(`No order with id: ${orderId}`);
    }
    checkPermissions(req.user, order.user);

    order.paymentIntentId = paymentIntentId;
    order.status = 'paid';
    await order.save();

    res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};


module.exports = {
    createOrder, getAllOrders, getSingleOrder, updateOrder, getCurrentUserOrders
};
