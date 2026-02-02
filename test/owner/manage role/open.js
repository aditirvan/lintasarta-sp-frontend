const createnewrole = require('./create').create
module.exports.open = ( browser ) => {
    const open = {
        create: createnewrole(browser)
    }
    return async () => {
        try {
            const organization = await browser.$('#OrganizationNav')
            await organization.waitForExist({ timeout: 5000 });
            await organization.click()
            const manageorg = await browser.$('=Manage Role')
            await manageorg.waitForExist({ timeout: 5000 });
            await manageorg.click()

        } catch (e) {
            // console.log(e)
        }
        return open
    }
}