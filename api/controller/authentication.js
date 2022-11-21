const app = require('../server')
const stripe = require('stripe')('sk_test_51M1gi1BkmBpDuXUQniBlK26qulc8wxNSkxMNtYo8Tqc9VFXS73Haq1rWQ62RTltEco5Nk23oHuSmQv52KyZIuWpm00YBn6ueXs')

module.exports = function (passport) {
    const authenticate = passport.authenticate('local')

    return {
        async manageBilling (req, res) {
            const { userid } = req.enforcer.params
            // app.post('/create-customer-portal-session', async (req, res) => {
                // Authenticate your user.
                const session = await stripe.billingPortal.sessions.create({
                  customer: 'cus_MmM6FvrhaHylrW',
                //   return_url: 'https://example.com/account',
                });
              
                res.redirect(session.url);
            // });
            res.enforcer.status(200).send()
        },

        login (req, res, next) {
            authenticate(req, res, err => {
                if (err) return next(err)

                // Tell the browser to set an extra cookie. This cookie
                // is not secure, but it can help the UI to determine
                // if the user is logged in or not.
                res.cookie('user', JSON.stringify(req.user), {
                    maxAge: 36000000 // expires in 10 hours
                })
                res.enforcer.status(200).send()
            })
        },

        logout (req, res) {
            if (req.user) req.logout()
            res.clearCookie('user')
            res.enforcer.status(200).send()
        }
    }
}

