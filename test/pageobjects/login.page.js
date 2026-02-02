import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputUsername () { return $('#username') }
    get inputPassword () { return $('#password') }
    get btnSubmit () { return $('#submit') }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */
    login (username = 'arif2@gmail.com', password = 'arif2@gmail.com') {
        this.inputUsername.setValue(username);
        this.inputPassword.setValue(password);
        this.btnSubmit.click(); 
        const fivesecond = new Date().getTime() + 5000
        
    }

    loginsuperadmin(){
        this.login('superadmin@lintasarta.id','superadmin@lintasarta.id')
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open('');
    }
}

export default new LoginPage();
