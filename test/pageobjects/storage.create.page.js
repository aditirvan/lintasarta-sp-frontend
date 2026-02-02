import Page from './page';

class storagePage extends Page{
    open () {
        return super.open('storage/create');
    }
}

export const StorageCreatePage = new storagePage()