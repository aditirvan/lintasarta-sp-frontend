import Page from './page'

class Instance extends Page{
    get CreateInstance (){ return $('.v-btn__content=Create Instance') }
    open(){
        return super.open('instance')
    }
}

export default new Instance()