import LoginPage from  '../../pageobjects/login.page';
import faker from 'faker'
describe('Open SuperAdmin Page', () => {
    it('should login as super admin',()=>{
        LoginPage.open()
        LoginPage.loginsuperadmin()
    })
    it('should click menu select org / project',()=>{
        $('#SelectOrganizationOrProject').click()
    })
    it('should click new organization button',()=>{
        $('.v-btn__content=New Organization / Project').click()
    })
    it('should select tab Add New Organization',()=>{
        $('span=Add New Organization').click()
    })
    it('should write organization name',()=>{
        $('#orgname').setValue(faker.name.findName())
    })
    it('should write organization desc',()=>{
        $('#orgdesc').setValue(faker.lorem.sentences())
    })
    it('should click create',()=>{
        $('#CreateOrg').click()
        browser.pause(5000)

    })
})