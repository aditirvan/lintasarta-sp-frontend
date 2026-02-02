const {open : managerole} = require('./manage role/open')
class Owner {

    constructor(browser) {
        this.browser = browser
        this.managerole = managerole(browser)
    }

    async login() {
        try {
            this.inputUsername = await this.browser.$('#username')
            this.inputPassword = await this.browser.$('#password')
            this.btnSubmit = await this.browser.$('#submit')
            await this.inputUsername.setValue('admin@lintasarta.id');
            await this.inputPassword.setValue('Admin123');
            await this.btnSubmit.click()
        }catch(e){
            // console.log(e)
        }
        return this
    }
}

exports.default = Owner