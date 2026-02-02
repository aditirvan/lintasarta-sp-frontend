import Page from './page'
class ManageUser extends Page{
    open(){
        super.open('manage-user')
        browser.waitUntil(() => $('.headline').getText() == 'Manage User',{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    }
}

const manageUser = new ManageUser()
export default manageUser