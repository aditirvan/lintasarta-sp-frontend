import Page from './page';

class objectStoragePage extends Page{
    open () {
        return super.open('object-storage');
    }
}

export const ObjectStoragePage = new objectStoragePage()