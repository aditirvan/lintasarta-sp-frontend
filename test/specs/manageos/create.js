import LoginPage from  '../../pageobjects/login.page';
import faker from 'faker'
import manageos from '../../pageobjects/manageos.page'
describe('Open SuperAdmin Page', () => {
    it('should login as super admin',()=>{
        LoginPage.open()
        LoginPage.loginsuperadmin()
        const fivesecond = new Date().getTime() + 4000
        browser.waitUntil(() => fivesecond <= new Date().getTime(),{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    })
    it('should open manage os',()=>{
        manageos.open()
        const fivesecond = new Date().getTime() + 4000
        browser.waitUntil(() => fivesecond <= new Date().getTime(),{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    })
    it('should click create new instance',()=>{
        $('span=Create New Version').click()
    })
    it('should write new os',()=>{
        $('#OperatingSystem').setValue(faker.name.firstName())
    })
    it('should write version number',()=>{
        $('#VersionNumber').setValue(faker.system.semver())
    })
    it('should select bit',()=>{
        $('[placeholder="Select Bit Version"]').$('..').click()
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        faker.random.arrayElement($('.menuable__content__active').$$('.v-list-item')).click()
    })
    it('should set file',()=>{
        // const path = require('path');
        // const filePath = path.join(__dirname, './test.iso');
        // const remoteFilePath = browser.uploadFile('/home/ubuntu/vue-test/test/specs/manageos/test.iso');
        $('#ButtonUpload').click()
        browser.pause(4000)
    })
    // it('should click add',()=>{
    //     $('#AddNewVersion').click()
    //     browser.pause(4000)

    // })
})