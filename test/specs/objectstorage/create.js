import LoginPage from  '../../pageobjects/login.page';
import { ObjectStorageCreatePage } from '../../pageobjects/objectstorage.create.page'
import faker from 'faker'
describe('Open Object Storage Page', () => {
    it('should open object storage page', () => {
        LoginPage.open();

        LoginPage.login('arif2@gmail.com', 'arif2@gmail.com');
        ObjectStorageCreatePage.open()
        browser.waitUntil(() => $('.headline').getText() == 'Create Object Storage',{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    });
    // it('should select region',()=>{
    //     $('#SelectRegion').$('..').click()
    //     browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
    //         timeout: 5000,
    //         timeoutMsg: 'expected text to be different after 5s'
    //     })
    //     const select = faker.random.arrayElement($('.menuable__content__active').$$('.v-list-item'))
    //     select.click()
        
    // })
    it('should select file listing',()=>{
        faker.random.arrayElement($('#FileListing').$$('input')).$('..').click()

    })
    it('should write unique name',()=>{
        $('#ChooseUniqueName').setValue(faker.name.firstName())

    })
    it('should select project',()=>{
        $('#SelectProject').$('..').click()
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        faker.random.arrayElement($('.menuable__content__active').$$('.v-list-item')).$('..').click()

    })
    it('should write voucher',()=>{
        $('#Voucher').setValue(faker.name.firstName())
    })
    it('should click create object storage',()=>{
        $('#CreateObjectStorage').click()
        browser.pause(5000)

    })
});