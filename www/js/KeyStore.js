import { Store, set, get, del, clear, keys } from 'idb-keyval';

const DB_NAME_PREFIX = 'mgv-datacache-';

class KeyStore {
    constructor (name) {
	try {
	    this.store = new Store(DB_NAME_PREFIX+name, name);
	    this.disabled = false;
	    console.log(`KeyStore: ${DB_NAME_PREFIX+name}`);
	}
	catch (err) {
	    this.store = null;
	    this.disabled = true;
	    this.nullP = Promise.resolve(null);
	    console.log(`KeyStore: error in constructor: ${err} \n Disabled.`)
	}
    }
    get (key) {
	if (this.disabled) 
	    return this.nullP;
        return get(key, this.store);
    }
    del (key) {
	if (this.disabled) 
	    return this.nullP;
        return del(key, this.store);
    }
    set (key, value) {
	if (this.disabled) 
	    return this.nullP;
        return set(key, value, this.store);
    }
    put (key, value) {
        return this.set(key, value);
    }
    keys () {
	if (this.disabled) 
	    return this.nullP;
        return keys(this.store);
    }
    contains (key) {
	if (this.disabled) 
	    return this.nullP;
        return this.get(key).then(x => x !== undefined);
    }
    clear () {
	if (this.disabled) 
	    return this.nullP;
        return clear(this.store);
    }
};

export { KeyStore };
