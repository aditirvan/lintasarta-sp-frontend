import LoginPage from  '../../pageobjects/login.page';
import faker from 'faker'
import manageFlavor from '../../pageobjects/manageflavor.page'
describe('Open SuperAdmin Page', () => {
    it('should login as super admin',()=>{
        LoginPage.open()
        LoginPage.loginsuperadmin()
    })
    it('should go to manageuser page',()=>{
        manageFlavor.open()
    })

    it('should click manage volume tab',()=>{
        $('span=Manage Volume').click()
    })
    it('should click create volume button',()=>{
        $('span=Create Volume Storage').click()
    })
    it('should write volume size',()=>{
        $('#volumesize').setValue(faker.random.number(100))
    })
    it('should write price per month',()=>{
        $('#pricepermonth').setValue(faker.random.number({min:1000000,max:10000000}))
    })
    it('should write price per hour',()=>{
        $('#priceperhour').setValue(faker.random.number({min:100000,max:1000000}))
    })
    it('should click create button',()=>{
        $('span=Create').click()
        browser.pause(5000)
    })
})