import Page from './page'
class Images extends Page{
    open(){
        super.open('image')
        browser.waitUntil(() => $('.headline').getText() == 'Image',{
            timeout: 5000,
            timeoutMsg: 'expected text to be different after 5s'
        })
    }
}

const images = new Images()
export default images