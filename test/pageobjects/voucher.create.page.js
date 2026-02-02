import Page from './page'
class CreateVoucher extends Page{
    open(){
        super.open('manage-voucher/create')
    }
}

const createvoucher = new CreateVoucher()
export default createvoucher