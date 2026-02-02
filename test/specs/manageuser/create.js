import LoginPage from  '../../pageobjects/login.page';
import faker from 'faker'
import manageUser from '../../pageobjects/manageuser.page'
describe('Open SuperAdmin Page', () => {
    it('should login as super admin',()=>{
        LoginPage.open()
        LoginPage.loginsuperadmin()
    })
    it('should go to manageuser page',()=>{
        manageUser.open()
    })
    it('should click create new user button',()=>{
        $('.v-btn__content=Create New User').click()
    })
    it('should write fullname',()=>{
        $('[placeholder="Enter Name"]').setValue(faker.name.findName())
    })
    it('should write phone number',()=>{
        $('[placeholder="Enter Phone Number"]').setValue(faker.phone.phoneNumber('+62-###-###-####'))
    })
    it('should write email',()=>{
        $('[placeholder="Enter Email"]').setValue(faker.internet.email())
    })

    it('should click select organization',()=>{
        $('[placeholder="Select Organization"]').$('..').click()
    })
    it('should select organization',()=>{
        faker.random.arrayElement($('.menuable__content__active').$$('.v-list-item')).click()
    })
    it('should click select role',()=>{
        $('[placeholder="Select Role"]').$('..').click()
    })
    it('should select owner',()=>{
        $('.v-list-item__title=Owner').click()
    })
    it('should click select status',()=>{
        $('[placeholder="Status User"]').$('..').click()
    })
    it('should select active',()=>{
        $('.v-list-item__title=active').click()
    })
    it('should click add button',()=>{
        $('.v-btn__content=Add').click()
        browser.pause(5000)
    })

})