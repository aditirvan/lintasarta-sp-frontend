import LoginPage from  '../../pageobjects/login.page';
import imagepage from '../../pageobjects/images.page'
import faker from 'faker'
describe('Open Create Snapshot Page', () => {
    it('should open image page', () => {
        LoginPage.open();

        LoginPage.login();
        imagepage.open()
    });
    it('should click snapshot tab',()=>{
        $('[href="/image/backups"]').click()
        $('[href="/image/snapshot"]').click()
    })
    it('should click instance tab',()=>{
        $('.v-tab=Storage').click()
    })
    it('should select storage',()=>{
        $('.v-select__selections').click()
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        faker.random.arrayElement($$('.mdi-database')).click()
    })
    it('should write image name',()=>{
        $("[placeholder='Enter Image']").setValue(faker.name.firstName())
    })
    it('should click take snapshot',()=>{
        $('.v-btn__content=Take Snapshot').click()
        browser.pause(5000)

    })
})