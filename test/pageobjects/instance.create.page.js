import Page from './page'
import faker from 'faker'

class InstanceCreate extends Page{
    sshkeyname = ''
    get AddTags (){ return $('#AddTags') }
    get MenualeContentActive(){return $('.menuable__content__active').$('.v-select-list').$$('.v-list-item')}
    clickAddTags(){
        this.AddTags.$('..').click()
    }
    randomSelectTags(){
        const random = faker.random.arrayElement(this.MenualeContentActive)
        random.click()
    }
    get InstanceName(){ return  $('#instancename')}
    get SubmitCreateInstance(){ return  $('#SubmitCreateInstance')}
    open(){
        super.open('instance/create')
        browser.waitUntil(() => $('.headline').getText() == 'Create Instance',{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    }
    selectSshAuth(){
        const actauthentication = $(`[value="ssh"]`)
        actauthentication.$('..').click()
        return this;
    }
    clickNEWSSHkey(){
        $('#NewSSHkey').click()
        return this
    }
    insertsshkeyContent(){
        $('#enterSSHKEYContent').setValue("ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDCqJrkjYQE71bacmDowABED3Xwu0XlRbafT6w+OsIzFzKv+7/7i69lC3ufdkYZnCXIymLZGPfi96bf8OXZWWCq+tTYjdNxlaYZAro+HpBEI04iVdNe2lXIcpH8ZP1L69QFUvskp+D3q6emPJ1OaBMTB0DEv6yWMvYR/vCRHNm9RKERkF4DBMO9zKYVNBUSa+vRCwmafZXvKRaTFRe3vPLPP/LTmOwpiOXGDmoVFmr6v6U3GohxsR2CSkai1iqIAu1oIU1PTx7QlZQt6HFRSLei1obXua5FcmRepzXEku6nXdQEjiJWFunmKc7yi25T9eKS8PYYvEydoi6PbDUL8N21gtSpWg+/oLLj6Xqv+hpxwOWF+7waEl5lS6qPq22ACMbq598qON0s/P3fwQTCGyPm1lpDlEQiOWI20Nd7KgAWRILEazj3cxt5vxJfXECSQZ67WUlyelGTBsuGcbllTZTo1OvxGrfSVyjE1nmGCCKHf55hVLtF1HY37ldbHn+xjAc= manjaro@os")
        return this
    }
    setSSHkeyName(){
        $('#SSHKEYNAME').setValue('')
        browser.keys(['Control','a'])
        browser.keys('Delete')
        this.sshkeyname = faker.name.firstName()
        $('#SSHKEYNAME').setValue(this.sshkeyname)
        return this
    }
    submitSSHkey(){
        $('#SubmitSSHkey').click()
        browser.pause(2000)
        return this
    }
    expectSShkey(){
        const el = $('#ChooseSSHKey').$$('label')
        const text = el.map(element => {
          return element.getText()
        });
        expect(text.includes(this.sshkeyname))
    }
}
export const instanceCreate = new InstanceCreate()
export default new InstanceCreate()