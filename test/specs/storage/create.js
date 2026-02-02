import LoginPage from  '../../pageobjects/login.page';
import { StorageCreatePage } from '../../pageobjects/storage.create.page'
import faker from 'faker'
describe('Open Storage Page', () => {
    it('should open storage create', () => {
        LoginPage.open();

        LoginPage.login('arif2@gmail.com', 'arif2@gmail.com');
        StorageCreatePage.open()
        browser.waitUntil(() => $('.headline').getText() == 'Create Storage',{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    });
    it('should select volume size',()=>{
        browser.waitUntil(() => $$('.select-instance').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        const select = faker.random.arrayElement($$('.select-instance'))
        select.click()
        
    })
    it('should select instance created',()=>{
        $('#SelectInstance').$('..').click()
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item__title').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        faker.random.arrayElement($('.menuable__content__active').$$('.v-list-item__title')).click()
    })
    it('should write name volume',()=>{
        $('#NameVolume').setValue(faker.name.firstName())
    })
    it('should choose configre options',()=>{        
        faker.random.arrayElement($('#ChooseConfigOptions').$$('input')).$('..').click()
    })
    it('should selct random filesystem',()=>{
        faker.random.arrayElement($('#choosefilesystem').$$('input')).$('..').click()

    })
    it('should write random vocheer',()=>{
        $('#Voucher').setValue(faker.name.firstName())

    })
    it('should click create button',()=>{
        $('.v-btn__content=Create Storage').click()
        browser.pause(5000)

    })
});