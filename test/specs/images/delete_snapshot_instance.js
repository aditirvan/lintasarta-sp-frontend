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
    it('should click more',()=>{
        const tr = faker.random.arrayElement($('tbody').$$('tr'))
        tr.$('label').click()
    })
    it('should click delete',()=>{
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        $('span=Delete').click()
        
    })
    it('should confirm delete',()=>{
        $('.v-btn.error').click()
        browser.pause(5000)
    })
})