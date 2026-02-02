import Page from './page';

class storagePage extends Page{
    open () {
        return super.open('storage');
    }
}

export const StoragePage = new storagePage()