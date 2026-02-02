import Page from './page'
class ManageUser extends Page{
    open(){
        super.open('manage-flavors')
        browser.waitUntil(() => $('.headline').getText() == 'Manage Instance',{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    }
}

const manageUser = new ManageUser()
export default manageUser