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
    it('should select tab Add New Project',()=>{
        $('span=Add New Project').click()
    })
    it('should write proj name',()=>{
        $('#projname').setValue(faker.name.findName())
    })
    it('should click select organization',()=>{
        $('#orgSelect').$('..').click()
    })
    it('shuould select random organization',()=>{
        faker.random.arrayElement($('.menuable__content__active').$$('.v-list-item__content')).click()
    })
    it('should wrte desc proj',()=>{
        $('#projdesc').setValue(faker.lorem.sentences())
    })
    it('should click create',()=>{
        $('#CreateProj').click()
        browser.pause(5000)
    })
})