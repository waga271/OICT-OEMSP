const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const Payment = require('../models/Payment');

// @route    POST api/payments/create-checkout-session/:courseId
// @desc     Create a Stripe Checkout session for a course
// @access   Private
router.post('/create-checkout-session/:courseId', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: course.title,
                            description: course.description,
                        },
                        unit_amount: course.price * 100, // Stripe expects amount in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success&courseId=${course._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/course/${course._id}?payment=cancelled`,
            metadata: {
                userId: req.user.id,
                courseId: course._id.toString()
            }
        });

        // Save pending payment record
        const payment = new Payment({
            user: req.user.id,
            course: req.params.courseId,
            stripeSessionId: session.id,
            amount: course.price,
            status: 'pending'
        });
        await payment.save();

        res.json({ id: session.id });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// @route    POST api/payments/webhook
// @desc     Stripe Webhook for payment confirmation
// @access   Public
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    let event;
    const signature = req.headers['stripe-signature'];

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Update payment status and enroll user
        const payment = await Payment.findOne({ stripeSessionId: session.id });
        if (payment) {
            payment.status = 'completed';
            await payment.save();

            const course = await Course.findById(payment.course);
            if (course) {
                // Add student to course if not already enrolled
                if (!course.students.some(s => s.user.toString() === payment.user.toString())) {
                    course.students.push({ user: payment.user });
                    await course.save();
                }
            }
        }
    }

    res.json({ received: true });
});

module.exports = router;
