const faker = require('faker')
const { addnewmember } = require('./detailorganization/addnewmember')
module.exports.details = (browser) => {
    const details = {
        addnewmember: addnewmember(browser)
    }
    return async () => {
        try {
            await browser.waitUntil(async () => await browser.$$('span=Details').then((doc) => {
                return doc.length > 0
            }), {
                timeout: 10000,
                timeoutMsg: 'expected text to be different after 5s'
            })
            const details = await browser.$$('span=Details')
            const detail = faker.random.arrayElement(details)
            await detail.click()
        } catch (e) {
            // console.log(e)
        }
        return details
    }
}