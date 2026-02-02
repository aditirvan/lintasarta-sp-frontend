const { search } = require('./search')
const { details } = require('./details')
module.exports.open = ( browser ) => {
    const open = {
        search: search(browser),
        details: details(browser)
    }
    return async () => {
        try {
            const menumanageorg = await browser.$('=Manage Organization')
            await menumanageorg.waitForExist({ timeout: 5000 });
            await menumanageorg.click()
        } catch (e) {
            // console.log(e)
        }
        return open
    }
}