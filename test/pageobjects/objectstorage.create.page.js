import Page from './page';

class objectStorageCreatePage extends Page{
    open () {
        return super.open('object-storage/create');
    }
}

export const ObjectStorageCreatePage = new objectStorageCreatePage()