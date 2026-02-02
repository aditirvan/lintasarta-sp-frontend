const faker = require('faker')
module.exports.confirm = (browser) => {
    const confirm = {
        confirm(){
            fun()
        }
    }

    const fun = async () => {
        
        const entername = await browser.$('[placeholder="Enter Name"]')
        await entername.setValue(faker.name.findName())
        const enteremail = await browser.$('[placeholder="Enter Email"]')
        await enteremail.setValue(faker.internet.email())
        const selectproject = await browser.$('[placeholder="Select Project"]')
        await selectproject.click()
        await browser.waitUntil(async () => await browser.$('.menuable__content__active').then((doc)=>{
            return doc.$$('.v-list-item')
        }).then((doc) => {
            return doc.length > 0
        }), {
            timeout: 10000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        const listitems = await browser.$('.menuable__content__active').then((doc)=>{
            return doc.$$('.v-list-item')
        })
        const item = faker.random.arrayElement(listitems)
        // await item.click()
        return confirm
    }

    return fun
}