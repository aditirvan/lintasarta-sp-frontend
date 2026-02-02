const faker = require('faker')
module.exports.search = ( browser ) => {
    const search = {
        browser
    }
    return async () => {
        const search = await browser.$('[placeholder="Search"]')
            await search.waitForExist({ timeout: 10000 });

            const list = await browser.$('#Table').then(doc => {
                return doc.$('tbody')
            })
                .then(doc => {
                    return doc.$$('tr')
                })
            const picklist = faker.random.arrayElement(list)
            const text = await picklist.$$('td').then(doc => {
                return doc[0].getText()
            })

            await search.setValue(text.substring(0, 3))
    }
}