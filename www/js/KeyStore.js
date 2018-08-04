import { Store, set, get, del, clear, keys } from 'idb-keyval';

const DB_NAME_PREFIX = 'mgv-datacache-';

class KeyStore {
    constructor (name) {
        this.store = new Store(DB_NAME_PREFIX+name, name);
    }
    get (key) {
        return get(key, this.store);
    }
    del (key) {
        return del(key, this.store);
    }
    set (key, value) {
        return set(key, value, this.store);
    }
    keys () {
        return keys(this.store);
    }
    contains (key) {
        return this.get(key).then(x => x !== undefined);
    }
    clear () {
        return clear(this.store);
    }
};

export { KeyStore };
