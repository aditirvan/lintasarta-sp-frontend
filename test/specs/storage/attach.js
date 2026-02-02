import LoginPage from  '../../pageobjects/login.page';
import { StoragePage } from '../../pageobjects/storage.page'
import faker from 'faker'
describe('Attach storage to instance', () => {
    it('should open storage page', () => {
        LoginPage.open();

        LoginPage.login();
        StoragePage.open()
        browser.waitUntil(() => $('.headline=Storage').getText() == 'Storage',{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    });
    it('should click more',()=>{
        //filter attachable storage
        const attach = faker.random.arrayElement($('.v-data-table').$$('.nothaveinstance'))
        attach.$('../../..').$('label').click()


    })
    it('should click attach instance',()=>{
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        $('label=Attach to Instance').click()

    })
    it('should click select instance',()=>{
        $('#SelectInstance').$('..').click()

    })
    it('should choose instance',()=>{
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        faker.random.arrayElement($('.menuable__content__active').$$('.v-list-item')).click()

    })
    it('should click confirm',()=>{
        $('.v-btn__content=Confirm').click()
        browser.pause(5000)

    })
});