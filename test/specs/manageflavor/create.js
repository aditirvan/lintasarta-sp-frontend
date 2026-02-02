import LoginPage from  '../../pageobjects/login.page';
import faker, { fake } from 'faker'
import manageFlavor from '../../pageobjects/manageflavor.create.page'
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
    it('should go to manageuser page',()=>{
        manageFlavor.open()
        const fivesecond = new Date().getTime() + 4000
        browser.waitUntil(() => fivesecond <= new Date().getTime(),{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    })

    it('should click choose a plan',()=>{
        $('[placeholder="Shared CPU - Basic"]').$('..').click()
    })
    it('should select a plan',()=>{
        const plan = faker.random.arrayElement($('.menuable__content__active').$$('.v-list-item'))
        plan.click()
    })
    it('should write flavor name',()=>{
        $('[placeholder="Type Flavor Name"]').setValue(faker.name.firstName())
    })
    it('should write id',()=>{
        $('[placeholder="Type ID"]').setValue(faker.finance.account())
    })
    it('should write vcpu',()=>{
        $('[placeholder="Type vCPU"]').setValue(faker.random.number(8))
    })
    it('should write ram',()=>{
        $('[placeholder="Type RAM"]').setValue(faker.random.number(100))
    })
    it('should write root disk size',()=>{
        $('[placeholder="Root Disk Size"]').setValue(faker.random.number(1000))
    })
    it('should write ephemeral disk size',()=>{
        $('[placeholder="Ephemeral Disk Size"]').setValue(faker.random.number(1000))
    })
    it('should write swap disk size',()=>{
        $('[placeholder="Swap Size"]').setValue(faker.random.number(1000))
    })
    it('should write rx tx factor',()=>{
        $('[placeholder="Rx/Tx Factor"]').setValue(faker.random.number(10))
    })
    it('should write price per month',()=>{
        $('#pricepermonth').setValue(faker.random.number())
    })
    it('should write price per hour',()=>{
        $('#priceperhour').setValue(faker.random.number())
    })
    it('should click create package button',()=>{
        $('span=Create Package').click()
        browser.pause(5000)
    })

})