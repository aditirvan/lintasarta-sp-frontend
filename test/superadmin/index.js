const faker = require('faker')
const { useplaceholder } = require('../composable/useplaceholder')
const { open: manageorg } = require('./manageorg/open')
class Superadmin {
    inputUsername
    inputPassword
    btnSubmit

    afteropennmanageorganization
    afteropenmanageuser
    afteropenmanageuserfilterorg
    afteropenmanageusercreatenewuser

    constructor(browser) {
        this.promise = Promise.resolve(this)
        this.browser = browser
        this.manageorg = manageorg(browser)
    }

    login = async ()=> {
        try {
            this.inputUsername = await this.browser.$('#username')
            this.inputPassword = await this.browser.$('#password')
            this.btnSubmit = await this.browser.$('#submit')
            await this.inputUsername.setValue('superadmin@lintasarta.id');
            await this.inputPassword.setValue('Superadmin123');
            await this.btnSubmit.click()
        }catch(e){
            // console.log(e)
        }
        return this
    }

    async manageorganizationswitchstatus() {
        const search = await this.browser.$('[placeholder="Search"]')
        // const searchvalue = await search.getValue()

        const list = await this.browser.$('#Table').then(doc => {
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

    async opencreateneworganization() {
        if (!this.afteropennmanageorganization) await this.opennmanageorganization()
        const createneworg = await this.browser.$('#CreateNewOrg')
        await createneworg.click()
    }

    async createneworganizationconfirm() {
        await this.opencreateneworganization()
        const entername = await this.browser.$('[placeholder="Enter Name"]')
        const enterfullname = await this.browser.$('[placeholder="Enter Full Name"]')
        const enteremail = await this.browser.$('[placeholder="Enter Email"]')
        const enterdetails = await this.browser.$('[placeholder="Enter Details"]')
        const enteraddress = await this.browser.$('[placeholder="Enter Address"]')
        const enterphonenumber = await this.browser.$('[placeholder="Enter Phone Number"]')
        const enternpwpnumber = await this.browser.$('[placeholder="Enter NPWP Number"]')
        const createbtn = await this.browser.$('#Create')
        await entername.setValue(faker.name.findName())
        await enterfullname.setValue(faker.name.findName())
        await enteremail.setValue(faker.internet.email())
        await enterdetails.setValue(faker.lorem.paragraph())
        await enteraddress.setValue(faker.lorem.sentence())
        await enterphonenumber.setValue(faker.phone.phoneNumber())
        await enternpwpnumber.setValue(faker.phone.phoneNumber())
        await createbtn.click()
    }
    async editorganization() {
        if (!this.afteropennmanageorganization) await this.opennmanageorganization()
        await this.browser.waitUntil(async () => await this.browser.$$('span=Edit').then((doc) => {
            return doc.length > 0
        }), {
            timeout: 10000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        const editlinks = await this.browser.$$('span=Edit')
        const editlink = faker.random.arrayElement(editlinks)
        await editlink.click()
    }

    async editorganizationconfirm() {
        const save = await this.browser.$('#Save')
        await save.click()
    }

    async next() {
        const next = await this.browser.$('#Next')
        await next.click()
    }

    async prev() {
        const prev = await this.browser.$('#Prev')
        await prev.click()
    }

    async openmanageuser() {
        if (!this.afterlogin) {
            await this.login()
        }
        const menumanageuser = await this.browser.$('=Manage User')
        await menumanageuser.waitForExist({ timeout: 5000 });
        await menumanageuser.click()
        this.afteropenmanageuser = true

    }

    async manageuserfilterorg() {
        if (!this.afteropenmanageuser) {
            await this.openmanageuser()
        }
        const filter = await this.browser.$('#FilterOrg')
        await filter.click()
        this.afteropenmanageuserfilterorg = true
    }

    async manageuserfilterorgclick() {
        if (!this.afteropenmanageuserfilterorg) {
            await this.manageuserfilterorg()
        }
        await this.browser.waitUntil(async () => await this.browser.$('#FilterOrgAttach').then((doc) => doc.$$('.v-list-item')).then((doc) => {
            return doc.length > 0
        }), {
            timeout: 10000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        const listitems = await this.browser.$('#FilterOrgAttach').then((doc) => doc.$$('.v-list-item'))
        const item = faker.random.arrayElement(listitems)
        await item.click()
        this.afteropenmanageuserfilterorg = false
    }

    async manageuserfilterorgtype() {

        if (!this.afteropenmanageuser) {
            await this.openmanageuser()
        }
        const filterorg = await this.browser.$('#FilterOrg')
        await filterorg.setValue('Lin')

    }

    async manageuserfilterrole() {
        if (!this.afteropenmanageuser) {
            await this.openmanageuser()
        }
        const filter = await this.browser.$('#FilterOrg')
        await filter.click()
        this.afteropenmanageuserfilterorg = true
    }

    async manageusersearch() {
        if (!this.afteropenmanageuser) {
            await this.openmanageuser()
        }
        await this.searchmanageorganization()
    }

    async manageusercreatenewuser() {
        if (!this.afteropenmanageuser) {
            await this.openmanageuser()
        }
        const createnew = await this.browser.$('#CreateNewUser')
        await createnew.click()
        this.afteropenmanageusercreatenewuser = true
    }
    async manageusercreatenewuserconfirm() {
        if (!this.afteropenmanageusercreatenewuser) {
            await this.manageusercreatenewuser()
        }
        const { entername, enterphonenumber, enteremail } = await useplaceholder(this.browser)
        await entername.setValue(faker.name.findName())
        await enterphonenumber.setValue(faker.phone.phoneNumber())
        await enteremail.setValue(faker.internet.email())
        const selectorg = await this.browser.$('[placeholder="Select Organization"]')
        await selectorg.click()
        const listorg = await this.browser.$('#SelectOrgAttach').then(doc => doc.$$('.v-list-item'))
        const org = faker.random.arrayElement(listorg)
        await org.click()
        const selectproj = await this.browser.$('[placeholder="Select Projects"]')
        await selectproj.click()
        const listproj = await this.browser.$('#SelectProjAttach').then(doc => doc.$$('.v-list-item'))
        const proj = faker.random.arrayElement(listproj)
        await proj.click()
        const add = await this.browser.$('#Add')
        add.click()
    }

    async manageuseredituserconfirm() {
        if (!this.afteropenmanageuser) {
            await this.openmanageuser()
        }
        await this.browser.waitUntil(async () => await this.browser.$$('label=More').then((doc) => {
            return doc.length > 0
        }), {
            timeout: 10000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        const list = await this.browser.$$('label=More')
        const item = faker.random.arrayElement(list)
        await item.click()
        const edit = await this.browser.$('.v-list-item__title=Edit')
        await edit.click()
        const update = await this.browser.$('#Update')
        await update.click()

    }

    async manageuseropendetail() {
        if (!this.afteropenmanageuser) {
            await this.openmanageuser()
        }
        await this.browser.waitUntil(async () => await this.browser.$$('label=More').then((doc) => {
            return doc.length > 0
        }), {
            timeout: 10000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        const list = await this.browser.$$('label=More')
        const item = faker.random.arrayElement(list)
        await item.click()
        const edit = await this.browser.$('.v-list-item__title=Detail')
        await edit.click()
        const update = await this.browser.$('#Update')
        await update.click()
    }
}

module.exports.default = Superadmin