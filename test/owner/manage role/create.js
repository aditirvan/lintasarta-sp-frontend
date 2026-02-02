const faker = require('faker')
module.exports.create = ( browser ) => {
    return async () => {
       
            const createnewrole = await browser.$('#CreateNewRoleNav')
            await createnewrole.waitForExist({ timeout: 5000 });
            await createnewrole.click()
            const rolename = await browser.$('[placeholder="Type Role Name"]')
            await rolename.setValue(faker.name.findName())
            const description = await browser.$('[placeholder="Type Description Here"]')
            await description.setValue(faker.lorem.sentence())
            const radio = await browser.$$('.v-input--radio-group')
            for(e of radio){
                if(faker.random.boolean()){
                    await e.click()
                }
            }
            const saverole = await browser.$('#SaveRole')
            await saverole.click()
        
    }
}