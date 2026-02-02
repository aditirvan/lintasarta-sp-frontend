import LoginPage from  '../../pageobjects/login.page'
import Instance from '../../pageobjects/instance.page'
import faker from 'faker'
describe('Open Instance Page', () => {
    it('should open object storage page', () => {
        LoginPage.open();

        LoginPage.login('arif2@gmail.com', 'arif2@gmail.com');
        Instance.open()
    })
    it('should click more menu',()=>{
        browser.waitUntil(() => $('tbody').$$('tr').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        const tr = faker.random.arrayElement($('tbody').$$('tr'))
        console.log(tr)
        const td = tr.$$('td')
        const more = td[5].$('label')
        more.click()

    })
    it('should click delete instance',()=>{
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        $('.v-list-item__title=Delete Instance').click()
    })
    it('should click delete button',()=>{
        $('.v-btn__content=Delete Instance').$('..').click()
        browser.pause(5000)
    })
})