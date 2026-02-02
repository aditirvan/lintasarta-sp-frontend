import LoginPage from  '../pageobjects/login.page';
import DashboardPage from '../pageobjects/dashboard.page'

describe('My Login application', () => {
    it('should login with valid credentials', () => {
        LoginPage.open();

        LoginPage.login('superadmin@lintasarta.id', 'Superadmin123');
        expect(DashboardPage.JohnDoe).toBeExisting();
    });
});

// describe('List Project Menu', () => {
//     it('should open list project', () => {
//         browser.maximizeWindow()
//         DashboardPage.clickOrganization()
//         expect(DashboardPage.ListProject).toBeExisting()
//     });
// });

// describe('List Project Page', () => {
//     it('should open list project', () => {

//         DashboardPage.ListProject.click()
//         expect(DashboardPage.H3ListProject).toBeExisting()
//     });
// });

