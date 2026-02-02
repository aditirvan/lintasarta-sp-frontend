import LoginPage from  '../../pageobjects/login.page';
import { StoragePage } from '../../pageobjects/storage.page'
describe('Open Storage Page', () => {
    it('should open storage page', () => {
        LoginPage.open();

        LoginPage.login();
        StoragePage.open()
        browser.waitUntil(() => $('.headline=Storage').getText() == 'Storage',{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
        browser.pause(5000)
    });
});