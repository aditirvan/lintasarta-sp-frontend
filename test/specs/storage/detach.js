import LoginPage from  '../../pageobjects/login.page';
import { StoragePage } from '../../pageobjects/storage.page';
import faker from 'faker'
describe('Detach storage to instance', () => {
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
        const haveinstance = faker.random.arrayElement($('.v-data-table').$$('.haveinstance'))
        haveinstance.$('../../..').$('label').click()
    })
    it('should click detach',()=>{
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        $('label=Detach from Instance').click()

    })
    it('should confirm',()=>{
        $('span=Confirm').click()
        browser.pause(5000)
    })
});