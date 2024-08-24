const stripe = require("stripe")(process.env.STRIPE_KEY)


const stripeController = async (req, res) => {
    const { purchase, total_amount, shipping_fee } = req.body

    // 1. always check for correct amount
    // frontend may vary 
    // so first check in own backend
    const calculateOrderAmount = () => {
        const total = total_amount + shipping_fee
        return total
    }

    // 2. Create Payment Intent & provide total amount from above
    // REMEMBER : paymentIntent"s"
    const paymentIntent = await stripe.checkout.sessions.create({
        amount: calculateOrderAmount(),
        currency: "usd",
    })
    // 3. Send Client Secret back to the client as response
    // REMEMBER : "paymentIntent"
    res.json({ clientSecret: paymentIntent.client_secret })

}


module.exports = stripeController