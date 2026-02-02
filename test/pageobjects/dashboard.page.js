import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class DashboardPage extends Page {
    /**
     * define selectors using getter methods
     */
    get JohnDoe () { return $('#JohnDoe') }
    get Organization () { return $('p=Organization') }
    get ListProject () { return $('.v-list-item__title=List Project') }
    get H3ListProject () { return $('h3=List Project') }
    get SidabarMenuInstance () { return $('.v-list-item__title=Instance')}
    open () {
        return super.open('');
    }
    clickOrganization () {
        this.Organization.click()
    }
}

export default new DashboardPage();
