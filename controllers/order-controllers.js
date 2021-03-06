const HttpError = require('../middleware/http-error');
const Order = require('../models/order-model');
const Product = require('../models/products-model');

const postOrder = async (req, res, next) => {

    //the req body
    const {
        userName,
        userEmail,
        userPhoneNumber,
        userAdress,
        productsIds,
    } = req.body;

    //products validation 
    let price = 0;
    for (let i = 0; i < productsIds.length; i++) {
        let ValidProduct;
        try {
            ValidProduct = await Product.findById(productsIds[i]);
        } catch (err) {
            const error = new HttpError(
                'Something went wrong, could not find product.',
                500
            );
            return next(error);
        }

        if (ValidProduct.length === 0) {
            const error = new HttpError(
                'product not found.',
                404
            );
            return next(error);
        }

        price = price + ValidProduct.price;
    }

    const createdOrder = new Order({
        userName,
        userEmail,
        userPhoneNumber,
        userAdress,
        productsIds,
        price
    })

    try {
        await createdOrder.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not save the data.',
            500
        );
        return next(error);
    }

    res.status(201).json({ order: createdOrder });
}

const getAllOrders = async (req, res, next) => {
    let orders;
    try {
        orders = await Order.find({});
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the orders.',
            500
        );
        return next(error);
    }

    if (orders.length == 0) {
        const error = new HttpError(
            'there is no orders',
            404
        );
        return next(error);
    }

    res.json({
        orders: orders.map(prod =>
            prod.toObject({ getters: true }))
    });


}

const getOrderById = async (req, res, next) => {
    const orderId = req.params.id;
    let order;
    try {
        order = await Order.findById(orderId);
    } catch (err) {
        const error = new HttpError('something went wrong, could not find the order',
            500);
        return next(error);
    }

    if (order.length == 0) {
        const error = new HttpError(
            'there is no order whith this id.',
            500
        );
        return next(error);
    }

    res.json({ order: order.toObject({ getters: true }) });
}

const deleteOrder = async (req, res, next) => {
    const orderId = req.params.id;

    let order;
    try {
        order = await Order.findById(orderId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find order.',
            500
        );
        return next(error);
    }

    if (order.length == 0) {
        const error = new HttpError('could not find the order',
            404);
        return next(error);
    }

    try {
        await order.remove();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete order.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "order deleted" });
}

const updateOrderState = async (req, res, next) => {
    const orderId = req.params.id;
    const { orderState } = req.body;
    let order;
    try {
        order = await Order.findById(orderId);
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not find the order.',
            500
        );
        return next(error);
    }
    order.orderState = orderState;

    try {
        await order.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not save the Order.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: "state updated" });
}

exports.postOrder = postOrder;
exports.getAllOrders = getAllOrders;
exports.getOrderById = getOrderById;
exports.deleteOrder = deleteOrder;
exports.updateOrderState = updateOrderState;