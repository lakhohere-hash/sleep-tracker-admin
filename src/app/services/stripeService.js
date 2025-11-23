const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

class StripeService {
    // 🚀 CREATE CHECKOUT SESSION
    async createCheckoutSession(userId, planType, billingInterval = 'monthly') {
        try {
            console.log('💰 Creating checkout session for:', { userId, planType, billingInterval });

            // Map plan types to Stripe price IDs
            const priceMap = {
                'premium_monthly': 'price_premium_monthly',
                'premium_yearly': 'price_premium_yearly', 
                'enterprise_monthly': 'price_enterprise_monthly'
            };

            const priceId = priceMap[`${planType}_${billingInterval}`];
            
            if (!priceId) {
                throw new Error(`Invalid plan: ${planType} ${billingInterval}`);
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: 'https://your-app.com/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'https://your-app.com/cancel',
                client_reference_id: userId,
                metadata: {
                    userId: userId,
                    planType: planType,
                    billingInterval: billingInterval
                }
            });

            console.log('✅ Checkout session created:', session.id);

            return {
                success: true,
                sessionId: session.id,
                url: session.url
            };
        } catch (error) {
            console.error('❌ Stripe checkout error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 📊 GET SUBSCRIPTION DETAILS
    async getSubscription(subscriptionId) {
        try {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            return {
                success: true,
                subscription: subscription
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ❌ CANCEL SUBSCRIPTION
    async cancelSubscription(subscriptionId) {
        try {
            const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
            return {
                success: true,
                subscription: canceledSubscription
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 🔔 HANDLE STRIPE WEBHOOKS
    async handleWebhook(payload, signature) {
        try {
            const event = stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder'
            );

            console.log('🔄 Webhook received:', event.type);

            switch (event.type) {
                case 'checkout.session.completed':
                    await this.handleCheckoutCompleted(event.data.object);
                    break;
                case 'customer.subscription.updated':
                    await this.handleSubscriptionUpdated(event.data.object);
                    break;
                case 'customer.subscription.deleted':
                    await this.handleSubscriptionDeleted(event.data.object);
                    break;
            }

            return { success: true, event: event.type };
        } catch (error) {
            console.error('❌ Webhook error:', error);
            return { success: false, error: error.message };
        }
    }

    // 🎯 WEBHOOK HANDLERS
    async handleCheckoutCompleted(session) {
        console.log('💰 Payment completed:', session.id);
        console.log('📋 Session metadata:', session.metadata);
        // In production, update user subscription in database here
    }

    async handleSubscriptionUpdated(subscription) {
        console.log('📊 Subscription updated:', subscription.id);
        // Update subscription status in database
    }

    async handleSubscriptionDeleted(subscription) {
        console.log('❌ Subscription canceled:', subscription.id);
        // Mark subscription as canceled in database
    }
}

module.exports = new StripeService();