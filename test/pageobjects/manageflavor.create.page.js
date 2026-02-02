import Page from './page'
class ManageUser extends Page{
    open(){
        super.open('manage-flavors/create')
        browser.waitUntil(() => $('.headline').getText() == 'Create Package',{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    }
}

const manageUser = new ManageUser()
export default manageUser