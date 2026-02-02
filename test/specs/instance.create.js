import InstancePage from '../pageobjects/instance.page'
import LoginPage from  '../pageobjects/login.page';
import DashboardPage from '../pageobjects/dashboard.page'
import InstanceCreate from '../pageobjects/instance.create.page'
import faker from 'faker'

describe('Create instance using ssh', () => {
    it('should open instance page',browserlogin);
    it('shuold open create instance page', createInstance('ssh'))
});
describe('Create instance using password', () => {
    it('shuold open create instance page', createInstance('password')
    )
});
function browserlogin(){
    browser.maximizeWindow()
    LoginPage.open();
    LoginPage.login('arif2@gmail.com', 'arif2@gmail.com');
    expect(true)
}
function createInstance(authtype) {
    return ()=>{
    InstanceCreate.open()
    
    const selectos = $('#SelectOS').$('..')
    selectos.click()
    
    const Debian = $('.v-list-item__title=Debian')
    Debian.click()
    const selectversion = $('#SelectVersion').$('..')
    selectversion.click()
    
    const version = $('.v-list-item__title=linode/debian10')
    version.click()
    const selectregion = $('#SelectRegion').$('..')
    selectregion.click()
    browser.waitUntil(() => $$('.v-list-item__title').length > 0,{
        timeout: 5000,
        timeoutMsg: 'expected text to be different after 5s'
    })
    const region = faker.random.arrayElement($$('.v-list-item__title'))
    region.click()
    const selectvpc = $('#VPCNetwork')
    selectvpc.setValue(faker.name.firstName())

    const selectinstancesize = $('#SelectInstanceSize')
    const instancesize = faker.random.arrayElement( selectinstancesize.$$('.v-card'))
    instancesize.click()

    
    const selectstoragesize = $('#SelectStorageSize')
    const storagesize = faker.random.arrayElement( selectstoragesize.$$('.v-card'))
    storagesize.click()

    const actauthentication = $(`[value="${authtype}"]`)
    
    actauthentication.$('..').click()
    if(authtype == 'ssh'){
        const choosesshkey = faker.random.arrayElement($('#ChooseSSHKey').$$('input'))
        choosesshkey.$('..').click()
    }else if(authtype == 'password'){
        $('#createpassword').setValue(faker.name.firstName())
    }
    InstanceCreate.clickAddTags()
    InstanceCreate.randomSelectTags()
    InstanceCreate.InstanceName.setValue(faker.name.firstName())
    InstanceCreate.SubmitCreateInstance.click()
    browser.pause(5000)
    expect($('.headline=Create Instance')).toBeExisting()
}
}

describe('Create ssh key from create instance page', () => {
    it('should open create instance page', ()=>{
        InstanceCreate.open()
        
    })
    it('should create sshkeyname',()=>{
        InstanceCreate.selectSshAuth()
        .clickNEWSSHkey()
        .insertsshkeyContent()
        .setSSHkeyName()
        .submitSSHkey()
        
    })
    it('should expect created sshkey',()=>{
        InstanceCreate.expectSShkey()
    })
    
});