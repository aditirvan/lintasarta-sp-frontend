import LoginPage from  '../../pageobjects/login.page';
import { StoragePage } from '../../pageobjects/storage.page'
import faker from 'faker'
describe('Delete storage', () => {
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
        const more = faker.random.arrayElement($('.v-data-table').$$('label=More'))
        more.click()

    })
    it('should click delete',()=>{
        $('label=Delete').click()

    })
    it('should click confirm',()=>{
        $('.v-btn__content=Confirm').click()
        browser.pause(5000)

    })
});