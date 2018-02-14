import { MGVApp } from './MGVApp';

// ---------------------------------------------
// ---------------------------------------------
function pqstring (qstring) {
    // FIXME: URLSearchParams API is not supported in all browsers. OK for development
    // but need a fallback eventually.
    let prms = new URLSearchParams(qstring);
    //
    let comps = new Set();
    let comps0 = prms.getAll("comps");
    comps0.forEach(c0 => {
        c0.split(/[, ]+/).forEach(c => c && comps.add(c));
    });
    //
    let hls = new Set();
    let hls0 = prms.getAll("highlight");
    hls0.forEach(h0 => {
        h0.split(/[, ]+/).forEach(h => h && hls.add(h));
    });
    //
    let cfg = {
	ref: prms.get("ref") || "C57BL/6J",
	comps: Array.from(comps),
	chr: prms.get("chr") || "1",
	start: parseInt(prms.get("start") || "1"),
	end: parseInt(prms.get("end") || "20000000"),
	highlight: Array.from(hls)
    };
    if (cfg.start > cfg.end) {
        let x = cfg.start; cfg.start = cfg.end; cfg.end = x;
    }
    return cfg;
}

// Behold, the MGV application object...
let mgv = null;

// The main program, wherein the app is created and wired to the browser. 
// ALL dependencies on the browser window are confined to this function.
//
function __main__ () {
    // Callback to pass into the app to register changes in context.
    // Uses the current app context to set the hash part of the
    // browser's location. This also registers the change in 
    // the browser history.
    function setHash () {
	// don't want to trigger an infinite loop here!
	// temporarily disable popstate handler
	let f = window.onpopstate;
	window.onpopstate = null;
	// now set the hash
	window.location.hash = mgv.getParamString();
	// re-enable
	window.onpopstate = f;
    }
    // Handler called when user clicks the browser's back or forward buttons.
    // Sets the app's context based on the hash part of the browser's
    // location.
    window.onpopstate = function(event) {
	let cfg = pqstring(document.location.hash.substring(1));
	mgv.setContext(cfg);
    };
    // get initial set of context params 
    let qstring = window.location.hash.substring(1);
    let cfg = pqstring(qstring);
    cfg.width = window.innerWidth;
    cfg.height= window.innerHeight;
    cfg.oncontextchange = setHash;

    // create the app
    mgv = new MGVApp(cfg);
    
    // handle resize events
    window.onresize = () => mgv.resize(window.innerWidth, window.innerHeight);
}


__main__();
