
const Superadmin = require('./superadmin').default
const Owner = require('./owner').default
class InstanceTesting {
    constructor(browser) {
        this.superadmin = new Superadmin(browser)
        this.owner = new Owner(browser)
    }
}
module.exports.default = InstanceTesting