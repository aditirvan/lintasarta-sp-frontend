const faker = require('faker')
const {confirm}  = require('./addnewmemberconfirm')
module.exports.addnewmember = (browser) => {
    const addnewmember = {
        confirm: confirm(browser)
    }
    return async () => {
        const btnaddnewmember = await browser.$('#AddNewMember')
        await btnaddnewmember.waitForExist({ timeout: 10000 });
        await btnaddnewmember.click()
        return addnewmember
    }
}