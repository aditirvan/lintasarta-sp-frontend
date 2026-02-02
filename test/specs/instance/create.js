import LoginPage from  '../../pageobjects/login.page';
import { instanceCreate } from '../../pageobjects/instance.create.page'
import faker from 'faker'
describe('Open Create Instance Page', () => {
    it('should crete instance page', () => {
        LoginPage.open();

        LoginPage.login('arif2@gmail.com', 'arif2@gmail.com');
        browser.waitUntil(() => $('span=Select Project').isExisting(),{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        instanceCreate.open()
    });
    
    it('should select operating system',()=>{
        browser.waitUntil(() => $('.headline').getText() == 'Create Instance',{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        $('#SelectOperatingSystem').click()
        browser.pause(5000)
    })
    it('should select OS',()=>{
        const selectos = $('#SelectOS').$('..')
        selectos.click()
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        faker.random.arrayElement($('.menuable__content__active').$$('.v-list-item')).$('..').click()
    })
    it('should select version',()=>{
        const selectversion = $('#SelectVersion').$('..')
        selectversion.click()
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        faker.random.arrayElement($('.menuable__content__active').$$('.v-list-item')).$('..').click()

    })
    
    it('should write vpc network',()=>{
        const selectvpc = $('#VPCNetwork')
        selectvpc.setValue(faker.name.firstName())
    })
    it('should click choose a plan',()=>{
        $('#chooseaplan').$('..').click()
    })
    it('should select plan',()=>{
        browser.waitUntil(() => $('.menuable__content__active').$$('.v-list-item').length > 0,{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        faker.random.arrayElement($('.menuable__content__active').$$('.v-list-item')).click()
    })
    it('should select instance size',()=>{
        const selectinstancesize = $('#SelectInstanceSize')
        const instancesize = faker.random.arrayElement( selectinstancesize.$$('.v-card'))
        instancesize.click()
    })
    
    it('should select auth type',()=>{
        const authtype = faker.random.arrayElement(['ssh','password'])
        const actauthentication = $(`[value="${authtype}"]`)
        actauthentication.$('..').click()
        if(authtype == 'ssh'){
            browser.waitUntil(() => $('#ChooseSSHKey').$$('input').length > 0,{
                timeout: 5000,
                timeoutMsg: 'expected text to be different after 5s'
            })
            const choosesshkey = faker.random.arrayElement($('#ChooseSSHKey').$$('input'))
            choosesshkey.$('..').click()
        }else if(authtype == 'password'){
            $('#createpassword').setValue(faker.name.firstName())
        }
    })
    it('should add tags',()=>{
        instanceCreate.clickAddTags()
        instanceCreate.randomSelectTags()
    })
    it('should write instance name',()=>{
        instanceCreate.InstanceName.setValue(faker.name.firstName())
    })
    it('should submit create instance',()=>{
        instanceCreate.SubmitCreateInstance.click()
        const wait = new Date().getTime() + 1000 * 5 
        browser.waitUntil( ()=>new Date().getTime() == wait , {timeout: 6000, timeoutMsg:'wait time'})
    })
  
});