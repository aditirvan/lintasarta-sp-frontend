import LoginPage from  '../../pageobjects/login.page';
import faker from 'faker'
import managevoucher from '../../pageobjects/voucher.page'
describe('Open SuperAdmin Page', () => {
    it('should login as super admin',()=>{
        LoginPage.open()
        LoginPage.loginsuperadmin()
        const fivesecond = new Date().getTime() + 9000
        browser.waitUntil(() => fivesecond <= new Date().getTime(),{
            timeout: 10000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    })
    it('should open manage voucher',()=>{
        managevoucher.open()
        browser.waitUntil(() => $('tbody').$$('tr').length > 0,{
            timeout: 10000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    })
    it('should click delete',()=>{
        const row = faker.random.arrayElement($('tbody').$$('tr'))
        const deletebutton = row.$('.error--text')
        deletebutton.click()
    })
    it('should click confirm',()=>{
        $('#Confirm').click()
        browser.pause(5000)

    })
})