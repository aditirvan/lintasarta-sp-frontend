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
    it('should click more',()=>{
        browser.waitUntil(() => $$('label=More').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        faker.random.arrayElement($$('label=More')).click()
    })
    it('should click delete',()=>{
        $('.v-list-item__title=Delete').click()
    })
    it('should click yes',()=>{
        $('.v-btn__content=Yes').click()
        browser.pause(5000)
    })

})