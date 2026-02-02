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
        $('.v-tabs-bar').$('[href="/image/backups"]').click()
        $('.v-tabs-bar').$('[href="/image/snapshot"]').click()
    })
    it('should click instance tab',()=>{
        $('.v-tab=Storage').click()
        $('.v-tab=Instance').click()
    })
    it('should select instance',()=>{
        $('[placeholder="Choose a Instance or Storage"]').click()
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        faker.random.arrayElement($$('.mdi-television')).click()
    })
    it('should write image name',()=>{
        $("[placeholder='Enter Image']").setValue(faker.name.firstName())
    })
    it('should click take snapshot',()=>{
        $('.v-btn__content=Take Snapshot').click()
        browser.pause(5000)

    })
})