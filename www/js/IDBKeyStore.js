
const DB_MODE_RO = 'readonly';
const DB_MODE_RW = 'readwrite';
const DB_MODE_VC = 'versionchange';

const DB_STORE = 'default';

// Wraps the IndexedDB database used for local data caching.
class IDBKeyStore {
    constructor (name, version) {
	this.name = name
	this.version = version
	this.db = null;
	this.isOpen = false;
	this.openDb();
    }
    openDb () {
	if (!window.indexedDB)
	    throw "IndexedDB is not supported in this browser.";
        let req = window.indexedDB.open(this.name, this.version);
	req.onsuccess = evt => {
	    this.db = evt.target.result;
	    this.isOpen = true;
	    console.log('IDBManager: opened database: ' + this.name);
	}
	req.onerror = evt => {
	    throw "Database error! " + evt.target.errorCode;
	}
	req.onupgradeneeded = evt => { this.makeDatabase(req, evt); };
    }
    makeDatabase (req, evt) {
	console.log(`IDBManager: upgrading ${this.name} to version 
	    ${evt.newVersion} from version ${evt.oldVersion}`);
	this.db = evt.target.result;
	if (evt.oldVersion < 1) {
	    this.db.createObjectStore(DB_STORE);
	}
	/*
	For future versions, follow this pattern:
	    if (evt.oldVersion < 2) {
	        // create new object stores, indexes
		// update existing stores
		// create new indexes, etc
		// e.g.
		let genomes_os = request.transaction.objectStore("genomes");
		let genome_lbl_index = genomes_os.createIndex("by_label", "label", {unique: true});


	    }
	    if (evt.oldVersion < 3) {
	    }
	    etc...
	*/
    }
    transaction (store, mode) {
        return this.db.transaction(store, mode).objectStore(store);
    }
    get (key) {
	return new Promise( (resolve, reject) => {
	    let os = this.transaction(DB_STORE, DB_MODE_RO);
	    let req = os.get(key);
	    req.onsuccess = evt => {
	        resolve(req.result);
	    };
	    req.onerror = evt => {
	        reject({evt, req});
	    };
	});
    }
    delete (key) {
	return new Promise( (resolve, reject) => {
	    let os = this.transaction(DB_STORE, DB_MODE_RW);
	    let req = os.delete(key);
	    req.onsuccess = evt => {
	        resolve(req.result);
	    };
	    req.onerror = evt => {
	        reject({evt, req});
	    };
	});
    }
    put (key, value) {
	return new Promise( (resolve, reject) => {
	    let os = this.transaction(DB_STORE, DB_MODE_RW);
	    let req = os.put(value, key);
	    req.onsuccess = evt => {
	        resolve(req.result);
	    };
	    req.onerror = evt => {
	        reject({evt, req});
	    };
	});
    }
    clear () {
	return new Promise( (resolve, reject) => {
	    let os = this.transaction(DB_STORE, DB_MODE_RW);
	    let req = os.clear();
	    req.onsuccess = evt => {
	        resolve(req.result);
	    };
	    req.onerror = evt => {
	        reject({evt, req});
	    };
	});
    }
};

export { IDBKeyStore };
