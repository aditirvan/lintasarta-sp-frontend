import LoginPage from  '../../pageobjects/login.page';
import { ObjectStoragePage } from '../../pageobjects/objectstorage.page'
describe('Open Object Storage Page', () => {
    it('should open object storage page', () => {
        LoginPage.open();

        LoginPage.login('arif2@gmail.com', 'arif2@gmail.com');
        ObjectStoragePage.open()
        browser.waitUntil(() => $('.headline').getText() == 'Object Storage',{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    });
});