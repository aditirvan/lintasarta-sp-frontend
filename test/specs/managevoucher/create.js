import LoginPage from  '../../pageobjects/login.page';
import faker from 'faker'
import createvoucher from '../../pageobjects/voucher.create.page'
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
    it('should open create voucer page',()=>{
        createvoucher.open()
        const fivesecond = new Date().getTime() + 4000
        browser.waitUntil(() => fivesecond <= new Date().getTime(),{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    })
    it('should write name',()=>{
        $('#Name').setValue(faker.name.firstName())
    })
    it('should write Description',()=>{
        $('#Description').setValue(faker.lorem.words(30))
    })
    it('should fill quota',()=>{
        $('#kuota').setValue(faker.random.number(100))
    })
    it('should write code voucher',()=>{
        $('#Kode').setValue(faker.internet.password(6))
    })
    it('should fill percentage',()=>{
        $('#Percentage').setValue(faker.random.number(100))

    })
    it('should fill max discount',()=>{
        $('#MaxDiscount').setValue(faker.random.number(1000000))
    })
    it('should selext applied to',()=>{
        const appliedto = $$('.appliedto')
        appliedto.forEach(ap => {
            faker.random.boolean()?ap.$('.v-input--selection-controls__ripple').click():''
        });
    })
    it('should click create voucher',()=>{
        $('#CreateVoucher').click()
        const fivesecond = new Date().getTime() + 4000
        browser.waitUntil(() => fivesecond <= new Date().getTime(),{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    })
    
})