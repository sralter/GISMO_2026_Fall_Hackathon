// \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t, t.exports), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = (n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n));
// node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/assert.js
function l(e, t) {
	if (!e) throw Error(t || "loader assertion failed.");
}
// node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/globals.js
var u = {
	self: typeof self < "u" && self,
	window: typeof window < "u" && window,
	global: typeof global < "u" && global,
	document: typeof document < "u" && document
};
u.self || u.window || u.global, u.window || u.self || u.global, u.global || u.self || u.window, u.document;
var d = !!(typeof process != "object" || String(process) !== "[object process]" || process.browser), f = typeof process < "u" && process.version && /v([0-9]*)/.exec(process.version);
f && parseFloat(f[1]);
// node_modules/@probe.gl/env/dist/lib/globals.js
var p = globalThis;
globalThis.document;
var m = globalThis.process || {};
globalThis.console;
var h = globalThis.navigator || {};
// node_modules/@probe.gl/env/dist/lib/is-electron.js
function g(e) {
	if (typeof window < "u" && window.process?.type === "renderer" || typeof process < "u" && process.versions?.electron) return !0;
	let t = typeof navigator < "u" && navigator.userAgent, n = e || t;
	return !!(n && n.indexOf("Electron") >= 0);
}
// node_modules/@probe.gl/env/dist/lib/is-browser.js
function _() {
	return !(typeof process == "object" && String(process) === "[object process]" && !process?.browser) || g();
}
// node_modules/@probe.gl/env/dist/lib/get-browser.js
function v(e) {
	return !e && !_() ? "Node" : g(e) ? "Electron" : (e || h.userAgent || "").indexOf("Edge") > -1 ? "Edge" : globalThis.chrome ? "Chrome" : globalThis.safari ? "Safari" : globalThis.mozInnerScreenX ? "Firefox" : "Unknown";
}
// node_modules/@probe.gl/env/dist/index.js
var y = "4.1.2";
// node_modules/@probe.gl/log/dist/utils/assert.js
function b(e, t) {
	if (!e) throw Error(t || "Assertion failed");
}
// node_modules/@probe.gl/log/dist/loggers/log-utils.js
function x(e) {
	if (!e) return 0;
	let t;
	switch (typeof e) {
		case "number":
			t = e;
			break;
		case "object":
			t = e.logLevel || e.priority || 0;
			break;
		default: return 0;
	}
	return b(Number.isFinite(t) && t >= 0), t;
}
function S(e) {
	let { logLevel: t, message: n } = e;
	e.logLevel = x(t);
	let r = e.args ? Array.from(e.args) : [];
	for (; r.length && r.shift() !== n;);
	switch (typeof t) {
		case "string":
		case "function":
			n !== void 0 && r.unshift(n), e.message = t;
			break;
		case "object": Object.assign(e, t);
	}
	typeof e.message == "function" && (e.message = e.message());
	let i = typeof e.message;
	return b(i === "string" || i === "object"), Object.assign(e, { args: r }, e.opts);
}
// node_modules/@probe.gl/log/dist/loggers/base-log.js
var C = () => {}, w = class {
	constructor({ level: e = 0 } = {}) {
		this.userData = {}, this._onceCache = /* @__PURE__ */ new Set(), this._level = e;
	}
	set level(e) {
		this.setLevel(e);
	}
	get level() {
		return this.getLevel();
	}
	setLevel(e) {
		return this._level = e, this;
	}
	getLevel() {
		return this._level;
	}
	warn(e, ...t) {
		return this._log("warn", 0, e, t, { once: !0 });
	}
	error(e, ...t) {
		return this._log("error", 0, e, t);
	}
	log(e, t, ...n) {
		return this._log("log", e, t, n);
	}
	info(e, t, ...n) {
		return this._log("info", e, t, n);
	}
	once(e, t, ...n) {
		return this._log("once", e, t, n, { once: !0 });
	}
	_log(e, t, n, r, i = {}) {
		let a = S({
			logLevel: t,
			message: n,
			args: this._buildArgs(t, n, r),
			opts: i
		});
		return this._createLogFunction(e, a, i);
	}
	_buildArgs(e, t, n) {
		return [
			e,
			t,
			...n
		];
	}
	_createLogFunction(e, t, n) {
		if (!this._shouldLog(t.logLevel)) return C;
		let r = this._getOnceTag(n.tag ?? t.tag ?? t.message);
		if ((n.once || t.once) && r !== void 0) {
			if (this._onceCache.has(r)) return C;
			this._onceCache.add(r);
		}
		return this._emit(e, t);
	}
	_shouldLog(e) {
		return this.getLevel() >= x(e);
	}
	_getOnceTag(e) {
		if (e !== void 0) try {
			return typeof e == "string" ? e : String(e);
		} catch {
			return;
		}
	}
};
// node_modules/@probe.gl/log/dist/utils/local-storage.js
function ee(e) {
	try {
		let t = window[e], n = "__storage_test__";
		return t.setItem(n, n), t.removeItem(n), t;
	} catch {
		return null;
	}
}
var te = class {
	constructor(e, t, n = "sessionStorage") {
		this.storage = ee(n), this.id = e, this.config = t, this._loadConfiguration();
	}
	getConfiguration() {
		return this.config;
	}
	setConfiguration(e) {
		if (Object.assign(this.config, e), this.storage) {
			let e = JSON.stringify(this.config);
			this.storage.setItem(this.id, e);
		}
	}
	_loadConfiguration() {
		let e = {};
		if (this.storage) {
			let t = this.storage.getItem(this.id);
			e = t ? JSON.parse(t) : {};
		}
		return Object.assign(this.config, e), this;
	}
};
// node_modules/@probe.gl/log/dist/utils/formatters.js
function ne(e) {
	let t;
	return t = e < 10 ? `${e.toFixed(2)}ms` : e < 100 ? `${e.toFixed(1)}ms` : e < 1e3 ? `${e.toFixed(0)}ms` : `${(e / 1e3).toFixed(2)}s`, t;
}
function re(e, t = 8) {
	let n = Math.max(t - e.length, 0);
	return `${" ".repeat(n)}${e}`;
}
// node_modules/@probe.gl/log/dist/utils/color.js
var ie;
(function(e) {
	e[e.BLACK = 30] = "BLACK", e[e.RED = 31] = "RED", e[e.GREEN = 32] = "GREEN", e[e.YELLOW = 33] = "YELLOW", e[e.BLUE = 34] = "BLUE", e[e.MAGENTA = 35] = "MAGENTA", e[e.CYAN = 36] = "CYAN", e[e.WHITE = 37] = "WHITE", e[e.BRIGHT_BLACK = 90] = "BRIGHT_BLACK", e[e.BRIGHT_RED = 91] = "BRIGHT_RED", e[e.BRIGHT_GREEN = 92] = "BRIGHT_GREEN", e[e.BRIGHT_YELLOW = 93] = "BRIGHT_YELLOW", e[e.BRIGHT_BLUE = 94] = "BRIGHT_BLUE", e[e.BRIGHT_MAGENTA = 95] = "BRIGHT_MAGENTA", e[e.BRIGHT_CYAN = 96] = "BRIGHT_CYAN", e[e.BRIGHT_WHITE = 97] = "BRIGHT_WHITE";
})(ie ||= {});
var T = 10;
function ae(e) {
	return typeof e == "string" ? (e = e.toUpperCase(), ie[e] || ie.WHITE) : e;
}
function oe(e, t, n) {
	return !_ && typeof e == "string" && (t && (e = `\u001b[${ae(t)}m${e}\u001b[39m`), n && (e = `\u001b[${ae(n) + T}m${e}\u001b[49m`)), e;
}
// node_modules/@probe.gl/log/dist/utils/autobind.js
function se(e, t = ["constructor"]) {
	let n = Object.getPrototypeOf(e), r = Object.getOwnPropertyNames(n), i = e;
	for (let n of r) {
		let r = i[n];
		typeof r == "function" && (t.find((e) => n === e) || (i[n] = r.bind(e)));
	}
}
// node_modules/@probe.gl/log/dist/probe.js
var ce = class {
	getHighResolutionTimer() {
		let e;
		if (_() && p.performance) e = p?.performance?.now?.();
		else if ("hrtime" in m) {
			let t = m?.hrtime?.();
			e = t[0] * 1e3 + t[1] / 1e6;
		} else e = Date.now();
		return e;
	}
	getMemoryUsageMB() {
		let e = (p?.performance)?.memory?.usedJSHeapSize;
		return e == null ? null : Math.trunc(e / 1024 / 1024);
	}
}, le = new ce();
globalThis.Probe = ce, globalThis.probe = le;
// node_modules/@probe.gl/log/dist/loggers/probe-log.js
var ue = {
	debug: _() && console.debug || console.log,
	log: console.log,
	info: console.info,
	warn: console.warn,
	error: console.error
}, de = {
	enabled: !0,
	level: 0
}, fe = class extends w {
	constructor({ id: e } = { id: "" }) {
		super({ level: 0 }), this.VERSION = y, this._startTs = le.getHighResolutionTimer(), this._deltaTs = le.getHighResolutionTimer(), this.userData = {}, this.LOG_THROTTLE_TIMEOUT = 0, this.id = e, this.userData = {}, this._storage = new te(`__probe-${this.id}__`, { [this.id]: de }), this.timeStamp(`${this.id} started`), se(this), Object.seal(this);
	}
	isEnabled() {
		return this._getConfiguration().enabled;
	}
	getLevel() {
		return this._getConfiguration().level;
	}
	getTotal() {
		return Number((le.getHighResolutionTimer() - this._startTs).toPrecision(10));
	}
	getDelta() {
		return Number((le.getHighResolutionTimer() - this._deltaTs).toPrecision(10));
	}
	set priority(e) {
		this.level = e;
	}
	get priority() {
		return this.level;
	}
	getPriority() {
		return this.level;
	}
	enable(e = !0) {
		return this._updateConfiguration({ enabled: e }), this;
	}
	setLevel(e) {
		return this._updateConfiguration({ level: e }), this;
	}
	get(e) {
		return this._getConfiguration()[e];
	}
	set(e, t) {
		this._updateConfiguration({ [e]: t });
	}
	settings() {}
	assert(e, t) {
		if (!e) throw Error(t || "Assertion failed");
	}
	warn(e, ...t) {
		return this._log("warn", 0, e, t, {
			method: ue.warn,
			once: !0
		});
	}
	error(e, ...t) {
		return this._log("error", 0, e, t, { method: ue.error });
	}
	deprecated(e, t) {
		return this.warn(`\`${e}\` is deprecated and will be removed \
in a later version. Use \`${t}\` instead`);
	}
	removed(e, t) {
		return this.error(`\`${e}\` has been removed. Use \`${t}\` instead`);
	}
	probe(e, t, ...n) {
		let r = le.getMemoryUsageMB();
		if (r !== null) {
			let e = `${r}MB `;
			typeof t == "function" ? t = () => `${e}${t()}` : typeof t == "string" && (t = `${e}${t}`);
		}
		return this._log("log", e, t, n, {
			method: ue.log,
			time: !0,
			once: !0
		});
	}
	log(e, t, ...n) {
		return this._log("log", e, t, n, { method: ue.debug });
	}
	info(e, t, ...n) {
		return this._log("info", e, t, n, { method: console.info });
	}
	once(e, t, ...n) {
		return this._log("once", e, t, n, {
			method: ue.debug || ue.info,
			once: !0
		});
	}
	table(e, t, n) {
		return t ? this._log("table", e, t, n && [n] || [], {
			method: console.table || C,
			tag: me(t)
		}) : C;
	}
	time(e, t) {
		return this._log("time", e, t, [], { method: console.time ? console.time : console.info });
	}
	timeEnd(e, t) {
		return this._log("time", e, t, [], { method: console.timeEnd ? console.timeEnd : console.info });
	}
	timeStamp(e, t) {
		return this._log("time", e, t, [], { method: console.timeStamp || C });
	}
	group(e, t, n = { collapsed: !1 }) {
		let r = (n.collapsed ? console.groupCollapsed : console.group) || console.info;
		return this._log("group", e, t, [], { method: r });
	}
	groupCollapsed(e, t, n = {}) {
		return this.group(e, t, Object.assign({}, n, { collapsed: !0 }));
	}
	groupEnd(e) {
		return this._log("groupEnd", e, "", [], { method: console.groupEnd || C });
	}
	withGroup(e, t, n) {
		this.group(e, t)();
		try {
			n();
		} finally {
			this.groupEnd(e)();
		}
	}
	trace() {}
	_shouldLog(e) {
		return this.isEnabled() && super._shouldLog(e);
	}
	_emit(e, t) {
		let n = t.method;
		b(n), t.total = this.getTotal(), t.delta = this.getDelta(), this._deltaTs = le.getHighResolutionTimer();
		let r = pe(this.id, t.message, t);
		return n.bind(console, r, ...t.args);
	}
	_getConfiguration() {
		return this._storage.config[this.id] || this._updateConfiguration(de), this._storage.config[this.id];
	}
	_updateConfiguration(e) {
		let t = this._storage.config[this.id] || { ...de };
		this._storage.setConfiguration({ [this.id]: {
			...t,
			...e
		} });
	}
};
fe.VERSION = y;
function pe(e, t, n) {
	if (typeof t == "string") {
		let r = n.time ? re(ne(n.total)) : "";
		t = n.time ? `${e}: ${r}  ${t}` : `${e}: ${t}`, t = oe(t, n.color, n.background);
	}
	return t;
}
function me(e) {
	for (let t in e) for (let n in e[t]) return n || "untitled";
	return "empty";
}
var he = "v4.5.4";
function ge() {
	let e = new fe({ id: "loaders.gl" });
	return globalThis.loaders ||= {}, globalThis.loaders.log = e, globalThis.loaders.version = he, globalThis.probe ||= {}, globalThis.probe.loaders = e, e;
}
var _e = ge(), ve = (e) => typeof e == "boolean", ye = (e) => typeof e == "function", be = (e) => typeof e == "object" && !!e, xe = (e) => be(e) && e.constructor === {}.constructor, Se = (e) => typeof SharedArrayBuffer < "u" && e instanceof SharedArrayBuffer, Ce = (e) => be(e) && typeof e.byteLength == "number" && typeof e.slice == "function", we = (e) => !!e && ye(e[Symbol.iterator]), Te = (e) => !!e && ye(e[Symbol.asyncIterator]), Ee = (e) => typeof Response < "u" && e instanceof Response || be(e) && ye(e.arrayBuffer) && ye(e.text) && ye(e.json), De = (e) => typeof Blob < "u" && e instanceof Blob, Oe = (e) => typeof ReadableStream < "u" && e instanceof ReadableStream || be(e) && ye(e.tee) && ye(e.cancel) && ye(e.getReader), ke = (e) => be(e) && ye(e.read) && ye(e.pipe) && ve(e.readable), Ae = (e) => Oe(e) || ke(e);
// node_modules/@loaders.gl/loader-utils/dist/lib/option-utils/merge-options.js
function je(e, t) {
	return Me(e || {}, t);
}
function Me(e, t, n = 0) {
	if (n > 3) return t;
	let r = { ...e };
	for (let [e, i] of Object.entries(t)) r[e] = i && typeof i == "object" && !Array.isArray(i) ? Me(r[e] || {}, t[e], n + 1) : t[e];
	return r;
}
// node_modules/@loaders.gl/worker-utils/dist/lib/npm-tag.js
var Ne = "latest";
// node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/version.js
function Pe() {
	return globalThis._loadersgl_?.version || (globalThis._loadersgl_ = globalThis._loadersgl_ || {}, globalThis._loadersgl_.version = "4.5.4"), globalThis._loadersgl_.version;
}
var Fe = Pe();
// node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js
function Ie(e, t) {
	if (!e) throw Error(t || "loaders.gl assertion failed.");
}
// node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js
var Le = {
	self: typeof self < "u" && self,
	window: typeof window < "u" && window,
	global: typeof global < "u" && global,
	document: typeof document < "u" && document
};
Le.self || Le.window || Le.global, Le.window || Le.self || Le.global, Le.global || Le.self || Le.window, Le.document;
var Re = typeof process != "object" || String(process) !== "[object process]" || process.browser, ze = typeof window < "u" && window.orientation !== void 0, Be = typeof process < "u" && process.version && /v([0-9]*)/.exec(process.version);
Be && parseFloat(Be[1]);
// node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-job.js
var Ve = class {
	name;
	workerThread;
	isRunning = !0;
	result;
	_resolve = () => {};
	_reject = () => {};
	constructor(e, t) {
		this.name = e, this.workerThread = t, this.result = new Promise((e, t) => {
			this._resolve = e, this._reject = t;
		});
	}
	postMessage(e, t) {
		this.workerThread.postMessage({
			source: "loaders.gl",
			type: e,
			payload: t
		});
	}
	done(e) {
		Ie(this.isRunning), this.isRunning = !1, this._resolve(e);
	}
	error(e) {
		Ie(this.isRunning), this.isRunning = !1, this._reject(e);
	}
}, He = class {
	terminate() {}
}, Ue = /* @__PURE__ */ new Map();
function We(e) {
	Ie(e.source && !e.url || !e.source && e.url);
	let t = Ue.get(e.source || e.url);
	return t || (e.url && (t = Ge(e.url), Ue.set(e.url, t)), e.source && (t = Ke(e.source), Ue.set(e.source, t))), Ie(t), t;
}
function Ge(e) {
	return e.startsWith("http") ? Ke(qe(e)) : e;
}
function Ke(e) {
	let t = new Blob([e], { type: "application/javascript" });
	return URL.createObjectURL(t);
}
function qe(e) {
	return `\
try {
  importScripts('${e}');
} catch (error) {
  console.error(error);
  throw error;
}`;
}
// node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-transfer-list.js
function Je(e, t = !0, n) {
	let r = n || /* @__PURE__ */ new Set();
	if (e) {
		if (Ye(e)) r.add(e);
		else if (Ye(e.buffer)) r.add(e.buffer);
		else if (!ArrayBuffer.isView(e) && t && typeof e == "object") for (let n in e) Je(e[n], t, r);
	}
	return n === void 0 ? Array.from(r) : [];
}
function Ye(e) {
	return e ? e instanceof ArrayBuffer || typeof MessagePort < "u" && e instanceof MessagePort || typeof ImageBitmap < "u" && e instanceof ImageBitmap || typeof OffscreenCanvas < "u" && e instanceof OffscreenCanvas : !1;
}
// node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-thread.js
var Xe = () => {}, Ze = class {
	name;
	source;
	url;
	terminated = !1;
	worker;
	onMessage;
	onError;
	_loadableURL = "";
	static isSupported() {
		return typeof Worker < "u" && Re || He !== void 0 && !Re;
	}
	constructor(e) {
		let { name: t, source: n, url: r } = e;
		Ie(n || r), this.name = t, this.source = n, this.url = r, this.onMessage = Xe, this.onError = (e) => void 0, this.worker = Re ? this._createBrowserWorker() : this._createNodeWorker();
	}
	destroy() {
		this.onMessage = Xe, this.onError = Xe, this.worker.terminate(), this.terminated = !0;
	}
	get isRunning() {
		return !!this.onMessage;
	}
	postMessage(e, t) {
		t ||= Je(e), this.worker.postMessage(e, t);
	}
	_getErrorFromErrorEvent(e) {
		let t = "Failed to load ";
		return t += `worker ${this.name} from ${this.url}. `, e.message && (t += `${e.message} in `), e.lineno && (t += `:${e.lineno}:${e.colno}`), Error(t);
	}
	_createBrowserWorker() {
		this._loadableURL = We({
			source: this.source,
			url: this.url
		});
		let e = new Worker(this._loadableURL, { name: this.name });
		return e.onmessage = (e) => {
			e.data ? this.onMessage(e.data) : this.onError(/* @__PURE__ */ Error("No data received"));
		}, e.onerror = (e) => {
			this.onError(this._getErrorFromErrorEvent(e)), this.terminated = !0;
		}, e.onmessageerror = (e) => void 0, e;
	}
	_createNodeWorker() {
		let e;
		if (this.url) e = new He(this.url.includes(":/") || this.url.startsWith("/") ? this.url : `./${this.url}`, {
			eval: !1,
			type: this.url.endsWith(".ts") || this.url.endsWith(".mjs") ? "module" : "commonjs"
		});
		else if (this.source) e = new He(this.source, { eval: !0 });
		else throw Error("no worker");
		return e.on("message", (e) => {
			this.onMessage(e);
		}), e.on("error", (e) => {
			this.onError(e);
		}), e.on("exit", (e) => {}), e;
	}
}, Qe = class {
	name = "unnamed";
	source;
	url;
	maxConcurrency = 1;
	maxMobileConcurrency = 1;
	onDebug = () => {};
	reuseWorkers = !0;
	props = {};
	jobQueue = [];
	idleQueue = [];
	count = 0;
	isDestroyed = !1;
	static isSupported() {
		return Ze.isSupported();
	}
	constructor(e) {
		this.source = e.source, this.url = e.url, this.setProps(e);
	}
	destroy() {
		this.idleQueue.forEach((e) => e.destroy()), this.isDestroyed = !0;
	}
	setProps(e) {
		this.props = {
			...this.props,
			...e
		}, e.name !== void 0 && (this.name = e.name), e.maxConcurrency !== void 0 && (this.maxConcurrency = e.maxConcurrency), e.maxMobileConcurrency !== void 0 && (this.maxMobileConcurrency = e.maxMobileConcurrency), e.reuseWorkers !== void 0 && (this.reuseWorkers = e.reuseWorkers), e.onDebug !== void 0 && (this.onDebug = e.onDebug);
	}
	async startJob(e, t = (e, t, n) => e.done(n), n = (e, t) => e.error(t)) {
		let r = new Promise((r) => (this.jobQueue.push({
			name: e,
			onMessage: t,
			onError: n,
			onStart: r
		}), this));
		return this._startQueuedJob(), await r;
	}
	async _startQueuedJob() {
		if (!this.jobQueue.length) return;
		let e = this._getAvailableWorker();
		if (!e) return;
		let t = this.jobQueue.shift();
		if (t) {
			this.onDebug({
				message: "Starting job",
				name: t.name,
				workerThread: e,
				backlog: this.jobQueue.length
			});
			let n = new Ve(t.name, e);
			e.onMessage = (e) => t.onMessage(n, e.type, e.payload), e.onError = (e) => t.onError(n, e), t.onStart(n);
			try {
				await n.result;
			} catch {} finally {
				this.returnWorkerToQueue(e);
			}
		}
	}
	returnWorkerToQueue(e) {
		!Re || this.isDestroyed || !this.reuseWorkers || this.count > this._getMaxConcurrency() ? (e.destroy(), this.count--) : this.idleQueue.push(e), this.isDestroyed || this._startQueuedJob();
	}
	_getAvailableWorker() {
		return this.idleQueue.length > 0 ? this.idleQueue.shift() || null : this.count < this._getMaxConcurrency() ? (this.count++, new Ze({
			name: `${this.name.toLowerCase()} (#${this.count} of ${this.maxConcurrency})`,
			source: this.source,
			url: this.url
		})) : null;
	}
	_getMaxConcurrency() {
		return ze ? this.maxMobileConcurrency : this.maxConcurrency;
	}
}, $e = {
	maxConcurrency: 3,
	maxMobileConcurrency: 1,
	reuseWorkers: !0,
	onDebug: () => {}
}, et = class e {
	props;
	workerPools = /* @__PURE__ */ new Map();
	static _workerFarm;
	static isSupported() {
		return Ze.isSupported();
	}
	static getWorkerFarm(t = {}) {
		return e._workerFarm = e._workerFarm || new e({}), e._workerFarm.setProps(t), e._workerFarm;
	}
	constructor(e) {
		this.props = { ...$e }, this.setProps(e), this.workerPools = /* @__PURE__ */ new Map();
	}
	destroy() {
		for (let e of this.workerPools.values()) e.destroy();
		this.workerPools = /* @__PURE__ */ new Map();
	}
	setProps(e) {
		this.props = {
			...this.props,
			...e
		};
		for (let e of this.workerPools.values()) e.setProps(this._getWorkerPoolProps());
	}
	getWorkerPool(e) {
		let { name: t, source: n, url: r } = e, i = this.workerPools.get(t);
		return i || (i = new Qe({
			name: t,
			source: n,
			url: r
		}), i.setProps(this._getWorkerPoolProps()), this.workerPools.set(t, i)), i;
	}
	_getWorkerPoolProps() {
		return {
			maxConcurrency: this.props.maxConcurrency,
			maxMobileConcurrency: this.props.maxMobileConcurrency,
			reuseWorkers: this.props.reuseWorkers,
			onDebug: this.props.onDebug
		};
	}
};
// node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/get-worker-url.js
function tt(e, t = {}) {
	let n = t[e.id] || {}, r = Re ? e.workerFile || `${e.id}-worker.js` : `${e.id}-worker-node.js`, i = n.workerUrl;
	if (!i && e.id === "compression" && (i = t.workerUrl), (t._workerType || t?.core?._workerType) === "test" && (i = Re ? `modules/${e.module}/dist/${r}` : `modules/${e.module}/src/workers/${e.id}-worker-node.ts`), !i) {
		let t = e.version;
		t === "latest" && (t = Ne);
		let n = t ? `@${t}` : "";
		i = `https://unpkg.com/@loaders.gl/${e.module}${n}/dist/${r}`;
	}
	return Ie(i), i;
}
// node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/validate-worker-version.js
function nt(e, t = Fe) {
	Ie(e, "no worker provided");
	let n = e.version;
	return !(!t || !n);
}
// node_modules/@loaders.gl/loader-utils/dist/lib/worker-loader-utils/parse-with-worker.js
function rt(e, t) {
	if (!et.isSupported()) return !1;
	let n = t?._nodeWorkers ?? t?.core?._nodeWorkers;
	if (!Re && !n) return !1;
	let r = t?.worker ?? t?.core?.worker;
	return !!(e.worker && r);
}
async function it(e, t, n, r, i) {
	let a = e.id, o = tt(e, n), s = et.getWorkerFarm(n?.core).getWorkerPool({
		name: a,
		url: o
	});
	n = JSON.parse(JSON.stringify(n || {})), n._workerLoaderId = e.id, r = JSON.parse(JSON.stringify(r || {}));
	let c = await s.startJob("process-on-worker", at.bind(null, i));
	return c.postMessage("process", {
		input: t,
		options: n,
		context: r
	}), await (await c.result).result;
}
async function at(e, t, n, r) {
	switch (n) {
		case "done":
			t.done(r);
			break;
		case "error":
			t.error(Error(r.error));
			break;
		case "process":
			let { id: n, input: i, options: a } = r;
			try {
				let r = await e(i, a);
				t.postMessage("done", {
					id: n,
					result: r
				});
			} catch (e) {
				let r = e instanceof Error ? e.message : "unknown error";
				t.postMessage("error", {
					id: n,
					error: r
				});
			}
	}
}
// node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/array-buffer-utils.js
function ot(e, t, n) {
	if (n ||= e.byteLength, e.byteLength < n || t.byteLength < n) return !1;
	let r = new Uint8Array(e), i = new Uint8Array(t);
	for (let e = 0; e < r.length; ++e) if (r[e] !== i[e]) return !1;
	return !0;
}
function st(...e) {
	return ct(e);
}
function ct(e) {
	let t = e.map((e) => e instanceof ArrayBuffer ? new Uint8Array(e) : e), n = t.reduce((e, t) => e + t.byteLength, 0), r = new Uint8Array(n), i = 0;
	for (let e of t) r.set(e, i), i += e.byteLength;
	return r.buffer;
}
// node_modules/@loaders.gl/loader-utils/dist/lib/iterators/async-iteration.js
async function lt(e) {
	let t = [];
	for await (let n of e) t.push(ut(n));
	return st(...t);
}
function ut(e) {
	if (e instanceof ArrayBuffer) return e;
	if (ArrayBuffer.isView(e)) {
		let { buffer: t, byteOffset: n, byteLength: r } = e;
		return dt(t, n, r);
	}
	return dt(e);
}
function dt(e, t = 0, n = e.byteLength - t) {
	let r = new Uint8Array(e, t, n), i = new Uint8Array(r.length);
	return i.set(r), i.buffer;
}
// node_modules/@probe.gl/stats/dist/utils/hi-res-timestamp.js
function ft() {
	let e;
	if (typeof window < "u" && window.performance) e = window.performance.now();
	else if (typeof process < "u" && process.hrtime) {
		let t = process.hrtime();
		e = t[0] * 1e3 + t[1] / 1e6;
	} else e = Date.now();
	return e;
}
// node_modules/@probe.gl/stats/dist/lib/stat.js
var pt = class {
	constructor(e, t) {
		this.sampleSize = 1, this.time = 0, this.count = 0, this.samples = 0, this.lastTiming = 0, this.lastSampleTime = 0, this.lastSampleCount = 0, this._count = 0, this._time = 0, this._samples = 0, this._startTime = 0, this._timerPending = !1, this.name = e, this.type = t, this.reset();
	}
	reset() {
		return this.time = 0, this.count = 0, this.samples = 0, this.lastTiming = 0, this.lastSampleTime = 0, this.lastSampleCount = 0, this._count = 0, this._time = 0, this._samples = 0, this._startTime = 0, this._timerPending = !1, this;
	}
	setSampleSize(e) {
		return this.sampleSize = e, this;
	}
	incrementCount() {
		return this.addCount(1), this;
	}
	decrementCount() {
		return this.subtractCount(1), this;
	}
	addCount(e) {
		return this._count += e, this._samples++, this._checkSampling(), this;
	}
	subtractCount(e) {
		return this._count -= e, this._samples++, this._checkSampling(), this;
	}
	addTime(e) {
		return this._time += e, this.lastTiming = e, this._samples++, this._checkSampling(), this;
	}
	timeStart() {
		return this._startTime = ft(), this._timerPending = !0, this;
	}
	timeEnd() {
		return this._timerPending && (this.addTime(ft() - this._startTime), this._timerPending = !1, this._checkSampling()), this;
	}
	getSampleAverageCount() {
		return this.sampleSize > 0 ? this.lastSampleCount / this.sampleSize : 0;
	}
	getSampleAverageTime() {
		return this.sampleSize > 0 ? this.lastSampleTime / this.sampleSize : 0;
	}
	getSampleHz() {
		return this.lastSampleTime > 0 ? this.sampleSize / (this.lastSampleTime / 1e3) : 0;
	}
	getAverageCount() {
		return this.samples > 0 ? this.count / this.samples : 0;
	}
	getAverageTime() {
		return this.samples > 0 ? this.time / this.samples : 0;
	}
	getHz() {
		return this.time > 0 ? this.samples / (this.time / 1e3) : 0;
	}
	_checkSampling() {
		this._samples === this.sampleSize && (this.lastSampleTime = this._time, this.lastSampleCount = this._count, this.count += this._count, this.time += this._time, this.samples += this._samples, this._time = 0, this._count = 0, this._samples = 0);
	}
}, mt = class {
	constructor(e) {
		this.stats = {}, this.id = e.id, this.stats = {}, this._initializeStats(e.stats), Object.seal(this);
	}
	get(e, t = "count") {
		return this._getOrCreate({
			name: e,
			type: t
		});
	}
	get size() {
		return Object.keys(this.stats).length;
	}
	reset() {
		for (let e of Object.values(this.stats)) e.reset();
		return this;
	}
	forEach(e) {
		for (let t of Object.values(this.stats)) e(t);
	}
	getTable() {
		let e = {};
		return this.forEach((t) => {
			e[t.name] = {
				time: t.time || 0,
				count: t.count || 0,
				average: t.getAverageTime() || 0,
				hz: t.getHz() || 0
			};
		}), e;
	}
	_initializeStats(e = []) {
		e.forEach((e) => this._getOrCreate(e));
	}
	_getOrCreate(e) {
		let { name: t, type: n } = e, r = this.stats[t];
		return r || (r = e instanceof pt ? e : new pt(t, n), this.stats[t] = r), r;
	}
}, ht = "", gt = {};
function _t(e) {
	for (let t in gt) if (e.startsWith(t)) {
		let n = gt[t];
		e = e.replace(t, n);
	}
	return !e.startsWith("http://") && !e.startsWith("https://") && (e = `${ht}${e}`), e;
}
// node_modules/@loaders.gl/loader-utils/dist/lib/node/buffer.browser.js
function vt(e) {
	return e;
}
// node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-conversion-utils.js
function yt(e) {
	return e && typeof e == "object" && e.isBuffer;
}
function bt(e) {
	if (yt(e)) return vt(e);
	if (e instanceof ArrayBuffer) return e;
	if (Se(e)) return St(e);
	if (ArrayBuffer.isView(e)) {
		let t = e.buffer;
		return e.byteOffset === 0 && e.byteLength === e.buffer.byteLength ? t : t.slice(e.byteOffset, e.byteOffset + e.byteLength);
	}
	if (typeof e == "string") {
		let t = e;
		return new TextEncoder().encode(t).buffer;
	}
	if (e && typeof e == "object" && e._toArrayBuffer) return e._toArrayBuffer();
	throw Error("toArrayBuffer");
}
function xt(e) {
	if (e instanceof ArrayBuffer) return e;
	if (Se(e)) return St(e);
	let { buffer: t, byteOffset: n, byteLength: r } = e;
	return t instanceof ArrayBuffer && n === 0 && r === t.byteLength ? t : St(t, n, r);
}
function St(e, t = 0, n = e.byteLength - t) {
	let r = new Uint8Array(e, t, n), i = new Uint8Array(r.length);
	return i.set(r), i.buffer;
}
function Ct(e) {
	return ArrayBuffer.isView(e) ? e : new Uint8Array(e);
}
// node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/path.js
function wt(e) {
	let t = e ? e.lastIndexOf("/") : -1;
	return t >= 0 ? e.substr(t + 1) : e;
}
function Tt(e) {
	let t = e ? e.lastIndexOf("/") : -1;
	return t >= 0 ? e.substr(0, t) : "";
}
// node_modules/@loaders.gl/core/dist/lib/fetch/fetch-error.js
var Et = class extends Error {
	constructor(e, t) {
		super(e), this.reason = t.reason, this.url = t.url, this.response = t.response;
	}
	reason;
	url;
	response;
}, Dt = /^data:([-\w.]+\/[-\w.+]+)(;|,)/, Ot = /^([-\w.]+\/[-\w.+]+)/;
function kt(e, t) {
	return e.toLowerCase() === t.toLowerCase();
}
function At(e) {
	let t = Ot.exec(e);
	return t ? t[1] : e;
}
function jt(e) {
	let t = Dt.exec(e);
	return t ? t[1] : "";
}
// node_modules/@loaders.gl/core/dist/lib/utils/url-utils.js
var Mt = /\?.*/;
function Nt(e) {
	let t = e.match(Mt);
	return t && t[0];
}
function Pt(e) {
	return e.replace(Mt, "");
}
function Ft(e) {
	if (e.length < 50) return e;
	let t = e.slice(e.length - 15);
	return `${e.substr(0, 32)}...${t}`;
}
// node_modules/@loaders.gl/core/dist/lib/utils/resource-utils.js
function It(e) {
	return Ee(e) ? e.url : De(e) ? ("name" in e ? e.name : "") || "" : typeof e == "string" ? e : "";
}
function Lt(e) {
	if (Ee(e)) {
		let t = e.headers.get("content-type") || "", n = Pt(e.url);
		return At(t) || jt(n);
	}
	return De(e) ? e.type || "" : typeof e == "string" ? jt(e) : "";
}
function Rt(e) {
	return Ee(e) ? e.headers["content-length"] || -1 : De(e) ? e.size : typeof e == "string" ? e.length : e instanceof ArrayBuffer || ArrayBuffer.isView(e) ? e.byteLength : -1;
}
// node_modules/@loaders.gl/core/dist/lib/utils/response-utils.js
async function zt(e) {
	if (Ee(e)) return e;
	let t = {}, n = Rt(e);
	n >= 0 && (t["content-length"] = String(n));
	let r = It(e), i = Lt(e);
	i && (t["content-type"] = i);
	let a = await Ht(e);
	a && (t["x-first-bytes"] = a), typeof e == "string" && (e = new TextEncoder().encode(e));
	let o = new Response(e, { headers: t });
	return Object.defineProperty(o, "url", { value: r }), o;
}
async function Bt(e) {
	if (!e.ok) throw await Vt(e);
}
async function Vt(e) {
	let t = Ft(e.url), n = `Failed to fetch resource (${e.status}) ${e.statusText}: ${t}`;
	n = n.length > 100 ? `${n.slice(0, 100)}...` : n;
	let r = {
		reason: e.statusText,
		url: e.url,
		response: e
	};
	try {
		let t = e.headers.get("Content-Type");
		r.reason = !e.bodyUsed && t?.includes("application/json") ? await e.json() : await e.text();
	} catch {}
	return new Et(n, r);
}
async function Ht(e) {
	if (typeof e == "string") return `data:,${e.slice(0, 5)}`;
	if (e instanceof Blob) {
		let t = e.slice(0, 5);
		return await new Promise((e) => {
			let n = new FileReader();
			n.onload = (t) => e(t?.target?.result), n.readAsDataURL(t);
		});
	}
	return e instanceof ArrayBuffer ? `data:base64,${Ut(e.slice(0, 5))}` : null;
}
function Ut(e) {
	let t = "", n = new Uint8Array(e);
	for (let e = 0; e < n.byteLength; e++) t += String.fromCharCode(n[e]);
	return btoa(t);
}
// node_modules/@loaders.gl/core/dist/lib/fetch/fetch-file.js
function Wt(e) {
	return !Gt(e) && !Kt(e);
}
function Gt(e) {
	return e.startsWith("http:") || e.startsWith("https:");
}
function Kt(e) {
	return e.startsWith("data:");
}
async function qt(e, t) {
	if (typeof e == "string") {
		let n = _t(e);
		return Wt(n) && globalThis.loaders?.fetchNode ? globalThis.loaders?.fetchNode(n, t) : await fetch(n, t);
	}
	return await zt(e);
}
// node_modules/@loaders.gl/core/dist/lib/loader-utils/loggers.js
var Jt = new fe({ id: "loaders.gl" }), Yt = class {
	log() {
		return () => {};
	}
	info() {
		return () => {};
	}
	warn() {
		return () => {};
	}
	error() {
		return () => {};
	}
}, Xt = { core: {
	baseUrl: void 0,
	fetch: null,
	mimeType: void 0,
	fallbackMimeType: void 0,
	ignoreRegisteredLoaders: void 0,
	nothrow: !1,
	log: new class {
		console;
		constructor() {
			this.console = console;
		}
		log(...e) {
			return this.console.log.bind(this.console, ...e);
		}
		info(...e) {
			return this.console.info.bind(this.console, ...e);
		}
		warn(...e) {
			return this.console.warn.bind(this.console, ...e);
		}
		error(...e) {
			return this.console.error.bind(this.console, ...e);
		}
	}(),
	useLocalLibraries: !1,
	CDN: "https://unpkg.com/@loaders.gl",
	worker: !0,
	maxConcurrency: 3,
	maxMobileConcurrency: 1,
	reuseWorkers: d,
	_nodeWorkers: !1,
	_workerType: "",
	limit: 0,
	_limitMB: 0,
	batchSize: "auto",
	batchDebounceMs: 0,
	metadata: !1,
	transforms: []
} }, Zt = {
	baseUri: "core.baseUrl",
	fetch: "core.fetch",
	mimeType: "core.mimeType",
	fallbackMimeType: "core.fallbackMimeType",
	ignoreRegisteredLoaders: "core.ignoreRegisteredLoaders",
	nothrow: "core.nothrow",
	log: "core.log",
	useLocalLibraries: "core.useLocalLibraries",
	CDN: "core.CDN",
	worker: "core.worker",
	maxConcurrency: "core.maxConcurrency",
	maxMobileConcurrency: "core.maxMobileConcurrency",
	reuseWorkers: "core.reuseWorkers",
	_nodeWorkers: "core.nodeWorkers",
	_workerType: "core._workerType",
	_worker: "core._workerType",
	limit: "core.limit",
	_limitMB: "core._limitMB",
	batchSize: "core.batchSize",
	batchDebounceMs: "core.batchDebounceMs",
	metadata: "core.metadata",
	transforms: "core.transforms",
	throws: "nothrow",
	dataType: "(no longer used)",
	uri: "core.baseUrl",
	method: "core.fetch.method",
	headers: "core.fetch.headers",
	body: "core.fetch.body",
	mode: "core.fetch.mode",
	credentials: "core.fetch.credentials",
	cache: "core.fetch.cache",
	redirect: "core.fetch.redirect",
	referrer: "core.fetch.referrer",
	referrerPolicy: "core.fetch.referrerPolicy",
	integrity: "core.fetch.integrity",
	keepalive: "core.fetch.keepalive",
	signal: "core.fetch.signal"
}, Qt = [
	"baseUrl",
	"fetch",
	"mimeType",
	"fallbackMimeType",
	"ignoreRegisteredLoaders",
	"nothrow",
	"log",
	"useLocalLibraries",
	"CDN",
	"worker",
	"maxConcurrency",
	"maxMobileConcurrency",
	"reuseWorkers",
	"_nodeWorkers",
	"_workerType",
	"limit",
	"_limitMB",
	"batchSize",
	"batchDebounceMs",
	"metadata",
	"transforms"
];
function $t() {
	globalThis.loaders = globalThis.loaders || {};
	let { loaders: e } = globalThis;
	return e._state ||= {}, e._state;
}
function en() {
	let e = $t();
	return e.globalOptions = e.globalOptions || {
		...Xt,
		core: { ...Xt.core }
	}, nn(e.globalOptions);
}
function tn(e, t, n, r) {
	return n ||= [], n = Array.isArray(n) ? n : [n], rn(e, n), nn(sn(t, e, r));
}
function nn(e) {
	let t = un(e);
	dn(t);
	for (let e of Qt) t.core && t.core[e] !== void 0 && delete t[e];
	return t.core && t.core._workerType !== void 0 && delete t._worker, t;
}
function rn(e, t) {
	an(e, null, Xt, Zt, t);
	for (let n of t) {
		let r = e && e[n.id] || {}, i = n.options && n.options[n.id] || {}, a = n.deprecatedOptions && n.deprecatedOptions[n.id] || {};
		an(r, n.id, i, a, t);
	}
}
function an(e, t, n, r, i) {
	let a = t || "Top level", o = t ? `${t}.` : "";
	for (let s in e) {
		let c = !t && be(e[s]), l = s === "baseUri" && !t, u = s === "workerUrl" && t;
		if (!(s in n) && !l && !u) {
			if (s in r) Jt.level > 0 && Jt.warn(`${a} loader option \'${o}${s}\' no longer supported, use \'${r[s]}\'`)();
			else if (!c && Jt.level > 0) {
				let e = on(s, i);
				Jt.warn(`${a} loader option \'${o}${s}\' not recognized. ${e}`)();
			}
		}
	}
}
function on(e, t) {
	let n = e.toLowerCase(), r = "";
	for (let i of t) for (let t in i.options) {
		if (e === t) return `Did you mean \'${i.id}.${t}\'?`;
		let a = t.toLowerCase();
		(n.startsWith(a) || a.startsWith(n)) && (r ||= `Did you mean \'${i.id}.${t}\'?`);
	}
	return r;
}
function sn(e, t, n) {
	let r = e.options || {}, i = { ...r };
	return r.core && (i.core = { ...r.core }), dn(i), i.core?.log === null && (i.core = {
		...i.core,
		log: new Yt()
	}), cn(i, nn(en())), cn(i, nn(t)), ln(i, n), fn(i), i;
}
function cn(e, t) {
	for (let n in t) if (n in t) {
		let r = t[n];
		e[n] = xe(r) && xe(e[n]) ? {
			...e[n],
			...t[n]
		} : t[n];
	}
}
function ln(e, t) {
	t && e.core?.baseUrl === void 0 && (e.core ||= {}, e.core.baseUrl = Tt(Pt(t)));
}
function un(e) {
	let t = { ...e };
	return e.core && (t.core = { ...e.core }), t;
}
function dn(e) {
	e.baseUri !== void 0 && (e.core ||= {}, e.core.baseUrl === void 0 && (e.core.baseUrl = e.baseUri));
	for (let t of Qt) if (e[t] !== void 0) {
		let n = e.core = e.core || {};
		n[t] === void 0 && (n[t] = e[t]);
	}
	let t = e._worker;
	t !== void 0 && (e.core ||= {}, e.core._workerType === void 0 && (e.core._workerType = t));
}
function fn(e) {
	let t = e.core;
	if (t) for (let n of Qt) t[n] !== void 0 && (e[n] = t[n]);
}
// node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js
function pn(e) {
	return e ? (Array.isArray(e) && (e = e[0]), Array.isArray(e?.extensions)) : !1;
}
function mn(e) {
	l(e, "null loader"), l(pn(e), "invalid loader");
	let t;
	return Array.isArray(e) && (t = e[1], e = e[0], e = {
		...e,
		options: {
			...e.options,
			...t
		}
	}), (e?.parseTextSync || e?.parseText) && (e.text = !0), e.text || (e.binary = !0), e;
}
// node_modules/@loaders.gl/core/dist/lib/api/register-loaders.js
var hn = () => {
	let e = $t();
	return e.loaderRegistry = e.loaderRegistry || [], e.loaderRegistry;
};
function gn(e) {
	let t = hn();
	e = Array.isArray(e) ? e : [e];
	for (let n of e) {
		let e = mn(n);
		t.find((t) => e === t) || t.unshift(e);
	}
}
function _n() {
	return hn();
}
// node_modules/@loaders.gl/core/dist/lib/api/select-loader.js
var vn = /\.([^.]+)$/;
async function yn(e, t = [], n, r) {
	if (!Cn(e)) return null;
	let i = nn(n || {});
	if (i.core ||= {}, e instanceof Response && bn(e)) {
		let n = xn(await e.clone().text(), t, {
			...i,
			core: {
				...i.core,
				nothrow: !0
			}
		}, r);
		if (n) return n;
	}
	let a = xn(e, t, {
		...i,
		core: {
			...i.core,
			nothrow: !0
		}
	}, r);
	if (a) return a;
	if (De(e) && (e = await e.slice(0, 10).arrayBuffer(), a = xn(e, t, i, r)), !a && e instanceof Response && bn(e) && (a = xn(await e.clone().text(), t, i, r)), !a && !i.core.nothrow) throw Error(wn(e));
	return a;
}
function bn(e) {
	let t = Lt(e);
	return !!(t && (t.startsWith("text/") || t === "application/json" || t.endsWith("+json")));
}
function xn(e, t = [], n, r) {
	if (!Cn(e)) return null;
	let i = nn(n || {});
	if (i.core ||= {}, t && !Array.isArray(t)) return mn(t);
	let a = [];
	t && (a = a.concat(t)), i.core.ignoreRegisteredLoaders || a.push(..._n()), Tn(a);
	let o = Sn(e, a, i, r);
	if (!o && !i.core.nothrow) throw Error(wn(e));
	return o;
}
function Sn(e, t, n, r) {
	let i = It(e), a = Lt(e), o = Pt(i) || r?.url, s = null, c = "";
	return n?.core?.mimeType && (s = On(t, n?.core?.mimeType), c = `match forced by supplied MIME type ${n?.core?.mimeType}`), s ||= En(t, o), c ||= s ? `matched url ${o}` : "", s ||= On(t, a), c ||= s ? `matched MIME type ${a}` : "", s ||= kn(t, e), c ||= s ? `matched initial data ${Nn(e)}` : "", n?.core?.fallbackMimeType && (s ||= On(t, n?.core?.fallbackMimeType), c ||= s ? `matched fallback MIME type ${a}` : ""), c && _e.log(1, `selectLoader selected ${s?.name}: ${c}.`), s;
}
function Cn(e) {
	return !(e instanceof Response && e.status === 204);
}
function wn(e) {
	let t = It(e), n = Lt(e), r = "No valid loader found (";
	r += t ? `${wt(t)}, ` : "no url provided, ", r += `MIME type: ${n ? `"${n}"` : "not provided"}, `;
	let i = e ? Nn(e) : "";
	return r += i ? ` first bytes: "${i}"` : "first bytes: not available", r += ")", r;
}
function Tn(e) {
	for (let t of e) mn(t);
}
function En(e, t) {
	let n = t && vn.exec(t), r = n && n[1];
	return r ? Dn(e, r) : null;
}
function Dn(e, t) {
	t = t.toLowerCase();
	for (let n of e) for (let e of n.extensions) if (e.toLowerCase() === t) return n;
	return null;
}
function On(e, t) {
	for (let n of e) if (n.mimeTypes?.some((e) => kt(t, e)) || kt(t, `application/x.${n.id}`)) return n;
	return null;
}
function kn(e, t) {
	if (!t) return null;
	for (let n of e) if (typeof t == "string") {
		if (An(t, n)) return n;
	} else if (ArrayBuffer.isView(t)) {
		if (jn(t.buffer, t.byteOffset, n)) return n;
	} else if (t instanceof ArrayBuffer && jn(t, 0, n)) return n;
	return null;
}
function An(e, t) {
	return t.testText ? t.testText(e) : (Array.isArray(t.tests) ? t.tests : [t.tests]).some((t) => e.startsWith(t));
}
function jn(e, t, n) {
	return (Array.isArray(n.tests) ? n.tests : [n.tests]).some((r) => Mn(e, t, n, r));
}
function Mn(e, t, n, r) {
	if (Ce(r)) return ot(r, e, r.byteLength);
	switch (typeof r) {
		case "function": return r(xt(e));
		case "string": return r === Pn(e, t, r.length);
		default: return !1;
	}
}
function Nn(e, t = 5) {
	return typeof e == "string" ? e.slice(0, t) : ArrayBuffer.isView(e) ? Pn(e.buffer, e.byteOffset, t) : e instanceof ArrayBuffer ? Pn(e, 0, t) : "";
}
function Pn(e, t, n) {
	if (e.byteLength < t + n) return "";
	let r = new DataView(e), i = "";
	for (let e = 0; e < n; e++) i += String.fromCharCode(r.getUint8(t + e));
	return i;
}
// node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-string-iterator.js
var Fn = 262144;
function* In(e, t) {
	let n = t?.chunkSize || Fn, r = 0, i = new TextEncoder();
	for (; r < e.length;) {
		let t = Math.min(e.length - r, n), a = e.slice(r, r + t);
		r += t, yield xt(i.encode(a));
	}
}
// node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-array-buffer-iterator.js
var Ln = 262144;
function* Rn(e, t = {}) {
	let { chunkSize: n = Ln } = t, r = 0;
	for (; r < e.byteLength;) {
		let t = Math.min(e.byteLength - r, n), i = new ArrayBuffer(t), a = new Uint8Array(e, r, t);
		new Uint8Array(i).set(a), r += t, yield i;
	}
}
// node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-blob-iterator.js
var zn = 1048576;
async function* Bn(e, t) {
	let n = t?.chunkSize || zn, r = 0;
	for (; r < e.size;) {
		let t = r + n, i = await e.slice(r, t).arrayBuffer();
		r = t, yield i;
	}
}
// node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-stream-iterator.js
function Vn(e, t) {
	return d ? Hn(e, t) : Un(e, t);
}
async function* Hn(e, t) {
	let n = e.getReader(), r;
	try {
		for (;;) {
			let e = r || n.read();
			t?._streamReadAhead && (r = n.read());
			let { done: i, value: a } = await e;
			if (i) return;
			yield bt(a);
		}
	} catch {
		n.releaseLock();
	}
}
async function* Un(e, t) {
	for await (let t of e) yield bt(t);
}
// node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-iterator.js
function Wn(e, t) {
	if (typeof e == "string") return In(e, t);
	if (e instanceof ArrayBuffer) return Rn(e, t);
	if (De(e)) return Bn(e, t);
	if (Ae(e)) return Vn(e, t);
	if (Ee(e)) {
		let n = e.body;
		if (!n) throw Error("Readable stream not available on Response");
		return Vn(n, t);
	}
	throw Error("makeIterator");
}
// node_modules/@loaders.gl/core/dist/lib/loader-utils/get-data.js
var Gn = "Cannot convert supplied data type";
function Kn(e, t, n) {
	if (t.text && typeof e == "string") return e;
	if (yt(e) && (e = e.buffer), Ce(e)) {
		let n = Ct(e);
		return t.text && !t.binary ? new TextDecoder("utf8").decode(n) : bt(n);
	}
	throw Error(Gn);
}
async function qn(e, t, n) {
	if (typeof e == "string" || Ce(e)) return Kn(e, t, n);
	if (De(e) && (e = await zt(e)), Ee(e)) return await Bt(e), t.binary ? await e.arrayBuffer() : await e.text();
	if (Ae(e) && (e = Wn(e, n)), we(e) || Te(e)) return lt(e);
	throw Error(Gn);
}
// node_modules/@loaders.gl/core/dist/lib/loader-utils/get-fetch-function.js
function Jn(e, t) {
	let n = en(), r = e || n, i = r.fetch ?? r.core?.fetch;
	return typeof i == "function" ? i : be(i) ? (e) => qt(e, i) : t?.fetch ? t?.fetch : qt;
}
// node_modules/@loaders.gl/core/dist/lib/loader-utils/loader-context.js
function Yn(e, t, n) {
	if (n) return n;
	let r = {
		fetch: Jn(t, e),
		...e
	};
	if (r.url) {
		let e = Pt(r.url);
		r.baseUrl = e, r.queryString = Nt(r.url), r.filename = wt(e), r.baseUrl = Tt(e);
	}
	return Array.isArray(r.loaders) || (r.loaders = null), r;
}
function Xn(e, t) {
	if (e && !Array.isArray(e)) return e;
	let n;
	if (e && (n = Array.isArray(e) ? e : [e]), t && t.loaders) {
		let e = Array.isArray(t.loaders) ? t.loaders : [t.loaders];
		n = n ? [...n, ...e] : e;
	}
	return n && n.length ? n : void 0;
}
// node_modules/@loaders.gl/core/dist/lib/api/parse.js
async function Zn(e, t, n, r) {
	t && !Array.isArray(t) && !pn(t) && (r = void 0, n = t, t = void 0), e = await e, n ||= {};
	let i = It(e), a = Xn(t, r), o = await yn(e, a, n);
	if (!o) return null;
	let s = tn(n, o, a, i);
	return r = Yn({
		url: i,
		_parse: Zn,
		loaders: a
	}, s, r || null), await Qn(o, e, s, r);
}
async function Qn(e, t, n, r) {
	if (nt(e), n = je(e.options, n), Ee(t)) {
		let { ok: e, redirected: n, status: i, statusText: a, type: o, url: s } = t;
		r.response = {
			headers: Object.fromEntries(t.headers.entries()),
			ok: e,
			redirected: n,
			status: i,
			statusText: a,
			type: o,
			url: s
		};
	}
	t = await qn(t, e, n);
	let i = e;
	if (i.parseTextSync && typeof t == "string") return i.parseTextSync(t, n, r);
	if (rt(e, n)) return await it(e, t, n, r, Zn);
	if (i.parseText && typeof t == "string") return await i.parseText(t, n, r);
	if (i.parse) return await i.parse(t, n, r);
	throw Ie(!i.parseSync), Error(`${e.id} loader - no parser found and worker is disabled`);
}
// node_modules/@math.gl/types/dist/is-array.js
function $n(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function er(e) {
	return Array.isArray(e) ? e.length === 0 || typeof e[0] == "number" : !1;
}
function tr(e) {
	return $n(e) || er(e);
}
// node_modules/@loaders.gl/core/dist/lib/api/load.js
async function nr(e, t, n, r) {
	let i, a;
	!Array.isArray(t) && !pn(t) ? (i = [], a = t, r = void 0) : (i = t, a = n);
	let o = Jn(a), s = e;
	return typeof e == "string" && (s = await o(e)), De(e) && (s = await o(e)), typeof e == "string" && (nn(a || {}).core?.baseUrl || (a = {
		...a,
		core: {
			...a?.core,
			baseUrl: e
		}
	})), await Zn(s, i, a);
}
// node_modules/@loaders.gl/images/dist/lib/utils/version.js
var rr = "4.5.4", ir = globalThis.loaders?.parseImageNode, ar = typeof Image < "u", or = typeof ImageBitmap < "u", sr = d ? !0 : !!ir;
function cr(e) {
	switch (e) {
		case "auto": return or || ar || sr;
		case "imagebitmap": return or;
		case "image": return ar;
		case "data": return sr;
		default: throw Error(`@loaders.gl/images: image ${e} not supported in this environment`);
	}
}
function lr() {
	if (or) return "imagebitmap";
	if (ar) return "image";
	if (sr) return "data";
	throw Error("Install '@loaders.gl/polyfills' to parse images under Node.js");
}
// node_modules/@loaders.gl/images/dist/lib/category-api/parsed-image-api.js
function ur(e) {
	let t = fr(e);
	if (!t) throw Error("Not an image");
	return t;
}
function dr(e) {
	switch (ur(e)) {
		case "data": return e;
		case "image":
		case "imagebitmap":
			let t = document.createElement("canvas"), n = t.getContext("2d");
			if (!n) throw Error("getImageData");
			return t.width = e.width, t.height = e.height, n.drawImage(e, 0, 0), n.getImageData(0, 0, e.width, e.height);
		default: throw Error("getImageData");
	}
}
function fr(e) {
	return typeof ImageBitmap < "u" && e instanceof ImageBitmap ? "imagebitmap" : typeof Image < "u" && e instanceof Image ? "image" : e && typeof e == "object" && e.data && e.width && e.height ? "data" : null;
}
// node_modules/@loaders.gl/images/dist/lib/parsers/svg-utils.js
var pr = /^data:image\/svg\+xml/, mr = /\.svg((\?|#).*)?$/;
function hr(e) {
	return e && (pr.test(e) || mr.test(e));
}
function gr(e, t) {
	if (hr(t)) {
		let t = new TextDecoder().decode(e);
		try {
			typeof unescape == "function" && typeof encodeURIComponent == "function" && (t = unescape(encodeURIComponent(t)));
		} catch (e) {
			throw Error(e.message);
		}
		return `data:image/svg+xml;base64,${btoa(t)}`;
	}
	return _r(e, t);
}
function _r(e, t) {
	if (hr(t)) throw Error("SVG cannot be parsed directly to imagebitmap");
	return new Blob([new Uint8Array(e)]);
}
// node_modules/@loaders.gl/images/dist/lib/parsers/parse-to-image.js
async function vr(e, t, n) {
	let r = gr(e, n), i = self.URL || self.webkitURL, a = typeof r != "string" && i.createObjectURL(r);
	try {
		return await yr(a || r, t);
	} finally {
		a && i.revokeObjectURL(a);
	}
}
async function yr(e, t) {
	let n = new Image();
	return n.src = e, t.image && t.image.decode && n.decode ? (await n.decode(), n) : await new Promise((e, t) => {
		try {
			n.onload = () => e(n), n.onerror = (e) => {
				let n = e instanceof Error ? e.message : "error";
				t(Error(n));
			};
		} catch (e) {
			t(e);
		}
	});
}
// node_modules/@loaders.gl/images/dist/lib/parsers/parse-to-image-bitmap.js
var br = !0;
async function xr(e, t, n) {
	let r;
	r = hr(n) ? await vr(e, t, n) : _r(e, n);
	let i = t && t.imagebitmap;
	return await Sr(r, i);
}
async function Sr(e, t = null) {
	if ((Cr(t) || !br) && (t = null), t) try {
		return await createImageBitmap(e, t);
	} catch {
		br = !1;
	}
	return await createImageBitmap(e);
}
function Cr(e) {
	if (!e) return !0;
	for (let t in e) if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
	return !0;
}
// node_modules/@loaders.gl/images/dist/lib/category-api/parse-isobmff-binary.js
function wr(e) {
	return !Or(e, "ftyp", 4) || !(e[8] & 96) ? null : Tr(e);
}
function Tr(e) {
	switch (Er(e, 8, 12).replace("\0", " ").trim()) {
		case "avif":
		case "avis": return {
			extension: "avif",
			mimeType: "image/avif"
		};
		default: return null;
	}
}
function Er(e, t, n) {
	return String.fromCharCode(...e.slice(t, n));
}
function Dr(e) {
	return [...e].map((e) => e.charCodeAt(0));
}
function Or(e, t, n = 0) {
	let r = Dr(t);
	for (let t = 0; t < r.length; ++t) if (r[t] !== e[t + n]) return !1;
	return !0;
}
// node_modules/@loaders.gl/images/dist/lib/category-api/binary-image-api.js
var kr = !1, Ar = !0;
function jr(e) {
	let t = Rr(e);
	return Nr(t) || Ir(t) || Pr(t) || Fr(t) || Mr(t);
}
function Mr(e) {
	let t = wr(new Uint8Array(e instanceof DataView ? e.buffer : e));
	return t ? {
		mimeType: t.mimeType,
		width: 0,
		height: 0
	} : null;
}
function Nr(e) {
	let t = Rr(e);
	return t.byteLength >= 24 && t.getUint32(0, kr) === 2303741511 ? {
		mimeType: "image/png",
		width: t.getUint32(16, kr),
		height: t.getUint32(20, kr)
	} : null;
}
function Pr(e) {
	let t = Rr(e);
	return t.byteLength >= 10 && t.getUint32(0, kr) === 1195984440 ? {
		mimeType: "image/gif",
		width: t.getUint16(6, Ar),
		height: t.getUint16(8, Ar)
	} : null;
}
function Fr(e) {
	let t = Rr(e);
	return t.byteLength >= 14 && t.getUint16(0, kr) === 16973 && t.getUint32(2, Ar) === t.byteLength ? {
		mimeType: "image/bmp",
		width: t.getUint32(18, Ar),
		height: t.getUint32(22, Ar)
	} : null;
}
function Ir(e) {
	let t = Rr(e);
	if (!(t.byteLength >= 3 && t.getUint16(0, kr) === 65496 && t.getUint8(2) === 255)) return null;
	let { tableMarkers: n, sofMarkers: r } = Lr(), i = 2;
	for (; i + 9 < t.byteLength;) {
		let e = t.getUint16(i, kr);
		if (r.has(e)) return {
			mimeType: "image/jpeg",
			height: t.getUint16(i + 5, kr),
			width: t.getUint16(i + 7, kr)
		};
		if (!n.has(e)) return null;
		i += 2, i += t.getUint16(i, kr);
	}
	return null;
}
function Lr() {
	let e = /* @__PURE__ */ new Set([
		65499,
		65476,
		65484,
		65501,
		65534
	]);
	for (let t = 65504; t < 65520; ++t) e.add(t);
	return {
		tableMarkers: e,
		sofMarkers: /* @__PURE__ */ new Set([
			65472,
			65473,
			65474,
			65475,
			65477,
			65478,
			65479,
			65481,
			65482,
			65483,
			65485,
			65486,
			65487,
			65502
		])
	};
}
function Rr(e) {
	if (e instanceof DataView) return e;
	if (ArrayBuffer.isView(e)) return new DataView(e.buffer);
	if (e instanceof ArrayBuffer) return new DataView(e);
	throw Error("toDataView");
}
// node_modules/@loaders.gl/images/dist/lib/parsers/parse-to-node-image.js
async function zr(e, t) {
	let { mimeType: n } = jr(e) || {}, r = globalThis.loaders?.parseImageNode;
	return l(r), await r(e, n);
}
// node_modules/@loaders.gl/images/dist/lib/parsers/parse-image.js
async function Br(e, t, n) {
	t ||= {};
	let r = (t.image || {}).type || "auto", { url: i } = n || {}, a = Vr(r), o;
	switch (a) {
		case "imagebitmap":
			o = await xr(e, t, i);
			break;
		case "image":
			o = await vr(e, t, i);
			break;
		case "data":
			o = await zr(e, t);
			break;
		default: l(!1);
	}
	return r === "data" && (o = dr(o)), o;
}
function Vr(e) {
	switch (e) {
		case "auto":
		case "data": return lr();
		default: return cr(e), e;
	}
}
var Hr = {
	dataType: null,
	batchType: null,
	id: "image",
	module: "images",
	name: "Images",
	version: rr,
	mimeTypes: [
		"image/png",
		"image/jpeg",
		"image/gif",
		"image/webp",
		"image/avif",
		"image/bmp",
		"image/vnd.microsoft.icon",
		"image/svg+xml"
	],
	extensions: [
		"png",
		"jpg",
		"jpeg",
		"gif",
		"webp",
		"bmp",
		"ico",
		"svg",
		"avif"
	],
	parse: Br,
	tests: [(e) => !!jr(new DataView(e))],
	options: { image: {
		type: "auto",
		decode: !0
	} }
}, E = new fe({ id: "deck" }), Ur = {};
function Wr(e) {
	Ur = e;
}
function Gr(e, t, n, r) {
	E.level > 0 && Ur[e] && Ur[e].call(null, t, n, r);
}
// node_modules/@deck.gl/core/dist/utils/json-loader.js
function Kr(e) {
	let t = e[0], n = e[e.length - 1];
	return t === "{" && n === "}" || t === "[" && n === "]";
}
var qr = {
	dataType: null,
	batchType: null,
	id: "JSON",
	name: "JSON",
	module: "",
	version: "",
	options: {},
	extensions: ["json", "geojson"],
	mimeTypes: ["application/json", "application/geo+json"],
	testText: Kr,
	parseTextSync: JSON.parse
};
// node_modules/@deck.gl/core/dist/lib/init.js
function Jr() {
	let e = "9.1.14", t = globalThis.deck && globalThis.deck.VERSION;
	if (t && t !== e) throw Error(`deck.gl - multiple versions detected: ${t} vs ${e}`);
	return t || (E.log(1, `deck.gl ${e}`)(), globalThis.deck = {
		...globalThis.deck,
		VERSION: e,
		version: e,
		log: E,
		_registerLoggers: Wr
	}, gn([qr, [Hr, { imagebitmap: { premultiplyAlpha: "none" } }]])), e;
}
var Yr = Jr();
// node_modules/@luma.gl/shadertools/dist/lib/utils/assert.js
function Xr(e, t) {
	if (!e) throw Error(t || "shadertools: assertion failed.");
}
// node_modules/@luma.gl/shadertools/dist/lib/filters/prop-types.js
var Zr = {
	number: {
		type: "number",
		validate(e, t) {
			return Number.isFinite(e) && typeof t == "object" && (t.max === void 0 || e <= t.max) && (t.min === void 0 || e >= t.min);
		}
	},
	array: {
		type: "array",
		validate(e, t) {
			return Array.isArray(e) || ArrayBuffer.isView(e);
		}
	}
};
function Qr(e) {
	let t = {};
	for (let [n, r] of Object.entries(e)) t[n] = $r(r);
	return t;
}
function $r(e) {
	let t = ei(e);
	if (t !== "object") return {
		value: e,
		...Zr[t],
		type: t
	};
	if (typeof e == "object") return e ? e.type === void 0 ? e.value === void 0 ? {
		type: "object",
		value: e
	} : (t = ei(e.value), {
		...e,
		...Zr[t],
		type: t
	}) : {
		...e,
		...Zr[e.type],
		type: e.type
	} : {
		type: "object",
		value: null
	};
	throw Error("props");
}
function ei(e) {
	return Array.isArray(e) || ArrayBuffer.isView(e) ? "array" : typeof e;
}
// node_modules/@luma.gl/shadertools/dist/lib/shader-assembly/shader-injections.js
var ti = {
	vertex: "#ifdef MODULE_LOGDEPTH\n  logdepth_adjustPosition(gl_Position);\n#endif\n",
	fragment: "#ifdef MODULE_MATERIAL\n  fragColor = material_filterColor(fragColor);\n#endif\n\n#ifdef MODULE_LIGHTING\n  fragColor = lighting_filterColor(fragColor);\n#endif\n\n#ifdef MODULE_FOG\n  fragColor = fog_filterColor(fragColor);\n#endif\n\n#ifdef MODULE_PICKING\n  fragColor = picking_filterHighlightColor(fragColor);\n  fragColor = picking_filterPickingColor(fragColor);\n#endif\n\n#ifdef MODULE_LOGDEPTH\n  logdepth_setFragDepth();\n#endif\n"
}, ni = /void\s+main\s*\([^)]*\)\s*\{\n?/, ri = /}\n?[^{}]*$/, ii = [], ai = "__LUMA_INJECT_DECLARATIONS__";
function oi(e) {
	let t = {
		vertex: {},
		fragment: {}
	};
	for (let n in e) {
		let r = e[n], i = si(n);
		typeof r == "string" && (r = {
			order: 0,
			injection: r
		}), t[i][n] = r;
	}
	return t;
}
function si(e) {
	let t = e.slice(0, 2);
	switch (t) {
		case "vs": return "vertex";
		case "fs": return "fragment";
		default: throw Error(t);
	}
}
function ci(e, t, n, r = !1) {
	let i = t === "vertex";
	for (let t in n) {
		let r = n[t];
		r.sort((e, t) => e.order - t.order), ii.length = r.length;
		for (let e = 0, t = r.length; e < t; ++e) ii[e] = r[e].injection;
		let a = `${ii.join("\n")}\n`;
		switch (t) {
			case "vs:#decl":
				i && (e = e.replace(ai, a));
				break;
			case "vs:#main-start":
				i && (e = e.replace(ni, (e) => e + a));
				break;
			case "vs:#main-end":
				i && (e = e.replace(ri, (e) => a + e));
				break;
			case "fs:#decl":
				i || (e = e.replace(ai, a));
				break;
			case "fs:#main-start":
				i || (e = e.replace(ni, (e) => e + a));
				break;
			case "fs:#main-end":
				i || (e = e.replace(ri, (e) => a + e));
				break;
			default: e = e.replace(t, (e) => e + a);
		}
	}
	return e = e.replace(ai, ""), r && (e = e.replace(/\}\s*$/, (e) => e + ti[t])), e;
}
// node_modules/@luma.gl/shadertools/dist/lib/shader-module/shader-module.js
function li(e) {
	e.map((e) => ui(e));
}
function ui(e) {
	if (e.instance) return;
	li(e.dependencies || []);
	let { propTypes: t = {}, deprecations: n = [], inject: r = {} } = e, i = {
		normalizedInjections: oi(r),
		parsedDeprecations: fi(n)
	};
	t && (i.propValidators = Qr(t)), e.instance = i;
	let a = {};
	t && (a = Object.entries(t).reduce((e, [t, n]) => {
		let r = n?.value;
		return r && (e[t] = r), e;
	}, {})), e.defaultUniforms = {
		...e.defaultUniforms,
		...a
	};
}
function di(e, t, n) {
	e.deprecations?.forEach((e) => {
		e.regex?.test(t) && (e.deprecated ? n.deprecated(e.old, e.new)() : n.removed(e.old, e.new)());
	});
}
function fi(e) {
	return e.forEach((e) => {
		switch (e.type) {
			case "function":
				e.regex = RegExp(`\\b${e.old}\\(`);
				break;
			default: e.regex = RegExp(`${e.type} ${e.old};`);
		}
	}), e;
}
// node_modules/@luma.gl/shadertools/dist/lib/shader-module/shader-module-dependencies.js
function pi(e) {
	li(e);
	let t = {}, n = {};
	mi({
		modules: e,
		level: 0,
		moduleMap: t,
		moduleDepth: n
	});
	let r = Object.keys(n).sort((e, t) => n[t] - n[e]).map((e) => t[e]);
	return li(r), r;
}
function mi(e) {
	let { modules: t, level: n, moduleMap: r, moduleDepth: i } = e;
	if (n >= 5) throw Error("Possible loop in shader dependency graph");
	for (let e of t) r[e.name] = e, (i[e.name] === void 0 || i[e.name] < n) && (i[e.name] = n);
	for (let e of t) e.dependencies && mi({
		modules: e.dependencies,
		level: n + 1,
		moduleMap: r,
		moduleDepth: i
	});
}
// node_modules/@luma.gl/shadertools/dist/lib/shader-assembly/platform-defines.js
function hi(e) {
	switch (e?.gpu.toLowerCase()) {
		case "apple": return "#define APPLE_GPU\n// Apple optimizes away the calculation necessary for emulated fp64\n#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1\n#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1\n// Intel GPU doesn't have full 32 bits precision in same cases, causes overflow\n#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1\n";
		case "nvidia": return "#define NVIDIA_GPU\n// Nvidia optimizes away the calculation necessary for emulated fp64\n#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1\n";
		case "intel": return "#define INTEL_GPU\n// Intel optimizes away the calculation necessary for emulated fp64\n#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1\n// Intel's built-in 'tan' function doesn't have acceptable precision\n#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1\n// Intel GPU doesn't have full 32 bits precision in same cases, causes overflow\n#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1\n";
		case "amd": return "#define AMD_GPU\n";
		default: return "#define DEFAULT_GPU\n// Prevent driver from optimizing away the calculation necessary for emulated fp64\n#define LUMA_FP64_CODE_ELIMINATION_WORKAROUND 1\n// Headless Chrome's software shader 'tan' function doesn't have acceptable precision\n#define LUMA_FP32_TAN_PRECISION_WORKAROUND 1\n// If the GPU doesn't have full 32 bits precision, will causes overflow\n#define LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND 1\n";
	}
}
// node_modules/@luma.gl/shadertools/dist/lib/shader-transpiler/transpile-glsl-shader.js
function gi(e, t) {
	if (Number(e.match(/^#version[ \t]+(\d+)/m)?.[1] || 100) !== 300) throw Error("luma.gl v9 only supports GLSL 3.00 shader sources");
	switch (t) {
		case "vertex": return e = bi(e, vi), e;
		case "fragment": return e = bi(e, yi), e;
		default: throw Error(t);
	}
}
var _i = [
	[/^(#version[ \t]+(100|300[ \t]+es))?[ \t]*\n/, "#version 300 es\n"],
	[/\btexture(2D|2DProj|Cube)Lod(EXT)?\(/g, "textureLod("],
	[/\btexture(2D|2DProj|Cube)(EXT)?\(/g, "texture("]
], vi = [
	..._i,
	[xi("attribute"), "in $1"],
	[xi("varying"), "out $1"]
], yi = [..._i, [xi("varying"), "in $1"]];
function bi(e, t) {
	for (let [n, r] of t) e = e.replace(n, r);
	return e;
}
function xi(e) {
	return RegExp(`\\b${e}[ \\t]+(\\w+[ \\t]+\\w+(\\[\\w+\\])?;)`, "g");
}
// node_modules/@luma.gl/shadertools/dist/lib/shader-assembly/shader-hooks.js
function Si(e, t) {
	let n = "";
	for (let r in e) {
		let i = e[r];
		if (n += `void ${i.signature} {\n`, i.header && (n += `  ${i.header}`), t[r]) {
			let e = t[r];
			e.sort((e, t) => e.order - t.order);
			for (let t of e) n += `  ${t.injection}\n`;
		}
		i.footer && (n += `  ${i.footer}`), n += "}\n";
	}
	return n;
}
function Ci(e) {
	let t = {
		vertex: {},
		fragment: {}
	};
	for (let n of e) {
		let e, r;
		typeof n == "string" ? (e = {}, r = n) : (e = n, r = e.hook), r = r.trim();
		let [i, a] = r.split(":"), o = r.replace(/\(.+/, ""), s = Object.assign(e, { signature: a });
		switch (i) {
			case "vs":
				t.vertex[o] = s;
				break;
			case "fs":
				t.fragment[o] = s;
				break;
			default: throw Error(i);
		}
	}
	return t;
}
// node_modules/@luma.gl/shadertools/dist/lib/glsl-utils/get-shader-info.js
function wi(e, t) {
	return {
		name: Ti(e, t),
		language: "glsl",
		version: Ei(e)
	};
}
function Ti(e, t = "unnamed") {
	let n = /#define[^\S\r\n]*SHADER_NAME[^\S\r\n]*([A-Za-z0-9_-]+)\s*/.exec(e);
	return n ? n[1] : t;
}
function Ei(e) {
	let t = 100, n = e.match(/[^\s]+/g);
	if (n && n.length >= 2 && n[0] === "#version") {
		let e = parseInt(n[1], 10);
		Number.isFinite(e) && (t = e);
	}
	if (t !== 100 && t !== 300) throw Error(`Invalid GLSL version ${t}`);
	return t;
}
// node_modules/@luma.gl/shadertools/dist/lib/shader-assembly/assemble-shaders.js
var Di = `\n\n${ai}\n`, Oi = "precision highp float;\n";
function ki(e) {
	let t = pi(e.modules || []);
	return {
		source: ji(e.platformInfo, {
			...e,
			source: e.source,
			stage: "vertex",
			modules: t
		}),
		getUniforms: Ni(t)
	};
}
function Ai(e) {
	let { vs: t, fs: n } = e, r = pi(e.modules || []);
	return {
		vs: Mi(e.platformInfo, {
			...e,
			source: t,
			stage: "vertex",
			modules: r
		}),
		fs: Mi(e.platformInfo, {
			...e,
			source: n,
			stage: "fragment",
			modules: r
		}),
		getUniforms: Ni(r)
	};
}
function ji(e, t) {
	let { source: n, stage: r, modules: i, hookFunctions: a = [], inject: o = {}, log: s } = t;
	Xr(typeof n == "string", "shader source must be a string");
	let c = n, l = "", u = Ci(a), d = {}, f = {}, p = {};
	for (let e in o) {
		let t = typeof o[e] == "string" ? {
			injection: o[e],
			order: 0
		} : o[e], n = /^(v|f)s:(#)?([\w-]+)$/.exec(e);
		if (n) {
			let r = n[2], i = n[3];
			r ? i === "decl" ? f[e] = [t] : p[e] = [t] : d[e] = [t];
		} else p[e] = [t];
	}
	let m = i;
	for (let e of m) {
		s && di(e, c, s);
		let t = Ii(e, "wgsl");
		l += t;
		let n = e.injections?.[r] || {};
		for (let e in n) {
			let t = /^(v|f)s:#([\w-]+)$/.exec(e);
			if (t) {
				let r = t[2] === "decl" ? f : p;
				r[e] = r[e] || [], r[e].push(n[e]);
			} else d[e] = d[e] || [], d[e].push(n[e]);
		}
	}
	return l += Di, l = ci(l, r, f), l += Si(u[r], d), l += c, l = ci(l, r, p), l;
}
function Mi(e, t) {
	let { id: n, source: r, stage: i, language: a = "glsl", modules: o, defines: s = {}, hookFunctions: c = [], inject: l = {}, prologue: u = !0, log: d } = t;
	Xr(typeof r == "string", "shader source must be a string");
	let f = a === "glsl" ? wi(r).version : -1, p = e.shaderLanguageVersion, m = f === 100 ? "#version 100" : "#version 300 es", h = r.split("\n").slice(1).join("\n"), g = {};
	o.forEach((e) => {
		Object.assign(g, e.defines);
	}), Object.assign(g, s);
	let _ = "";
	switch (a) {
		case "wgsl": break;
		case "glsl": _ = u ? `\
${m}

// ----- PROLOGUE -------------------------
${Pi({
			id: n,
			source: r,
			stage: i
		})}
${`#define SHADER_TYPE_${i.toUpperCase()}`}

${hi(e)}
${i === "fragment" ? Oi : ""}

// ----- APPLICATION DEFINES -------------------------

${Fi(g)}

` : `${m}
`;
	}
	let v = Ci(c), y = {}, b = {}, x = {};
	for (let e in l) {
		let t = typeof l[e] == "string" ? {
			injection: l[e],
			order: 0
		} : l[e], n = /^(v|f)s:(#)?([\w-]+)$/.exec(e);
		if (n) {
			let r = n[2], i = n[3];
			r ? i === "decl" ? b[e] = [t] : x[e] = [t] : y[e] = [t];
		} else x[e] = [t];
	}
	for (let e of o) {
		d && di(e, h, d);
		let t = Ii(e, i);
		_ += t;
		let n = e.instance?.normalizedInjections[i] || {};
		for (let e in n) {
			let t = /^(v|f)s:#([\w-]+)$/.exec(e);
			if (t) {
				let r = t[2] === "decl" ? b : x;
				r[e] = r[e] || [], r[e].push(n[e]);
			} else y[e] = y[e] || [], y[e].push(n[e]);
		}
	}
	return _ += "// ----- MAIN SHADER SOURCE -------------------------", _ += Di, _ = ci(_, i, b), _ += Si(v[i], y), _ += h, _ = ci(_, i, x), a === "glsl" && f !== p && (_ = gi(_, i)), _.trim();
}
function Ni(e) {
	return function(t) {
		let n = {};
		for (let r of e) {
			let e = r.getUniforms?.(t, n);
			Object.assign(n, e);
		}
		return n;
	};
}
function Pi(e) {
	let { id: t, source: n, stage: r } = e;
	return t && n.indexOf("SHADER_NAME") === -1 ? `
#define SHADER_NAME ${t}_${r}` : "";
}
function Fi(e = {}) {
	let t = "";
	for (let n in e) {
		let r = e[n];
		(r || Number.isFinite(r)) && (t += `#define ${n.toUpperCase()} ${e[n]}\n`);
	}
	return t;
}
function Ii(e, t) {
	let n;
	switch (t) {
		case "vertex":
			n = e.vs || "";
			break;
		case "fragment":
			n = e.fs || "";
			break;
		case "wgsl":
			n = e.source || "";
			break;
		default: Xr(!1);
	}
	if (!e.name) throw Error("Shader module must have a name");
	let r = e.name.toUpperCase().replace(/[^0-9a-z]/gi, "_"), i = `\
// ----- MODULE ${e.name} ---------------

`;
	return t !== "wgsl" && (i += `#define MODULE_${r}\n`), i += `${n}\n`, i;
}
// node_modules/@luma.gl/shadertools/dist/lib/preprocessor/preprocessor.js
var Li = /^\s*\#\s*ifdef\s*([a-zA-Z_]+)\s*$/, Ri = /^\s*\#\s*endif\s*$/;
function zi(e, t) {
	let n = e.split("\n"), r = [], i = !0, a = null;
	for (let e of n) {
		let n = e.match(Li), o = e.match(Ri);
		n ? (a = n[1], i = !!t?.defines?.[a]) : o ? i = !0 : i && r.push(e);
	}
	return r.join("\n");
}
// node_modules/@luma.gl/shadertools/dist/lib/shader-assembler.js
var Bi = class e {
	static defaultShaderAssembler;
	_hookFunctions = [];
	_defaultModules = [];
	static getDefaultShaderAssembler() {
		return e.defaultShaderAssembler = e.defaultShaderAssembler || new e(), e.defaultShaderAssembler;
	}
	addDefaultModule(e) {
		this._defaultModules.find((t) => t.name === (typeof e == "string" ? e : e.name)) || this._defaultModules.push(e);
	}
	removeDefaultModule(e) {
		let t = typeof e == "string" ? e : e.name;
		this._defaultModules = this._defaultModules.filter((e) => e.name !== t);
	}
	addShaderHook(e, t) {
		t && (e = Object.assign(t, { hook: e })), this._hookFunctions.push(e);
	}
	assembleWGSLShader(e) {
		let t = this._getModuleList(e.modules), n = this._hookFunctions, { source: r, getUniforms: i } = ki({
			...e,
			source: e.source,
			modules: t,
			hookFunctions: n
		});
		return {
			source: e.platformInfo.shaderLanguage === "wgsl" ? zi(r) : r,
			getUniforms: i,
			modules: t
		};
	}
	assembleGLSLShaderPair(e) {
		let t = this._getModuleList(e.modules), n = this._hookFunctions;
		return {
			...Ai({
				...e,
				vs: e.vs,
				fs: e.fs,
				modules: t,
				hookFunctions: n
			}),
			modules: t
		};
	}
	_getModuleList(e = []) {
		let t = Array(this._defaultModules.length + e.length), n = {}, r = 0;
		for (let e = 0, i = this._defaultModules.length; e < i; ++e) {
			let i = this._defaultModules[e], a = i.name;
			t[r++] = i, n[a] = !0;
		}
		for (let i = 0, a = e.length; i < a; ++i) {
			let a = e[i], o = a.name;
			n[o] || (t[r++] = a, n[o] = !0);
		}
		return t.length = r, li(t), t;
	}
}, Vi = "#version 300 es\nout vec4 transform_output;\nvoid main() {\n  transform_output = vec4(0);\n}";
function Hi(e) {
	let { input: t, inputChannels: n, output: r } = e || {};
	if (!t) return Vi;
	if (!n) throw Error("inputChannels");
	return `\
#version 300 es
in ${Ui(n)} ${t};
out vec4 ${r};
void main() {
  ${r} = ${Wi(t, n)};
}`;
}
function Ui(e) {
	switch (e) {
		case 1: return "float";
		case 2: return "vec2";
		case 3: return "vec3";
		case 4: return "vec4";
		default: throw Error(`invalid channels: ${e}`);
	}
}
function Wi(e, t) {
	switch (t) {
		case 1: return `vec4(${e}, 0.0, 0.0, 1.0)`;
		case 2: return `vec4(${e}, 0.0, 1.0)`;
		case 3: return `vec4(${e}, 1.0)`;
		case 4: return e;
		default: throw Error(`invalid channels: ${t}`);
	}
}
var Gi = new class {
	stats = /* @__PURE__ */ new Map();
	getStats(e) {
		return this.get(e);
	}
	get(e) {
		return this.stats.has(e) || this.stats.set(e, new mt({ id: e })), this.stats.get(e);
	}
}(), D = new fe({ id: "luma.gl" }), Ki = {};
function qi(e = "id") {
	return Ki[e] = Ki[e] || 1, `${e}-${Ki[e]++}`;
}
// node_modules/@luma.gl/core/dist/adapter/resources/resource.js
var O = class {
	static defaultProps = {
		id: "undefined",
		handle: void 0,
		userData: void 0
	};
	toString() {
		return `${this[Symbol.toStringTag] || this.constructor.name}:"${this.id}"`;
	}
	id;
	props;
	userData = {};
	_device;
	destroyed = !1;
	allocatedBytes = 0;
	_attachedResources = /* @__PURE__ */ new Set();
	constructor(e, t, n) {
		if (!e) throw Error("no device");
		this._device = e, this.props = Ji(t, n);
		let r = this.props.id === "undefined" ? qi(this[Symbol.toStringTag]) : this.props.id;
		this.props.id = r, this.id = r, this.userData = this.props.userData || {}, this.addStats();
	}
	destroy() {
		this.destroyResource();
	}
	delete() {
		return this.destroy(), this;
	}
	getProps() {
		return this.props;
	}
	attachResource(e) {
		this._attachedResources.add(e);
	}
	detachResource(e) {
		this._attachedResources.delete(e);
	}
	destroyAttachedResource(e) {
		this._attachedResources.delete(e) && e.destroy();
	}
	destroyAttachedResources() {
		for (let e of Object.values(this._attachedResources)) e.destroy();
		this._attachedResources = /* @__PURE__ */ new Set();
	}
	destroyResource() {
		this.destroyAttachedResources(), this.removeStats(), this.destroyed = !0;
	}
	removeStats() {
		let e = this._device.statsManager.getStats("Resource Counts"), t = this[Symbol.toStringTag];
		e.get(`${t}s Active`).decrementCount();
	}
	trackAllocatedMemory(e, t = this[Symbol.toStringTag]) {
		let n = this._device.statsManager.getStats("Resource Counts");
		n.get("GPU Memory").addCount(e), n.get(`${t} Memory`).addCount(e), this.allocatedBytes = e;
	}
	trackDeallocatedMemory(e = this[Symbol.toStringTag]) {
		let t = this._device.statsManager.getStats("Resource Counts");
		t.get("GPU Memory").subtractCount(this.allocatedBytes), t.get(`${e} Memory`).subtractCount(this.allocatedBytes), this.allocatedBytes = 0;
	}
	addStats() {
		let e = this._device.statsManager.getStats("Resource Counts"), t = this[Symbol.toStringTag];
		e.get("Resources Created").incrementCount(), e.get(`${t}s Created`).incrementCount(), e.get(`${t}s Active`).incrementCount();
	}
};
function Ji(e, t) {
	let n = { ...t };
	for (let t in e) e[t] !== void 0 && (n[t] = e[t]);
	return n;
}
// node_modules/@luma.gl/core/dist/adapter/resources/buffer.js
var k = class e extends O {
	static defaultProps = {
		...O.defaultProps,
		usage: 0,
		byteLength: 0,
		byteOffset: 0,
		data: null,
		indexType: "uint16",
		mappedAtCreation: !1
	};
	static MAP_READ = 1;
	static MAP_WRITE = 2;
	static COPY_SRC = 4;
	static COPY_DST = 8;
	static INDEX = 16;
	static VERTEX = 32;
	static UNIFORM = 64;
	static STORAGE = 128;
	static INDIRECT = 256;
	static QUERY_RESOLVE = 512;
	get [Symbol.toStringTag]() {
		return "Buffer";
	}
	usage;
	indexType;
	updateTimestamp;
	constructor(t, n) {
		let r = { ...n };
		(n.usage || 0) & e.INDEX && !n.indexType && (n.data instanceof Uint32Array ? r.indexType = "uint32" : n.data instanceof Uint16Array && (r.indexType = "uint16")), delete r.data, super(t, r, e.defaultProps), this.usage = r.usage || 0, this.indexType = r.indexType, this.updateTimestamp = t.incrementTimestamp();
	}
	clone(e) {
		return this.device.createBuffer({
			...this.props,
			...e
		});
	}
	readSyncWebGL(e, t) {
		throw Error("not implemented");
	}
	static DEBUG_DATA_MAX_LENGTH = 32;
	debugData = /* @__PURE__ */ new ArrayBuffer(0);
	_setDebugData(t, n, r) {
		let i = ArrayBuffer.isView(t) ? t.buffer : t, a = Math.min(t ? t.byteLength : r, e.DEBUG_DATA_MAX_LENGTH);
		this.debugData = i === null ? new ArrayBuffer(a) : n === 0 && r === i.byteLength ? i.slice(0, a) : i.slice(n, n + a);
	}
};
// node_modules/@luma.gl/core/dist/gpu-type-utils/decode-data-type.js
function Yi(e) {
	let t = Zi[e], n = Xi(t), r = e.includes("norm"), i = !r && !e.startsWith("float"), a = e.startsWith("s");
	return {
		dataType: Zi[e],
		byteLength: n,
		integer: i,
		signed: a,
		normalized: r
	};
}
function Xi(e) {
	return Qi[e];
}
var Zi = {
	uint8: "uint8",
	sint8: "sint8",
	unorm8: "uint8",
	snorm8: "sint8",
	uint16: "uint16",
	sint16: "sint16",
	unorm16: "uint16",
	snorm16: "sint16",
	float16: "float16",
	float32: "float32",
	uint32: "uint32",
	sint32: "sint32"
}, Qi = {
	uint8: 1,
	sint8: 1,
	uint16: 2,
	sint16: 2,
	float16: 2,
	float32: 4,
	uint32: 4,
	sint32: 4
}, $i = "texture-compression-bc", A = "texture-compression-astc", ea = "texture-compression-etc2", ta = "texture-compression-etc1-webgl", na = "texture-compression-pvrtc-webgl", ra = "texture-compression-atc-webgl", ia = "float32-renderable-webgl", aa = "float16-renderable-webgl", oa = "rgb9e5ufloat-renderable-webgl", sa = "snorm8-renderable-webgl", ca = "norm16-renderable-webgl", la = "snorm16-renderable-webgl", ua = "float32-filterable", da = "float16-filterable-webgl";
function fa(e) {
	let t = pa[e];
	if (!t) throw Error(`Unsupported texture format ${e}`);
	return t;
}
var pa = {
	r8unorm: {},
	r8snorm: { render: sa },
	r8uint: {},
	r8sint: {},
	rg8unorm: {},
	rg8snorm: { render: sa },
	rg8uint: {},
	rg8sint: {},
	r16uint: {},
	r16sint: {},
	r16float: {
		render: aa,
		filter: "float16-filterable-webgl"
	},
	"r16unorm-webgl": { f: ca },
	"r16snorm-webgl": { f: la },
	"rgba4unorm-webgl": {
		channels: "rgba",
		bitsPerChannel: [
			4,
			4,
			4,
			4
		],
		packed: !0
	},
	"rgb565unorm-webgl": {
		channels: "rgb",
		bitsPerChannel: [
			5,
			6,
			5,
			0
		],
		packed: !0
	},
	"rgb5a1unorm-webgl": {
		channels: "rgba",
		bitsPerChannel: [
			5,
			5,
			5,
			1
		],
		packed: !0
	},
	"rgb8unorm-webgl": {},
	"rgb8snorm-webgl": {},
	rgba8unorm: {},
	"rgba8unorm-srgb": {},
	rgba8snorm: { render: sa },
	rgba8uint: {},
	rgba8sint: {},
	bgra8unorm: {},
	"bgra8unorm-srgb": {},
	rg16uint: {},
	rg16sint: {},
	rg16float: {
		render: aa,
		filter: da
	},
	"rg16unorm-webgl": { render: ca },
	"rg16snorm-webgl": { render: la },
	r32uint: {},
	r32sint: {},
	r32float: {
		render: ia,
		filter: ua
	},
	rgb9e5ufloat: {
		channels: "rgb",
		packed: !0,
		render: oa
	},
	rg11b10ufloat: {
		channels: "rgb",
		bitsPerChannel: [
			11,
			11,
			10,
			0
		],
		packed: !0,
		p: 1,
		render: ia
	},
	rgb10a2unorm: {
		channels: "rgba",
		bitsPerChannel: [
			10,
			10,
			10,
			2
		],
		packed: !0,
		p: 1
	},
	"rgb10a2uint-webgl": {
		channels: "rgba",
		bitsPerChannel: [
			10,
			10,
			10,
			2
		],
		packed: !0,
		p: 1,
		wgpu: !1
	},
	"rgb16unorm-webgl": { f: ca },
	"rgb16snorm-webgl": { f: ca },
	rg32uint: {},
	rg32sint: {},
	rg32float: {
		render: !1,
		filter: ua
	},
	rgba16uint: {},
	rgba16sint: {},
	rgba16float: {
		render: aa,
		filter: da
	},
	"rgba16unorm-webgl": { render: ca },
	"rgba16snorm-webgl": { render: la },
	"rgb32float-webgl": {
		render: ia,
		filter: ua
	},
	rgba32uint: {},
	rgba32sint: {},
	rgba32float: {
		render: ia,
		filter: ua
	},
	stencil8: {
		attachment: "stencil",
		bitsPerChannel: [
			8,
			0,
			0,
			0
		],
		dataType: "uint8"
	},
	depth16unorm: {
		attachment: "depth",
		bitsPerChannel: [
			16,
			0,
			0,
			0
		],
		dataType: "uint16"
	},
	depth24plus: {
		attachment: "depth",
		bitsPerChannel: [
			24,
			0,
			0,
			0
		],
		dataType: "uint32"
	},
	depth32float: {
		attachment: "depth",
		bitsPerChannel: [
			32,
			0,
			0,
			0
		],
		dataType: "float32"
	},
	"depth24plus-stencil8": {
		attachment: "depth-stencil",
		bitsPerChannel: [
			24,
			8,
			0,
			0
		],
		packed: !0
	},
	"depth32float-stencil8": {
		attachment: "depth-stencil",
		bitsPerChannel: [
			32,
			8,
			0,
			0
		],
		packed: !0
	},
	"bc1-rgb-unorm-webgl": { f: $i },
	"bc1-rgb-unorm-srgb-webgl": { f: $i },
	"bc1-rgba-unorm": { f: $i },
	"bc1-rgba-unorm-srgb": { f: $i },
	"bc2-rgba-unorm": { f: $i },
	"bc2-rgba-unorm-srgb": { f: $i },
	"bc3-rgba-unorm": { f: $i },
	"bc3-rgba-unorm-srgb": { f: $i },
	"bc4-r-unorm": { f: $i },
	"bc4-r-snorm": { f: $i },
	"bc5-rg-unorm": { f: $i },
	"bc5-rg-snorm": { f: $i },
	"bc6h-rgb-ufloat": { f: $i },
	"bc6h-rgb-float": { f: $i },
	"bc7-rgba-unorm": { f: $i },
	"bc7-rgba-unorm-srgb": { f: $i },
	"etc2-rgb8unorm": { f: ea },
	"etc2-rgb8unorm-srgb": { f: ea },
	"etc2-rgb8a1unorm": { f: ea },
	"etc2-rgb8a1unorm-srgb": { f: ea },
	"etc2-rgba8unorm": { f: ea },
	"etc2-rgba8unorm-srgb": { f: ea },
	"eac-r11unorm": { f: ea },
	"eac-r11snorm": { f: ea },
	"eac-rg11unorm": { f: ea },
	"eac-rg11snorm": { f: ea },
	"astc-4x4-unorm": { f: A },
	"astc-4x4-unorm-srgb": { f: A },
	"astc-5x4-unorm": { f: A },
	"astc-5x4-unorm-srgb": { f: A },
	"astc-5x5-unorm": { f: A },
	"astc-5x5-unorm-srgb": { f: A },
	"astc-6x5-unorm": { f: A },
	"astc-6x5-unorm-srgb": { f: A },
	"astc-6x6-unorm": { f: A },
	"astc-6x6-unorm-srgb": { f: A },
	"astc-8x5-unorm": { f: A },
	"astc-8x5-unorm-srgb": { f: A },
	"astc-8x6-unorm": { f: A },
	"astc-8x6-unorm-srgb": { f: A },
	"astc-8x8-unorm": { f: A },
	"astc-8x8-unorm-srgb": { f: A },
	"astc-10x5-unorm": { f: A },
	"astc-10x5-unorm-srgb": { f: A },
	"astc-10x6-unorm": { f: A },
	"astc-10x6-unorm-srgb": { f: A },
	"astc-10x8-unorm": { f: A },
	"astc-10x8-unorm-srgb": { f: A },
	"astc-10x10-unorm": { f: A },
	"astc-10x10-unorm-srgb": { f: A },
	"astc-12x10-unorm": { f: A },
	"astc-12x10-unorm-srgb": { f: A },
	"astc-12x12-unorm": { f: A },
	"astc-12x12-unorm-srgb": { f: A },
	"pvrtc-rgb4unorm-webgl": { f: na },
	"pvrtc-rgba4unorm-webgl": { f: na },
	"pvrtc-rbg2unorm-webgl": { f: na },
	"pvrtc-rgba2unorm-webgl": { f: na },
	"etc1-rbg-unorm-webgl": { f: ta },
	"atc-rgb-unorm-webgl": { f: ra },
	"atc-rgba-unorm-webgl": { f: ra },
	"atc-rgbai-unorm-webgl": { f: ra }
}, ma = [
	"bc1",
	"bc2",
	"bc3",
	"bc4",
	"bc5",
	"bc6",
	"bc7",
	"etc1",
	"etc2",
	"eac",
	"atc",
	"astc",
	"pvrtc"
], ha = /^(r|rg|rgb|rgba|bgra)([0-9]*)([a-z]*)(-srgb)?(-webgl)?$/;
function ga(e) {
	return ma.some((t) => e.startsWith(t));
}
function _a(e) {
	let t = va(e);
	if (ga(e)) {
		t.channels = "rgb", t.components = 3, t.bytesPerPixel = 1, t.srgb = !1, t.compressed = !0;
		let n = ya(e);
		n && (t.blockWidth = n.blockWidth, t.blockHeight = n.blockHeight);
	}
	let n = ha.exec(e);
	if (n) {
		let [, r, i, a, o, s] = n, c = Yi(`${a}${i}`), l = c.byteLength * 8, u = r.length, d = [
			l,
			u >= 2 ? l : 0,
			u >= 3 ? l : 0,
			u >= 4 ? l : 0
		];
		t = {
			format: e,
			attachment: t.attachment,
			dataType: c.dataType,
			components: u,
			channels: r,
			integer: c.integer,
			signed: c.signed,
			normalized: c.normalized,
			bitsPerChannel: d,
			bytesPerPixel: c.byteLength * r.length,
			packed: t.packed,
			srgb: t.srgb
		}, s === "-webgl" && (t.webgl = !0), o === "-srgb" && (t.srgb = !0);
	}
	return e.endsWith("-webgl") && (t.webgl = !0), e.endsWith("-srgb") && (t.srgb = !0), t;
}
function va(e) {
	let t = fa(e), n = t.bytesPerPixel || 1, r = t.bitsPerChannel || [
		8,
		8,
		8,
		8
	];
	return delete t.bitsPerChannel, delete t.bytesPerPixel, delete t.f, delete t.render, delete t.filter, delete t.blend, delete t.store, {
		...t,
		format: e,
		attachment: t.attachment || "color",
		channels: t.channels || "r",
		components: t.components || t.channels?.length || 1,
		bytesPerPixel: n,
		bitsPerChannel: r,
		dataType: t.dataType || "uint8",
		srgb: t.srgb ?? !1,
		packed: t.packed ?? !1,
		webgl: t.webgl ?? !1,
		integer: t.integer ?? !1,
		signed: t.signed ?? !1,
		normalized: t.normalized ?? !1,
		compressed: t.compressed ?? !1
	};
}
function ya(e) {
	let t = /.*-(\d+)x(\d+)-.*/.exec(e);
	if (t) {
		let [, e, n] = t;
		return {
			blockWidth: Number(e),
			blockHeight: Number(n)
		};
	}
	return null;
}
// node_modules/@luma.gl/core/dist/gpu-type-utils/texture-format-capabilities.js
function ba(e) {
	let t = fa(e), n = {
		format: e,
		create: t.f ?? !0,
		render: t.render ?? !0,
		filter: t.filter ?? !0,
		blend: t.blend ?? !0,
		store: t.store ?? !0
	}, r = _a(e), i = e.startsWith("depth") || e.startsWith("stencil"), a = r?.signed, o = r?.integer, s = r?.webgl;
	return n.render &&= !a, n.filter &&= !i && !a && !o && !s, n;
}
// node_modules/@luma.gl/core/dist/adapter/device.js
var xa = class {}, Sa = class {
	features;
	disabledFeatures;
	constructor(e = [], t) {
		this.features = new Set(e), this.disabledFeatures = t || {};
	}
	*[Symbol.iterator]() {
		yield* this.features;
	}
	has(e) {
		return !this.disabledFeatures?.[e] && this.features.has(e);
	}
}, Ca = class e {
	static defaultProps = {
		id: null,
		powerPreference: "high-performance",
		failIfMajorPerformanceCaveat: !1,
		createCanvasContext: void 0,
		onError: (e) => D.error(e.message)(),
		_reuseDevices: !1,
		_requestMaxLimits: !0,
		_factoryDestroyPolicy: "unused",
		_initializeFeatures: !0,
		_disabledFeatures: { "compilation-status-async-webgl": !0 },
		_resourceDefaults: {},
		webgl: {},
		debug: D.get("debug") || void 0,
		debugShaders: D.get("debug-shaders") || void 0,
		debugFramebuffers: !!D.get("debug-framebuffers"),
		debugWebGL: !!D.get("debug-webgl"),
		debugSpectorJS: void 0,
		debugSpectorJSUrl: void 0,
		_handle: void 0
	};
	get [Symbol.toStringTag]() {
		return "Device";
	}
	constructor(t) {
		this.props = {
			...e.defaultProps,
			...t
		}, this.id = this.props.id || qi(this[Symbol.toStringTag].toLowerCase());
	}
	id;
	props;
	userData = {};
	statsManager = Gi;
	timestamp = 0;
	_reused = !1;
	_lumaData = {};
	getTextureFormatCapabilities(e) {
		let t = ba(e), n = (e) => (typeof e == "string" ? this.features.has(e) : e) ?? !0, r = n(t.create), i = {
			format: e,
			create: r,
			render: r && n(t.render),
			filter: r && n(t.filter),
			blend: r && n(t.blend),
			store: r && n(t.store)
		};
		return this._getDeviceSpecificTextureFormatCapabilities(i);
	}
	isTextureFormatSupported(e, t) {
		return this.getTextureFormatCapabilities(e).create;
	}
	isTextureFormatFilterable(e) {
		return this.getTextureFormatCapabilities(e).filter;
	}
	isTextureFormatRenderable(e) {
		return this.getTextureFormatCapabilities(e).render;
	}
	isTextureFormatCompressed(e) {
		return ga(e);
	}
	loseDevice() {
		return !1;
	}
	reportError(e) {
		this.props.onError(e);
	}
	getDefaultCanvasContext() {
		if (!this.canvasContext) throw Error("Device has no default CanvasContext. See props.createCanvasContext");
		return this.canvasContext;
	}
	createCommandEncoder(e = {}) {
		throw Error("not implemented");
	}
	incrementTimestamp() {
		return this.timestamp++;
	}
	onError(e) {
		this.props.onError(e);
	}
	getCanvasContext() {
		return this.getDefaultCanvasContext();
	}
	readPixelsToArrayWebGL(e, t) {
		throw Error("not implemented");
	}
	readPixelsToBufferWebGL(e, t) {
		throw Error("not implemented");
	}
	setParametersWebGL(e) {
		throw Error("not implemented");
	}
	getParametersWebGL(e) {
		throw Error("not implemented");
	}
	withParametersWebGL(e, t) {
		throw Error("not implemented");
	}
	clearWebGL(e) {
		throw Error("not implemented");
	}
	resetWebGL() {
		throw Error("not implemented");
	}
	static _getCanvasContextProps(e) {
		return e.createCanvasContext === !0 ? {} : e.createCanvasContext;
	}
	_normalizeBufferProps(e) {
		(e instanceof ArrayBuffer || ArrayBuffer.isView(e)) && (e = { data: e });
		let t = { ...e };
		return (e.usage || 0) & k.INDEX && !e.indexType && (e.data instanceof Uint32Array ? t.indexType = "uint32" : e.data instanceof Uint16Array ? t.indexType = "uint16" : D.warn("indices buffer content must be of integer type")()), t;
	}
}, wa = _() && typeof document < "u", Ta = () => wa && document.readyState === "complete", Ea = "set luma.log.level=1 (or higher) to trace rendering", Da = "No matching device found. Ensure `@luma.gl/webgl` and/or `@luma.gl/webgpu` modules are imported.", Oa = new class e {
	static defaultProps = {
		...Ca.defaultProps,
		type: "best-available",
		adapters: void 0,
		waitForPageLoad: !0
	};
	static pageLoaded = ka().then(() => {
		D.probe(2, "DOM is loaded")();
	});
	stats = Gi;
	log = D;
	VERSION = "9.1.10";
	spector;
	preregisteredAdapters = /* @__PURE__ */ new Map();
	constructor() {
		if (globalThis.luma) {
			if (globalThis.luma.VERSION !== this.VERSION) throw D.error(`Found luma.gl ${globalThis.luma.VERSION} while initialzing ${this.VERSION}`)(), D.error("'yarn why @luma.gl/core' can help identify the source of the conflict")(), Error("luma.gl - multiple versions detected: see console log");
			D.error("This version of luma.gl has already been initialized")();
		}
		D.log(1, `${this.VERSION} - ${Ea}`)(), globalThis.luma = this;
	}
	registerAdapters(e) {
		for (let t of e) this.preregisteredAdapters.set(t.type, t);
	}
	getSupportedAdapters(e = []) {
		let t = this.getAdapterMap(e);
		return Array.from(t).map(([, e]) => e).filter((e) => e.isSupported?.()).map((e) => e.type);
	}
	getBestAvailableAdapter(e = []) {
		let t = this.getAdapterMap(e);
		return t.get("webgpu")?.isSupported?.() ? "webgpu" : t.get("webgl")?.isSupported?.() ? "webgl" : null;
	}
	setDefaultDeviceProps(t) {
		Object.assign(e.defaultProps, t);
	}
	async createDevice(t = {}) {
		t = {
			...e.defaultProps,
			...t
		}, t.waitForPageLoad && await e.pageLoaded;
		let n = this.getAdapterMap(t.adapters), r = t.type || "";
		r === "best-available" && (r = this.getBestAvailableAdapter(t.adapters) || r);
		let i = await (this.getAdapterMap(t.adapters) || n).get(r)?.create?.(t);
		if (i) return i;
		throw Error(Da);
	}
	async attachDevice(t) {
		let n = this.getAdapterMap(t.adapters), r = "";
		t.handle instanceof WebGL2RenderingContext && (r = "webgl"), t.createCanvasContext && await e.pageLoaded, t.handle === null && (r = "unknown");
		let i = await n.get(r)?.attach?.(null);
		if (i) return i;
		throw Error(Da);
	}
	enforceWebGL2(e = !0, t = []) {
		let n = this.getAdapterMap(t).get("webgl");
		n || D.warn("enforceWebGL2: webgl adapter not found")(), n?.enforceWebGL2?.(e);
	}
	getAdapterMap(e = []) {
		let t = new Map(this.preregisteredAdapters);
		for (let n of e) t.set(n.type, n);
		return t;
	}
	registerDevices(e) {
		D.warn("luma.registerDevices() is deprecated, use luma.registerAdapters() instead");
		for (let t of e) {
			let e = t.adapter;
			e && this.preregisteredAdapters.set(e.type, e);
		}
	}
}();
function ka() {
	return Ta() || typeof window > "u" ? Promise.resolve() : new Promise((e) => {
		window.addEventListener("load", () => e());
	});
}
// node_modules/@luma.gl/core/dist/adapter/adapter.js
var Aa = class {}, ja = class e {
	static defaultProps = {
		canvas: null,
		width: 800,
		height: 600,
		useDevicePixels: !0,
		autoResize: !0,
		container: null,
		visible: !0,
		alphaMode: "opaque",
		colorSpace: "srgb"
	};
	id;
	props;
	canvas;
	htmlCanvas;
	offscreenCanvas;
	type;
	width = 1;
	height = 1;
	resizeObserver;
	_canvasSizeInfo = {
		clientWidth: 0,
		clientHeight: 0,
		devicePixelRatio: 1
	};
	toString() {
		return `${this[Symbol.toStringTag]}(${this.id})`;
	}
	constructor(t) {
		if (this.props = {
			...e.defaultProps,
			...t
		}, t = this.props, !_()) this.id = "node-canvas-context", this.type = "node", this.width = this.props.width, this.height = this.props.height, this.canvas = null;
		else {
			if (t.canvas) this.canvas = typeof t.canvas == "string" ? Na(t.canvas) : t.canvas;
			else {
				let e = Pa(t), n = Ma(t?.container || null);
				n.insertBefore(e, n.firstChild), this.canvas = e, t?.visible || (this.canvas.style.visibility = "hidden");
			}
			this.canvas instanceof HTMLCanvasElement ? (this.id = this.canvas.id, this.type = "html-canvas", this.htmlCanvas = this.canvas) : (this.id = "offscreen-canvas", this.type = "offscreen-canvas", this.offscreenCanvas = this.canvas), this.canvas instanceof HTMLCanvasElement && t.autoResize && (this.resizeObserver = new ResizeObserver((e) => {
				for (let t of e) t.target === this.canvas && this.update();
			}), this.resizeObserver.observe(this.canvas));
		}
	}
	getDevicePixelRatio(e) {
		return typeof OffscreenCanvas < "u" && this.canvas instanceof OffscreenCanvas || (e = e === void 0 ? this.props.useDevicePixels : e, !e || e <= 0) ? 1 : e === !0 ? typeof window < "u" && window.devicePixelRatio || 1 : e;
	}
	getPixelSize() {
		switch (this.type) {
			case "node": return [this.width, this.height];
			case "offscreen-canvas": return [this.canvas.width, this.canvas.height];
			case "html-canvas":
				let e = this.getDevicePixelRatio(), t = this.canvas;
				return t.parentElement ? [t.clientWidth * e, t.clientHeight * e] : [this.canvas.width, this.canvas.height];
			default: throw Error(this.type);
		}
	}
	getAspect() {
		let [e, t] = this.getPixelSize();
		return e / t;
	}
	cssToDeviceRatio() {
		try {
			let [e] = this.getDrawingBufferSize(), t = this._canvasSizeInfo.clientWidth || this.htmlCanvas?.clientWidth;
			return t ? e / t : 1;
		} catch {
			return 1;
		}
	}
	cssToDevicePixels(e, t = !0) {
		let n = this.cssToDeviceRatio(), [r, i] = this.getDrawingBufferSize();
		return Fa(e, n, r, i, t);
	}
	setDevicePixelRatio(e, t = {}) {
		if (!this.htmlCanvas) return;
		let n = "width" in t ? t.width : this.htmlCanvas.clientWidth, r = "height" in t ? t.height : this.htmlCanvas.clientHeight;
		n && r || (D.log(1, "Canvas clientWidth/clientHeight is 0")(), e = 1, n = this.htmlCanvas.width || 1, r = this.htmlCanvas.height || 1);
		let i = this._canvasSizeInfo;
		if (i.clientWidth !== n || i.clientHeight !== r || i.devicePixelRatio !== e) {
			let t = e, i = Math.floor(n * t), a = Math.floor(r * t);
			if (this.htmlCanvas.width = i, this.htmlCanvas.height = a, this.device.gl) {
				let [o, s] = this.getDrawingBufferSize();
				(o !== i || s !== a) && (t = Math.min(o / n, s / r), this.htmlCanvas.width = Math.floor(n * t), this.htmlCanvas.height = Math.floor(r * t), D.warn("Device pixel ratio clamped")()), this._canvasSizeInfo.clientWidth = n, this._canvasSizeInfo.clientHeight = r, this._canvasSizeInfo.devicePixelRatio = e;
			}
		}
	}
	getDrawingBufferSize() {
		let e = this.device.gl;
		return e ? [e.drawingBufferWidth, e.drawingBufferHeight] : this.getPixelSize();
	}
	_setAutoCreatedCanvasId(e) {
		this.htmlCanvas?.id === "lumagl-auto-created-canvas" && (this.htmlCanvas.id = e);
	}
};
function Ma(e) {
	if (typeof e == "string") {
		let t = document.getElementById(e);
		if (!t) throw Error(`${e} is not an HTML element`);
		return t;
	}
	return e || document.body;
}
function Na(e) {
	let t = document.getElementById(e);
	if (!(t instanceof HTMLCanvasElement)) throw Error("Object is not a canvas element");
	return t;
}
function Pa(e) {
	let { width: t, height: n } = e, r = document.createElement("canvas");
	return r.id = qi("lumagl-auto-created-canvas"), r.width = t || 1, r.height = n || 1, r.style.width = Number.isFinite(t) ? `${t}px` : "100%", r.style.height = Number.isFinite(n) ? `${n}px` : "100%", r;
}
function Fa(e, t, n, r, i) {
	let a = e, o = Ia(a[0], t, n), s = La(a[1], t, r, i), c = Ia(a[0] + 1, t, n), l = c === n - 1 ? c : c - 1;
	c = La(a[1] + 1, t, r, i);
	let u;
	return i ? (c = c === 0 ? c : c + 1, u = s, s = c) : u = c === r - 1 ? c : c - 1, {
		x: o,
		y: s,
		width: Math.max(l - o + 1, 1),
		height: Math.max(u - s + 1, 1)
	};
}
function Ia(e, t, n) {
	return Math.min(Math.round(e * t), n - 1);
}
function La(e, t, n, r) {
	return r ? Math.max(0, n - 1 - Math.round(e * t)) : Math.min(Math.round(e * t), n - 1);
}
// node_modules/@luma.gl/core/dist/adapter/resources/texture.js
var j = class e extends O {
	static COPY_SRC = 1;
	static COPY_DST = 2;
	static TEXTURE = 4;
	static STORAGE = 8;
	static RENDER_ATTACHMENT = 16;
	static CubeFaces = [
		"+X",
		"-X",
		"+Y",
		"-Y",
		"+Z",
		"-Z"
	];
	static defaultProps = {
		...O.defaultProps,
		data: null,
		dimension: "2d",
		format: "rgba8unorm",
		width: void 0,
		height: void 0,
		depth: 1,
		mipmaps: !1,
		compressed: !1,
		usage: 0,
		mipLevels: void 0,
		samples: void 0,
		sampler: {},
		view: void 0,
		flipY: void 0
	};
	get [Symbol.toStringTag]() {
		return "Texture";
	}
	toString() {
		return `Texture(${this.id},${this.format},${this.width}x${this.height})`;
	}
	dimension;
	format;
	width;
	height;
	depth;
	mipLevels;
	updateTimestamp;
	constructor(t, n) {
		if (n = e.normalizeProps(t, n), super(t, n, e.defaultProps), this.dimension = this.props.dimension, this.format = this.props.format, this.width = this.props.width, this.height = this.props.height, this.depth = this.props.depth, this.props.width === void 0 || this.props.height === void 0) {
			let t = e.getTextureDataSize(this.props.data);
			this.width = t?.width || 1, this.height = t?.height || 1;
		}
		this.props.mipmaps && this.props.mipLevels === void 0 && (this.props.mipLevels = "pyramid"), this.mipLevels = this.props.mipLevels === "pyramid" ? e.getMipLevelCount(this.width, this.height) : this.props.mipLevels || 1, this.updateTimestamp = t.incrementTimestamp();
	}
	clone(e) {
		return this.device.createTexture({
			...this.props,
			...e
		});
	}
	static isExternalImage(e) {
		return typeof ImageData < "u" && e instanceof ImageData || typeof ImageBitmap < "u" && e instanceof ImageBitmap || typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLVideoElement < "u" && e instanceof HTMLVideoElement || typeof VideoFrame < "u" && e instanceof VideoFrame || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof OffscreenCanvas < "u" && e instanceof OffscreenCanvas;
	}
	static getExternalImageSize(e) {
		if (typeof ImageData < "u" && e instanceof ImageData || typeof ImageBitmap < "u" && e instanceof ImageBitmap || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof OffscreenCanvas < "u" && e instanceof OffscreenCanvas) return {
			width: e.width,
			height: e.height
		};
		if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement) return {
			width: e.naturalWidth,
			height: e.naturalHeight
		};
		if (typeof HTMLVideoElement < "u" && e instanceof HTMLVideoElement) return {
			width: e.videoWidth,
			height: e.videoHeight
		};
		if (typeof VideoFrame < "u" && e instanceof VideoFrame) return {
			width: e.displayWidth,
			height: e.displayHeight
		};
		throw Error("Unknown image type");
	}
	static isTextureLevelData(e) {
		let t = e?.data;
		return ArrayBuffer.isView(t);
	}
	static getTextureDataSize(t) {
		if (!t || ArrayBuffer.isView(t)) return null;
		if (Array.isArray(t)) return e.getTextureDataSize(t[0]);
		if (e.isExternalImage(t)) return e.getExternalImageSize(t);
		if (t && typeof t == "object" && t.constructor === Object) {
			let e = Object.values(t)[0];
			return {
				width: e.width,
				height: e.height
			};
		}
		throw Error("texture size deduction failed");
	}
	static normalizeTextureData(e, t) {
		let n;
		return n = ArrayBuffer.isView(e) ? [{
			data: e,
			width: t.width,
			height: t.height
		}] : Array.isArray(e) ? e : [e], n;
	}
	static getMipLevelCount(e, t) {
		return Math.floor(Math.log2(Math.max(e, t))) + 1;
	}
	static getCubeFaceDepth(e) {
		switch (e) {
			case "+X": return 0;
			case "-X": return 1;
			case "+Y": return 2;
			case "-Y": return 3;
			case "+Z": return 4;
			case "-Z": return 5;
			default: throw Error(e);
		}
	}
	static defaultCopyExternalImageOptions = {
		image: void 0,
		sourceX: 0,
		sourceY: 0,
		width: void 0,
		height: void 0,
		depth: 1,
		mipLevel: 0,
		x: 0,
		y: 0,
		z: 0,
		aspect: "all",
		colorSpace: "srgb",
		premultipliedAlpha: !1,
		flipY: !1
	};
	static normalizeProps(e, t) {
		let n = { ...t }, r = e?.props?._resourceDefaults?.texture || {};
		Object.assign(n, r);
		let { width: i, height: a } = n;
		return typeof i == "number" && (n.width = Math.max(1, Math.ceil(i))), typeof a == "number" && (n.height = Math.max(1, Math.ceil(a))), n;
	}
}, Ra = class e extends O {
	static defaultProps = {
		...O.defaultProps,
		format: void 0,
		dimension: void 0,
		aspect: "all",
		baseMipLevel: 0,
		mipLevelCount: void 0,
		baseArrayLayer: 0,
		arrayLayerCount: void 0
	};
	get [Symbol.toStringTag]() {
		return "TextureView";
	}
	constructor(t, n) {
		super(t, n, e.defaultProps);
	}
};
// node_modules/@luma.gl/core/dist/adapter-utils/format-compiler-log.js
function za(e, t, n) {
	let r = "", i = t.split(/\r?\n/), a = e.slice().sort((e, t) => e.lineNum - t.lineNum);
	switch (n?.showSourceCode || "no") {
		case "all":
			let t = 0;
			for (let e = 1; e <= i.length; e++) for (r += Ha(i[e - 1], e, n); a.length > t && a[t].lineNum === e;) {
				let e = a[t++];
				r += Ba(e, i, e.lineNum, {
					...n,
					inlineSource: !1
				});
			}
			return r;
		case "issues":
		case "no":
			for (let t of e) r += Ba(t, i, t.lineNum, { inlineSource: n?.showSourceCode !== "no" });
			return r;
	}
}
function Ba(e, t, n, r) {
	if (r?.inlineSource) return `
${Va(t, n)}${e.linePos > 0 ? `${" ".repeat(e.linePos + 5)}^^^\n` : ""}${e.type.toUpperCase()}: ${e.message}

`;
	let i = e.type === "error" ? "red" : "#8B4000";
	return r?.html ? `<div class='luma-compiler-log-error' style="color:${i};"><b> ${e.type.toUpperCase()}: ${e.message}</b></div>` : `${e.type.toUpperCase()}: ${e.message}`;
}
function Va(e, t, n) {
	let r = "";
	for (let i = t - 2; i <= t; i++) {
		let a = e[i - 1];
		a !== void 0 && (r += Ha(a, t, n));
	}
	return r;
}
function Ha(e, t, n) {
	let r = n?.html ? Wa(e) : e;
	return `${Ua(String(t), 4)}: ${r}${n?.html ? "<br/>" : "\n"}`;
}
function Ua(e, t) {
	let n = "";
	for (let r = e.length; r < t; ++r) n += " ";
	return n + e;
}
function Wa(e) {
	return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
}
// node_modules/@luma.gl/core/dist/adapter/resources/shader.js
var Ga = class e extends O {
	static defaultProps = {
		...O.defaultProps,
		language: "auto",
		stage: void 0,
		source: "",
		sourceMap: null,
		entryPoint: "main",
		debugShaders: void 0
	};
	get [Symbol.toStringTag]() {
		return "Shader";
	}
	stage;
	source;
	compilationStatus = "pending";
	constructor(t, n) {
		n = {
			...n,
			debugShaders: n.debugShaders || t.props.debugShaders || "errors"
		}, super(t, {
			id: Ka(n),
			...n
		}, e.defaultProps), this.stage = this.props.stage, this.source = this.props.source;
	}
	getCompilationInfoSync() {
		return null;
	}
	getTranslatedSource() {
		return null;
	}
	async debugShader() {
		let e = this.props.debugShaders;
		switch (e) {
			case "never": return;
			case "errors": if (this.compilationStatus === "success") return;
		}
		let t = await this.getCompilationInfo();
		(e !== "warnings" || t?.length !== 0) && this._displayShaderLog(t);
	}
	_displayShaderLog(e) {
		if (typeof document > "u" || !document?.createElement) return;
		let t = qa(this.source), n = `${this.stage} ${t}`, r = za(e, this.source, {
			showSourceCode: "all",
			html: !0
		}), i = this.getTranslatedSource();
		i && (r += `<br /><br /><h1>Translated Source</h1><br /><br /><code style="user-select:text;"><pre>${i}</pre></code>`);
		let a = document.createElement("Button");
		a.innerHTML = `
<h1>Shader Compilation Error in ${n}</h1><br /><br />
<code style="user-select:text;"><pre>
${r}
</pre></code>`, a.style.top = "10px", a.style.left = "10px", a.style.position = "absolute", a.style.zIndex = "9999", a.style.width = "100%", a.style.textAlign = "left", document.body.appendChild(a), document.getElementsByClassName("luma-compiler-log-error")[0]?.scrollIntoView(), a.onclick = () => {
			let e = `data:text/plain,${encodeURIComponent(this.source)}`;
			navigator.clipboard.writeText(e);
		};
	}
};
function Ka(e) {
	return qa(e.source) || e.id || qi(`unnamed ${e.stage}-shader`);
}
function qa(e, t = "unnamed") {
	let n = /#define[\s*]SHADER_NAME[\s*]([A-Za-z0-9_-]+)[\s*]/.exec(e);
	return n ? n[1] : t;
}
// node_modules/@luma.gl/core/dist/adapter/resources/sampler.js
var Ja = class e extends O {
	static defaultProps = {
		...O.defaultProps,
		type: "color-sampler",
		addressModeU: "clamp-to-edge",
		addressModeV: "clamp-to-edge",
		addressModeW: "clamp-to-edge",
		magFilter: "nearest",
		minFilter: "nearest",
		mipmapFilter: "none",
		lodMinClamp: 0,
		lodMaxClamp: 32,
		compare: "less-equal",
		maxAnisotropy: 1
	};
	get [Symbol.toStringTag]() {
		return "Sampler";
	}
	constructor(t, n) {
		n = e.normalizeProps(t, n), super(t, n, e.defaultProps);
	}
	static normalizeProps(e, t) {
		let n = e?.props?._resourceDefaults?.sampler || {};
		return {
			...t,
			...n
		};
	}
}, Ya = class e extends O {
	static defaultProps = {
		...O.defaultProps,
		width: 1,
		height: 1,
		colorAttachments: [],
		depthStencilAttachment: null
	};
	get [Symbol.toStringTag]() {
		return "Framebuffer";
	}
	width;
	height;
	constructor(t, n = {}) {
		super(t, n, e.defaultProps), this.width = this.props.width, this.height = this.props.height;
	}
	clone(e) {
		let t = this.colorAttachments.map((t) => t.texture.clone(e)), n = this.depthStencilAttachment && this.depthStencilAttachment.texture.clone(e);
		return this.device.createFramebuffer({
			...this.props,
			colorAttachments: t,
			depthStencilAttachment: n
		});
	}
	resize(e) {
		let t = !e;
		if (e) {
			let [n, r] = Array.isArray(e) ? e : [e.width, e.height];
			t = t || r !== this.height || n !== this.width, this.width = n, this.height = r;
		}
		t && (D.log(2, `Resizing framebuffer ${this.id} to ${this.width}x${this.height}`)(), this.resizeAttachments(this.width, this.height));
	}
	autoCreateAttachmentTextures() {
		if (this.props.colorAttachments.length === 0 && !this.props.depthStencilAttachment) throw Error("Framebuffer has noattachments");
		this.colorAttachments = this.props.colorAttachments.map((e, t) => {
			if (typeof e == "string") {
				let n = this.createColorTexture(e, t);
				return this.attachResource(n), n.view;
			}
			return e instanceof j ? e.view : e;
		});
		let e = this.props.depthStencilAttachment;
		if (e) {
			if (typeof e == "string") {
				let t = this.createDepthStencilTexture(e);
				this.attachResource(t), this.depthStencilAttachment = t.view;
			} else this.depthStencilAttachment = e instanceof j ? e.view : e;
		}
	}
	createColorTexture(e, t) {
		return this.device.createTexture({
			id: `${this.id}-color-attachment-${t}`,
			usage: j.RENDER_ATTACHMENT,
			format: e,
			width: this.width,
			height: this.height,
			sampler: {
				magFilter: "linear",
				minFilter: "linear"
			}
		});
	}
	createDepthStencilTexture(e) {
		return this.device.createTexture({
			id: `${this.id}-depth-stencil-attachment`,
			usage: j.RENDER_ATTACHMENT,
			format: e,
			width: this.width,
			height: this.height,
			mipmaps: !1
		});
	}
	resizeAttachments(e, t) {
		for (let n = 0; n < this.colorAttachments.length; ++n) if (this.colorAttachments[n]) {
			let r = this.colorAttachments[n].texture.clone({
				width: e,
				height: t
			});
			this.destroyAttachedResource(this.colorAttachments[n]), this.colorAttachments[n] = r.view, this.attachResource(r.view);
		}
		if (this.depthStencilAttachment) {
			let n = this.depthStencilAttachment.texture.clone({
				width: e,
				height: t
			});
			this.destroyAttachedResource(this.depthStencilAttachment), this.depthStencilAttachment = n.view, this.attachResource(n);
		}
		this.updateAttachments();
	}
}, Xa = class e extends O {
	static defaultProps = {
		...O.defaultProps,
		vs: null,
		vertexEntryPoint: "vertexMain",
		vsConstants: {},
		fs: null,
		fragmentEntryPoint: "fragmentMain",
		fsConstants: {},
		shaderLayout: null,
		bufferLayout: [],
		topology: "triangle-list",
		parameters: {},
		bindings: {},
		uniforms: {}
	};
	get [Symbol.toStringTag]() {
		return "RenderPipeline";
	}
	shaderLayout;
	bufferLayout;
	linkStatus = "pending";
	hash = "";
	constructor(t, n) {
		super(t, n, e.defaultProps), this.shaderLayout = this.props.shaderLayout, this.bufferLayout = this.props.bufferLayout || [];
	}
	setUniformsWebGL(e) {
		throw Error("Use uniform blocks");
	}
}, Za = class e extends O {
	static defaultClearColor = [
		0,
		0,
		0,
		1
	];
	static defaultClearDepth = 1;
	static defaultClearStencil = 0;
	static defaultProps = {
		...O.defaultProps,
		framebuffer: null,
		parameters: void 0,
		clearColor: e.defaultClearColor,
		clearColors: void 0,
		clearDepth: e.defaultClearDepth,
		clearStencil: e.defaultClearStencil,
		depthReadOnly: !1,
		stencilReadOnly: !1,
		discard: !1,
		occlusionQuerySet: void 0,
		timestampQuerySet: void 0,
		beginTimestampIndex: void 0,
		endTimestampIndex: void 0
	};
	get [Symbol.toStringTag]() {
		return "RenderPass";
	}
	constructor(t, n) {
		n = e.normalizeProps(t, n), super(t, n, e.defaultProps);
	}
	static normalizeProps(e, t) {
		return {
			...e.props._resourceDefaults?.renderPass,
			...t
		};
	}
}, Qa = class e extends O {
	static defaultProps = {
		...O.defaultProps,
		shader: void 0,
		entryPoint: void 0,
		constants: {},
		shaderLayout: void 0
	};
	get [Symbol.toStringTag]() {
		return "ComputePipeline";
	}
	hash = "";
	shaderLayout;
	constructor(t, n) {
		super(t, n, e.defaultProps), this.shaderLayout = n.shaderLayout;
	}
}, $a = class e extends O {
	static defaultProps = {
		...O.defaultProps,
		measureExecutionTime: void 0
	};
	get [Symbol.toStringTag]() {
		return "CommandEncoder";
	}
	constructor(t, n) {
		super(t, n, e.defaultProps);
	}
}, eo = class e extends O {
	static defaultProps = { ...O.defaultProps };
	get [Symbol.toStringTag]() {
		return "CommandBuffer";
	}
	constructor(t, n) {
		super(t, n, e.defaultProps);
	}
};
// node_modules/@luma.gl/core/dist/gpu-type-utils/decode-attribute-type.js
function to(e) {
	let [t, n] = ro[e], r = t === "i32" || t === "u32", i = t !== "u32", a = io[t] * n;
	return {
		dataType: t,
		components: n,
		defaultVertexFormat: no(t, n),
		byteLength: a,
		integer: r,
		signed: i
	};
}
function no(e, t) {
	let n;
	switch (e) {
		case "f32":
			n = "float32";
			break;
		case "i32":
			n = "sint32";
			break;
		case "u32":
			n = "uint32";
			break;
		case "f16": return t <= 2 ? "float16x2" : "float16x4";
	}
	return t === 1 ? n : `${n}x${t}`;
}
var ro = {
	f32: ["f32", 1],
	"vec2<f32>": ["f32", 2],
	"vec3<f32>": ["f32", 3],
	"vec4<f32>": ["f32", 4],
	f16: ["f16", 1],
	"vec2<f16>": ["f16", 2],
	"vec3<f16>": ["f16", 3],
	"vec4<f16>": ["f16", 4],
	i32: ["i32", 1],
	"vec2<i32>": ["i32", 2],
	"vec3<i32>": ["i32", 3],
	"vec4<i32>": ["i32", 4],
	u32: ["u32", 1],
	"vec2<u32>": ["u32", 2],
	"vec3<u32>": ["u32", 3],
	"vec4<u32>": ["u32", 4]
}, io = {
	f32: 4,
	f16: 2,
	i32: 4,
	u32: 4
};
// node_modules/@luma.gl/core/dist/gpu-type-utils/decode-vertex-format.js
function ao(e) {
	let t;
	e.endsWith("-webgl") && (e.replace("-webgl", ""), t = !0);
	let [n, r] = e.split("x"), i = n, a = r ? parseInt(r) : 1, o = Yi(i), s = {
		type: i,
		components: a,
		byteLength: o.byteLength * a,
		integer: o.integer,
		signed: o.signed,
		normalized: o.normalized
	};
	return t && (s.webglOnly = !0), s;
}
// node_modules/@luma.gl/core/dist/adapter-utils/get-attribute-from-layouts.js
function oo(e, t) {
	let n = {};
	for (let r of e.attributes) {
		let i = co(e, t, r.name);
		i && (n[r.name] = i);
	}
	return n;
}
function so(e, t, n = 16) {
	let r = oo(e, t), i = Array(n).fill(null);
	for (let e of Object.values(r)) i[e.location] = e;
	return i;
}
function co(e, t, n) {
	let r = lo(e, n), i = uo(t, n);
	if (!r) return null;
	let a = to(r.type), o = i?.vertexFormat || a.defaultVertexFormat, s = ao(o);
	return {
		attributeName: i?.attributeName || r.name,
		bufferName: i?.bufferName || r.name,
		location: r.location,
		shaderType: r.type,
		shaderDataType: a.dataType,
		shaderComponents: a.components,
		vertexFormat: o,
		bufferDataType: s.type,
		bufferComponents: s.components,
		normalized: s.normalized,
		integer: a.integer,
		stepMode: i?.stepMode || r.stepMode || "vertex",
		byteOffset: i?.byteOffset || 0,
		byteStride: i?.byteStride || 0
	};
}
function lo(e, t) {
	let n = e.attributes.find((e) => e.name === t);
	return n || D.warn(`shader layout attribute "${t}" not present in shader`), n || null;
}
function uo(e, t) {
	fo(e);
	let n = po(e, t);
	return n || (n = mo(e, t), n) ? n : (D.warn(`layout for attribute "${t}" not present in buffer layout`), null);
}
function fo(e) {
	for (let t of e) (t.attributes && t.format || !t.attributes && !t.format) && D.warn(`BufferLayout ${name} must have either 'attributes' or 'format' field`);
}
function po(e, t) {
	for (let n of e) if (n.format && n.name === t) return {
		attributeName: n.name,
		bufferName: t,
		stepMode: n.stepMode,
		vertexFormat: n.format,
		byteOffset: 0,
		byteStride: n.byteStride || 0
	};
	return null;
}
function mo(e, t) {
	for (let n of e) {
		let e = n.byteStride;
		if (typeof n.byteStride != "number") for (let t of n.attributes || []) {
			let n = ao(t.format);
			e += n.byteLength;
		}
		let r = n.attributes?.find((e) => e.attribute === t);
		if (r) return {
			attributeName: r.attribute,
			bufferName: n.name,
			stepMode: n.stepMode,
			vertexFormat: r.format,
			byteOffset: r.byteOffset,
			byteStride: e
		};
	}
	return null;
}
// node_modules/@luma.gl/core/dist/adapter/resources/vertex-array.js
var ho = class e extends O {
	static defaultProps = {
		...O.defaultProps,
		renderPipeline: null
	};
	get [Symbol.toStringTag]() {
		return "VertexArray";
	}
	maxVertexAttributes;
	attributeInfos;
	indexBuffer = null;
	attributes;
	constructor(t, n) {
		super(t, n, e.defaultProps), this.maxVertexAttributes = t.limits.maxVertexAttributes, this.attributes = Array(this.maxVertexAttributes).fill(null);
		let { shaderLayout: r, bufferLayout: i } = n.renderPipeline || {};
		if (!r || !i) throw Error("VertexArray");
		this.attributeInfos = so(r, i, this.maxVertexAttributes);
	}
	setConstantWebGL(e, t) {
		this.device.reportError(/* @__PURE__ */ Error("constant attributes not supported"));
	}
}, go = class e extends O {
	static defaultProps = {
		...O.defaultProps,
		layout: void 0,
		buffers: {}
	};
	get [Symbol.toStringTag]() {
		return "TransformFeedback";
	}
	constructor(t, n) {
		super(t, n, e.defaultProps);
	}
}, _o = class e extends O {
	static defaultProps = {
		...O.defaultProps,
		type: void 0,
		count: void 0
	};
	get [Symbol.toStringTag]() {
		return "QuerySet";
	}
	constructor(t, n) {
		super(t, n, e.defaultProps);
	}
}, vo = {
	f32: {
		type: "f32",
		components: 1
	},
	i32: {
		type: "i32",
		components: 1
	},
	u32: {
		type: "u32",
		components: 1
	},
	"vec2<f32>": {
		type: "f32",
		components: 2
	},
	"vec3<f32>": {
		type: "f32",
		components: 3
	},
	"vec4<f32>": {
		type: "f32",
		components: 4
	},
	"vec2<i32>": {
		type: "i32",
		components: 2
	},
	"vec3<i32>": {
		type: "i32",
		components: 3
	},
	"vec4<i32>": {
		type: "i32",
		components: 4
	},
	"vec2<u32>": {
		type: "u32",
		components: 2
	},
	"vec3<u32>": {
		type: "u32",
		components: 3
	},
	"vec4<u32>": {
		type: "u32",
		components: 4
	},
	"mat2x2<f32>": {
		type: "f32",
		components: 4
	},
	"mat2x3<f32>": {
		type: "f32",
		components: 6
	},
	"mat2x4<f32>": {
		type: "f32",
		components: 8
	},
	"mat3x2<f32>": {
		type: "f32",
		components: 6
	},
	"mat3x3<f32>": {
		type: "f32",
		components: 9
	},
	"mat3x4<f32>": {
		type: "f32",
		components: 12
	},
	"mat4x2<f32>": {
		type: "f32",
		components: 8
	},
	"mat4x3<f32>": {
		type: "f32",
		components: 12
	},
	"mat4x4<f32>": {
		type: "f32",
		components: 16
	}
};
function yo(e) {
	return vo[e];
}
function bo(e, t) {
	switch (t) {
		case 1: return e;
		case 2: return e + e % 2;
		default: return e + (4 - e % 4) % 4;
	}
}
// node_modules/@luma.gl/core/dist/utils/array-utils-flat.js
var xo;
function So(e) {
	return (!xo || xo.byteLength < e) && (xo = new ArrayBuffer(e)), xo;
}
function Co(e, t) {
	return new e(So(e.BYTES_PER_ELEMENT * t), 0, t);
}
// node_modules/@luma.gl/core/dist/utils/is-array.js
function wo(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function To(e) {
	return Array.isArray(e) ? e.length === 0 || typeof e[0] == "number" : wo(e);
}
// node_modules/@luma.gl/core/dist/portable/uniform-buffer-layout.js
var Eo = 1024, Do = class {
	layout = {};
	byteLength;
	constructor(e) {
		let t = 0;
		for (let [n, r] of Object.entries(e)) {
			let { type: e, components: i } = yo(r);
			t = bo(t, i);
			let a = t;
			t += i, this.layout[n] = {
				type: e,
				size: i,
				offset: a
			};
		}
		t += (4 - t % 4) % 4;
		let n = t * 4;
		this.byteLength = Math.max(n, Eo);
	}
	getData(e) {
		let t = So(Math.max(this.byteLength, Eo)), n = {
			i32: new Int32Array(t),
			u32: new Uint32Array(t),
			f32: new Float32Array(t),
			f16: new Uint16Array(t)
		};
		for (let [t, r] of Object.entries(e)) {
			let e = this.layout[t];
			if (!e) {
				D.warn(`Supplied uniform value ${t} not present in uniform block layout`)();
				continue;
			}
			let { type: i, size: a, offset: o } = e, s = n[i];
			if (a === 1) {
				if (typeof r != "number" && typeof r != "boolean") {
					D.warn(`Supplied value for single component uniform ${t} is not a number: ${r}`)();
					continue;
				}
				s[o] = Number(r);
			} else {
				if (!To(r)) {
					D.warn(`Supplied value for multi component / array uniform ${t} is not a numeric array: ${r}`)();
					continue;
				}
				s.set(r, o);
			}
		}
		return new Uint8Array(t);
	}
	has(e) {
		return !!this.layout[e];
	}
	get(e) {
		return this.layout[e];
	}
};
// node_modules/@luma.gl/core/dist/utils/array-equal.js
function Oo(e, t, n = 16) {
	if (e !== t) return !1;
	let r = e, i = t;
	if (!To(r)) return !1;
	if (To(i) && r.length === i.length) {
		for (let e = 0; e < r.length; ++e) if (i[e] !== r[e]) return !1;
	}
	return !0;
}
function ko(e) {
	return To(e) ? e.slice() : e;
}
// node_modules/@luma.gl/core/dist/portable/uniform-block.js
var Ao = class {
	name;
	uniforms = {};
	modifiedUniforms = {};
	modified = !0;
	bindingLayout = {};
	needsRedraw = "initialized";
	constructor(e) {
		if (this.name = e?.name || "unnamed", e?.name && e?.shaderLayout) {
			let t = e?.shaderLayout.bindings?.find((t) => t.type === "uniform" && t.name === e?.name);
			if (!t) throw Error(e?.name);
			let n = t;
			for (let e of n.uniforms || []) this.bindingLayout[e.name] = e;
		}
	}
	setUniforms(e) {
		for (let [t, n] of Object.entries(e)) this._setUniform(t, n), this.needsRedraw || this.setNeedsRedraw(`${this.name}.${t}=${n}`);
	}
	setNeedsRedraw(e) {
		this.needsRedraw = this.needsRedraw || e;
	}
	getAllUniforms() {
		return this.modifiedUniforms = {}, this.needsRedraw = !1, this.uniforms || {};
	}
	_setUniform(e, t) {
		Oo(this.uniforms[e], t) || (this.uniforms[e] = ko(t), this.modifiedUniforms[e] = !0, this.modified = !0);
	}
}, jo = class {
	uniformBlocks = /* @__PURE__ */ new Map();
	uniformBufferLayouts = /* @__PURE__ */ new Map();
	uniformBuffers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let [t, n] of Object.entries(e)) {
			let e = t, r = new Do(n.uniformTypes || {});
			this.uniformBufferLayouts.set(e, r);
			let i = new Ao({ name: t });
			i.setUniforms(n.defaultUniforms || {}), this.uniformBlocks.set(e, i);
		}
	}
	destroy() {
		for (let e of this.uniformBuffers.values()) e.destroy();
	}
	setUniforms(e) {
		for (let [t, n] of Object.entries(e)) this.uniformBlocks.get(t)?.setUniforms(n);
		this.updateUniformBuffers();
	}
	getUniformBufferByteLength(e) {
		return this.uniformBufferLayouts.get(e)?.byteLength || 0;
	}
	getUniformBufferData(e) {
		let t = this.uniformBlocks.get(e)?.getAllUniforms() || {};
		return this.uniformBufferLayouts.get(e)?.getData(t);
	}
	createUniformBuffer(e, t, n) {
		n && this.setUniforms(n);
		let r = this.getUniformBufferByteLength(t), i = e.createBuffer({
			usage: k.UNIFORM | k.COPY_DST,
			byteLength: r
		}), a = this.getUniformBufferData(t);
		return i.write(a), i;
	}
	getManagedUniformBuffer(e, t) {
		if (!this.uniformBuffers.get(t)) {
			let n = this.getUniformBufferByteLength(t), r = e.createBuffer({
				usage: k.UNIFORM | k.COPY_DST,
				byteLength: n
			});
			this.uniformBuffers.set(t, r);
		}
		return this.uniformBuffers.get(t);
	}
	updateUniformBuffers() {
		let e = !1;
		for (let t of this.uniformBlocks.keys()) {
			let n = this.updateUniformBuffer(t);
			e ||= n;
		}
		return e && D.log(3, `UniformStore.updateUniformBuffers(): ${e}`)(), e;
	}
	updateUniformBuffer(e) {
		let t = this.uniformBlocks.get(e), n = this.uniformBuffers.get(e), r = !1;
		if (n && t?.needsRedraw) {
			r ||= t.needsRedraw;
			let i = this.getUniformBufferData(e);
			n = this.uniformBuffers.get(e), n?.write(i);
			let a = this.uniformBlocks.get(e)?.getAllUniforms();
			D.log(4, `Writing to uniform buffer ${String(e)}`, i, a)();
		}
		return r;
	}
};
// node_modules/@luma.gl/core/dist/gpu-type-utils/vertex-format-from-attribute.js
function Mo(e) {
	let t = ArrayBuffer.isView(e) ? e.constructor : e;
	switch (t) {
		case Float32Array: return "float32";
		case Uint16Array: return "uint16";
		case Uint32Array: return "uint32";
		case Uint8Array:
		case Uint8ClampedArray: return "uint8";
		case Int8Array: return "sint8";
		case Int16Array: return "sint16";
		case Int32Array: return "sint32";
		default: throw Error(t.constructor.name);
	}
}
function No(e) {
	switch (e) {
		case "float32": return Float32Array;
		case "uint32": return Uint32Array;
		case "sint32": return Int32Array;
		case "uint16":
		case "unorm16": return Uint16Array;
		case "sint16":
		case "snorm16": return Int16Array;
		case "uint8":
		case "unorm8": return Uint8Array;
		case "sint8":
		case "snorm8": return Int8Array;
		default: throw Error(e);
	}
}
function Po(e, t, n) {
	if (!t || t > 4) throw Error(`size ${t}`);
	let r = t, i = Mo(e);
	if (i === "uint8" && n && r === 1) return "unorm8-webgl";
	if (i === "uint8" && n && r === 3) return "unorm8x3-webgl";
	if (i === "uint8" || i === "sint8" || i === "uint16" || i === "sint16") {
		if (r === 1 || r === 3) throw Error(`size: ${t}`);
		return n && (i = i.replace("int", "norm")), `${i}x${r}`;
	}
	return r === 1 ? i : `${i}x${r}`;
}
// node_modules/@luma.gl/core/dist/adapter-utils/buffer-layout-helper.js
var Fo = class {
	bufferLayouts;
	constructor(e) {
		this.bufferLayouts = e;
	}
	getBufferLayout(e) {
		return this.bufferLayouts.find((t) => t.name === e) || null;
	}
	getAttributeNamesForBuffer(e) {
		return e.attributes ? e.attributes?.map((e) => e.attribute) : [e.name];
	}
	mergeBufferLayouts(e, t) {
		let n = [...e];
		for (let e of t) {
			let t = n.findIndex((t) => t.name === e.name);
			t < 0 ? n.push(e) : n[t] = e;
		}
		return n;
	}
	getBufferIndex(e) {
		let t = this.bufferLayouts.findIndex((t) => t.name === e);
		return t === -1 && D.warn(`BufferLayout: Missing buffer for "${e}".`)(), t;
	}
};
// node_modules/@luma.gl/core/dist/adapter-utils/buffer-layout-order.js
function Io(e, t) {
	let n = Object.fromEntries(e.attributes.map((e) => [e.name, e.location])), r = t.slice();
	return r.sort((e, t) => {
		let r = e.attributes ? e.attributes.map((e) => e.attribute) : [e.name], i = t.attributes ? t.attributes.map((e) => e.attribute) : [t.name];
		return Math.min(...r.map((e) => n[e])) - Math.min(...i.map((e) => n[e]));
	}), r;
}
// node_modules/wgsl_reflect/wgsl_reflect.module.js
var Lo = class {
	constructor(e, t) {
		this.name = e, this.attributes = t, this.size = 0;
	}
	get isArray() {
		return !1;
	}
	get isStruct() {
		return !1;
	}
	get isTemplate() {
		return !1;
	}
	get isPointer() {
		return !1;
	}
	getTypeName() {
		return this.name;
	}
}, Ro = class {
	constructor(e, t, n) {
		this.name = e, this.type = t, this.attributes = n, this.offset = 0, this.size = 0;
	}
	get isArray() {
		return this.type.isArray;
	}
	get isStruct() {
		return this.type.isStruct;
	}
	get isTemplate() {
		return this.type.isTemplate;
	}
	get align() {
		return this.type.isStruct ? this.type.align : 0;
	}
	get members() {
		return this.type.isStruct ? this.type.members : null;
	}
	get format() {
		return this.type.isArray || this.type.isTemplate ? this.type.format : null;
	}
	get count() {
		return this.type.isArray ? this.type.count : 0;
	}
	get stride() {
		return this.type.isArray ? this.type.stride : this.size;
	}
}, zo = class extends Lo {
	constructor(e, t) {
		super(e, t), this.members = [], this.align = 0, this.startLine = -1, this.endLine = -1, this.inUse = !1;
	}
	get isStruct() {
		return !0;
	}
}, Bo = class extends Lo {
	constructor(e, t) {
		super(e, t), this.count = 0, this.stride = 0;
	}
	get isArray() {
		return !0;
	}
	getTypeName() {
		return `array<${this.format.getTypeName()}, ${this.count}>`;
	}
}, Vo = class extends Lo {
	constructor(e, t, n) {
		super(e, n), this.format = t;
	}
	get isPointer() {
		return !0;
	}
	getTypeName() {
		return `&${this.format.getTypeName()}`;
	}
}, Ho = class extends Lo {
	constructor(e, t, n, r) {
		super(e, n), this.format = t, this.access = r;
	}
	get isTemplate() {
		return !0;
	}
	getTypeName() {
		let e = this.name;
		if (this.format !== null) {
			if (e === "vec2" || e === "vec3" || e === "vec4" || e === "mat2x2" || e === "mat2x3" || e === "mat2x4" || e === "mat3x2" || e === "mat3x3" || e === "mat3x4" || e === "mat4x2" || e === "mat4x3" || e === "mat4x4") {
				if (this.format.name === "f32") return e += "f", e;
				if (this.format.name === "i32") return e += "i", e;
				if (this.format.name === "u32") return e += "u", e;
				if (this.format.name === "bool") return e += "b", e;
				if (this.format.name === "f16") return e += "h", e;
			}
			e += `<${this.format.name}>`;
		} else if (e === "vec2" || e === "vec3" || e === "vec4") return e;
		return e;
	}
}, Uo;
((e) => {
	e[e.Uniform = 0] = "Uniform", e[e.Storage = 1] = "Storage", e[e.Immediate = 2] = "Immediate", e[e.Texture = 3] = "Texture", e[e.Sampler = 4] = "Sampler", e[e.StorageTexture = 5] = "StorageTexture";
})(Uo ||= {});
var Wo = class {
	constructor(e, t, n, r, i, a, o) {
		this.relations = null, this.name = e, this.type = t, this.group = n, this.binding = r, this.attributes = i, this.resourceType = a, this.access = o;
	}
	get isArray() {
		return this.type.isArray;
	}
	get isStruct() {
		return this.type.isStruct;
	}
	get isTemplate() {
		return this.type.isTemplate;
	}
	get size() {
		return this.type.size;
	}
	get align() {
		return this.type.isStruct ? this.type.align : 0;
	}
	get members() {
		return this.type.isStruct ? this.type.members : null;
	}
	get format() {
		return this.type.isArray || this.type.isTemplate ? this.type.format : null;
	}
	get count() {
		return this.type.isArray ? this.type.count : 0;
	}
	get stride() {
		return this.type.isArray ? this.type.stride : this.size;
	}
}, Go = class {
	constructor(e, t) {
		this.name = e, this.type = t;
	}
}, Ko = class {
	constructor(e, t, n, r) {
		this.name = e, this.type = t, this.locationType = n, this.location = r, this.interpolation = null;
	}
}, qo = class {
	constructor(e, t, n, r) {
		this.name = e, this.type = t, this.locationType = n, this.location = r;
	}
}, Jo = class {
	constructor(e, t, n, r) {
		this.name = e, this.type = t, this.attributes = n, this.id = r;
	}
}, Yo = class {
	constructor(e, t, n) {
		this.name = e, this.type = t, this.attributes = n;
	}
}, Xo = class {
	constructor(e, t = null, n) {
		this.stage = null, this.inputs = [], this.outputs = [], this.arguments = [], this.returnType = null, this.resources = [], this.overrides = [], this.workgroupSize = null, this.startLine = -1, this.endLine = -1, this.inUse = !1, this.calls = /* @__PURE__ */ new Set(), this.name = e, this.stage = t, this.attributes = n;
	}
}, Zo = class {
	constructor() {
		this.vertex = [], this.fragment = [], this.compute = [];
	}
};
function Qo(e) {
	var t = (32768 & e) >> 15, n = (31744 & e) >> 10, r = 1023 & e;
	return n == 0 ? (t ? -1 : 1) * 2 ** -14 * (r / 1024) : n == 31 ? r ? NaN : 1 / 0 * (t ? -1 : 1) : (t ? -1 : 1) * 2 ** (n - 15) * (1 + r / 1024);
}
var $o = /* @__PURE__ */ new Float32Array(1), es = new Int32Array($o.buffer), ts = /* @__PURE__ */ new Uint16Array(1);
function ns(e) {
	$o[0] = e;
	let t = es[0], n = t >> 31 & 1, r = t >> 23 & 255, i = 8388607 & t;
	if (r === 255) return ts[0] = n << 15 | 31744 | (i === 0 ? 0 : 512), ts[0];
	if (r === 0) {
		if (i === 0) return ts[0] = n << 15, ts[0];
		i |= 8388608;
		let e = 113;
		for (; !(8388608 & i);) i <<= 1, e--;
		return r = 127 - e, i &= 8388607, r > 0 ? (i = (i >> 126 - r) + (i >> 127 - r & 1), ts[0] = n << 15 | r << 10 | i >> 13, ts[0]) : (ts[0] = n << 15, ts[0]);
	}
	return r = r - 127 + 15, r >= 31 ? (ts[0] = n << 15 | 31744, ts[0]) : r <= 0 ? r < -10 ? (ts[0] = n << 15, ts[0]) : (i = (8388608 | i) >> 1 - r, ts[0] = n << 15 | i >> 13, ts[0]) : (i >>= 13, ts[0] = n << 15 | r << 10 | i, ts[0]);
}
var rs = /* @__PURE__ */ new Uint32Array(1), is = new Float32Array(rs.buffer, 0, 1);
function as(e) {
	return rs[0] = 112 + (e >> 6 & 31) << 23 | (63 & e) << 17, is[0];
}
function os(e, t, n, r, i, a, o, s, c) {
	let l = r * (o >>= i) * (a >>= i) + n * o + t * s;
	switch (c) {
		case "r8unorm": return [M(e, l, "8unorm", 1)[0]];
		case "r8snorm": return [M(e, l, "8snorm", 1)[0]];
		case "r8uint": return [M(e, l, "8uint", 1)[0]];
		case "r8sint": return [M(e, l, "8sint", 1)[0]];
		case "rg8unorm": {
			let t = M(e, l, "8unorm", 2);
			return [t[0], t[1]];
		}
		case "rg8snorm": {
			let t = M(e, l, "8snorm", 2);
			return [t[0], t[1]];
		}
		case "rg8uint": {
			let t = M(e, l, "8uint", 2);
			return [t[0], t[1]];
		}
		case "rg8sint": {
			let t = M(e, l, "8sint", 2);
			return [t[0], t[1]];
		}
		case "rgba8unorm-srgb":
		case "rgba8unorm": {
			let t = M(e, l, "8unorm", 4);
			return [
				t[0],
				t[1],
				t[2],
				t[3]
			];
		}
		case "rgba8snorm": {
			let t = M(e, l, "8snorm", 4);
			return [
				t[0],
				t[1],
				t[2],
				t[3]
			];
		}
		case "rgba8uint": {
			let t = M(e, l, "8uint", 4);
			return [
				t[0],
				t[1],
				t[2],
				t[3]
			];
		}
		case "rgba8sint": {
			let t = M(e, l, "8sint", 4);
			return [
				t[0],
				t[1],
				t[2],
				t[3]
			];
		}
		case "bgra8unorm-srgb":
		case "bgra8unorm": {
			let t = M(e, l, "8unorm", 4);
			return [
				t[2],
				t[1],
				t[0],
				t[3]
			];
		}
		case "r16uint": return [M(e, l, "16uint", 1)[0]];
		case "r16sint": return [M(e, l, "16sint", 1)[0]];
		case "r16float": return [M(e, l, "16float", 1)[0]];
		case "rg16uint": {
			let t = M(e, l, "16uint", 2);
			return [t[0], t[1]];
		}
		case "rg16sint": {
			let t = M(e, l, "16sint", 2);
			return [t[0], t[1]];
		}
		case "rg16float": {
			let t = M(e, l, "16float", 2);
			return [t[0], t[1]];
		}
		case "rgba16uint": {
			let t = M(e, l, "16uint", 4);
			return [
				t[0],
				t[1],
				t[2],
				t[3]
			];
		}
		case "rgba16sint": {
			let t = M(e, l, "16sint", 4);
			return [
				t[0],
				t[1],
				t[2],
				t[3]
			];
		}
		case "rgba16float": {
			let t = M(e, l, "16float", 4);
			return [
				t[0],
				t[1],
				t[2],
				t[3]
			];
		}
		case "r32uint": return [M(e, l, "32uint", 1)[0]];
		case "r32sint": return [M(e, l, "32sint", 1)[0]];
		case "depth16unorm":
		case "depth24plus":
		case "depth24plus-stencil8":
		case "depth32float":
		case "depth32float-stencil8":
		case "r32float": return [M(e, l, "32float", 1)[0]];
		case "rg32uint": {
			let t = M(e, l, "32uint", 2);
			return [t[0], t[1]];
		}
		case "rg32sint": {
			let t = M(e, l, "32sint", 2);
			return [t[0], t[1]];
		}
		case "rg32float": {
			let t = M(e, l, "32float", 2);
			return [t[0], t[1]];
		}
		case "rgba32uint": {
			let t = M(e, l, "32uint", 4);
			return [
				t[0],
				t[1],
				t[2],
				t[3]
			];
		}
		case "rgba32sint": {
			let t = M(e, l, "32sint", 4);
			return [
				t[0],
				t[1],
				t[2],
				t[3]
			];
		}
		case "rgba32float": {
			let t = M(e, l, "32float", 4);
			return [
				t[0],
				t[1],
				t[2],
				t[3]
			];
		}
		case "rg11b10ufloat": {
			let t = new Uint32Array(e.buffer, l, 1)[0], n = (4192256 & t) >> 11, r = (4290772992 & t) >> 22;
			return [
				as(2047 & t),
				as(n),
				function(e) {
					return rs[0] = 112 + (e >> 5 & 31) << 23 | (31 & e) << 18, is[0];
				}(r),
				1
			];
		}
	}
	return null;
}
function M(e, t, n, r) {
	let i = [
		0,
		0,
		0,
		0
	];
	for (let a = 0; a < r; ++a) switch (n) {
		case "8unorm":
			i[a] = e[t] / 255, t++;
			break;
		case "8snorm":
			i[a] = e[t] / 255 * 2 - 1, t++;
			break;
		case "8uint":
			i[a] = e[t], t++;
			break;
		case "8sint":
			i[a] = e[t] - 127, t++;
			break;
		case "16uint":
			i[a] = e[t] | e[t + 1] << 8, t += 2;
			break;
		case "16sint":
			i[a] = (e[t] | e[t + 1] << 8) - 32768, t += 2;
			break;
		case "16float":
			i[a] = Qo(e[t] | e[t + 1] << 8), t += 2;
			break;
		case "32uint":
		case "32sint":
			i[a] = e[t] | e[t + 1] << 8 | e[t + 2] << 16 | e[t + 3] << 24, t += 4;
			break;
		case "32float": i[a] = new Float32Array(e.buffer, t, 1)[0], t += 4;
	}
	return i;
}
function N(e, t, n, r, i) {
	for (let a = 0; a < r; ++a) switch (n) {
		case "8unorm":
			e[t] = 255 * i[a], t++;
			break;
		case "8snorm":
			e[t] = .5 * (i[a] + 1) * 255, t++;
			break;
		case "8uint":
			e[t] = i[a], t++;
			break;
		case "8sint":
			e[t] = i[a] + 127, t++;
			break;
		case "16uint":
			new Uint16Array(e.buffer, t, 1)[0] = i[a], t += 2;
			break;
		case "16sint":
			new Int16Array(e.buffer, t, 1)[0] = i[a], t += 2;
			break;
		case "16float": {
			let n = ns(i[a]);
			new Uint16Array(e.buffer, t, 1)[0] = n, t += 2;
			break;
		}
		case "32uint":
			new Uint32Array(e.buffer, t, 1)[0] = i[a], t += 4;
			break;
		case "32sint":
			new Int32Array(e.buffer, t, 1)[0] = i[a], t += 4;
			break;
		case "32float": new Float32Array(e.buffer, t, 1)[0] = i[a], t += 4;
	}
	return i;
}
var ss = {
	r8unorm: {
		bytesPerBlock: 1,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 1
	},
	r8snorm: {
		bytesPerBlock: 1,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 1
	},
	r8uint: {
		bytesPerBlock: 1,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 1
	},
	r8sint: {
		bytesPerBlock: 1,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 1
	},
	rg8unorm: {
		bytesPerBlock: 2,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 2
	},
	rg8snorm: {
		bytesPerBlock: 2,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 2
	},
	rg8uint: {
		bytesPerBlock: 2,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 2
	},
	rg8sint: {
		bytesPerBlock: 2,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 2
	},
	rgba8unorm: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	"rgba8unorm-srgb": {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	rgba8snorm: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	rgba8uint: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	rgba8sint: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	bgra8unorm: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	"bgra8unorm-srgb": {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	r16uint: {
		bytesPerBlock: 2,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 1
	},
	r16sint: {
		bytesPerBlock: 2,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 1
	},
	r16float: {
		bytesPerBlock: 2,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 1
	},
	rg16uint: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 2
	},
	rg16sint: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 2
	},
	rg16float: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 2
	},
	rgba16uint: {
		bytesPerBlock: 8,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	rgba16sint: {
		bytesPerBlock: 8,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	rgba16float: {
		bytesPerBlock: 8,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	r32uint: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 1
	},
	r32sint: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 1
	},
	r32float: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 1
	},
	rg32uint: {
		bytesPerBlock: 8,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 2
	},
	rg32sint: {
		bytesPerBlock: 8,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 2
	},
	rg32float: {
		bytesPerBlock: 8,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 2
	},
	rgba32uint: {
		bytesPerBlock: 16,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	rgba32sint: {
		bytesPerBlock: 16,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	rgba32float: {
		bytesPerBlock: 16,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	rgb10a2uint: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	rgb10a2unorm: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	rg11b10ufloat: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	stencil8: {
		bytesPerBlock: 1,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		isDepthStencil: !0,
		hasDepth: !1,
		hasStencil: !0,
		channels: 1
	},
	depth16unorm: {
		bytesPerBlock: 2,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		isDepthStencil: !0,
		hasDepth: !0,
		hasStencil: !1,
		channels: 1
	},
	depth24plus: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		isDepthStencil: !0,
		hasDepth: !0,
		hasStencil: !1,
		depthOnlyFormat: "depth32float",
		channels: 1
	},
	"depth24plus-stencil8": {
		bytesPerBlock: 8,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		isDepthStencil: !0,
		hasDepth: !0,
		hasStencil: !0,
		depthOnlyFormat: "depth32float",
		channels: 1
	},
	depth32float: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		isDepthStencil: !0,
		hasDepth: !0,
		hasStencil: !1,
		channels: 1
	},
	"depth32float-stencil8": {
		bytesPerBlock: 8,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		isDepthStencil: !0,
		hasDepth: !0,
		hasStencil: !0,
		stencilOnlyFormat: "depth32float",
		channels: 1
	},
	rgb9e5ufloat: {
		bytesPerBlock: 4,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !1,
		channels: 4
	},
	"bc1-rgba-unorm": {
		bytesPerBlock: 8,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"bc1-rgba-unorm-srgb": {
		bytesPerBlock: 8,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"bc2-rgba-unorm": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"bc2-rgba-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"bc3-rgba-unorm": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"bc3-rgba-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"bc4-r-unorm": {
		bytesPerBlock: 8,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 1
	},
	"bc4-r-snorm": {
		bytesPerBlock: 8,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 1
	},
	"bc5-rg-unorm": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 2
	},
	"bc5-rg-snorm": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 2
	},
	"bc6h-rgb-ufloat": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"bc6h-rgb-float": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"bc7-rgba-unorm": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"bc7-rgba-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"etc2-rgb8unorm": {
		bytesPerBlock: 8,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"etc2-rgb8unorm-srgb": {
		bytesPerBlock: 8,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"etc2-rgb8a1unorm": {
		bytesPerBlock: 8,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"etc2-rgb8a1unorm-srgb": {
		bytesPerBlock: 8,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"etc2-rgba8unorm": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"etc2-rgba8unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"eac-r11unorm": {
		bytesPerBlock: 8,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !0,
		channels: 1
	},
	"eac-r11snorm": {
		bytesPerBlock: 8,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !0,
		channels: 1
	},
	"eac-rg11unorm": {
		bytesPerBlock: 16,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !0,
		channels: 2
	},
	"eac-rg11snorm": {
		bytesPerBlock: 16,
		blockWidth: 1,
		blockHeight: 1,
		isCompressed: !0,
		channels: 2
	},
	"astc-4x4-unorm": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"astc-4x4-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 4,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"astc-5x4-unorm": {
		bytesPerBlock: 16,
		blockWidth: 5,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"astc-5x4-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 5,
		blockHeight: 4,
		isCompressed: !0,
		channels: 4
	},
	"astc-5x5-unorm": {
		bytesPerBlock: 16,
		blockWidth: 5,
		blockHeight: 5,
		isCompressed: !0,
		channels: 4
	},
	"astc-5x5-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 5,
		blockHeight: 5,
		isCompressed: !0,
		channels: 4
	},
	"astc-6x5-unorm": {
		bytesPerBlock: 16,
		blockWidth: 6,
		blockHeight: 5,
		isCompressed: !0,
		channels: 4
	},
	"astc-6x5-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 6,
		blockHeight: 5,
		isCompressed: !0,
		channels: 4
	},
	"astc-6x6-unorm": {
		bytesPerBlock: 16,
		blockWidth: 6,
		blockHeight: 6,
		isCompressed: !0,
		channels: 4
	},
	"astc-6x6-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 6,
		blockHeight: 6,
		isCompressed: !0,
		channels: 4
	},
	"astc-8x5-unorm": {
		bytesPerBlock: 16,
		blockWidth: 8,
		blockHeight: 5,
		isCompressed: !0,
		channels: 4
	},
	"astc-8x5-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 8,
		blockHeight: 5,
		isCompressed: !0,
		channels: 4
	},
	"astc-8x6-unorm": {
		bytesPerBlock: 16,
		blockWidth: 8,
		blockHeight: 6,
		isCompressed: !0,
		channels: 4
	},
	"astc-8x6-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 8,
		blockHeight: 6,
		isCompressed: !0,
		channels: 4
	},
	"astc-8x8-unorm": {
		bytesPerBlock: 16,
		blockWidth: 8,
		blockHeight: 8,
		isCompressed: !0,
		channels: 4
	},
	"astc-8x8-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 8,
		blockHeight: 8,
		isCompressed: !0,
		channels: 4
	},
	"astc-10x5-unorm": {
		bytesPerBlock: 16,
		blockWidth: 10,
		blockHeight: 5,
		isCompressed: !0,
		channels: 4
	},
	"astc-10x5-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 10,
		blockHeight: 5,
		isCompressed: !0,
		channels: 4
	},
	"astc-10x6-unorm": {
		bytesPerBlock: 16,
		blockWidth: 10,
		blockHeight: 6,
		isCompressed: !0,
		channels: 4
	},
	"astc-10x6-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 10,
		blockHeight: 6,
		isCompressed: !0,
		channels: 4
	},
	"astc-10x8-unorm": {
		bytesPerBlock: 16,
		blockWidth: 10,
		blockHeight: 8,
		isCompressed: !0,
		channels: 4
	},
	"astc-10x8-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 10,
		blockHeight: 8,
		isCompressed: !0,
		channels: 4
	},
	"astc-10x10-unorm": {
		bytesPerBlock: 16,
		blockWidth: 10,
		blockHeight: 10,
		isCompressed: !0,
		channels: 4
	},
	"astc-10x10-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 10,
		blockHeight: 10,
		isCompressed: !0,
		channels: 4
	},
	"astc-12x10-unorm": {
		bytesPerBlock: 16,
		blockWidth: 12,
		blockHeight: 10,
		isCompressed: !0,
		channels: 4
	},
	"astc-12x10-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 12,
		blockHeight: 10,
		isCompressed: !0,
		channels: 4
	},
	"astc-12x12-unorm": {
		bytesPerBlock: 16,
		blockWidth: 12,
		blockHeight: 12,
		isCompressed: !0,
		channels: 4
	},
	"astc-12x12-unorm-srgb": {
		bytesPerBlock: 16,
		blockWidth: 12,
		blockHeight: 12,
		isCompressed: !0,
		channels: 4
	}
}, cs = class e {
	constructor() {
		this.id = e._id++, this.line = 0, this.start = -1, this.end = -1;
	}
	get hasSpan() {
		return this.start >= 0 && this.end >= this.start;
	}
	get isAstNode() {
		return !0;
	}
	get astNodeType() {
		return "";
	}
	search(e) {
		e(this);
	}
	searchBlock(e, t) {
		if (e) {
			t(ls.instance);
			for (let n of e) n instanceof Array ? this.searchBlock(n, t) : n.search(t);
			t(us.instance);
		}
	}
	constEvaluate(e, t) {
		throw Error("Cannot evaluate node");
	}
	constEvaluateString(e) {
		return this.constEvaluate(e)?.toString() ?? "";
	}
};
cs._id = 0;
var ls = class extends cs {};
ls.instance = new ls();
var us = class extends cs {};
us.instance = new us();
var ds = /* @__PURE__ */ new Set(/* @__PURE__ */ "all.any.select.arrayLength.abs.acos.acosh.asin.asinh.atan.atanh.atan2.ceil.clamp.cos.cosh.countLeadingZeros.countOneBits.countTrailingZeros.cross.degrees.determinant.distance.dot.dot4U8Packed.dot4I8Packed.exp.exp2.extractBits.faceForward.firstLeadingBit.firstTrailingBit.floor.fma.fract.frexp.insertBits.inverseSqrt.ldexp.length.log.log2.max.min.mix.modf.normalize.pow.quantizeToF16.radians.reflect.refract.reverseBits.round.saturate.sign.sin.sinh.smoothstep.sqrt.step.tan.tanh.transpose.trunc.dpdx.dpdxCoarse.dpdxFine.dpdy.dpdyCoarse.dpdyFine.fwidth.fwidthCoarse.fwidthFine.textureDimensions.textureGather.textureGatherCompare.textureLoad.textureNumLayers.textureNumLevels.textureNumSamples.textureSample.textureSampleBias.textureSampleCompare.textureSampleCompareLevel.textureSampleGrad.textureSampleLevel.textureSampleBaseClampToEdge.textureStore.atomicLoad.atomicStore.atomicAdd.atomicSub.atomicMax.atomicMin.atomicAnd.atomicOr.atomicXor.atomicExchange.atomicCompareExchangeWeak.pack4x8snorm.pack4x8unorm.pack4xI8.pack4xU8.pack4x8Clamp.pack4xU8Clamp.pack2x16snorm.pack2x16unorm.pack2x16float.unpack4x8snorm.unpack4x8unorm.unpack4xI8.unpack4xU8.unpack2x16snorm.unpack2x16unorm.unpack2x16float.storageBarrier.textureBarrier.workgroupBarrier.workgroupUniformLoad.subgroupAdd.subgroupExclusiveAdd.subgroupInclusiveAdd.subgroupAll.subgroupAnd.subgroupAny.subgroupBallot.subgroupBroadcast.subgroupBroadcastFirst.subgroupElect.subgroupMax.subgroupMin.subgroupMul.subgroupExclusiveMul.subgroupInclusiveMul.subgroupOr.subgroupShuffle.subgroupShuffleDown.subgroupShuffleUp.subgroupShuffleXor.subgroupXor.quadBroadcast.quadSwapDiagonal.quadSwapX.quadSwapY".split(".")), P = class extends cs {}, fs = class extends P {
	constructor(e, t, n, r, i, a) {
		super(), this.calls = /* @__PURE__ */ new Set(), this.name = e, this.args = t, this.returnType = n, this.body = r, this.startLine = i, this.endLine = a;
	}
	get astNodeType() {
		return "function";
	}
	search(e) {
		if (this.attributes) for (let t of this.attributes) e(t);
		e(this);
		for (let t of this.args) e(t);
		this.searchBlock(this.body, e);
	}
}, ps = class extends P {
	constructor(e) {
		super(), this.expression = e;
	}
	get astNodeType() {
		return "staticAssert";
	}
	search(e) {
		this.expression.search(e);
	}
}, ms = class extends P {
	constructor(e, t) {
		super(), this.condition = e, this.body = t;
	}
	get astNodeType() {
		return "while";
	}
	search(e) {
		this.condition.search(e), this.searchBlock(this.body, e);
	}
}, hs = class extends P {
	constructor(e, t) {
		super(), this.body = e, this.loopId = t;
	}
	get astNodeType() {
		return "continuing";
	}
	search(e) {
		this.searchBlock(this.body, e);
	}
}, gs = class extends P {
	constructor(e, t, n, r) {
		super(), this.init = e, this.condition = t, this.increment = n, this.body = r;
	}
	get astNodeType() {
		return "for";
	}
	search(e) {
		var t, n, r;
		(t = this.init) == null || t.search(e), (n = this.condition) == null || n.search(e), (r = this.increment) == null || r.search(e), this.searchBlock(this.body, e);
	}
}, _s = class extends P {
	constructor(e, t, n, r, i) {
		super(), this.attributes = null, this.name = e, this.type = t, this.storage = n, this.access = r, this.value = i;
	}
	get astNodeType() {
		return "var";
	}
	search(e) {
		var t;
		e(this), (t = this.value) == null || t.search(e);
	}
}, vs = class extends P {
	constructor(e, t, n) {
		super(), this.attributes = null, this.name = e, this.type = t, this.value = n;
	}
	get astNodeType() {
		return "override";
	}
	search(e) {
		var t;
		(t = this.value) == null || t.search(e);
	}
}, ys = class extends P {
	constructor(e, t, n, r, i) {
		super(), this.attributes = null, this.name = e, this.type = t, this.storage = n, this.access = r, this.value = i;
	}
	get astNodeType() {
		return "let";
	}
	search(e) {
		var t;
		e(this), (t = this.value) == null || t.search(e);
	}
}, bs = class extends P {
	constructor(e, t, n, r, i) {
		super(), this.attributes = null, this.name = e, this.type = t, this.storage = n, this.access = r, this.value = i;
	}
	get astNodeType() {
		return "const";
	}
	constEvaluate(e, t) {
		return this.value.constEvaluate(e, t);
	}
	search(e) {
		var t;
		e(this), (t = this.value) == null || t.search(e);
	}
}, xs, Ss, F, I;
((e) => {
	e.increment = "++", e.decrement = "--";
})(xs ||= {}), ((e) => {
	e.parse = function(t) {
		let n = t;
		if (n === "parse") throw Error("Invalid value for IncrementOperator");
		return e[n];
	};
})(xs ||= {});
var Cs = class extends P {
	constructor(e, t) {
		super(), this.operator = e, this.variable = t;
	}
	get astNodeType() {
		return "increment";
	}
	search(e) {
		this.variable.search(e);
	}
};
((e) => {
	e.assign = "=", e.addAssign = "+=", e.subtractAssign = "-=", e.multiplyAssign = "*=", e.divideAssign = "/=", e.moduloAssign = "%=", e.andAssign = "&=", e.orAssign = "|=", e.xorAssign = "^=", e.shiftLeftAssign = "<<=", e.shiftRightAssign = ">>=";
})(Ss ||= {}), ((e) => {
	e.parse = function(e) {
		let t = e;
		if (t === "parse") throw Error("Invalid value for AssignOperator");
		return t;
	};
})(Ss ||= {});
var ws = class extends P {
	constructor(e, t, n) {
		super(), this.operator = e, this.variable = t, this.value = n;
	}
	get astNodeType() {
		return "assign";
	}
	search(e) {
		this.variable.search(e), this.value.search(e);
	}
}, Ts = class extends P {
	constructor(e, t) {
		super(), this.name = e, this.args = t;
	}
	get astNodeType() {
		return "call";
	}
	isBuiltin() {
		return ds.has(this.name);
	}
	search(e) {
		for (let t of this.args) t.search(e);
		e(this);
	}
}, Es = class extends P {
	constructor(e, t) {
		super(), this.body = e, this.continuing = t;
	}
	get astNodeType() {
		return "loop";
	}
	search(e) {
		var t;
		this.searchBlock(this.body, e), (t = this.continuing) == null || t.search(e);
	}
}, Ds = class extends P {
	constructor(e, t) {
		super(), this.condition = e, this.cases = t;
	}
	get astNodeType() {
		return "switch";
	}
	search(e) {
		e(this);
		for (let t of this.cases) t.search(e);
	}
}, Os = class extends P {
	constructor(e, t, n, r) {
		super(), this.condition = e, this.body = t, this.elseif = n, this.else = r;
	}
	get astNodeType() {
		return "if";
	}
	search(e) {
		this.condition.search(e), this.searchBlock(this.body, e), this.searchBlock(this.elseif, e), this.searchBlock(this.else, e);
	}
}, ks = class extends P {
	constructor(e) {
		super(), this.value = e;
	}
	get astNodeType() {
		return "return";
	}
	search(e) {
		var t;
		(t = this.value) == null || t.search(e);
	}
}, As = class extends P {
	constructor(e) {
		super(), this.name = e;
	}
	get astNodeType() {
		return "enable";
	}
}, js = class extends P {
	constructor(e) {
		super(), this.extensions = e;
	}
	get astNodeType() {
		return "requires";
	}
}, Ms = class extends P {
	constructor(e, t) {
		super(), this.severity = e, this.rule = t;
	}
	get astNodeType() {
		return "diagnostic";
	}
}, Ns = class extends P {
	constructor(e, t) {
		super(), this.name = e, this.type = t;
	}
	get astNodeType() {
		return "alias";
	}
}, Ps = class extends P {
	get astNodeType() {
		return "discard";
	}
}, Fs = class extends P {
	constructor() {
		super(...arguments), this.condition = null, this.loopId = -1;
	}
	get astNodeType() {
		return "break";
	}
}, Is = class extends P {
	constructor() {
		super(...arguments), this.loopId = -1;
	}
	get astNodeType() {
		return "continue";
	}
}, L = class e extends P {
	constructor(e) {
		super(), this.attributes = null, this.name = e;
	}
	get astNodeType() {
		return "type";
	}
	get isStruct() {
		return !1;
	}
	get isArray() {
		return !1;
	}
	static maxFormatType(t) {
		let n = t[0];
		if (n.name === "f32") return n;
		for (let r = 1; r < t.length; ++r) {
			let i = e._priority.get(n.name);
			e._priority.get(t[r].name) < i && (n = t[r]);
		}
		return n.name === "x32" ? e.i32 : n;
	}
	getTypeName() {
		return this.name;
	}
};
L.x32 = new L("x32"), L.f32 = new L("f32"), L.i32 = new L("i32"), L.u32 = new L("u32"), L.f16 = new L("f16"), L.bool = new L("bool"), L.void = new L("void"), L._priority = /* @__PURE__ */ new Map([
	["f32", 0],
	["f16", 1],
	["u32", 2],
	["i32", 3],
	["x32", 3]
]);
var Ls = class extends L {
	constructor(e) {
		super(e);
	}
}, Rs = class extends L {
	constructor(e, t, n, r) {
		super(e), this.members = t, this.startLine = n, this.endLine = r;
	}
	get astNodeType() {
		return "struct";
	}
	get isStruct() {
		return !0;
	}
	getMemberIndex(e) {
		for (let t = 0; t < this.members.length; t++) if (this.members[t].name === e) return t;
		return -1;
	}
	search(e) {
		for (let t of this.members) e(t);
	}
}, R = class extends L {
	constructor(e, t, n) {
		super(e), this.format = t, this.access = n;
	}
	get astNodeType() {
		return "template";
	}
	getTypeName() {
		let e = this.name;
		if (this.format !== null) {
			if (e === "vec2" || e === "vec3" || e === "vec4" || e === "mat2x2" || e === "mat2x3" || e === "mat2x4" || e === "mat3x2" || e === "mat3x3" || e === "mat3x4" || e === "mat4x2" || e === "mat4x3" || e === "mat4x4") {
				if (this.format.name === "f32") return e += "f", e;
				if (this.format.name === "i32") return e += "i", e;
				if (this.format.name === "u32") return e += "u", e;
				if (this.format.name === "bool") return e += "b", e;
				if (this.format.name === "f16") return e += "h", e;
			}
			e += `<${this.format.name}>`;
		} else if (e === "vec2" || e === "vec3" || e === "vec4") return e;
		return e;
	}
};
R.vec2f = new R("vec2", L.f32, null), R.vec3f = new R("vec3", L.f32, null), R.vec4f = new R("vec4", L.f32, null), R.vec2i = new R("vec2", L.i32, null), R.vec3i = new R("vec3", L.i32, null), R.vec4i = new R("vec4", L.i32, null), R.vec2u = new R("vec2", L.u32, null), R.vec3u = new R("vec3", L.u32, null), R.vec4u = new R("vec4", L.u32, null), R.vec2h = new R("vec2", L.f16, null), R.vec3h = new R("vec3", L.f16, null), R.vec4h = new R("vec4", L.f16, null), R.vec2b = new R("vec2", L.bool, null), R.vec3b = new R("vec3", L.bool, null), R.vec4b = new R("vec4", L.bool, null), R.mat2x2f = new R("mat2x2", L.f32, null), R.mat2x3f = new R("mat2x3", L.f32, null), R.mat2x4f = new R("mat2x4", L.f32, null), R.mat3x2f = new R("mat3x2", L.f32, null), R.mat3x3f = new R("mat3x3", L.f32, null), R.mat3x4f = new R("mat3x4", L.f32, null), R.mat4x2f = new R("mat4x2", L.f32, null), R.mat4x3f = new R("mat4x3", L.f32, null), R.mat4x4f = new R("mat4x4", L.f32, null), R.mat2x2h = new R("mat2x2", L.f16, null), R.mat2x3h = new R("mat2x3", L.f16, null), R.mat2x4h = new R("mat2x4", L.f16, null), R.mat3x2h = new R("mat3x2", L.f16, null), R.mat3x3h = new R("mat3x3", L.f16, null), R.mat3x4h = new R("mat3x4", L.f16, null), R.mat4x2h = new R("mat4x2", L.f16, null), R.mat4x3h = new R("mat4x3", L.f16, null), R.mat4x4h = new R("mat4x4", L.f16, null), R.mat2x2i = new R("mat2x2", L.i32, null), R.mat2x3i = new R("mat2x3", L.i32, null), R.mat2x4i = new R("mat2x4", L.i32, null), R.mat3x2i = new R("mat3x2", L.i32, null), R.mat3x3i = new R("mat3x3", L.i32, null), R.mat3x4i = new R("mat3x4", L.i32, null), R.mat4x2i = new R("mat4x2", L.i32, null), R.mat4x3i = new R("mat4x3", L.i32, null), R.mat4x4i = new R("mat4x4", L.i32, null), R.mat2x2u = new R("mat2x2", L.u32, null), R.mat2x3u = new R("mat2x3", L.u32, null), R.mat2x4u = new R("mat2x4", L.u32, null), R.mat3x2u = new R("mat3x2", L.u32, null), R.mat3x3u = new R("mat3x3", L.u32, null), R.mat3x4u = new R("mat3x4", L.u32, null), R.mat4x2u = new R("mat4x2", L.u32, null), R.mat4x3u = new R("mat4x3", L.u32, null), R.mat4x4u = new R("mat4x4", L.u32, null);
var zs = class extends L {
	constructor(e, t, n, r) {
		super(e), this.storage = t, this.type = n, this.access = r;
	}
	get astNodeType() {
		return "pointer";
	}
}, Bs = class extends L {
	constructor(e, t, n, r) {
		super(e), this.attributes = t, this.format = n, this.count = r;
	}
	get astNodeType() {
		return "array";
	}
	get isArray() {
		return !0;
	}
}, Vs = class extends L {
	constructor(e, t, n) {
		super(e), this.format = t, this.access = n;
	}
	get astNodeType() {
		return "sampler";
	}
}, Hs = class extends cs {
	constructor() {
		super(), this.postfix = null, this.hasParen = !1;
	}
}, Us = class extends Hs {
	constructor(e) {
		super(), this.value = e;
	}
	get astNodeType() {
		return "stringExpr";
	}
	toString() {
		return this.value;
	}
	constEvaluateString() {
		return this.value;
	}
}, Ws = class extends Hs {
	constructor(e, t) {
		super(), this.type = e, this.args = t;
	}
	get astNodeType() {
		return "createExpr";
	}
	search(e) {
		if (e(this), this.args) for (let t of this.args) t.search(e);
	}
	constEvaluate(e, t) {
		return t && (t[0] = this.type), e.evalExpression(this, e.context);
	}
}, Gs = class e extends Hs {
	constructor(e, t) {
		super(), this.cachedReturnValue = null, this.name = e, this.args = t;
	}
	get astNodeType() {
		return "callExpr";
	}
	setCachedReturnValue(e) {
		this.cachedReturnValue = e;
	}
	get isBuiltin() {
		return ds.has(this.name);
	}
	constEvaluate(e, t) {
		let n = e.evalExpression(this, e.context);
		return t !== void 0 && this._resolveReturnType(e, t), n;
	}
	_resolveReturnType(t, n) {
		let r = t.context.getFunction(this.name);
		if (r !== null) return void (r.node.returnType !== null && (n[0] = r.node.returnType));
		let i = e._builtinFixedReturnType.get(this.name);
		if (i !== void 0) return void (n[0] = i);
		let a = e._builtinSameAsArg.get(this.name);
		if (a !== void 0 && this.args && this.args[a]) return void this.args[a].constEvaluate(t, n);
		let o = e._builtinComponentOfArg.get(this.name);
		if (o !== void 0 && this.args && this.args[o]) {
			let e = [L.f32];
			this.args[o].constEvaluate(t, e), n[0] = e[0] instanceof R && e[0].format !== null ? e[0].format : e[0];
		}
	}
	search(e) {
		for (let t of this.args) t.search(e);
		e(this);
	}
};
Gs._builtinFixedReturnType = /* @__PURE__ */ new Map([
	["all", L.bool],
	["any", L.bool],
	["arrayLength", L.u32],
	["dot4U8Packed", L.u32],
	["dot4I8Packed", L.i32],
	["pack4x8snorm", L.u32],
	["pack4x8unorm", L.u32],
	["pack4xI8", L.u32],
	["pack4xU8", L.u32],
	["pack4x8Clamp", L.u32],
	["pack4xU8Clamp", L.u32],
	["pack2x16snorm", L.u32],
	["pack2x16unorm", L.u32],
	["pack2x16float", L.u32],
	["unpack4x8snorm", R.vec4f],
	["unpack4x8unorm", R.vec4f],
	["unpack4xI8", R.vec4i],
	["unpack4xU8", R.vec4u],
	["unpack2x16snorm", R.vec2f],
	["unpack2x16unorm", R.vec2f],
	["unpack2x16float", R.vec2f],
	["storageBarrier", L.void],
	["textureBarrier", L.void],
	["workgroupBarrier", L.void],
	["atomicStore", L.void]
]), Gs._builtinSameAsArg = /* @__PURE__ */ new Map([
	["abs", 0],
	["acos", 0],
	["acosh", 0],
	["asin", 0],
	["asinh", 0],
	["atan", 0],
	["atanh", 0],
	["atan2", 0],
	["ceil", 0],
	["clamp", 0],
	["cos", 0],
	["cosh", 0],
	["countLeadingZeros", 0],
	["countOneBits", 0],
	["countTrailingZeros", 0],
	["cross", 0],
	["degrees", 0],
	["exp", 0],
	["exp2", 0],
	["extractBits", 0],
	["faceForward", 0],
	["firstLeadingBit", 0],
	["firstTrailingBit", 0],
	["floor", 0],
	["fma", 0],
	["fract", 0],
	["insertBits", 0],
	["inverseSqrt", 0],
	["ldexp", 0],
	["log", 0],
	["log2", 0],
	["max", 0],
	["min", 0],
	["mix", 0],
	["normalize", 0],
	["pow", 0],
	["quantizeToF16", 0],
	["radians", 0],
	["reflect", 0],
	["refract", 0],
	["reverseBits", 0],
	["round", 0],
	["saturate", 0],
	["sign", 0],
	["sin", 0],
	["sinh", 0],
	["smoothstep", 2],
	["sqrt", 0],
	["step", 1],
	["tan", 0],
	["tanh", 0],
	["trunc", 0],
	["dpdx", 0],
	["dpdxCoarse", 0],
	["dpdxFine", 0],
	["dpdy", 0],
	["dpdyCoarse", 0],
	["dpdyFine", 0],
	["fwidth", 0],
	["fwidthCoarse", 0],
	["fwidthFine", 0],
	["select", 0],
	["workgroupUniformLoad", 0],
	["atomicLoad", 0],
	["atomicAdd", 1],
	["atomicSub", 1],
	["atomicMax", 1],
	["atomicMin", 1],
	["atomicAnd", 1],
	["atomicOr", 1],
	["atomicXor", 1],
	["atomicExchange", 1],
	["subgroupAdd", 0],
	["subgroupExclusiveAdd", 0],
	["subgroupInclusiveAdd", 0],
	["subgroupAnd", 0],
	["subgroupBroadcast", 0],
	["subgroupBroadcastFirst", 0],
	["subgroupMax", 0],
	["subgroupMin", 0],
	["subgroupMul", 0],
	["subgroupExclusiveMul", 0],
	["subgroupInclusiveMul", 0],
	["subgroupOr", 0],
	["subgroupShuffle", 0],
	["subgroupShuffleDown", 0],
	["subgroupShuffleUp", 0],
	["subgroupShuffleXor", 0],
	["subgroupXor", 0],
	["quadBroadcast", 0],
	["quadSwapDiagonal", 0],
	["quadSwapX", 0],
	["quadSwapY", 0]
]), Gs._builtinComponentOfArg = /* @__PURE__ */ new Map([
	["length", 0],
	["distance", 0],
	["dot", 0],
	["determinant", 0]
]);
var Ks = class extends Hs {
	constructor(e) {
		super(), this.name = e;
	}
	get astNodeType() {
		return "varExpr";
	}
	search(e) {
		e(this), this.postfix && this.postfix.search(e);
	}
	constEvaluate(e, t) {
		let n = e.evalExpression(this, e.context);
		if (t !== void 0 && this.postfix === null) {
			let n = e.context.getVariable(this.name);
			n !== null && n.node !== null && n.node.type !== null && (t[0] = n.node.type);
		}
		return n;
	}
}, qs = class extends Hs {
	constructor(e, t) {
		super(), this.name = e, this.initializer = t;
	}
	get astNodeType() {
		return "constExpr";
	}
	constEvaluate(e, t) {
		let n = e.evalExpression(this.initializer, e.context);
		return t !== void 0 && this.initializer.constEvaluate(e, t), n !== null && this.postfix ? n.getSubData(e, this.postfix, e.context) : n;
	}
	search(e) {
		this.initializer.search(e);
	}
}, z = class extends Hs {
	constructor(e, t) {
		super(), this.value = e, this.type = t;
	}
	get astNodeType() {
		return "literalExpr";
	}
	constEvaluate(e, t) {
		return t !== void 0 && (t[0] = this.type), this.value;
	}
	get isScalar() {
		return this.value instanceof V;
	}
	get isVector() {
		return this.value instanceof H || this.value instanceof U;
	}
	get scalarValue() {
		return this.value instanceof V ? this.value.value : 0;
	}
	get vectorValue() {
		return this.value instanceof H || this.value instanceof U ? this.value.data : /* @__PURE__ */ new Float32Array();
	}
}, Js = class extends Hs {
	constructor(e, t) {
		super(), this.type = e, this.value = t;
	}
	get astNodeType() {
		return "bitcastExpr";
	}
	search(e) {
		this.value.search(e);
	}
}, Ys = class extends Hs {
	constructor(e) {
		super(), typeof e == "number" && (e = new z(new V(new Uint32Array([e]), new Lo("u32", null)), L.u32)), this.index = e;
	}
	search(e) {
		this.index.search(e);
	}
}, Xs = class extends Hs {
	constructor() {
		super();
	}
}, B = class extends Xs {
	constructor(e, t) {
		super(), this.operator = e, this.right = t;
	}
	get astNodeType() {
		return "unaryOp";
	}
	constEvaluate(e, t) {
		let n = e.evalExpression(this, e.context);
		return t !== void 0 && (this.operator === "!" ? t[0] = L.bool : this.right.constEvaluate(e, t)), n;
	}
	search(e) {
		this.right.search(e);
	}
}, Zs = class extends Xs {
	constructor(e, t, n) {
		super(), this.operator = e, this.left = t, this.right = n;
	}
	get astNodeType() {
		return "binaryOp";
	}
	_getPromotedType(e, t) {
		return e.name === t.name ? e : e.name === "f32" || t.name === "f32" ? L.f32 : e.name === "u32" || t.name === "u32" ? L.u32 : L.i32;
	}
	constEvaluate(e, t) {
		let n = e.evalExpression(this, e.context);
		if (t !== void 0) switch (this.operator) {
			case "==":
			case "!=":
			case "<":
			case ">":
			case "<=":
			case ">=":
			case "&&":
			case "||":
				t[0] = L.bool;
				break;
			default: {
				let n = [L.f32], r = [L.f32];
				this.left.constEvaluate(e, n), this.right.constEvaluate(e, r), t[0] = this._getPromotedType(n[0], r[0]);
				break;
			}
		}
		return n;
	}
	search(e) {
		this.left.search(e), this.right.search(e);
	}
}, Qs = class extends cs {
	constructor(e) {
		super(), this.body = e;
	}
	search(e) {
		e(this), this.searchBlock(this.body, e);
	}
}, $s = class extends Hs {
	get astNodeType() {
		return "default";
	}
}, ec = class extends Qs {
	constructor(e, t) {
		super(t), this.selectors = e;
	}
	get astNodeType() {
		return "case";
	}
	search(e) {
		this.searchBlock(this.body, e);
	}
}, tc = class extends Qs {
	constructor(e) {
		super(e);
	}
	get astNodeType() {
		return "default";
	}
	search(e) {
		this.searchBlock(this.body, e);
	}
}, nc = class extends cs {
	constructor(e, t, n) {
		super(), this.name = e, this.type = t, this.attributes = n;
	}
	get astNodeType() {
		return "argument";
	}
}, rc = class extends cs {
	constructor(e, t) {
		super(), this.condition = e, this.body = t;
	}
	get astNodeType() {
		return "elseif";
	}
	search(e) {
		this.condition.search(e), this.searchBlock(this.body, e);
	}
}, ic = class extends cs {
	constructor(e, t, n) {
		super(), this.name = e, this.type = t, this.attributes = n;
	}
	get astNodeType() {
		return "member";
	}
}, ac = class extends cs {
	constructor(e, t) {
		super(), this.name = e, this.value = t;
	}
	get astNodeType() {
		return "attribute";
	}
}, oc = class e {
	constructor(t, n) {
		this.parent = null, this.typeInfo = t, this.parent = n, this.id = e._id++;
	}
	setDataValue(e, t, n, r) {}
	getSubData(e, t, n) {
		return null;
	}
	toString() {
		return `<${this.typeInfo.getTypeName()}>`;
	}
};
oc._id = 0;
var sc = class extends oc {
	constructor(e, t) {
		super(e, t);
	}
	clone() {
		return this;
	}
	toString() {
		return this.typeInfo.name;
	}
}, cc = class extends oc {
	constructor() {
		super(new Lo("void", null), null);
	}
	clone() {
		return this;
	}
	toString() {
		return "void";
	}
};
cc.void = new cc();
var lc = class extends oc {
	constructor(e) {
		super(new Vo("pointer", e.typeInfo, null), null), this.reference = e;
	}
	clone() {
		return this;
	}
	setDataValue(e, t, n, r) {
		this.reference.setDataValue(e, t, n, r);
	}
	getSubData(e, t, n) {
		return t ? this.reference.getSubData(e, t, n) : this;
	}
	toString() {
		return `&${this.reference.toString()}`;
	}
}, V = class e extends oc {
	constructor(e, t, n = null) {
		super(t, n), e instanceof Int32Array || e instanceof Uint32Array || e instanceof Float32Array ? this.data = e : this.typeInfo.name === "x32" ? this.data = e - Math.floor(e) === 0 ? e >= 0 ? new Uint32Array([e]) : new Int32Array([e]) : new Float32Array([e]) : this.typeInfo.name === "i32" || this.typeInfo.name === "bool" ? this.data = new Int32Array([e]) : this.typeInfo.name === "u32" ? this.data = new Uint32Array([e]) : (this.typeInfo.name === "f32" || this.typeInfo.name === "f16") && (this.data = new Float32Array([e]));
	}
	clone() {
		if (this.data instanceof Float32Array) return new e(new Float32Array(this.data), this.typeInfo, null);
		if (this.data instanceof Int32Array) return new e(new Int32Array(this.data), this.typeInfo, null);
		if (this.data instanceof Uint32Array) return new e(new Uint32Array(this.data), this.typeInfo, null);
		throw Error("ScalarData: Invalid data type");
	}
	get value() {
		return this.data[0];
	}
	set value(e) {
		this.data[0] = e;
	}
	setDataValue(t, n, r, i) {
		if (r || !(n instanceof e)) return;
		let a = n.data[0];
		this.typeInfo.name === "i32" || this.typeInfo.name === "u32" ? a = Math.floor(a) : this.typeInfo.name === "bool" && (a = +!!a), this.data[0] = a;
	}
	getSubData(e, t, n) {
		return t ? null : this;
	}
	toString() {
		return `${this.value}`;
	}
};
function uc(e, t, n) {
	let r = t.length;
	return r === 2 ? n === "f32" ? new H(new Float32Array(t), e.getTypeInfo("vec2f")) : n === "i32" || n === "bool" ? new H(new Int32Array(t), e.getTypeInfo("vec2i")) : n === "u32" ? new H(new Uint32Array(t), e.getTypeInfo("vec2u")) : n === "f16" ? new H(new Float32Array(t), e.getTypeInfo("vec2h")) : null : r === 3 ? n === "f32" ? new H(new Float32Array(t), e.getTypeInfo("vec3f")) : n === "i32" || n === "bool" ? new H(new Int32Array(t), e.getTypeInfo("vec3i")) : n === "u32" ? new H(new Uint32Array(t), e.getTypeInfo("vec3u")) : n === "f16" ? new H(new Float32Array(t), e.getTypeInfo("vec3h")) : null : r === 4 ? n === "f32" ? new H(new Float32Array(t), e.getTypeInfo("vec4f")) : n === "i32" || n === "bool" ? new H(new Int32Array(t), e.getTypeInfo("vec4i")) : n === "u32" ? new H(new Uint32Array(t), e.getTypeInfo("vec4u")) : n === "f16" ? new H(new Float32Array(t), e.getTypeInfo("vec4h")) : null : null;
}
var H = class e extends oc {
	constructor(e, t, n = null) {
		if (super(t, n), e instanceof Float32Array || e instanceof Uint32Array || e instanceof Int32Array) this.data = e;
		else {
			let t = this.typeInfo.name;
			t === "vec2f" || t === "vec3f" || t === "vec4f" ? this.data = new Float32Array(e) : t === "vec2i" || t === "vec3i" || t === "vec4i" ? this.data = new Int32Array(e) : t === "vec2u" || t === "vec3u" || t === "vec4u" ? this.data = new Uint32Array(e) : t === "vec2h" || t === "vec3h" || t === "vec4h" ? this.data = new Float32Array(e) : t === "vec2b" || t === "vec3b" || t === "vec4b" ? this.data = new Int32Array(e) : (t === "vec2" || t === "vec3" || t === "vec4") && (this.data = new Float32Array(e));
		}
	}
	clone() {
		if (this.data instanceof Float32Array) return new e(new Float32Array(this.data), this.typeInfo, null);
		if (this.data instanceof Int32Array) return new e(new Int32Array(this.data), this.typeInfo, null);
		if (this.data instanceof Uint32Array) return new e(new Uint32Array(this.data), this.typeInfo, null);
		throw Error("VectorData: Invalid data type");
	}
	setDataValue(t, n, r, i) {
		r instanceof Us || n instanceof e && (this.data = n.data);
	}
	getSubData(e, t, n) {
		if (t === null) return this;
		let r = e.getTypeInfo("f32");
		if (this.typeInfo instanceof Ho) r = this.typeInfo.format || r;
		else {
			let t = this.typeInfo.name;
			t === "vec2f" || t === "vec3f" || t === "vec4f" ? r = e.getTypeInfo("f32") : t === "vec2i" || t === "vec3i" || t === "vec4i" ? r = e.getTypeInfo("i32") : t === "vec2b" || t === "vec3b" || t === "vec4b" ? r = e.getTypeInfo("bool") : t === "vec2u" || t === "vec3u" || t === "vec4u" ? r = e.getTypeInfo("u32") : (t === "vec2h" || t === "vec3h" || t === "vec4h") && (r = e.getTypeInfo("f16"));
		}
		let i = this;
		for (; t !== null && i !== null;) {
			if (t instanceof Ys) {
				let a = t.index, o = -1;
				if (a instanceof z) {
					if (!(a.value instanceof V)) return null;
					o = a.value.value;
				} else {
					let t = e.evalExpression(a, n);
					if (!(t instanceof V)) return null;
					o = t.value;
				}
				if (o < 0 || o >= i.data.length) return null;
				if (i.data instanceof Float32Array) return new V(new Float32Array(i.data.buffer, i.data.byteOffset + 4 * o, 1), r);
				if (i.data instanceof Int32Array) return new V(new Int32Array(i.data.buffer, i.data.byteOffset + 4 * o, 1), r);
				if (i.data instanceof Uint32Array) return new V(new Uint32Array(i.data.buffer, i.data.byteOffset + 4 * o, 1), r);
				throw Error("GetSubData: Invalid data type");
			}
			if (!(t instanceof Us)) return null;
			{
				let n = t.value.toLowerCase();
				if (n.length === 1) {
					let e = 0;
					if (n === "x" || n === "r") e = 0;
					else if (n === "y" || n === "g") e = 1;
					else if (n === "z" || n === "b") e = 2;
					else {
						if (n !== "w" && n !== "a") return null;
						e = 3;
					}
					if (this.data instanceof Float32Array) return new V(new Float32Array(this.data.buffer, this.data.byteOffset + 4 * e, 1), r, this);
					if (this.data instanceof Int32Array) return new V(new Int32Array(this.data.buffer, this.data.byteOffset + 4 * e, 1), r, this);
					if (this.data instanceof Uint32Array) return new V(new Uint32Array(this.data.buffer, this.data.byteOffset + 4 * e, 1), r, this);
				}
				let a = [];
				for (let e of n) e === "x" || e === "r" ? a.push(this.data[0]) : e === "y" || e === "g" ? a.push(this.data[1]) : e === "z" || e === "b" ? a.push(this.data[2]) : (e === "w" || e === "a") && a.push(this.data[3]);
				i = uc(e, a, r.name);
			}
			t = t.postfix;
		}
		return i;
	}
	toString() {
		let e = `${this.data[0]}`;
		for (let t = 1; t < this.data.length; ++t) e += `, ${this.data[t]}`;
		return e;
	}
}, U = class e extends oc {
	constructor(e, t, n = null) {
		super(t, n), this.data = e instanceof Float32Array ? e : new Float32Array(e);
	}
	clone() {
		return new e(new Float32Array(this.data), this.typeInfo, null);
	}
	setDataValue(t, n, r, i) {
		r instanceof Us || n instanceof e && (this.data = n.data);
	}
	getSubData(e, t, n) {
		if (t === null) return this;
		let r = this.typeInfo.name;
		if (e.getTypeInfo("f32"), this.typeInfo instanceof Ho) this.typeInfo.format;
		else if (r.endsWith("f")) e.getTypeInfo("f32");
		else if (r.endsWith("i")) e.getTypeInfo("i32");
		else if (r.endsWith("u")) e.getTypeInfo("u32");
		else {
			if (!r.endsWith("h")) return null;
			e.getTypeInfo("f16");
		}
		if (t instanceof Ys) {
			let i = t.index, a = -1;
			if (i instanceof z) {
				if (!(i.value instanceof V)) return null;
				a = i.value.value;
			} else {
				let t = e.evalExpression(i, n);
				if (!(t instanceof V)) return null;
				a = t.value;
			}
			if (a < 0 || a >= this.data.length) return null;
			let o = r.endsWith("h") ? "h" : "f", s;
			if (r === "mat2x2" || r === "mat2x2f" || r === "mat2x2h" || r === "mat3x2" || r === "mat3x2f" || r === "mat3x2h" || r === "mat4x2" || r === "mat4x2f" || r === "mat4x2h") s = new H(new Float32Array(this.data.buffer, this.data.byteOffset + 2 * a * 4, 2), e.getTypeInfo(`vec2${o}`));
			else if (r === "mat2x3" || r === "mat2x3f" || r === "mat2x3h" || r === "mat3x3" || r === "mat3x3f" || r === "mat3x3h" || r === "mat4x3" || r === "mat4x3f" || r === "mat4x3h") s = new H(new Float32Array(this.data.buffer, this.data.byteOffset + 3 * a * 4, 3), e.getTypeInfo(`vec3${o}`));
			else {
				if (r !== "mat2x4" && r !== "mat2x4f" && r !== "mat2x4h" && r !== "mat3x4" && r !== "mat3x4f" && r !== "mat3x4h" && r !== "mat4x4" && r !== "mat4x4f" && r !== "mat4x4h") return null;
				s = new H(new Float32Array(this.data.buffer, this.data.byteOffset + 4 * a * 4, 4), e.getTypeInfo(`vec4${o}`));
			}
			return t.postfix ? s.getSubData(e, t.postfix, n) : s;
		}
		return null;
	}
	toString() {
		let e = `${this.data[0]}`;
		for (let t = 1; t < this.data.length; ++t) e += `, ${this.data[t]}`;
		return e;
	}
}, W = class e extends oc {
	constructor(e, t, n = 0, r = null) {
		super(t, r), this.buffer = e instanceof ArrayBuffer ? e : e.buffer, this.offset = n;
	}
	clone() {
		let t = new Uint8Array(new Uint8Array(this.buffer, this.offset, this.typeInfo.size));
		return new e(t.buffer, this.typeInfo, 0, null);
	}
	setDataValue(e, t, n, r) {
		if (t === null) return;
		let i = this.offset, a = this.typeInfo;
		for (; n;) {
			if (n instanceof Ys) {
				if (a instanceof Bo) {
					let t = n.index;
					if (t instanceof z) {
						if (!(t.value instanceof V)) return;
						i += t.value.value * a.stride;
					} else {
						let n = e.evalExpression(t, r);
						if (!(n instanceof V)) return;
						i += n.value * a.stride;
					}
					a = a.format;
				}
			} else {
				if (!(n instanceof Us)) return;
				{
					let e = n.value;
					if (a instanceof zo) {
						let t = !1;
						for (let n of a.members) if (n.name === e) {
							i += n.offset, a = n.type, t = !0;
							break;
						}
						if (!t) return;
					} else if (a instanceof Lo) {
						let n = a.getTypeName(), r = 0;
						if (e === "x" || e === "r") r = 0;
						else if (e === "y" || e === "g") r = 1;
						else if (e === "z" || e === "b") r = 2;
						else {
							if (e !== "w" && e !== "a") return;
							r = 3;
						}
						if (!(t instanceof V)) return;
						let o = t.value;
						n === "vec2f" ? new Float32Array(this.buffer, i, 2)[r] = o : n === "vec3f" ? new Float32Array(this.buffer, i, 3)[r] = o : n === "vec4f" ? new Float32Array(this.buffer, i, 4)[r] = o : n === "vec2i" ? new Int32Array(this.buffer, i, 2)[r] = o : n === "vec3i" ? new Int32Array(this.buffer, i, 3)[r] = o : n === "vec4i" ? new Int32Array(this.buffer, i, 4)[r] = o : n === "vec2u" ? new Uint32Array(this.buffer, i, 2)[r] = o : n === "vec3u" ? new Uint32Array(this.buffer, i, 3)[r] = o : n === "vec4u" && (new Uint32Array(this.buffer, i, 4)[r] = o);
						return;
					}
				}
			}
			n = n.postfix;
		}
		this.setData(e, t, a, i, r);
	}
	setData(t, n, r, i, a) {
		let o = r.getTypeName();
		if (o !== "f32" && o !== "f16") {
			if (o !== "i32" && o !== "atomic<i32>" && o !== "x32") {
				if (o !== "u32" && o !== "atomic<u32>") {
					if (o !== "bool") {
						if (o === "vec2f" || o === "vec2h") {
							let e = new Float32Array(this.buffer, i, 2);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1]) : (e[0] = n[0], e[1] = n[1]);
							return;
						}
						if (o === "vec3f" || o === "vec3h") {
							let e = new Float32Array(this.buffer, i, 3);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1], e[2] = n.data[2]) : (e[0] = n[0], e[1] = n[1], e[2] = n[2]);
							return;
						}
						if (o === "vec4f" || o === "vec4h") {
							let e = new Float32Array(this.buffer, i, 4);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1], e[2] = n.data[2], e[3] = n.data[3]) : (e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3]);
							return;
						}
						if (o === "vec2i") {
							let e = new Int32Array(this.buffer, i, 2);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1]) : (e[0] = n[0], e[1] = n[1]);
							return;
						}
						if (o === "vec3i") {
							let e = new Int32Array(this.buffer, i, 3);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1], e[2] = n.data[2]) : (e[0] = n[0], e[1] = n[1], e[2] = n[2]);
							return;
						}
						if (o === "vec4i") {
							let e = new Int32Array(this.buffer, i, 4);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1], e[2] = n.data[2], e[3] = n.data[3]) : (e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3]);
							return;
						}
						if (o === "vec2u") {
							let e = new Uint32Array(this.buffer, i, 2);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1]) : (e[0] = n[0], e[1] = n[1]);
							return;
						}
						if (o === "vec3u") {
							let e = new Uint32Array(this.buffer, i, 3);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1], e[2] = n.data[2]) : (e[0] = n[0], e[1] = n[1], e[2] = n[2]);
							return;
						}
						if (o === "vec4u") {
							let e = new Uint32Array(this.buffer, i, 4);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1], e[2] = n.data[2], e[3] = n.data[3]) : (e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3]);
							return;
						}
						if (o === "vec2b") {
							let e = new Uint32Array(this.buffer, i, 2);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1]) : (e[0] = n[0], e[1] = n[1]);
							return;
						}
						if (o === "vec3b") {
							let e = new Uint32Array(this.buffer, i, 3);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1], e[2] = n.data[2]) : (e[0] = n[0], e[1] = n[1], e[2] = n[2]);
							return;
						}
						if (o === "vec4b") {
							let e = new Uint32Array(this.buffer, i, 4);
							n instanceof H ? (e[0] = n.data[0], e[1] = n.data[1], e[2] = n.data[2], e[3] = n.data[3]) : (e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3]);
							return;
						}
						if (o !== "mat2x2f" && o !== "mat2x2h") {
							if (o !== "mat2x3f" && o !== "mat2x3h") {
								if (o !== "mat2x4f" && o !== "mat2x4h") {
									if (o !== "mat3x2f" && o !== "mat3x2h") {
										if (o !== "mat3x3f" && o !== "mat3x3h") {
											if (o !== "mat3x4f" && o !== "mat3x4h") {
												if (o !== "mat4x2f" && o !== "mat4x2h") {
													if (o !== "mat4x3f" && o !== "mat4x3h") {
														if (o !== "mat4x4f" && o !== "mat4x4h") {
															if (n instanceof e && r === n.typeInfo) {
																new Uint8Array(this.buffer, i, n.buffer.byteLength).set(new Uint8Array(n.buffer));
																return;
															}
														} else this._writeMatrix(i, 4, 4, n);
													} else this._writeMatrix(i, 4, 3, n);
												} else this._writeMatrix(i, 4, 2, n);
											} else this._writeMatrix(i, 3, 4, n);
										} else this._writeMatrix(i, 3, 3, n);
									} else this._writeMatrix(i, 3, 2, n);
								} else this._writeMatrix(i, 2, 4, n);
							} else this._writeMatrix(i, 2, 3, n);
						} else this._writeMatrix(i, 2, 2, n);
					} else n instanceof V && (new Int32Array(this.buffer, i, 1)[0] = n.value);
				} else n instanceof V && (new Uint32Array(this.buffer, i, 1)[0] = n.value);
			} else n instanceof V && (new Int32Array(this.buffer, i, 1)[0] = n.value);
		} else n instanceof V && (new Float32Array(this.buffer, i, 1)[0] = n.value);
	}
	getSubData(t, n, r) {
		if (n === null) return this;
		let i = this.offset, a = this.typeInfo;
		for (; n;) {
			if (n instanceof Ys) {
				let o = n.index, s = o instanceof Hs ? t.evalExpression(o, r) : o, c = 0;
				if (s instanceof V ? c = s.value : typeof s == "number" && (c = s), a instanceof Bo) i += c * a.stride, a = a.format;
				else {
					let n = a.getTypeName(), r = (n, r) => {
						i += c * e._matrixColumnStride(n), a = t.getTypeInfo(r);
					};
					n === "mat4x4" || n === "mat4x4f" || n === "mat4x4h" ? r(4, "vec4f") : n === "mat4x3" || n === "mat4x3f" || n === "mat4x3h" ? r(3, "vec3f") : n === "mat4x2" || n === "mat4x2f" || n === "mat4x2h" ? r(2, "vec2f") : n === "mat3x4" || n === "mat3x4f" || n === "mat3x4h" ? r(4, "vec4f") : n === "mat3x3" || n === "mat3x3f" || n === "mat3x3h" ? r(3, "vec3f") : n === "mat3x2" || n === "mat3x2f" || n === "mat3x2h" ? r(2, "vec2f") : n === "mat2x4" || n === "mat2x4f" || n === "mat2x4h" ? r(4, "vec4f") : n === "mat2x3" || n === "mat2x3f" || n === "mat2x3h" ? r(3, "vec3f") : n === "mat2x2" || n === "mat2x2f" || n === "mat2x2h" ? r(2, "vec2f") : n === "vec2f" || n === "vec3f" || n === "vec4f" ? (i += 4 * c, a = t.getTypeInfo("f32")) : n === "vec2h" || n === "vec3h" || n === "vec4h" ? (i += 2 * c, a = t.getTypeInfo("f16")) : n === "vec2b" || n === "vec3b" || n === "vec4b" ? (i += 1 * c, a = t.getTypeInfo("bool")) : n === "vec2i" || n === "vec3i" || n === "vec4i" ? (i += 4 * c, a = t.getTypeInfo("i32")) : (n === "vec2u" || n === "vec3u" || n === "vec4u") && (i += 4 * c, a = t.getTypeInfo("u32"));
				}
			} else {
				if (!(n instanceof Us)) return null;
				{
					let e = n.value;
					if (a instanceof zo) {
						let t = !1;
						for (let n of a.members) if (n.name === e) {
							i += n.offset, a = n.type, t = !0;
							break;
						}
						if (!t) return null;
					} else if (a instanceof Lo) {
						let n = a.getTypeName();
						if (n === "vec2f" || n === "vec3f" || n === "vec4f" || n === "vec2i" || n === "vec3i" || n === "vec4i" || n === "vec2u" || n === "vec3u" || n === "vec4u" || n === "vec2b" || n === "vec3b" || n === "vec4b" || n === "vec2h" || n === "vec3h" || n === "vec4h" || n === "vec2" || n === "vec3" || n === "vec4") {
							if (e.length > 0 && e.length < 5) {
								let r = "f", o = [];
								for (let a = 0; a < e.length; ++a) {
									let s = e[a].toLowerCase(), c = 0;
									if (s === "x" || s === "r") c = 0;
									else if (s === "y" || s === "g") c = 1;
									else if (s === "z" || s === "b") c = 2;
									else {
										if (s !== "w" && s !== "a") return null;
										c = 3;
									}
									if (e.length === 1) {
										if (n.endsWith("f")) return this.buffer.byteLength < i + 4 * c + 4 ? null : new V(new Float32Array(this.buffer, i + 4 * c, 1), t.getTypeInfo("f32"), this);
										if (n.endsWith("h")) return new V(new Float32Array(this.buffer, i + 4 * c, 1), t.getTypeInfo("f16"), this);
										if (n.endsWith("i")) return new V(new Int32Array(this.buffer, i + 4 * c, 1), t.getTypeInfo("i32"), this);
										if (n.endsWith("b")) return new V(new Int32Array(this.buffer, i + 4 * c, 1), t.getTypeInfo("bool"), this);
										if (n.endsWith("u")) return new V(new Uint32Array(this.buffer, i + 4 * c, 1), t.getTypeInfo("i32"), this);
									}
									if (n === "vec2f") o.push(new Float32Array(this.buffer, i, 2)[c]);
									else if (n === "vec3f") {
										if (i + 12 >= this.buffer.byteLength) return null;
										let e = new Float32Array(this.buffer, i, 3);
										o.push(e[c]);
									} else if (n === "vec4f") o.push(new Float32Array(this.buffer, i, 4)[c]);
									else if (n === "vec2i") r = "i", o.push(new Int32Array(this.buffer, i, 2)[c]);
									else if (n === "vec3i") r = "i", o.push(new Int32Array(this.buffer, i, 3)[c]);
									else if (n === "vec4i") r = "i", o.push(new Int32Array(this.buffer, i, 4)[c]);
									else if (n === "vec2u") {
										r = "u";
										let e = new Uint32Array(this.buffer, i, 2);
										o.push(e[c]);
									} else n === "vec3u" ? (r = "u", o.push(new Uint32Array(this.buffer, i, 3)[c])) : n === "vec4u" && (r = "u", o.push(new Uint32Array(this.buffer, i, 4)[c]));
								}
								return o.length === 2 ? a = t.getTypeInfo(`vec2${r}`) : o.length === 3 ? a = t.getTypeInfo(`vec3${r}`) : o.length === 4 && (a = t.getTypeInfo(`vec4${r}`)), new H(o, a, null);
							}
							return null;
						}
						return null;
					}
				}
			}
			n = n.postfix;
		}
		let o = a.getTypeName();
		return o === "f32" ? new V(new Float32Array(this.buffer, i, 1), a, this) : o === "i32" ? new V(new Int32Array(this.buffer, i, 1), a, this) : o === "u32" ? new V(new Uint32Array(this.buffer, i, 1), a, this) : o === "vec2f" ? new H(new Float32Array(this.buffer, i, 2), a, this) : o === "vec3f" ? new H(new Float32Array(this.buffer, i, 3), a, this) : o === "vec4f" ? new H(new Float32Array(this.buffer, i, 4), a, this) : o === "vec2i" ? new H(new Int32Array(this.buffer, i, 2), a, this) : o === "vec3i" ? new H(new Int32Array(this.buffer, i, 3), a, this) : o === "vec4i" ? new H(new Int32Array(this.buffer, i, 4), a, this) : o === "vec2u" ? new H(new Uint32Array(this.buffer, i, 2), a, this) : o === "vec3u" ? new H(new Uint32Array(this.buffer, i, 3), a, this) : o === "vec4u" ? new H(new Uint32Array(this.buffer, i, 4), a, this) : a instanceof Ho && a.name === "atomic" ? a.format?.name === "u32" ? new V(new Uint32Array(this.buffer, i, 1)[0], a.format, this) : a.format?.name === "i32" ? new V(new Int32Array(this.buffer, i, 1)[0], a.format, this) : null : new e(this.buffer, a, i, this);
	}
	static _matrixColumnStride(e) {
		return e === 2 ? 8 : 16;
	}
	_matrixColumn(t, n, r) {
		return new Float32Array(this.buffer, t + n * e._matrixColumnStride(r), r);
	}
	_readMatrix(e, t, n) {
		let r = new Float32Array(t * n);
		for (let i = 0; i < t; ++i) r.set(this._matrixColumn(e, i, n), i * n);
		return r;
	}
	_writeMatrix(e, t, n, r) {
		let i = r instanceof U ? r.data : r;
		for (let r = 0; r < t; ++r) {
			let t = this._matrixColumn(e, r, n);
			for (let e = 0; e < n; ++e) t[e] = i[r * n + e];
		}
	}
	toArray() {
		let e = this.typeInfo.getTypeName();
		return e === "f32" || e === "f16" ? new Float32Array(this.buffer, this.offset, 1) : e === "i32" || e === "atomic<i32>" || e === "x32" ? new Int32Array(this.buffer, this.offset, 1) : e === "u32" || e === "atomic<u32>" ? new Uint32Array(this.buffer, this.offset, 1) : e === "bool" ? new Int32Array(this.buffer, this.offset, 1) : e === "vec2f" || e === "vec2h" ? new Float32Array(this.buffer, this.offset, 2) : e === "vec3f" || e === "vec3h" ? new Float32Array(this.buffer, this.offset, 3) : e === "vec4f" || e === "vec4h" ? new Float32Array(this.buffer, this.offset, 4) : e === "vec2i" ? new Int32Array(this.buffer, this.offset, 2) : e === "vec3i" ? new Int32Array(this.buffer, this.offset, 3) : e === "vec4i" ? new Int32Array(this.buffer, this.offset, 4) : e === "vec2u" ? new Uint32Array(this.buffer, this.offset, 2) : e === "vec3u" ? new Uint32Array(this.buffer, this.offset, 3) : e === "vec4u" ? new Uint32Array(this.buffer, this.offset, 4) : e === "vec2b" ? new Uint32Array(this.buffer, this.offset, 2) : e === "vec3b" ? new Uint32Array(this.buffer, this.offset, 3) : e === "vec4b" ? new Uint32Array(this.buffer, this.offset, 4) : e === "mat2x2f" || e === "mat2x2h" ? this._readMatrix(this.offset, 2, 2) : e === "mat2x3f" || e === "mat2x3h" ? this._readMatrix(this.offset, 2, 3) : e === "mat2x4f" || e === "mat2x4h" ? this._readMatrix(this.offset, 2, 4) : e === "mat3x2f" || e === "mat3x2h" ? this._readMatrix(this.offset, 3, 2) : e === "mat3x3f" || e === "mat3x3h" ? this._readMatrix(this.offset, 3, 3) : e === "mat3x4f" || e === "mat3x4h" ? this._readMatrix(this.offset, 3, 4) : e === "mat4x2f" || e === "mat4x2h" ? this._readMatrix(this.offset, 4, 2) : e === "mat4x3f" || e === "mat4x3h" ? this._readMatrix(this.offset, 4, 3) : e === "mat4x4f" || e === "mat4x4h" ? this._readMatrix(this.offset, 4, 4) : null;
	}
	toString() {
		let e = "";
		if (this.typeInfo instanceof Bo) {
			if (this.typeInfo.format.name === "f32") {
				let t = new Float32Array(this.buffer, this.offset);
				e = `[${t[0]}`;
				for (let n = 1; n < t.length; ++n) e += `, ${t[n]}`;
			} else if (this.typeInfo.format.name === "i32") {
				let t = new Int32Array(this.buffer, this.offset);
				e = `[${t[0]}`;
				for (let n = 1; n < t.length; ++n) e += `, ${t[n]}`;
			} else if (this.typeInfo.format.name === "u32") {
				let t = new Uint32Array(this.buffer, this.offset);
				e = `[${t[0]}`;
				for (let n = 1; n < t.length; ++n) e += `, ${t[n]}`;
			} else if (this.typeInfo.format.name === "vec2f") {
				let t = new Float32Array(this.buffer, this.offset);
				e = `[${t[0]}, ${t[1]}]`;
				for (let n = 1; n < t.length / 2; ++n) e += `, [${t[2 * n]}, ${t[2 * n + 1]}]`;
			} else if (this.typeInfo.format.name === "vec3f") {
				let t = new Float32Array(this.buffer, this.offset);
				e = `[${t[0]}, ${t[1]}, ${t[2]}]`;
				for (let n = 4; n < t.length; n += 4) e += `, [${t[n]}, ${t[n + 1]}, ${t[n + 2]}]`;
			} else if (this.typeInfo.format.name === "vec4f") {
				let t = new Float32Array(this.buffer, this.offset);
				e = `[${t[0]}, ${t[1]}, ${t[2]}, ${t[3]}]`;
				for (let n = 4; n < t.length; n += 4) e += `, [${t[n]}, ${t[n + 1]}, ${t[n + 2]}, ${t[n + 3]}]`;
			} else e = "[...]";
		} else this.typeInfo instanceof zo ? e += "{...}" : e = "[...]";
		return e;
	}
}, dc = class e extends oc {
	constructor(e, t) {
		super(t, null), this.descriptor = e ?? {};
	}
	clone() {
		return new e(this.descriptor, this.typeInfo);
	}
	getSubData(e, t, n) {
		return t ? null : this;
	}
}, fc = class e extends oc {
	constructor(e, t, n, r) {
		super(t, null), this.data = e, this.descriptor = n, this.view = r;
	}
	clone() {
		return new e(this.data, this.typeInfo, this.descriptor, this.view);
	}
	getSubData(e, t, n) {
		return t ? null : this;
	}
	get width() {
		var e;
		let t = this.descriptor.size;
		return t instanceof Array && t.length > 0 ? t[0] ?? 0 : t instanceof Object && (e = t.width) != null ? e : 0;
	}
	get height() {
		var e;
		let t = this.descriptor.size;
		return t instanceof Array && t.length > 1 ? t[1] ?? 0 : t instanceof Object && (e = t.height) != null ? e : 0;
	}
	get depthOrArrayLayers() {
		var e;
		let t = this.descriptor.size;
		return t instanceof Array && t.length > 2 ? t[2] ?? 0 : t instanceof Object && (e = t.depthOrArrayLayers) != null ? e : 0;
	}
	get format() {
		var e;
		return this.descriptor && (e = this.descriptor.format) != null ? e : "rgba8unorm";
	}
	get sampleCount() {
		var e;
		return this.descriptor && (e = this.descriptor.sampleCount) != null ? e : 1;
	}
	get mipLevelCount() {
		var e;
		return this.descriptor && (e = this.descriptor.mipLevelCount) != null ? e : 1;
	}
	get dimension() {
		var e;
		return this.descriptor && (e = this.descriptor.dimension) != null ? e : "2d";
	}
	getMipLevelSize(e) {
		if (e >= this.mipLevelCount) return [
			0,
			0,
			0
		];
		let t = [
			this.width,
			this.height,
			this.depthOrArrayLayers
		];
		for (let n = 0; n < t.length; ++n) t[n] = Math.max(1, t[n] >> e);
		return t;
	}
	get texelByteSize() {
		let e = ss[this.format];
		return e ? e.isDepthStencil ? 4 : e.bytesPerBlock : 0;
	}
	get bytesPerRow() {
		return this.width * this.texelByteSize;
	}
	get isDepthStencil() {
		let e = ss[this.format];
		return !!e && e.isDepthStencil;
	}
	get swizzle() {
		var e;
		return this.view && (e = this.view.swizzle) != null ? e : "rgba";
	}
	getGpuSize() {
		let e = this.format, t = ss[e], n = this.width;
		if (!e || n <= 0 || !t) return -1;
		let r = this.height, i = this.depthOrArrayLayers, a = this.dimension;
		return n / t.blockWidth * (a === "1d" ? 1 : r / t.blockHeight) * t.bytesPerBlock * i;
	}
	applySwizzle(e) {
		if (e == null) return null;
		let t = [
			e[0] ?? 0,
			e[1] ?? 0,
			e[2] ?? 0,
			e[3] ?? 1
		], n = this.swizzle.toLowerCase();
		if (n === "rgba") return t;
		let r = {
			r: t[0],
			g: t[1],
			b: t[2],
			a: t[3],
			0: 0,
			1: 1
		};
		return [
			r[n[0]] ?? t[0],
			r[n[1]] ?? t[1],
			r[n[2]] ?? t[2],
			r[n[3]] ?? t[3]
		];
	}
	getPixel(e, t, n = 0, r = 0) {
		let i = this.texelByteSize, a = this.bytesPerRow, o = this.height, s = this.data[r], c = os(new Uint8Array(s), e, t, n, r, o, a, i, this.format);
		return this.applySwizzle(c);
	}
	setPixel(e, t, n, r, i) {
		let a = this.texelByteSize, o = this.bytesPerRow, s = this.height, c = this.data[r];
		(function(e, t, n, r, i, a, o, s, c, l) {
			let u = r * (o >>= i) * (a >>= i) + n * o + t * s;
			switch (c) {
				case "r8unorm":
					N(e, u, "8unorm", 1, l);
					return;
				case "r8snorm":
					N(e, u, "8snorm", 1, l);
					return;
				case "r8uint":
					N(e, u, "8uint", 1, l);
					return;
				case "r8sint":
					N(e, u, "8sint", 1, l);
					return;
				case "rg8unorm":
					N(e, u, "8unorm", 2, l);
					return;
				case "rg8snorm":
					N(e, u, "8snorm", 2, l);
					return;
				case "rg8uint":
					N(e, u, "8uint", 2, l);
					return;
				case "rg8sint":
					N(e, u, "8sint", 2, l);
					return;
				case "rgba8unorm-srgb":
				case "rgba8unorm":
				case "bgra8unorm-srgb":
				case "bgra8unorm":
					N(e, u, "8unorm", 4, l);
					return;
				case "rgba8snorm":
					N(e, u, "8snorm", 4, l);
					return;
				case "rgba8uint":
					N(e, u, "8uint", 4, l);
					return;
				case "rgba8sint":
					N(e, u, "8sint", 4, l);
					return;
				case "r16uint":
					N(e, u, "16uint", 1, l);
					return;
				case "r16sint":
					N(e, u, "16sint", 1, l);
					return;
				case "r16float":
					N(e, u, "16float", 1, l);
					return;
				case "rg16uint":
					N(e, u, "16uint", 2, l);
					return;
				case "rg16sint":
					N(e, u, "16sint", 2, l);
					return;
				case "rg16float":
					N(e, u, "16float", 2, l);
					return;
				case "rgba16uint":
					N(e, u, "16uint", 4, l);
					return;
				case "rgba16sint":
					N(e, u, "16sint", 4, l);
					return;
				case "rgba16float":
					N(e, u, "16float", 4, l);
					return;
				case "r32uint":
					N(e, u, "32uint", 1, l);
					return;
				case "r32sint":
					N(e, u, "32sint", 1, l);
					return;
				case "depth16unorm":
				case "depth24plus":
				case "depth24plus-stencil8":
				case "depth32float":
				case "depth32float-stencil8":
				case "r32float":
					N(e, u, "32float", 1, l);
					return;
				case "rg32uint":
					N(e, u, "32uint", 2, l);
					return;
				case "rg32sint":
					N(e, u, "32sint", 2, l);
					return;
				case "rg32float":
					N(e, u, "32float", 2, l);
					return;
				case "rgba32uint":
					N(e, u, "32uint", 4, l);
					return;
				case "rgba32sint":
					N(e, u, "32sint", 4, l);
					return;
				case "rgba32float":
					N(e, u, "32float", 4, l);
					return;
			}
		})(new Uint8Array(c), e, t, n, r, s, o, a, this.format, i);
	}
};
((e) => {
	e[e.token = 0] = "token", e[e.keyword = 1] = "keyword", e[e.reserved = 2] = "reserved";
})(I ||= {});
var G = class {
	constructor(e, t, n) {
		this.name = e, this.type = t, this.rule = n;
	}
	toString() {
		return this.name;
	}
}, K = class {};
F = K, K.none = new G("", I.reserved, ""), K.eof = new G("EOF", I.token, ""), K.reserved = {
	asm: new G("asm", I.reserved, "asm"),
	bf16: new G("bf16", I.reserved, "bf16"),
	do: new G("do", I.reserved, "do"),
	enum: new G("enum", I.reserved, "enum"),
	f16: new G("f16", I.reserved, "f16"),
	f64: new G("f64", I.reserved, "f64"),
	handle: new G("handle", I.reserved, "handle"),
	i8: new G("i8", I.reserved, "i8"),
	i16: new G("i16", I.reserved, "i16"),
	i64: new G("i64", I.reserved, "i64"),
	mat: new G("mat", I.reserved, "mat"),
	premerge: new G("premerge", I.reserved, "premerge"),
	regardless: new G("regardless", I.reserved, "regardless"),
	typedef: new G("typedef", I.reserved, "typedef"),
	u8: new G("u8", I.reserved, "u8"),
	u16: new G("u16", I.reserved, "u16"),
	u64: new G("u64", I.reserved, "u64"),
	unless: new G("unless", I.reserved, "unless"),
	using: new G("using", I.reserved, "using"),
	vec: new G("vec", I.reserved, "vec"),
	void: new G("void", I.reserved, "void")
}, K.keywords = {
	array: new G("array", I.keyword, "array"),
	atomic: new G("atomic", I.keyword, "atomic"),
	bool: new G("bool", I.keyword, "bool"),
	f32: new G("f32", I.keyword, "f32"),
	i32: new G("i32", I.keyword, "i32"),
	mat2x2: new G("mat2x2", I.keyword, "mat2x2"),
	mat2x3: new G("mat2x3", I.keyword, "mat2x3"),
	mat2x4: new G("mat2x4", I.keyword, "mat2x4"),
	mat3x2: new G("mat3x2", I.keyword, "mat3x2"),
	mat3x3: new G("mat3x3", I.keyword, "mat3x3"),
	mat3x4: new G("mat3x4", I.keyword, "mat3x4"),
	mat4x2: new G("mat4x2", I.keyword, "mat4x2"),
	mat4x3: new G("mat4x3", I.keyword, "mat4x3"),
	mat4x4: new G("mat4x4", I.keyword, "mat4x4"),
	ptr: new G("ptr", I.keyword, "ptr"),
	sampler: new G("sampler", I.keyword, "sampler"),
	sampler_comparison: new G("sampler_comparison", I.keyword, "sampler_comparison"),
	struct: new G("struct", I.keyword, "struct"),
	texture_1d: new G("texture_1d", I.keyword, "texture_1d"),
	texture_2d: new G("texture_2d", I.keyword, "texture_2d"),
	texture_2d_array: new G("texture_2d_array", I.keyword, "texture_2d_array"),
	texture_3d: new G("texture_3d", I.keyword, "texture_3d"),
	texture_cube: new G("texture_cube", I.keyword, "texture_cube"),
	texture_cube_array: new G("texture_cube_array", I.keyword, "texture_cube_array"),
	texture_multisampled_2d: new G("texture_multisampled_2d", I.keyword, "texture_multisampled_2d"),
	texture_storage_1d: new G("texture_storage_1d", I.keyword, "texture_storage_1d"),
	texture_storage_2d: new G("texture_storage_2d", I.keyword, "texture_storage_2d"),
	texture_storage_2d_array: new G("texture_storage_2d_array", I.keyword, "texture_storage_2d_array"),
	texture_storage_3d: new G("texture_storage_3d", I.keyword, "texture_storage_3d"),
	texture_depth_2d: new G("texture_depth_2d", I.keyword, "texture_depth_2d"),
	texture_depth_2d_array: new G("texture_depth_2d_array", I.keyword, "texture_depth_2d_array"),
	texture_depth_cube: new G("texture_depth_cube", I.keyword, "texture_depth_cube"),
	texture_depth_cube_array: new G("texture_depth_cube_array", I.keyword, "texture_depth_cube_array"),
	texture_depth_multisampled_2d: new G("texture_depth_multisampled_2d", I.keyword, "texture_depth_multisampled_2d"),
	texture_external: new G("texture_external", I.keyword, "texture_external"),
	u32: new G("u32", I.keyword, "u32"),
	vec2: new G("vec2", I.keyword, "vec2"),
	vec3: new G("vec3", I.keyword, "vec3"),
	vec4: new G("vec4", I.keyword, "vec4"),
	bitcast: new G("bitcast", I.keyword, "bitcast"),
	block: new G("block", I.keyword, "block"),
	break: new G("break", I.keyword, "break"),
	case: new G("case", I.keyword, "case"),
	continue: new G("continue", I.keyword, "continue"),
	continuing: new G("continuing", I.keyword, "continuing"),
	default: new G("default", I.keyword, "default"),
	diagnostic: new G("diagnostic", I.keyword, "diagnostic"),
	discard: new G("discard", I.keyword, "discard"),
	else: new G("else", I.keyword, "else"),
	enable: new G("enable", I.keyword, "enable"),
	fallthrough: new G("fallthrough", I.keyword, "fallthrough"),
	false: new G("false", I.keyword, "false"),
	fn: new G("fn", I.keyword, "fn"),
	for: new G("for", I.keyword, "for"),
	function: new G("function", I.keyword, "function"),
	if: new G("if", I.keyword, "if"),
	let: new G("let", I.keyword, "let"),
	const: new G("const", I.keyword, "const"),
	loop: new G("loop", I.keyword, "loop"),
	while: new G("while", I.keyword, "while"),
	private: new G("private", I.keyword, "private"),
	read: new G("read", I.keyword, "read"),
	read_write: new G("read_write", I.keyword, "read_write"),
	return: new G("return", I.keyword, "return"),
	requires: new G("requires", I.keyword, "requires"),
	storage: new G("storage", I.keyword, "storage"),
	immediate: new G("immediate", I.keyword, "immediate"),
	switch: new G("switch", I.keyword, "switch"),
	true: new G("true", I.keyword, "true"),
	alias: new G("alias", I.keyword, "alias"),
	type: new G("type", I.keyword, "type"),
	uniform: new G("uniform", I.keyword, "uniform"),
	var: new G("var", I.keyword, "var"),
	override: new G("override", I.keyword, "override"),
	workgroup: new G("workgroup", I.keyword, "workgroup"),
	write: new G("write", I.keyword, "write"),
	r8unorm: new G("r8unorm", I.keyword, "r8unorm"),
	r8snorm: new G("r8snorm", I.keyword, "r8snorm"),
	r8uint: new G("r8uint", I.keyword, "r8uint"),
	r8sint: new G("r8sint", I.keyword, "r8sint"),
	r16uint: new G("r16uint", I.keyword, "r16uint"),
	r16sint: new G("r16sint", I.keyword, "r16sint"),
	r16float: new G("r16float", I.keyword, "r16float"),
	rg8unorm: new G("rg8unorm", I.keyword, "rg8unorm"),
	rg8snorm: new G("rg8snorm", I.keyword, "rg8snorm"),
	rg8uint: new G("rg8uint", I.keyword, "rg8uint"),
	rg8sint: new G("rg8sint", I.keyword, "rg8sint"),
	r32uint: new G("r32uint", I.keyword, "r32uint"),
	r32sint: new G("r32sint", I.keyword, "r32sint"),
	r32float: new G("r32float", I.keyword, "r32float"),
	rg16uint: new G("rg16uint", I.keyword, "rg16uint"),
	rg16sint: new G("rg16sint", I.keyword, "rg16sint"),
	rg16float: new G("rg16float", I.keyword, "rg16float"),
	rgba8unorm: new G("rgba8unorm", I.keyword, "rgba8unorm"),
	rgba8unorm_srgb: new G("rgba8unorm_srgb", I.keyword, "rgba8unorm_srgb"),
	rgba8snorm: new G("rgba8snorm", I.keyword, "rgba8snorm"),
	rgba8uint: new G("rgba8uint", I.keyword, "rgba8uint"),
	rgba8sint: new G("rgba8sint", I.keyword, "rgba8sint"),
	bgra8unorm: new G("bgra8unorm", I.keyword, "bgra8unorm"),
	bgra8unorm_srgb: new G("bgra8unorm_srgb", I.keyword, "bgra8unorm_srgb"),
	rgb10a2unorm: new G("rgb10a2unorm", I.keyword, "rgb10a2unorm"),
	rg11b10float: new G("rg11b10float", I.keyword, "rg11b10float"),
	rg32uint: new G("rg32uint", I.keyword, "rg32uint"),
	rg32sint: new G("rg32sint", I.keyword, "rg32sint"),
	rg32float: new G("rg32float", I.keyword, "rg32float"),
	rgba16uint: new G("rgba16uint", I.keyword, "rgba16uint"),
	rgba16sint: new G("rgba16sint", I.keyword, "rgba16sint"),
	rgba16float: new G("rgba16float", I.keyword, "rgba16float"),
	rgba32uint: new G("rgba32uint", I.keyword, "rgba32uint"),
	rgba32sint: new G("rgba32sint", I.keyword, "rgba32sint"),
	rgba32float: new G("rgba32float", I.keyword, "rgba32float"),
	static_assert: new G("static_assert", I.keyword, "static_assert"),
	const_assert: new G("const_assert", I.keyword, "const_assert")
}, K.tokens = {
	decimal_float_literal: new G("decimal_float_literal", I.token, /((-?[0-9]*\.[0-9]+|-?[0-9]+\.[0-9]*)((e|E)(\+|-)?[0-9]+)?[fh]?)|(-?[0-9]+(e|E)(\+|-)?[0-9]+[fh]?)|(-?[0-9]+[fh])/),
	hex_float_literal: new G("hex_float_literal", I.token, /-?0x((([0-9a-fA-F]*\.[0-9a-fA-F]+|[0-9a-fA-F]+\.[0-9a-fA-F]*)((p|P)(\+|-)?[0-9]+[fh]?)?)|([0-9a-fA-F]+(p|P)(\+|-)?[0-9]+[fh]?))/),
	int_literal: new G("int_literal", I.token, /-?0x[0-9a-fA-F]+|0i?|-?[1-9][0-9]*i?/),
	uint_literal: new G("uint_literal", I.token, /0x[0-9a-fA-F]+u|0u|[1-9][0-9]*u/),
	name: new G("name", I.token, /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u),
	ident: new G("ident", I.token, /[_a-zA-Z][0-9a-zA-Z_]*/),
	and: new G("and", I.token, "&"),
	and_and: new G("and_and", I.token, "&&"),
	arrow: new G("arrow ", I.token, "->"),
	attr: new G("attr", I.token, "@"),
	forward_slash: new G("forward_slash", I.token, "/"),
	bang: new G("bang", I.token, "!"),
	bracket_left: new G("bracket_left", I.token, "["),
	bracket_right: new G("bracket_right", I.token, "]"),
	brace_left: new G("brace_left", I.token, "{"),
	brace_right: new G("brace_right", I.token, "}"),
	colon: new G("colon", I.token, ":"),
	comma: new G("comma", I.token, ","),
	equal: new G("equal", I.token, "="),
	equal_equal: new G("equal_equal", I.token, "=="),
	not_equal: new G("not_equal", I.token, "!="),
	greater_than: new G("greater_than", I.token, ">"),
	greater_than_equal: new G("greater_than_equal", I.token, ">="),
	shift_right: new G("shift_right", I.token, ">>"),
	less_than: new G("less_than", I.token, "<"),
	less_than_equal: new G("less_than_equal", I.token, "<="),
	shift_left: new G("shift_left", I.token, "<<"),
	modulo: new G("modulo", I.token, "%"),
	minus: new G("minus", I.token, "-"),
	minus_minus: new G("minus_minus", I.token, "--"),
	period: new G("period", I.token, "."),
	plus: new G("plus", I.token, "+"),
	plus_plus: new G("plus_plus", I.token, "++"),
	or: new G("or", I.token, "|"),
	or_or: new G("or_or", I.token, "||"),
	paren_left: new G("paren_left", I.token, "("),
	paren_right: new G("paren_right", I.token, ")"),
	semicolon: new G("semicolon", I.token, ";"),
	star: new G("star", I.token, "*"),
	tilde: new G("tilde", I.token, "~"),
	underscore: new G("underscore", I.token, "_"),
	xor: new G("xor", I.token, "^"),
	plus_equal: new G("plus_equal", I.token, "+="),
	minus_equal: new G("minus_equal", I.token, "-="),
	times_equal: new G("times_equal", I.token, "*="),
	division_equal: new G("division_equal", I.token, "/="),
	modulo_equal: new G("modulo_equal", I.token, "%="),
	and_equal: new G("and_equal", I.token, "&="),
	or_equal: new G("or_equal", I.token, "|="),
	xor_equal: new G("xor_equal", I.token, "^="),
	shift_right_equal: new G("shift_right_equal", I.token, ">>="),
	shift_left_equal: new G("shift_left_equal", I.token, "<<=")
}, K.simpleTokens = {
	"@": F.tokens.attr,
	"{": F.tokens.brace_left,
	"}": F.tokens.brace_right,
	":": F.tokens.colon,
	",": F.tokens.comma,
	"(": F.tokens.paren_left,
	")": F.tokens.paren_right,
	";": F.tokens.semicolon
}, K.literalTokens = {
	"&": F.tokens.and,
	"&&": F.tokens.and_and,
	"->": F.tokens.arrow,
	"/": F.tokens.forward_slash,
	"!": F.tokens.bang,
	"[": F.tokens.bracket_left,
	"]": F.tokens.bracket_right,
	"=": F.tokens.equal,
	"==": F.tokens.equal_equal,
	"!=": F.tokens.not_equal,
	">": F.tokens.greater_than,
	">=": F.tokens.greater_than_equal,
	">>": F.tokens.shift_right,
	"<": F.tokens.less_than,
	"<=": F.tokens.less_than_equal,
	"<<": F.tokens.shift_left,
	"%": F.tokens.modulo,
	"-": F.tokens.minus,
	"--": F.tokens.minus_minus,
	".": F.tokens.period,
	"+": F.tokens.plus,
	"++": F.tokens.plus_plus,
	"|": F.tokens.or,
	"||": F.tokens.or_or,
	"*": F.tokens.star,
	"~": F.tokens.tilde,
	_: F.tokens.underscore,
	"^": F.tokens.xor,
	"+=": F.tokens.plus_equal,
	"-=": F.tokens.minus_equal,
	"*=": F.tokens.times_equal,
	"/=": F.tokens.division_equal,
	"%=": F.tokens.modulo_equal,
	"&=": F.tokens.and_equal,
	"|=": F.tokens.or_equal,
	"^=": F.tokens.xor_equal,
	">>=": F.tokens.shift_right_equal,
	"<<=": F.tokens.shift_left_equal
}, K.regexTokens = {
	decimal_float_literal: F.tokens.decimal_float_literal,
	hex_float_literal: F.tokens.hex_float_literal,
	int_literal: F.tokens.int_literal,
	uint_literal: F.tokens.uint_literal,
	ident: F.tokens.ident
}, K.storage_class = [
	F.keywords.function,
	F.keywords.private,
	F.keywords.workgroup,
	F.keywords.uniform,
	F.keywords.storage,
	F.keywords.immediate
], K.access_mode = [
	F.keywords.read,
	F.keywords.write,
	F.keywords.read_write
], K.sampler_type = [F.keywords.sampler, F.keywords.sampler_comparison], K.sampled_texture_type = [
	F.keywords.texture_1d,
	F.keywords.texture_2d,
	F.keywords.texture_2d_array,
	F.keywords.texture_3d,
	F.keywords.texture_cube,
	F.keywords.texture_cube_array
], K.multisampled_texture_type = [F.keywords.texture_multisampled_2d], K.storage_texture_type = [
	F.keywords.texture_storage_1d,
	F.keywords.texture_storage_2d,
	F.keywords.texture_storage_2d_array,
	F.keywords.texture_storage_3d
], K.depth_texture_type = [
	F.keywords.texture_depth_2d,
	F.keywords.texture_depth_2d_array,
	F.keywords.texture_depth_cube,
	F.keywords.texture_depth_cube_array,
	F.keywords.texture_depth_multisampled_2d
], K.texture_external_type = [F.keywords.texture_external], K.any_texture_type = [
	...F.sampled_texture_type,
	...F.multisampled_texture_type,
	...F.storage_texture_type,
	...F.depth_texture_type,
	...F.texture_external_type
], K.texel_format = [
	F.keywords.r8unorm,
	F.keywords.r8snorm,
	F.keywords.r8uint,
	F.keywords.r8sint,
	F.keywords.r16uint,
	F.keywords.r16sint,
	F.keywords.r16float,
	F.keywords.rg8unorm,
	F.keywords.rg8snorm,
	F.keywords.rg8uint,
	F.keywords.rg8sint,
	F.keywords.r32uint,
	F.keywords.r32sint,
	F.keywords.r32float,
	F.keywords.rg16uint,
	F.keywords.rg16sint,
	F.keywords.rg16float,
	F.keywords.rgba8unorm,
	F.keywords.rgba8unorm_srgb,
	F.keywords.rgba8snorm,
	F.keywords.rgba8uint,
	F.keywords.rgba8sint,
	F.keywords.bgra8unorm,
	F.keywords.bgra8unorm_srgb,
	F.keywords.rgb10a2unorm,
	F.keywords.rg11b10float,
	F.keywords.rg32uint,
	F.keywords.rg32sint,
	F.keywords.rg32float,
	F.keywords.rgba16uint,
	F.keywords.rgba16sint,
	F.keywords.rgba16float,
	F.keywords.rgba32uint,
	F.keywords.rgba32sint,
	F.keywords.rgba32float
], K.const_literal = [
	F.tokens.int_literal,
	F.tokens.uint_literal,
	F.tokens.decimal_float_literal,
	F.tokens.hex_float_literal,
	F.keywords.true,
	F.keywords.false
], K.literal_or_ident = [
	F.tokens.ident,
	F.tokens.int_literal,
	F.tokens.uint_literal,
	F.tokens.decimal_float_literal,
	F.tokens.hex_float_literal,
	F.tokens.name
], K.element_count_expression = [
	F.tokens.int_literal,
	F.tokens.uint_literal,
	F.tokens.ident
], K.template_types = [
	F.keywords.vec2,
	F.keywords.vec3,
	F.keywords.vec4,
	F.keywords.mat2x2,
	F.keywords.mat2x3,
	F.keywords.mat2x4,
	F.keywords.mat3x2,
	F.keywords.mat3x3,
	F.keywords.mat3x4,
	F.keywords.mat4x2,
	F.keywords.mat4x3,
	F.keywords.mat4x4,
	F.keywords.atomic,
	F.keywords.bitcast,
	...F.any_texture_type
], K.attribute_name = [
	F.tokens.ident,
	F.keywords.block,
	F.keywords.diagnostic
], K.assignment_operators = [
	F.tokens.equal,
	F.tokens.plus_equal,
	F.tokens.minus_equal,
	F.tokens.times_equal,
	F.tokens.division_equal,
	F.tokens.modulo_equal,
	F.tokens.and_equal,
	F.tokens.or_equal,
	F.tokens.xor_equal,
	F.tokens.shift_right_equal,
	F.tokens.shift_left_equal
], K.increment_operators = [F.tokens.plus_plus, F.tokens.minus_minus];
var pc = class {
	constructor(e, t, n, r, i) {
		this.type = e, this.lexeme = t, this.line = n, this.start = r, this.end = i;
	}
	toString() {
		return this.lexeme;
	}
	isTemplateType() {
		return K.template_types.includes(this.type);
	}
	isArrayType() {
		return this.type === K.keywords.array;
	}
	isArrayOrTemplateType() {
		return this.isArrayType() || this.isTemplateType();
	}
}, mc = class e {
	constructor(e) {
		this._tokens = [], this._start = 0, this._current = 0, this._line = 1, this._source = e ?? "";
	}
	scanTokens() {
		for (; !this._isAtEnd();) if (this._start = this._current, !this.scanToken()) throw `Invalid syntax at line ${this._line}`;
		return this._tokens.push(new pc(K.eof, "", this._line, this._current, this._current)), this._tokens;
	}
	scanToken() {
		let e = this._advance();
		if (e == "\n") return this._line++, !0;
		if (this._isWhitespace(e)) return !0;
		if (e == "/") {
			if (this._peekAhead() == "/") {
				for (; e != "\n";) {
					if (this._isAtEnd()) return !0;
					e = this._advance();
				}
				return this._line++, !0;
			}
			if (this._peekAhead() == "*") {
				this._advance();
				let t = 1;
				for (; t > 0;) {
					if (this._isAtEnd()) return !0;
					if (e = this._advance(), e == "\n") this._line++;
					else if (e == "*") {
						if (this._peekAhead() == "/" && (this._advance(), t--, t == 0)) return !0;
					} else e == "/" && this._peekAhead() == "*" && (this._advance(), t++);
				}
				return !0;
			}
		}
		let t = K.simpleTokens[e];
		if (t) return this._addToken(t), !0;
		let n = K.none, r = this._isAlpha(e), i = e === "_";
		if (this._isAlphaNumeric(e)) {
			let t = this._peekAhead();
			for (; this._isAlphaNumeric(t);) e += this._advance(), t = this._peekAhead();
		}
		if (r) {
			let t = K.keywords[e];
			if (t) return this._addToken(t), !0;
		}
		if (r || i) return this._addToken(K.tokens.ident), !0;
		for (;;) {
			let t = this._findType(e), r = this._peekAhead();
			if (e == "-" && this._tokens.length > 0) {
				if (r == "=") return this._current++, e += r, this._addToken(K.tokens.minus_equal), !0;
				if (r == "-") return this._current++, e += r, this._addToken(K.tokens.minus_minus), !0;
				let n = this._tokens.length - 1;
				if ((K.literal_or_ident.includes(this._tokens[n].type) || this._tokens[n].type == K.tokens.paren_right) && r != ">") return this._addToken(t), !0;
			}
			if (e == ">" && (r == ">" || r == "=")) {
				let e = !1, n = this._tokens.length - 1;
				for (let t = 0; t < 5 && n >= 0 && !K.assignment_operators.includes(this._tokens[n].type); ++t, --n) if (this._tokens[n].type === K.tokens.less_than) {
					n > 0 && this._tokens[n - 1].isArrayOrTemplateType() && (e = !0);
					break;
				}
				if (e) return this._addToken(t), !0;
			}
			if (t === K.none) {
				let r = e, i = 0;
				for (let e = 0; e < 2; ++e) if (r += this._peekAhead(e), t = this._findType(r), t !== K.none) {
					i = e;
					break;
				}
				if (t === K.none) return n !== K.none && (this._current--, this._addToken(n), !0);
				e = r, this._current += i + 1;
			}
			if (n = t, this._isAtEnd()) break;
			e += this._advance();
		}
		return n !== K.none && (this._addToken(n), !0);
	}
	_findType(e) {
		for (let t in K.regexTokens) {
			let n = K.regexTokens[t];
			if (this._match(e, n.rule)) return n;
		}
		return K.literalTokens[e] || K.none;
	}
	_match(e, t) {
		let n = t.exec(e);
		return n && n.index == 0 && n[0] == e;
	}
	_isAtEnd() {
		return this._current >= this._source.length;
	}
	_isAlpha(t) {
		return !this._isNumeric(t) && !this._isWhitespace(t) && t !== "_" && !e._operators.has(t);
	}
	_isNumeric(e) {
		return e >= "0" && e <= "9";
	}
	_isAlphaNumeric(e) {
		return this._isAlpha(e) || this._isNumeric(e) || e === "_";
	}
	_isWhitespace(e) {
		return e == " " || e == "	" || e == "\r";
	}
	_advance(e = 0) {
		let t = this._source[this._current];
		return this._current += e + 1, t ?? "\0";
	}
	_peekAhead(e = 0) {
		return this._current + e >= this._source.length ? "\0" : this._source[this._current + e];
	}
	_addToken(e) {
		let t = this._source.substring(this._start, this._current);
		this._tokens.push(new pc(e, t, this._line, this._start, this._current));
	}
};
function q(e) {
	return Array.isArray(e) || e?.buffer instanceof ArrayBuffer;
}
mc._operators = /* @__PURE__ */ new Set(/* @__PURE__ */ ".()[]{},;:=!<>+-*/%&|^~@#?'`\"\\\n\r	\0".split(""));
var hc = /* @__PURE__ */ new Float32Array(1), gc = new Uint32Array(hc.buffer), _c = new Uint32Array(hc.buffer), vc = /* @__PURE__ */ new Int32Array(1), yc = new Float32Array(vc.buffer), bc = new Uint32Array(vc.buffer), xc = /* @__PURE__ */ new Uint32Array(1), Sc = new Float32Array(xc.buffer), Cc = new Int32Array(xc.buffer);
function wc(e, t, n) {
	if (t === n) return e;
	if (t === "f32") {
		if (n === "i32" || n === "x32") return hc[0] = e, gc[0];
		if (n === "u32") return hc[0] = e, _c[0];
	} else if (t === "i32" || t === "x32") {
		if (n === "f32") return vc[0] = e, yc[0];
		if (n === "u32") return vc[0] = e, bc[0];
	} else if (t === "u32") {
		if (n === "f32") return xc[0] = e, Sc[0];
		if (n === "i32" || n === "x32") return xc[0] = e, Cc[0];
	}
	return e;
}
function Tc(e, t) {
	if (!e) return null;
	if (e instanceof z) return function(e) {
		let t = e.value;
		return t?.data && t.data.length > 0 ? Number(t.data[0]) : typeof t?.value == "number" ? t.value : null;
	}(e);
	if (e instanceof qs) return Tc(e.initializer, t);
	if (e instanceof Ks) return e.postfix ? null : t.get(e.name) ?? null;
	if (e instanceof Ws) {
		let n = e.args ?? [];
		return n.length === 1 ? Tc(n[0], t) : null;
	}
	if (e instanceof B) {
		let n = Tc(e.right, t);
		return n === null ? null : e.operator === "-" ? -n : e.operator === "+" ? n : null;
	}
	if (e instanceof Zs) {
		let n = Tc(e.left, t), r = Tc(e.right, t);
		if (n === null || r === null) return null;
		switch (e.operator) {
			case "+": return n + r;
			case "-": return n - r;
			case "*": return n * r;
			case "/": return r === 0 ? null : n / r;
			case "%": return r === 0 ? null : n % r;
			case "<<": return n << r;
			case ">>": return n >> r;
			default: return null;
		}
	}
	return null;
}
function Ec(e, t) {
	for (let n of e.attributes ?? []) {
		if (n.name !== "workgroup_size") continue;
		let e = n.value;
		if (e === null) return [
			1,
			1,
			1
		];
		let r = Array.isArray(e) ? e : [e], i = [
			1,
			1,
			1
		];
		for (let e = 0; e < 3 && e < r.length; ++e) {
			let n = r[e], a = Number(n);
			i[e] = Number.isFinite(a) ? a : t.get(String(n)) ?? 1;
		}
		return [
			i[0],
			i[1],
			i[2]
		];
	}
	return null;
}
var Dc = class {
	constructor(e) {
		this.resources = null, this.inUse = !1, this.info = null, this.node = e;
	}
}, Oc = class {
	constructor(e, t) {
		this.align = e, this.size = t;
	}
}, kc = class e {
	constructor() {
		this.uniforms = [], this.storage = [], this.immediates = [], this.textures = [], this.samplers = [], this.aliases = [], this.overrides = [], this.structs = [], this.entry = new Zo(), this.functions = [], this._types = /* @__PURE__ */ new Map(), this._functions = /* @__PURE__ */ new Map(), this._constValues = /* @__PURE__ */ new Map();
	}
	_recordConstValue(e, t) {
		let n = Tc(t, this._constValues);
		n !== null && this._constValues.set(e, n);
	}
	_isStorageTexture(e) {
		return e.name == "texture_storage_1d" || e.name == "texture_storage_2d" || e.name == "texture_storage_2d_array" || e.name == "texture_storage_3d";
	}
	updateAST(e) {
		for (let t of e) (t instanceof bs || t instanceof vs) && this._recordConstValue(t.name, t.value);
		for (let t of e) t instanceof fs && this._functions.set(t.name, new Dc(t));
		for (let t of e) if (t instanceof Rs) {
			let e = this.getTypeInfo(t, null);
			e instanceof zo && this.structs.push(e);
		}
		for (let t of e) if (t instanceof Ns) this.aliases.push(this._getAliasInfo(t));
		else {
			if (t instanceof vs) {
				let e = t, n = this._getAttributeNum(e.attributes, "id", 0), r = e.type == null ? null : this.getTypeInfo(e.type, e.attributes);
				this.overrides.push(new Jo(e.name, r, e.attributes, n));
				continue;
			}
			if (this._isUniformVar(t)) {
				let e = t, n = this._getAttributeNum(e.attributes, "group", 0), r = this._getAttributeNum(e.attributes, "binding", 0), i = this.getTypeInfo(e.type, e.attributes), a = new Wo(e.name, i, n, r, e.attributes, Uo.Uniform, e.access);
				a.access ||= "read", this.uniforms.push(a);
				continue;
			}
			if (this._isImmediateVar(t)) {
				let e = t, n = this._getAttributeNum(e.attributes, "group", 0), r = this._getAttributeNum(e.attributes, "binding", 0), i = this.getTypeInfo(e.type, e.attributes), a = new Wo(e.name, i, n, r, e.attributes, Uo.Immediate, e.access);
				a.access ||= "read", this.immediates.push(a);
				continue;
			}
			if (this._isStorageVar(t)) {
				let e = t, n = this._getAttributeNum(e.attributes, "group", 0), r = this._getAttributeNum(e.attributes, "binding", 0), i = this.getTypeInfo(e.type, e.attributes), a = this._isStorageTexture(i), o = new Wo(e.name, i, n, r, e.attributes, a ? Uo.StorageTexture : Uo.Storage, e.access);
				o.access ||= "read", this.storage.push(o);
				continue;
			}
			if (this._isTextureVar(t)) {
				let e = t, n = this._getAttributeNum(e.attributes, "group", 0), r = this._getAttributeNum(e.attributes, "binding", 0), i = this.getTypeInfo(e.type, e.attributes), a = this._isStorageTexture(i), o = a ? i.access : e.access, s = new Wo(e.name, i, n, r, e.attributes, a ? Uo.StorageTexture : Uo.Texture, o || e.access);
				s.access ||= "read", a ? this.storage.push(s) : this.textures.push(s);
				continue;
			}
			if (this._isSamplerVar(t)) {
				let e = t, n = this._getAttributeNum(e.attributes, "group", 0), r = this._getAttributeNum(e.attributes, "binding", 0), i = this.getTypeInfo(e.type, e.attributes), a = new Wo(e.name, i, n, r, e.attributes, Uo.Sampler, e.access);
				this.samplers.push(a);
				continue;
			}
		}
		for (let t of e) if (t instanceof fs) {
			let e = this._getAttribute(t, "vertex"), n = this._getAttribute(t, "fragment"), r = this._getAttribute(t, "compute"), i = e || n || r, a = new Xo(t.name, i?.name, t.attributes);
			a.attributes = t.attributes, a.workgroupSize = Ec(t, this._constValues), a.startLine = t.startLine, a.endLine = t.endLine, this.functions.push(a), this._functions.get(t.name).info = a, i && (this._functions.get(t.name).inUse = !0, a.inUse = !0, a.inputs = this._getInputs(t.args), a.outputs = this._getOutputs(t.returnType), this.entry[i.name].push(a)), a.resources = this._findResources(t, !!i), a.arguments = t.args.map((e) => new Yo(e.name, this.getTypeInfo(e.type, e.attributes), e.attributes)), a.returnType = t.returnType ? this.getTypeInfo(t.returnType, t.attributes) : null;
			continue;
		}
		for (let e of this._functions.values()) e.info && (e.info.inUse = e.inUse, this._addCalls(e.node, e.info.calls));
		for (let e of this._functions.values()) e.node.search((t) => {
			var n, r, i;
			if (t instanceof ac) {
				if (t.value) {
					if (q(t.value)) for (let r of t.value) for (let t of this.overrides) r === t.name && ((n = e.info) == null || n.overrides.push(t));
					else for (let n of this.overrides) t.value === n.name && ((r = e.info) == null || r.overrides.push(n));
				}
			} else if (t instanceof Ks) for (let n of this.overrides) t.name === n.name && ((i = e.info) == null || i.overrides.push(n));
		});
		for (let e of this.uniforms) this._markStructsInUse(e.type);
		for (let e of this.storage) this._markStructsInUse(e.type);
	}
	getFunctionInfo(e) {
		for (let t of this.functions) if (t.name == e) return t;
		return null;
	}
	getStructInfo(e) {
		for (let t of this.structs) if (t.name == e) return t;
		return null;
	}
	getOverrideInfo(e) {
		for (let t of this.overrides) if (t.name == e) return t;
		return null;
	}
	_markStructsInUse(e) {
		if (e) {
			if (e.isStruct) {
				if (e.inUse = !0, e.members) for (let t of e.members) this._markStructsInUse(t.type);
			} else if (e.isArray) this._markStructsInUse(e.format);
			else if (e.isTemplate) e.format && this._markStructsInUse(e.format);
			else {
				let t = this._getAlias(e.name);
				t && this._markStructsInUse(t);
			}
		}
	}
	_addCalls(e, t) {
		for (let n of e.calls) {
			let e = this._functions.get(n.name)?.info;
			e && t.add(e);
		}
	}
	findResource(e, t, n) {
		if (n) {
			for (let r of this.entry.compute) if (r.name === n) {
				for (let n of r.resources) if (n.group == e && n.binding == t) return n;
			}
			for (let r of this.entry.vertex) if (r.name === n) {
				for (let n of r.resources) if (n.group == e && n.binding == t) return n;
			}
			for (let r of this.entry.fragment) if (r.name === n) {
				for (let n of r.resources) if (n.group == e && n.binding == t) return n;
			}
		}
		for (let n of this.uniforms) if (n.group == e && n.binding == t) return n;
		for (let n of this.storage) if (n.group == e && n.binding == t) return n;
		for (let n of this.textures) if (n.group == e && n.binding == t) return n;
		for (let n of this.samplers) if (n.group == e && n.binding == t) return n;
		return null;
	}
	_findResource(e) {
		for (let t of this.uniforms) if (t.name == e) return t;
		for (let t of this.storage) if (t.name == e) return t;
		for (let t of this.textures) if (t.name == e) return t;
		for (let t of this.samplers) if (t.name == e) return t;
		return null;
	}
	_markStructsFromAST(e) {
		let t = this.getTypeInfo(e, null);
		this._markStructsInUse(t);
	}
	_findResources(e, t) {
		let n = [], r = this, i = [];
		return e.search((a) => {
			if (a instanceof ls) i.push({});
			else if (a instanceof us) i.pop();
			else if (a instanceof _s) {
				let e = a;
				t && e.type !== null && this._markStructsFromAST(e.type), i.length > 0 && (i[i.length - 1][e.name] = e);
			} else if (a instanceof Ws) {
				let e = a;
				t && e.type !== null && this._markStructsFromAST(e.type);
			} else if (a instanceof ys) {
				let e = a;
				t && e.type !== null && this._markStructsFromAST(e.type), i.length > 0 && (i[i.length - 1][e.name] = e);
			} else if (a instanceof Ks) {
				let e = a;
				if (i.length > 0 && i[i.length - 1][e.name]) return;
				let t = r._findResource(e.name);
				t && n.push(t);
			} else if (a instanceof Gs) {
				let i = a, o = r._functions.get(i.name);
				if (o && (t && (o.inUse = !0), e.calls.add(o.node), o.resources = r._findResources(o.node, t), n.push(...o.resources)), i.name === "textureSample" && i.args.length >= 2) {
					let e = i.args[0], t = null;
					if (e instanceof Ks) {
						let n = r._findResource(e.name);
						n && n.resourceType === Uo.Texture && (t = n);
					}
					let n = i.args[1], a = null;
					if (n instanceof Ks) {
						let e = r._findResource(n.name);
						e && e.resourceType === Uo.Sampler && (a = e);
					}
					t && a && (t.relations === null && (t.relations = []), t.relations.push(a), a.relations === null && (a.relations = []), a.relations.push(t));
				}
			} else if (a instanceof Ts) {
				let i = a, o = r._functions.get(i.name);
				o && (t && (o.inUse = !0), e.calls.add(o.node), o.resources = r._findResources(o.node, t), n.push(...o.resources));
			}
		}), [...new Map(n.map((e) => [e.name, e])).values()];
	}
	getBindGroups() {
		let e = [];
		function t(t, n) {
			t >= e.length && (e.length = t + 1), e[t] === void 0 && (e[t] = []), n >= e[t].length && (e[t].length = n + 1);
		}
		for (let n of this.uniforms) t(n.group, n.binding), e[n.group][n.binding] = n;
		for (let n of this.storage) t(n.group, n.binding), e[n.group][n.binding] = n;
		for (let n of this.textures) t(n.group, n.binding), e[n.group][n.binding] = n;
		for (let n of this.samplers) t(n.group, n.binding), e[n.group][n.binding] = n;
		return e;
	}
	_getOutputs(e, t = void 0) {
		if (t === void 0 && (t = []), e instanceof Rs) this._getStructOutputs(e, t);
		else {
			let n = this._getOutputInfo(e);
			n !== null && t.push(n);
		}
		return t;
	}
	_getStructOutputs(e, t) {
		for (let n of e.members) if (n.type instanceof Rs) this._getStructOutputs(n.type, t);
		else {
			let e = this._getAttribute(n, "location") || this._getAttribute(n, "builtin");
			if (e !== null) {
				let r = this.getTypeInfo(n.type, n.type.attributes), i = this._parseInt(e.value), a = new qo(n.name, r, e.name, i);
				t.push(a);
			}
		}
	}
	_getOutputInfo(e) {
		let t = this._getAttribute(e, "location") || this._getAttribute(e, "builtin");
		if (t !== null) {
			let n = this.getTypeInfo(e, e.attributes), r = this._parseInt(t.value);
			return new qo("", n, t.name, r);
		}
		return null;
	}
	_getInputs(e, t = void 0) {
		t === void 0 && (t = []);
		for (let n of e) if (n.type instanceof Rs) this._getStructInputs(n.type, t);
		else {
			let e = this._getInputInfo(n);
			e !== null && t.push(e);
		}
		return t;
	}
	_getStructInputs(e, t) {
		for (let n of e.members) if (n.type instanceof Rs) this._getStructInputs(n.type, t);
		else {
			let e = this._getInputInfo(n);
			e !== null && t.push(e);
		}
	}
	_getInputInfo(e) {
		let t = this._getAttribute(e, "location") || this._getAttribute(e, "builtin");
		if (t !== null) {
			let n = this._getAttribute(e, "interpolate"), r = this.getTypeInfo(e.type, e.attributes), i = this._parseInt(t.value), a = new Ko(e.name, r, t.name, i);
			return n !== null && (a.interpolation = this._parseString(n.value)), a;
		}
		return null;
	}
	_parseString(e) {
		return e instanceof Array && (e = e[0]), e;
	}
	_parseInt(e) {
		e instanceof Array && (e = e[0]);
		let t = parseInt(e);
		return isNaN(t) ? this._constValues.get(e) ?? e : t;
	}
	_getAlias(e) {
		for (let t of this.aliases) if (t.name == e) return t.type;
		return null;
	}
	_getAliasInfo(e) {
		return new Go(e.name, this.getTypeInfo(e.type, null));
	}
	getTypeInfoByName(e) {
		for (let t of this.structs) if (t.name == e) return t;
		for (let t of this.aliases) if (t.name == e) return t.type;
		return null;
	}
	getTypeInfo(e, t = null) {
		if (this._types.has(e)) return this._types.get(e);
		if (e instanceof zs) {
			let n = e.type ? this.getTypeInfo(e.type, e.attributes) : null, r = new Vo(e.name, n, t);
			return this._types.set(e, r), this._updateTypeInfo(r), r;
		}
		if (e instanceof Bs) {
			let n = e, r = n.format ? this.getTypeInfo(n.format, n.attributes) : null, i = new Bo(n.name, t);
			return i.format = r, i.count = n.count, this._types.set(e, i), this._updateTypeInfo(i), i;
		}
		if (e instanceof Rs) {
			let n = e, r = new zo(n.name, n.attributes ?? t);
			r.startLine = n.startLine, r.endLine = n.endLine;
			for (let e of n.members) {
				let t = this.getTypeInfo(e.type, e.attributes);
				r.members.push(new Ro(e.name, t, e.attributes));
			}
			return this._types.set(e, r), this._updateTypeInfo(r), r;
		}
		if (e instanceof Vs) {
			let n = e, r = n.format instanceof L, i = n.format ? r ? this.getTypeInfo(n.format, null) : new Lo(n.format, null) : null, a = new Ho(n.name, i, t, n.access);
			return this._types.set(e, a), this._updateTypeInfo(a), a;
		}
		if (e instanceof R) {
			let n = e, r = n.format ? this.getTypeInfo(n.format, null) : null, i = new Ho(n.name, r, t, n.access);
			return this._types.set(e, i), this._updateTypeInfo(i), i;
		}
		let n = new Lo(e.name, t);
		return this._types.set(e, n), this._updateTypeInfo(n), n;
	}
	_updateTypeInfo(e) {
		if (e.size = this._getTypeSize(e)?.size ?? 0, e instanceof Bo && e.format) {
			let t = this._getTypeSize(e.format);
			e.stride = Math.max(t?.size ?? 0, t?.align ?? 0), this._updateTypeInfo(e.format);
		}
		e instanceof Vo && this._updateTypeInfo(e.format), e instanceof zo && this._updateStructInfo(e);
	}
	_updateStructInfo(e) {
		let t = 0, n = 0, r = 0, i = 0;
		for (let a = 0, o = e.members.length; a < o; ++a) {
			let o = e.members[a], s = this._getTypeSize(o);
			if (!s) continue;
			this._getAlias(o.type.name) ?? o.type;
			let c = s.align, l = s.size;
			t = this._roundUp(c, t + n), n = l, r = t, i = Math.max(i, c), o.offset = t, o.size = l, this._updateTypeInfo(o.type);
		}
		e.size = this._roundUp(i, r + n), e.align = i;
	}
	_getTypeSize(t) {
		if (t == null) return null;
		let n = this._getAttributeNum(t.attributes, "size", 0), r = this._getAttributeNum(t.attributes, "align", 0);
		if (t instanceof Ro && (t = t.type), t instanceof Lo) {
			let e = this._getAlias(t.name);
			e !== null && (t = e);
		}
		{
			let i = e._typeInfo[t.name];
			if (i !== void 0) {
				let e = t.format?.name === "f16" ? 2 : 1;
				return new Oc(Math.max(r, i.align / e), Math.max(n, i.size / e));
			}
		}
		{
			let i = e._typeInfo[t.name.substring(0, t.name.length - 1)];
			if (i) {
				let e = t.name[t.name.length - 1] === "h" ? 2 : 1;
				return new Oc(Math.max(r, i.align / e), Math.max(n, i.size / e));
			}
		}
		if (t instanceof Bo) {
			let e = t, i = 8, a = 8, o = this._getTypeSize(e.format);
			return o !== null && (a = o.size, i = o.align), a = e.count * this._getAttributeNum(t?.attributes ?? null, "stride", this._roundUp(i, a)), n && (a = n), new Oc(Math.max(r, i), Math.max(n, a));
		}
		if (t instanceof zo) {
			let e = 0, i = 0, a = 0, o = 0, s = 0;
			for (let n of t.members) {
				let t = this._getTypeSize(n.type);
				t !== null && (e = Math.max(t.align, e), a = this._roundUp(t.align, a + o), o = t.size, s = a);
			}
			return i = this._roundUp(e, s + o), new Oc(Math.max(r, e), Math.max(n, i));
		}
		return null;
	}
	_isUniformVar(e) {
		return e instanceof _s && e.storage == "uniform";
	}
	_isImmediateVar(e) {
		return e instanceof _s && e.storage == "immediate";
	}
	_isStorageVar(e) {
		return e instanceof _s && e.storage == "storage";
	}
	_isTextureVar(t) {
		return t instanceof _s && t.type !== null && e._textureTypes.indexOf(t.type.name) != -1;
	}
	_isSamplerVar(t) {
		return t instanceof _s && t.type !== null && e._samplerTypes.indexOf(t.type.name) != -1;
	}
	_getAttribute(e, t) {
		let n = e;
		if (!n || !n.attributes) return null;
		let r = n.attributes;
		for (let e of r) if (e.name == t) return e;
		return null;
	}
	_getAttributeNum(e, t, n) {
		if (e === null) return n;
		for (let r of e) if (r.name == t) {
			let e = r !== null && r.value !== null ? r.value : n;
			if (e instanceof Array && (e = e[0]), typeof e == "number") return e;
			if (typeof e == "string") {
				let t = parseInt(e);
				return isNaN(t) ? this._constValues.get(e) ?? n : t;
			}
			return n;
		}
		return n;
	}
	_roundUp(e, t) {
		return Math.ceil(t / e) * e;
	}
};
kc._typeInfo = {
	f16: {
		align: 2,
		size: 2
	},
	i32: {
		align: 4,
		size: 4
	},
	u32: {
		align: 4,
		size: 4
	},
	f32: {
		align: 4,
		size: 4
	},
	atomic: {
		align: 4,
		size: 4
	},
	vec2: {
		align: 8,
		size: 8
	},
	vec3: {
		align: 16,
		size: 12
	},
	vec4: {
		align: 16,
		size: 16
	},
	mat2x2: {
		align: 8,
		size: 16
	},
	mat3x2: {
		align: 8,
		size: 24
	},
	mat4x2: {
		align: 8,
		size: 32
	},
	mat2x3: {
		align: 16,
		size: 32
	},
	mat3x3: {
		align: 16,
		size: 48
	},
	mat4x3: {
		align: 16,
		size: 64
	},
	mat2x4: {
		align: 16,
		size: 32
	},
	mat3x4: {
		align: 16,
		size: 48
	},
	mat4x4: {
		align: 16,
		size: 64
	}
}, kc._textureTypes = K.any_texture_type.map((e) => e.name), kc._samplerTypes = K.sampler_type.map((e) => e.name);
var Ac = 0, jc = class e {
	constructor(e, t, n) {
		this.id = Ac++, this.name = e, this.value = t, this.node = n;
	}
	clone() {
		return new e(this.name, this.value, this.node);
	}
}, Mc = class e {
	constructor(e) {
		this.id = Ac++, this.name = e.name, this.node = e;
	}
	clone() {
		return new e(this.node);
	}
}, Nc = class e {
	constructor(e) {
		this.parent = null, this.variables = /* @__PURE__ */ new Map(), this.functions = /* @__PURE__ */ new Map(), this.derivatives = /* @__PURE__ */ new Map(), this.currentFunctionName = "", this.id = Ac++, e && (this.parent = e, this.currentFunctionName = e.currentFunctionName);
	}
	setDerivative(e, t) {
		this.derivatives.set(e, t);
	}
	getDerivative(e) {
		return this.derivatives.has(e) ? this.derivatives.get(e) ?? null : this.parent ? this.parent.getDerivative(e) : null;
	}
	clearDerivative(e) {
		this.derivatives.has(e) ? this.derivatives.delete(e) : this.parent && this.parent.clearDerivative(e);
	}
	getVariable(e) {
		return this.variables.has(e) ? this.variables.get(e) ?? null : this.parent ? this.parent.getVariable(e) : null;
	}
	getFunction(e) {
		return this.functions.has(e) ? this.functions.get(e) ?? null : this.parent ? this.parent.getFunction(e) : null;
	}
	createVariable(e, t, n) {
		this.variables.set(e, new jc(e, t, n ?? null));
	}
	setVariable(e, t, n) {
		let r = this.getVariable(e);
		r === null ? this.createVariable(e, t, n) : r.value = t;
	}
	getVariableValue(e) {
		return this.getVariable(e)?.value ?? null;
	}
	clone() {
		return new e(this);
	}
}, Pc = class {
	evalExpression(e, t) {
		return null;
	}
	getTypeInfo(e) {
		return null;
	}
	getVariableName(e, t) {
		return "";
	}
};
function Fc(e, t, n) {
	let r = Math.abs(e), i = Math.abs(t), a = Math.abs(n), o, s, c, l;
	return r >= i && r >= a ? (o = e > 0 ? 0 : 1, s = e > 0 ? -n : n, c = -t, l = r) : i >= a ? (o = t > 0 ? 2 : 3, s = e, c = t > 0 ? n : -n, l = i) : (o = n > 0 ? 4 : 5, s = n > 0 ? e : -e, c = -t, l = a), l === 0 ? {
		face: o,
		u: .5,
		v: .5
	} : {
		face: o,
		u: .5 * (s / l + 1),
		v: .5 * (c / l + 1)
	};
}
var Ic = class e {
	constructor(e) {
		this.exec = e;
	}
	getTypeInfo(e) {
		return this.exec.getTypeInfo(e);
	}
	All(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = !0;
		if (n instanceof H) return n.data.forEach((e) => {
			e || (r = !1);
		}), new V(+!!r, this.getTypeInfo("bool"));
		throw Error(`All() expects a vector argument. Line ${e.line}`);
	}
	Any(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (n instanceof H) return new V(+!!n.data.some((e) => e), this.getTypeInfo("bool"));
		throw Error(`Any() expects a vector argument. Line ${e.line}`);
	}
	Select(e, t) {
		let n = this.exec.evalExpression(e.args[2], t);
		if (n instanceof H) {
			let r = this.exec.evalExpression(e.args[0], t), i = this.exec.evalExpression(e.args[1], t);
			if (!(r instanceof H && i instanceof H)) throw Error(`Select() with a vector condition expects vector values. Line ${e.line}`);
			return new H(n.data.map((e, t) => e ? i.data[t] : r.data[t]), r.typeInfo);
		}
		if (!(n instanceof V)) throw Error(`Select() expects a bool condition. Line ${e.line}`);
		return n.value ? this.exec.evalExpression(e.args[1], t) : this.exec.evalExpression(e.args[0], t);
	}
	ArrayLength(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.evalExpression(n, t);
		if (r instanceof W && r.typeInfo.size === 0) {
			let e = r.typeInfo;
			return new V(r.buffer.byteLength / e.stride, this.getTypeInfo("u32"));
		}
		return new V(r.typeInfo.size, this.getTypeInfo("u32"));
	}
	Abs(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (n instanceof H) return new H(n.data.map((e) => Math.abs(e)), n.typeInfo);
		let r = n;
		return new V(Math.abs(r.value), r.typeInfo);
	}
	Acos(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.acos(e)), n.typeInfo) : new V(Math.acos(n.value), n.typeInfo);
	}
	Acosh(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.acosh(e)), n.typeInfo) : new V(Math.acosh(n.value), n.typeInfo);
	}
	Asin(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.asin(e)), n.typeInfo) : new V(Math.asin(n.value), n.typeInfo);
	}
	Asinh(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.asinh(e)), n.typeInfo) : new V(Math.asinh(n.value), n.typeInfo);
	}
	Atan(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.atan(e)), n.typeInfo) : new V(Math.atan(n.value), n.typeInfo);
	}
	Atanh(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.atanh(e)), n.typeInfo) : new V(Math.atanh(n.value), n.typeInfo);
	}
	Atan2(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t);
		if (n instanceof H && r instanceof H) return new H(n.data.map((e, t) => Math.atan2(e, r.data[t])), n.typeInfo);
		let i = n, a = r;
		return new V(Math.atan2(i.value, a.value), n.typeInfo);
	}
	Ceil(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.ceil(e)), n.typeInfo) : new V(Math.ceil(n.value), n.typeInfo);
	}
	_clamp(e, t, n) {
		return Math.min(Math.max(e, t), n);
	}
	Clamp(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t), i = this.exec.evalExpression(e.args[2], t);
		if (n instanceof H && r instanceof H && i instanceof H) return new H(n.data.map((e, t) => this._clamp(e, r.data[t], i.data[t])), n.typeInfo);
		let a = n, o = r, s = i;
		return new V(this._clamp(a.value, o.value, s.value), n.typeInfo);
	}
	Cos(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.cos(e)), n.typeInfo) : new V(Math.cos(n.value), n.typeInfo);
	}
	Cosh(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.cosh(e)), n.typeInfo) : new V(Math.cos(n.value), n.typeInfo);
	}
	CountLeadingZeros(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.clz32(e)), n.typeInfo) : new V(Math.clz32(n.value), n.typeInfo);
	}
	_countOneBits(e) {
		let t = 0;
		for (; e !== 0;) 1 & e && t++, e >>= 1;
		return t;
	}
	CountOneBits(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (n instanceof H) return new H(n.data.map((e) => this._countOneBits(e)), n.typeInfo);
		let r = n;
		return new V(this._countOneBits(r.value), n.typeInfo);
	}
	_countTrailingZeros(e) {
		if (e === 0) return 32;
		let t = 0;
		for (; !(1 & e);) e >>= 1, t++;
		return t;
	}
	CountTrailingZeros(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (n instanceof H) return new H(n.data.map((e) => this._countTrailingZeros(e)), n.typeInfo);
		let r = n;
		return new V(this._countTrailingZeros(r.value), n.typeInfo);
	}
	Cross(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t);
		if (n instanceof H && r instanceof H) {
			if (n.data.length !== 3 || r.data.length !== 3) return null;
			let e = n.data, t = r.data;
			return new H([
				e[1] * t[2] - t[1] * e[2],
				e[2] * t[0] - t[2] * e[0],
				e[0] * t[1] - t[0] * e[1]
			], n.typeInfo);
		}
		return null;
	}
	Degrees(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = 180 / Math.PI;
		return n instanceof H ? new H(n.data.map((e) => e * r), n.typeInfo) : new V(n.value * r, this.getTypeInfo("f32"));
	}
	Determinant(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (n instanceof U) {
			let e = n.data, t = n.typeInfo.getTypeName(), r = t.endsWith("h") ? this.getTypeInfo("f16") : this.getTypeInfo("f32");
			if (t === "mat2x2" || t === "mat2x2f" || t === "mat2x2h") return new V(e[0] * e[3] - e[1] * e[2], r);
			if (t === "mat3x3" || t === "mat3x3f" || t === "mat3x3h") return new V(e[0] * (e[4] * e[8] - e[5] * e[7]) - e[1] * (e[3] * e[8] - e[5] * e[6]) + e[2] * (e[3] * e[7] - e[4] * e[6]), r);
			if (t === "mat4x4" || t === "mat4x4f" || t === "mat4x4h") {
				let t = e[0], n = e[1], i = e[2], a = e[3], o = e[4], s = e[5], c = e[6], l = e[7], u = e[8], d = e[9], f = e[10], p = e[11], m = e[12], h = e[13], g = e[14], _ = e[15];
				return new V((t * s - o * n) * (f * _ - g * p) - (t * c - o * i) * (d * _ - h * p) + (t * l - o * a) * (d * g - h * f) + (n * c - s * i) * (u * _ - m * p) - (n * l - s * a) * (u * g - m * f) + (i * l - c * a) * (u * h - m * d), r);
			}
			return null;
		}
		return null;
	}
	Distance(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t);
		if (n instanceof H && r instanceof H) {
			let e = 0;
			for (let t = 0; t < n.data.length; ++t) e += (n.data[t] - r.data[t]) * (n.data[t] - r.data[t]);
			return new V(Math.sqrt(e), this.getTypeInfo("f32"));
		}
		let i = n, a = r;
		return new V(Math.abs(i.value - a.value), n.typeInfo);
	}
	_dot(e, t) {
		let n = 0;
		for (let r = 0; r < e.length; ++r) n += t[r] * e[r];
		return n;
	}
	Dot(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t);
		return n instanceof H && r instanceof H ? new V(this._dot(n.data, r.data), this.getTypeInfo("f32")) : null;
	}
	Dot4U8Packed(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t), i = n.value >>> 0, a = r.value >>> 0, o = 0;
		for (let e = 0; e < 4; ++e) o += (i >>> 8 * e & 255) * (a >>> 8 * e & 255);
		return new V(o >>> 0, this.getTypeInfo("u32"));
	}
	Dot4I8Packed(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t), i = n.value >>> 0, a = r.value >>> 0, o = (e) => 128 & e ? e - 256 : e, s = 0;
		for (let e = 0; e < 4; ++e) s += o(i >>> 8 * e & 255) * o(a >>> 8 * e & 255);
		return new V(0 | s, this.getTypeInfo("i32"));
	}
	Exp(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.exp(e)), n.typeInfo) : new V(Math.exp(n.value), n.typeInfo);
	}
	Exp2(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => 2 ** e), n.typeInfo) : new V(2 ** n.value, n.typeInfo);
	}
	ExtractBits(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t), i = this.exec.evalExpression(e.args[2], t);
		if (r.typeInfo.name !== "u32" && r.typeInfo.name !== "x32" || i.typeInfo.name !== "u32" && i.typeInfo.name !== "x32") return null;
		let a = r.value, o = i.value;
		if (n instanceof H) return new H(n.data.map((e) => e >> a & (1 << o) - 1), n.typeInfo);
		if (n.typeInfo.name !== "i32" && n.typeInfo.name !== "x32") return null;
		let s = n.value;
		return new V(s >> a & (1 << o) - 1, this.getTypeInfo("i32"));
	}
	FaceForward(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t), i = this.exec.evalExpression(e.args[2], t);
		return n instanceof H && r instanceof H && i instanceof H ? new H(this._dot(r.data, i.data) < 0 ? Array.from(n.data) : n.data.map((e) => -e), n.typeInfo) : null;
	}
	_firstLeadingBit(e) {
		return e === 0 ? -1 : 31 - Math.clz32(e);
	}
	FirstLeadingBit(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (n instanceof H) return new H(n.data.map((e) => this._firstLeadingBit(e)), n.typeInfo);
		let r = n;
		return new V(this._firstLeadingBit(r.value), n.typeInfo);
	}
	_firstTrailingBit(e) {
		return e === 0 ? -1 : Math.log2(e & -e);
	}
	FirstTrailingBit(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (n instanceof H) return new H(n.data.map((e) => this._firstTrailingBit(e)), n.typeInfo);
		let r = n;
		return new V(this._firstTrailingBit(r.value), n.typeInfo);
	}
	Floor(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.floor(e)), n.typeInfo) : new V(Math.floor(n.value), n.typeInfo);
	}
	Fma(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t), i = this.exec.evalExpression(e.args[2], t);
		if (n instanceof H && r instanceof H && i instanceof H) return n.data.length !== r.data.length || n.data.length !== i.data.length ? null : new H(n.data.map((e, t) => e * r.data[t] + i.data[t]), n.typeInfo);
		let a = n, o = r, s = i;
		return new V(a.value * o.value + s.value, a.typeInfo);
	}
	Fract(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (n instanceof H) return new H(n.data.map((e) => e - Math.floor(e)), n.typeInfo);
		let r = n;
		return new V(r.value - Math.floor(r.value), n.typeInfo);
	}
	Frexp(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = (e) => e === 0 || !isFinite(e) || isNaN(e) ? e : e / 2 ** (Math.floor(Math.log2(Math.abs(e))) + 1);
		return n instanceof H ? new H(n.data.map((e) => r(e)), n.typeInfo) : new V(r(n.value), n.typeInfo);
	}
	InsertBits(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t), i = this.exec.evalExpression(e.args[2], t), a = this.exec.evalExpression(e.args[3], t);
		if (i.typeInfo.name !== "u32" && i.typeInfo.name !== "x32") return null;
		let o = i.value, s = (1 << a.value) - 1 << o, c = ~s;
		if (n instanceof H && r instanceof H) return new H(n.data.map((e, t) => e & c | r.data[t] << o & s), n.typeInfo);
		let l = n.value, u = r.value;
		return new V(l & c | u << o & s, n.typeInfo);
	}
	InverseSqrt(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => 1 / Math.sqrt(e)), n.typeInfo) : new V(1 / Math.sqrt(n.value), n.typeInfo);
	}
	Ldexp(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t);
		if (n instanceof H && r instanceof H) return new H(n.data.map((e, t) => e * 2 ** r.data[t]), n.typeInfo);
		let i = r;
		return new V(n.value * 2 ** i.value, n.typeInfo);
	}
	Length(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (n instanceof H) {
			let e = 0;
			return n.data.forEach((t) => {
				e += t * t;
			}), new V(Math.sqrt(e), this.getTypeInfo("f32"));
		}
		return new V(Math.abs(n.value), n.typeInfo);
	}
	Log(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.log(e)), n.typeInfo) : new V(Math.log(n.value), n.typeInfo);
	}
	Log2(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.log2(e)), n.typeInfo) : new V(Math.log2(n.value), n.typeInfo);
	}
	Max(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t);
		if (n instanceof H && r instanceof H) return new H(n.data.map((e, t) => Math.max(e, r.data[t])), n.typeInfo);
		let i = n, a = r;
		return new V(Math.max(i.value, a.value), n.typeInfo);
	}
	Min(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t);
		if (n instanceof H && r instanceof H) return new H(n.data.map((e, t) => Math.min(e, r.data[t])), n.typeInfo);
		let i = n, a = r;
		return new V(Math.min(i.value, a.value), n.typeInfo);
	}
	Mix(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t), i = this.exec.evalExpression(e.args[2], t);
		if (n === null || r === null || i === null) return null;
		if (n instanceof H && r instanceof H) {
			if (i instanceof H) return new H(n.data.map((e, t) => n.data[t] * (1 - i.data[t]) + r.data[t] * i.data[t]), n.typeInfo);
			let e = i.value;
			return new H(n.data.map((t, i) => n.data[i] * (1 - e) + r.data[i] * e), n.typeInfo);
		}
		let a = r, o = i;
		return new V(n.value * (1 - o.value) + a.value * o.value, n.typeInfo);
	}
	Modf(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t);
		if (n instanceof H && r instanceof H) return new H(n.data.map((e, t) => e % r.data[t]), n.typeInfo);
		let i = r;
		return new V(n.value % i.value, n.typeInfo);
	}
	Normalize(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (n instanceof H) {
			let r = this.Length(e, t).value;
			return new H(n.data.map((e) => e / r), n.typeInfo);
		}
		return null;
	}
	Pow(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t);
		if (n instanceof H && r instanceof H) return new H(n.data.map((e, t) => e ** +r.data[t]), n.typeInfo);
		let i = n, a = r;
		return new V(i.value ** +a.value, n.typeInfo);
	}
	QuantizeToF16(t, n) {
		let r = this.exec.evalExpression(t.args[0], n), i = (t) => e._f16BitsToF32(e._f32ToF16Bits(t));
		return r instanceof H ? new H(r.data.map((e) => i(e)), r.typeInfo) : new V(i(r.value), r.typeInfo);
	}
	Radians(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => e * Math.PI / 180), n.typeInfo) : new V(n.value * Math.PI / 180, this.getTypeInfo("f32"));
	}
	Reflect(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t);
		if (n instanceof H && r instanceof H) {
			let e = this._dot(n.data, r.data);
			return new H(n.data.map((t, n) => t - 2 * e * r.data[n]), n.typeInfo);
		}
		return null;
	}
	Refract(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t), i = this.exec.evalExpression(e.args[2], t);
		if (n instanceof H && r instanceof H && i instanceof V) {
			let e = this._dot(r.data, n.data);
			return new H(n.data.map((t, n) => {
				let a = 1 - i.value * i.value * (1 - e * e);
				if (a < 0) return 0;
				let o = Math.sqrt(a);
				return i.value * t - (i.value * e + o) * r.data[n];
			}), n.typeInfo);
		}
		return null;
	}
	ReverseBits(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = (e) => {
			let t = e >>> 0;
			return t = (1431655765 & t) << 1 | t >>> 1 & 1431655765, t = (858993459 & t) << 2 | t >>> 2 & 858993459, t = (252645135 & t) << 4 | t >>> 4 & 252645135, t = (16711935 & t) << 8 | t >>> 8 & 16711935, (t << 16 | t >>> 16) >>> 0;
		};
		return n instanceof H ? new H(n.data.map((e) => r(e)), n.typeInfo) : new V(r(n.value), n.typeInfo);
	}
	Round(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.round(e)), n.typeInfo) : new V(Math.round(n.value), n.typeInfo);
	}
	Saturate(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.min(Math.max(e, 0), 1)), n.typeInfo) : new V(Math.min(Math.max(n.value, 0), 1), n.typeInfo);
	}
	Sign(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.sign(e)), n.typeInfo) : new V(Math.sign(n.value), n.typeInfo);
	}
	Sin(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.sin(e)), n.typeInfo) : new V(Math.sin(n.value), n.typeInfo);
	}
	Sinh(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.sinh(e)), n.typeInfo) : new V(Math.sinh(n.value), n.typeInfo);
	}
	_smoothstep(e, t, n) {
		let r = Math.min(Math.max((n - e) / (t - e), 0), 1);
		return r * r * (3 - 2 * r);
	}
	SmoothStep(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t), i = this.exec.evalExpression(e.args[2], t);
		if (i instanceof H && n instanceof H && r instanceof H) return new H(i.data.map((e, t) => this._smoothstep(n.data[t], r.data[t], e)), i.typeInfo);
		let a = n, o = r, s = i;
		return new V(this._smoothstep(a.value, o.value, s.value), i.typeInfo);
	}
	Sqrt(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.sqrt(e)), n.typeInfo) : new V(Math.sqrt(n.value), n.typeInfo);
	}
	Step(e, t) {
		let n = this.exec.evalExpression(e.args[0], t), r = this.exec.evalExpression(e.args[1], t);
		if (r instanceof H && n instanceof H) return new H(r.data.map((e, t) => e < n.data[t] ? 0 : 1), r.typeInfo);
		let i = n;
		return new V(r.value < i.value ? 0 : 1, i.typeInfo);
	}
	Tan(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.tan(e)), n.typeInfo) : new V(Math.tan(n.value), n.typeInfo);
	}
	Tanh(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.tanh(e)), n.typeInfo) : new V(Math.tanh(n.value), n.typeInfo);
	}
	_getTransposeType(e) {
		let t = e.getTypeName();
		return t === "mat2x2f" || t === "mat2x2h" ? e : t === "mat2x3f" ? this.getTypeInfo("mat3x2f") : t === "mat2x3h" ? this.getTypeInfo("mat3x2h") : t === "mat2x4f" ? this.getTypeInfo("mat4x2f") : t === "mat2x4h" ? this.getTypeInfo("mat4x2h") : t === "mat3x2f" ? this.getTypeInfo("mat2x3f") : t === "mat3x2h" ? this.getTypeInfo("mat2x3h") : t === "mat3x3f" || t === "mat3x3h" ? e : t === "mat3x4f" ? this.getTypeInfo("mat4x3f") : t === "mat3x4h" ? this.getTypeInfo("mat4x3h") : t === "mat4x2f" ? this.getTypeInfo("mat2x4f") : t === "mat4x2h" ? this.getTypeInfo("mat2x4h") : t === "mat4x3f" ? this.getTypeInfo("mat3x4f") : t === "mat4x3h" ? this.getTypeInfo("mat3x4h") : e;
	}
	Transpose(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof U)) return null;
		let r = this._getTransposeType(n.typeInfo);
		if (n.typeInfo.name === "mat2x2" || n.typeInfo.name === "mat2x2f" || n.typeInfo.name === "mat2x2h") {
			let e = n.data;
			return new U([
				e[0],
				e[2],
				e[1],
				e[3]
			], r);
		}
		if (n.typeInfo.name === "mat2x3" || n.typeInfo.name === "mat2x3f" || n.typeInfo.name === "mat2x3h") {
			let e = n.data;
			return new U([
				e[0],
				e[3],
				e[6],
				e[1],
				e[4],
				e[7]
			], r);
		}
		if (n.typeInfo.name === "mat2x4" || n.typeInfo.name === "mat2x4f" || n.typeInfo.name === "mat2x4h") {
			let e = n.data;
			return new U([
				e[0],
				e[4],
				e[8],
				e[12],
				e[1],
				e[5],
				e[9],
				e[13]
			], r);
		}
		if (n.typeInfo.name === "mat3x2" || n.typeInfo.name === "mat3x2f" || n.typeInfo.name === "mat3x2h") {
			let e = n.data;
			return new U([
				e[0],
				e[3],
				e[1],
				e[4],
				e[2],
				e[5]
			], r);
		}
		if (n.typeInfo.name === "mat3x3" || n.typeInfo.name === "mat3x3f" || n.typeInfo.name === "mat3x3h") {
			let e = n.data;
			return new U([
				e[0],
				e[3],
				e[6],
				e[1],
				e[4],
				e[7],
				e[2],
				e[5],
				e[8]
			], r);
		}
		if (n.typeInfo.name === "mat3x4" || n.typeInfo.name === "mat3x4f" || n.typeInfo.name === "mat3x4h") {
			let e = n.data;
			return new U([
				e[0],
				e[4],
				e[8],
				e[12],
				e[1],
				e[5],
				e[9],
				e[13],
				e[2],
				e[6],
				e[10],
				e[14]
			], r);
		}
		if (n.typeInfo.name === "mat4x2" || n.typeInfo.name === "mat4x2f" || n.typeInfo.name === "mat4x2h") {
			let e = n.data;
			return new U([
				e[0],
				e[4],
				e[1],
				e[5],
				e[2],
				e[6]
			], r);
		}
		if (n.typeInfo.name === "mat4x3" || n.typeInfo.name === "mat4x3f" || n.typeInfo.name === "mat4x3h") {
			let e = n.data;
			return new U([
				e[0],
				e[4],
				e[8],
				e[1],
				e[5],
				e[9],
				e[2],
				e[6],
				e[10]
			], r);
		}
		if (n.typeInfo.name === "mat4x4" || n.typeInfo.name === "mat4x4f" || n.typeInfo.name === "mat4x4h") {
			let e = n.data;
			return new U([
				e[0],
				e[4],
				e[8],
				e[12],
				e[1],
				e[5],
				e[9],
				e[13],
				e[2],
				e[6],
				e[10],
				e[14],
				e[3],
				e[7],
				e[11],
				e[15]
			], r);
		}
		return null;
	}
	Trunc(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map((e) => Math.trunc(e)), n.typeInfo) : new V(Math.trunc(n.value), n.typeInfo);
	}
	_derivative(e, t) {
		let n = t.getDerivative(e);
		if (n !== null) return t.clearDerivative(e), n;
		let r = this.exec.evalExpression(e.args[0], t);
		return r instanceof H ? new H(Array.from(r.data, () => 0), r.typeInfo) : r instanceof V ? new V(0, r.typeInfo) : r;
	}
	Dpdx(e, t) {
		return this._derivative(e, t);
	}
	DpdxCoarse(e, t) {
		return this._derivative(e, t);
	}
	DpdxFine(e, t) {
		return this._derivative(e, t);
	}
	Dpdy(e, t) {
		return this._derivative(e, t);
	}
	DpdyCoarse(e, t) {
		return this._derivative(e, t);
	}
	DpdyFine(e, t) {
		return this._derivative(e, t);
	}
	Fwidth(e, t) {
		return this._derivative(e, t);
	}
	FwidthCoarse(e, t) {
		return this._derivative(e, t);
	}
	FwidthFine(e, t) {
		return this._derivative(e, t);
	}
	TextureDimensions(e, t) {
		let n = e.args[0], r = e.args.length > 1 ? this.exec.evalExpression(e.args[1], t).value : 0;
		if (n instanceof Ks) {
			let e = n.name, i = t.getVariableValue(e);
			if (i instanceof fc) {
				if (r < 0 || r >= i.mipLevelCount) return null;
				let e = i.getMipLevelSize(r), t = i.dimension;
				return t === "1d" ? new V(e[0], this.getTypeInfo("u32")) : t === "3d" ? new H(e, this.getTypeInfo("vec3u")) : t === "2d" ? new H(e.slice(0, 2), this.getTypeInfo("vec2u")) : null;
			}
			return null;
		}
		return null;
	}
	_gatherTexels(e, t, n, r, i) {
		let a = i?.descriptor ?? {}, o = a.addressModeU ?? "clamp-to-edge", s = a.addressModeV ?? "clamp-to-edge", c = e.getMipLevelSize(0), l = Math.max(1, c[0]), u = Math.max(1, c[1]), d = Math.floor(t * l - .5), f = Math.floor(n * u - .5), p = (t, n) => this._texel(e, t, n, r, 0, o, s);
		return [
			p(d, f + 1),
			p(d + 1, f + 1),
			p(d + 1, f),
			p(d, f)
		];
	}
	_gatherResultType(e) {
		if (e.typeInfo.name.includes("depth")) return this.getTypeInfo("vec4f");
		let t = e.typeInfo.format?.name;
		return t === "u32" ? this.getTypeInfo("vec4u") : t === "i32" ? this.getTypeInfo("vec4i") : this.getTypeInfo("vec4f");
	}
	TextureGather(e, t) {
		let n = this._resolveTexture(e.args[0], t) !== null, r = 0;
		if (!n) {
			let n = this.exec.evalExpression(e.args[0], t);
			n instanceof V && (r = Math.floor(n.value));
		}
		let i = +!n, a = this._sampleArgs(e, t, i + 2, i);
		if (a === null) return null;
		let o = this._resolveSampler(e.args[i + 1], t), s = this._gatherTexels(a.texture, a.u, a.v, a.layer, o), c = Math.max(0, Math.min(r, 3));
		return new H(s.map((e) => e[c]), this._gatherResultType(a.texture));
	}
	TextureGatherCompare(e, t) {
		let n = this._sampleArgs(e, t, 2);
		if (n === null) return null;
		let r = this._resolveSampler(e.args[1], t), i = n.texture.typeInfo.name.includes("_array") ? 4 : 3, a = this.exec.evalExpression(e.args[i], t), o = a instanceof V ? a.value : 0, s = this._compareFn(r?.descriptor.compare ?? "less-equal");
		return new H(this._gatherTexels(n.texture, n.u, n.v, n.layer, r).map((e) => +!!s(o, e[0])), this.getTypeInfo("vec4f"));
	}
	TextureLoad(e, t) {
		let n = e.args[0], r = this.exec.evalExpression(e.args[1], t);
		if (!(r instanceof H) || r.data.length !== 2 && r.data.length !== 3) return null;
		if (n instanceof Ks) {
			let i = n.name, a = t.getVariableValue(i);
			if (a instanceof fc) {
				let n = 0, i = 0;
				[
					"texture_storage_2d_array",
					"texture_2d_array",
					"texture_depth_2d_array"
				].indexOf(a.typeInfo.name) > -1 && (n = this.exec.evalExpression(e.args[2], t).value), [
					"texture_1d",
					"texture_2d",
					"texture_depth_2d",
					"texture_3d"
				].indexOf(a.typeInfo.name) > -1 && (i = this.exec.evalExpression(e.args[2], t).value), ["texture_2d_array", "texture_depth_2d_array"].indexOf(a.typeInfo.name) > -1 && (i = this.exec.evalExpression(e.args[3], t).value), a.typeInfo.name.includes("_3d") && r.data.length === 3 && (n = r.data[2]);
				let o = Math.floor(r.data[0]), s = Math.floor(r.data[1]), c = Math.floor(n), l = Math.floor(i);
				if (o < 0 || o >= a.width || s < 0 || s >= a.height) return null;
				let u = a.getPixel(o, s, c, l);
				return u === null ? null : new H(u, this.getTypeInfo("vec4f"));
			}
			return null;
		}
		return null;
	}
	TextureNumLayers(e, t) {
		let n = e.args[0];
		if (n instanceof Ks) {
			let e = n.name, r = t.getVariableValue(e);
			return r instanceof fc ? new V(r.depthOrArrayLayers, this.getTypeInfo("u32")) : null;
		}
		return null;
	}
	TextureNumLevels(e, t) {
		let n = e.args[0];
		if (n instanceof Ks) {
			let e = n.name, r = t.getVariableValue(e);
			return r instanceof fc ? new V(r.mipLevelCount, this.getTypeInfo("u32")) : null;
		}
		return null;
	}
	TextureNumSamples(e, t) {
		let n = e.args[0];
		if (n instanceof Ks) {
			let e = n.name, r = t.getVariableValue(e);
			return r instanceof fc ? new V(r.sampleCount, this.getTypeInfo("u32")) : null;
		}
		return null;
	}
	_resolveTexture(e, t) {
		if (e instanceof Ks) {
			let n = t.getVariableValue(e.name);
			return n instanceof fc ? n : null;
		}
		let n = this.exec.evalExpression(e, t);
		return n instanceof fc ? n : null;
	}
	_resolveSampler(e, t) {
		if (e instanceof Ks) {
			let n = t.getVariableValue(e.name);
			return n instanceof dc ? n : null;
		}
		return null;
	}
	_wrap(e, t, n) {
		if (n === "repeat") return (e % t + t) % t;
		if (n === "mirror-repeat") {
			let n = 2 * t, r = (e % n + n) % n;
			return r < t ? r : n - 1 - r;
		}
		return Math.max(0, Math.min(e, t - 1));
	}
	_texel(e, t, n, r, i, a, o) {
		let s = e.getMipLevelSize(i), c = Math.max(1, s[0]), l = Math.max(1, s[1]), u = e.getPixel(this._wrap(t, c, a), this._wrap(n, l, o), r, i) ?? [
			0,
			0,
			0,
			0
		];
		return [
			u[0] ?? 0,
			u[1] ?? 0,
			u[2] ?? 0,
			u[3] ?? 1
		];
	}
	_filterSlice(e, t, n, r, i, a) {
		let o = a?.descriptor ?? {}, s = o.addressModeU ?? "clamp-to-edge", c = o.addressModeV ?? "clamp-to-edge", l = e.getMipLevelSize(i), u = Math.max(1, l[0]), d = Math.max(1, l[1]);
		if (o.magFilter === "nearest") return this._texel(e, Math.floor(t * u), Math.floor(n * d), r, i, s, c);
		let f = t * u - .5, p = n * d - .5, m = Math.floor(f), h = Math.floor(p), g = f - m, _ = p - h, v = this._texel(e, m, h, r, i, s, c), y = this._texel(e, m + 1, h, r, i, s, c), b = this._texel(e, m, h + 1, r, i, s, c), x = this._texel(e, m + 1, h + 1, r, i, s, c), S = [
			0,
			0,
			0,
			0
		];
		for (let e = 0; e < 4; ++e) {
			let t = v[e] + (y[e] - v[e]) * g, n = b[e] + (x[e] - b[e]) * g;
			S[e] = t + (n - t) * _;
		}
		return S;
	}
	_filterMip(e, t, n, r, i, a, o = null) {
		if (o === null) return this._filterSlice(e, t, n, r, i, a);
		let s = a?.descriptor ?? {}, c = s.addressModeW ?? "clamp-to-edge", l = Math.max(1, e.getMipLevelSize(i)[2]);
		if (s.magFilter === "nearest") return this._filterSlice(e, t, n, this._wrap(Math.floor(o * l), l, c), i, a);
		let u = o * l - .5, d = Math.floor(u), f = u - d, p = this._filterSlice(e, t, n, this._wrap(d, l, c), i, a);
		if (f === 0) return p;
		let m = this._filterSlice(e, t, n, this._wrap(d + 1, l, c), i, a);
		return p.map((e, t) => e + (m[t] - e) * f);
	}
	_sampleTexture(e, t, n, r, i, a, o = null) {
		let s = e.mipLevelCount - 1;
		if (i = Math.max(0, Math.min(i, s)), a?.descriptor.mipmapFilter === "nearest") return this._filterMip(e, t, n, r, Math.round(i), a, o);
		let c = Math.floor(i), l = i - c, u = this._filterMip(e, t, n, r, c, a, o);
		if (l === 0 || c >= s) return u;
		let d = this._filterMip(e, t, n, r, c + 1, a, o);
		return u.map((e, t) => e + (d[t] - e) * l);
	}
	_cubeFaceUV(e, t, n) {
		return Fc(e, t, n);
	}
	_compareFn(e) {
		switch (e) {
			case "less": return (e, t) => e < t;
			case "greater": return (e, t) => e > t;
			case "less-equal":
			default: return (e, t) => e <= t;
			case "greater-equal": return (e, t) => e >= t;
			case "equal": return (e, t) => e === t;
			case "not-equal": return (e, t) => e !== t;
			case "always": return () => !0;
			case "never": return () => !1;
		}
	}
	_sampleCompareValue(e, t) {
		let n = this._sampleArgs(e, t, 2);
		if (n === null) return null;
		let r = this._resolveSampler(e.args[1], t)?.descriptor ?? {}, i = n.texture.typeInfo.name.includes("_array") ? 4 : 3, a = this.exec.evalExpression(e.args[i], t), o = a instanceof V ? a.value : 0, s = this._compareFn(r.compare ?? "less-equal"), c = r.addressModeU ?? "clamp-to-edge", l = r.addressModeV ?? "clamp-to-edge", u = n.texture.getMipLevelSize(0), d = Math.max(1, u[0]), f = Math.max(1, u[1]), p = (e, t) => +!!s(o, this._texel(n.texture, e, t, n.layer, 0, c, l)[0]);
		if (r.magFilter === "nearest") return new V(p(Math.floor(n.u * d), Math.floor(n.v * f)), this.getTypeInfo("f32"));
		let m = n.u * d - .5, h = n.v * f - .5, g = Math.floor(m), _ = Math.floor(h), v = m - g, y = h - _, b = p(g, _) + (p(g + 1, _) - p(g, _)) * v;
		return new V(b + (p(g, _ + 1) + (p(g + 1, _ + 1) - p(g, _ + 1)) * v - b) * y, this.getTypeInfo("f32"));
	}
	_sampleResult(e, t) {
		return e.typeInfo.name.includes("depth") ? new V(t[0], this.getTypeInfo("f32")) : new H(t, this.getTypeInfo("vec4f"));
	}
	_sampleArgs(e, t, n, r = 0) {
		let i = this._resolveTexture(e.args[r], t);
		if (i === null) return null;
		let a = i.typeInfo.name, o = a.includes("_cube"), s = a.includes("_3d"), c = a.includes("_array"), l = this.exec.evalExpression(e.args[n], t), u = o || s ? 3 : 2;
		if (!(l instanceof H) || l.data.length < u) return null;
		let d = 0;
		if (c) {
			let r = this.exec.evalExpression(e.args[n + 1], t);
			r instanceof V && (d = Math.floor(r.value));
		}
		if (o) {
			let e = this._cubeFaceUV(l.data[0], l.data[1], l.data[2]);
			return {
				texture: i,
				u: e.u,
				v: e.v,
				layer: 6 * d + e.face,
				r: null
			};
		}
		return s ? {
			texture: i,
			u: l.data[0],
			v: l.data[1],
			layer: 0,
			r: l.data[2]
		} : {
			texture: i,
			u: l.data[0],
			v: l.data[1],
			layer: d,
			r: null
		};
	}
	TextureSample(e, t) {
		let n = this._sampleArgs(e, t, 2);
		if (n === null) return null;
		let r = 0, i = t.getDerivative(e);
		i instanceof V && (r = i.value, t.clearDerivative(e));
		let a = this._resolveSampler(e.args[1], t);
		return this._sampleResult(n.texture, this._sampleTexture(n.texture, n.u, n.v, n.layer, r, a, n.r));
	}
	TextureSampleBias(e, t) {
		let n = this._sampleArgs(e, t, 2);
		if (n === null) return null;
		let r = 0, i = t.getDerivative(e);
		i instanceof V && (r = i.value, t.clearDerivative(e));
		let a = this._resolveSampler(e.args[1], t);
		return this._sampleResult(n.texture, this._sampleTexture(n.texture, n.u, n.v, n.layer, r, a, n.r));
	}
	TextureSampleLevel(e, t) {
		let n = this._sampleArgs(e, t, 2);
		if (n === null) return null;
		let r = n.texture.typeInfo.name.includes("_array") ? 4 : 3, i = this.exec.evalExpression(e.args[r], t), a = i instanceof V ? i.value : 0, o = this._resolveSampler(e.args[1], t);
		return this._sampleResult(n.texture, this._sampleTexture(n.texture, n.u, n.v, n.layer, a, o, n.r));
	}
	TextureSampleGrad(e, t) {
		let n = this._sampleArgs(e, t, 2);
		if (n === null) return null;
		let r = n.texture.typeInfo.name.includes("_array") ? 4 : 3, i = this.exec.evalExpression(e.args[r], t), a = this.exec.evalExpression(e.args[r + 1], t), o = 0;
		if (i instanceof H && a instanceof H) {
			let e = n.texture.getMipLevelSize(0), t = (t) => {
				let n = 0;
				for (let r = 0; r < t.length && r < 3; ++r) {
					let i = t[r] * Math.max(1, e[r]);
					n += i * i;
				}
				return Math.sqrt(n);
			}, r = Math.max(t(i.data), t(a.data));
			o = r > 0 ? Math.log2(r) : 0;
		}
		let s = this._resolveSampler(e.args[1], t);
		return this._sampleResult(n.texture, this._sampleTexture(n.texture, n.u, n.v, n.layer, o, s, n.r));
	}
	TextureSampleCompare(e, t) {
		return this._sampleCompareValue(e, t);
	}
	TextureSampleCompareLevel(e, t) {
		return this._sampleCompareValue(e, t);
	}
	TextureSampleBaseClampToEdge(e, t) {
		let n = this._sampleArgs(e, t, 2);
		return n === null ? null : this._sampleResult(n.texture, this._filterMip(n.texture, n.u, n.v, n.layer, 0, null, n.r));
	}
	TextureStore(e, t) {
		let n = e.args[0], r = this.exec.evalExpression(e.args[1], t), i = e.args.length === 4 ? this.exec.evalExpression(e.args[2], t).value : 0, a = e.args.length === 4 ? this.exec.evalExpression(e.args[3], t).data : this.exec.evalExpression(e.args[2], t).data;
		if (a.length !== 4 || !(r instanceof H) || r.data.length !== 2) return null;
		if (n instanceof Ks) {
			let e = n.name, o = t.getVariableValue(e);
			if (o instanceof fc) {
				let e = o.getMipLevelSize(0), t = Math.floor(r.data[0]), n = Math.floor(r.data[1]);
				return t < 0 || t >= e[0] || n < 0 || n >= e[1] || o.setPixel(t, n, 0, i, Array.from(a)), null;
			}
			return null;
		}
		return null;
	}
	AtomicLoad(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.getVariableName(n, t);
		return t.getVariable(r).value.getSubData(this.exec, n.postfix, t);
	}
	AtomicStore(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.getVariableName(n, t), i = t.getVariable(r), a = e.args[1], o = this.exec.evalExpression(a, t), s = i.value.getSubData(this.exec, n.postfix, t);
		return s instanceof V && o instanceof V && (s.value = o.value), i.value instanceof W && i.value.setDataValue(this.exec, s, n.postfix, t), null;
	}
	AtomicAdd(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.getVariableName(n, t), i = t.getVariable(r), a = e.args[1], o = this.exec.evalExpression(a, t), s = i.value.getSubData(this.exec, n.postfix, t), c = new V(s.value, s.typeInfo);
		return s instanceof V && o instanceof V && (s.value += o.value), i.value instanceof W && i.value.setDataValue(this.exec, s, n.postfix, t), c;
	}
	AtomicSub(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.getVariableName(n, t), i = t.getVariable(r), a = e.args[1], o = this.exec.evalExpression(a, t), s = i.value.getSubData(this.exec, n.postfix, t), c = new V(s.value, s.typeInfo);
		return s instanceof V && o instanceof V && (s.value -= o.value), i.value instanceof W && i.value.setDataValue(this.exec, s, n.postfix, t), c;
	}
	AtomicMax(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.getVariableName(n, t), i = t.getVariable(r), a = e.args[1], o = this.exec.evalExpression(a, t), s = i.value.getSubData(this.exec, n.postfix, t), c = new V(s.value, s.typeInfo);
		return s instanceof V && o instanceof V && (s.value = Math.max(s.value, o.value)), i.value instanceof W && i.value.setDataValue(this.exec, s, n.postfix, t), c;
	}
	AtomicMin(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.getVariableName(n, t), i = t.getVariable(r), a = e.args[1], o = this.exec.evalExpression(a, t), s = i.value.getSubData(this.exec, n.postfix, t), c = new V(s.value, s.typeInfo);
		return s instanceof V && o instanceof V && (s.value = Math.min(s.value, o.value)), i.value instanceof W && i.value.setDataValue(this.exec, s, n.postfix, t), c;
	}
	AtomicAnd(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.getVariableName(n, t), i = t.getVariable(r), a = e.args[1], o = this.exec.evalExpression(a, t), s = i.value.getSubData(this.exec, n.postfix, t), c = new V(s.value, s.typeInfo);
		return s instanceof V && o instanceof V && (s.value &= o.value), i.value instanceof W && i.value.setDataValue(this.exec, s, n.postfix, t), c;
	}
	AtomicOr(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.getVariableName(n, t), i = t.getVariable(r), a = e.args[1], o = this.exec.evalExpression(a, t), s = i.value.getSubData(this.exec, n.postfix, t), c = new V(s.value, s.typeInfo);
		return s instanceof V && o instanceof V && (s.value |= o.value), i.value instanceof W && i.value.setDataValue(this.exec, s, n.postfix, t), c;
	}
	AtomicXor(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.getVariableName(n, t), i = t.getVariable(r), a = e.args[1], o = this.exec.evalExpression(a, t), s = i.value.getSubData(this.exec, n.postfix, t), c = new V(s.value, s.typeInfo);
		return s instanceof V && o instanceof V && (s.value ^= o.value), i.value instanceof W && i.value.setDataValue(this.exec, s, n.postfix, t), c;
	}
	AtomicExchange(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.getVariableName(n, t), i = t.getVariable(r), a = e.args[1], o = this.exec.evalExpression(a, t), s = i.value.getSubData(this.exec, n.postfix, t), c = new V(s.value, s.typeInfo);
		return s instanceof V && o instanceof V && (s.value = o.value), i.value instanceof W && i.value.setDataValue(this.exec, s, n.postfix, t), c;
	}
	AtomicCompareExchangeWeak(e, t) {
		let n = e.args[0];
		n instanceof B && (n = n.right);
		let r = this.exec.getVariableName(n, t), i = t.getVariable(r), a = this.exec.evalExpression(e.args[1], t), o = this.exec.evalExpression(e.args[2], t), s = i.value.getSubData(this.exec, n.postfix, t), c = new V(s.value, s.typeInfo);
		return s instanceof V && a instanceof V && o instanceof V && s.value === a.value && (s.value = o.value, i.value instanceof W && i.value.setDataValue(this.exec, s, n.postfix, t)), c;
	}
	_packSnormByte(e) {
		let t = Math.round(127 * e);
		return 255 & (t < -128 ? -128 : t > 127 ? 127 : t);
	}
	_packUnormByte(e) {
		let t = Math.round(255 * e);
		return 255 & (t < 0 ? 0 : t > 255 ? 255 : t);
	}
	Pack4x8snorm(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof H)) return null;
		let r = n.data;
		return new V((this._packSnormByte(r[0]) | this._packSnormByte(r[1]) << 8 | this._packSnormByte(r[2]) << 16 | this._packSnormByte(r[3]) << 24) >>> 0, this.getTypeInfo("u32"));
	}
	Pack4x8unorm(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof H)) return null;
		let r = n.data;
		return new V((this._packUnormByte(r[0]) | this._packUnormByte(r[1]) << 8 | this._packUnormByte(r[2]) << 16 | this._packUnormByte(r[3]) << 24) >>> 0, this.getTypeInfo("u32"));
	}
	Pack4xI8(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof H)) return null;
		let r = n.data;
		return new V((255 & r[0] | (255 & r[1]) << 8 | (255 & r[2]) << 16 | (255 & r[3]) << 24) >>> 0, this.getTypeInfo("u32"));
	}
	Pack4xU8(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof H)) return null;
		let r = n.data;
		return new V((255 & r[0] | (255 & r[1]) << 8 | (255 & r[2]) << 16 | (255 & r[3]) << 24) >>> 0, this.getTypeInfo("u32"));
	}
	Pack4x8Clamp(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof H)) return null;
		let r = n.data, i = (e) => 255 & (e < -128 ? -128 : e > 127 ? 127 : e);
		return new V((i(r[0]) | i(r[1]) << 8 | i(r[2]) << 16 | i(r[3]) << 24) >>> 0, this.getTypeInfo("u32"));
	}
	Pack4xU8Clamp(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof H)) return null;
		let r = n.data, i = (e) => 255 & (e < 0 ? 0 : e > 255 ? 255 : e);
		return new V((i(r[0]) | i(r[1]) << 8 | i(r[2]) << 16 | i(r[3]) << 24) >>> 0, this.getTypeInfo("u32"));
	}
	Pack2x16snorm(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof H)) return null;
		let r = n.data, i = (e) => {
			let t = Math.round(32767 * e);
			return 65535 & (t < -32768 ? -32768 : t > 32767 ? 32767 : t);
		};
		return new V((i(r[0]) | i(r[1]) << 16) >>> 0, this.getTypeInfo("u32"));
	}
	Pack2x16unorm(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof H)) return null;
		let r = n.data, i = (e) => {
			let t = Math.round(65535 * e);
			return 65535 & (t < 0 ? 0 : t > 65535 ? 65535 : t);
		};
		return new V((i(r[0]) | i(r[1]) << 16) >>> 0, this.getTypeInfo("u32"));
	}
	Pack2x16float(t, n) {
		let r = this.exec.evalExpression(t.args[0], n);
		if (!(r instanceof H)) return null;
		let i = r.data;
		return new V((e._f32ToF16Bits(i[0]) | e._f32ToF16Bits(i[1]) << 16) >>> 0, this.getTypeInfo("u32"));
	}
	Unpack4x8snorm(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof V)) return null;
		let r = n.value >>> 0, i = (e) => {
			let t = (128 & e ? e - 256 : e) / 127;
			return t < -1 ? -1 : t > 1 ? 1 : t;
		};
		return new H([
			i(255 & r),
			i(r >>> 8 & 255),
			i(r >>> 16 & 255),
			i(r >>> 24 & 255)
		], this.getTypeInfo("vec4f"));
	}
	Unpack4x8unorm(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof V)) return null;
		let r = n.value >>> 0;
		return new H([
			(255 & r) / 255,
			(r >>> 8 & 255) / 255,
			(r >>> 16 & 255) / 255,
			(r >>> 24 & 255) / 255
		], this.getTypeInfo("vec4f"));
	}
	Unpack4xI8(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof V)) return null;
		let r = n.value >>> 0, i = (e) => 128 & e ? e - 256 : e;
		return new H([
			i(255 & r),
			i(r >>> 8 & 255),
			i(r >>> 16 & 255),
			i(r >>> 24 & 255)
		], this.getTypeInfo("vec4i"));
	}
	Unpack4xU8(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof V)) return null;
		let r = n.value >>> 0;
		return new H([
			255 & r,
			r >>> 8 & 255,
			r >>> 16 & 255,
			r >>> 24 & 255
		], this.getTypeInfo("vec4u"));
	}
	Unpack2x16snorm(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof V)) return null;
		let r = n.value >>> 0, i = (e) => {
			let t = (32768 & e ? e - 65536 : e) / 32767;
			return t < -1 ? -1 : t > 1 ? 1 : t;
		};
		return new H([i(65535 & r), i(r >>> 16 & 65535)], this.getTypeInfo("vec2f"));
	}
	Unpack2x16unorm(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		if (!(n instanceof V)) return null;
		let r = n.value >>> 0;
		return new H([(65535 & r) / 65535, (r >>> 16 & 65535) / 65535], this.getTypeInfo("vec2f"));
	}
	Unpack2x16float(t, n) {
		let r = this.exec.evalExpression(t.args[0], n);
		if (!(r instanceof V)) return null;
		let i = r.value >>> 0;
		return new H([e._f16BitsToF32(65535 & i), e._f16BitsToF32(i >>> 16 & 65535)], this.getTypeInfo("vec2f"));
	}
	static _f32ToF16Bits(t) {
		e._f32Convert[0] = t;
		let n = e._u32View[0], r = n >>> 16 & 32768, i = (n >>> 23 & 255) - 127 + 15, a = 8388607 & n;
		return 255 & ~(n >>> 23) ? i >= 31 ? 31744 | r : i <= 0 ? i < -10 ? r : r | (8388608 | a) >>> 14 - i : r | i << 10 | a >>> 13 : 31744 | r | (a ? 512 : 0);
	}
	static _f16BitsToF32(t) {
		let n = (32768 & t) << 16, r = t >>> 10 & 31, i = 1023 & t, a = 0;
		if (r === 0) {
			if (i === 0) a = n;
			else {
				let e = i, t = -14;
				for (; !(1024 & e);) e <<= 1, t--;
				e &= 1023, a = n | t + 127 << 23 | e << 13;
			}
		} else a = r === 31 ? 2139095040 | n | i << 13 : n | r - 15 + 127 << 23 | i << 13;
		return e._u32View[0] = a, e._f32Convert[0];
	}
	StorageBarrier(e, t) {
		return null;
	}
	TextureBarrier(e, t) {
		return null;
	}
	WorkgroupBarrier(e, t) {
		return null;
	}
	WorkgroupUniformLoad(e, t) {
		return null;
	}
	SubgroupAdd(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupExclusiveAdd(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map(() => 0), n.typeInfo) : new V(0, n.typeInfo);
	}
	SubgroupInclusiveAdd(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupAll(e, t) {
		return new V(+!!this.exec.evalExpression(e.args[0], t).value, this.getTypeInfo("bool"));
	}
	SubgroupAnd(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupAny(e, t) {
		return new V(+!!this.exec.evalExpression(e.args[0], t).value, this.getTypeInfo("bool"));
	}
	SubgroupBallot(e, t) {
		return new H([
			+!!this.exec.evalExpression(e.args[0], t).value,
			0,
			0,
			0
		], this.getTypeInfo("vec4u"));
	}
	SubgroupBroadcast(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupBroadcastFirst(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupElect(e, t) {
		return new V(1, this.getTypeInfo("bool"));
	}
	SubgroupMax(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupMin(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupMul(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupExclusiveMul(e, t) {
		let n = this.exec.evalExpression(e.args[0], t);
		return n instanceof H ? new H(n.data.map(() => 1), n.typeInfo) : new V(1, n.typeInfo);
	}
	SubgroupInclusiveMul(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupOr(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupShuffle(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupShuffleDown(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupShuffleUp(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupShuffleXor(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	SubgroupXor(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	QuadBroadcast(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	QuadSwapDiagonal(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	QuadSwapX(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
	QuadSwapY(e, t) {
		return this.exec.evalExpression(e.args[0], t);
	}
};
Ic._f32Convert = /* @__PURE__ */ new Float32Array(1), Ic._u32View = new Uint32Array(Ic._f32Convert.buffer);
var Lc = {
	vec2: 2,
	vec2f: 2,
	vec2i: 2,
	vec2u: 2,
	vec2b: 2,
	vec2h: 2,
	vec3: 3,
	vec3f: 3,
	vec3i: 3,
	vec3u: 3,
	vec3b: 3,
	vec3h: 3,
	vec4: 4,
	vec4f: 4,
	vec4i: 4,
	vec4u: 4,
	vec4b: 4,
	vec4h: 4
}, Rc = {
	mat2x2: [
		2,
		2,
		4
	],
	mat2x2f: [
		2,
		2,
		4
	],
	mat2x2h: [
		2,
		2,
		4
	],
	mat2x3: [
		2,
		3,
		6
	],
	mat2x3f: [
		2,
		3,
		6
	],
	mat2x3h: [
		2,
		3,
		6
	],
	mat2x4: [
		2,
		4,
		8
	],
	mat2x4f: [
		2,
		4,
		8
	],
	mat2x4h: [
		2,
		4,
		8
	],
	mat3x2: [
		3,
		2,
		6
	],
	mat3x2f: [
		3,
		2,
		6
	],
	mat3x2h: [
		3,
		2,
		6
	],
	mat3x3: [
		3,
		3,
		9
	],
	mat3x3f: [
		3,
		3,
		9
	],
	mat3x3h: [
		3,
		3,
		9
	],
	mat3x4: [
		3,
		4,
		12
	],
	mat3x4f: [
		3,
		4,
		12
	],
	mat3x4h: [
		3,
		4,
		12
	],
	mat4x2: [
		4,
		2,
		8
	],
	mat4x2f: [
		4,
		2,
		8
	],
	mat4x2h: [
		4,
		2,
		8
	],
	mat4x3: [
		4,
		3,
		12
	],
	mat4x3f: [
		4,
		3,
		12
	],
	mat4x3h: [
		4,
		3,
		12
	],
	mat4x4: [
		4,
		4,
		16
	],
	mat4x4f: [
		4,
		4,
		16
	],
	mat4x4h: [
		4,
		4,
		16
	]
}, zc = class e extends Pc {
	constructor(e, t) {
		super(), this.ast = e ?? [], this.reflection = new kc(), this.reflection.updateAST(this.ast), this.context = t?.clone() ?? new Nc(), this.builtins = new Ic(this), this.typeInfo = {
			bool: this.getTypeInfo(L.bool),
			i32: this.getTypeInfo(L.i32),
			u32: this.getTypeInfo(L.u32),
			f32: this.getTypeInfo(L.f32),
			f16: this.getTypeInfo(L.f16),
			vec2f: this.getTypeInfo(R.vec2f),
			vec2u: this.getTypeInfo(R.vec2u),
			vec2i: this.getTypeInfo(R.vec2i),
			vec2h: this.getTypeInfo(R.vec2h),
			vec3f: this.getTypeInfo(R.vec3f),
			vec3u: this.getTypeInfo(R.vec3u),
			vec3i: this.getTypeInfo(R.vec3i),
			vec3h: this.getTypeInfo(R.vec3h),
			vec4f: this.getTypeInfo(R.vec4f),
			vec4u: this.getTypeInfo(R.vec4u),
			vec4i: this.getTypeInfo(R.vec4i),
			vec4h: this.getTypeInfo(R.vec4h),
			mat2x2f: this.getTypeInfo(R.mat2x2f),
			mat2x3f: this.getTypeInfo(R.mat2x3f),
			mat2x4f: this.getTypeInfo(R.mat2x4f),
			mat3x2f: this.getTypeInfo(R.mat3x2f),
			mat3x3f: this.getTypeInfo(R.mat3x3f),
			mat3x4f: this.getTypeInfo(R.mat3x4f),
			mat4x2f: this.getTypeInfo(R.mat4x2f),
			mat4x3f: this.getTypeInfo(R.mat4x3f),
			mat4x4f: this.getTypeInfo(R.mat4x4f)
		};
	}
	getVariableValue(e) {
		let t = this.context.getVariable(e)?.value ?? null;
		if (t === null) return null;
		if (t instanceof V) return t.value;
		if (t instanceof H || t instanceof U) return Array.from(t.data);
		if (t instanceof W && t.typeInfo instanceof Bo) {
			let e = this._resolveAtomicType(t.typeInfo.format).name;
			if (e === "u32") return Array.from(new Uint32Array(t.buffer, t.offset, t.typeInfo.count));
			if (e === "i32") return Array.from(new Int32Array(t.buffer, t.offset, t.typeInfo.count));
			if (e === "f32") return Array.from(new Float32Array(t.buffer, t.offset, t.typeInfo.count));
		}
		return null;
	}
	execute(e) {
		(e ??= {}).constants && this._setOverrides(e.constants, this.context), this._execStatements(this.ast, this.context);
	}
	dispatchWorkgroups(e, t, n, r) {
		let i = this.context.clone();
		(r ??= {}).constants && this._setOverrides(r.constants, i), this._execStatements(this.ast, i);
		let a = i.getFunction(e);
		if (!a) return;
		if (typeof t == "number") t = [
			t,
			1,
			1
		];
		else {
			if (t.length === 0) return;
			t.length === 1 ? t = [
				t[0],
				1,
				1
			] : t.length === 2 ? t = [
				t[0],
				t[1],
				1
			] : t.length > 3 && (t = [
				t[0],
				t[1],
				t[2]
			]);
		}
		let o = t[0], s = t[1], c = t[2], l = this.getTypeInfo("vec3u");
		i.setVariable("@num_workgroups", new H(t, l));
		let u = this.reflection.getFunctionInfo(e);
		for (let e in n) for (let t in n[e]) {
			let r = n[e][t];
			i.variables.forEach((n) => {
				let i = n.node;
				if (i?.attributes) {
					let a = null, o = null;
					for (let e of i.attributes) e.name === "binding" ? a = e.value : e.name === "group" && (o = e.value);
					if (t === a && e === o) {
						let a = !1;
						for (let r of u.resources) if (r.name === n.name && r.group === parseInt(e) && r.binding === parseInt(t)) {
							a = !0;
							break;
						}
						a && (n.value = r.texture !== void 0 && r.descriptor !== void 0 ? new fc(r.texture, this.getTypeInfo(i.type), r.descriptor, r.view ?? null) : r.sampler === void 0 ? r.uniform === void 0 ? new W(r, this.getTypeInfo(i.type)) : new W(r.uniform, this.getTypeInfo(i.type)) : new dc(r.sampler, this.getTypeInfo(i.type)));
					}
				}
			});
		}
		let d = new H([
			0,
			0,
			0
		], l);
		i.setVariable("@workgroup_id", d);
		for (let e = 0; e < c; ++e) for (let t = 0; t < s; ++t) for (let n = 0; n < o; ++n) d.data[0] = n, d.data[1] = t, d.data[2] = e, this._dispatchWorkgroup(a, [
			n,
			t,
			e
		], i);
	}
	execStatement(t, n) {
		if (t instanceof ks) return this.evalExpression(t.value, n);
		if (t instanceof Fs) {
			if (t.condition) {
				let e = this.evalExpression(t.condition, n);
				if (!(e instanceof V)) throw Error("Invalid break-if condition");
				if (!e.value) return null;
			}
			return e._breakObj;
		}
		if (t instanceof Is) return e._continueObj;
		if (t instanceof ys) this._let(t, n);
		else if (t instanceof _s) this._var(t, n);
		else if (t instanceof bs) this._const(t, n);
		else if (t instanceof vs) this._override(t, n);
		else if (t instanceof fs) this._function(t, n);
		else {
			if (t instanceof Os) return this._if(t, n);
			if (t instanceof Ds) return this._switch(t, n);
			if (t instanceof gs) return this._for(t, n);
			if (t instanceof ms) return this._while(t, n);
			if (t instanceof Es) return this._loop(t, n);
			if (t instanceof hs) {
				let e = n.clone();
				return e.currentFunctionName = n.currentFunctionName, this._execStatements(t.body, e);
			}
			if (t instanceof ws) this._assign(t, n);
			else if (t instanceof Cs) this._increment(t, n);
			else {
				if (t instanceof Rs) return null;
				if (t instanceof Ts) this._call(t, n);
				else if (t instanceof Ms || t instanceof Ns) return null;
			}
		}
		return null;
	}
	evalExpression(e, t) {
		return e instanceof Zs ? this._evalBinaryOp(e, t) : e instanceof z ? this._evalLiteral(e, t) : e instanceof Ks ? this._evalVariable(e, t) : e instanceof Gs ? this._evalCall(e, t) : e instanceof Ws ? this._evalCreate(e, t) : e instanceof qs ? this._evalConst(e, t) : e instanceof Js ? this._evalBitcast(e, t) : e instanceof B ? this._evalUnaryOp(e, t) : null;
	}
	getTypeInfo(e) {
		if (e instanceof L) {
			let t = this.reflection.getTypeInfo(e);
			if (t !== null) return t;
		}
		let t = this.typeInfo[e] ?? null;
		return t !== null || (t = this.reflection.getTypeInfoByName(e)), t;
	}
	_setOverrides(t, n) {
		for (let r in t) {
			let i = t[r], a = this.reflection.getOverrideInfo(r);
			a === null || (a.type === null && (a.type = this.getTypeInfo("u32")), e._numericScalarTypes.has(a.type.name) ? n.setVariable(r, new V(i, a.type)) : e._vectorTypes.has(a.type.name) && n.setVariable(r, new H(i, a.type)));
		}
	}
	_dispatchWorkgroup(e, t, n) {
		let r = [
			1,
			1,
			1
		];
		for (let t of e.node.attributes) if (t.name === "workgroup_size") {
			if (t.value.length > 0) {
				let e = n.getVariableValue(t.value[0]);
				r[0] = e instanceof V ? e.value : parseInt(t.value[0]);
			}
			if (t.value.length > 1) {
				let e = n.getVariableValue(t.value[1]);
				r[1] = e instanceof V ? e.value : parseInt(t.value[1]);
			}
			if (t.value.length > 2) {
				let e = n.getVariableValue(t.value[2]);
				r[2] = e instanceof V ? e.value : parseInt(t.value[2]);
			}
		}
		let i = this.getTypeInfo("vec3u"), a = this.getTypeInfo("u32");
		n.setVariable("@workgroup_size", new H(r, i));
		let o = r[0], s = r[1], c = r[2], l = new H([
			0,
			0,
			0
		], i), u = new H([
			0,
			0,
			0
		], i), d = new V(0, a);
		n.setVariable("@local_invocation_id", l), n.setVariable("@global_invocation_id", u), n.setVariable("@local_invocation_index", d);
		for (let i = 0, a = 0; i < c; ++i) for (let c = 0; c < s; ++c) for (let s = 0; s < o; ++s, ++a) l.data[0] = s, l.data[1] = c, l.data[2] = i, u.data[0] = s + t[0] * r[0], u.data[1] = c + t[1] * r[1], u.data[2] = i + t[2] * r[2], d.value = a, this._dispatchExec(e, n);
	}
	_dispatchExec(e, t) {
		for (let n of e.node.args) for (let e of n.attributes) if (e.name === "builtin") {
			let r = `@${e.value}`, i = t.getVariable(r);
			i !== void 0 && t.variables.set(n.name, i);
		}
		this._execStatements(e.node.body, t);
	}
	getVariableName(e, t) {
		for (; e instanceof B;) e = e.right;
		return e instanceof Ks ? e.name : null;
	}
	_execStatements(e, t) {
		for (let n of e) {
			if (Array.isArray(n)) {
				let e = t.clone(), r = this._execStatements(n, e);
				if (r) return r;
				continue;
			}
			let e = this.execStatement(n, t);
			if (e) return e;
		}
		return null;
	}
	_call(e, t) {
		let n = t.clone();
		n.currentFunctionName = e.name;
		let r = t.getFunction(e.name);
		if (r) {
			for (let t = 0; t < r.node.args.length; ++t) {
				let i = r.node.args[t], a = this.evalExpression(e.args[t], n);
				n.setVariable(i.name, a, i);
			}
			this._execStatements(r.node.body, n);
		} else e.isBuiltin ? this._callBuiltinFunction(e, n) : this.getTypeInfo(e.name) && this._evalCreate(e, t);
	}
	_increment(e, t) {
		let n = this.getVariableName(e.variable, t), r = t.getVariable(n);
		r && (e.operator === "++" ? r.value instanceof V && r.value.value++ : e.operator === "--" && r.value instanceof V && r.value.value--);
	}
	_getVariableData(e, t) {
		if (e instanceof Ks) {
			let n = this.getVariableName(e, t), r = t.getVariable(n);
			return r === null ? null : r.value.getSubData(this, e.postfix, t);
		}
		if (e instanceof B) {
			if (e.operator === "*") {
				let n = this._getVariableData(e.right, t);
				return n instanceof lc ? n.reference.getSubData(this, e.postfix, t) : null;
			}
			if (e.operator === "&") return new lc(this._getVariableData(e.right, t));
		}
		return null;
	}
	_assign(e, t) {
		let n = null, r = "<var>", i = null;
		if (e.variable instanceof B) {
			let n = this._getVariableData(e.variable, t), r = this.evalExpression(e.value, t), i = e.operator;
			if (i === "=") {
				if (n instanceof V || n instanceof H || n instanceof U) {
					if (r instanceof V || r instanceof H || r instanceof U && n.data.length === r.data.length) return void n.data.set(r.data);
				} else if (n instanceof W && r instanceof W && n.buffer.byteLength - n.offset >= r.buffer.byteLength - r.offset) return void (n.buffer.byteLength % 4 == 0 ? new Uint32Array(n.buffer, n.offset, n.typeInfo.size / 4).set(new Uint32Array(r.buffer, r.offset, r.typeInfo.size / 4)) : new Uint8Array(n.buffer, n.offset, n.typeInfo.size).set(new Uint8Array(r.buffer, r.offset, r.typeInfo.size)));
				return null;
			}
			if (i === "+=") return (n instanceof V || n instanceof H || n instanceof U) && (r instanceof V || r instanceof H || r instanceof U) ? void n.data.set(r.data.map((e, t) => n.data[t] + e)) : void 0;
			if (i === "-=") return (n instanceof V || n instanceof H || n instanceof U) && (r instanceof V || r instanceof H || r instanceof U) ? void n.data.set(r.data.map((e, t) => n.data[t] - e)) : void 0;
		}
		if (e.variable instanceof B) {
			if (e.variable.operator === "*") {
				r = this.getVariableName(e.variable.right, t);
				let i = t.getVariable(r);
				if (!(i && i.value instanceof lc)) return;
				n = i.value.reference;
				let a = e.variable.postfix;
				if (!a) {
					let t = e.variable.right;
					for (; t instanceof B;) {
						if (t.postfix) {
							a = t.postfix;
							break;
						}
						t = t.right;
					}
				}
				a && (n = n.getSubData(this, a, t));
			}
		} else {
			i = e.variable.postfix, r = this.getVariableName(e.variable, t);
			let a = t.getVariable(r);
			if (a === null) return;
			n = a.value;
		}
		if (n instanceof lc && (n = n.reference), n === null) return;
		let a = this.evalExpression(e.value, t), o = e.operator;
		if (o !== "=") {
			let e = n.getSubData(this, i, t);
			if (e instanceof H && a instanceof V) {
				let t = e.data, n = a.value;
				if (o === "+=") for (let e = 0; e < t.length; ++e) t[e] += n;
				else if (o === "-=") for (let e = 0; e < t.length; ++e) t[e] -= n;
				else if (o === "*=") for (let e = 0; e < t.length; ++e) t[e] *= n;
				else if (o === "/=") for (let e = 0; e < t.length; ++e) t[e] /= n;
				else if (o === "%=") for (let e = 0; e < t.length; ++e) t[e] %= n;
				else if (o === "&=") for (let e = 0; e < t.length; ++e) t[e] &= n;
				else if (o === "|=") for (let e = 0; e < t.length; ++e) t[e] |= n;
				else if (o === "^=") for (let e = 0; e < t.length; ++e) t[e] ^= n;
				else if (o === "<<=") for (let e = 0; e < t.length; ++e) t[e] <<= n;
				else if (o === ">>=") for (let e = 0; e < t.length; ++e) t[e] >>= n;
			} else if (e instanceof H && a instanceof H) {
				let t = e.data, n = a.data;
				if (t.length !== n.length) return;
				if (o === "+=") for (let e = 0; e < t.length; ++e) t[e] += n[e];
				else if (o === "-=") for (let e = 0; e < t.length; ++e) t[e] -= n[e];
				else if (o === "*=") for (let e = 0; e < t.length; ++e) t[e] *= n[e];
				else if (o === "/=") for (let e = 0; e < t.length; ++e) t[e] /= n[e];
				else if (o === "%=") for (let e = 0; e < t.length; ++e) t[e] %= n[e];
				else if (o === "&=") for (let e = 0; e < t.length; ++e) t[e] &= n[e];
				else if (o === "|=") for (let e = 0; e < t.length; ++e) t[e] |= n[e];
				else if (o === "^=") for (let e = 0; e < t.length; ++e) t[e] ^= n[e];
				else if (o === "<<=") for (let e = 0; e < t.length; ++e) t[e] <<= n[e];
				else if (o === ">>=") for (let e = 0; e < t.length; ++e) t[e] >>= n[e];
			} else {
				if (!(e instanceof V && a instanceof V)) return;
				o === "+=" ? e.value += a.value : o === "-=" ? e.value -= a.value : o === "*=" ? e.value *= a.value : o === "/=" ? e.value /= a.value : o === "%=" ? e.value %= a.value : o === "&=" ? e.value &= a.value : o === "|=" ? e.value |= a.value : o === "^=" ? e.value ^= a.value : o === "<<=" ? e.value <<= a.value : o === ">>=" && (e.value >>= a.value);
			}
			n instanceof W && n.setDataValue(this, e, i, t);
		} else if (n instanceof W) n.setDataValue(this, a, i, t);
		else if (i) {
			if (!(n instanceof H || n instanceof U)) return;
			if (i instanceof Ys) {
				let e = this.evalExpression(i.index, t).value;
				if (n instanceof H) {
					if (!(a instanceof V)) return;
					n.data[e] = a.value;
				} else {
					if (!(n instanceof U)) return;
					{
						let e = this.evalExpression(i.index, t).value;
						if (e < 0 || !(a instanceof H)) return;
						{
							let t = n.typeInfo.getTypeName();
							if (t === "mat2x2" || t === "mat2x2f" || t === "mat2x2h") {
								if (!(e < 2 && a.data.length === 2)) return;
								n.data[2 * e] = a.data[0], n.data[2 * e + 1] = a.data[1];
							} else if (t === "mat2x3" || t === "mat2x3f" || t === "mat2x3h") {
								if (!(e < 2 && a.data.length === 3)) return;
								n.data[3 * e] = a.data[0], n.data[3 * e + 1] = a.data[1], n.data[3 * e + 2] = a.data[2];
							} else if (t === "mat2x4" || t === "mat2x4f" || t === "mat2x4h") {
								if (!(e < 2 && a.data.length === 4)) return;
								n.data[4 * e] = a.data[0], n.data[4 * e + 1] = a.data[1], n.data[4 * e + 2] = a.data[2], n.data[4 * e + 3] = a.data[3];
							} else if (t === "mat3x2" || t === "mat3x2f" || t === "mat3x2h") {
								if (!(e < 3 && a.data.length === 2)) return;
								n.data[2 * e] = a.data[0], n.data[2 * e + 1] = a.data[1];
							} else if (t === "mat3x3" || t === "mat3x3f" || t === "mat3x3h") {
								if (!(e < 3 && a.data.length === 3)) return;
								n.data[3 * e] = a.data[0], n.data[3 * e + 1] = a.data[1], n.data[3 * e + 2] = a.data[2];
							} else if (t === "mat3x4" || t === "mat3x4f" || t === "mat3x4h") {
								if (!(e < 3 && a.data.length === 4)) return;
								n.data[4 * e] = a.data[0], n.data[4 * e + 1] = a.data[1], n.data[4 * e + 2] = a.data[2], n.data[4 * e + 3] = a.data[3];
							} else if (t === "mat4x2" || t === "mat4x2f" || t === "mat4x2h") {
								if (!(e < 4 && a.data.length === 2)) return;
								n.data[2 * e] = a.data[0], n.data[2 * e + 1] = a.data[1];
							} else if (t === "mat4x3" || t === "mat4x3f" || t === "mat4x3h") {
								if (!(e < 4 && a.data.length === 3)) return;
								n.data[3 * e] = a.data[0], n.data[3 * e + 1] = a.data[1], n.data[3 * e + 2] = a.data[2];
							} else {
								if (t !== "mat4x4" && t !== "mat4x4f" && t !== "mat4x4h" || !(e < 4 && a.data.length === 4)) return;
								n.data[4 * e] = a.data[0], n.data[4 * e + 1] = a.data[1], n.data[4 * e + 2] = a.data[2], n.data[4 * e + 3] = a.data[3];
							}
						}
					}
				}
			} else if (i instanceof Us) {
				let e = i.value;
				if (!(n instanceof H)) return;
				if (a instanceof V) {
					if (e.length > 1) return;
					if (e === "x") n.data[0] = a.value;
					else if (e === "y") {
						if (n.data.length < 2) return;
						n.data[1] = a.value;
					} else if (e === "z") {
						if (n.data.length < 3) return;
						n.data[2] = a.value;
					} else if (e === "w") {
						if (n.data.length < 4) return;
						n.data[3] = a.value;
					}
				} else {
					if (!(a instanceof H) || e.length !== a.data.length) return;
					for (let t = 0; t < e.length; ++t) {
						let r = e[t];
						if (r === "x" || r === "r") n.data[0] = a.data[t];
						else if (r === "y" || r === "g") {
							if (a.data.length < 2) return;
							n.data[1] = a.data[t];
						} else if (r === "z" || r === "b") {
							if (a.data.length < 3) return;
							n.data[2] = a.data[t];
						} else {
							if (r !== "w" && r !== "a" || a.data.length < 4) return;
							n.data[3] = a.data[t];
						}
					}
				}
			}
		} else n instanceof V && a instanceof V ? n.value = a.value : (n instanceof H && a instanceof H || n instanceof U && a instanceof U) && n.data.set(a.data);
	}
	_function(e, t) {
		let n = new Mc(e);
		t.functions.set(e.name, n);
	}
	_const(e, t) {
		let n = null;
		e.value !== null && (n = this.evalExpression(e.value, t)), t.createVariable(e.name, n, e);
	}
	_override(e, t) {
		let n = t.getVariable(e.name);
		if (n === null || n.value === null) {
			let n = null;
			e.value !== null && (n = this.evalExpression(e.value, t)), t.createVariable(e.name, n, e);
		}
	}
	_let(t, n) {
		let r = null;
		if (t.value !== null) {
			if (r = this.evalExpression(t.value, n), r === null) return;
			t.value instanceof B || (r = r.clone());
		} else {
			let i = t.type.name;
			if (e._defaultableTypes.has(i)) {
				let e = new Ws(t.type, []);
				r = this._evalCreate(e, n);
			}
		}
		n.createVariable(t.name, r, t);
	}
	_var(t, n) {
		let r = null;
		if (t.value !== null) {
			if (r = this.evalExpression(t.value, n), r === null) return;
			t.value instanceof B || (r = r.clone());
		} else {
			if (t.type === null) return;
			let i = t.type.name;
			if (e._defaultableTypes.has(i) || t.type instanceof Bs || t.type instanceof Rs || t.type instanceof R) {
				let e = new Ws(t.type, []);
				r = this._evalCreate(e, n);
			}
			if (r === null) {
				let e = this.getTypeInfo(t.type);
				e !== null && (r = new W(/* @__PURE__ */ new ArrayBuffer(0), e, 0));
			}
		}
		n.createVariable(t.name, r, t);
	}
	_switch(e, t) {
		t = t.clone();
		let n = this.evalExpression(e.condition, t);
		if (!(n instanceof V)) return null;
		let r = null;
		for (let i of e.cases) if (i instanceof ec) for (let e of i.selectors) {
			if (e instanceof $s) {
				r = i;
				continue;
			}
			let a = this.evalExpression(e, t);
			if (!(a instanceof V)) return null;
			if (a.value === n.value) return this._execStatements(i.body, t);
		}
		else i instanceof tc && (r = i);
		return r ? this._execStatements(r.body, t) : null;
	}
	_if(e, t) {
		t = t.clone();
		let n = this.evalExpression(e.condition, t);
		if (!(n instanceof V)) return null;
		if (n.value) return this._execStatements(e.body, t);
		for (let n of e.elseif) {
			let e = this.evalExpression(n.condition, t);
			if (!(e instanceof V)) return null;
			if (e.value) return this._execStatements(n.body, t);
		}
		return e.else ? this._execStatements(e.else, t) : null;
	}
	_getScalarValue(e) {
		return e instanceof V ? e.value : 0;
	}
	_for(t, n) {
		for (n = n.clone(), this.execStatement(t.init, n); this._getScalarValue(this.evalExpression(t.condition, n));) {
			let r = this._execStatements(t.body, n);
			if (r === e._breakObj) break;
			if (r !== null && r !== e._continueObj) return r;
			this.execStatement(t.increment, n);
		}
		return null;
	}
	_loop(t, n) {
		for (n = n.clone();;) {
			let r = this._execStatements(t.body, n);
			if (r === e._breakObj) break;
			if (r === e._continueObj) {
				if (t.continuing && this._execStatements(t.continuing.body, n) === e._breakObj) break;
			} else if (r !== null) return r;
		}
		return null;
	}
	_while(t, n) {
		for (n = n.clone(); this._getScalarValue(this.evalExpression(t.condition, n));) {
			let r = this._execStatements(t.body, n);
			if (r === e._breakObj) break;
			if (r !== e._continueObj && r !== null) return r;
		}
		return null;
	}
	_evalBitcast(e, t) {
		let n = this.evalExpression(e.value, t), r = e.type;
		if (n instanceof V) return new V(wc(n.value, n.typeInfo.name, r.name), this.getTypeInfo(r));
		if (n instanceof H) {
			let e = n.typeInfo.getTypeName(), t = "";
			if (e.endsWith("f")) t = "f32";
			else if (e.endsWith("i")) t = "i32";
			else if (e.endsWith("u")) t = "u32";
			else if (e.endsWith("b")) t = "bool";
			else {
				if (!e.endsWith("h")) return null;
				t = "f16";
			}
			let i = r.getTypeName(), a = "";
			if (i.endsWith("f")) a = "f32";
			else if (i.endsWith("i")) a = "i32";
			else if (i.endsWith("u")) a = "u32";
			else if (i.endsWith("b")) a = "bool";
			else {
				if (!i.endsWith("h")) return null;
				a = "f16";
			}
			return new H(function(e, t, n) {
				if (t === n) return e;
				let r = Array(e.length);
				for (let i = 0; i < e.length; i++) r[i] = wc(e[i], t, n);
				return r;
			}(Array.from(n.data), t, a), this.getTypeInfo(r));
		}
		return null;
	}
	_evalConst(e, t) {
		return t.getVariableValue(e.name).clone().getSubData(this, e.postfix, t);
	}
	_evalCreate(e, t) {
		if (e instanceof Ws) {
			if (e.type === null) return cc.void;
			switch (e.type.getTypeName()) {
				case "bool":
				case "i32":
				case "u32":
				case "f32":
				case "f16": return this._callConstructorValue(e, t);
				case "atomic<u32>": return new V(0, this.getTypeInfo("u32"));
				case "atomic<i32>": return new V(0, this.getTypeInfo("i32"));
				case "vec2":
				case "vec3":
				case "vec4":
				case "vec2f":
				case "vec3f":
				case "vec4f":
				case "vec2h":
				case "vec3h":
				case "vec4h":
				case "vec2i":
				case "vec3i":
				case "vec4i":
				case "vec2u":
				case "vec3u":
				case "vec4u":
				case "vec2b":
				case "vec3b":
				case "vec4b": return this._callConstructorVec(e, t);
				case "mat2x2":
				case "mat2x2f":
				case "mat2x2h":
				case "mat2x3":
				case "mat2x3f":
				case "mat2x3h":
				case "mat2x4":
				case "mat2x4f":
				case "mat2x4h":
				case "mat3x2":
				case "mat3x2f":
				case "mat3x2h":
				case "mat3x3":
				case "mat3x3f":
				case "mat3x3h":
				case "mat3x4":
				case "mat3x4f":
				case "mat3x4h":
				case "mat4x2":
				case "mat4x2f":
				case "mat4x2h":
				case "mat4x3":
				case "mat4x3f":
				case "mat4x3h":
				case "mat4x4":
				case "mat4x4f":
				case "mat4x4h": return this._callConstructorMatrix(e, t);
			}
		}
		e instanceof Ws ? e.type.name : e.name;
		let n = e instanceof Ws ? this.getTypeInfo(e.type) : this.getTypeInfo(e.name);
		if (n === null || n.size === 0) return null;
		let r = new W(new ArrayBuffer(n.size), n, 0);
		if (n instanceof zo) {
			if (e.args) for (let i = 0; i < e.args.length; ++i) {
				let a = n.members[i], o = e.args[i], s = this.evalExpression(o, t);
				r.setData(this, s, a.type, a.offset, t);
			}
		} else if (n instanceof Bo) {
			let i = 0;
			if (e.args) for (let a = 0; a < e.args.length; ++a) {
				let o = e.args[a], s = this.evalExpression(o, t);
				n.format === null && (n.format = s.typeInfo?.name === "x32" ? this.getTypeInfo("i32") : s.typeInfo), r.setData(this, s, n.format, i, t), i += n.stride;
			}
		}
		return e instanceof Ws ? r.getSubData(this, e.postfix, t) : r;
	}
	_evalLiteral(e, t) {
		let n = this.getTypeInfo(e.type), r = n.name;
		return r === "x32" || r === "u32" || r === "f32" || r === "f16" || r === "i32" || r === "bool" ? new V(e.scalarValue, n) : r === "vec2" || r === "vec3" || r === "vec4" || r === "vec2f" || r === "vec3f" || r === "vec4f" || r === "vec2h" || r === "vec3h" || r === "vec4h" || r === "vec2i" || r === "vec3i" || r === "vec4i" || r === "vec2u" || r === "vec3u" || r === "vec4u" ? this._callConstructorVec(e, t) : r === "mat2x2" || r === "mat2x3" || r === "mat2x4" || r === "mat3x2" || r === "mat3x3" || r === "mat3x4" || r === "mat4x2" || r === "mat4x3" || r === "mat4x4" || r === "mat2x2f" || r === "mat2x3f" || r === "mat2x4f" || r === "mat3x2f" || r === "mat3x3f" || r === "mat3x4f" || r === "mat4x2f" || r === "mat4x3f" || r === "mat4x4f" || r === "mat2x2h" || r === "mat2x3h" || r === "mat2x4h" || r === "mat3x2h" || r === "mat3x3h" || r === "mat3x4h" || r === "mat4x2h" || r === "mat4x3h" || r === "mat4x4h" ? this._callConstructorMatrix(e, t) : e.value;
	}
	_evalVariable(e, t) {
		let n = t.getVariableValue(e.name);
		return n === null ? n : n.getSubData(this, e.postfix, t);
	}
	_resolveAtomicType(e) {
		return e instanceof Ho && e.name === "atomic" && e.format ? e.format : e;
	}
	_maxFormatTypeInfo(t) {
		t = t.map((e) => this._resolveAtomicType(e));
		let n = t[0];
		if (n == null) return null;
		if (n.name === "f32") return n;
		for (let r = 1; r < t.length; ++r) {
			let i = e._priority.get(n.name);
			e._priority.get(t[r].name) < i && (n = t[r]);
		}
		return n.name === "x32" ? this.getTypeInfo("i32") : n;
	}
	_evalUnaryOp(e, t) {
		let n = this._evalUnaryOpValue(e, t);
		return n !== null && e.postfix && e.operator !== "*" ? n.getSubData(this, e.postfix, t) : n;
	}
	_evalUnaryOpValue(e, t) {
		let n = this.evalExpression(e.right, t);
		if (e.operator === "&") return new lc(n);
		if (e.operator === "*") return n instanceof lc ? n.reference.getSubData(this, e.postfix, t) : null;
		let r = n instanceof V ? n.value : n instanceof H || n instanceof U ? Array.from(n.data) : n instanceof W ? n.toArray() : null;
		switch (e.operator) {
			case "+": {
				if (q(r)) {
					let e = r.map((e, t) => +e);
					return this._makeCwiseData(e, n.typeInfo);
				}
				let e = r, t = this._maxFormatTypeInfo([n.typeInfo, n.typeInfo]);
				return new V(+e, t);
			}
			case "-": {
				if (q(r)) {
					let e = r.map((e, t) => -e);
					return this._makeCwiseData(e, n.typeInfo);
				}
				let e = r, t = this._maxFormatTypeInfo([n.typeInfo, n.typeInfo]);
				return new V(-e, t);
			}
			case "!": {
				if (q(r)) {
					let e = r.map((e, t) => +!e);
					return this._makeCwiseData(e, n.typeInfo);
				}
				let e = r, t = this._maxFormatTypeInfo([n.typeInfo, n.typeInfo]);
				return new V(+!e, t);
			}
			case "~": {
				if (q(r)) {
					let e = r.map((e, t) => ~e);
					return this._makeCwiseData(e, n.typeInfo);
				}
				let e = r, t = this._maxFormatTypeInfo([n.typeInfo, n.typeInfo]);
				return new V(~e, t);
			}
		}
		return null;
	}
	_isMatrixType(e) {
		return e.typeInfo.getTypeName().startsWith("mat");
	}
	_isVectorType(e) {
		return e.typeInfo.getTypeName().startsWith("vec");
	}
	_makeCwiseData(e, t) {
		return t.getTypeName().startsWith("mat") ? new U(e, t) : new H(e, t);
	}
	_evalBinaryOp(e, t) {
		let n = this._evalBinaryOpValue(e, t);
		return n !== null && e.postfix ? n.getSubData(this, e.postfix, t) : n;
	}
	_evalBinaryOpValue(e, t) {
		let n = this.evalExpression(e.left, t), r = this.evalExpression(e.right, t), i = n instanceof V ? n.value : n instanceof H || n instanceof U ? Array.from(n.data) : n instanceof W ? n.toArray() : null, a = r instanceof V ? r.value : r instanceof H || r instanceof U ? Array.from(r.data) : r instanceof W ? r.toArray() : null;
		switch (e.operator) {
			case "+": {
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e + t[n]);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t + e);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e + t);
					return this._makeCwiseData(t, r.typeInfo);
				}
				let e = i, t = a, o = this._maxFormatTypeInfo([n.typeInfo, r.typeInfo]);
				return new V(e + t, o);
			}
			case "-": {
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e - t[n]);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t - e);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e - t);
					return this._makeCwiseData(t, r.typeInfo);
				}
				let e = i, t = a, o = this._maxFormatTypeInfo([n.typeInfo, r.typeInfo]);
				return new V(e - t, o);
			}
			case "*": {
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (this._isMatrixType(n) && this._isMatrixType(r)) {
						let i = function(e, t, n, r) {
							if (Rc[t.name] === void 0 || Rc[r.name] === void 0) return null;
							let i = Rc[t.name][0], a = Rc[t.name][1], o = Rc[r.name][0];
							if (i !== Rc[r.name][1]) return null;
							let s = Array(o * a);
							for (let t = 0; t < a; t++) for (let r = 0; r < o; r++) {
								let c = 0;
								for (let o = 0; o < i; o++) c += e[o * a + t] * n[r * i + o];
								s[t * o + r] = c;
							}
							return s;
						}(e, n.typeInfo, t, r.typeInfo);
						if (i === null) return null;
						let a = Rc[r.typeInfo.name][0], o = Rc[n.typeInfo.name][1];
						return new U(i, this.getTypeInfo(`mat${a}x${o}f`));
					}
					if (this._isMatrixType(n) && this._isVectorType(r)) {
						let i = function(e, t, n, r) {
							if (Rc[t.name] === void 0 || Lc[r.name] === void 0) return null;
							let i = Rc[t.name][0], a = Rc[t.name][1];
							if (i !== n.length) return null;
							let o = Array(a);
							for (let t = 0; t < a; t++) {
								let r = 0;
								for (let o = 0; o < i; o++) r += e[o * a + t] * n[o];
								o[t] = r;
							}
							return o;
						}(e, n.typeInfo, t, r.typeInfo);
						return i === null ? null : this._makeCwiseData(i, r.typeInfo);
					}
					if (this._isVectorType(n) && this._isMatrixType(r)) {
						let i = function(e, t, n, r) {
							if (Lc[t.name] === void 0 || Rc[r.name] === void 0) return null;
							let i = Rc[r.name][0], a = Rc[r.name][1];
							if (a !== e.length) return null;
							let o = [];
							for (let t = 0; t < i; t++) {
								let r = 0;
								for (let o = 0; o < a; o++) r += e[o] * n[o * i + t];
								o[t] = r;
							}
							return o;
						}(e, n.typeInfo, t, r.typeInfo);
						return i === null ? null : this._makeCwiseData(i, n.typeInfo);
					}
					{
						if (e.length !== t.length) return null;
						let r = e.map((e, n) => e * t[n]);
						return this._makeCwiseData(r, n.typeInfo);
					}
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t * e);
					return this._isMatrixType(n) ? new U(t, n.typeInfo) : this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e * t);
					return r instanceof U ? new U(t, r.typeInfo) : this._makeCwiseData(t, r.typeInfo);
				}
				let e = i, t = a, o = this._maxFormatTypeInfo([n.typeInfo, r.typeInfo]);
				return new V(e * t, o);
			}
			case "%": {
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e % t[n]);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t % e);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e % t);
					return this._makeCwiseData(t, r.typeInfo);
				}
				let e = i, t = a, o = this._maxFormatTypeInfo([n.typeInfo, r.typeInfo]);
				return new V(e % t, o);
			}
			case "/": {
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e / t[n]);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t / e);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e / t);
					return this._makeCwiseData(t, r.typeInfo);
				}
				let e = i, t = a, o = this._maxFormatTypeInfo([n.typeInfo, r.typeInfo]);
				return new V(e / t, o);
			}
			case "&": {
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e & t[n]);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t & e);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e & t);
					return this._makeCwiseData(t, r.typeInfo);
				}
				let e = i, t = a, o = this._maxFormatTypeInfo([n.typeInfo, r.typeInfo]);
				return new V(e & t, o);
			}
			case "|": {
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e | t[n]);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t | e);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e | t);
					return this._makeCwiseData(t, r.typeInfo);
				}
				let e = i, t = a, o = this._maxFormatTypeInfo([n.typeInfo, r.typeInfo]);
				return new V(e | t, o);
			}
			case "^": {
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e ^ t[n]);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t ^ e);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e ^ t);
					return this._makeCwiseData(t, r.typeInfo);
				}
				let e = i, t = a, o = this._maxFormatTypeInfo([n.typeInfo, r.typeInfo]);
				return new V(e ^ t, o);
			}
			case "<<": {
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e << t[n]);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t << e);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e << t);
					return this._makeCwiseData(t, r.typeInfo);
				}
				let e = i, t = a, o = this._maxFormatTypeInfo([n.typeInfo, r.typeInfo]);
				return new V(e << t, o);
			}
			case ">>": {
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e >> t[n]);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t >> e);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e >> t);
					return this._makeCwiseData(t, r.typeInfo);
				}
				let e = i, t = a, o = this._maxFormatTypeInfo([n.typeInfo, r.typeInfo]);
				return new V(e >> t, o);
			}
			case ">":
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => +(e > t[n]));
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => +(t > e));
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => +(e > t));
					return this._makeCwiseData(t, r.typeInfo);
				}
				return new V(+(i > a), this.getTypeInfo("bool"));
			case "<":
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => +(e < t[n]));
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => +(t < e));
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => +(e < t));
					return this._makeCwiseData(t, r.typeInfo);
				}
				return new V(+(i < a), this.getTypeInfo("bool"));
			case "==":
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => +(e === t[n]));
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => +(t === e));
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => +(e === t));
					return this._makeCwiseData(t, r.typeInfo);
				}
				return new V(+(i === a), this.getTypeInfo("bool"));
			case "!=":
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e === t[n] ? 0 : 1);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t === e ? 0 : 1);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e === t ? 0 : 1);
					return this._makeCwiseData(t, r.typeInfo);
				}
				return new V(i === a ? 0 : 1, this.getTypeInfo("bool"));
			case ">=":
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => +(e >= t[n]));
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => +(t >= e));
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => +(e >= t));
					return this._makeCwiseData(t, r.typeInfo);
				}
				return new V(+(i >= a), this.getTypeInfo("bool"));
			case "<=":
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => +(e <= t[n]));
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => +(t <= e));
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => +(e <= t));
					return this._makeCwiseData(t, r.typeInfo);
				}
				return new V(+(i <= a), this.getTypeInfo("bool"));
			case "&&":
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e && t[n] ? 1 : 0);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t && e ? 1 : 0);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e && t ? 1 : 0);
					return this._makeCwiseData(t, r.typeInfo);
				}
				return new V(i && a ? 1 : 0, this.getTypeInfo("bool"));
			case "||":
				if (q(i) && q(a)) {
					let e = i, t = a;
					if (e.length !== t.length) return null;
					let r = e.map((e, n) => e || t[n] ? 1 : 0);
					return this._makeCwiseData(r, n.typeInfo);
				}
				if (q(i)) {
					let e = a, t = i.map((t, n) => t || e ? 1 : 0);
					return this._makeCwiseData(t, n.typeInfo);
				}
				if (q(a)) {
					let e = i, t = a.map((t, n) => e || t ? 1 : 0);
					return this._makeCwiseData(t, r.typeInfo);
				}
				return new V(i || a ? 1 : 0, this.getTypeInfo("bool"));
		}
		return null;
	}
	_evalCall(e, t) {
		let n = this._evalCallValue(e, t);
		return n !== null && e.postfix ? n.getSubData(this, e.postfix, t) : n;
	}
	_evalCallValue(e, t) {
		if (e.cachedReturnValue !== null) return e.cachedReturnValue;
		let n = t.clone();
		n.currentFunctionName = e.name;
		let r = t.getFunction(e.name);
		if (!r) return e.isBuiltin ? this._callBuiltinFunction(e, n) : this.getTypeInfo(e.name) ? this._evalCreate(e, t) : null;
		for (let t = 0; t < r.node.args.length; ++t) {
			let i = r.node.args[t], a = this.evalExpression(e.args[t], n);
			n.createVariable(i.name, a, i);
		}
		return this._execStatements(r.node.body, n);
	}
	_callBuiltinFunction(e, t) {
		switch (e.name) {
			case "all": return this.builtins.All(e, t);
			case "any": return this.builtins.Any(e, t);
			case "select": return this.builtins.Select(e, t);
			case "arrayLength": return this.builtins.ArrayLength(e, t);
			case "abs": return this.builtins.Abs(e, t);
			case "acos": return this.builtins.Acos(e, t);
			case "acosh": return this.builtins.Acosh(e, t);
			case "asin": return this.builtins.Asin(e, t);
			case "asinh": return this.builtins.Asinh(e, t);
			case "atan": return this.builtins.Atan(e, t);
			case "atanh": return this.builtins.Atanh(e, t);
			case "atan2": return this.builtins.Atan2(e, t);
			case "ceil": return this.builtins.Ceil(e, t);
			case "clamp": return this.builtins.Clamp(e, t);
			case "cos": return this.builtins.Cos(e, t);
			case "cosh": return this.builtins.Cosh(e, t);
			case "countLeadingZeros": return this.builtins.CountLeadingZeros(e, t);
			case "countOneBits": return this.builtins.CountOneBits(e, t);
			case "countTrailingZeros": return this.builtins.CountTrailingZeros(e, t);
			case "cross": return this.builtins.Cross(e, t);
			case "degrees": return this.builtins.Degrees(e, t);
			case "determinant": return this.builtins.Determinant(e, t);
			case "distance": return this.builtins.Distance(e, t);
			case "dot": return this.builtins.Dot(e, t);
			case "dot4U8Packed": return this.builtins.Dot4U8Packed(e, t);
			case "dot4I8Packed": return this.builtins.Dot4I8Packed(e, t);
			case "exp": return this.builtins.Exp(e, t);
			case "exp2": return this.builtins.Exp2(e, t);
			case "extractBits": return this.builtins.ExtractBits(e, t);
			case "faceForward": return this.builtins.FaceForward(e, t);
			case "firstLeadingBit": return this.builtins.FirstLeadingBit(e, t);
			case "firstTrailingBit": return this.builtins.FirstTrailingBit(e, t);
			case "floor": return this.builtins.Floor(e, t);
			case "fma": return this.builtins.Fma(e, t);
			case "fract": return this.builtins.Fract(e, t);
			case "frexp": return this.builtins.Frexp(e, t);
			case "insertBits": return this.builtins.InsertBits(e, t);
			case "inverseSqrt": return this.builtins.InverseSqrt(e, t);
			case "ldexp": return this.builtins.Ldexp(e, t);
			case "length": return this.builtins.Length(e, t);
			case "log": return this.builtins.Log(e, t);
			case "log2": return this.builtins.Log2(e, t);
			case "max": return this.builtins.Max(e, t);
			case "min": return this.builtins.Min(e, t);
			case "mix": return this.builtins.Mix(e, t);
			case "modf": return this.builtins.Modf(e, t);
			case "normalize": return this.builtins.Normalize(e, t);
			case "pow": return this.builtins.Pow(e, t);
			case "quantizeToF16": return this.builtins.QuantizeToF16(e, t);
			case "radians": return this.builtins.Radians(e, t);
			case "reflect": return this.builtins.Reflect(e, t);
			case "refract": return this.builtins.Refract(e, t);
			case "reverseBits": return this.builtins.ReverseBits(e, t);
			case "round": return this.builtins.Round(e, t);
			case "saturate": return this.builtins.Saturate(e, t);
			case "sign": return this.builtins.Sign(e, t);
			case "sin": return this.builtins.Sin(e, t);
			case "sinh": return this.builtins.Sinh(e, t);
			case "smoothstep": return this.builtins.SmoothStep(e, t);
			case "sqrt": return this.builtins.Sqrt(e, t);
			case "step": return this.builtins.Step(e, t);
			case "tan": return this.builtins.Tan(e, t);
			case "tanh": return this.builtins.Tanh(e, t);
			case "transpose": return this.builtins.Transpose(e, t);
			case "trunc": return this.builtins.Trunc(e, t);
			case "dpdx": return this.builtins.Dpdx(e, t);
			case "dpdxCoarse": return this.builtins.DpdxCoarse(e, t);
			case "dpdxFine": return this.builtins.DpdxFine(e, t);
			case "dpdy": return this.builtins.Dpdy(e, t);
			case "dpdyCoarse": return this.builtins.DpdyCoarse(e, t);
			case "dpdyFine": return this.builtins.DpdyFine(e, t);
			case "fwidth": return this.builtins.Fwidth(e, t);
			case "fwidthCoarse": return this.builtins.FwidthCoarse(e, t);
			case "fwidthFine": return this.builtins.FwidthFine(e, t);
			case "textureDimensions": return this.builtins.TextureDimensions(e, t);
			case "textureGather": return this.builtins.TextureGather(e, t);
			case "textureGatherCompare": return this.builtins.TextureGatherCompare(e, t);
			case "textureLoad": return this.builtins.TextureLoad(e, t);
			case "textureNumLayers": return this.builtins.TextureNumLayers(e, t);
			case "textureNumLevels": return this.builtins.TextureNumLevels(e, t);
			case "textureNumSamples": return this.builtins.TextureNumSamples(e, t);
			case "textureSample": return this.builtins.TextureSample(e, t);
			case "textureSampleBias": return this.builtins.TextureSampleBias(e, t);
			case "textureSampleCompare": return this.builtins.TextureSampleCompare(e, t);
			case "textureSampleCompareLevel": return this.builtins.TextureSampleCompareLevel(e, t);
			case "textureSampleGrad": return this.builtins.TextureSampleGrad(e, t);
			case "textureSampleLevel": return this.builtins.TextureSampleLevel(e, t);
			case "textureSampleBaseClampToEdge": return this.builtins.TextureSampleBaseClampToEdge(e, t);
			case "textureStore": return this.builtins.TextureStore(e, t);
			case "atomicLoad": return this.builtins.AtomicLoad(e, t);
			case "atomicStore": return this.builtins.AtomicStore(e, t);
			case "atomicAdd": return this.builtins.AtomicAdd(e, t);
			case "atomicSub": return this.builtins.AtomicSub(e, t);
			case "atomicMax": return this.builtins.AtomicMax(e, t);
			case "atomicMin": return this.builtins.AtomicMin(e, t);
			case "atomicAnd": return this.builtins.AtomicAnd(e, t);
			case "atomicOr": return this.builtins.AtomicOr(e, t);
			case "atomicXor": return this.builtins.AtomicXor(e, t);
			case "atomicExchange": return this.builtins.AtomicExchange(e, t);
			case "atomicCompareExchangeWeak": return this.builtins.AtomicCompareExchangeWeak(e, t);
			case "pack4x8snorm": return this.builtins.Pack4x8snorm(e, t);
			case "pack4x8unorm": return this.builtins.Pack4x8unorm(e, t);
			case "pack4xI8": return this.builtins.Pack4xI8(e, t);
			case "pack4xU8": return this.builtins.Pack4xU8(e, t);
			case "pack4x8Clamp": return this.builtins.Pack4x8Clamp(e, t);
			case "pack4xU8Clamp": return this.builtins.Pack4xU8Clamp(e, t);
			case "pack2x16snorm": return this.builtins.Pack2x16snorm(e, t);
			case "pack2x16unorm": return this.builtins.Pack2x16unorm(e, t);
			case "pack2x16float": return this.builtins.Pack2x16float(e, t);
			case "unpack4x8snorm": return this.builtins.Unpack4x8snorm(e, t);
			case "unpack4x8unorm": return this.builtins.Unpack4x8unorm(e, t);
			case "unpack4xI8": return this.builtins.Unpack4xI8(e, t);
			case "unpack4xU8": return this.builtins.Unpack4xU8(e, t);
			case "unpack2x16snorm": return this.builtins.Unpack2x16snorm(e, t);
			case "unpack2x16unorm": return this.builtins.Unpack2x16unorm(e, t);
			case "unpack2x16float": return this.builtins.Unpack2x16float(e, t);
			case "storageBarrier": return this.builtins.StorageBarrier(e, t);
			case "textureBarrier": return this.builtins.TextureBarrier(e, t);
			case "workgroupBarrier": return this.builtins.WorkgroupBarrier(e, t);
			case "workgroupUniformLoad": return this.builtins.WorkgroupUniformLoad(e, t);
			case "subgroupAdd": return this.builtins.SubgroupAdd(e, t);
			case "subgroupExclusiveAdd": return this.builtins.SubgroupExclusiveAdd(e, t);
			case "subgroupInclusiveAdd": return this.builtins.SubgroupInclusiveAdd(e, t);
			case "subgroupAll": return this.builtins.SubgroupAll(e, t);
			case "subgroupAnd": return this.builtins.SubgroupAnd(e, t);
			case "subgroupAny": return this.builtins.SubgroupAny(e, t);
			case "subgroupBallot": return this.builtins.SubgroupBallot(e, t);
			case "subgroupBroadcast": return this.builtins.SubgroupBroadcast(e, t);
			case "subgroupBroadcastFirst": return this.builtins.SubgroupBroadcastFirst(e, t);
			case "subgroupElect": return this.builtins.SubgroupElect(e, t);
			case "subgroupMax": return this.builtins.SubgroupMax(e, t);
			case "subgroupMin": return this.builtins.SubgroupMin(e, t);
			case "subgroupMul": return this.builtins.SubgroupMul(e, t);
			case "subgroupExclusiveMul": return this.builtins.SubgroupExclusiveMul(e, t);
			case "subgroupInclusiveMul": return this.builtins.SubgroupInclusiveMul(e, t);
			case "subgroupOr": return this.builtins.SubgroupOr(e, t);
			case "subgroupShuffle": return this.builtins.SubgroupShuffle(e, t);
			case "subgroupShuffleDown": return this.builtins.SubgroupShuffleDown(e, t);
			case "subgroupShuffleUp": return this.builtins.SubgroupShuffleUp(e, t);
			case "subgroupShuffleXor": return this.builtins.SubgroupShuffleXor(e, t);
			case "subgroupXor": return this.builtins.SubgroupXor(e, t);
			case "quadBroadcast": return this.builtins.QuadBroadcast(e, t);
			case "quadSwapDiagonal": return this.builtins.QuadSwapDiagonal(e, t);
			case "quadSwapX": return this.builtins.QuadSwapX(e, t);
			case "quadSwapY": return this.builtins.QuadSwapY(e, t);
		}
		let n = t.getFunction(e.name);
		if (n) {
			let r = t.clone();
			for (let t = 0; t < n.node.args.length; ++t) {
				let i = n.node.args[t], a = this.evalExpression(e.args[t], r);
				r.setVariable(i.name, a, i);
			}
			return this._execStatements(n.node.body, r);
		}
		return null;
	}
	_callConstructorValue(e, t) {
		let n = this.getTypeInfo(e.type);
		if (!e.args || e.args.length === 0) return new V(0, n);
		let r = this.evalExpression(e.args[0], t);
		return r instanceof V ? new V(n?.name === "bool" ? r.value === 0 ? 0 : 1 : r.value, n).getSubData(this, e.postfix, t) : (r.typeInfo = n, r.getSubData(this, e.postfix, t).clone());
	}
	_callConstructorVec(e, t) {
		let n = this.getTypeInfo(e.type), r = Lc[e.type.getTypeName()];
		if (r === void 0) return null;
		let i = [];
		if (e instanceof z) {
			if (e.isVector) {
				let t = e.vectorValue;
				for (let e of t) i.push(e);
			} else i.push(e.scalarValue);
		} else if (e.args) for (let n of e.args) {
			let e = this.evalExpression(n, t);
			if (e instanceof H) {
				let t = e.data;
				for (let e = 0; e < t.length; ++e) {
					let n = t[e];
					i.push(n);
				}
			} else if (e instanceof V) {
				let t = e.value;
				i.push(t);
			}
		}
		if (e.type instanceof R && e.type.format === null && (e.type.format = R.f32), i.length === 0) return new H(Array(r).fill(0), n).getSubData(this, e.postfix, t);
		if (i.length === 1) for (; i.length < r;) i.push(i[0]);
		return i.length < r ? null : new H(i.length > r ? i.slice(0, r) : i, n).getSubData(this, e.postfix, t);
	}
	_callConstructorMatrix(e, t) {
		let n = this.getTypeInfo(e.type), r = Rc[e.type.getTypeName()];
		if (r === void 0) return null;
		let i = [];
		if (e instanceof z) {
			if (e.isVector) {
				let t = e.vectorValue;
				for (let e of t) i.push(e);
			} else i.push(e.scalarValue);
		} else if (e.args) for (let n of e.args) {
			let e = this.evalExpression(n, t);
			e instanceof H ? i.push(...e.data) : e instanceof V ? i.push(e.value) : e instanceof U && i.push(...e.data);
		}
		return n instanceof Ho && n.format === null && (n.format = this.getTypeInfo("f32")), i.length === 0 ? new U(Array(r[2]).fill(0), n).getSubData(this, e.postfix, t) : i.length === r[2] ? new U(i, n).getSubData(this, e.postfix, t) : null;
	}
};
zc._numericScalarTypes = /* @__PURE__ */ new Set([
	"f32",
	"i32",
	"u32",
	"bool",
	"f16"
]), zc._vectorTypes = /* @__PURE__ */ new Set([
	"vec2",
	"vec3",
	"vec4",
	"vec2f",
	"vec3f",
	"vec4f",
	"vec2i",
	"vec3i",
	"vec4i",
	"vec2u",
	"vec3u",
	"vec4u",
	"vec2h",
	"vec3h",
	"vec4h",
	"vec2b",
	"vec3b",
	"vec4b"
]), zc._matrixTypes = /* @__PURE__ */ new Set(/* @__PURE__ */ "mat2x2.mat2x3.mat2x4.mat3x2.mat3x3.mat3x4.mat4x2.mat4x3.mat4x4.mat2x2f.mat2x3f.mat2x4f.mat3x2f.mat3x3f.mat3x4f.mat4x2f.mat4x3f.mat4x4f.mat2x2h.mat2x3h.mat2x4h.mat3x2h.mat3x3h.mat3x4h.mat4x2h.mat4x3h.mat4x4h".split(".")), zc._defaultableTypes = /* @__PURE__ */ new Set([
	...zc._numericScalarTypes,
	...zc._vectorTypes,
	...zc._matrixTypes,
	"array"
]), zc._breakObj = new sc(new Lo("BREAK", null), null), zc._continueObj = new sc(new Lo("CONTINUE", null), null), zc._priority = /* @__PURE__ */ new Map([
	["f32", 0],
	["f16", 1],
	["u32", 2],
	["i32", 3],
	["x32", 3]
]);
var Bc = class {
	constructor() {
		this.constants = /* @__PURE__ */ new Map(), this.aliases = /* @__PURE__ */ new Map(), this.structs = /* @__PURE__ */ new Map();
	}
}, Vc = class e {
	constructor() {
		this._tokens = [], this._current = 0, this._currentLine = 1, this._deferArrayCountEval = [], this._currentLoop = [], this._context = new Bc(), this._exec = new zc(), this._forwardTypeCount = 0;
	}
	static Parse(t) {
		return new e().parse(t);
	}
	parse(e) {
		this._initialize(e), this._deferArrayCountEval.length = 0;
		let t = [];
		for (; !this._isAtEnd();) {
			let e = this._global_decl_or_directive();
			if (!e) break;
			t.push(e);
		}
		if (this._deferArrayCountEval.length > 0) {
			for (let e of this._deferArrayCountEval) {
				let t = e.arrayType, n = e.countNode;
				if (n instanceof Ks) {
					let e = n.name, r = this._context.constants.get(e);
					if (r) try {
						t.count = r.constEvaluate(this._exec);
					} catch {}
				}
			}
			this._deferArrayCountEval.length = 0;
		}
		if (this._forwardTypeCount > 0) for (let e of t) e.search((e) => {
			e instanceof ic || e instanceof zs ? e.type = this._forwardType(e.type) : e instanceof Bs ? e.format = this._forwardType(e.format) : e instanceof _s || e instanceof ys || e instanceof bs ? e.type = this._forwardType(e.type) : e instanceof fs ? e.returnType = this._forwardType(e.returnType) : e instanceof nc && (e.type = this._forwardType(e.type));
		});
		return t;
	}
	_forwardType(e) {
		if (e instanceof Ls) {
			let t = this._getType(e.name);
			if (t) return t;
		} else e instanceof zs ? e.type = this._forwardType(e.type) : e instanceof Bs && (e.format = this._forwardType(e.format));
		return e;
	}
	_initialize(e) {
		if (e) {
			if (typeof e == "string") {
				let t = new mc(e);
				this._tokens = t.scanTokens();
			} else this._tokens = e;
		} else this._tokens = [];
		this._current = 0;
	}
	_updateNode(e, t) {
		return e.line = t ?? this._currentLine, e;
	}
	_setSpan(e, t) {
		if (e === null || t >= this._tokens.length) return e;
		let n = this._tokens[t].start, r = this._current > 0 ? this._tokens[this._current - 1].end : n, i = Array.isArray(e) ? e : [e];
		for (let e of i) e instanceof cs && e.start < 0 && (e.start = n, e.end = r);
		return e;
	}
	_error(e, t) {
		return /* @__PURE__ */ Error(`${t}. Line: ${e.line}`);
	}
	_isAtEnd() {
		return this._current >= this._tokens.length || this._peek().type === K.eof;
	}
	_match(e) {
		if (e instanceof G) return !!this._check(e) && (this._advance(), !0);
		for (let t = 0, n = e.length; t < n; ++t) {
			let n = e[t];
			if (this._check(n)) return this._advance(), !0;
		}
		return !1;
	}
	_consume(e, t) {
		if (this._check(e)) return this._advance();
		throw this._error(this._peek(), t);
	}
	_check(e) {
		if (this._isAtEnd()) return !1;
		let t = this._peek();
		if (Array.isArray(e)) {
			let n = t.type, r = !1;
			for (let t of e) {
				if (n === t) return !0;
				t === K.tokens.name && (r = !0);
			}
			if (r) {
				let e = K.tokens.name.rule.exec(t.lexeme);
				if (e && e.index === 0 && e[0] === t.lexeme) return !0;
			}
			return !1;
		}
		if (t.type === e) return !0;
		if (e === K.tokens.name) {
			let e = K.tokens.name.rule.exec(t.lexeme);
			return e && e.index === 0 && e[0] === t.lexeme;
		}
		return !1;
	}
	_advance() {
		return this._currentLine = this._peek()?.line ?? -1, this._isAtEnd() || this._current++, this._previous();
	}
	_peek() {
		return this._tokens[this._current];
	}
	_previous() {
		return this._tokens[this._current - 1];
	}
	_global_decl_or_directive() {
		for (; this._match(K.tokens.semicolon) && !this._isAtEnd(););
		let e = this._current;
		return this._setSpan(this._global_decl_or_directiveImpl(), e);
	}
	_global_decl_or_directiveImpl() {
		for (; this._match(K.tokens.semicolon) && !this._isAtEnd(););
		if (this._match(K.keywords.const_assert)) {
			let e = this._global_assert();
			return this._consume(K.tokens.semicolon, "Expected ';'"), this._exec.reflection.updateAST([e]), e;
		}
		if (this._match(K.keywords.alias)) {
			let e = this._type_alias();
			return this._consume(K.tokens.semicolon, "Expected ';'"), this._exec.reflection.updateAST([e]), e;
		}
		if (this._match(K.keywords.diagnostic)) {
			let e = this._diagnostic();
			return this._consume(K.tokens.semicolon, "Expected ';'"), this._exec.reflection.updateAST([e]), e;
		}
		if (this._match(K.keywords.requires)) {
			let e = this._requires_directive();
			return this._consume(K.tokens.semicolon, "Expected ';'"), this._exec.reflection.updateAST([e]), e;
		}
		if (this._match(K.keywords.enable)) {
			let e = this._enable_directive();
			return this._consume(K.tokens.semicolon, "Expected ';'"), this._exec.reflection.updateAST([e]), e;
		}
		let e = this._attribute();
		if (this._check(K.keywords.var)) {
			let t = this._global_variable_decl();
			return t != null && (t.attributes = e), this._consume(K.tokens.semicolon, "Expected ';'."), this._exec.reflection.updateAST([t]), t;
		}
		if (this._check(K.keywords.override)) {
			let t = this._override_variable_decl();
			return t != null && (t.attributes = e), this._consume(K.tokens.semicolon, "Expected ';'."), this._exec.reflection.updateAST([t]), t;
		}
		if (this._check(K.keywords.let)) {
			let t = this._global_let_decl();
			return t != null && (t.attributes = e), this._consume(K.tokens.semicolon, "Expected ';'."), this._exec.reflection.updateAST([t]), t;
		}
		if (this._check(K.keywords.const)) {
			let t = this._global_const_decl();
			return t != null && (t.attributes = e), this._consume(K.tokens.semicolon, "Expected ';'."), this._exec.reflection.updateAST([t]), t;
		}
		if (this._check(K.keywords.struct)) {
			let t = this._struct_decl();
			return t != null && (t.attributes = e), this._exec.reflection.updateAST([t]), t;
		}
		if (this._check(K.keywords.fn)) {
			let t = this._function_decl();
			return t != null && (t.attributes = e), this._exec.reflection.updateAST([t]), t;
		}
		return null;
	}
	_function_decl() {
		if (!this._match(K.keywords.fn)) return null;
		let e = this._currentLine, t = this._consume(K.tokens.ident, "Expected function name.").toString();
		this._consume(K.tokens.paren_left, "Expected '(' for function arguments.");
		let n = [];
		if (!this._check(K.tokens.paren_right)) do {
			if (this._check(K.tokens.paren_right)) break;
			let e = this._attribute(), t = this._consume(K.tokens.name, "Expected argument name.").toString();
			this._consume(K.tokens.colon, "Expected ':' for argument type.");
			let r = this._attribute(), i = this._type_decl();
			i != null && (this._setTypeAttributes(i, r), n.push(this._updateNode(new nc(t, i, e))));
		} while (this._match(K.tokens.comma));
		this._consume(K.tokens.paren_right, "Expected ')' after function arguments.");
		let r = null;
		if (this._match(K.tokens.arrow)) {
			let e = this._attribute();
			r = this._type_decl(), this._setTypeAttributes(r, e);
		}
		let i = this._compound_statement(), a = this._currentLine;
		return this._updateNode(new fs(t, n, r, i, e, a), e);
	}
	_compound_statement() {
		let e = [];
		for (this._consume(K.tokens.brace_left, "Expected '{' for block."); !this._check(K.tokens.brace_right);) {
			let t = this._statement();
			t !== null && e.push(t);
		}
		return this._consume(K.tokens.brace_right, "Expected '}' for block."), e;
	}
	_statement() {
		for (; this._match(K.tokens.semicolon) && !this._isAtEnd(););
		let e = this._current;
		return this._setSpan(this._statementImpl(), e);
	}
	_statementImpl() {
		for (; this._match(K.tokens.semicolon) && !this._isAtEnd(););
		if (this._check(K.tokens.attr) && this._attribute(), this._check(K.keywords.if)) return this._if_statement();
		if (this._check(K.keywords.switch)) return this._switch_statement();
		if (this._check(K.keywords.loop)) return this._loop_statement();
		if (this._check(K.keywords.for)) return this._for_statement();
		if (this._check(K.keywords.while)) return this._while_statement();
		if (this._check(K.keywords.continuing)) return this._continuing_statement();
		if (this._check(K.keywords.static_assert)) return this._static_assert_statement();
		if (this._check(K.tokens.brace_left)) return this._compound_statement();
		let e = null;
		if (this._check(K.keywords.return)) e = this._return_statement();
		else if (this._check([
			K.keywords.var,
			K.keywords.let,
			K.keywords.const
		])) e = this._variable_statement();
		else if (this._match(K.keywords.discard)) e = this._updateNode(new Ps());
		else if (this._match(K.keywords.break)) {
			let t = this._updateNode(new Fs());
			this._currentLoop.length > 0 && (t.loopId = this._currentLoop[this._currentLoop.length - 1].id), e = t, this._check(K.keywords.if) && (this._advance(), t.condition = this._optional_paren_expression());
		} else if (this._match(K.keywords.continue)) {
			let t = this._updateNode(new Is());
			if (!(this._currentLoop.length > 0)) throw this._error(this._peek(), "Continue statement must be inside a loop");
			t.loopId = this._currentLoop[this._currentLoop.length - 1].id, e = t;
		} else e = this._increment_decrement_statement() || this._func_call_statement() || this._assignment_statement();
		return e != null && this._consume(K.tokens.semicolon, "Expected ';' after statement."), e;
	}
	_static_assert_statement() {
		if (!this._match(K.keywords.static_assert)) return null;
		let e = this._currentLine, t = this._optional_paren_expression();
		return this._updateNode(new ps(t), e);
	}
	_global_assert() {
		let e = this._currentLine, t = this._short_circuit_or_expression();
		return this._updateNode(new ps(t), e);
	}
	_while_statement() {
		if (!this._match(K.keywords.while)) return null;
		let e = this._updateNode(new ms(null, null));
		return this._currentLoop.push(e), e.condition = this._optional_paren_expression(), this._check(K.tokens.attr) && this._attribute(), e.body = this._compound_statement(), this._currentLoop.pop(), e;
	}
	_continuing_statement() {
		let e = this._currentLoop.length > 0 ? this._currentLoop[this._currentLoop.length - 1].id : -1;
		if (!this._match(K.keywords.continuing)) return null;
		let t = this._currentLine, n = this._compound_statement();
		return this._updateNode(new hs(n, e), t);
	}
	_for_statement() {
		if (!this._match(K.keywords.for)) return null;
		this._consume(K.tokens.paren_left, "Expected '('.");
		let e = this._updateNode(new gs(null, null, null, null));
		return this._currentLoop.push(e), e.init = this._check(K.tokens.semicolon) ? null : this._for_init(), this._consume(K.tokens.semicolon, "Expected ';'."), e.condition = this._check(K.tokens.semicolon) ? null : this._short_circuit_or_expression(), this._consume(K.tokens.semicolon, "Expected ';'."), e.increment = this._check(K.tokens.paren_right) ? null : this._for_increment(), this._consume(K.tokens.paren_right, "Expected ')'."), this._check(K.tokens.attr) && this._attribute(), e.body = this._compound_statement(), this._currentLoop.pop(), e;
	}
	_for_init() {
		return this._variable_statement() || this._func_call_statement() || this._assignment_statement();
	}
	_for_increment() {
		return this._func_call_statement() || this._increment_decrement_statement() || this._assignment_statement();
	}
	_variable_statement() {
		if (this._check(K.keywords.var)) {
			let e = this._variable_decl();
			if (e === null) throw this._error(this._peek(), "Variable declaration expected.");
			let t = null;
			return this._match(K.tokens.equal) && (t = this._short_circuit_or_expression()), this._updateNode(new _s(e.name, e.type, e.storage, e.access, t), e.line);
		}
		if (this._match(K.keywords.let)) {
			let e = this._currentLine, t = this._consume(K.tokens.name, "Expected name for let.").toString(), n = null;
			if (this._match(K.tokens.colon)) {
				let e = this._attribute();
				n = this._type_decl(), this._setTypeAttributes(n, e);
			}
			this._consume(K.tokens.equal, "Expected '=' for let.");
			let r = this._short_circuit_or_expression();
			return this._updateNode(new ys(t, n, null, null, r), e);
		}
		if (this._match(K.keywords.const)) {
			let e = this._currentLine, t = this._consume(K.tokens.name, "Expected name for const.").toString(), n = null;
			if (this._match(K.tokens.colon)) {
				let e = this._attribute();
				n = this._type_decl(), this._setTypeAttributes(n, e);
			}
			this._consume(K.tokens.equal, "Expected '=' for const.");
			let r = this._short_circuit_or_expression();
			return n === null && r instanceof z && (n = r.type), this._updateNode(new bs(t, n, null, null, r), e);
		}
		return null;
	}
	_increment_decrement_statement() {
		let e = this._current, t = this._unary_expression();
		if (t === null) return null;
		if (!this._check(K.increment_operators)) return this._current = e, null;
		let n = this._consume(K.increment_operators, "Expected increment operator");
		return this._updateNode(new Cs(n.type === K.tokens.plus_plus ? xs.increment : xs.decrement, t));
	}
	_assignment_statement() {
		let e = null, t = this._currentLine;
		if (this._check(K.tokens.brace_right)) return null;
		let n = this._match(K.tokens.underscore);
		if (n || (e = this._unary_expression()), !n && e === null) return null;
		let r = this._consume(K.assignment_operators, "Expected assignment operator."), i = this._short_circuit_or_expression();
		return this._updateNode(new ws(Ss.parse(r.lexeme), e, i), t);
	}
	_func_call_statement() {
		if (!this._check(K.tokens.ident)) return null;
		let e = this._currentLine, t = this._current, n = this._consume(K.tokens.ident, "Expected function name."), r = this._argument_expression_list();
		return r === null ? (this._current = t, null) : this._updateNode(new Ts(n.lexeme, r), e);
	}
	_loop_statement() {
		if (!this._match(K.keywords.loop)) return null;
		this._check(K.tokens.attr) && this._attribute(), this._consume(K.tokens.brace_left, "Expected '{' for loop.");
		let e = this._updateNode(new Es([], null));
		this._currentLoop.push(e);
		let t = this._statement();
		for (; t !== null;) {
			if (Array.isArray(t)) for (let n of t) e.body.push(n);
			else e.body.push(t);
			if (t instanceof hs) {
				e.continuing = t;
				break;
			}
			t = this._statement();
		}
		return this._currentLoop.pop(), this._consume(K.tokens.brace_right, "Expected '}' for loop."), e;
	}
	_switch_statement() {
		if (!this._match(K.keywords.switch)) return null;
		let e = this._updateNode(new Ds(null, []));
		if (this._currentLoop.push(e), e.condition = this._optional_paren_expression(), this._check(K.tokens.attr) && this._attribute(), this._consume(K.tokens.brace_left, "Expected '{' for switch."), e.cases = this._switch_body(), e.cases === null || e.cases.length === 0) throw this._error(this._previous(), "Expected 'case' or 'default'.");
		return this._consume(K.tokens.brace_right, "Expected '}' for switch."), this._currentLoop.pop(), e;
	}
	_switch_body() {
		let e = [], t = !1;
		for (; this._check([K.keywords.default, K.keywords.case]);) {
			if (this._match(K.keywords.case)) {
				let n = this._case_selectors();
				for (let e of n) if (e instanceof $s) {
					if (t) throw this._error(this._previous(), "Multiple default cases in switch statement.");
					t = !0;
					break;
				}
				this._match(K.tokens.colon), this._check(K.tokens.attr) && this._attribute(), this._consume(K.tokens.brace_left, "Exected '{' for switch case.");
				let r = this._case_body();
				this._consume(K.tokens.brace_right, "Exected '}' for switch case."), e.push(this._updateNode(new ec(n, r)));
			}
			if (this._match(K.keywords.default)) {
				if (t) throw this._error(this._previous(), "Multiple default cases in switch statement.");
				this._match(K.tokens.colon), this._check(K.tokens.attr) && this._attribute(), this._consume(K.tokens.brace_left, "Exected '{' for switch default.");
				let n = this._case_body();
				this._consume(K.tokens.brace_right, "Exected '}' for switch default."), e.push(this._updateNode(new tc(n)));
			}
		}
		return e;
	}
	_case_selectors() {
		let e = [];
		for (this._match(K.keywords.default) ? e.push(this._updateNode(new $s())) : e.push(this._shift_expression()); this._match(K.tokens.comma);) this._match(K.keywords.default) ? e.push(this._updateNode(new $s())) : e.push(this._shift_expression());
		return e;
	}
	_case_body() {
		if (this._match(K.keywords.fallthrough)) return this._consume(K.tokens.semicolon, "Expected ';'"), [];
		let e = this._statement();
		if (e === null) return [];
		Array.isArray(e) || (e = [e]);
		let t = this._case_body();
		return t.length === 0 ? e : [...e, t[0]];
	}
	_if_statement() {
		if (!this._match(K.keywords.if)) return null;
		let e = this._currentLine, t = this._optional_paren_expression();
		this._check(K.tokens.attr) && this._attribute();
		let n = this._compound_statement(), r = [];
		this._match_elseif() && (this._check(K.tokens.attr) && this._attribute(), r = this._elseif_statement(r));
		let i = null;
		return this._match(K.keywords.else) && (this._check(K.tokens.attr) && this._attribute(), i = this._compound_statement()), this._updateNode(new Os(t, n, r, i), e);
	}
	_match_elseif() {
		return this._tokens[this._current].type === K.keywords.else && this._tokens[this._current + 1].type === K.keywords.if && (this._advance(), this._advance(), !0);
	}
	_elseif_statement(e = []) {
		let t = this._optional_paren_expression(), n = this._compound_statement();
		return e.push(this._updateNode(new rc(t, n))), this._match_elseif() && (this._check(K.tokens.attr) && this._attribute(), this._elseif_statement(e)), e;
	}
	_return_statement() {
		if (!this._match(K.keywords.return)) return null;
		let e = this._short_circuit_or_expression();
		return this._updateNode(new ks(e));
	}
	_short_circuit_or_expression() {
		let e = this._short_circuit_and_expr();
		for (; this._match(K.tokens.or_or);) e = this._updateNode(new Zs(this._previous().toString(), e, this._short_circuit_and_expr()));
		return e;
	}
	_short_circuit_and_expr() {
		let e = this._inclusive_or_expression();
		for (; this._match(K.tokens.and_and);) e = this._updateNode(new Zs(this._previous().toString(), e, this._inclusive_or_expression()));
		return e;
	}
	_inclusive_or_expression() {
		let e = this._exclusive_or_expression();
		for (; this._match(K.tokens.or);) e = this._updateNode(new Zs(this._previous().toString(), e, this._exclusive_or_expression()));
		return e;
	}
	_exclusive_or_expression() {
		let e = this._and_expression();
		for (; this._match(K.tokens.xor);) e = this._updateNode(new Zs(this._previous().toString(), e, this._and_expression()));
		return e;
	}
	_and_expression() {
		let e = this._equality_expression();
		for (; this._match(K.tokens.and);) e = this._updateNode(new Zs(this._previous().toString(), e, this._equality_expression()));
		return e;
	}
	_equality_expression() {
		let e = this._relational_expression();
		return this._match([K.tokens.equal_equal, K.tokens.not_equal]) ? this._updateNode(new Zs(this._previous().toString(), e, this._relational_expression())) : e;
	}
	_relational_expression() {
		let e = this._shift_expression();
		for (; this._match([
			K.tokens.less_than,
			K.tokens.greater_than,
			K.tokens.less_than_equal,
			K.tokens.greater_than_equal
		]);) e = this._updateNode(new Zs(this._previous().toString(), e, this._shift_expression()));
		return e;
	}
	_shift_expression() {
		let e = this._additive_expression();
		for (; this._match([K.tokens.shift_left, K.tokens.shift_right]);) e = this._updateNode(new Zs(this._previous().toString(), e, this._additive_expression()));
		return e;
	}
	_additive_expression() {
		let e = this._multiplicative_expression();
		for (; this._match([K.tokens.plus, K.tokens.minus]);) e = this._updateNode(new Zs(this._previous().toString(), e, this._multiplicative_expression()));
		return e;
	}
	_multiplicative_expression() {
		let e = this._unary_expression();
		for (; this._match([
			K.tokens.star,
			K.tokens.forward_slash,
			K.tokens.modulo
		]);) e = this._updateNode(new Zs(this._previous().toString(), e, this._unary_expression()));
		return e;
	}
	_unary_expression() {
		return this._match([
			K.tokens.minus,
			K.tokens.bang,
			K.tokens.tilde,
			K.tokens.star,
			K.tokens.and
		]) ? this._updateNode(new B(this._previous().toString(), this._unary_expression())) : this._singular_expression();
	}
	_singular_expression() {
		let e = this._primary_expression(), t = this._postfix_expression();
		return t && (e.postfix = t), e;
	}
	_postfix_expression() {
		if (this._match(K.tokens.bracket_left)) {
			let e = this._short_circuit_or_expression();
			this._consume(K.tokens.bracket_right, "Expected ']'.");
			let t = this._updateNode(new Ys(e)), n = this._postfix_expression();
			return n && (t.postfix = n), t;
		}
		if (this._match(K.tokens.period)) {
			let e = this._consume(K.tokens.name, "Expected member name."), t = this._postfix_expression(), n = this._updateNode(new Us(e.lexeme));
			return t && (n.postfix = t), n;
		}
		return null;
	}
	_getStruct(e) {
		return this._context.aliases.has(e) ? this._context.aliases.get(e)?.type ?? null : this._context.structs.has(e) ? this._context.structs.get(e) ?? null : null;
	}
	_getType(e) {
		let t = this._getStruct(e);
		if (t !== null) return t;
		switch (e) {
			case "void": return L.void;
			case "bool": return L.bool;
			case "i32": return L.i32;
			case "u32": return L.u32;
			case "f32": return L.f32;
			case "f16": return L.f16;
			case "vec2f": return R.vec2f;
			case "vec3f": return R.vec3f;
			case "vec4f": return R.vec4f;
			case "vec2i": return R.vec2i;
			case "vec3i": return R.vec3i;
			case "vec4i": return R.vec4i;
			case "vec2u": return R.vec2u;
			case "vec3u": return R.vec3u;
			case "vec4u": return R.vec4u;
			case "vec2h": return R.vec2h;
			case "vec3h": return R.vec3h;
			case "vec4h": return R.vec4h;
			case "mat2x2f": return R.mat2x2f;
			case "mat2x3f": return R.mat2x3f;
			case "mat2x4f": return R.mat2x4f;
			case "mat3x2f": return R.mat3x2f;
			case "mat3x3f": return R.mat3x3f;
			case "mat3x4f": return R.mat3x4f;
			case "mat4x2f": return R.mat4x2f;
			case "mat4x3f": return R.mat4x3f;
			case "mat4x4f": return R.mat4x4f;
			case "mat2x2h": return R.mat2x2h;
			case "mat2x3h": return R.mat2x3h;
			case "mat2x4h": return R.mat2x4h;
			case "mat3x2h": return R.mat3x2h;
			case "mat3x3h": return R.mat3x3h;
			case "mat3x4h": return R.mat3x4h;
			case "mat4x2h": return R.mat4x2h;
			case "mat4x3h": return R.mat4x3h;
			case "mat4x4h": return R.mat4x4h;
			case "mat2x2i": return R.mat2x2i;
			case "mat2x3i": return R.mat2x3i;
			case "mat2x4i": return R.mat2x4i;
			case "mat3x2i": return R.mat3x2i;
			case "mat3x3i": return R.mat3x3i;
			case "mat3x4i": return R.mat3x4i;
			case "mat4x2i": return R.mat4x2i;
			case "mat4x3i": return R.mat4x3i;
			case "mat4x4i": return R.mat4x4i;
			case "mat2x2u": return R.mat2x2u;
			case "mat2x3u": return R.mat2x3u;
			case "mat2x4u": return R.mat2x4u;
			case "mat3x2u": return R.mat3x2u;
			case "mat3x3u": return R.mat3x3u;
			case "mat3x4u": return R.mat3x4u;
			case "mat4x2u": return R.mat4x2u;
			case "mat4x3u": return R.mat4x3u;
			case "mat4x4u": return R.mat4x4u;
		}
		return null;
	}
	_validateTypeRange(e, t) {
		if (t.name === "i32") {
			if (e < -2147483648 || e > 2147483647) throw this._error(this._previous(), `Value out of range for i32: ${e}`);
		} else if (t.name === "u32" && (e < 0 || e > 4294967295)) throw this._error(this._previous(), `Value out of range for u32: ${e}`);
	}
	_primary_expression() {
		if (this._match(K.tokens.ident)) {
			let e = this._previous().toString();
			if (this._check(K.tokens.paren_left)) {
				let t = this._argument_expression_list(), n = this._getType(e);
				return n === null ? this._updateNode(new Gs(e, t)) : this._updateNode(new Ws(n, t));
			}
			if (this._context.constants.has(e)) {
				let t = this._context.constants.get(e);
				if (t) return this._updateNode(new qs(e, t.value));
			}
			return this._updateNode(new Ks(e));
		}
		if (this._match(K.tokens.int_literal)) {
			let e = this._previous().toString(), t = e.endsWith("i") || e.endsWith("i") ? L.i32 : e.endsWith("u") || e.endsWith("U") ? L.u32 : L.x32, n = parseInt(e);
			return this._validateTypeRange(n, t), this._updateNode(new z(new V(n, this._exec.getTypeInfo(t)), t));
		}
		if (this._match(K.tokens.uint_literal)) {
			let e = parseInt(this._previous().toString());
			return this._validateTypeRange(e, L.u32), this._updateNode(new z(new V(e, this._exec.getTypeInfo(L.u32)), L.u32));
		}
		if (this._match([K.tokens.decimal_float_literal, K.tokens.hex_float_literal])) {
			let e = this._previous().toString(), t = e.endsWith("h");
			t && (e = e.substring(0, e.length - 1));
			let n = parseFloat(e);
			this._validateTypeRange(n, t ? L.f16 : L.f32);
			let r = t ? L.f16 : L.f32;
			return this._updateNode(new z(new V(n, this._exec.getTypeInfo(r)), r));
		}
		if (this._match([K.keywords.true, K.keywords.false])) {
			let e = this._previous().toString() === K.keywords.true.rule;
			return this._updateNode(new z(new V(+!!e, this._exec.getTypeInfo(L.bool)), L.bool));
		}
		if (this._check(K.tokens.paren_left)) return this._paren_expression();
		if (this._match(K.keywords.bitcast)) {
			this._consume(K.tokens.less_than, "Expected '<'.");
			let e = this._type_decl();
			this._consume(K.tokens.greater_than, "Expected '>'.");
			let t = this._paren_expression();
			return this._updateNode(new Js(e, t));
		}
		let e = this._type_decl(), t = this._argument_expression_list();
		return this._updateNode(new Ws(e, t));
	}
	_argument_expression_list() {
		if (!this._match(K.tokens.paren_left)) return null;
		let e = [];
		do {
			if (this._check(K.tokens.paren_right)) break;
			let t = this._short_circuit_or_expression();
			e.push(t);
		} while (this._match(K.tokens.comma));
		return this._consume(K.tokens.paren_right, "Expected ')' for argument list"), e;
	}
	_optional_paren_expression() {
		let e = this._match(K.tokens.paren_left), t = this._short_circuit_or_expression();
		return t.hasParen = e, e && this._consume(K.tokens.paren_right, "Expected ')'."), t;
	}
	_paren_expression() {
		this._consume(K.tokens.paren_left, "Expected '('.");
		let e = this._short_circuit_or_expression();
		return this._consume(K.tokens.paren_right, "Expected ')'."), e.hasParen = !0, e;
	}
	_struct_decl() {
		if (!this._match(K.keywords.struct)) return null;
		let e = this._currentLine, t = this._consume(K.tokens.ident, "Expected name for struct.").toString();
		this._consume(K.tokens.brace_left, "Expected '{' for struct body.");
		let n = [];
		for (; !this._check(K.tokens.brace_right);) {
			let e = this._attribute(), t = this._consume(K.tokens.name, "Expected variable name.").toString();
			this._consume(K.tokens.colon, "Expected ':' for struct member type.");
			let r = this._attribute(), i = this._type_decl();
			this._setTypeAttributes(i, r), this._check(K.tokens.brace_right) ? this._match(K.tokens.comma) : this._consume(K.tokens.comma, "Expected ',' for struct member."), n.push(this._updateNode(new ic(t, i, e)));
		}
		this._consume(K.tokens.brace_right, "Expected '}' after struct body.");
		let r = this._currentLine, i = this._updateNode(new Rs(t, n, e, r), e);
		return this._context.structs.set(t, i), i;
	}
	_global_variable_decl() {
		let e = this._variable_decl();
		if (!e) return null;
		if (this._match(K.tokens.equal) && (e.value = this._const_expression()), e.type !== null && e.value instanceof z) {
			if (e.value.type.name !== "x32" && e.type.getTypeName() !== e.value.type.getTypeName()) throw this._error(this._peek(), `Invalid cast from ${e.value.type.name} to ${e.type.name}`);
			e.value.isScalar && this._validateTypeRange(e.value.scalarValue, e.type), e.value.type = e.type;
		} else e.type === null && e.value instanceof z && (e.type = e.value.type.name === "x32" ? L.i32 : e.value.type, e.value.isScalar && this._validateTypeRange(e.value.scalarValue, e.type));
		return e;
	}
	_override_variable_decl() {
		let e = this._override_decl();
		return e && this._match(K.tokens.equal) && (e.value = this._const_expression()), e;
	}
	_global_const_decl() {
		if (!this._match(K.keywords.const)) return null;
		let e = this._consume(K.tokens.name, "Expected variable name"), t = this._currentLine, n = null;
		if (this._match(K.tokens.colon)) {
			let e = this._attribute();
			n = this._type_decl(), this._setTypeAttributes(n, e);
		}
		let r = null;
		this._consume(K.tokens.equal, "const declarations require an assignment");
		let i = this._short_circuit_or_expression();
		try {
			let t = [L.f32], n = i.constEvaluate(this._exec, t);
			n instanceof V && this._validateTypeRange(n.value, t[0]), t[0] instanceof R && t[0].format === null && n.typeInfo instanceof Ho && n.typeInfo.format !== null && (n.typeInfo.format.name === "f16" ? t[0].format = L.f16 : n.typeInfo.format.name === "f32" ? t[0].format = L.f32 : n.typeInfo.format.name === "i32" ? t[0].format = L.i32 : n.typeInfo.format.name === "u32" ? t[0].format = L.u32 : n.typeInfo.format.name === "bool" && (t[0].format = L.bool)), r = this._updateNode(new z(n, t[0])), this._exec.context.setVariable(e.toString(), n);
		} catch {
			r = i;
		}
		if (n !== null && r instanceof z) {
			if (r.type.name !== "x32" && n.getTypeName() !== r.type.getTypeName()) throw this._error(this._peek(), `Invalid cast from ${r.type.name} to ${n.name}`);
			r.type = n, r.isScalar && this._validateTypeRange(r.scalarValue, r.type);
		} else n === null && r instanceof z && (n = r?.type ?? L.f32, n === L.x32 && (n = L.i32));
		let a = this._updateNode(new bs(e.toString(), n, "", "", r), t);
		return this._context.constants.set(a.name, a), a;
	}
	_global_let_decl() {
		if (!this._match(K.keywords.let)) return null;
		let e = this._currentLine, t = this._consume(K.tokens.name, "Expected variable name"), n = null;
		if (this._match(K.tokens.colon)) {
			let e = this._attribute();
			n = this._type_decl(), this._setTypeAttributes(n, e);
		}
		let r = null;
		if (this._match(K.tokens.equal) && (r = this._const_expression()), n !== null && r instanceof z) {
			if (r.type.name !== "x32" && n.getTypeName() !== r.type.getTypeName()) throw this._error(this._peek(), `Invalid cast from ${r.type.name} to ${n.name}`);
			r.type = n;
		} else n === null && r instanceof z && (n = r.type.name === "x32" ? L.i32 : r.type);
		return r instanceof z && r.isScalar && this._validateTypeRange(r.scalarValue, n), this._updateNode(new ys(t.toString(), n, "", "", r), e);
	}
	_const_expression() {
		return this._short_circuit_or_expression();
	}
	_variable_decl() {
		if (!this._match(K.keywords.var)) return null;
		let e = this._currentLine, t = "", n = "";
		this._match(K.tokens.less_than) && (t = this._consume(K.storage_class, "Expected storage_class.").toString(), this._match(K.tokens.comma) && (n = this._consume(K.access_mode, "Expected access_mode.").toString()), this._consume(K.tokens.greater_than, "Expected '>'."));
		let r = this._consume(K.tokens.name, "Expected variable name"), i = null;
		if (this._match(K.tokens.colon)) {
			let e = this._attribute();
			i = this._type_decl(), this._setTypeAttributes(i, e);
		}
		return this._updateNode(new _s(r.toString(), i, t, n, null), e);
	}
	_override_decl() {
		if (!this._match(K.keywords.override)) return null;
		let e = this._consume(K.tokens.name, "Expected variable name"), t = null;
		if (this._match(K.tokens.colon)) {
			let e = this._attribute();
			t = this._type_decl(), this._setTypeAttributes(t, e);
		}
		return this._updateNode(new vs(e.toString(), t, null));
	}
	_diagnostic() {
		this._consume(K.tokens.paren_left, "Expected '('");
		let e = this._consume(K.tokens.ident, "Expected severity control name.");
		this._consume(K.tokens.comma, "Expected ','");
		let t = this._consume(K.tokens.ident, "Expected diagnostic rule name.").toString();
		return this._match(K.tokens.period) && (t += `.${this._consume(K.tokens.ident, "Expected diagnostic message.").toString()}`), this._consume(K.tokens.paren_right, "Expected ')'"), this._updateNode(new Ms(e.toString(), t));
	}
	_enable_directive() {
		let e = this._consume(K.tokens.ident, "identity expected.");
		return this._updateNode(new As(e.toString()));
	}
	_requires_directive() {
		let e = [this._consume(K.tokens.ident, "identity expected.").toString()];
		for (; this._match(K.tokens.comma);) {
			let t = this._consume(K.tokens.ident, "identity expected.");
			e.push(t.toString());
		}
		return this._updateNode(new js(e));
	}
	_type_alias() {
		let e = this._consume(K.tokens.ident, "identity expected.");
		this._consume(K.tokens.equal, "Expected '=' for type alias.");
		let t = this._type_decl();
		if (t === null) throw this._error(this._peek(), "Expected Type for Alias.");
		this._context.aliases.has(t.name) && (t = this._context.aliases.get(t.name).type);
		let n = this._updateNode(new Ns(e.toString(), t));
		return this._context.aliases.set(n.name, n), n;
	}
	_type_decl() {
		if (this._check([
			K.tokens.ident,
			...K.texel_format,
			K.keywords.bool,
			K.keywords.f32,
			K.keywords.i32,
			K.keywords.u32
		])) {
			let e = this._advance().toString();
			if (this._context.structs.has(e)) return this._context.structs.get(e) ?? null;
			if (this._context.aliases.has(e)) return this._context.aliases.get(e)?.type ?? null;
			if (!this._getType(e)) {
				let t = this._updateNode(new Ls(e));
				return this._forwardTypeCount++, t;
			}
			return this._updateNode(new L(e));
		}
		let e = this._texture_sampler_types();
		if (e) return e;
		if (this._check(K.template_types)) {
			let e = this._advance().toString(), t = null, n = null;
			return this._match(K.tokens.less_than) && (t = this._type_decl(), n = null, this._match(K.tokens.comma) && (n = this._consume(K.access_mode, "Expected access_mode for pointer").toString()), this._consume(K.tokens.greater_than, "Expected '>' for type.")), this._updateNode(new R(e, t, n));
		}
		if (this._match(K.keywords.ptr)) {
			let e = this._previous().toString();
			this._consume(K.tokens.less_than, "Expected '<' for pointer.");
			let t = this._consume(K.storage_class, "Expected storage_class for pointer");
			this._consume(K.tokens.comma, "Expected ',' for pointer.");
			let n = this._type_decl(), r = null;
			return this._match(K.tokens.comma) && (r = this._consume(K.access_mode, "Expected access_mode for pointer").toString()), this._consume(K.tokens.greater_than, "Expected '>' for pointer."), this._updateNode(new zs(e, t.toString(), n, r));
		}
		let t = this._attribute();
		if (this._match(K.keywords.array)) {
			let e = null, n = -1, r = this._previous(), i = null;
			if (this._match(K.tokens.less_than)) {
				e = this._type_decl(), this._context.aliases.has(e.name) && (e = this._context.aliases.get(e.name).type);
				let t = "";
				if (this._match(K.tokens.comma)) {
					i = this._shift_expression();
					try {
						t = i.constEvaluate(this._exec).toString(), i = null;
					} catch {
						t = "1";
					}
				}
				this._consume(K.tokens.greater_than, "Expected '>' for array."), n = t ? parseInt(t) : 0;
			}
			let a = this._updateNode(new Bs(r.toString(), t, e, n));
			return i && this._deferArrayCountEval.push({
				arrayType: a,
				countNode: i
			}), a;
		}
		return null;
	}
	_texture_sampler_types() {
		if (this._match(K.sampler_type) || this._match(K.depth_texture_type)) return this._updateNode(new Vs(this._previous().toString(), null, null));
		if (this._match(K.sampled_texture_type) || this._match(K.multisampled_texture_type)) {
			let e = this._previous();
			this._consume(K.tokens.less_than, "Expected '<' for sampler type.");
			let t = this._type_decl();
			return this._consume(K.tokens.greater_than, "Expected '>' for sampler type."), this._updateNode(new Vs(e.toString(), t, null));
		}
		if (this._match(K.storage_texture_type)) {
			let e = this._previous();
			this._consume(K.tokens.less_than, "Expected '<' for sampler type.");
			let t = this._consume(K.texel_format, "Invalid texel format.").toString();
			this._consume(K.tokens.comma, "Expected ',' after texel format.");
			let n = this._consume(K.access_mode, "Expected access mode for storage texture type.").toString();
			return this._consume(K.tokens.greater_than, "Expected '>' for sampler type."), this._updateNode(new Vs(e.toString(), t, n));
		}
		return null;
	}
	_setTypeAttributes(e, t) {
		e === null || t === null || e.isStruct || (e.attributes = t);
	}
	_attribute() {
		let e = [];
		for (; this._match(K.tokens.attr);) {
			let t = this._consume(K.attribute_name, "Expected attribute name"), n = this._updateNode(new ac(t.toString(), null));
			if (this._match(K.tokens.paren_left)) {
				if (n.value = this._consume(K.literal_or_ident, "Expected attribute value").toString(), this._check(K.tokens.comma)) {
					this._advance();
					do {
						let e = this._consume(K.literal_or_ident, "Expected attribute value").toString();
						Array.isArray(n.value) || (n.value = [n.value]), n.value.push(e);
					} while (this._match(K.tokens.comma));
				}
				this._consume(K.tokens.paren_right, "Expected ')'");
			}
			e.push(n);
		}
		return e.length === 0 ? null : e;
	}
}, Hc = class extends kc {
	constructor(e) {
		super(), e !== void 0 && this.update(e);
	}
	update(e) {
		let t = new Vc().parse(e);
		this.updateAST(t);
	}
}, Uc = /* @__PURE__ */ new Set([
	"dpdx",
	"dpdxCoarse",
	"dpdxFine",
	"dpdy",
	"dpdyCoarse",
	"dpdyFine",
	"fwidth",
	"fwidthCoarse",
	"fwidthFine"
]), Wc = /* @__PURE__ */ new Set(["textureSample", "textureSampleBias"]);
[...Uc, ...Wc];
var Gc, Kc;
((e) => {
	e[e.Running = 0] = "Running", e[e.AtBarrier = 1] = "AtBarrier", e[e.Done = 2] = "Done";
})(Gc ||= {}), ((e) => {
	e[e.Running = 0] = "Running", e[e.AtRendezvous = 1] = "AtRendezvous", e[e.Done = 2] = "Done";
})(Kc ||= {});
var qc = /* @__PURE__ */ new Set([
	"atomicAdd",
	"atomicSub",
	"atomicMax",
	"atomicMin",
	"atomicAnd",
	"atomicOr",
	"atomicXor",
	"atomicExchange",
	"atomicCompareExchangeWeak",
	"atomicStore",
	"atomicLoad"
]), Jc = /* @__PURE__ */ new Set([
	"workgroupBarrier",
	"storageBarrier",
	"textureBarrier"
]);
[...qc, ...Jc];
var Yc;
((e) => {
	e[e.ExpensiveBuiltinInLoop = 1] = "ExpensiveBuiltinInLoop", e[e.CostlyArithmeticInLoop = 2] = "CostlyArithmeticInLoop", e[e.LoopInvariantExpression = 3] = "LoopInvariantExpression", e[e.AtomicInLoop = 4] = "AtomicInLoop", e[e.BarrierInLoop = 5] = "BarrierInLoop", e[e.AtomicStorageRead = 6] = "AtomicStorageRead", e[e.WorkgroupArrayThreadPrivate = 7] = "WorkgroupArrayThreadPrivate", e[e.WorkgroupStorageOversized = 8] = "WorkgroupStorageOversized", e[e.SerialScanEmulation = 9] = "SerialScanEmulation";
})(Yc ||= {}), Yc.ExpensiveBuiltinInLoop, Yc.CostlyArithmeticInLoop, Yc.LoopInvariantExpression, Yc.AtomicInLoop, Yc.BarrierInLoop, Yc.AtomicStorageRead, Yc.WorkgroupArrayThreadPrivate, Yc.WorkgroupStorageOversized, Yc.SerialScanEmulation;
// node_modules/@luma.gl/shadertools/dist/lib/wgsl/get-shader-layout-wgsl.js
function Xc(e) {
	let t = {
		attributes: [],
		bindings: []
	}, n;
	try {
		n = Qc(e);
	} catch (e) {
		return D.error(e.message)(), t;
	}
	for (let e of n.uniforms) {
		let n = [];
		for (let t of e.type?.members || []) n.push({
			name: t.name,
			type: Zc(t.type)
		});
		t.bindings.push({
			type: "uniform",
			name: e.name,
			group: e.group,
			location: e.binding,
			members: n
		});
	}
	for (let e of n.textures) t.bindings.push({
		type: "texture",
		name: e.name,
		group: e.group,
		location: e.binding
	});
	for (let e of n.samplers) t.bindings.push({
		type: "sampler",
		name: e.name,
		group: e.group,
		location: e.binding
	});
	let r = n.entry.vertex[0], i = r?.inputs.length || 0;
	for (let e = 0; e < i; e++) {
		let n = r.inputs[e];
		if (n.locationType === "location") {
			let e = Zc(n.type);
			t.attributes.push({
				name: n.name,
				location: Number(n.location),
				type: e
			});
		}
	}
	return t;
}
function Zc(e) {
	return e.format ? `${e.name}<${e.format.name}>` : e.name;
}
function Qc(e) {
	try {
		return new Hc(e);
	} catch (e) {
		if (e instanceof Error) throw e;
		let t = "WGSL parse error";
		throw typeof e == "object" && e?.message && (t += `: ${e.message} `), typeof e == "object" && e?.token && (t += e.token.line || ""), Error(t, { cause: e });
	}
}
// node_modules/@math.gl/core/dist/lib/common.js
globalThis.mathgl = globalThis.mathgl || { config: {
	EPSILON: 1e-12,
	debug: !1,
	precision: 4,
	printTypes: !1,
	printDegrees: !1,
	printRowMajor: !0,
	_cartographicRadians: !1
} };
var $c = globalThis.mathgl.config;
function el(e, { precision: t = $c.precision } = {}) {
	return e = al(e), `${parseFloat(e.toPrecision(t))}`;
}
function tl(e) {
	return Array.isArray(e) || ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function nl(e, t, n) {
	return sl(e, (e) => Math.max(t, Math.min(n, e)));
}
function rl(e, t, n) {
	return tl(e) ? e.map((e, r) => rl(e, t[r], n)) : n * t + (1 - n) * e;
}
function il(e, t, n) {
	let r = $c.EPSILON;
	n && ($c.EPSILON = n);
	try {
		if (e === t) return !0;
		if (tl(e) && tl(t)) {
			if (e.length !== t.length) return !1;
			for (let n = 0; n < e.length; ++n) if (!il(e[n], t[n])) return !1;
			return !0;
		}
		return e && e.equals ? e.equals(t) : t && t.equals ? t.equals(e) : typeof e == "number" && typeof t == "number" && Math.abs(e - t) <= $c.EPSILON * Math.max(1, Math.abs(e), Math.abs(t));
	} finally {
		$c.EPSILON = r;
	}
}
function al(e) {
	return Math.round(e / $c.EPSILON) * $c.EPSILON;
}
function ol(e) {
	return e.clone ? e.clone() : Array(e.length);
}
function sl(e, t, n) {
	if (tl(e)) {
		let r = e;
		n ||= ol(r);
		for (let i = 0; i < n.length && i < r.length; ++i) {
			let r = typeof e == "number" ? e : e[i];
			n[i] = t(r, i, n);
		}
		return n;
	}
	return t(e);
}
// node_modules/@math.gl/core/dist/classes/base/math-array.js
var cl = class extends Array {
	clone() {
		return new this.constructor().copy(this);
	}
	fromArray(e, t = 0) {
		for (let n = 0; n < this.ELEMENTS; ++n) this[n] = e[n + t];
		return this.check();
	}
	toArray(e = [], t = 0) {
		for (let n = 0; n < this.ELEMENTS; ++n) e[t + n] = this[n];
		return e;
	}
	toObject(e) {
		return e;
	}
	from(e) {
		return Array.isArray(e) ? this.copy(e) : this.fromObject(e);
	}
	to(e) {
		return e === this ? this : tl(e) ? this.toArray(e) : this.toObject(e);
	}
	toTarget(e) {
		return e ? this.to(e) : this;
	}
	toFloat32Array() {
		return new Float32Array(this);
	}
	toString() {
		return this.formatString($c);
	}
	formatString(e) {
		let t = "";
		for (let n = 0; n < this.ELEMENTS; ++n) t += (n > 0 ? ", " : "") + el(this[n], e);
		return `${e.printTypes ? this.constructor.name : ""}[${t}]`;
	}
	equals(e) {
		if (!e || this.length !== e.length) return !1;
		for (let t = 0; t < this.ELEMENTS; ++t) if (!il(this[t], e[t])) return !1;
		return !0;
	}
	exactEquals(e) {
		if (!e || this.length !== e.length) return !1;
		for (let t = 0; t < this.ELEMENTS; ++t) if (this[t] !== e[t]) return !1;
		return !0;
	}
	negate() {
		for (let e = 0; e < this.ELEMENTS; ++e) this[e] = -this[e];
		return this.check();
	}
	lerp(e, t, n) {
		if (n === void 0) return this.lerp(this, e, t);
		for (let r = 0; r < this.ELEMENTS; ++r) {
			let i = e[r], a = typeof t == "number" ? t : t[r];
			this[r] = i + n * (a - i);
		}
		return this.check();
	}
	min(e) {
		for (let t = 0; t < this.ELEMENTS; ++t) this[t] = Math.min(e[t], this[t]);
		return this.check();
	}
	max(e) {
		for (let t = 0; t < this.ELEMENTS; ++t) this[t] = Math.max(e[t], this[t]);
		return this.check();
	}
	clamp(e, t) {
		for (let n = 0; n < this.ELEMENTS; ++n) this[n] = Math.min(Math.max(this[n], e[n]), t[n]);
		return this.check();
	}
	add(...e) {
		for (let t of e) for (let e = 0; e < this.ELEMENTS; ++e) this[e] += t[e];
		return this.check();
	}
	subtract(...e) {
		for (let t of e) for (let e = 0; e < this.ELEMENTS; ++e) this[e] -= t[e];
		return this.check();
	}
	scale(e) {
		if (typeof e == "number") for (let t = 0; t < this.ELEMENTS; ++t) this[t] *= e;
		else for (let t = 0; t < this.ELEMENTS && t < e.length; ++t) this[t] *= e[t];
		return this.check();
	}
	multiplyByScalar(e) {
		for (let t = 0; t < this.ELEMENTS; ++t) this[t] *= e;
		return this.check();
	}
	check() {
		if ($c.debug && !this.validate()) throw Error(`math.gl: ${this.constructor.name} some fields set to invalid numbers'`);
		return this;
	}
	validate() {
		let e = this.length === this.ELEMENTS;
		for (let t = 0; t < this.ELEMENTS; ++t) e &&= Number.isFinite(this[t]);
		return e;
	}
	sub(e) {
		return this.subtract(e);
	}
	setScalar(e) {
		for (let t = 0; t < this.ELEMENTS; ++t) this[t] = e;
		return this.check();
	}
	addScalar(e) {
		for (let t = 0; t < this.ELEMENTS; ++t) this[t] += e;
		return this.check();
	}
	subScalar(e) {
		return this.addScalar(-e);
	}
	multiplyScalar(e) {
		for (let t = 0; t < this.ELEMENTS; ++t) this[t] *= e;
		return this.check();
	}
	divideScalar(e) {
		return this.multiplyByScalar(1 / e);
	}
	clampScalar(e, t) {
		for (let n = 0; n < this.ELEMENTS; ++n) this[n] = Math.min(Math.max(this[n], e), t);
		return this.check();
	}
	get elements() {
		return this;
	}
};
// node_modules/@math.gl/core/dist/lib/validators.js
function ll(e, t) {
	if (e.length !== t) return !1;
	for (let t = 0; t < e.length; ++t) if (!Number.isFinite(e[t])) return !1;
	return !0;
}
function ul(e) {
	if (!Number.isFinite(e)) throw Error(`Invalid number ${JSON.stringify(e)}`);
	return e;
}
function dl(e, t, n = "") {
	if ($c.debug && !ll(e, t)) throw Error(`math.gl: ${n} some fields set to invalid numbers'`);
	return e;
}
// node_modules/@math.gl/core/dist/lib/assert.js
function fl(e, t) {
	if (!e) throw Error(`math.gl assertion ${t}`);
}
// node_modules/@math.gl/core/dist/classes/base/vector.js
var pl = class extends cl {
	get x() {
		return this[0];
	}
	set x(e) {
		this[0] = ul(e);
	}
	get y() {
		return this[1];
	}
	set y(e) {
		this[1] = ul(e);
	}
	len() {
		return Math.sqrt(this.lengthSquared());
	}
	magnitude() {
		return this.len();
	}
	lengthSquared() {
		let e = 0;
		for (let t = 0; t < this.ELEMENTS; ++t) e += this[t] * this[t];
		return e;
	}
	magnitudeSquared() {
		return this.lengthSquared();
	}
	distance(e) {
		return Math.sqrt(this.distanceSquared(e));
	}
	distanceSquared(e) {
		let t = 0;
		for (let n = 0; n < this.ELEMENTS; ++n) {
			let r = this[n] - e[n];
			t += r * r;
		}
		return ul(t);
	}
	dot(e) {
		let t = 0;
		for (let n = 0; n < this.ELEMENTS; ++n) t += this[n] * e[n];
		return ul(t);
	}
	normalize() {
		let e = this.magnitude();
		if (e !== 0) for (let t = 0; t < this.ELEMENTS; ++t) this[t] /= e;
		return this.check();
	}
	multiply(...e) {
		for (let t of e) for (let e = 0; e < this.ELEMENTS; ++e) this[e] *= t[e];
		return this.check();
	}
	divide(...e) {
		for (let t of e) for (let e = 0; e < this.ELEMENTS; ++e) this[e] /= t[e];
		return this.check();
	}
	lengthSq() {
		return this.lengthSquared();
	}
	distanceTo(e) {
		return this.distance(e);
	}
	distanceToSquared(e) {
		return this.distanceSquared(e);
	}
	getComponent(e) {
		return fl(e >= 0 && e < this.ELEMENTS, "index is out of range"), ul(this[e]);
	}
	setComponent(e, t) {
		return fl(e >= 0 && e < this.ELEMENTS, "index is out of range"), this[e] = t, this.check();
	}
	addVectors(e, t) {
		return this.copy(e).add(t);
	}
	subVectors(e, t) {
		return this.copy(e).subtract(t);
	}
	multiplyVectors(e, t) {
		return this.copy(e).multiply(t);
	}
	addScaledVector(e, t) {
		return this.add(new this.constructor(e).multiplyScalar(t));
	}
}, ml = typeof Float32Array < "u" ? Float32Array : Array;
// node_modules/@math.gl/core/dist/gl-matrix/vec2.js
function hl() {
	let e = new ml(2);
	return ml != Float32Array && (e[0] = 0, e[1] = 0), e;
}
function gl(e, t, n) {
	return e[0] = t[0] + n[0], e[1] = t[1] + n[1], e;
}
function _l(e, t) {
	return e[0] = -t[0], e[1] = -t[1], e;
}
function vl(e, t, n, r) {
	let i = t[0], a = t[1];
	return e[0] = i + r * (n[0] - i), e[1] = a + r * (n[1] - a), e;
}
function yl(e, t, n) {
	let r = t[0], i = t[1];
	return e[0] = n[0] * r + n[4] * i + n[12], e[1] = n[1] * r + n[5] * i + n[13], e;
}
(function() {
	let e = hl();
	return function(t, n, r, i, a, o) {
		let s, c;
		for (n ||= 2, r ||= 0, c = i ? Math.min(i * n + r, t.length) : t.length, s = r; s < c; s += n) e[0] = t[s], e[1] = t[s + 1], a(e, e, o), t[s] = e[0], t[s + 1] = e[1];
		return t;
	};
})();
// node_modules/@math.gl/core/dist/lib/gl-matrix-extras.js
function bl(e, t, n) {
	let r = t[0], i = t[1], a = n[3] * r + n[7] * i || 1;
	return e[0] = (n[0] * r + n[4] * i) / a, e[1] = (n[1] * r + n[5] * i) / a, e;
}
function xl(e, t, n) {
	let r = t[0], i = t[1], a = t[2], o = n[3] * r + n[7] * i + n[11] * a || 1;
	return e[0] = (n[0] * r + n[4] * i + n[8] * a) / o, e[1] = (n[1] * r + n[5] * i + n[9] * a) / o, e[2] = (n[2] * r + n[6] * i + n[10] * a) / o, e;
}
function Sl(e, t, n) {
	let r = t[0], i = t[1];
	return e[0] = n[0] * r + n[2] * i, e[1] = n[1] * r + n[3] * i, e[2] = t[2], e;
}
// node_modules/@math.gl/core/dist/gl-matrix/vec3.js
function Cl() {
	let e = new ml(3);
	return ml != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0), e;
}
function wl(e, t, n) {
	return e[0] = t[0] - n[0], e[1] = t[1] - n[1], e[2] = t[2] - n[2], e;
}
function Tl(e, t) {
	return e[0] = -t[0], e[1] = -t[1], e[2] = -t[2], e;
}
function El(e, t) {
	return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
}
function Dl(e, t, n) {
	let r = t[0], i = t[1], a = t[2], o = n[0], s = n[1], c = n[2];
	return e[0] = i * c - a * s, e[1] = a * o - r * c, e[2] = r * s - i * o, e;
}
function Ol(e, t, n) {
	let r = t[0], i = t[1], a = t[2], o = n[3] * r + n[7] * i + n[11] * a + n[15];
	return o ||= 1, e[0] = (n[0] * r + n[4] * i + n[8] * a + n[12]) / o, e[1] = (n[1] * r + n[5] * i + n[9] * a + n[13]) / o, e[2] = (n[2] * r + n[6] * i + n[10] * a + n[14]) / o, e;
}
function kl(e, t, n) {
	let r = t[0], i = t[1], a = t[2];
	return e[0] = r * n[0] + i * n[3] + a * n[6], e[1] = r * n[1] + i * n[4] + a * n[7], e[2] = r * n[2] + i * n[5] + a * n[8], e;
}
function Al(e, t, n) {
	let r = n[0], i = n[1], a = n[2], o = n[3], s = t[0], c = t[1], l = t[2], u = i * l - a * c, d = a * s - r * l, f = r * c - i * s, p = i * f - a * d, m = a * u - r * f, h = r * d - i * u, g = o * 2;
	return u *= g, d *= g, f *= g, p *= 2, m *= 2, h *= 2, e[0] = s + u + p, e[1] = c + d + m, e[2] = l + f + h, e;
}
function jl(e, t, n, r) {
	let i = [], a = [];
	return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[0], a[1] = i[1] * Math.cos(r) - i[2] * Math.sin(r), a[2] = i[1] * Math.sin(r) + i[2] * Math.cos(r), e[0] = a[0] + n[0], e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
}
function Ml(e, t, n, r) {
	let i = [], a = [];
	return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[2] * Math.sin(r) + i[0] * Math.cos(r), a[1] = i[1], a[2] = i[2] * Math.cos(r) - i[0] * Math.sin(r), e[0] = a[0] + n[0], e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
}
function Nl(e, t, n, r) {
	let i = [], a = [];
	return i[0] = t[0] - n[0], i[1] = t[1] - n[1], i[2] = t[2] - n[2], a[0] = i[0] * Math.cos(r) - i[1] * Math.sin(r), a[1] = i[0] * Math.sin(r) + i[1] * Math.cos(r), a[2] = i[2], e[0] = a[0] + n[0], e[1] = a[1] + n[1], e[2] = a[2] + n[2], e;
}
function Pl(e, t) {
	let n = e[0], r = e[1], i = e[2], a = t[0], o = t[1], s = t[2], c = Math.sqrt((n * n + r * r + i * i) * (a * a + o * o + s * s)), l = c && El(e, t) / c;
	return Math.acos(Math.min(Math.max(l, -1), 1));
}
var Fl = wl;
(function() {
	let e = Cl();
	return function(t, n, r, i, a, o) {
		let s, c;
		for (n ||= 3, r ||= 0, c = i ? Math.min(i * n + r, t.length) : t.length, s = r; s < c; s += n) e[0] = t[s], e[1] = t[s + 1], e[2] = t[s + 2], a(e, e, o), t[s] = e[0], t[s + 1] = e[1], t[s + 2] = e[2];
		return t;
	};
})();
// node_modules/@math.gl/core/dist/classes/vector3.js
var Il = [
	0,
	0,
	0
], Ll, Rl = class e extends pl {
	static get ZERO() {
		return Ll || (Ll = new e(0, 0, 0), Object.freeze(Ll)), Ll;
	}
	constructor(e = 0, t = 0, n = 0) {
		super(-0, -0, -0), arguments.length === 1 && tl(e) ? this.copy(e) : ($c.debug && (ul(e), ul(t), ul(n)), this[0] = e, this[1] = t, this[2] = n);
	}
	set(e, t, n) {
		return this[0] = e, this[1] = t, this[2] = n, this.check();
	}
	copy(e) {
		return this[0] = e[0], this[1] = e[1], this[2] = e[2], this.check();
	}
	fromObject(e) {
		return $c.debug && (ul(e.x), ul(e.y), ul(e.z)), this[0] = e.x, this[1] = e.y, this[2] = e.z, this.check();
	}
	toObject(e) {
		return e.x = this[0], e.y = this[1], e.z = this[2], e;
	}
	get ELEMENTS() {
		return 3;
	}
	get z() {
		return this[2];
	}
	set z(e) {
		this[2] = ul(e);
	}
	angle(e) {
		return Pl(this, e);
	}
	cross(e) {
		return Dl(this, this, e), this.check();
	}
	rotateX({ radians: e, origin: t = Il }) {
		return jl(this, this, t, e), this.check();
	}
	rotateY({ radians: e, origin: t = Il }) {
		return Ml(this, this, t, e), this.check();
	}
	rotateZ({ radians: e, origin: t = Il }) {
		return Nl(this, this, t, e), this.check();
	}
	transform(e) {
		return this.transformAsPoint(e);
	}
	transformAsPoint(e) {
		return Ol(this, this, e), this.check();
	}
	transformAsVector(e) {
		return xl(this, this, e), this.check();
	}
	transformByMatrix3(e) {
		return kl(this, this, e), this.check();
	}
	transformByMatrix2(e) {
		return Sl(this, this, e), this.check();
	}
	transformByQuaternion(e) {
		return Al(this, this, e), this.check();
	}
}, zl = class extends cl {
	toString() {
		let e = "[";
		if ($c.printRowMajor) {
			e += "row-major:";
			for (let t = 0; t < this.RANK; ++t) for (let n = 0; n < this.RANK; ++n) e += ` ${this[n * this.RANK + t]}`;
		} else {
			e += "column-major:";
			for (let t = 0; t < this.ELEMENTS; ++t) e += ` ${this[t]}`;
		}
		return e += "]", e;
	}
	getElementIndex(e, t) {
		return t * this.RANK + e;
	}
	getElement(e, t) {
		return this[t * this.RANK + e];
	}
	setElement(e, t, n) {
		return this[t * this.RANK + e] = ul(n), this;
	}
	getColumn(e, t = Array(this.RANK).fill(-0)) {
		let n = e * this.RANK;
		for (let e = 0; e < this.RANK; ++e) t[e] = this[n + e];
		return t;
	}
	setColumn(e, t) {
		let n = e * this.RANK;
		for (let e = 0; e < this.RANK; ++e) this[n + e] = t[e];
		return this;
	}
};
// node_modules/@math.gl/core/dist/gl-matrix/mat4.js
function Bl(e) {
	return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
}
function Vl(e, t) {
	if (e === t) {
		let n = t[1], r = t[2], i = t[3], a = t[6], o = t[7], s = t[11];
		e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = n, e[6] = t[9], e[7] = t[13], e[8] = r, e[9] = a, e[11] = t[14], e[12] = i, e[13] = o, e[14] = s;
	} else e[0] = t[0], e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = t[1], e[5] = t[5], e[6] = t[9], e[7] = t[13], e[8] = t[2], e[9] = t[6], e[10] = t[10], e[11] = t[14], e[12] = t[3], e[13] = t[7], e[14] = t[11], e[15] = t[15];
	return e;
}
function Hl(e, t) {
	let n = t[0], r = t[1], i = t[2], a = t[3], o = t[4], s = t[5], c = t[6], l = t[7], u = t[8], d = t[9], f = t[10], p = t[11], m = t[12], h = t[13], g = t[14], _ = t[15], v = n * s - r * o, y = n * c - i * o, b = n * l - a * o, x = r * c - i * s, S = r * l - a * s, C = i * l - a * c, w = u * h - d * m, ee = u * g - f * m, te = u * _ - p * m, ne = d * g - f * h, re = d * _ - p * h, ie = f * _ - p * g, T = v * ie - y * re + b * ne + x * te - S * ee + C * w;
	return T ? (T = 1 / T, e[0] = (s * ie - c * re + l * ne) * T, e[1] = (i * re - r * ie - a * ne) * T, e[2] = (h * C - g * S + _ * x) * T, e[3] = (f * S - d * C - p * x) * T, e[4] = (c * te - o * ie - l * ee) * T, e[5] = (n * ie - i * te + a * ee) * T, e[6] = (g * b - m * C - _ * y) * T, e[7] = (u * C - f * b + p * y) * T, e[8] = (o * re - s * te + l * w) * T, e[9] = (r * te - n * re - a * w) * T, e[10] = (m * S - h * b + _ * v) * T, e[11] = (d * b - u * S - p * v) * T, e[12] = (s * ee - o * ne - c * w) * T, e[13] = (n * ne - r * ee + i * w) * T, e[14] = (h * y - m * x - g * v) * T, e[15] = (u * x - d * y + f * v) * T, e) : null;
}
function Ul(e) {
	let t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8], u = e[9], d = e[10], f = e[11], p = e[12], m = e[13], h = e[14], g = e[15], _ = t * o - n * a, v = t * s - r * a, y = n * s - r * o, b = l * m - u * p, x = l * h - d * p, S = u * h - d * m, C = t * S - n * x + r * b, w = a * S - o * x + s * b, ee = l * y - u * v + d * _, te = p * y - m * v + h * _;
	return c * C - i * w + g * ee - f * te;
}
function Wl(e, t, n) {
	let r = t[0], i = t[1], a = t[2], o = t[3], s = t[4], c = t[5], l = t[6], u = t[7], d = t[8], f = t[9], p = t[10], m = t[11], h = t[12], g = t[13], _ = t[14], v = t[15], y = n[0], b = n[1], x = n[2], S = n[3];
	return e[0] = y * r + b * s + x * d + S * h, e[1] = y * i + b * c + x * f + S * g, e[2] = y * a + b * l + x * p + S * _, e[3] = y * o + b * u + x * m + S * v, y = n[4], b = n[5], x = n[6], S = n[7], e[4] = y * r + b * s + x * d + S * h, e[5] = y * i + b * c + x * f + S * g, e[6] = y * a + b * l + x * p + S * _, e[7] = y * o + b * u + x * m + S * v, y = n[8], b = n[9], x = n[10], S = n[11], e[8] = y * r + b * s + x * d + S * h, e[9] = y * i + b * c + x * f + S * g, e[10] = y * a + b * l + x * p + S * _, e[11] = y * o + b * u + x * m + S * v, y = n[12], b = n[13], x = n[14], S = n[15], e[12] = y * r + b * s + x * d + S * h, e[13] = y * i + b * c + x * f + S * g, e[14] = y * a + b * l + x * p + S * _, e[15] = y * o + b * u + x * m + S * v, e;
}
function Gl(e, t, n) {
	let r = n[0], i = n[1], a = n[2], o, s, c, l, u, d, f, p, m, h, g, _;
	return t === e ? (e[12] = t[0] * r + t[4] * i + t[8] * a + t[12], e[13] = t[1] * r + t[5] * i + t[9] * a + t[13], e[14] = t[2] * r + t[6] * i + t[10] * a + t[14], e[15] = t[3] * r + t[7] * i + t[11] * a + t[15]) : (o = t[0], s = t[1], c = t[2], l = t[3], u = t[4], d = t[5], f = t[6], p = t[7], m = t[8], h = t[9], g = t[10], _ = t[11], e[0] = o, e[1] = s, e[2] = c, e[3] = l, e[4] = u, e[5] = d, e[6] = f, e[7] = p, e[8] = m, e[9] = h, e[10] = g, e[11] = _, e[12] = o * r + u * i + m * a + t[12], e[13] = s * r + d * i + h * a + t[13], e[14] = c * r + f * i + g * a + t[14], e[15] = l * r + p * i + _ * a + t[15]), e;
}
function Kl(e, t, n) {
	let r = n[0], i = n[1], a = n[2];
	return e[0] = t[0] * r, e[1] = t[1] * r, e[2] = t[2] * r, e[3] = t[3] * r, e[4] = t[4] * i, e[5] = t[5] * i, e[6] = t[6] * i, e[7] = t[7] * i, e[8] = t[8] * a, e[9] = t[9] * a, e[10] = t[10] * a, e[11] = t[11] * a, e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e;
}
function ql(e, t, n, r) {
	let i = r[0], a = r[1], o = r[2], s = Math.sqrt(i * i + a * a + o * o), c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, ee, te, ne, re, ie, T, ae;
	return s < 1e-6 ? null : (s = 1 / s, i *= s, a *= s, o *= s, l = Math.sin(n), c = Math.cos(n), u = 1 - c, d = t[0], f = t[1], p = t[2], m = t[3], h = t[4], g = t[5], _ = t[6], v = t[7], y = t[8], b = t[9], x = t[10], S = t[11], C = i * i * u + c, w = a * i * u + o * l, ee = o * i * u - a * l, te = i * a * u - o * l, ne = a * a * u + c, re = o * a * u + i * l, ie = i * o * u + a * l, T = a * o * u - i * l, ae = o * o * u + c, e[0] = d * C + h * w + y * ee, e[1] = f * C + g * w + b * ee, e[2] = p * C + _ * w + x * ee, e[3] = m * C + v * w + S * ee, e[4] = d * te + h * ne + y * re, e[5] = f * te + g * ne + b * re, e[6] = p * te + _ * ne + x * re, e[7] = m * te + v * ne + S * re, e[8] = d * ie + h * T + y * ae, e[9] = f * ie + g * T + b * ae, e[10] = p * ie + _ * T + x * ae, e[11] = m * ie + v * T + S * ae, t !== e && (e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e);
}
function Jl(e, t, n) {
	let r = Math.sin(n), i = Math.cos(n), a = t[4], o = t[5], s = t[6], c = t[7], l = t[8], u = t[9], d = t[10], f = t[11];
	return t !== e && (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[4] = a * i + l * r, e[5] = o * i + u * r, e[6] = s * i + d * r, e[7] = c * i + f * r, e[8] = l * i - a * r, e[9] = u * i - o * r, e[10] = d * i - s * r, e[11] = f * i - c * r, e;
}
function Yl(e, t, n) {
	let r = Math.sin(n), i = Math.cos(n), a = t[0], o = t[1], s = t[2], c = t[3], l = t[8], u = t[9], d = t[10], f = t[11];
	return t !== e && (e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = a * i - l * r, e[1] = o * i - u * r, e[2] = s * i - d * r, e[3] = c * i - f * r, e[8] = a * r + l * i, e[9] = o * r + u * i, e[10] = s * r + d * i, e[11] = c * r + f * i, e;
}
function Xl(e, t, n) {
	let r = Math.sin(n), i = Math.cos(n), a = t[0], o = t[1], s = t[2], c = t[3], l = t[4], u = t[5], d = t[6], f = t[7];
	return t !== e && (e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = a * i + l * r, e[1] = o * i + u * r, e[2] = s * i + d * r, e[3] = c * i + f * r, e[4] = l * i - a * r, e[5] = u * i - o * r, e[6] = d * i - s * r, e[7] = f * i - c * r, e;
}
function Zl(e, t) {
	let n = t[0], r = t[1], i = t[2], a = t[3], o = n + n, s = r + r, c = i + i, l = n * o, u = r * o, d = r * s, f = i * o, p = i * s, m = i * c, h = a * o, g = a * s, _ = a * c;
	return e[0] = 1 - d - m, e[1] = u + _, e[2] = f - g, e[3] = 0, e[4] = u - _, e[5] = 1 - l - m, e[6] = p + h, e[7] = 0, e[8] = f + g, e[9] = p - h, e[10] = 1 - l - d, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
}
function Ql(e, t, n, r, i, a, o) {
	let s = 1 / (n - t), c = 1 / (i - r), l = 1 / (a - o);
	return e[0] = a * 2 * s, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = a * 2 * c, e[6] = 0, e[7] = 0, e[8] = (n + t) * s, e[9] = (i + r) * c, e[10] = (o + a) * l, e[11] = -1, e[12] = 0, e[13] = 0, e[14] = o * a * 2 * l, e[15] = 0, e;
}
function $l(e, t, n, r, i) {
	let a = 1 / Math.tan(t / 2);
	if (e[0] = a / n, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = a, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[11] = -1, e[12] = 0, e[13] = 0, e[15] = 0, i != null && i !== Infinity) {
		let t = 1 / (r - i);
		e[10] = (i + r) * t, e[14] = 2 * i * r * t;
	} else e[10] = -1, e[14] = -2 * r;
	return e;
}
var eu = $l;
function tu(e, t, n, r, i, a, o) {
	let s = 1 / (t - n), c = 1 / (r - i), l = 1 / (a - o);
	return e[0] = -2 * s, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = -2 * c, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 2 * l, e[11] = 0, e[12] = (t + n) * s, e[13] = (i + r) * c, e[14] = (o + a) * l, e[15] = 1, e;
}
var nu = tu;
function ru(e, t, n, r) {
	let i, a, o, s, c, l, u, d, f, p, m = t[0], h = t[1], g = t[2], _ = r[0], v = r[1], y = r[2], b = n[0], x = n[1], S = n[2];
	return Math.abs(m - b) < 1e-6 && Math.abs(h - x) < 1e-6 && Math.abs(g - S) < 1e-6 ? Bl(e) : (d = m - b, f = h - x, p = g - S, i = 1 / Math.sqrt(d * d + f * f + p * p), d *= i, f *= i, p *= i, a = v * p - y * f, o = y * d - _ * p, s = _ * f - v * d, i = Math.sqrt(a * a + o * o + s * s), i ? (i = 1 / i, a *= i, o *= i, s *= i) : (a = 0, o = 0, s = 0), c = f * s - p * o, l = p * a - d * s, u = d * o - f * a, i = Math.sqrt(c * c + l * l + u * u), i ? (i = 1 / i, c *= i, l *= i, u *= i) : (c = 0, l = 0, u = 0), e[0] = a, e[1] = c, e[2] = d, e[3] = 0, e[4] = o, e[5] = l, e[6] = f, e[7] = 0, e[8] = s, e[9] = u, e[10] = p, e[11] = 0, e[12] = -(a * m + o * h + s * g), e[13] = -(c * m + l * h + u * g), e[14] = -(d * m + f * h + p * g), e[15] = 1, e);
}
// node_modules/@math.gl/core/dist/gl-matrix/vec4.js
function iu() {
	let e = new ml(4);
	return ml != Float32Array && (e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0), e;
}
function au(e, t, n) {
	return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e;
}
function ou(e, t, n) {
	let r = t[0], i = t[1], a = t[2], o = t[3];
	return e[0] = n[0] * r + n[4] * i + n[8] * a + n[12] * o, e[1] = n[1] * r + n[5] * i + n[9] * a + n[13] * o, e[2] = n[2] * r + n[6] * i + n[10] * a + n[14] * o, e[3] = n[3] * r + n[7] * i + n[11] * a + n[15] * o, e;
}
(function() {
	let e = iu();
	return function(t, n, r, i, a, o) {
		let s, c;
		for (n ||= 4, r ||= 0, c = i ? Math.min(i * n + r, t.length) : t.length, s = r; s < c; s += n) e[0] = t[s], e[1] = t[s + 1], e[2] = t[s + 2], e[3] = t[s + 3], a(e, e, o), t[s] = e[0], t[s + 1] = e[1], t[s + 2] = e[2], t[s + 3] = e[3];
		return t;
	};
})();
// node_modules/@math.gl/core/dist/classes/matrix4.js
var su;
(function(e) {
	e[e.COL0ROW0 = 0] = "COL0ROW0", e[e.COL0ROW1 = 1] = "COL0ROW1", e[e.COL0ROW2 = 2] = "COL0ROW2", e[e.COL0ROW3 = 3] = "COL0ROW3", e[e.COL1ROW0 = 4] = "COL1ROW0", e[e.COL1ROW1 = 5] = "COL1ROW1", e[e.COL1ROW2 = 6] = "COL1ROW2", e[e.COL1ROW3 = 7] = "COL1ROW3", e[e.COL2ROW0 = 8] = "COL2ROW0", e[e.COL2ROW1 = 9] = "COL2ROW1", e[e.COL2ROW2 = 10] = "COL2ROW2", e[e.COL2ROW3 = 11] = "COL2ROW3", e[e.COL3ROW0 = 12] = "COL3ROW0", e[e.COL3ROW1 = 13] = "COL3ROW1", e[e.COL3ROW2 = 14] = "COL3ROW2", e[e.COL3ROW3 = 15] = "COL3ROW3";
})(su ||= {});
var cu = 45 * Math.PI / 180, lu = 1, uu = .1, du = 500, fu = Object.freeze([
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1
]), pu = class extends zl {
	static get IDENTITY() {
		return _u();
	}
	static get ZERO() {
		return gu();
	}
	get ELEMENTS() {
		return 16;
	}
	get RANK() {
		return 4;
	}
	get INDICES() {
		return su;
	}
	constructor(e) {
		super(-0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0), arguments.length === 1 && Array.isArray(e) ? this.copy(e) : this.identity();
	}
	copy(e) {
		return this[0] = e[0], this[1] = e[1], this[2] = e[2], this[3] = e[3], this[4] = e[4], this[5] = e[5], this[6] = e[6], this[7] = e[7], this[8] = e[8], this[9] = e[9], this[10] = e[10], this[11] = e[11], this[12] = e[12], this[13] = e[13], this[14] = e[14], this[15] = e[15], this.check();
	}
	set(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
		return this[0] = e, this[1] = t, this[2] = n, this[3] = r, this[4] = i, this[5] = a, this[6] = o, this[7] = s, this[8] = c, this[9] = l, this[10] = u, this[11] = d, this[12] = f, this[13] = p, this[14] = m, this[15] = h, this.check();
	}
	setRowMajor(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
		return this[0] = e, this[1] = i, this[2] = c, this[3] = f, this[4] = t, this[5] = a, this[6] = l, this[7] = p, this[8] = n, this[9] = o, this[10] = u, this[11] = m, this[12] = r, this[13] = s, this[14] = d, this[15] = h, this.check();
	}
	toRowMajor(e) {
		return e[0] = this[0], e[1] = this[4], e[2] = this[8], e[3] = this[12], e[4] = this[1], e[5] = this[5], e[6] = this[9], e[7] = this[13], e[8] = this[2], e[9] = this[6], e[10] = this[10], e[11] = this[14], e[12] = this[3], e[13] = this[7], e[14] = this[11], e[15] = this[15], e;
	}
	identity() {
		return this.copy(fu);
	}
	fromObject(e) {
		return this.check();
	}
	fromQuaternion(e) {
		return Zl(this, e), this.check();
	}
	frustum(e) {
		let { left: t, right: n, bottom: r, top: i, near: a = uu, far: o = du } = e;
		return o === Infinity ? yu(this, t, n, r, i, a) : Ql(this, t, n, r, i, a, o), this.check();
	}
	lookAt(e) {
		let { eye: t, center: n = [
			0,
			0,
			0
		], up: r = [
			0,
			1,
			0
		] } = e;
		return ru(this, t, n, r), this.check();
	}
	ortho(e) {
		let { left: t, right: n, bottom: r, top: i, near: a = uu, far: o = du } = e;
		return nu(this, t, n, r, i, a, o), this.check();
	}
	orthographic(e) {
		let { fovy: t = cu, aspect: n = lu, focalDistance: r = 1, near: i = uu, far: a = du } = e;
		vu(t);
		let o = t / 2, s = r * Math.tan(o), c = s * n;
		return this.ortho({
			left: -c,
			right: c,
			bottom: -s,
			top: s,
			near: i,
			far: a
		});
	}
	perspective(e) {
		let { fovy: t = 45 * Math.PI / 180, aspect: n = 1, near: r = .1, far: i = 500 } = e;
		return vu(t), eu(this, t, n, r, i), this.check();
	}
	determinant() {
		return Ul(this);
	}
	getScale(e = [
		-0,
		-0,
		-0
	]) {
		return e[0] = Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]), e[1] = Math.sqrt(this[4] * this[4] + this[5] * this[5] + this[6] * this[6]), e[2] = Math.sqrt(this[8] * this[8] + this[9] * this[9] + this[10] * this[10]), e;
	}
	getTranslation(e = [
		-0,
		-0,
		-0
	]) {
		return e[0] = this[12], e[1] = this[13], e[2] = this[14], e;
	}
	getRotation(e, t) {
		e ||= [
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0
		], t ||= [
			-0,
			-0,
			-0
		];
		let n = this.getScale(t), r = 1 / n[0], i = 1 / n[1], a = 1 / n[2];
		return e[0] = this[0] * r, e[1] = this[1] * i, e[2] = this[2] * a, e[3] = 0, e[4] = this[4] * r, e[5] = this[5] * i, e[6] = this[6] * a, e[7] = 0, e[8] = this[8] * r, e[9] = this[9] * i, e[10] = this[10] * a, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e;
	}
	getRotationMatrix3(e, t) {
		e ||= [
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0,
			-0
		], t ||= [
			-0,
			-0,
			-0
		];
		let n = this.getScale(t), r = 1 / n[0], i = 1 / n[1], a = 1 / n[2];
		return e[0] = this[0] * r, e[1] = this[1] * i, e[2] = this[2] * a, e[3] = this[4] * r, e[4] = this[5] * i, e[5] = this[6] * a, e[6] = this[8] * r, e[7] = this[9] * i, e[8] = this[10] * a, e;
	}
	transpose() {
		return Vl(this, this), this.check();
	}
	invert() {
		return Hl(this, this), this.check();
	}
	multiplyLeft(e) {
		return Wl(this, e, this), this.check();
	}
	multiplyRight(e) {
		return Wl(this, this, e), this.check();
	}
	rotateX(e) {
		return Jl(this, this, e), this.check();
	}
	rotateY(e) {
		return Yl(this, this, e), this.check();
	}
	rotateZ(e) {
		return Xl(this, this, e), this.check();
	}
	rotateXYZ(e) {
		return this.rotateX(e[0]).rotateY(e[1]).rotateZ(e[2]);
	}
	rotateAxis(e, t) {
		return ql(this, this, e, t), this.check();
	}
	scale(e) {
		return Kl(this, this, Array.isArray(e) ? e : [
			e,
			e,
			e
		]), this.check();
	}
	translate(e) {
		return Gl(this, this, e), this.check();
	}
	transform(e, t) {
		return e.length === 4 ? (t = ou(t || [
			-0,
			-0,
			-0,
			-0
		], e, this), dl(t, 4), t) : this.transformAsPoint(e, t);
	}
	transformAsPoint(e, t) {
		let { length: n } = e, r;
		switch (n) {
			case 2:
				r = yl(t || [-0, -0], e, this);
				break;
			case 3:
				r = Ol(t || [
					-0,
					-0,
					-0
				], e, this);
				break;
			default: throw Error("Illegal vector");
		}
		return dl(r, e.length), r;
	}
	transformAsVector(e, t) {
		let n;
		switch (e.length) {
			case 2:
				n = bl(t || [-0, -0], e, this);
				break;
			case 3:
				n = xl(t || [
					-0,
					-0,
					-0
				], e, this);
				break;
			default: throw Error("Illegal vector");
		}
		return dl(n, e.length), n;
	}
	transformPoint(e, t) {
		return this.transformAsPoint(e, t);
	}
	transformVector(e, t) {
		return this.transformAsPoint(e, t);
	}
	transformDirection(e, t) {
		return this.transformAsVector(e, t);
	}
	makeRotationX(e) {
		return this.identity().rotateX(e);
	}
	makeTranslation(e, t, n) {
		return this.identity().translate([
			e,
			t,
			n
		]);
	}
}, mu, hu;
function gu() {
	return mu || (mu = new pu([
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		0
	]), Object.freeze(mu)), mu;
}
function _u() {
	return hu || (hu = new pu(), Object.freeze(hu)), hu;
}
function vu(e) {
	if (e > Math.PI * 2) throw Error("expected radians");
}
function yu(e, t, n, r, i, a) {
	let o = 2 * a / (n - t), s = 2 * a / (i - r), c = (n + t) / (n - t), l = (i + r) / (i - r), u = -2 * a;
	return e[0] = o, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = s, e[6] = 0, e[7] = 0, e[8] = c, e[9] = l, e[10] = -1, e[11] = -1, e[12] = 0, e[13] = 0, e[14] = u, e[15] = 0, e;
}
// node_modules/@luma.gl/shadertools/dist/modules/math/fp64/fp64-utils.js
function bu(e, t = [], n = 0) {
	let r = Math.fround(e), i = e - r;
	return t[n] = r, t[n + 1] = i, t;
}
function xu(e) {
	return e - Math.fround(e);
}
function Su(e) {
	let t = /* @__PURE__ */ new Float32Array(32);
	for (let n = 0; n < 4; ++n) for (let r = 0; r < 4; ++r) {
		let i = n * 4 + r;
		bu(e[r * 4 + n], t, i * 2);
	}
	return t;
}
var Cu = {
	name: "fp32",
	vs: "#ifdef LUMA_FP32_TAN_PRECISION_WORKAROUND\n\n// All these functions are for substituting tan() function from Intel GPU only\nconst float TWO_PI = 6.2831854820251465;\nconst float PI_2 = 1.5707963705062866;\nconst float PI_16 = 0.1963495463132858;\n\nconst float SIN_TABLE_0 = 0.19509032368659973;\nconst float SIN_TABLE_1 = 0.3826834261417389;\nconst float SIN_TABLE_2 = 0.5555702447891235;\nconst float SIN_TABLE_3 = 0.7071067690849304;\n\nconst float COS_TABLE_0 = 0.9807852506637573;\nconst float COS_TABLE_1 = 0.9238795042037964;\nconst float COS_TABLE_2 = 0.8314695954322815;\nconst float COS_TABLE_3 = 0.7071067690849304;\n\nconst float INVERSE_FACTORIAL_3 = 1.666666716337204e-01; // 1/3!\nconst float INVERSE_FACTORIAL_5 = 8.333333767950535e-03; // 1/5!\nconst float INVERSE_FACTORIAL_7 = 1.9841270113829523e-04; // 1/7!\nconst float INVERSE_FACTORIAL_9 = 2.75573188446287533e-06; // 1/9!\n\nfloat sin_taylor_fp32(float a) {\n  float r, s, t, x;\n\n  if (a == 0.0) {\n    return 0.0;\n  }\n\n  x = -a * a;\n  s = a;\n  r = a;\n\n  r = r * x;\n  t = r * INVERSE_FACTORIAL_3;\n  s = s + t;\n\n  r = r * x;\n  t = r * INVERSE_FACTORIAL_5;\n  s = s + t;\n\n  r = r * x;\n  t = r * INVERSE_FACTORIAL_7;\n  s = s + t;\n\n  r = r * x;\n  t = r * INVERSE_FACTORIAL_9;\n  s = s + t;\n\n  return s;\n}\n\nvoid sincos_taylor_fp32(float a, out float sin_t, out float cos_t) {\n  if (a == 0.0) {\n    sin_t = 0.0;\n    cos_t = 1.0;\n  }\n  sin_t = sin_taylor_fp32(a);\n  cos_t = sqrt(1.0 - sin_t * sin_t);\n}\n\nfloat tan_taylor_fp32(float a) {\n    float sin_a;\n    float cos_a;\n\n    if (a == 0.0) {\n        return 0.0;\n    }\n\n    // 2pi range reduction\n    float z = floor(a / TWO_PI);\n    float r = a - TWO_PI * z;\n\n    float t;\n    float q = floor(r / PI_2 + 0.5);\n    int j = int(q);\n\n    if (j < -2 || j > 2) {\n        return 1.0 / 0.0;\n    }\n\n    t = r - PI_2 * q;\n\n    q = floor(t / PI_16 + 0.5);\n    int k = int(q);\n    int abs_k = int(abs(float(k)));\n\n    if (abs_k > 4) {\n        return 1.0 / 0.0;\n    } else {\n        t = t - PI_16 * q;\n    }\n\n    float u = 0.0;\n    float v = 0.0;\n\n    float sin_t, cos_t;\n    float s, c;\n    sincos_taylor_fp32(t, sin_t, cos_t);\n\n    if (k == 0) {\n        s = sin_t;\n        c = cos_t;\n    } else {\n        if (abs(float(abs_k) - 1.0) < 0.5) {\n            u = COS_TABLE_0;\n            v = SIN_TABLE_0;\n        } else if (abs(float(abs_k) - 2.0) < 0.5) {\n            u = COS_TABLE_1;\n            v = SIN_TABLE_1;\n        } else if (abs(float(abs_k) - 3.0) < 0.5) {\n            u = COS_TABLE_2;\n            v = SIN_TABLE_2;\n        } else if (abs(float(abs_k) - 4.0) < 0.5) {\n            u = COS_TABLE_3;\n            v = SIN_TABLE_3;\n        }\n        if (k > 0) {\n            s = u * sin_t + v * cos_t;\n            c = u * cos_t - v * sin_t;\n        } else {\n            s = u * sin_t - v * cos_t;\n            c = u * cos_t + v * sin_t;\n        }\n    }\n\n    if (j == 0) {\n        sin_a = s;\n        cos_a = c;\n    } else if (j == 1) {\n        sin_a = c;\n        cos_a = -s;\n    } else if (j == -1) {\n        sin_a = -c;\n        cos_a = s;\n    } else {\n        sin_a = -s;\n        cos_a = -c;\n    }\n    return sin_a / cos_a;\n}\n#endif\n\nfloat tan_fp32(float a) {\n#ifdef LUMA_FP32_TAN_PRECISION_WORKAROUND\n  return tan_taylor_fp32(a);\n#else\n  return tan(a);\n#endif\n}\n"
}, wu = {
	name: "fp64arithmetic",
	vs: "\nuniform fp64arithmeticUniforms {\n  uniform float ONE;\n} fp64;\n\n/*\nAbout LUMA_FP64_CODE_ELIMINATION_WORKAROUND\n\nThe purpose of this workaround is to prevent shader compilers from\noptimizing away necessary arithmetic operations by swapping their sequences\nor transform the equation to some 'equivalent' form.\n\nThe method is to multiply an artifical variable, ONE, which will be known to\nthe compiler to be 1 only at runtime. The whole expression is then represented\nas a polynomial with respective to ONE. In the coefficients of all terms, only one a\nand one b should appear\n\nerr = (a + b) * ONE^6 - a * ONE^5 - (a + b) * ONE^4 + a * ONE^3 - b - (a + b) * ONE^2 + a * ONE\n*/\n\n// Divide float number to high and low floats to extend fraction bits\nvec2 split(float a) {\n  const float SPLIT = 4097.0;\n  float t = a * SPLIT;\n#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)\n  float a_hi = t * fp64.ONE - (t - a);\n  float a_lo = a * fp64.ONE - a_hi;\n#else\n  float a_hi = t - (t - a);\n  float a_lo = a - a_hi;\n#endif\n  return vec2(a_hi, a_lo);\n}\n\n// Divide float number again when high float uses too many fraction bits\nvec2 split2(vec2 a) {\n  vec2 b = split(a.x);\n  b.y += a.y;\n  return b;\n}\n\n// Special sum operation when a > b\nvec2 quickTwoSum(float a, float b) {\n#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)\n  float sum = (a + b) * fp64.ONE;\n  float err = b - (sum - a) * fp64.ONE;\n#else\n  float sum = a + b;\n  float err = b - (sum - a);\n#endif\n  return vec2(sum, err);\n}\n\n// General sum operation\nvec2 twoSum(float a, float b) {\n  float s = (a + b);\n#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)\n  float v = (s * fp64.ONE - a) * fp64.ONE;\n  float err = (a - (s - v) * fp64.ONE) * fp64.ONE * fp64.ONE * fp64.ONE + (b - v);\n#else\n  float v = s - a;\n  float err = (a - (s - v)) + (b - v);\n#endif\n  return vec2(s, err);\n}\n\nvec2 twoSub(float a, float b) {\n  float s = (a - b);\n#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)\n  float v = (s * fp64.ONE - a) * fp64.ONE;\n  float err = (a - (s - v) * fp64.ONE) * fp64.ONE * fp64.ONE * fp64.ONE - (b + v);\n#else\n  float v = s - a;\n  float err = (a - (s - v)) - (b + v);\n#endif\n  return vec2(s, err);\n}\n\nvec2 twoSqr(float a) {\n  float prod = a * a;\n  vec2 a_fp64 = split(a);\n#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)\n  float err = ((a_fp64.x * a_fp64.x - prod) * fp64.ONE + 2.0 * a_fp64.x *\n    a_fp64.y * fp64.ONE * fp64.ONE) + a_fp64.y * a_fp64.y * fp64.ONE * fp64.ONE * fp64.ONE;\n#else\n  float err = ((a_fp64.x * a_fp64.x - prod) + 2.0 * a_fp64.x * a_fp64.y) + a_fp64.y * a_fp64.y;\n#endif\n  return vec2(prod, err);\n}\n\nvec2 twoProd(float a, float b) {\n  float prod = a * b;\n  vec2 a_fp64 = split(a);\n  vec2 b_fp64 = split(b);\n  float err = ((a_fp64.x * b_fp64.x - prod) + a_fp64.x * b_fp64.y +\n    a_fp64.y * b_fp64.x) + a_fp64.y * b_fp64.y;\n  return vec2(prod, err);\n}\n\nvec2 sum_fp64(vec2 a, vec2 b) {\n  vec2 s, t;\n  s = twoSum(a.x, b.x);\n  t = twoSum(a.y, b.y);\n  s.y += t.x;\n  s = quickTwoSum(s.x, s.y);\n  s.y += t.y;\n  s = quickTwoSum(s.x, s.y);\n  return s;\n}\n\nvec2 sub_fp64(vec2 a, vec2 b) {\n  vec2 s, t;\n  s = twoSub(a.x, b.x);\n  t = twoSub(a.y, b.y);\n  s.y += t.x;\n  s = quickTwoSum(s.x, s.y);\n  s.y += t.y;\n  s = quickTwoSum(s.x, s.y);\n  return s;\n}\n\nvec2 mul_fp64(vec2 a, vec2 b) {\n  vec2 prod = twoProd(a.x, b.x);\n  // y component is for the error\n  prod.y += a.x * b.y;\n#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)\n  prod = split2(prod);\n#endif\n  prod = quickTwoSum(prod.x, prod.y);\n  prod.y += a.y * b.x;\n#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)\n  prod = split2(prod);\n#endif\n  prod = quickTwoSum(prod.x, prod.y);\n  return prod;\n}\n\nvec2 div_fp64(vec2 a, vec2 b) {\n  float xn = 1.0 / b.x;\n#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)\n  vec2 yn = mul_fp64(a, vec2(xn, 0));\n#else\n  vec2 yn = a * xn;\n#endif\n  float diff = (sub_fp64(a, mul_fp64(b, yn))).x;\n  vec2 prod = twoProd(xn, diff);\n  return sum_fp64(yn, prod);\n}\n\nvec2 sqrt_fp64(vec2 a) {\n  if (a.x == 0.0 && a.y == 0.0) return vec2(0.0, 0.0);\n  if (a.x < 0.0) return vec2(0.0 / 0.0, 0.0 / 0.0);\n\n  float x = 1.0 / sqrt(a.x);\n  float yn = a.x * x;\n#if defined(LUMA_FP64_CODE_ELIMINATION_WORKAROUND)\n  vec2 yn_sqr = twoSqr(yn) * fp64.ONE;\n#else\n  vec2 yn_sqr = twoSqr(yn);\n#endif\n  float diff = sub_fp64(a, yn_sqr).x;\n  vec2 prod = twoProd(x * 0.5, diff);\n#if defined(LUMA_FP64_HIGH_BITS_OVERFLOW_WORKAROUND)\n  return sum_fp64(split(yn), prod);\n#else\n  return sum_fp64(vec2(yn, 0.0), prod);\n#endif\n}\n",
	defaultUniforms: { ONE: 1 },
	uniformTypes: { ONE: "f32" },
	fp64ify: bu,
	fp64LowPart: xu,
	fp64ifyMatrix4: Su
}, Tu = {
	props: {},
	uniforms: {},
	name: "picking",
	uniformTypes: {
		isActive: "f32",
		isAttribute: "f32",
		isHighlightActive: "f32",
		useFloatColors: "f32",
		highlightedObjectColor: "vec3<f32>",
		highlightColor: "vec4<f32>"
	},
	defaultUniforms: {
		isActive: !1,
		isAttribute: !1,
		isHighlightActive: !1,
		useFloatColors: !0,
		highlightedObjectColor: [
			0,
			0,
			0
		],
		highlightColor: [
			0,
			1,
			1,
			1
		]
	},
	vs: "uniform pickingUniforms {\n  float isActive;\n  float isAttribute;\n  float isHighlightActive;\n  float useFloatColors;\n  vec3 highlightedObjectColor;\n  vec4 highlightColor;\n} picking;\n\nout vec4 picking_vRGBcolor_Avalid;\n\n// Normalize unsigned byte color to 0-1 range\nvec3 picking_normalizeColor(vec3 color) {\n  return picking.useFloatColors > 0.5 ? color : color / 255.0;\n}\n\n// Normalize unsigned byte color to 0-1 range\nvec4 picking_normalizeColor(vec4 color) {\n  return picking.useFloatColors > 0.5 ? color : color / 255.0;\n}\n\nbool picking_isColorZero(vec3 color) {\n  return dot(color, vec3(1.0)) < 0.00001;\n}\n\nbool picking_isColorValid(vec3 color) {\n  return dot(color, vec3(1.0)) > 0.00001;\n}\n\n// Check if this vertex is highlighted \nbool isVertexHighlighted(vec3 vertexColor) {\n  vec3 highlightedObjectColor = picking_normalizeColor(picking.highlightedObjectColor);\n  return\n    bool(picking.isHighlightActive) && picking_isColorZero(abs(vertexColor - highlightedObjectColor));\n}\n\n// Set the current picking color\nvoid picking_setPickingColor(vec3 pickingColor) {\n  pickingColor = picking_normalizeColor(pickingColor);\n\n  if (bool(picking.isActive)) {\n    // Use alpha as the validity flag. If pickingColor is [0, 0, 0] fragment is non-pickable\n    picking_vRGBcolor_Avalid.a = float(picking_isColorValid(pickingColor));\n\n    if (!bool(picking.isAttribute)) {\n      // Stores the picking color so that the fragment shader can render it during picking\n      picking_vRGBcolor_Avalid.rgb = pickingColor;\n    }\n  } else {\n    // Do the comparison with selected item color in vertex shader as it should mean fewer compares\n    picking_vRGBcolor_Avalid.a = float(isVertexHighlighted(pickingColor));\n  }\n}\n\nvoid picking_setPickingAttribute(float value) {\n  if (bool(picking.isAttribute)) {\n    picking_vRGBcolor_Avalid.r = value;\n  }\n}\n\nvoid picking_setPickingAttribute(vec2 value) {\n  if (bool(picking.isAttribute)) {\n    picking_vRGBcolor_Avalid.rg = value;\n  }\n}\n\nvoid picking_setPickingAttribute(vec3 value) {\n  if (bool(picking.isAttribute)) {\n    picking_vRGBcolor_Avalid.rgb = value;\n  }\n}\n",
	fs: "uniform pickingUniforms {\n  float isActive;\n  float isAttribute;\n  float isHighlightActive;\n  float useFloatColors;\n  vec3 highlightedObjectColor;\n  vec4 highlightColor;\n} picking;\n\nin vec4 picking_vRGBcolor_Avalid;\n\n/*\n * Returns highlight color if this item is selected.\n */\nvec4 picking_filterHighlightColor(vec4 color) {\n  // If we are still picking, we don't highlight\n  if (picking.isActive > 0.5) {\n    return color;\n  }\n\n  bool selected = bool(picking_vRGBcolor_Avalid.a);\n\n  if (selected) {\n    // Blend in highlight color based on its alpha value\n    float highLightAlpha = picking.highlightColor.a;\n    float blendedAlpha = highLightAlpha + color.a * (1.0 - highLightAlpha);\n    float highLightRatio = highLightAlpha / blendedAlpha;\n\n    vec3 blendedRGB = mix(color.rgb, picking.highlightColor.rgb, highLightRatio);\n    return vec4(blendedRGB, blendedAlpha);\n  } else {\n    return color;\n  }\n}\n\n/*\n * Returns picking color if picking enabled else unmodified argument.\n */\nvec4 picking_filterPickingColor(vec4 color) {\n  if (bool(picking.isActive)) {\n    if (picking_vRGBcolor_Avalid.a == 0.0) {\n      discard;\n    }\n    return picking_vRGBcolor_Avalid;\n  }\n  return color;\n}\n\n/*\n * Returns picking color if picking is enabled if not\n * highlight color if this item is selected, otherwise unmodified argument.\n */\nvec4 picking_filterColor(vec4 color) {\n  vec4 highlightColor = picking_filterHighlightColor(color);\n  return picking_filterPickingColor(highlightColor);\n}\n",
	getUniforms: Eu
};
function Eu(e = {}, t) {
	let n = {};
	if (e.highlightedObjectColor === void 0 || (e.highlightedObjectColor === null ? n.isHighlightActive = !1 : (n.isHighlightActive = !0, n.highlightedObjectColor = e.highlightedObjectColor.slice(0, 3))), e.highlightColor) {
		let t = Array.from(e.highlightColor, (e) => e / 255);
		Number.isFinite(t[3]) || (t[3] = 1), n.highlightColor = t;
	}
	return e.isActive !== void 0 && (n.isActive = !!e.isActive, n.isAttribute = !!e.isAttribute), e.useFloatColors !== void 0 && (n.useFloatColors = !!e.useFloatColors), n;
}
// node_modules/@luma.gl/shadertools/dist/modules/lighting/lights/lighting-uniforms-glsl.js
var Du = "precision highp int;\n\n// #if (defined(SHADER_TYPE_FRAGMENT) && defined(LIGHTING_FRAGMENT)) || (defined(SHADER_TYPE_VERTEX) && defined(LIGHTING_VERTEX))\nstruct AmbientLight {\n  vec3 color;\n};\n\nstruct PointLight {\n  vec3 color;\n  vec3 position;\n  vec3 attenuation; // 2nd order x:Constant-y:Linear-z:Exponential\n};\n\nstruct DirectionalLight {\n  vec3 color;\n  vec3 direction;\n};\n\nuniform lightingUniforms {\n  int enabled;\n  int lightType;\n\n  int directionalLightCount;\n  int pointLightCount;\n\n  vec3 ambientColor;\n\n  vec3 lightColor0;\n  vec3 lightPosition0;\n  vec3 lightDirection0;\n  vec3 lightAttenuation0;\n\n  vec3 lightColor1;\n  vec3 lightPosition1;\n  vec3 lightDirection1;\n  vec3 lightAttenuation1;\n\n  vec3 lightColor2;\n  vec3 lightPosition2;\n  vec3 lightDirection2;\n  vec3 lightAttenuation2;\n} lighting;\n\nPointLight lighting_getPointLight(int index) {\n  switch (index) {\n    case 0:\n      return PointLight(lighting.lightColor0, lighting.lightPosition0, lighting.lightAttenuation0);\n    case 1:\n      return PointLight(lighting.lightColor1, lighting.lightPosition1, lighting.lightAttenuation1);\n    case 2:\n    default:  \n      return PointLight(lighting.lightColor2, lighting.lightPosition2, lighting.lightAttenuation2);\n  }\n}\n\nDirectionalLight lighting_getDirectionalLight(int index) {\n  switch (index) {\n    case 0:\n      return DirectionalLight(lighting.lightColor0, lighting.lightDirection0);\n    case 1:\n      return DirectionalLight(lighting.lightColor1, lighting.lightDirection1);\n    case 2:\n    default:   \n      return DirectionalLight(lighting.lightColor2, lighting.lightDirection2);\n  }\n} \n\nfloat getPointLightAttenuation(PointLight pointLight, float distance) {\n  return pointLight.attenuation.x\n       + pointLight.attenuation.y * distance\n       + pointLight.attenuation.z * distance * distance;\n}\n\n// #endif\n", Ou = "// #if (defined(SHADER_TYPE_FRAGMENT) && defined(LIGHTING_FRAGMENT)) || (defined(SHADER_TYPE_VERTEX) && defined(LIGHTING_VERTEX))\nstruct AmbientLight {\n  color: vec3<f32>,\n};\n\nstruct PointLight {\n  color: vec3<f32>,\n  position: vec3<f32>,\n  attenuation: vec3<f32>, // 2nd order x:Constant-y:Linear-z:Exponential\n};\n\nstruct DirectionalLight {\n  color: vec3<f32>,\n  direction: vec3<f32>,\n};\n\nstruct lightingUniforms {\n  enabled: i32,\n  pointLightCount: i32,\n  directionalLightCount: i32,\n\n  ambientColor: vec3<f32>,\n\n  // TODO - support multiple lights by uncommenting arrays below\n  lightType: i32,\n  lightColor: vec3<f32>,\n  lightDirection: vec3<f32>,\n  lightPosition: vec3<f32>,\n  lightAttenuation: vec3<f32>,\n\n  // AmbientLight ambientLight;\n  // PointLight pointLight[MAX_LIGHTS];\n  // DirectionalLight directionalLight[MAX_LIGHTS];\n};\n\n// Binding 0:1 is reserved for lighting (Note: could go into separate bind group as it is stable across draw calls)\n@binding(1) @group(0) var<uniform> lighting : lightingUniforms;\n\nfn lighting_getPointLight(index: i32) -> PointLight {\n  return PointLight(lighting.lightColor, lighting.lightPosition, lighting.lightAttenuation);\n}\n\nfn lighting_getDirectionalLight(index: i32) -> DirectionalLight {\n  return DirectionalLight(lighting.lightColor, lighting.lightDirection);\n} \n\nfn getPointLightAttenuation(pointLight: PointLight, distance: f32) -> f32 {\n  return pointLight.attenuation.x\n       + pointLight.attenuation.y * distance\n       + pointLight.attenuation.z * distance * distance;\n}\n", ku = 3, Au = 255, ju;
(function(e) {
	e[e.POINT = 0] = "POINT", e[e.DIRECTIONAL = 1] = "DIRECTIONAL";
})(ju ||= {});
var Mu = {
	props: {},
	uniforms: {},
	name: "lighting",
	defines: { MAX_LIGHTS: ku },
	uniformTypes: {
		enabled: "i32",
		lightType: "i32",
		directionalLightCount: "i32",
		pointLightCount: "i32",
		ambientLightColor: "vec3<f32>",
		lightColor0: "vec3<f32>",
		lightPosition0: "vec3<f32>",
		lightDirection0: "vec3<f32>",
		lightAttenuation0: "vec3<f32>",
		lightColor1: "vec3<f32>",
		lightPosition1: "vec3<f32>",
		lightDirection1: "vec3<f32>",
		lightAttenuation1: "vec3<f32>",
		lightColor2: "vec3<f32>",
		lightPosition2: "vec3<f32>",
		lightDirection2: "vec3<f32>",
		lightAttenuation2: "vec3<f32>"
	},
	defaultUniforms: {
		enabled: 1,
		lightType: ju.POINT,
		directionalLightCount: 0,
		pointLightCount: 0,
		ambientLightColor: [
			.1,
			.1,
			.1
		],
		lightColor0: [
			1,
			1,
			1
		],
		lightPosition0: [
			1,
			1,
			2
		],
		lightDirection0: [
			1,
			1,
			1
		],
		lightAttenuation0: [
			1,
			0,
			0
		],
		lightColor1: [
			1,
			1,
			1
		],
		lightPosition1: [
			1,
			1,
			2
		],
		lightDirection1: [
			1,
			1,
			1
		],
		lightAttenuation1: [
			1,
			0,
			0
		],
		lightColor2: [
			1,
			1,
			1
		],
		lightPosition2: [
			1,
			1,
			2
		],
		lightDirection2: [
			1,
			1,
			1
		],
		lightAttenuation2: [
			1,
			0,
			0
		]
	},
	source: Ou,
	vs: Du,
	fs: Du,
	getUniforms: Nu
};
function Nu(e, t = {}) {
	if (e &&= { ...e }, !e) return { ...Mu.defaultUniforms };
	e.lights && (e = {
		...e,
		...Fu(e.lights),
		lights: void 0
	});
	let { ambientLight: n, pointLights: r, directionalLights: i } = e || {};
	if (!(n || r && r.length > 0 || i && i.length > 0)) return {
		...Mu.defaultUniforms,
		enabled: 0
	};
	let a = {
		...Mu.defaultUniforms,
		...t,
		...Pu({
			ambientLight: n,
			pointLights: r,
			directionalLights: i
		})
	};
	return e.enabled !== void 0 && (a.enabled = +!!e.enabled), a;
}
function Pu({ ambientLight: e, pointLights: t = [], directionalLights: n = [] }) {
	let r = {};
	r.ambientLightColor = Iu(e);
	let i = 0;
	for (let e of t) {
		r.lightType = ju.POINT;
		let t = i;
		r[`lightColor${t}`] = Iu(e), r[`lightPosition${t}`] = e.position, r[`lightAttenuation${t}`] = e.attenuation || [
			1,
			0,
			0
		], i++;
	}
	for (let e of n) {
		r.lightType = ju.DIRECTIONAL;
		let t = i;
		r[`lightColor${t}`] = Iu(e), r[`lightDirection${t}`] = e.direction, i++;
	}
	return i > ku && D.warn("MAX_LIGHTS exceeded")(), r.directionalLightCount = n.length, r.pointLightCount = t.length, r;
}
function Fu(e) {
	let t = {
		pointLights: [],
		directionalLights: []
	};
	for (let n of e || []) switch (n.type) {
		case "ambient":
			t.ambientLight = n;
			break;
		case "directional":
			t.directionalLights?.push(n);
			break;
		case "point": t.pointLights?.push(n);
	}
	return t;
}
function Iu(e = {}) {
	let { color: t = [
		0,
		0,
		0
	], intensity: n = 1 } = e;
	return t.map((e) => e * n / Au);
}
// node_modules/@luma.gl/shadertools/dist/modules/lighting/gouraud-material/gouraud-material.js
var Lu = {
	props: {},
	name: "gouraudMaterial",
	vs: "uniform gouraudMaterialUniforms {\n  uniform float ambient;\n  uniform float diffuse;\n  uniform float shininess;\n  uniform vec3  specularColor;\n} material;\n\nvec3 lighting_getLightColor(vec3 surfaceColor, vec3 light_direction, vec3 view_direction, vec3 normal_worldspace, vec3 color) {\n  vec3 halfway_direction = normalize(light_direction + view_direction);\n  float lambertian = dot(light_direction, normal_worldspace);\n  float specular = 0.0;\n  if (lambertian > 0.0) {\n    float specular_angle = max(dot(normal_worldspace, halfway_direction), 0.0);\n    specular = pow(specular_angle, material.shininess);\n  }\n  lambertian = max(lambertian, 0.0);\n  return (lambertian * material.diffuse * surfaceColor + specular * material.specularColor) * color;\n}\n\nvec3 lighting_getLightColor(vec3 surfaceColor, vec3 cameraPosition, vec3 position_worldspace, vec3 normal_worldspace) {\n  vec3 lightColor = surfaceColor;\n\n  if (lighting.enabled == 0) {\n    return lightColor;\n  }\n\n  vec3 view_direction = normalize(cameraPosition - position_worldspace);\n  lightColor = material.ambient * surfaceColor * lighting.ambientColor;\n\n  for (int i = 0; i < lighting.pointLightCount; i++) {\n    PointLight pointLight = lighting_getPointLight(i);\n    vec3 light_position_worldspace = pointLight.position;\n    vec3 light_direction = normalize(light_position_worldspace - position_worldspace);\n    float light_attenuation = getPointLightAttenuation(pointLight, distance(light_position_worldspace, position_worldspace));\n    lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color / light_attenuation);\n  }\n\n  int totalLights = min(MAX_LIGHTS, lighting.pointLightCount + lighting.directionalLightCount);\n  for (int i = lighting.pointLightCount; i < totalLights; i++) {\n    DirectionalLight directionalLight = lighting_getDirectionalLight(i);\n    lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);\n  }\n  \n  return lightColor;\n}\n",
	fs: "uniform gouraudMaterialUniforms {\n  uniform float ambient;\n  uniform float diffuse;\n  uniform float shininess;\n  uniform vec3  specularColor;\n} material;\n",
	source: "struct gouraudMaterialUniforms {\n  ambient: f32,\n  diffuse: f32,\n  shininess: f32,\n  specularColor: vec3<f32>,\n};\n\n@binding(2) @group(0) var<uniform> gouraudMaterial : gouraudMaterialUniforms;\n\nfn lighting_getLightColor(surfaceColor: vec3<f32>, light_direction: vec3<f32>, view_direction: vec3<f32>, normal_worldspace: vec3<f32>, color: vec3<f32>) -> vec3<f32> {\n  let halfway_direction: vec3<f32> = normalize(light_direction + view_direction);\n  var lambertian: f32 = dot(light_direction, normal_worldspace);\n  var specular: f32 = 0.0;\n  if (lambertian > 0.0) {\n    let specular_angle = max(dot(normal_worldspace, halfway_direction), 0.0);\n    specular = pow(specular_angle, gouraudMaterial.shininess);\n  }\n  lambertian = max(lambertian, 0.0);\n  return (lambertian * gouraudMaterial.diffuse * surfaceColor + specular * gouraudMaterial.specularColor) * color;\n}\n\nfn lighting_getLightColor2(surfaceColor: vec3<f32>, cameraPosition: vec3<f32>, position_worldspace: vec3<f32>, normal_worldspace: vec3<f32>) -> vec3<f32> {\n  var lightColor: vec3<f32> = surfaceColor;\n\n  if (lighting.enabled == 0) {\n    return lightColor;\n  }\n\n  let view_direction: vec3<f32> = normalize(cameraPosition - position_worldspace);\n  lightColor = gouraudMaterial.ambient * surfaceColor * lighting.ambientColor;\n\n  if (lighting.lightType == 0) {\n    let pointLight: PointLight  = lighting_getPointLight(0);\n    let light_position_worldspace: vec3<f32> = pointLight.position;\n    let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);\n    lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color);\n  } else if (lighting.lightType == 1) {\n    var directionalLight: DirectionalLight = lighting_getDirectionalLight(0);\n    lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);\n  }\n  \n  return lightColor;\n  /*\n  for (int i = 0; i < MAX_LIGHTS; i++) {\n    if (i >= lighting.pointLightCount) {\n      break;\n    }\n    PointLight pointLight = lighting.pointLight[i];\n    vec3 light_position_worldspace = pointLight.position;\n    vec3 light_direction = normalize(light_position_worldspace - position_worldspace);\n    lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color);\n  }\n\n  for (int i = 0; i < MAX_LIGHTS; i++) {\n    if (i >= lighting.directionalLightCount) {\n      break;\n    }\n    DirectionalLight directionalLight = lighting.directionalLight[i];\n    lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);\n  }\n  */\n}\n\nfn lighting_getSpecularLightColor(cameraPosition: vec3<f32>, position_worldspace: vec3<f32>, normal_worldspace: vec3<f32>) -> vec3<f32>{\n  var lightColor = vec3<f32>(0, 0, 0);\n  let surfaceColor = vec3<f32>(0, 0, 0);\n\n  if (lighting.enabled == 0) {\n    let view_direction = normalize(cameraPosition - position_worldspace);\n\n    switch (lighting.lightType) {\n      case 0, default: {\n        let pointLight: PointLight = lighting_getPointLight(0);\n        let light_position_worldspace: vec3<f32> = pointLight.position;\n        let light_direction: vec3<f32> = normalize(light_position_worldspace - position_worldspace);\n        lightColor += lighting_getLightColor(surfaceColor, light_direction, view_direction, normal_worldspace, pointLight.color);\n      }\n      case 1: {\n        let directionalLight: DirectionalLight = lighting_getDirectionalLight(0);\n        lightColor += lighting_getLightColor(surfaceColor, -directionalLight.direction, view_direction, normal_worldspace, directionalLight.color);\n      }\n    }\n  }\n  return lightColor;\n}\n",
	defines: { LIGHTING_VERTEX: 1 },
	dependencies: [Mu],
	uniformTypes: {
		ambient: "f32",
		diffuse: "f32",
		shininess: "f32",
		specularColor: "vec3<f32>"
	},
	defaultUniforms: {
		ambient: .35,
		diffuse: .6,
		shininess: 32,
		specularColor: [
			.15,
			.15,
			.15
		]
	},
	getUniforms(e) {
		let t = { ...e };
		return t.specularColor &&= t.specularColor.map((e) => e / 255), {
			...Lu.defaultUniforms,
			...t
		};
	}
}, Ru = "uniform layerUniforms {\n  uniform float opacity;\n} layer;\n", zu = {
	name: "layer",
	vs: Ru,
	fs: Ru,
	getUniforms: (e) => ({ opacity: e.opacity ** (1 / 2.2) }),
	uniformTypes: { opacity: "f32" }
}, Bu = "const SMOOTH_EDGE_RADIUS: f32 = 0.5;\n\nstruct VertexGeometry {\n  position: vec4<f32>,\n  worldPosition: vec3<f32>,\n  worldPositionAlt: vec3<f32>,\n  normal: vec3<f32>,\n  uv: vec2<f32>,\n  pickingColor: vec3<f32>,\n};\n\nvar<private> geometry_: VertexGeometry = VertexGeometry(\n  vec4<f32>(0.0, 0.0, 1.0, 0.0),\n  vec3<f32>(0.0, 0.0, 0.0),\n  vec3<f32>(0.0, 0.0, 0.0),\n  vec3<f32>(0.0, 0.0, 0.0),\n  vec2<f32>(0.0, 0.0),\n  vec3<f32>(0.0, 0.0, 0.0)\n);\n\nstruct FragmentGeometry {\n  uv: vec2<f32>,\n};\n\nvar<private> fragmentGeometry: FragmentGeometry;\n\nfn smoothedge(edge: f32, x: f32) -> f32 {\n  return smoothstep(edge - SMOOTH_EDGE_RADIUS, edge + SMOOTH_EDGE_RADIUS, x);\n}\n", Vu = "#define SMOOTH_EDGE_RADIUS 0.5", Hu = {
	name: "geometry",
	source: Bu,
	vs: `\
${Vu}

struct VertexGeometry {
  vec4 position;
  vec3 worldPosition;
  vec3 worldPositionAlt;
  vec3 normal;
  vec2 uv;
  vec3 pickingColor;
} geometry = VertexGeometry(
  vec4(0.0, 0.0, 1.0, 0.0),
  vec3(0.0),
  vec3(0.0),
  vec3(0.0),
  vec2(0.0),
  vec3(0.0)
);
`,
	fs: `\
${Vu}

struct FragmentGeometry {
  vec2 uv;
} geometry;

float smoothedge(float edge, float x) {
  return smoothstep(edge - SMOOTH_EDGE_RADIUS, edge + SMOOTH_EDGE_RADIUS, x);
}
`
}, J;
(function(e) {
	e[e.Start = 1] = "Start", e[e.Move = 2] = "Move", e[e.End = 4] = "End", e[e.Cancel = 8] = "Cancel";
})(J ||= {});
var Y;
(function(e) {
	e[e.None = 0] = "None", e[e.Left = 1] = "Left", e[e.Right = 2] = "Right", e[e.Up = 4] = "Up", e[e.Down = 8] = "Down", e[e.Horizontal = 3] = "Horizontal", e[e.Vertical = 12] = "Vertical", e[e.All = 15] = "All";
})(Y ||= {});
// node_modules/mjolnir.js/dist/hammerjs/recognizer/recognizer-state.js
var X;
(function(e) {
	e[e.Possible = 1] = "Possible", e[e.Began = 2] = "Began", e[e.Changed = 4] = "Changed", e[e.Ended = 8] = "Ended", e[e.Recognized = 8] = "Recognized", e[e.Cancelled = 16] = "Cancelled", e[e.Failed = 32] = "Failed";
})(X ||= {});
var Uu = "auto", Wu = "manipulation", Gu = "none", Ku = "pan-x", qu = "pan-y";
// node_modules/mjolnir.js/dist/hammerjs/touchaction/clean-touch-actions.js
function Ju(e) {
	if (e.includes("none")) return Gu;
	let t = e.includes(Ku), n = e.includes(qu);
	return t && n ? Gu : t || n ? t ? Ku : qu : e.includes("manipulation") ? Wu : Uu;
}
// node_modules/mjolnir.js/dist/hammerjs/touchaction/touchaction.js
var Yu = class {
	constructor(e, t) {
		this.actions = "", this.manager = e, this.set(t);
	}
	set(e) {
		e === "compute" && (e = this.compute()), this.manager.element && (this.manager.element.style.touchAction = e, this.actions = e);
	}
	update() {
		this.set(this.manager.options.touchAction);
	}
	compute() {
		let e = [];
		for (let t of this.manager.recognizers) t.options.enable && (e = e.concat(t.getTouchAction()));
		return Ju(e.join(" "));
	}
};
// node_modules/mjolnir.js/dist/hammerjs/utils/split-str.js
function Xu(e) {
	return e.trim().split(/\s+/g);
}
// node_modules/mjolnir.js/dist/hammerjs/utils/event-listeners.js
function Zu(e, t, n) {
	if (e) for (let r of Xu(t)) e.addEventListener(r, n, !1);
}
function Qu(e, t, n) {
	if (e) for (let r of Xu(t)) e.removeEventListener(r, n, !1);
}
// node_modules/mjolnir.js/dist/hammerjs/utils/get-window-for-element.js
function $u(e) {
	return (e.ownerDocument || e).defaultView;
}
// node_modules/mjolnir.js/dist/hammerjs/utils/has-parent.js
function ed(e, t) {
	let n = e;
	for (; n;) {
		if (n === t) return !0;
		n = n.parentNode;
	}
	return !1;
}
// node_modules/mjolnir.js/dist/hammerjs/input/get-center.js
function td(e) {
	let t = e.length;
	if (t === 1) return {
		x: Math.round(e[0].clientX),
		y: Math.round(e[0].clientY)
	};
	let n = 0, r = 0, i = 0;
	for (; i < t;) n += e[i].clientX, r += e[i].clientY, i++;
	return {
		x: Math.round(n / t),
		y: Math.round(r / t)
	};
}
// node_modules/mjolnir.js/dist/hammerjs/input/simple-clone-input-data.js
function nd(e) {
	let t = [], n = 0;
	for (; n < e.pointers.length;) t[n] = {
		clientX: Math.round(e.pointers[n].clientX),
		clientY: Math.round(e.pointers[n].clientY)
	}, n++;
	return {
		timeStamp: Date.now(),
		pointers: t,
		center: td(t),
		deltaX: e.deltaX,
		deltaY: e.deltaY
	};
}
// node_modules/mjolnir.js/dist/hammerjs/input/get-distance.js
function rd(e, t) {
	let n = t.x - e.x, r = t.y - e.y;
	return Math.sqrt(n * n + r * r);
}
function id(e, t) {
	let n = t.clientX - e.clientX, r = t.clientY - e.clientY;
	return Math.sqrt(n * n + r * r);
}
// node_modules/mjolnir.js/dist/hammerjs/input/get-angle.js
function ad(e, t) {
	let n = t.x - e.x, r = t.y - e.y;
	return Math.atan2(r, n) * 180 / Math.PI;
}
function od(e, t) {
	let n = t.clientX - e.clientX, r = t.clientY - e.clientY;
	return Math.atan2(r, n) * 180 / Math.PI;
}
// node_modules/mjolnir.js/dist/hammerjs/input/get-direction.js
function sd(e, t) {
	return e === t ? Y.None : Math.abs(e) >= Math.abs(t) ? e < 0 ? Y.Left : Y.Right : t < 0 ? Y.Up : Y.Down;
}
// node_modules/mjolnir.js/dist/hammerjs/input/get-delta-xy.js
function cd(e, t) {
	let n = t.center, r = e.offsetDelta, i = e.prevDelta, a = e.prevInput;
	return (t.eventType === J.Start || a?.eventType === J.End) && (i = e.prevDelta = {
		x: a?.deltaX || 0,
		y: a?.deltaY || 0
	}, r = e.offsetDelta = {
		x: n.x,
		y: n.y
	}), {
		deltaX: i.x + (n.x - r.x),
		deltaY: i.y + (n.y - r.y)
	};
}
// node_modules/mjolnir.js/dist/hammerjs/input/get-velocity.js
function ld(e, t, n) {
	return {
		x: t / e || 0,
		y: n / e || 0
	};
}
// node_modules/mjolnir.js/dist/hammerjs/input/get-scale.js
function ud(e, t) {
	return id(t[0], t[1]) / id(e[0], e[1]);
}
// node_modules/mjolnir.js/dist/hammerjs/input/get-rotation.js
function dd(e, t) {
	return od(t[1], t[0]) - od(e[1], e[0]);
}
// node_modules/mjolnir.js/dist/hammerjs/input/compute-interval-input-data.js
function fd(e, t) {
	let n = e.lastInterval || t, r = t.timeStamp - n.timeStamp, i, a, o, s;
	if (t.eventType !== J.Cancel && (r > 25 || n.velocity === void 0)) {
		let c = t.deltaX - n.deltaX, l = t.deltaY - n.deltaY, u = ld(r, c, l);
		a = u.x, o = u.y, i = Math.abs(u.x) > Math.abs(u.y) ? u.x : u.y, s = sd(c, l), e.lastInterval = t;
	} else i = n.velocity, a = n.velocityX, o = n.velocityY, s = n.direction;
	t.velocity = i, t.velocityX = a, t.velocityY = o, t.direction = s;
}
// node_modules/mjolnir.js/dist/hammerjs/input/compute-input-data.js
function pd(e, t) {
	return "pointerId" in e ? e.pointerId : t;
}
function md(e, t) {
	e.movementOrigin = new Map(t.map((e, t) => [pd(e, t), {
		clientX: e.clientX,
		clientY: e.clientY
	}])), e.firstMovementTime = void 0;
}
function hd(e, t) {
	let n = t.pointers.map(pd);
	if (e.movementOrigin?.size === n.length && n.every((t) => e.movementOrigin.has(t)) || md(e, t.pointers), t.distancePerPointer = t.pointers.map((t, r) => id(e.movementOrigin.get(n[r]), t)), t.eventType & J.Move && t.distancePerPointer.some((e) => e > 0) && (e.firstMovementTime ??= t.timeStamp), t.movementDeltaTime = e.firstMovementTime === void 0 ? 0 : t.timeStamp - e.firstMovementTime, t.eventType & (J.End | J.Cancel)) {
		let r = t.changedPointers.map((e) => pd(e, t.pointers.indexOf(e)));
		md(e, t.pointers.filter((e, t) => !r.includes(n[t])));
	}
}
function gd(e, t) {
	let { session: n } = e, { pointers: r } = t, { length: i } = r;
	n.firstInput ||= nd(t), i > 1 && !n.firstMultiple ? n.firstMultiple = nd(t) : i === 1 && (n.firstMultiple = !1);
	let { firstInput: a, firstMultiple: o } = n, s = o ? o.center : a.center, c = t.center = td(r);
	t.timeStamp = Date.now(), t.deltaTime = t.timeStamp - a.timeStamp, hd(n, t), t.angle = ad(s, c), t.distance = rd(s, c);
	let { deltaX: l, deltaY: u } = cd(n, t);
	t.deltaX = l, t.deltaY = u, t.offsetDirection = sd(t.deltaX, t.deltaY);
	let d = ld(t.deltaTime, t.deltaX, t.deltaY);
	t.overallVelocityX = d.x, t.overallVelocityY = d.y, t.overallVelocity = Math.abs(d.x) > Math.abs(d.y) ? d.x : d.y, t.scale = o ? ud(o.pointers, r) : 1, t.rotation = o ? dd(o.pointers, r) : 0, t.maxPointers = n.prevInput ? t.pointers.length > n.prevInput.maxPointers ? t.pointers.length : n.prevInput.maxPointers : t.pointers.length;
	let f = e.element;
	return ed(t.srcEvent.target, f) && (f = t.srcEvent.target), t.target = f, fd(n, t), t;
}
// node_modules/mjolnir.js/dist/hammerjs/input/input-handler.js
function _d(e, t, n) {
	let r = n.pointers.length, i = n.changedPointers.length, a = t & J.Start && r - i === 0, o = t & (J.End | J.Cancel) && r - i === 0;
	n.isFirst = !!a, n.isFinal = !!o, a && (e.session = {}), n.eventType = t;
	let s = gd(e, n);
	e.emit("hammer.input", s), e.recognize(s), e.session.prevInput = s;
}
// node_modules/mjolnir.js/dist/hammerjs/input/input.js
var vd = class {
	constructor(e) {
		this.evEl = "", this.evWin = "", this.evTarget = "", this.domHandler = (e) => {
			this.manager.options.enable && this.handler(e);
		}, this.manager = e, this.element = e.element, this.target = e.options.inputTarget || e.element;
	}
	callback(e, t) {
		_d(this.manager, e, t);
	}
	init() {
		Zu(this.element, this.evEl, this.domHandler), Zu(this.target, this.evTarget, this.domHandler), Zu($u(this.element), this.evWin, this.domHandler);
	}
	destroy() {
		Qu(this.element, this.evEl, this.domHandler), Qu(this.target, this.evTarget, this.domHandler), Qu($u(this.element), this.evWin, this.domHandler);
	}
}, yd = {
	pointerdown: J.Start,
	pointermove: J.Move,
	pointerup: J.End,
	pointercancel: J.Cancel,
	pointerout: J.Cancel
}, bd = "pointerdown", xd = "pointermove pointerup pointercancel", Sd = class extends vd {
	constructor(e) {
		super(e), this.evEl = bd, this.evWin = xd, this.store = this.manager.session.pointerEvents = [], this.init();
	}
	handler(e) {
		let { store: t } = this, n = !1, r = yd[e.type], i = e.pointerType, a = i === "touch", o = t.findIndex((t) => t.pointerId === e.pointerId);
		r & J.Start && (e.buttons || a) ? o < 0 && (t.push(e), o = t.length - 1) : r & (J.End | J.Cancel) && (n = !0), o < 0 || (t[o] = e, this.callback(r, {
			pointers: t,
			changedPointers: [e],
			eventType: r,
			pointerType: i,
			srcEvent: e
		}), n && t.splice(o, 1));
	}
}, Cd = [
	"",
	"webkit",
	"Moz",
	"MS",
	"ms",
	"o"
];
function wd(e, t) {
	let n = t[0].toUpperCase() + t.slice(1);
	for (let r of Cd) {
		let i = r ? r + n : t;
		if (i in e) return i;
	}
}
// node_modules/mjolnir.js/dist/hammerjs/manager.js
var Td = 1, Ed = 2, Dd = {
	touchAction: "compute",
	enable: !0,
	inputTarget: null,
	cssProps: {
		userSelect: "none",
		userDrag: "none",
		touchCallout: "none",
		tapHighlightColor: "rgba(0,0,0,0)"
	}
}, Od = class {
	constructor(e, t) {
		this.options = {
			...Dd,
			...t,
			cssProps: {
				...Dd.cssProps,
				...t.cssProps
			},
			inputTarget: t.inputTarget || e
		}, this.handlers = {}, this.session = {}, this.recognizers = [], this.oldCssProps = {}, this.element = e, this.input = new Sd(this), this.touchAction = new Yu(this, this.options.touchAction), this.toggleCssProps(!0);
	}
	set(e) {
		return Object.assign(this.options, e), e.touchAction && this.touchAction.update(), e.inputTarget && (this.input.destroy(), this.input.target = e.inputTarget, this.input.init()), this;
	}
	stop(e) {
		this.session.stopped = e ? Ed : Td;
	}
	recognize(e) {
		let { session: t } = this;
		if (t.stopped) return;
		this.session.prevented && e.srcEvent.preventDefault();
		let n, { recognizers: r } = this, { curRecognizer: i } = t;
		(!i || i && i.state & X.Recognized) && (i = t.curRecognizer = null);
		let a = 0;
		for (; a < r.length;) n = r[a], t.stopped !== Ed && (!i || n === i || n.canRecognizeWith(i)) ? n.recognize(e) : n.reset(), !i && n.state & (X.Began | X.Changed | X.Ended) && (i = t.curRecognizer = n), a++;
	}
	get(e) {
		let { recognizers: t } = this;
		for (let n = 0; n < t.length; n++) if (t[n].options.event === e) return t[n];
		return null;
	}
	add(e) {
		if (Array.isArray(e)) {
			for (let t of e) this.add(t);
			return this;
		}
		let t = this.get(e.options.event);
		return t && this.remove(t), this.recognizers.push(e), e.manager = this, this.touchAction.update(), e;
	}
	remove(e) {
		if (Array.isArray(e)) {
			for (let t of e) this.remove(t);
			return this;
		}
		let t = typeof e == "string" ? this.get(e) : e;
		if (t) {
			let { recognizers: e } = this, n = e.indexOf(t);
			n !== -1 && (e.splice(n, 1), this.touchAction.update());
		}
		return this;
	}
	on(e, t) {
		if (!e || !t) return;
		let { handlers: n } = this;
		for (let r of Xu(e)) n[r] = n[r] || [], n[r].push(t);
	}
	off(e, t) {
		if (!e) return;
		let { handlers: n } = this;
		for (let r of Xu(e)) t ? n[r] && n[r].splice(n[r].indexOf(t), 1) : delete n[r];
	}
	emit(e, t) {
		let n = this.handlers[e] && this.handlers[e].slice();
		if (!n || !n.length) return;
		let r = t;
		r.type = e, r.preventDefault = function() {
			t.srcEvent.preventDefault();
		};
		let i = 0;
		for (; i < n.length;) n[i](r), i++;
	}
	destroy() {
		this.toggleCssProps(!1), this.handlers = {}, this.session = {}, this.input.destroy(), this.element = null;
	}
	toggleCssProps(e) {
		let { element: t } = this;
		if (t) {
			for (let [n, r] of Object.entries(this.options.cssProps)) {
				let i = wd(t.style, n);
				e ? (this.oldCssProps[i] = t.style[i], t.style[i] = r) : t.style[i] = this.oldCssProps[i] || "";
			}
			e || (this.oldCssProps = {});
		}
	}
}, kd = 1;
function Ad() {
	return kd++;
}
// node_modules/mjolnir.js/dist/hammerjs/recognizer/state-str.js
function jd(e) {
	return e & X.Cancelled ? "cancel" : e & X.Ended ? "end" : e & X.Changed ? "move" : e & X.Began ? "start" : "";
}
// node_modules/mjolnir.js/dist/hammerjs/recognizer/recognizer.js
var Md = class {
	constructor(e) {
		this.options = e, this.id = Ad(), this.state = X.Possible, this.simultaneous = {}, this.requireFail = [];
	}
	set(e) {
		return Object.assign(this.options, e), this.manager.touchAction.update(), this;
	}
	recognizeWith(e) {
		if (Array.isArray(e)) {
			for (let t of e) this.recognizeWith(t);
			return this;
		}
		let t;
		if (typeof e == "string") {
			if (t = this.manager.get(e), !t) throw Error(`Cannot find recognizer ${e}`);
		} else t = e;
		let { simultaneous: n } = this;
		return n[t.id] || (n[t.id] = t, t.recognizeWith(this)), this;
	}
	dropRecognizeWith(e) {
		if (Array.isArray(e)) {
			for (let t of e) this.dropRecognizeWith(t);
			return this;
		}
		let t;
		return t = typeof e == "string" ? this.manager.get(e) : e, t && delete this.simultaneous[t.id], this;
	}
	requireFailure(e) {
		if (Array.isArray(e)) {
			for (let t of e) this.requireFailure(t);
			return this;
		}
		let t;
		if (typeof e == "string") {
			if (t = this.manager.get(e), !t) throw Error(`Cannot find recognizer ${e}`);
		} else t = e;
		let { requireFail: n } = this;
		return n.indexOf(t) === -1 && (n.push(t), t.requireFailure(this)), this;
	}
	dropRequireFailure(e) {
		if (Array.isArray(e)) {
			for (let t of e) this.dropRequireFailure(t);
			return this;
		}
		let t;
		if (t = typeof e == "string" ? this.manager.get(e) : e, t) {
			let e = this.requireFail.indexOf(t);
			e > -1 && this.requireFail.splice(e, 1);
		}
		return this;
	}
	hasRequireFailures() {
		return !!this.requireFail.find((e) => e.options.enable);
	}
	canRecognizeWith(e) {
		return !!this.simultaneous[e.id];
	}
	emit(e) {
		if (!e) return;
		let { state: t } = this;
		t < X.Ended && this.manager.emit(this.options.event + jd(t), e), this.manager.emit(this.options.event, e), e.additionalEvent && this.manager.emit(e.additionalEvent, e), t >= X.Ended && this.manager.emit(this.options.event + jd(t), e);
	}
	tryEmit(e) {
		this.canEmit() ? this.emit(e) : this.state = X.Failed;
	}
	canEmit() {
		let e = 0;
		for (; e < this.requireFail.length;) {
			if (!(this.requireFail[e].state & (X.Failed | X.Possible))) return !1;
			e++;
		}
		return !0;
	}
	recognize(e) {
		let t = { ...e };
		this.options.enable ? (this.state & (X.Recognized | X.Cancelled | X.Failed) && (this.state = X.Possible), this.state = this.process(t), this.state & (X.Began | X.Changed | X.Ended | X.Cancelled) && this.tryEmit(t)) : (this.reset(), this.state = X.Failed);
	}
	getEventNames() {
		return [this.options.event];
	}
	reset() {}
};
// node_modules/mjolnir.js/dist/hammerjs/recognizers/attribute.js
function Nd(e) {
	return Math.abs(((e + 180) % 360 + 360) % 360 - 180);
}
function Pd(e, t) {
	return (t.distance === void 0 || e.distance >= t.distance) && (t.distancePerPointer === void 0 || e.distancePerPointer.length > 0 && e.distancePerPointer.every((e) => e >= t.distancePerPointer)) && (t.movementDeltaTime === void 0 || e.movementDeltaTime >= t.movementDeltaTime) && (t.rotation === void 0 || Nd(e.rotation) >= t.rotation) && (t.scale === void 0 || Math.abs(e.scale - 1) >= t.scale);
}
var Fd = class extends Md {
	attrTest(e) {
		let t = this.options.pointers;
		return t === 0 || e.pointers.length === t;
	}
	coherentTest(e) {
		let t = this.options.coherent;
		return !t?.length || t.some((t) => Pd(e, t));
	}
	process(e) {
		let { state: t } = this, { eventType: n } = e, r = t & (X.Began | X.Changed), i = this.attrTest(e);
		return r && (n & J.Cancel || !i) ? t | X.Cancelled : r || i ? n & J.End ? t | X.Ended : t & X.Began ? t | X.Changed : X.Began : X.Failed;
	}
}, Id = class extends Md {
	constructor(e = {}) {
		super({
			enable: !0,
			event: "tap",
			pointers: 1,
			taps: 1,
			interval: 300,
			time: 250,
			threshold: 9,
			posThreshold: 10,
			...e
		}), this.pTime = null, this.pCenter = null, this._timer = null, this._input = null, this.count = 0;
	}
	getTouchAction() {
		return [Wu];
	}
	process(e) {
		let { options: t } = this, n = e.pointers.length === t.pointers, r = e.distance < t.threshold, i = e.deltaTime < t.time;
		if (this.reset(), e.eventType & J.Start && this.count === 0) return this.failTimeout();
		if (r && i && n) {
			if (e.eventType !== J.End) return this.failTimeout();
			let n = !this.pTime || e.timeStamp - this.pTime < t.interval, r = !this.pCenter || rd(this.pCenter, e.center) < t.posThreshold;
			if (this.pTime = e.timeStamp, this.pCenter = e.center, !r || !n ? this.count = 1 : this.count += 1, this._input = e, this.count % t.taps === 0) return this.hasRequireFailures() ? (this._timer = setTimeout(() => {
				this.state = X.Recognized, this.tryEmit(this._input);
			}, t.interval), X.Began) : X.Recognized;
		}
		return X.Failed;
	}
	failTimeout() {
		return this._timer = setTimeout(() => {
			this.state = X.Failed;
		}, this.options.interval), X.Failed;
	}
	reset() {
		clearTimeout(this._timer);
	}
	emit(e) {
		this.state === X.Recognized && (e.tapCount = this.count, this.manager.emit(this.options.event, e));
	}
}, Ld = class extends Fd {
	constructor() {
		super(...arguments), this.wheelSession = null, this.wheelSessionUnsubscribe = null, this.handleWheelSessionEvent = (e) => {
			e.device === "trackpad" && this.handleTrackpadEvent(e);
		};
	}
	set(e) {
		let { wheelSession: t, ...n } = e;
		return t && t !== this.wheelSession && (this.wheelSessionUnsubscribe?.(), this.wheelSessionUnsubscribe = null, this.wheelSession = t), super.set(n), this.updateWheelSessionSubscription(), this;
	}
	getTrackpadInput(e, t = {}) {
		let { srcEvent: n } = e, r = t.deltaX ?? e.deltaX, i = t.deltaY ?? e.deltaY, a = sd(r, i), o = Math.sqrt(e.deltaX * e.deltaX + e.deltaY * e.deltaY), s = n;
		return {
			pointers: [s, s],
			changedPointers: [s, s],
			pointerType: "trackpad",
			srcEvent: s,
			eventType: e.eventType,
			timeStamp: e.timeStamp,
			deltaTime: e.deltaTime,
			center: e.center,
			deltaX: r,
			deltaY: i,
			angle: Math.atan2(i, r) * 180 / Math.PI,
			distance: Math.sqrt(r * r + i * i),
			distancePerPointer: [o, o],
			movementDeltaTime: e.deltaTime,
			scale: 1,
			rotation: 0,
			direction: a,
			offsetDirection: a,
			velocity: e.velocity,
			velocityX: e.velocityX,
			velocityY: e.velocityY,
			overallVelocity: e.overallVelocity,
			overallVelocityX: e.overallVelocityX,
			overallVelocityY: e.overallVelocityY,
			maxPointers: 2,
			target: n.target || this.manager.element,
			additionalEvent: "",
			...t
		};
	}
	updateWheelSessionSubscription() {
		let e = !!(this.wheelSession && this.options.enable && this.options.trackpad && this.options.pointers === 2);
		e && !this.wheelSessionUnsubscribe ? this.wheelSessionUnsubscribe = this.wheelSession.on(this.handleWheelSessionEvent) : !e && this.wheelSessionUnsubscribe && (this.wheelSessionUnsubscribe(), this.wheelSessionUnsubscribe = null);
	}
}, Rd = [
	"",
	"start",
	"move",
	"end",
	"cancel",
	"up",
	"down",
	"left",
	"right"
], zd = class extends Ld {
	constructor(e = {}) {
		super({
			enable: !0,
			pointers: 1,
			event: "pan",
			threshold: 10,
			direction: Y.All,
			trackpad: !1,
			coherent: [],
			...e
		}), this.trackpadGesture = !1, this.pX = null, this.pY = null;
	}
	getTouchAction() {
		let { options: { direction: e } } = this, t = [];
		return e & Y.Horizontal && t.push(qu), e & Y.Vertical && t.push(Ku), t;
	}
	getEventNames() {
		return Rd.map((e) => this.options.event + e);
	}
	directionTest(e) {
		let { options: t } = this, n = !0, { distance: r } = e, { direction: i } = e, a = e.deltaX, o = e.deltaY;
		return i & t.direction || (t.direction & Y.Horizontal ? (i = a === 0 ? Y.None : a < 0 ? Y.Left : Y.Right, n = a !== this.pX, r = Math.abs(e.deltaX)) : (i = o === 0 ? Y.None : o < 0 ? Y.Up : Y.Down, n = o !== this.pY, r = Math.abs(e.deltaY))), e.direction = i, n && r > t.threshold && !!(i & t.direction);
	}
	attrTest(e) {
		let t = !!(this.state & X.Began), n = !(this.options.coherent?.length && e.eventType & (J.End | J.Cancel));
		return super.attrTest(e) && (t || n && this.coherentTest(e) && this.directionTest(e));
	}
	emit(e) {
		this.pX = e.deltaX, this.pY = e.deltaY;
		let t = Y[e.direction].toLowerCase();
		t && (e.additionalEvent = this.options.event + t), super.emit(e);
	}
	handleTrackpadEvent(e) {
		e.isFirst && (this.trackpadGesture = !e.srcEvent.ctrlKey, !this.trackpadGesture && this.state & (X.Recognized | X.Cancelled | X.Failed) && (this.state = X.Possible)), this.trackpadGesture && (this.recognize(this.getTrackpadInput(e, {
			deltaX: -e.deltaX,
			deltaY: -e.deltaY,
			velocity: -e.velocity,
			velocityX: -e.velocityX,
			velocityY: -e.velocityY,
			overallVelocity: -e.overallVelocity,
			overallVelocityX: -e.overallVelocityX,
			overallVelocityY: -e.overallVelocityY
		})), e.isFinal && (this.trackpadGesture = !1));
	}
}, Bd = [
	"",
	"start",
	"move",
	"end",
	"cancel",
	"in",
	"out"
], Vd = class extends Ld {
	constructor(e = {}) {
		super({
			enable: !0,
			event: "pinch",
			threshold: 0,
			pointers: 2,
			trackpad: !1,
			coherent: [],
			...e
		}), this.trackpadGesture = !1;
	}
	getTouchAction() {
		return [Gu];
	}
	getEventNames() {
		return Bd.map((e) => this.options.event + e);
	}
	attrTest(e) {
		let t = !!this.options.coherent?.length, n = !!(this.state & X.Began), r = !(t && e.eventType & (J.End | J.Cancel));
		return super.attrTest(e) && (n || r && (t ? this.coherentTest(e) : Math.abs(e.scale - 1) > this.options.threshold));
	}
	emit(e) {
		if (e.scale !== 1) {
			let t = e.scale < 1 ? "in" : "out";
			e.additionalEvent = this.options.event + t;
		}
		super.emit(e);
	}
	handleTrackpadEvent(e) {
		e.isFirst && (this.trackpadGesture = e.srcEvent.ctrlKey, !this.trackpadGesture && this.state & (X.Recognized | X.Cancelled | X.Failed) && (this.state = X.Possible)), this.trackpadGesture && (this.recognize(this.getTrackpadInput(e, {
			deltaX: 0,
			deltaY: 0,
			velocity: 0,
			velocityX: 0,
			velocityY: 0,
			overallVelocity: 0,
			overallVelocityX: 0,
			overallVelocityY: 0,
			scale: Math.exp(-e.deltaY / 100)
		})), e.isFinal && (this.trackpadGesture = !1));
	}
}, Hd = class {
	constructor(e, t, n) {
		this.element = e, this.callback = t, this.options = n;
	}
	listen(e, t) {
		t ? this.element.addEventListener(e, this.handleEvent, { passive: !1 }) : this.element.removeEventListener(e, this.handleEvent);
	}
}, Ud = (typeof navigator < "u" && navigator.userAgent ? navigator.userAgent.toLowerCase() : "").indexOf("firefox") !== -1, Wd = 40, Gd = .25, Kd = class extends Hd {
	constructor(e, t, n) {
		n.enable = n.enable ?? !1, super(e, t, n), this.handleEvent = (e) => {
			if (!this.options.enable) return;
			let t = e.deltaY;
			globalThis.WheelEvent && (Ud && e.deltaMode === globalThis.WheelEvent.DOM_DELTA_PIXEL && (t /= globalThis.devicePixelRatio), e.deltaMode === globalThis.WheelEvent.DOM_DELTA_LINE && (t *= Wd)), e.shiftKey && t && (t *= Gd), this.callback({
				type: "wheel",
				center: {
					x: e.clientX,
					y: e.clientY
				},
				delta: -t,
				device: this.options.wheelSession?.device ?? "unknown",
				srcEvent: e,
				pointerType: "mouse",
				target: e.target
			});
		}, n.enable && (this.wheelSessionUnsubscribe = this.options.wheelSession?.on(() => {}), this.listen("wheel", !0));
	}
	destroy() {
		this.listen("wheel", !1), this.wheelSessionUnsubscribe?.(), this.wheelSessionUnsubscribe = void 0;
	}
	enableEventType(e, t) {
		e === "wheel" && this.options.enable !== t && (this.options.enable = t, t && !this.wheelSessionUnsubscribe && (this.wheelSessionUnsubscribe = this.options.wheelSession?.on(() => {})), this.listen("wheel", t), t || (this.wheelSessionUnsubscribe?.(), this.wheelSessionUnsubscribe = void 0));
	}
}, qd = 4.000244140625, Jd = 40, Yd = 0, Xd = 1, Zd = 40, Qd = 40, $d = 120, ef = {
	classificationDelay: 32,
	endDelay: 80
}, tf = class {
	constructor(e, t = {}) {
		this.subscriptions = /* @__PURE__ */ new Map(), this.session = null, this.classificationTimer = null, this.endTimer = null, this.pressedControlKeys = /* @__PURE__ */ new Set(), this.listeningForControlKeys = !1, this.handleEvent = (e) => {
			if (!this.hasSubscribers) return "unknown";
			let t = rf(e, this.pressedControlKeys.size > 0), n = this.session;
			if (n && t.timeStamp - n.lastTimeStamp >= this.options.endDelay) {
				if (this.end(), !this.hasSubscribers) return "unknown";
				n = null;
			}
			n ? (this.scheduleEnd(), this.addSample(n, t)) : (n = this.startPendingSession(t), this.scheduleEnd());
			let { device: r } = n;
			return r === "unknown" && (r = af(n.samples, !1), r !== "unknown" && this.begin(n, r)), r;
		}, this.finishClassification = () => {
			if (this.classificationTimer = null, !this.session || this.session.device !== "unknown") return;
			let e = this.session, t = af(e.samples, !0);
			this.begin(e, t === "unknown" ? "mouse" : t);
		}, this.end = () => {
			if (!this.session) return;
			if (this.session.device === "unknown") {
				let e = this.session, t = af(e.samples, !0);
				this.begin(e, t === "unknown" ? "mouse" : t);
			}
			if (!this.session) return;
			let e = this.session;
			this.emit(J.End, e.lastEvent), this.reset();
		}, this.handleKeyDown = (e) => {
			e.key === "Control" && this.pressedControlKeys.add(e.code || e.key);
		}, this.handleKeyUp = (e) => {
			e.key === "Control" && (e.code ? this.pressedControlKeys.delete(e.code) : this.pressedControlKeys.clear());
		}, this.handleWindowBlur = () => {
			this.pressedControlKeys.clear();
		}, this.element = e, this.options = {
			...ef,
			...t
		}, this.element?.addEventListener("wheel", this.handleEvent, { passive: !0 });
	}
	get hasSubscribers() {
		return this.subscriptions.size > 0;
	}
	get device() {
		return this.session?.device ?? "unknown";
	}
	on(e) {
		let t = { listener: e };
		return this.subscriptions.set(e, t), this.updateControlKeyEventListeners(), () => {
			this.subscriptions.get(e) === t && this.off(e);
		};
	}
	off(e) {
		this.subscriptions.delete(e), this.updateControlKeyEventListeners(), this.hasSubscribers || this.reset();
	}
	cancel() {
		let e = this.session;
		e && e.device !== "unknown" && this.emit(J.Cancel, e.lastEvent), this.reset();
	}
	destroy() {
		this.cancel(), this.subscriptions.clear(), this.updateControlKeyEventListeners(), this.element?.removeEventListener("wheel", this.handleEvent);
	}
	startPendingSession(e) {
		let t = {
			samples: [e],
			device: "unknown",
			firstTimeStamp: e.timeStamp,
			lastTimeStamp: e.timeStamp,
			totalDeltaX: e.deltaX,
			totalDeltaY: e.deltaY,
			velocityX: 0,
			velocityY: 0,
			lastEvent: e.event
		};
		return this.session = t, this.classificationTimer = globalThis.setTimeout(this.finishClassification, this.options.classificationDelay), t;
	}
	addSample(e, t) {
		if (e.samples.push(t), e.lastTimeStamp = t.timeStamp, e.lastEvent = t.event, e.totalDeltaX += t.deltaX, e.totalDeltaY += t.deltaY, e.device !== "unknown") {
			let n = e.samples[e.samples.length - 2], r = t.timeStamp - n.timeStamp;
			e.velocityX = r > 0 ? t.deltaX / r : 0, e.velocityY = r > 0 ? t.deltaY / r : 0, this.emit(J.Move, t.event, {
				velocityX: e.velocityX,
				velocityY: e.velocityY
			});
		}
	}
	begin(e, t) {
		e.device = t, this.clearClassificationTimer(), this.emit(J.Start, e.samples[0].event);
		let n = e.lastTimeStamp - e.firstTimeStamp;
		e.velocityX = n > 0 ? e.totalDeltaX / n : 0, e.velocityY = n > 0 ? e.totalDeltaY / n : 0, this.emit(J.Move, e.lastEvent, {
			velocityX: e.velocityX,
			velocityY: e.velocityY
		});
	}
	scheduleEnd() {
		this.clearEndTimer(), this.endTimer = globalThis.setTimeout(this.end, this.options.endDelay);
	}
	emit(e, t, n) {
		let r = this.session;
		if (!r || r.device === "unknown") return;
		let i = e === J.Start, a = e === J.End || e === J.Cancel, o = i ? r.firstTimeStamp : r.lastTimeStamp, s = i ? 0 : Math.max(0, o - r.firstTimeStamp), c = i ? 0 : r.totalDeltaX, l = i ? 0 : r.totalDeltaY, u = s > 0 ? c / s : 0, d = s > 0 ? l / s : 0, f = i ? 0 : n?.velocityX ?? r.velocityX, p = i ? 0 : n?.velocityY ?? r.velocityY, m = {
			eventType: e,
			device: r.device,
			srcEvent: t,
			timeStamp: o,
			center: {
				x: t.clientX,
				y: t.clientY
			},
			deltaX: c,
			deltaY: l,
			deltaTime: s,
			velocity: Math.abs(f) > Math.abs(p) ? f : p,
			velocityX: f,
			velocityY: p,
			overallVelocity: Math.abs(u) > Math.abs(d) ? u : d,
			overallVelocityX: u,
			overallVelocityY: d,
			isFirst: i,
			isFinal: a
		};
		for (let { listener: e } of [...this.subscriptions.values()]) e(m);
	}
	reset() {
		this.clearClassificationTimer(), this.clearEndTimer(), this.session = null;
	}
	clearClassificationTimer() {
		this.classificationTimer !== null && (globalThis.clearTimeout(this.classificationTimer), this.classificationTimer = null);
	}
	clearEndTimer() {
		this.endTimer !== null && (globalThis.clearTimeout(this.endTimer), this.endTimer = null);
	}
	updateControlKeyEventListeners() {
		let e = this.hasSubscribers, t = nf();
		t && e !== this.listeningForControlKeys && (this.listeningForControlKeys = e, e ? (t.addEventListener("keydown", this.handleKeyDown, !0), t.addEventListener("keyup", this.handleKeyUp, !0), t.addEventListener("blur", this.handleWindowBlur)) : (t.removeEventListener("keydown", this.handleKeyDown, !0), t.removeEventListener("keyup", this.handleKeyUp, !0), t.removeEventListener("blur", this.handleWindowBlur), this.pressedControlKeys.clear()));
	}
};
function nf() {
	return typeof window < "u" ? window : globalThis.document?.defaultView;
}
function rf(e, t) {
	let n = e.deltaX, r = e.deltaY;
	return e.deltaMode === Xd && (n *= Jd, r *= Jd), {
		event: e,
		timeStamp: e.timeStamp,
		deltaX: n,
		deltaY: r,
		isControlKeyDown: t
	};
}
function af(e, t) {
	return e.some(({ event: e, isControlKeyDown: t }) => e.ctrlKey && !t) ? "trackpad" : e.some(({ event: e }) => e.deltaMode !== Yd) || e.some(of) || e.every(({ event: e }) => {
		let t = e.wheelDelta;
		return t !== void 0 && Math.abs(t) % 40 == 0;
	}) ? "mouse" : e.some(({ deltaX: e }) => e !== 0) || e.length > 1 && sf(e) ? "trackpad" : t ? "mouse" : "unknown";
}
function of({ event: e, deltaX: t, deltaY: n }) {
	if (t !== 0 || n === 0) return !1;
	let r = Math.abs(n / qd);
	if (Number.isInteger(r)) return !0;
	let i = e.wheelDelta;
	return typeof i == "number" && i !== 0 && i % $d === 0;
}
function sf(e) {
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (Math.abs(n.deltaX) > Qd || Math.abs(n.deltaY) > Qd || t > 0 && n.timeStamp - e[t - 1].timeStamp > Zd) return !1;
	}
	return !0;
}
// node_modules/mjolnir.js/dist/inputs/move-input.js
var cf = [
	"mousedown",
	"mousemove",
	"mouseup",
	"mouseover",
	"mouseout",
	"mouseenter",
	"mouseleave"
], lf = class extends Hd {
	constructor(e, t, n) {
		super(e, t, {
			enable: !0,
			...n
		}), this.handleEvent = (e) => {
			this.handleOverEvent(e), this.handleOutEvent(e), this.handleEnterEvent(e), this.handleLeaveEvent(e), this.handleMoveEvent(e);
		}, this.pressed = !1;
		let { enable: r = !1 } = this.options;
		this.enableMoveEvent = r, this.enableLeaveEvent = r, this.enableEnterEvent = r, this.enableOutEvent = r, this.enableOverEvent = r, r && cf.forEach((e) => this.listen(e, !0));
	}
	destroy() {
		cf.forEach((e) => this.listen(e, !1));
	}
	enableEventType(e, t) {
		switch (e) {
			case "pointermove":
				this.enableMoveEvent !== t && (this.enableMoveEvent = t, this.listen("mousedown", t), this.listen("mousemove", t), this.listen("mouseup", t));
				break;
			case "pointerover":
				this.enableOverEvent !== t && (this.enableOverEvent = t, this.listen("mouseover", t));
				break;
			case "pointerout":
				this.enableOutEvent !== t && (this.enableOutEvent = t, this.listen("mouseout", t));
				break;
			case "pointerenter":
				this.enableEnterEvent !== t && (this.enableEnterEvent = t, this.listen("mouseenter", t));
				break;
			case "pointerleave": this.enableLeaveEvent !== t && (this.enableLeaveEvent = t, this.listen("mouseleave", t));
		}
	}
	handleOverEvent(e) {
		this.enableOverEvent && e.type === "mouseover" && this._emit("pointerover", e);
	}
	handleOutEvent(e) {
		this.enableOutEvent && e.type === "mouseout" && this._emit("pointerout", e);
	}
	handleEnterEvent(e) {
		this.enableEnterEvent && e.type === "mouseenter" && this._emit("pointerenter", e);
	}
	handleLeaveEvent(e) {
		this.enableLeaveEvent && e.type === "mouseleave" && this._emit("pointerleave", e);
	}
	handleMoveEvent(e) {
		if (this.enableMoveEvent) switch (e.type) {
			case "mousedown":
				e.button >= 0 && (this.pressed = !0);
				break;
			case "mousemove":
				e.buttons === 0 && (this.pressed = !1), this.pressed || this._emit("pointermove", e);
				break;
			case "mouseup": this.pressed = !1;
		}
	}
	_emit(e, t) {
		this.callback({
			type: e,
			center: {
				x: t.clientX,
				y: t.clientY
			},
			srcEvent: t,
			pointerType: "mouse",
			target: t.target
		});
	}
}, uf = ["keydown", "keyup"], df = class extends Hd {
	constructor(e, t, n) {
		super(e, t, {
			enable: !0,
			tabIndex: 0,
			...n
		}), this.handleEvent = (e) => {
			let t = e.target || e.srcElement;
			t.tagName === "INPUT" && t.type === "text" || t.tagName === "TEXTAREA" || (this.enableDownEvent && e.type === "keydown" && this.callback({
				type: "keydown",
				srcEvent: e,
				key: e.key,
				target: e.target
			}), this.enableUpEvent && e.type === "keyup" && this.callback({
				type: "keyup",
				srcEvent: e,
				key: e.key,
				target: e.target
			}));
		};
		let { enable: r = !1 } = this.options;
		this.enableDownEvent = r, this.enableUpEvent = r, e.tabIndex = this.options.tabIndex, e.style.outline = "none", r && uf.forEach((e) => this.listen(e, !0));
	}
	destroy() {
		uf.forEach((e) => this.listen(e, !1));
	}
	enableEventType(e, t) {
		e === "keydown" && this.enableDownEvent !== t && (this.enableDownEvent = t, this.listen(e, t)), e === "keyup" && this.enableUpEvent !== t && (this.enableUpEvent = t, this.listen(e, t));
	}
}, ff = class extends Hd {
	constructor(e, t, n) {
		n.enable = n.enable ?? !1, super(e, t, n), this.handleEvent = (e) => {
			this.options.enable && this.callback({
				type: "contextmenu",
				center: {
					x: e.clientX,
					y: e.clientY
				},
				srcEvent: e,
				pointerType: "mouse",
				target: e.target
			});
		}, n.enable && this.listen("contextmenu", !0);
	}
	destroy() {
		this.listen("contextmenu", !1);
	}
	enableEventType(e, t) {
		e === "contextmenu" && this.options.enable !== t && (this.options.enable = t, this.listen("contextmenu", t));
	}
}, pf = 1, mf = 2, hf = 4, gf = {
	pointerdown: pf,
	pointermove: mf,
	pointerup: hf,
	mousedown: pf,
	mousemove: mf,
	mouseup: hf
}, _f = 0, vf = 1, yf = 2, bf = 1, xf = 2, Sf = 4;
function Cf(e) {
	let t = gf[e.srcEvent.type];
	if (!t) return null;
	let { buttons: n, button: r } = e.srcEvent, i = !1, a = !1, o = !1;
	return t === mf ? (i = !!(n & bf), a = !!(n & Sf), o = !!(n & xf)) : (i = r === _f, a = r === vf, o = r === yf), {
		leftButton: i,
		middleButton: a,
		rightButton: o
	};
}
function wf(e, t) {
	let n = e.center;
	if (!n) return null;
	let r = t.getBoundingClientRect(), i = r.width / t.offsetWidth || 1, a = r.height / t.offsetHeight || 1;
	return {
		center: n,
		offsetCenter: {
			x: (n.x - r.left - t.clientLeft) / i,
			y: (n.y - r.top - t.clientTop) / a
		}
	};
}
// node_modules/mjolnir.js/dist/utils/event-registrar.js
var Tf = {
	srcElement: "root",
	priority: 0
}, Ef = class {
	constructor(e, t) {
		this.handleEvent = (e) => {
			if (this.isEmpty()) return;
			let t = this._normalizeEvent(e), n = e.srcEvent.target;
			for (; n && n !== t.rootElement;) {
				if (this._emit(t, n), t.handled) return;
				n = n.parentNode;
			}
			this._emit(t, "root");
		}, this.eventManager = e, this.recognizerName = t, this.handlers = [], this.handlersByElement = /* @__PURE__ */ new Map(), this._active = !1;
	}
	isEmpty() {
		return !this._active;
	}
	add(e, t, n, r = !1, i = !1) {
		let { handlers: a, handlersByElement: o } = this, s = {
			...Tf,
			...n
		}, c = o.get(s.srcElement);
		c || (c = [], o.set(s.srcElement, c));
		let l = {
			type: e,
			handler: t,
			srcElement: s.srcElement,
			priority: s.priority
		};
		r && (l.once = !0), i && (l.passive = !0), a.push(l), this._active = this._active || !l.passive;
		let u = c.length - 1;
		for (; u >= 0 && !(c[u].priority >= l.priority);) u--;
		c.splice(u + 1, 0, l);
	}
	remove(e, t) {
		let { handlers: n, handlersByElement: r } = this;
		for (let i = n.length - 1; i >= 0; i--) {
			let a = n[i];
			if (a.type === e && a.handler === t) {
				n.splice(i, 1);
				let e = r.get(a.srcElement);
				e.splice(e.indexOf(a), 1), e.length === 0 && r.delete(a.srcElement);
			}
		}
		this._active = n.some((e) => !e.passive);
	}
	_emit(e, t) {
		let n = this.handlersByElement.get(t);
		if (n) {
			let t = !1, r = () => {
				e.handled = !0;
			}, i = () => {
				e.handled = !0, t = !0;
			}, a = [];
			for (let o = 0; o < n.length; o++) {
				let { type: s, handler: c, once: l } = n[o];
				if (c({
					...e,
					type: s,
					stopPropagation: r,
					stopImmediatePropagation: i
				}), l && a.push(n[o]), t) break;
			}
			for (let e = 0; e < a.length; e++) {
				let { type: t, handler: n } = a[e];
				this.remove(t, n);
			}
		}
	}
	_normalizeEvent(e) {
		let t = this.eventManager.getElement();
		return {
			...e,
			...Cf(e),
			...wf(e, t),
			preventDefault: () => {
				e.srcEvent.preventDefault();
			},
			stopImmediatePropagation: null,
			stopPropagation: null,
			handled: !1,
			rootElement: t
		};
	}
};
// node_modules/mjolnir.js/dist/event-manager.js
function Df(e) {
	if ("recognizer" in e) return e;
	let t, n = Array.isArray(e) ? [...e] : [e];
	return t = typeof n[0] == "function" ? new (n.shift())(n.shift() || {}) : n.shift(), {
		recognizer: t,
		recognizeWith: typeof n[0] == "string" ? [n[0]] : n[0],
		requireFailure: typeof n[1] == "string" ? [n[1]] : n[1]
	};
}
var Of = class {
	constructor(e = null, t = {}) {
		if (this._onBasicInput = (e) => {
			this.manager.emit(e.srcEvent.type, e);
		}, this._onOtherEvent = (e) => {
			this.manager.emit(e.type, e);
		}, this.options = {
			recognizers: [],
			events: {},
			touchAction: "compute",
			tabIndex: 0,
			cssProps: {},
			...t
		}, this.events = /* @__PURE__ */ new Map(), this.element = e, this.wheelSession = new tf(e), e) {
			this.manager = new Od(e, this.options);
			for (let e of this.options.recognizers) {
				let { recognizer: t, recognizeWith: n, requireFailure: r } = Df(e);
				this.manager.add(t), n && t.recognizeWith(n), r && t.requireFailure(r);
			}
			this.manager.on("hammer.input", this._onBasicInput), this.wheelInput = new Kd(e, this._onOtherEvent, {
				enable: !1,
				wheelSession: this.wheelSession
			}), this.moveInput = new lf(e, this._onOtherEvent, { enable: !1 }), this.keyInput = new df(e, this._onOtherEvent, {
				enable: !1,
				tabIndex: t.tabIndex
			}), this.contextmenuInput = new ff(e, this._onOtherEvent, { enable: !1 }), this.on(this.options.events);
		}
	}
	getElement() {
		return this.element;
	}
	destroy() {
		this.element ? (this.wheelInput.destroy(), this.wheelSession.destroy(), this.moveInput.destroy(), this.keyInput.destroy(), this.contextmenuInput.destroy(), this.manager.destroy()) : this.wheelSession.destroy();
	}
	on(e, t, n) {
		this._addEventHandler(e, t, n, !1);
	}
	once(e, t, n) {
		this._addEventHandler(e, t, n, !0);
	}
	watch(e, t, n) {
		this._addEventHandler(e, t, n, !1, !0);
	}
	off(e, t) {
		this._removeEventHandler(e, t);
	}
	emit(e) {
		this.manager?.emit(e.type, e);
	}
	_toggleRecognizer(e, t) {
		let { manager: n } = this;
		if (!n) return;
		let r = n.get(e);
		r && (r.set({
			enable: t,
			wheelSession: this.wheelSession
		}), n.touchAction.update()), this.wheelInput?.enableEventType(e, t), this.moveInput?.enableEventType(e, t), this.keyInput?.enableEventType(e, t), this.contextmenuInput?.enableEventType(e, t);
	}
	_addEventHandler(e, t, n, r, i) {
		if (typeof e != "string") {
			n = t;
			for (let [t, a] of Object.entries(e)) this._addEventHandler(t, a, n, r, i);
			return;
		}
		let { manager: a, events: o } = this;
		if (!a) return;
		let s = o.get(e);
		if (!s) {
			let t = this._getRecognizerName(e) || e;
			s = new Ef(this, t), o.set(e, s), a && a.on(e, s.handleEvent);
		}
		s.add(e, t, n, r, i), s.isEmpty() || this._toggleRecognizer(s.recognizerName, !0);
	}
	_removeEventHandler(e, t) {
		if (typeof e != "string") {
			for (let [t, n] of Object.entries(e)) this._removeEventHandler(t, n);
			return;
		}
		let { events: n } = this, r = n.get(e);
		if (r && (r.remove(e, t), r.isEmpty())) {
			let { recognizerName: e } = r, t = !1;
			for (let r of n.values()) if (r.recognizerName === e && !r.isEmpty()) {
				t = !0;
				break;
			}
			t || this._toggleRecognizer(e, !1);
		}
	}
	_getRecognizerName(e) {
		return this.manager.recognizers.find((t) => t.getEventNames().includes(e))?.options.event;
	}
}, Z = {
	DEFAULT: -1,
	LNGLAT: 1,
	METER_OFFSETS: 2,
	LNGLAT_OFFSETS: 3,
	CARTESIAN: 0
};
Object.defineProperty(Z, "IDENTITY", { get: () => (E.deprecated("COORDINATE_SYSTEM.IDENTITY", "COORDINATE_SYSTEM.CARTESIAN")(), 0) });
var kf = {
	WEB_MERCATOR: 1,
	GLOBE: 2,
	WEB_MERCATOR_AUTO_OFFSET: 4,
	IDENTITY: 0
}, Af = {
	common: 0,
	meters: 1,
	pixels: 2
}, jf = {
	click: "onClick",
	dblclick: "onClick",
	panstart: "onDragStart",
	panmove: "onDrag",
	panend: "onDragEnd"
}, Mf = {
	multipan: [zd, {
		threshold: 10,
		direction: Y.Vertical,
		pointers: 2
	}],
	pinch: [
		Vd,
		{},
		null,
		["multipan"]
	],
	pan: [
		zd,
		{ threshold: 1 },
		["pinch"],
		["multipan"]
	],
	dblclick: [Id, {
		event: "dblclick",
		taps: 2
	}],
	click: [
		Id,
		{ event: "click" },
		null,
		["dblclick"]
	]
};
// node_modules/@deck.gl/core/dist/utils/memoize.js
function Nf(e, t) {
	if (e === t) return !0;
	if (Array.isArray(e)) {
		let n = e.length;
		if (!t || t.length !== n) return !1;
		for (let r = 0; r < n; r++) if (e[r] !== t[r]) return !1;
		return !0;
	}
	return !1;
}
function Pf(e) {
	let t = {}, n;
	return (r) => {
		for (let i in r) if (!Nf(r[i], t[i])) {
			n = e(r), t = r;
			break;
		}
		return n;
	};
}
// node_modules/@deck.gl/core/dist/shaderlib/project/viewport-uniforms.js
var Ff = [
	0,
	0,
	0,
	0
], If = [
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	0
], Lf = [
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1
], Rf = [
	0,
	0,
	0
], zf = [
	0,
	0,
	0
], Bf = Pf(Wf);
function Vf(e, t, n = zf) {
	n.length < 3 && (n = [
		n[0],
		n[1],
		0
	]);
	let r = n, i, a = !0;
	switch (i = t === Z.LNGLAT_OFFSETS || t === Z.METER_OFFSETS ? n : e.isGeospatial ? [
		Math.fround(e.longitude),
		Math.fround(e.latitude),
		0
	] : null, e.projectionMode) {
		case kf.WEB_MERCATOR:
			(t === Z.LNGLAT || t === Z.CARTESIAN) && (i = [
				0,
				0,
				0
			], a = !1);
			break;
		case kf.WEB_MERCATOR_AUTO_OFFSET:
			t === Z.LNGLAT ? r = i : t === Z.CARTESIAN && (r = [
				Math.fround(e.center[0]),
				Math.fround(e.center[1]),
				0
			], i = e.unprojectPosition(r), r[0] -= n[0], r[1] -= n[1], r[2] -= n[2]);
			break;
		case kf.IDENTITY:
			r = e.position.map(Math.fround), r[2] = r[2] || 0;
			break;
		case kf.GLOBE:
			a = !1, i = null;
			break;
		default: a = !1;
	}
	return {
		geospatialOrigin: i,
		shaderCoordinateOrigin: r,
		offsetMode: a
	};
}
function Hf(e, t, n) {
	let { viewMatrixUncentered: r, projectionMatrix: i } = e, { viewMatrix: a, viewProjectionMatrix: o } = e, s = Ff, c = Ff, l = e.cameraPosition, { geospatialOrigin: u, shaderCoordinateOrigin: d, offsetMode: f } = Vf(e, t, n);
	return f && (c = e.projectPosition(u || d), l = [
		l[0] - c[0],
		l[1] - c[1],
		l[2] - c[2]
	], c[3] = 1, s = ou([], c, o), a = r || a, o = Wl([], i, a), o = Wl([], o, If)), {
		viewMatrix: a,
		viewProjectionMatrix: o,
		projectionCenter: s,
		originCommon: c,
		cameraPosCommon: l,
		shaderCoordinateOrigin: d,
		geospatialOrigin: u
	};
}
function Uf({ viewport: e, devicePixelRatio: t = 1, modelMatrix: n = null, coordinateSystem: r = Z.DEFAULT, coordinateOrigin: i = zf, autoWrapLongitude: a = !1 }) {
	r === Z.DEFAULT && (r = e.isGeospatial ? Z.LNGLAT : Z.CARTESIAN);
	let o = Bf({
		viewport: e,
		devicePixelRatio: t,
		coordinateSystem: r,
		coordinateOrigin: i
	});
	return o.wrapLongitude = a, o.modelMatrix = n || Lf, o;
}
function Wf({ viewport: e, devicePixelRatio: t, coordinateSystem: n, coordinateOrigin: r }) {
	let { projectionCenter: i, viewProjectionMatrix: a, originCommon: o, cameraPosCommon: s, shaderCoordinateOrigin: c, geospatialOrigin: l } = Hf(e, n, r), u = e.getDistanceScales(), d = [e.width * t, e.height * t], f = ou([], [
		0,
		0,
		-e.focalDistance,
		1
	], e.projectionMatrix)[3] || 1, p = {
		coordinateSystem: n,
		projectionMode: e.projectionMode,
		coordinateOrigin: c,
		commonOrigin: o.slice(0, 3),
		center: i,
		pseudoMeters: !!e._pseudoMeters,
		viewportSize: d,
		devicePixelRatio: t,
		focalDistance: f,
		commonUnitsPerMeter: u.unitsPerMeter,
		commonUnitsPerWorldUnit: u.unitsPerMeter,
		commonUnitsPerWorldUnit2: Rf,
		scale: e.scale,
		wrapLongitude: !1,
		viewProjectionMatrix: a,
		modelMatrix: Lf,
		cameraPosition: s
	};
	if (l) {
		let t = e.getDistanceScales(l);
		switch (n) {
			case Z.METER_OFFSETS:
				p.commonUnitsPerWorldUnit = t.unitsPerMeter, p.commonUnitsPerWorldUnit2 = t.unitsPerMeter2;
				break;
			case Z.LNGLAT:
			case Z.LNGLAT_OFFSETS:
				e._pseudoMeters || (p.commonUnitsPerMeter = t.unitsPerMeter), p.commonUnitsPerWorldUnit = t.unitsPerDegree, p.commonUnitsPerWorldUnit2 = t.unitsPerDegree2;
				break;
			case Z.CARTESIAN: p.commonUnitsPerWorldUnit = [
				1,
				1,
				t.unitsPerMeter[2]
			], p.commonUnitsPerWorldUnit2 = [
				0,
				0,
				t.unitsPerMeter2[2]
			];
		}
	}
	return p;
}
var Gf = `\
${`\
${Object.keys(Z).map((e) => `const COORDINATE_SYSTEM_${e}: i32 = ${Z[e]};`).join("")}
${Object.keys(kf).map((e) => `const PROJECTION_MODE_${e}: i32 = ${kf[e]};`).join("")}
${Object.keys(Af).map((e) => `const UNIT_${e.toUpperCase()}: i32 = ${Af[e]};`).join("")}

const TILE_SIZE: f32 = 512.0;
const PI: f32 = 3.1415926536;
const WORLD_SCALE: f32 = TILE_SIZE / (PI * 2.0);
const ZERO_64_LOW: vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
const EARTH_RADIUS: f32 = 6370972.0; // meters
const GLOBE_RADIUS: f32 = 256.0;

// -----------------------------------------------------------------------------
// Uniform block (converted from GLSL uniform block)
// -----------------------------------------------------------------------------
struct ProjectUniforms {
  wrapLongitude: i32,
  coordinateSystem: i32,
  commonUnitsPerMeter: vec3<f32>,
  projectionMode: i32,
  scale: f32,
  commonUnitsPerWorldUnit: vec3<f32>,
  commonUnitsPerWorldUnit2: vec3<f32>,
  center: vec4<f32>,
  modelMatrix: mat4x4<f32>,
  viewProjectionMatrix: mat4x4<f32>,
  viewportSize: vec2<f32>,
  devicePixelRatio: f32,
  focalDistance: f32,
  cameraPosition: vec3<f32>,
  coordinateOrigin: vec3<f32>,
  commonOrigin: vec3<f32>,
  pseudoMeters: i32,
};

@group(0) @binding(0)
var<uniform> project: ProjectUniforms;

// -----------------------------------------------------------------------------
// Geometry data
// (In your GLSL code, "geometry" was assumed to be available globally. In WGSL,
// you might supply this via vertex attributes or a uniform. Here we define a
// uniform struct for demonstration.)
// -----------------------------------------------------------------------------

// Structure to carry additional geometry data used by deck.gl filters.
struct Geometry {
  worldPosition: vec3<f32>,
  worldPositionAlt: vec3<f32>,
  position: vec4<f32>,
  uv: vec2<f32>,
  pickingColor: vec3<f32>,
};

// @group(0) @binding(1)
var<private> geometry: Geometry;
`}

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------

// Returns an adjustment factor for commonUnitsPerMeter
fn _project_size_at_latitude(lat: f32) -> f32 {
  let y = clamp(lat, -89.9, 89.9);
  return 1.0 / cos(radians(y));
}

// Overloaded version: scales a value in meters at a given latitude.
fn _project_size_at_latitude_m(meters: f32, lat: f32) -> f32 {
  return meters * project.commonUnitsPerMeter.z * _project_size_at_latitude(lat);
}

// Computes a non-linear scale factor based on geometry.
// (Note: This function relies on "geometry" being provided.)
fn project_size() -> f32 {
  if (project.projectionMode == PROJECTION_MODE_WEB_MERCATOR &&
      project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT &&
      project.pseudoMeters == 0) {
    if (geometry.position.w == 0.0) {
      return _project_size_at_latitude(geometry.worldPosition.y);
    }
    let y: f32 = geometry.position.y / TILE_SIZE * 2.0 - 1.0;
    let y2 = y * y;
    let y4 = y2 * y2;
    let y6 = y4 * y2;
    return 1.0 + 4.9348 * y2 + 4.0587 * y4 + 1.5642 * y6;
  }
  return 1.0;
}

// Overloads to scale offsets (meters to world units)
fn project_size_float(meters: f32) -> f32 {
  return meters * project.commonUnitsPerMeter.z * project_size();
}

fn project_size_vec2(meters: vec2<f32>) -> vec2<f32> {
  return meters * project.commonUnitsPerMeter.xy * project_size();
}

fn project_size_vec3(meters: vec3<f32>) -> vec3<f32> {
  return meters * project.commonUnitsPerMeter * project_size();
}

fn project_size_vec4(meters: vec4<f32>) -> vec4<f32> {
  return vec4<f32>(meters.xyz * project.commonUnitsPerMeter, meters.w);
}

// Returns a rotation matrix aligning the z‑axis with the given up vector.
fn project_get_orientation_matrix(up: vec3<f32>) -> mat3x3<f32> {
  let uz = normalize(up);
  let ux = select(
    vec3<f32>(1.0, 0.0, 0.0),
    normalize(vec3<f32>(uz.y, -uz.x, 0.0)),
    abs(uz.z) == 1.0
  );
  let uy = cross(uz, ux);
  return mat3x3<f32>(ux, uy, uz);
}

// Since WGSL does not support "out" parameters, we return a struct.
struct RotationResult {
  needsRotation: bool,
  transform: mat3x3<f32>,
};

fn project_needs_rotation(commonPosition: vec3<f32>) -> RotationResult {
  if (project.projectionMode == PROJECTION_MODE_GLOBE) {
    return RotationResult(true, project_get_orientation_matrix(commonPosition));
  } else {
    return RotationResult(false, mat3x3<f32>());  // identity alternative if needed
  };
}

// Projects a normal vector from the current coordinate system to world space.
fn project_normal(vector: vec3<f32>) -> vec3<f32> {
  let normal_modelspace = project.modelMatrix * vec4<f32>(vector, 0.0);
  var n = normalize(normal_modelspace.xyz * project.commonUnitsPerMeter);
  let rotResult = project_needs_rotation(geometry.position.xyz);
  if (rotResult.needsRotation) {
    n = rotResult.transform * n;
  }
  return n;
}

// Applies a scale offset based on y-offset (dy)
fn project_offset_(offset: vec4<f32>) -> vec4<f32> {
  let dy: f32 = offset.y;
  let commonUnitsPerWorldUnit = project.commonUnitsPerWorldUnit + project.commonUnitsPerWorldUnit2 * dy;
  return vec4<f32>(offset.xyz * commonUnitsPerWorldUnit, offset.w);
}

// Projects lng/lat coordinates to a unit tile [0,1]
fn project_mercator_(lnglat: vec2<f32>) -> vec2<f32> {
  var x = lnglat.x;
  if (project.wrapLongitude != 0) {
    x = ((x + 180.0) % 360.0) - 180.0;
  }
  let y = clamp(lnglat.y, -89.9, 89.9);
  return vec2<f32>(
    radians(x) + PI,
    PI + log(tan(PI * 0.25 + radians(y) * 0.5))
  ) * WORLD_SCALE;
}

// Projects lng/lat/z coordinates for a globe projection.
fn project_globe_(lnglatz: vec3<f32>) -> vec3<f32> {
  let lambda = radians(lnglatz.x);
  let phi = radians(lnglatz.y);
  let cosPhi = cos(phi);
  let D = (lnglatz.z / EARTH_RADIUS + 1.0) * GLOBE_RADIUS;
  return vec3<f32>(
    sin(lambda) * cosPhi,
    -cos(lambda) * cosPhi,
    sin(phi)
  ) * D;
}

// Projects positions (with an optional 64-bit low part) from the input
// coordinate system to the common space.
fn project_position_vec4_f64(position: vec4<f32>, position64Low: vec3<f32>) -> vec4<f32> {
  var position_world = project.modelMatrix * position;

  // Work around for a Mac+NVIDIA bug:
  if (project.projectionMode == PROJECTION_MODE_WEB_MERCATOR) {
    if (project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
      return vec4<f32>(
        project_mercator_(position_world.xy),
        _project_size_at_latitude_m(position_world.z, position_world.y),
        position_world.w
      );
    }
    if (project.coordinateSystem == COORDINATE_SYSTEM_CARTESIAN) {
      position_world = vec4f(position_world.xyz + project.coordinateOrigin, position_world.w);
    }
  }
  if (project.projectionMode == PROJECTION_MODE_GLOBE) {
    if (project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
      return vec4<f32>(
        project_globe_(position_world.xyz),
        position_world.w
      );
    }
  }
  if (project.projectionMode == PROJECTION_MODE_WEB_MERCATOR_AUTO_OFFSET) {
    if (project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
      if (abs(position_world.y - project.coordinateOrigin.y) > 0.25) {
        return vec4<f32>(
          project_mercator_(position_world.xy) - project.commonOrigin.xy,
          project_size_float(position_world.z),
          position_world.w
        );
      }
    }
  }
  if (project.projectionMode == PROJECTION_MODE_IDENTITY ||
      (project.projectionMode == PROJECTION_MODE_WEB_MERCATOR_AUTO_OFFSET &&
       (project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
        project.coordinateSystem == COORDINATE_SYSTEM_CARTESIAN))) {
    position_world = vec4f(position_world.xyz - project.coordinateOrigin, position_world.w);
  }

  return project_offset_(position_world) +
         project_offset_(project.modelMatrix * vec4<f32>(position64Low, 0.0));
}

// Overloaded versions for different input types.
fn project_position_vec4_f32(position: vec4<f32>) -> vec4<f32> {
  return project_position_vec4_f64(position, ZERO_64_LOW);
}

fn project_position_vec3_f64(position: vec3<f32>, position64Low: vec3<f32>) -> vec3<f32> {
  let projected_position = project_position_vec4_f64(vec4<f32>(position, 1.0), position64Low);
  return projected_position.xyz;
}

fn project_position_vec3_f32(position: vec3<f32>) -> vec3<f32> {
  let projected_position = project_position_vec4_f64(vec4<f32>(position, 1.0), ZERO_64_LOW);
  return projected_position.xyz;
}

fn project_position_vec2_f32(position: vec2<f32>) -> vec2<f32> {
  let projected_position = project_position_vec4_f64(vec4<f32>(position, 0.0, 1.0), ZERO_64_LOW);
  return projected_position.xy;
}

// Transforms a common space position to clip space.
fn project_common_position_to_clipspace_with_projection(position: vec4<f32>, viewProjectionMatrix: mat4x4<f32>, center: vec4<f32>) -> vec4<f32> {
  return viewProjectionMatrix * position + center;
}

// Uses the project viewProjectionMatrix and center.
fn project_common_position_to_clipspace(position: vec4<f32>) -> vec4<f32> {
  return project_common_position_to_clipspace_with_projection(position, project.viewProjectionMatrix, project.center);
}

// Returns a clip space offset corresponding to a given number of screen pixels.
fn project_pixel_size_to_clipspace(pixels: vec2<f32>) -> vec2<f32> {
  let offset = pixels / project.viewportSize * project.devicePixelRatio * 2.0;
  return offset * project.focalDistance;
}

fn project_meter_size_to_pixel(meters: f32) -> f32 {
  return project_size_float(meters) * project.scale;
}

fn project_unit_size_to_pixel(size: f32, unit: i32) -> f32 {
  if (unit == UNIT_METERS) {
    return project_meter_size_to_pixel(size);
  } else if (unit == UNIT_COMMON) {
    return size * project.scale;
  }
  // UNIT_PIXELS: no scaling applied.
  return size;
}

fn project_pixel_size_float(pixels: f32) -> f32 {
  return pixels / project.scale;
}

fn project_pixel_size_vec2(pixels: vec2<f32>) -> vec2<f32> {
  return pixels / project.scale;
}
`, Kf = `\
${Object.keys(Z).map((e) => `const int COORDINATE_SYSTEM_${e} = ${Z[e]};`).join("")}
${Object.keys(kf).map((e) => `const int PROJECTION_MODE_${e} = ${kf[e]};`).join("")}
${Object.keys(Af).map((e) => `const int UNIT_${e.toUpperCase()} = ${Af[e]};`).join("")}
uniform projectUniforms {
bool wrapLongitude;
int coordinateSystem;
vec3 commonUnitsPerMeter;
int projectionMode;
float scale;
vec3 commonUnitsPerWorldUnit;
vec3 commonUnitsPerWorldUnit2;
vec4 center;
mat4 modelMatrix;
mat4 viewProjectionMatrix;
vec2 viewportSize;
float devicePixelRatio;
float focalDistance;
vec3 cameraPosition;
vec3 coordinateOrigin;
vec3 commonOrigin;
bool pseudoMeters;
} project;
const float TILE_SIZE = 512.0;
const float PI = 3.1415926536;
const float WORLD_SCALE = TILE_SIZE / (PI * 2.0);
const vec3 ZERO_64_LOW = vec3(0.0);
const float EARTH_RADIUS = 6370972.0;
const float GLOBE_RADIUS = 256.0;
float project_size_at_latitude(float lat) {
float y = clamp(lat, -89.9, 89.9);
return 1.0 / cos(radians(y));
}
float project_size() {
if (project.projectionMode == PROJECTION_MODE_WEB_MERCATOR &&
project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT &&
project.pseudoMeters == false) {
if (geometry.position.w == 0.0) {
return project_size_at_latitude(geometry.worldPosition.y);
}
float y = geometry.position.y / TILE_SIZE * 2.0 - 1.0;
float y2 = y * y;
float y4 = y2 * y2;
float y6 = y4 * y2;
return 1.0 + 4.9348 * y2 + 4.0587 * y4 + 1.5642 * y6;
}
return 1.0;
}
float project_size_at_latitude(float meters, float lat) {
return meters * project.commonUnitsPerMeter.z * project_size_at_latitude(lat);
}
float project_size(float meters) {
return meters * project.commonUnitsPerMeter.z * project_size();
}
vec2 project_size(vec2 meters) {
return meters * project.commonUnitsPerMeter.xy * project_size();
}
vec3 project_size(vec3 meters) {
return meters * project.commonUnitsPerMeter * project_size();
}
vec4 project_size(vec4 meters) {
return vec4(meters.xyz * project.commonUnitsPerMeter, meters.w);
}
mat3 project_get_orientation_matrix(vec3 up) {
vec3 uz = normalize(up);
vec3 ux = abs(uz.z) == 1.0 ? vec3(1.0, 0.0, 0.0) : normalize(vec3(uz.y, -uz.x, 0));
vec3 uy = cross(uz, ux);
return mat3(ux, uy, uz);
}
bool project_needs_rotation(vec3 commonPosition, out mat3 transform) {
if (project.projectionMode == PROJECTION_MODE_GLOBE) {
transform = project_get_orientation_matrix(commonPosition);
return true;
}
return false;
}
vec3 project_normal(vec3 vector) {
vec4 normal_modelspace = project.modelMatrix * vec4(vector, 0.0);
vec3 n = normalize(normal_modelspace.xyz * project.commonUnitsPerMeter);
mat3 rotation;
if (project_needs_rotation(geometry.position.xyz, rotation)) {
n = rotation * n;
}
return n;
}
vec4 project_offset_(vec4 offset) {
float dy = offset.y;
vec3 commonUnitsPerWorldUnit = project.commonUnitsPerWorldUnit + project.commonUnitsPerWorldUnit2 * dy;
return vec4(offset.xyz * commonUnitsPerWorldUnit, offset.w);
}
vec2 project_mercator_(vec2 lnglat) {
float x = lnglat.x;
if (project.wrapLongitude) {
x = mod(x + 180., 360.0) - 180.;
}
float y = clamp(lnglat.y, -89.9, 89.9);
return vec2(
radians(x) + PI,
PI + log(tan_fp32(PI * 0.25 + radians(y) * 0.5))
) * WORLD_SCALE;
}
vec3 project_globe_(vec3 lnglatz) {
float lambda = radians(lnglatz.x);
float phi = radians(lnglatz.y);
float cosPhi = cos(phi);
float D = (lnglatz.z / EARTH_RADIUS + 1.0) * GLOBE_RADIUS;
return vec3(
sin(lambda) * cosPhi,
-cos(lambda) * cosPhi,
sin(phi)
) * D;
}
vec4 project_position(vec4 position, vec3 position64Low) {
vec4 position_world = project.modelMatrix * position;
if (project.projectionMode == PROJECTION_MODE_WEB_MERCATOR) {
if (project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
return vec4(
project_mercator_(position_world.xy),
project_size_at_latitude(position_world.z, position_world.y),
position_world.w
);
}
if (project.coordinateSystem == COORDINATE_SYSTEM_CARTESIAN) {
position_world.xyz += project.coordinateOrigin;
}
}
if (project.projectionMode == PROJECTION_MODE_GLOBE) {
if (project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
return vec4(
project_globe_(position_world.xyz),
position_world.w
);
}
}
if (project.projectionMode == PROJECTION_MODE_WEB_MERCATOR_AUTO_OFFSET) {
if (project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT) {
if (abs(position_world.y - project.coordinateOrigin.y) > 0.25) {
return vec4(
project_mercator_(position_world.xy) - project.commonOrigin.xy,
project_size(position_world.z),
position_world.w
);
}
}
}
if (project.projectionMode == PROJECTION_MODE_IDENTITY ||
(project.projectionMode == PROJECTION_MODE_WEB_MERCATOR_AUTO_OFFSET &&
(project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT ||
project.coordinateSystem == COORDINATE_SYSTEM_CARTESIAN))) {
position_world.xyz -= project.coordinateOrigin;
}
return project_offset_(position_world) + project_offset_(project.modelMatrix * vec4(position64Low, 0.0));
}
vec4 project_position(vec4 position) {
return project_position(position, ZERO_64_LOW);
}
vec3 project_position(vec3 position, vec3 position64Low) {
vec4 projected_position = project_position(vec4(position, 1.0), position64Low);
return projected_position.xyz;
}
vec3 project_position(vec3 position) {
vec4 projected_position = project_position(vec4(position, 1.0), ZERO_64_LOW);
return projected_position.xyz;
}
vec2 project_position(vec2 position) {
vec4 projected_position = project_position(vec4(position, 0.0, 1.0), ZERO_64_LOW);
return projected_position.xy;
}
vec4 project_common_position_to_clipspace(vec4 position, mat4 viewProjectionMatrix, vec4 center) {
return viewProjectionMatrix * position + center;
}
vec4 project_common_position_to_clipspace(vec4 position) {
return project_common_position_to_clipspace(position, project.viewProjectionMatrix, project.center);
}
vec2 project_pixel_size_to_clipspace(vec2 pixels) {
vec2 offset = pixels / project.viewportSize * project.devicePixelRatio * 2.0;
return offset * project.focalDistance;
}
float project_size_to_pixel(float meters) {
return project_size(meters) * project.scale;
}
float project_size_to_pixel(float size, int unit) {
if (unit == UNIT_METERS) return project_size_to_pixel(size);
if (unit == UNIT_COMMON) return size * project.scale;
return size;
}
float project_pixel_size(float pixels) {
return pixels / project.scale;
}
vec2 project_pixel_size(vec2 pixels) {
return pixels / project.scale;
}
`, qf = {};
function Jf(e = qf) {
	return "viewport" in e ? Uf(e) : {};
}
var Yf = {
	name: "project",
	dependencies: [Cu, Hu],
	source: Gf,
	vs: Kf,
	getUniforms: Jf,
	uniformTypes: {
		wrapLongitude: "f32",
		coordinateSystem: "i32",
		commonUnitsPerMeter: "vec3<f32>",
		projectionMode: "i32",
		scale: "f32",
		commonUnitsPerWorldUnit: "vec3<f32>",
		commonUnitsPerWorldUnit2: "vec3<f32>",
		center: "vec4<f32>",
		modelMatrix: "mat4x4<f32>",
		viewProjectionMatrix: "mat4x4<f32>",
		viewportSize: "vec2<f32>",
		devicePixelRatio: "f32",
		focalDistance: "f32",
		cameraPosition: "vec3<f32>",
		coordinateOrigin: "vec3<f32>",
		commonOrigin: "vec3<f32>",
		pseudoMeters: "f32"
	}
}, Xf = {
	name: "project32",
	dependencies: [Yf],
	source: "// Define a structure to hold both the clip-space position and the common position.\nstruct ProjectResult {\n  clipPosition: vec4<f32>,\n  commonPosition: vec4<f32>,\n};\n\n// This function mimics the GLSL version with the 'out' parameter by returning both values.\nfn project_position_to_clipspace_and_commonspace(\n    position: vec3<f32>,\n    position64Low: vec3<f32>,\n    offset: vec3<f32>\n) -> ProjectResult {\n  // Compute the projected position.\n  let projectedPosition: vec3<f32> = project_position_vec3_f64(position, position64Low);\n\n  // Start with the provided offset.\n  var finalOffset: vec3<f32> = offset;\n\n  // Get whether a rotation is needed and the rotation matrix.\n  let rotationResult = project_needs_rotation(projectedPosition);\n\n  // If rotation is needed, update the offset.\n  if (rotationResult.needsRotation) {\n    finalOffset = rotationResult.transform * offset;\n  }\n\n  // Compute the common position.\n  let commonPosition: vec4<f32> = vec4<f32>(projectedPosition + finalOffset, 1.0);\n\n  // Convert to clip-space.\n  let clipPosition: vec4<f32> = project_common_position_to_clipspace(commonPosition);\n\n  return ProjectResult(clipPosition, commonPosition);\n}\n\n// A convenience overload that returns only the clip-space position.\nfn project_position_to_clipspace(\n    position: vec3<f32>,\n    position64Low: vec3<f32>,\n    offset: vec3<f32>\n) -> vec4<f32> {\n  return project_position_to_clipspace_and_commonspace(position, position64Low, offset).clipPosition;\n}\n",
	vs: "vec4 project_position_to_clipspace(\n  vec3 position, vec3 position64Low, vec3 offset, out vec4 commonPosition\n) {\n  vec3 projectedPosition = project_position(position, position64Low);\n  mat3 rotation;\n  if (project_needs_rotation(projectedPosition, rotation)) {\n    // offset is specified as ENU\n    // when in globe projection, rotate offset so that the ground alighs with the surface of the globe\n    offset = rotation * offset;\n  }\n  commonPosition = vec4(projectedPosition + offset, 1.0);\n  return project_common_position_to_clipspace(commonPosition);\n}\n\nvec4 project_position_to_clipspace(\n  vec3 position, vec3 position64Low, vec3 offset\n) {\n  vec4 commonPosition;\n  return project_position_to_clipspace(position, position64Low, offset, commonPosition);\n}\n"
};
// node_modules/@math.gl/web-mercator/dist/math-utils.js
function Zf() {
	return [
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1
	];
}
function Qf(e, t) {
	let n = ou([], t, e);
	return au(n, n, 1 / n[3]), n;
}
function $f(e, t) {
	let n = e % t;
	return n < 0 ? t + n : n;
}
function ep(e, t, n) {
	return e < t ? t : e > n ? n : e;
}
function tp(e) {
	return Math.log(e) * Math.LOG2E;
}
var np = Math.log2 || tp;
// node_modules/@math.gl/web-mercator/dist/assert.js
function rp(e, t) {
	if (!e) throw Error(t || "@math.gl/web-mercator: assertion failed.");
}
// node_modules/@math.gl/web-mercator/dist/web-mercator-utils.js
var ip = Math.PI, ap = ip / 4, op = ip / 180, sp = 180 / ip, cp = 512, lp = 4003e4, up = 85.051129, dp = 1.5;
function fp(e) {
	return np(e);
}
function pp(e) {
	let [t, n] = e;
	rp(Number.isFinite(t)), rp(Number.isFinite(n) && n >= -90 && n <= 90, "invalid latitude");
	let r = t * op, i = n * op;
	return [cp * (r + ip) / (2 * ip), cp * (ip + Math.log(Math.tan(ap + i * .5))) / (2 * ip)];
}
function mp(e) {
	let [t, n] = e, r = t / cp * (2 * ip) - ip, i = 2 * (Math.atan(Math.exp(n / cp * (2 * ip) - ip)) - ap);
	return [r * sp, i * sp];
}
function hp(e) {
	let { latitude: t } = e;
	return rp(Number.isFinite(t)), fp(lp * Math.cos(t * op)) - 9;
}
function gp(e) {
	let t = Math.cos(e * op);
	return cp / lp / t;
}
function _p(e) {
	let { latitude: t, longitude: n, highPrecision: r = !1 } = e;
	rp(Number.isFinite(t) && Number.isFinite(n));
	let i = cp, a = Math.cos(t * op), o = i / 360, s = o / a, c = i / lp / a, l = {
		unitsPerMeter: [
			c,
			c,
			c
		],
		metersPerUnit: [
			1 / c,
			1 / c,
			1 / c
		],
		unitsPerDegree: [
			o,
			s,
			c
		],
		degreesPerUnit: [
			1 / o,
			1 / s,
			1 / c
		]
	};
	if (r) {
		let e = op * Math.tan(t * op) / a, n = o * e / 2, r = i / lp * e, u = r / s * c;
		l.unitsPerDegree2 = [
			0,
			n,
			r
		], l.unitsPerMeter2 = [
			u,
			0,
			u
		];
	}
	return l;
}
function vp(e, t) {
	let [n, r, i] = e, [a, o, s] = t, { unitsPerMeter: c, unitsPerMeter2: l } = _p({
		longitude: n,
		latitude: r,
		highPrecision: !0
	}), u = pp(e);
	u[0] += a * (c[0] + l[0] * o), u[1] += o * (c[1] + l[1] * o);
	let d = mp(u), f = (i || 0) + (s || 0);
	return Number.isFinite(i) || Number.isFinite(s) ? [
		d[0],
		d[1],
		f
	] : d;
}
function yp(e) {
	let { height: t, pitch: n, bearing: r, altitude: i, scale: a, center: o } = e, s = Zf();
	Gl(s, s, [
		0,
		0,
		-i
	]), Jl(s, s, -n * op), Xl(s, s, r * op);
	let c = a / t;
	return Kl(s, s, [
		c,
		c,
		c
	]), o && Gl(s, s, Tl([], o)), s;
}
function bp(e) {
	let { width: t, height: n, altitude: r, pitch: i = 0, offset: a, center: o, scale: s, nearZMultiplier: c = 1, farZMultiplier: l = 1 } = e, { fovy: u = xp(dp) } = e;
	r !== void 0 && (u = xp(r));
	let d = u * op, f = i * op, p = Sp(u), m = p;
	o && (m += o[2] * s / Math.cos(f) / n);
	let h = d * (.5 + (a ? a[1] : 0) / n), g = Math.sin(h) * m / Math.sin(ep(Math.PI / 2 - f - h, .01, Math.PI - .01)), _ = Math.sin(f) * g + m, v = m * 10, y = Math.min(_ * l, v);
	return {
		fov: d,
		aspect: t / n,
		focalDistance: p,
		near: c,
		far: y
	};
}
function xp(e) {
	return 2 * Math.atan(.5 / e) * sp;
}
function Sp(e) {
	return .5 / Math.tan(.5 * e * op);
}
function Cp(e, t) {
	let [n, r, i = 0] = e;
	return rp(Number.isFinite(n) && Number.isFinite(r) && Number.isFinite(i)), Qf(t, [
		n,
		r,
		i,
		1
	]);
}
function wp(e, t, n = 0) {
	let [r, i, a] = e;
	if (rp(Number.isFinite(r) && Number.isFinite(i), "invalid pixel coordinate"), Number.isFinite(a)) return Qf(t, [
		r,
		i,
		a,
		1
	]);
	let o = Qf(t, [
		r,
		i,
		0,
		1
	]), s = Qf(t, [
		r,
		i,
		1,
		1
	]), c = o[2], l = s[2];
	return vl([], o, s, c === l ? 0 : ((n || 0) - c) / (l - c));
}
// node_modules/@math.gl/web-mercator/dist/fit-bounds.js
function Tp(e) {
	let { width: t, height: n, bounds: r, minExtent: i = 0, maxZoom: a = 24, offset: o = [0, 0] } = e, [[s, c], [l, u]] = r, d = Ep(e.padding), f = pp([s, ep(u, -up, up)]), p = pp([l, ep(c, -up, up)]), m = [Math.max(Math.abs(p[0] - f[0]), i), Math.max(Math.abs(p[1] - f[1]), i)], h = [t - d.left - d.right - Math.abs(o[0]) * 2, n - d.top - d.bottom - Math.abs(o[1]) * 2];
	rp(h[0] > 0 && h[1] > 0);
	let g = h[0] / m[0], _ = h[1] / m[1], v = (d.right - d.left) / 2 / g, y = (d.top - d.bottom) / 2 / _, b = mp([(p[0] + f[0]) / 2 + v, (p[1] + f[1]) / 2 + y]), x = Math.min(a, np(Math.abs(Math.min(g, _))));
	return rp(Number.isFinite(x)), {
		longitude: b[0],
		latitude: b[1],
		zoom: x
	};
}
function Ep(e = 0) {
	return typeof e == "number" ? {
		top: e,
		bottom: e,
		left: e,
		right: e
	} : (rp(Number.isFinite(e.top) && Number.isFinite(e.bottom) && Number.isFinite(e.left) && Number.isFinite(e.right)), e);
}
// node_modules/@math.gl/web-mercator/dist/get-bounds.js
var Dp = Math.PI / 180;
function Op(e, t = 0) {
	let { width: n, height: r, unproject: i } = e, a = { targetZ: t }, o = i([0, r], a), s = i([n, r], a), c, l;
	return (e.fovy ? .5 * e.fovy * Dp : Math.atan(.5 / e.altitude)) > (90 - e.pitch) * Dp - .01 ? (c = kp(e, 0, t), l = kp(e, n, t)) : (c = i([0, 0], a), l = i([n, 0], a)), [
		o,
		s,
		l,
		c
	];
}
function kp(e, t, n) {
	let { pixelUnprojectionMatrix: r } = e, i = Qf(r, [
		t,
		0,
		1,
		1
	]), a = Qf(r, [
		t,
		e.height,
		1,
		1
	]), o = mp(vl([], i, a, (n * e.distanceScales.unitsPerMeter[2] - i[2]) / (a[2] - i[2])));
	return o.push(n), o;
}
// node_modules/@math.gl/web-mercator/dist/normalize-viewport-props.js
var Ap = 512;
function jp(e) {
	let { width: t, height: n, pitch: r = 0 } = e, { longitude: i, latitude: a, zoom: o, bearing: s = 0 } = e;
	(i < -180 || i > 180) && (i = $f(i + 180, 360) - 180), (s < -180 || s > 180) && (s = $f(s + 180, 360) - 180);
	let c = np(n / Ap);
	if (o <= c) o = c, a = 0;
	else {
		let e = n / 2 / 2 ** o, t = mp([0, e])[1];
		if (a < t) a = t;
		else {
			let t = mp([0, Ap - e])[1];
			a > t && (a = t);
		}
	}
	return {
		width: t,
		height: n,
		longitude: i,
		latitude: a,
		zoom: o,
		pitch: r,
		bearing: s
	};
}
// node_modules/@deck.gl/core/dist/shaderlib/shadow/shadow.js
var Mp = "\nuniform shadowUniforms {\n  bool drawShadowMap;\n  bool useShadowMap;\n  vec4 color;\n  highp int lightId;\n  float lightCount;\n  mat4 viewProjectionMatrix0;\n  mat4 viewProjectionMatrix1;\n  vec4 projectCenter0;\n  vec4 projectCenter1;\n} shadow;\n", Np = `
${Mp}

const int max_lights = 2;

out vec3 shadow_vPosition[max_lights];

vec4 shadow_setVertexPosition(vec4 position_commonspace) {
  mat4 viewProjectionMatrices[max_lights];
  viewProjectionMatrices[0] = shadow.viewProjectionMatrix0;
  viewProjectionMatrices[1] = shadow.viewProjectionMatrix1;
  vec4 projectCenters[max_lights];
  projectCenters[0] = shadow.projectCenter0;
  projectCenters[1] = shadow.projectCenter1;

  if (shadow.drawShadowMap) {
    return project_common_position_to_clipspace(position_commonspace, viewProjectionMatrices[shadow.lightId], projectCenters[shadow.lightId]);
  }
  if (shadow.useShadowMap) {
    for (int i = 0; i < max_lights; i++) {
      if(i < int(shadow.lightCount)) {
        vec4 shadowMap_position = project_common_position_to_clipspace(position_commonspace, viewProjectionMatrices[i], projectCenters[i]);
        shadow_vPosition[i] = (shadowMap_position.xyz / shadowMap_position.w + 1.0) / 2.0;
      }
    }
  }
  return gl_Position;
}

`, Pp = `
${Mp}

const int max_lights = 2;
uniform sampler2D shadow_uShadowMap0;
uniform sampler2D shadow_uShadowMap1;

in vec3 shadow_vPosition[max_lights];

const vec4 bitPackShift = vec4(1.0, 255.0, 65025.0, 16581375.0);
const vec4 bitUnpackShift = 1.0 / bitPackShift;
const vec4 bitMask = vec4(1.0 / 255.0, 1.0 / 255.0, 1.0 / 255.0,  0.0);

float shadow_getShadowWeight(vec3 position, sampler2D shadowMap) {
  vec4 rgbaDepth = texture(shadowMap, position.xy);

  float z = dot(rgbaDepth, bitUnpackShift);
  return smoothstep(0.001, 0.01, position.z - z);
}

vec4 shadow_filterShadowColor(vec4 color) {
  if (shadow.drawShadowMap) {
    vec4 rgbaDepth = fract(gl_FragCoord.z * bitPackShift);
    rgbaDepth -= rgbaDepth.gbaa * bitMask;
    return rgbaDepth;
  }
  if (shadow.useShadowMap) {
    float shadowAlpha = 0.0;
    shadowAlpha += shadow_getShadowWeight(shadow_vPosition[0], shadow_uShadowMap0);
    if(shadow.lightCount > 1.0) {
      shadowAlpha += shadow_getShadowWeight(shadow_vPosition[1], shadow_uShadowMap1);
    }
    shadowAlpha *= shadow.color.a / shadow.lightCount;
    float blendedAlpha = shadowAlpha + color.a * (1.0 - shadowAlpha);

    return vec4(
      mix(color.rgb, shadow.color.rgb, shadowAlpha / blendedAlpha),
      blendedAlpha
    );
  }
  return color;
}

`, Fp = Pf(Bp), Ip = Pf(Vp), Lp = [
	0,
	0,
	0,
	1
], Rp = [
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	0
];
function zp(e, t) {
	let [n, r, i] = e, a = wp([
		n,
		r,
		i
	], t);
	return Number.isFinite(i) ? a : [
		a[0],
		a[1],
		0
	];
}
function Bp({ viewport: e, center: t }) {
	return new pu(e.viewProjectionMatrix).invert().transform(t);
}
function Vp({ viewport: e, shadowMatrices: t }) {
	let n = [], r = e.pixelUnprojectionMatrix, i = e.isGeospatial ? void 0 : 1, a = [
		[
			0,
			0,
			i
		],
		[
			e.width,
			0,
			i
		],
		[
			0,
			e.height,
			i
		],
		[
			e.width,
			e.height,
			i
		],
		[
			0,
			0,
			-1
		],
		[
			e.width,
			0,
			-1
		],
		[
			0,
			e.height,
			-1
		],
		[
			e.width,
			e.height,
			-1
		]
	].map((e) => zp(e, r));
	for (let r of t) {
		let t = r.clone().translate(new Rl(e.center).negate()), i = a.map((e) => t.transform(e)), o = new pu().ortho({
			left: Math.min(...i.map((e) => e[0])),
			right: Math.max(...i.map((e) => e[0])),
			bottom: Math.min(...i.map((e) => e[1])),
			top: Math.max(...i.map((e) => e[1])),
			near: Math.min(...i.map((e) => -e[2])),
			far: Math.max(...i.map((e) => -e[2]))
		});
		n.push(o.multiplyRight(r));
	}
	return n;
}
function Hp(e) {
	let { shadowEnabled: t = !0, project: n } = e;
	if (!t || !n || !e.shadowMatrices || !e.shadowMatrices.length) return {
		drawShadowMap: !1,
		useShadowMap: !1,
		shadow_uShadowMap0: e.dummyShadowMap,
		shadow_uShadowMap1: e.dummyShadowMap
	};
	let r = Yf.getUniforms(n), i = Fp({
		viewport: n.viewport,
		center: r.center
	}), a = [], o = Ip({
		shadowMatrices: e.shadowMatrices,
		viewport: n.viewport
	}).slice();
	for (let t = 0; t < e.shadowMatrices.length; t++) {
		let e = o[t], s = e.clone().translate(new Rl(n.viewport.center).negate());
		r.coordinateSystem === Z.LNGLAT && r.projectionMode === kf.WEB_MERCATOR ? (o[t] = s, a[t] = i) : (o[t] = e.clone().multiplyRight(Rp), a[t] = s.transform(i));
	}
	let s = {
		drawShadowMap: !!e.drawToShadowMap,
		useShadowMap: e.shadowMaps ? e.shadowMaps.length > 0 : !1,
		color: e.shadowColor || Lp,
		lightId: e.shadowLightId || 0,
		lightCount: e.shadowMatrices.length,
		shadow_uShadowMap0: e.dummyShadowMap,
		shadow_uShadowMap1: e.dummyShadowMap
	};
	for (let e = 0; e < o.length; e++) s[`viewProjectionMatrix${e}`] = o[e], s[`projectCenter${e}`] = a[e];
	for (let t = 0; t < 2; t++) s[`shadow_uShadowMap${t}`] = e.shadowMaps && e.shadowMaps[t] || e.dummyShadowMap;
	return s;
}
var Up = {
	name: "shadow",
	dependencies: [Yf],
	vs: Np,
	fs: Pp,
	inject: {
		"vs:DECKGL_FILTER_GL_POSITION": "\n    position = shadow_setVertexPosition(geometry.position);\n    ",
		"fs:DECKGL_FILTER_COLOR": "\n    color = shadow_filterShadowColor(color);\n    "
	},
	getUniforms: Hp,
	uniformTypes: {
		drawShadowMap: "f32",
		useShadowMap: "f32",
		color: "vec4<f32>",
		lightId: "i32",
		lightCount: "f32",
		viewProjectionMatrix0: "mat4x4<f32>",
		viewProjectionMatrix1: "mat4x4<f32>",
		projectCenter0: "vec4<f32>",
		projectCenter1: "vec4<f32>"
	}
}, Wp = {
	...Tu,
	defaultUniforms: {
		...Tu.defaultUniforms,
		useFloatColors: !1
	},
	inject: {
		"vs:DECKGL_FILTER_GL_POSITION": "\n    // for picking depth values\n    picking_setPickingAttribute(position.z / position.w);\n  ",
		"vs:DECKGL_FILTER_COLOR": "\n  picking_setPickingColor(geometry.pickingColor);\n  ",
		"fs:DECKGL_FILTER_COLOR": {
			order: 99,
			injection: "\n  // use highlight color if this fragment belongs to the selected object.\n  color = picking_filterHighlightColor(color);\n\n  // use picking color if rendering to picking FBO.\n  color = picking_filterPickingColor(color);\n    "
		}
	}
}, Gp = [Hu], Kp = [
	"vs:DECKGL_FILTER_SIZE(inout vec3 size, VertexGeometry geometry)",
	"vs:DECKGL_FILTER_GL_POSITION(inout vec4 position, VertexGeometry geometry)",
	"vs:DECKGL_FILTER_COLOR(inout vec4 color, VertexGeometry geometry)",
	"fs:DECKGL_FILTER_COLOR(inout vec4 color, FragmentGeometry geometry)"
], qp = [];
function Jp(e) {
	let t = Bi.getDefaultShaderAssembler();
	for (let e of Gp) t.addDefaultModule(e);
	let n = e === "glsl" ? Kp : qp;
	for (let e of n) t.addShaderHook(e);
	return t;
}
// node_modules/@deck.gl/core/dist/effects/lighting/ambient-light.js
var Yp = [
	255,
	255,
	255
], Xp = 1, Zp = 0, Qp = class {
	constructor(e = {}) {
		this.type = "ambient";
		let { color: t = Yp } = e, { intensity: n = Xp } = e;
		this.id = e.id || `ambient-${Zp++}`, this.color = t, this.intensity = n;
	}
}, $p = [
	255,
	255,
	255
], em = 1, tm = [
	0,
	0,
	-1
], nm = 0, rm = class {
	constructor(e = {}) {
		this.type = "directional";
		let { color: t = $p } = e, { intensity: n = em } = e, { direction: r = tm } = e, { _shadow: i = !1 } = e;
		this.id = e.id || `directional-${nm++}`, this.color = t, this.intensity = n, this.type = "directional", this.direction = new Rl(r).normalize().toArray(), this.shadow = i;
	}
	getProjectedLight(e) {
		return this;
	}
}, im = class {
	constructor(e, t = { id: "pass" }) {
		let { id: n } = t;
		this.id = n, this.device = e, this.props = { ...t };
	}
	setProps(e) {
		Object.assign(this.props, e);
	}
	render(e) {}
	cleanup() {}
}, am = class extends im {
	constructor() {
		super(...arguments), this._lastRenderIndex = -1;
	}
	render(e) {
		let [t, n] = this.device.canvasContext.getDrawingBufferSize(), r = e.clearCanvas ?? !0, i = e.clearColor ?? (r ? [
			0,
			0,
			0,
			0
		] : !1), a = r ? 1 : !1, o = r ? 0 : !1, s = e.colorMask ?? 15, c = { viewport: [
			0,
			0,
			t,
			n
		] };
		e.colorMask && (c.colorMask = s), e.scissorRect && (c.scissorRect = e.scissorRect);
		let l = this.device.beginRenderPass({
			framebuffer: e.target,
			parameters: c,
			clearColor: i,
			clearDepth: a,
			clearStencil: o
		});
		try {
			return this._drawLayers(l, e);
		} finally {
			l.end(), this.device.submit();
		}
	}
	_drawLayers(e, t) {
		let { target: n, shaderModuleProps: r, viewports: i, views: a, onViewportActive: o, clearStack: s = !0 } = t;
		t.pass = t.pass || "unknown", s && (this._lastRenderIndex = -1);
		let c = [];
		for (let s of i) {
			let i = a && a[s.id];
			o?.(s);
			let l = this._getDrawLayerParams(s, t), u = s.subViewports || [s];
			for (let a of u) {
				let o = this._drawLayersInViewport(e, {
					target: n,
					shaderModuleProps: r,
					viewport: a,
					view: i,
					pass: t.pass,
					layers: t.layers
				}, l);
				c.push(o);
			}
		}
		return c;
	}
	_getDrawLayerParams(e, { layers: t, pass: n, isPicking: r = !1, layerFilter: i, cullRect: a, effects: o, shaderModuleProps: s }, c = !1) {
		let l = [], u = om(this._lastRenderIndex + 1), d = {
			layer: t[0],
			viewport: e,
			isPicking: r,
			renderPass: n,
			cullRect: a
		}, f = {};
		for (let r = 0; r < t.length; r++) {
			let a = t[r], p = this._shouldDrawLayer(a, d, i, f), m = { shouldDrawLayer: p };
			p && !c && (m.shouldDrawLayer = !0, m.layerRenderIndex = u(a, p), m.shaderModuleProps = this._getShaderModuleProps(a, o, n, s), m.layerParameters = {
				...a.context.deck?.props.parameters,
				...this.getLayerParameters(a, r, e)
			}), l[r] = m;
		}
		return l;
	}
	_drawLayersInViewport(e, { layers: t, shaderModuleProps: n, pass: r, target: i, viewport: a, view: o }, s) {
		let c = sm(this.device, {
			shaderModuleProps: n,
			target: i,
			viewport: a
		});
		if (o && o.props.clear) {
			let e = o.props.clear === !0 ? {
				color: !0,
				depth: !0
			} : o.props.clear;
			this.device.beginRenderPass({
				framebuffer: i,
				parameters: {
					viewport: c,
					scissorRect: c
				},
				clearColor: e.color ? [
					0,
					0,
					0,
					0
				] : !1,
				clearDepth: e.depth ? 1 : !1
			}).end();
		}
		let l = {
			totalCount: t.length,
			visibleCount: 0,
			compositeCount: 0,
			pickableCount: 0
		};
		e.setParameters({ viewport: c });
		for (let n = 0; n < t.length; n++) {
			let i = t[n], o = s[n], { shouldDrawLayer: c } = o;
			if (c && i.props.pickable && l.pickableCount++, i.isComposite && l.compositeCount++, i.isDrawable && o.shouldDrawLayer) {
				let { layerRenderIndex: t, shaderModuleProps: n, layerParameters: s } = o;
				l.visibleCount++, this._lastRenderIndex = Math.max(this._lastRenderIndex, t), n.project && (n.project.viewport = a), i.context.renderPass = e;
				try {
					i._drawLayer({
						renderPass: e,
						shaderModuleProps: n,
						uniforms: { layerIndex: t },
						parameters: s
					});
				} catch (e) {
					i.raiseError(e, `drawing ${i} to ${r}`);
				}
			}
		}
		return l;
	}
	shouldDrawLayer(e) {
		return !0;
	}
	getShaderModuleProps(e, t, n) {
		return null;
	}
	getLayerParameters(e, t, n) {
		return e.props.parameters;
	}
	_shouldDrawLayer(e, t, n, r) {
		if (!(e.props.visible && this.shouldDrawLayer(e))) return !1;
		t.layer = e;
		let i = e.parent;
		for (; i;) {
			if (!i.props.visible || !i.filterSubLayer(t)) return !1;
			t.layer = i, i = i.parent;
		}
		if (n) {
			let e = t.layer.id;
			if (e in r || (r[e] = n(t)), !r[e]) return !1;
		}
		return e.activateViewport(t.viewport), !0;
	}
	_getShaderModuleProps(e, t, n, r) {
		let i = this.device.canvasContext.cssToDeviceRatio(), a = e.internalState?.propsInTransition || e.props, o = {
			layer: a,
			picking: { isActive: !1 },
			project: {
				viewport: e.context.viewport,
				devicePixelRatio: i,
				modelMatrix: a.modelMatrix,
				coordinateSystem: a.coordinateSystem,
				coordinateOrigin: a.coordinateOrigin,
				autoWrapLongitude: e.wrapLongitude
			}
		};
		if (t) for (let n of t) cm(o, n.getShaderModuleProps?.(e, o));
		return cm(o, this.getShaderModuleProps(e, t, o), r);
	}
};
function om(e = 0, t = {}) {
	let n = {}, r = (i, a) => {
		let o = i.props._offset, s = i.id, c = i.parent && i.parent.id, l;
		if (c && !(c in t) && r(i.parent, !1), c in n) {
			let e = n[c] = n[c] || om(t[c], t);
			l = e(i, a), n[s] = e;
		} else Number.isFinite(o) ? (l = o + (t[c] || 0), n[s] = null) : l = e;
		return a && l >= e && (e = l + 1), t[s] = l, l;
	};
	return r;
}
function sm(e, { shaderModuleProps: t, target: n, viewport: r }) {
	let i = t?.project?.devicePixelRatio ?? e.canvasContext.cssToDeviceRatio(), [, a] = e.canvasContext.getDrawingBufferSize(), o = n ? n.height : a, s = r;
	return [
		s.x * i,
		o - (s.y + s.height) * i,
		s.width * i,
		s.height * i
	];
}
function cm(e, ...t) {
	for (let n of t) if (n) for (let t in n) e[t] ? Object.assign(e[t], n[t]) : e[t] = n[t];
	return e;
}
// node_modules/@deck.gl/core/dist/passes/shadow-pass.js
var lm = class extends am {
	constructor(e, t) {
		super(e, t);
		let n = e.createTexture({
			format: "rgba8unorm",
			width: 1,
			height: 1,
			sampler: {
				minFilter: "linear",
				magFilter: "linear",
				addressModeU: "clamp-to-edge",
				addressModeV: "clamp-to-edge"
			},
			mipmaps: !0
		}), r = e.createTexture({
			format: "depth16unorm",
			width: 1,
			height: 1,
			mipmaps: !1
		});
		this.fbo = e.createFramebuffer({
			id: "shadowmap",
			width: 1,
			height: 1,
			colorAttachments: [n],
			depthStencilAttachment: r
		});
	}
	delete() {
		this.fbo &&= (this.fbo.destroy(), null);
	}
	getShadowMap() {
		return this.fbo.colorAttachments[0].texture;
	}
	render(e) {
		let t = this.fbo, n = this.device.canvasContext.cssToDeviceRatio(), r = e.viewports[0], i = r.width * n, a = r.height * n, o = [
			1,
			1,
			1,
			1
		];
		(i !== t.width || a !== t.height) && t.resize({
			width: i,
			height: a
		}), super.render({
			...e,
			clearColor: o,
			target: t,
			pass: "shadow"
		});
	}
	getLayerParameters(e, t, n) {
		return {
			...e.props.parameters,
			blend: !1,
			depthWriteEnabled: !0,
			depthCompare: "less-equal"
		};
	}
	shouldDrawLayer(e) {
		return e.props.shadowEnabled !== !1;
	}
	getShaderModuleProps(e, t, n) {
		return { shadow: {
			project: n.project,
			drawToShadowMap: !0
		} };
	}
}, um = {
	color: [
		255,
		255,
		255
	],
	intensity: 1
}, dm = [{
	color: [
		255,
		255,
		255
	],
	intensity: 1,
	direction: [
		-1,
		3,
		-1
	]
}, {
	color: [
		255,
		255,
		255
	],
	intensity: .9,
	direction: [
		1,
		-8,
		-2.5
	]
}], fm = [
	0,
	0,
	0,
	200 / 255
], pm = class {
	constructor(e = {}) {
		this.id = "lighting-effect", this.shadowColor = fm, this.shadow = !1, this.directionalLights = [], this.pointLights = [], this.shadowPasses = [], this.dummyShadowMap = null, this.setProps(e);
	}
	setup(e) {
		this.context = e;
		let { device: t, deck: n } = e;
		this.shadow && !this.dummyShadowMap && (this._createShadowPasses(t), n._addDefaultShaderModule(Up), this.dummyShadowMap = t.createTexture({
			width: 1,
			height: 1
		}));
	}
	setProps(e) {
		this.ambientLight = void 0, this.directionalLights = [], this.pointLights = [];
		for (let t in e) {
			let n = e[t];
			switch (n.type) {
				case "ambient":
					this.ambientLight = n;
					break;
				case "directional":
					this.directionalLights.push(n);
					break;
				case "point": this.pointLights.push(n);
			}
		}
		this._applyDefaultLights(), this.shadow = this.directionalLights.some((e) => e.shadow), this.context && this.setup(this.context), this.props = e;
	}
	preRender({ layers: e, layerFilter: t, viewports: n, onViewportActive: r, views: i }) {
		if (this.shadow) {
			this.shadowMatrices = this._calculateMatrices();
			for (let a = 0; a < this.shadowPasses.length; a++) this.shadowPasses[a].render({
				layers: e,
				layerFilter: t,
				viewports: n,
				onViewportActive: r,
				views: i,
				shaderModuleProps: { shadow: {
					shadowLightId: a,
					dummyShadowMap: this.dummyShadowMap,
					shadowMatrices: this.shadowMatrices
				} }
			});
		}
	}
	getShaderModuleProps(e, t) {
		let n = this.shadow ? {
			project: t.project,
			shadowMaps: this.shadowPasses.map((e) => e.getShadowMap()),
			dummyShadowMap: this.dummyShadowMap,
			shadowColor: this.shadowColor,
			shadowMatrices: this.shadowMatrices
		} : {}, r = {
			enabled: !0,
			ambientLight: this.ambientLight,
			directionalLights: this.directionalLights.map((t) => t.getProjectedLight({ layer: e })),
			pointLights: this.pointLights.map((t) => t.getProjectedLight({ layer: e }))
		}, i = e.props.material;
		return {
			shadow: n,
			lighting: r,
			phongMaterial: i,
			gouraudMaterial: i
		};
	}
	cleanup(e) {
		for (let e of this.shadowPasses) e.delete();
		this.shadowPasses.length = 0, this.dummyShadowMap && (this.dummyShadowMap.destroy(), this.dummyShadowMap = null, e.deck._removeDefaultShaderModule(Up));
	}
	_calculateMatrices() {
		let e = [];
		for (let t of this.directionalLights) {
			let n = new pu().lookAt({ eye: new Rl(t.direction).negate() });
			e.push(n);
		}
		return e;
	}
	_createShadowPasses(e) {
		for (let t = 0; t < this.directionalLights.length; t++) {
			let n = new lm(e);
			this.shadowPasses[t] = n;
		}
	}
	_applyDefaultLights() {
		let { ambientLight: e, pointLights: t, directionalLights: n } = this;
		!e && t.length === 0 && n.length === 0 && (this.ambientLight = new Qp(um), this.directionalLights.push(new rm(dm[0]), new rm(dm[1])));
	}
}, mm = new class {
	constructor(e = {}) {
		this._pool = [], this.opts = {
			overAlloc: 2,
			poolSize: 100
		}, this.setOptions(e);
	}
	setOptions(e) {
		Object.assign(this.opts, e);
	}
	allocate(e, t, { size: n = 1, type: r, padding: i = 0, copy: a = !1, initialize: o = !1, maxCount: s }) {
		let c = r || e && e.constructor || Float32Array, l = t * n + i;
		if (ArrayBuffer.isView(e)) {
			if (l <= e.length) return e;
			if (l * e.BYTES_PER_ELEMENT <= e.buffer.byteLength) return new c(e.buffer, 0, l);
		}
		let u = Infinity;
		s && (u = s * n + i);
		let d = this._allocate(c, l, o, u);
		return e && a ? d.set(e) : o || d.fill(0, 0, 4), this._release(e), d;
	}
	release(e) {
		this._release(e);
	}
	_allocate(e, t, n, r) {
		let i = Math.max(Math.ceil(t * this.opts.overAlloc), 1);
		i > r && (i = r);
		let a = this._pool, o = e.BYTES_PER_ELEMENT * i, s = a.findIndex((e) => e.byteLength >= o);
		if (s >= 0) {
			let t = new e(a.splice(s, 1)[0], 0, i);
			return n && t.fill(0), t;
		}
		return new e(i);
	}
	_release(e) {
		if (!ArrayBuffer.isView(e)) return;
		let t = this._pool, { buffer: n } = e, { byteLength: r } = n, i = t.findIndex((e) => e.byteLength >= r);
		i < 0 ? t.push(n) : (i > 0 || t.length < this.opts.poolSize) && t.splice(i, 0, n), t.length > this.opts.poolSize && t.shift();
	}
}();
// node_modules/@deck.gl/core/dist/utils/math-utils.js
function hm() {
	return [
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1
	];
}
function gm(e) {
	return [
		e[12],
		e[13],
		e[14]
	];
}
function _m(e) {
	return {
		left: ym(e[3] + e[0], e[7] + e[4], e[11] + e[8], e[15] + e[12]),
		right: ym(e[3] - e[0], e[7] - e[4], e[11] - e[8], e[15] - e[12]),
		bottom: ym(e[3] + e[1], e[7] + e[5], e[11] + e[9], e[15] + e[13]),
		top: ym(e[3] - e[1], e[7] - e[5], e[11] - e[9], e[15] - e[13]),
		near: ym(e[3] + e[2], e[7] + e[6], e[11] + e[10], e[15] + e[14]),
		far: ym(e[3] - e[2], e[7] - e[6], e[11] - e[10], e[15] - e[14])
	};
}
var vm = new Rl();
function ym(e, t, n, r) {
	vm.set(e, t, n);
	let i = vm.len();
	return {
		distance: r / i,
		normal: new Rl(-e / i, -t / i, -n / i)
	};
}
function bm(e) {
	return e - Math.fround(e);
}
var xm;
function Sm(e, t) {
	let { size: n = 1, startIndex: r = 0 } = t, i = t.endIndex === void 0 ? e.length : t.endIndex, a = (i - r) / n;
	xm = mm.allocate(xm, a, {
		type: Float32Array,
		size: n * 2
	});
	let o = r, s = 0;
	for (; o < i;) {
		for (let t = 0; t < n; t++) {
			let r = e[o++];
			xm[s + t] = r, xm[s + t + n] = bm(r);
		}
		s += n * 2;
	}
	return xm.subarray(0, a * n * 2);
}
function Cm(e) {
	let t = null, n = !1;
	for (let r of e) r && (t ? (n ||= (t = [[t[0][0], t[0][1]], [t[1][0], t[1][1]]], !0), t[0][0] = Math.min(t[0][0], r[0][0]), t[0][1] = Math.min(t[0][1], r[0][1]), t[1][0] = Math.max(t[1][0], r[1][0]), t[1][1] = Math.max(t[1][1], r[1][1])) : t = r);
	return t;
}
// node_modules/@deck.gl/core/dist/viewports/viewport.js
var wm = Math.PI / 180, Tm = hm(), Em = [
	0,
	0,
	0
], Dm = {
	unitsPerMeter: [
		1,
		1,
		1
	],
	metersPerUnit: [
		1,
		1,
		1
	]
};
function Om({ width: e, height: t, orthographic: n, fovyRadians: r, focalDistance: i, padding: a, near: o, far: s }) {
	let c = e / t, l = n ? new pu().orthographic({
		fovy: r,
		aspect: c,
		focalDistance: i,
		near: o,
		far: s
	}) : new pu().perspective({
		fovy: r,
		aspect: c,
		near: o,
		far: s
	});
	if (a) {
		let { left: n = 0, right: r = 0, top: i = 0, bottom: o = 0 } = a, s = nl((n + e - r) / 2, 0, e) - e / 2, c = nl((i + t - o) / 2, 0, t) - t / 2;
		l[8] -= s * 2 / e, l[9] += c * 2 / t;
	}
	return l;
}
var km = class e {
	constructor(e = {}) {
		this._frustumPlanes = {}, this.id = e.id || this.constructor.displayName || "viewport", this.x = e.x || 0, this.y = e.y || 0, this.width = e.width || 1, this.height = e.height || 1, this.zoom = e.zoom || 0, this.padding = e.padding, this.distanceScales = e.distanceScales || Dm, this.focalDistance = e.focalDistance || 1, this.position = e.position || Em, this.modelMatrix = e.modelMatrix || null;
		let { longitude: t, latitude: n } = e;
		this.isGeospatial = Number.isFinite(n) && Number.isFinite(t), this._initProps(e), this._initMatrices(e), this.equals = this.equals.bind(this), this.project = this.project.bind(this), this.unproject = this.unproject.bind(this), this.projectPosition = this.projectPosition.bind(this), this.unprojectPosition = this.unprojectPosition.bind(this), this.projectFlat = this.projectFlat.bind(this), this.unprojectFlat = this.unprojectFlat.bind(this);
	}
	get subViewports() {
		return null;
	}
	get metersPerPixel() {
		return this.distanceScales.metersPerUnit[2] / this.scale;
	}
	get projectionMode() {
		return this.isGeospatial ? this.zoom < 12 ? kf.WEB_MERCATOR : kf.WEB_MERCATOR_AUTO_OFFSET : kf.IDENTITY;
	}
	equals(t) {
		return t instanceof e ? this === t || t.width === this.width && t.height === this.height && t.scale === this.scale && il(t.projectionMatrix, this.projectionMatrix) && il(t.viewMatrix, this.viewMatrix) : !1;
	}
	project(e, { topLeft: t = !0 } = {}) {
		let n = Cp(this.projectPosition(e), this.pixelProjectionMatrix), [r, i] = n, a = t ? i : this.height - i;
		return e.length === 2 ? [r, a] : [
			r,
			a,
			n[2]
		];
	}
	unproject(e, { topLeft: t = !0, targetZ: n } = {}) {
		let [r, i, a] = e, o = t ? i : this.height - i, s = n && n * this.distanceScales.unitsPerMeter[2], c = wp([
			r,
			o,
			a
		], this.pixelUnprojectionMatrix, s), [l, u, d] = this.unprojectPosition(c);
		return Number.isFinite(a) ? [
			l,
			u,
			d
		] : Number.isFinite(n) ? [
			l,
			u,
			n
		] : [l, u];
	}
	projectPosition(e) {
		let [t, n] = this.projectFlat(e);
		return [
			t,
			n,
			(e[2] || 0) * this.distanceScales.unitsPerMeter[2]
		];
	}
	unprojectPosition(e) {
		let [t, n] = this.unprojectFlat(e);
		return [
			t,
			n,
			(e[2] || 0) * this.distanceScales.metersPerUnit[2]
		];
	}
	projectFlat(e) {
		if (this.isGeospatial) {
			let t = pp(e);
			return t[1] = nl(t[1], -318, 830), t;
		}
		return e;
	}
	unprojectFlat(e) {
		return this.isGeospatial ? mp(e) : e;
	}
	getBounds(e = {}) {
		let t = { targetZ: e.z || 0 }, n = this.unproject([0, 0], t), r = this.unproject([this.width, 0], t), i = this.unproject([0, this.height], t), a = this.unproject([this.width, this.height], t);
		return [
			Math.min(n[0], r[0], i[0], a[0]),
			Math.min(n[1], r[1], i[1], a[1]),
			Math.max(n[0], r[0], i[0], a[0]),
			Math.max(n[1], r[1], i[1], a[1])
		];
	}
	getDistanceScales(e) {
		return e && this.isGeospatial ? _p({
			longitude: e[0],
			latitude: e[1],
			highPrecision: !0
		}) : this.distanceScales;
	}
	containsPixel({ x: e, y: t, width: n = 1, height: r = 1 }) {
		return e < this.x + this.width && this.x < e + n && t < this.y + this.height && this.y < t + r;
	}
	getFrustumPlanes() {
		return this._frustumPlanes.near || Object.assign(this._frustumPlanes, _m(this.viewProjectionMatrix)), this._frustumPlanes;
	}
	panByPosition(e, t) {
		return null;
	}
	_initProps(e) {
		let t = e.longitude, n = e.latitude;
		this.isGeospatial && (Number.isFinite(e.zoom) || (this.zoom = hp({ latitude: n }) + Math.log2(this.focalDistance)), this.distanceScales = e.distanceScales || _p({
			latitude: n,
			longitude: t
		}));
		let r = 2 ** this.zoom;
		this.scale = r;
		let { position: i, modelMatrix: a } = e, o = Em;
		if (i && (o = a ? new pu(a).transformAsVector(i, []) : i), this.isGeospatial) {
			let e = this.projectPosition([
				t,
				n,
				0
			]);
			this.center = new Rl(o).scale(this.distanceScales.unitsPerMeter).add(e);
		} else this.center = this.projectPosition(o);
	}
	_initMatrices(e) {
		let { viewMatrix: t = Tm, projectionMatrix: n = null, orthographic: r = !1, fovyRadians: i, fovy: a = 75, near: o = .1, far: s = 1e3, padding: c = null, focalDistance: l = 1 } = e;
		this.viewMatrixUncentered = t, this.viewMatrix = new pu().multiplyRight(t).translate(new Rl(this.center).negate()), this.projectionMatrix = n || Om({
			width: this.width,
			height: this.height,
			orthographic: r,
			fovyRadians: i || a * wm,
			focalDistance: l,
			padding: c,
			near: o,
			far: s
		});
		let u = hm();
		Wl(u, u, this.projectionMatrix), Wl(u, u, this.viewMatrix), this.viewProjectionMatrix = u, this.viewMatrixInverse = Hl([], this.viewMatrix) || this.viewMatrix, this.cameraPosition = gm(this.viewMatrixInverse);
		let d = hm(), f = hm();
		Kl(d, d, [
			this.width / 2,
			-this.height / 2,
			1
		]), Gl(d, d, [
			1,
			-1,
			0
		]), Wl(f, d, this.viewProjectionMatrix), this.pixelProjectionMatrix = f, this.pixelUnprojectionMatrix = Hl(hm(), this.pixelProjectionMatrix), this.pixelUnprojectionMatrix || E.warn("Pixel project matrix not invertible")();
	}
};
km.displayName = "Viewport";
// node_modules/@deck.gl/core/dist/viewports/web-mercator-viewport.js
var Am = class e extends km {
	constructor(e = {}) {
		let { latitude: t = 0, longitude: n = 0, zoom: r = 0, pitch: i = 0, bearing: a = 0, nearZMultiplier: o = .1, farZMultiplier: s = 1.01, nearZ: c, farZ: l, orthographic: u = !1, projectionMatrix: d, repeat: f = !1, worldOffset: p = 0, position: m, padding: h, legacyMeterSizes: g = !1 } = e, { width: _, height: v, altitude: y = 1.5 } = e, b = 2 ** r;
		_ ||= 1, v ||= 1;
		let x, S = null;
		if (d) y = d[5] / 2, x = xp(y);
		else {
			e.fovy ? (x = e.fovy, y = Sp(x)) : x = xp(y);
			let n;
			if (h) {
				let { top: e = 0, bottom: t = 0 } = h;
				n = [0, nl((e + v - t) / 2, 0, v) - v / 2];
			}
			S = bp({
				width: _,
				height: v,
				scale: b,
				center: m && [
					0,
					0,
					m[2] * gp(t)
				],
				offset: n,
				pitch: i,
				fovy: x,
				nearZMultiplier: o,
				farZMultiplier: s
			}), Number.isFinite(c) && (S.near = c), Number.isFinite(l) && (S.far = l);
		}
		let C = yp({
			height: v,
			pitch: i,
			bearing: a,
			scale: b,
			altitude: y
		});
		p && (C = new pu().translate([
			512 * p,
			0,
			0
		]).multiplyLeft(C)), super({
			...e,
			width: _,
			height: v,
			viewMatrix: C,
			longitude: n,
			latitude: t,
			zoom: r,
			...S,
			fovy: x,
			focalDistance: y
		}), this.latitude = t, this.longitude = n, this.zoom = r, this.pitch = i, this.bearing = a, this.altitude = y, this.fovy = x, this.orthographic = u, this._subViewports = f ? [] : null, this._pseudoMeters = g, Object.freeze(this);
	}
	get subViewports() {
		if (this._subViewports && !this._subViewports.length) {
			let t = this.getBounds(), n = Math.floor((t[0] + 180) / 360), r = Math.ceil((t[2] - 180) / 360);
			for (let t = n; t <= r; t++) {
				let n = t ? new e({
					...this,
					worldOffset: t
				}) : this;
				this._subViewports.push(n);
			}
		}
		return this._subViewports;
	}
	projectPosition(e) {
		if (this._pseudoMeters) return super.projectPosition(e);
		let [t, n] = this.projectFlat(e);
		return [
			t,
			n,
			(e[2] || 0) * gp(e[1])
		];
	}
	unprojectPosition(e) {
		if (this._pseudoMeters) return super.unprojectPosition(e);
		let [t, n] = this.unprojectFlat(e);
		return [
			t,
			n,
			(e[2] || 0) / gp(n)
		];
	}
	addMetersToLngLat(e, t) {
		return vp(e, t);
	}
	panByPosition(e, t) {
		let n = wp(t, this.pixelUnprojectionMatrix), r = gl([], this.projectFlat(e), _l([], n)), i = gl([], this.center, r), [a, o] = this.unprojectFlat(i);
		return {
			longitude: a,
			latitude: o
		};
	}
	getBounds(e = {}) {
		let t = Op(this, e.z || 0);
		return [
			Math.min(t[0][0], t[1][0], t[2][0], t[3][0]),
			Math.min(t[0][1], t[1][1], t[2][1], t[3][1]),
			Math.max(t[0][0], t[1][0], t[2][0], t[3][0]),
			Math.max(t[0][1], t[1][1], t[2][1], t[3][1])
		];
	}
	fitBounds(t, n = {}) {
		let { width: r, height: i } = this, { longitude: a, latitude: o, zoom: s } = Tp({
			width: r,
			height: i,
			bounds: t,
			...n
		});
		return new e({
			width: r,
			height: i,
			longitude: a,
			latitude: o,
			zoom: s
		});
	}
};
Am.displayName = "WebMercatorViewport";
// node_modules/@deck.gl/core/dist/shaderlib/project/project-functions.js
var jm = [
	0,
	0,
	0
];
function Mm(e, t, n = !1) {
	let r = t.projectPosition(e);
	if (n && t instanceof Am) {
		let [n, i, a = 0] = e;
		r[2] = a * t.getDistanceScales([n, i]).unitsPerMeter[2];
	}
	return r;
}
function Nm(e) {
	let { viewport: t, modelMatrix: n, coordinateOrigin: r } = e, { coordinateSystem: i, fromCoordinateSystem: a, fromCoordinateOrigin: o } = e;
	return i === Z.DEFAULT && (i = t.isGeospatial ? Z.LNGLAT : Z.CARTESIAN), a === void 0 && (a = i), o === void 0 && (o = r), {
		viewport: t,
		coordinateSystem: i,
		coordinateOrigin: r,
		modelMatrix: n,
		fromCoordinateSystem: a,
		fromCoordinateOrigin: o
	};
}
function Pm(e, { viewport: t, modelMatrix: n, coordinateSystem: r, coordinateOrigin: i, offsetMode: a }) {
	let [o, s, c = 0] = e;
	switch (n && ([o, s, c] = ou([], [
		o,
		s,
		c,
		1
	], n)), r) {
		case Z.LNGLAT: return Mm([
			o,
			s,
			c
		], t, a);
		case Z.LNGLAT_OFFSETS: return Mm([
			o + i[0],
			s + i[1],
			c + (i[2] || 0)
		], t, a);
		case Z.METER_OFFSETS: return Mm(vp(i, [
			o,
			s,
			c
		]), t, a);
		case Z.CARTESIAN:
		default: return t.isGeospatial ? [
			o + i[0],
			s + i[1],
			c + i[2]
		] : t.projectPosition([
			o,
			s,
			c
		]);
	}
}
function Fm(e, t) {
	let { viewport: n, coordinateSystem: r, coordinateOrigin: i, modelMatrix: a, fromCoordinateSystem: o, fromCoordinateOrigin: s } = Nm(t), { autoOffset: c = !0 } = t, { geospatialOrigin: l = jm, shaderCoordinateOrigin: u = jm, offsetMode: d = !1 } = c ? Vf(n, r, i) : {}, f = Pm(e, {
		viewport: n,
		modelMatrix: a,
		coordinateSystem: o,
		coordinateOrigin: s,
		offsetMode: d
	});
	return d && Fl(f, f, n.projectPosition(l || u)), f;
}
// node_modules/@luma.gl/engine/dist/animation/timeline.js
var Im = 1, Lm = 1, Rm = class {
	time = 0;
	channels = /* @__PURE__ */ new Map();
	animations = /* @__PURE__ */ new Map();
	playing = !1;
	lastEngineTime = -1;
	constructor() {}
	addChannel(e) {
		let { delay: t = 0, duration: n = Infinity, rate: r = 1, repeat: i = 1 } = e, a = Im++, o = {
			time: 0,
			delay: t,
			duration: n,
			rate: r,
			repeat: i
		};
		return this._setChannelTime(o, this.time), this.channels.set(a, o), a;
	}
	removeChannel(e) {
		this.channels.delete(e);
		for (let [t, n] of this.animations) n.channel === e && this.detachAnimation(t);
	}
	isFinished(e) {
		let t = this.channels.get(e);
		return t !== void 0 && this.time >= t.delay + t.duration * t.repeat;
	}
	getTime(e) {
		if (e === void 0) return this.time;
		let t = this.channels.get(e);
		return t === void 0 ? -1 : t.time;
	}
	setTime(e) {
		this.time = Math.max(0, e);
		let t = this.channels.values();
		for (let e of t) this._setChannelTime(e, this.time);
		let n = this.animations.values();
		for (let e of n) {
			let { animation: t, channel: n } = e;
			t.setTime(this.getTime(n));
		}
	}
	play() {
		this.playing = !0;
	}
	pause() {
		this.playing = !1, this.lastEngineTime = -1;
	}
	reset() {
		this.setTime(0);
	}
	attachAnimation(e, t) {
		let n = Lm++;
		return this.animations.set(n, {
			animation: e,
			channel: t
		}), e.setTime(this.getTime(t)), n;
	}
	detachAnimation(e) {
		this.animations.delete(e);
	}
	update(e) {
		this.playing && (this.lastEngineTime === -1 && (this.lastEngineTime = e), this.setTime(this.time + (e - this.lastEngineTime)), this.lastEngineTime = e);
	}
	_setChannelTime(e, t) {
		let n = t - e.delay;
		n >= e.duration * e.repeat ? e.time = e.duration * e.rate : (e.time = Math.max(0, n) % e.duration, e.time *= e.rate);
	}
};
// node_modules/@luma.gl/engine/dist/animation-loop/request-animation-frame.js
function zm(e) {
	return typeof window < "u" && window.requestAnimationFrame ? window.requestAnimationFrame(e) : setTimeout(e, 1e3 / 60);
}
function Bm(e) {
	return typeof window < "u" && window.cancelAnimationFrame ? window.cancelAnimationFrame(e) : clearTimeout(e);
}
// node_modules/@luma.gl/engine/dist/animation-loop/animation-loop.js
var Vm = 0, Hm = {
	device: null,
	onAddHTML: () => "",
	onInitialize: async () => null,
	onRender: () => {},
	onFinalize: () => {},
	onError: (e) => void 0,
	stats: Oa.stats.get(`animation-loop-${Vm++}`),
	useDevicePixels: !0,
	autoResizeViewport: !1,
	autoResizeDrawingBuffer: !1
}, Um = class {
	device = null;
	canvas = null;
	props;
	animationProps = null;
	timeline = null;
	stats;
	cpuTime;
	gpuTime;
	frameRate;
	display;
	needsRedraw = "initialized";
	_initialized = !1;
	_running = !1;
	_animationFrameId = null;
	_nextFramePromise = null;
	_resolveNextFrame = null;
	_cpuStartTime = 0;
	_error = null;
	constructor(e) {
		if (this.props = {
			...Hm,
			...e
		}, e = this.props, !e.device) throw Error("No device provided");
		let { useDevicePixels: t = !0 } = this.props;
		this.stats = e.stats || new mt({ id: "animation-loop-stats" }), this.cpuTime = this.stats.get("CPU Time"), this.gpuTime = this.stats.get("GPU Time"), this.frameRate = this.stats.get("Frame Rate"), this.setProps({
			autoResizeViewport: e.autoResizeViewport,
			autoResizeDrawingBuffer: e.autoResizeDrawingBuffer,
			useDevicePixels: t
		}), this.start = this.start.bind(this), this.stop = this.stop.bind(this), this._onMousemove = this._onMousemove.bind(this), this._onMouseleave = this._onMouseleave.bind(this);
	}
	destroy() {
		this.stop(), this._setDisplay(null);
	}
	delete() {
		this.destroy();
	}
	setError(e) {
		if (this.props.onError(e), this._error = Error(), this.device?.canvasContext?.canvas instanceof HTMLCanvasElement) {
			let t = document.createElement("h1");
			t.innerHTML = e.message, t.style.position = "absolute", t.style.top = "20%", t.style.left = "10px", t.style.color = "black", t.style.backgroundColor = "red", document.body.appendChild(t);
		}
	}
	setNeedsRedraw(e) {
		return this.needsRedraw = this.needsRedraw || e, this;
	}
	setProps(e) {
		return "autoResizeViewport" in e && (this.props.autoResizeViewport = e.autoResizeViewport || !1), "autoResizeDrawingBuffer" in e && (this.props.autoResizeDrawingBuffer = e.autoResizeDrawingBuffer || !1), "useDevicePixels" in e && (this.props.useDevicePixels = e.useDevicePixels || !1), this;
	}
	async start() {
		if (this._running) return this;
		this._running = !0;
		try {
			return this._initialized || (this._initialized = !0, await this._initDevice(), this._initialize(), await this.props.onInitialize(this._getAnimationProps())), this._running ? (this._cancelAnimationFrame(), this._requestAnimationFrame(), this) : null;
		} catch (e) {
			let t = e instanceof Error ? e : /* @__PURE__ */ Error("Unknown error");
			throw this.props.onError(t), t;
		}
	}
	stop() {
		return this._running &&= (this.animationProps && !this._error && this.props.onFinalize(this.animationProps), this._cancelAnimationFrame(), this._nextFramePromise = null, this._resolveNextFrame = null, !1), this;
	}
	redraw() {
		return this.device?.isLost || this._error || (this._beginFrameTimers(), this._setupFrame(), this._updateAnimationProps(), this._renderFrame(this._getAnimationProps()), this._clearNeedsRedraw(), this._resolveNextFrame &&= (this._resolveNextFrame(this), this._nextFramePromise = null, null), this._endFrameTimers()), this;
	}
	attachTimeline(e) {
		return this.timeline = e, this.timeline;
	}
	detachTimeline() {
		this.timeline = null;
	}
	waitForRender() {
		return this.setNeedsRedraw("waitForRender"), this._nextFramePromise ||= new Promise((e) => {
			this._resolveNextFrame = e;
		}), this._nextFramePromise;
	}
	async toDataURL() {
		if (this.setNeedsRedraw("toDataURL"), await this.waitForRender(), this.canvas instanceof HTMLCanvasElement) return this.canvas.toDataURL();
		throw Error("OffscreenCanvas");
	}
	_initialize() {
		this._startEventHandling(), this._initializeAnimationProps(), this._updateAnimationProps(), this._resizeCanvasDrawingBuffer(), this._resizeViewport();
	}
	_setDisplay(e) {
		this.display && (this.display.destroy(), this.display.animationLoop = null), e && (e.animationLoop = this), this.display = e;
	}
	_requestAnimationFrame() {
		this._running && (this._animationFrameId = zm(this._animationFrame.bind(this)));
	}
	_cancelAnimationFrame() {
		this._animationFrameId !== null && (Bm(this._animationFrameId), this._animationFrameId = null);
	}
	_animationFrame() {
		this._running && (this.redraw(), this._requestAnimationFrame());
	}
	_renderFrame(e) {
		this.display ? this.display._renderFrame(e) : (this.props.onRender(this._getAnimationProps()), this.device?.submit());
	}
	_clearNeedsRedraw() {
		this.needsRedraw = !1;
	}
	_setupFrame() {
		this._resizeCanvasDrawingBuffer(), this._resizeViewport();
	}
	_initializeAnimationProps() {
		let e = this.device?.canvasContext?.canvas;
		if (!this.device || !e) throw Error("loop");
		this.animationProps = {
			animationLoop: this,
			device: this.device,
			canvas: e,
			timeline: this.timeline,
			useDevicePixels: this.props.useDevicePixels,
			needsRedraw: !1,
			width: 1,
			height: 1,
			aspect: 1,
			time: 0,
			startTime: Date.now(),
			engineTime: 0,
			tick: 0,
			tock: 0,
			_mousePosition: null
		};
	}
	_getAnimationProps() {
		if (!this.animationProps) throw Error("animationProps");
		return this.animationProps;
	}
	_updateAnimationProps() {
		if (!this.animationProps) return;
		let { width: e, height: t, aspect: n } = this._getSizeAndAspect();
		(e !== this.animationProps.width || t !== this.animationProps.height) && this.setNeedsRedraw("drawing buffer resized"), n !== this.animationProps.aspect && this.setNeedsRedraw("drawing buffer aspect changed"), this.animationProps.width = e, this.animationProps.height = t, this.animationProps.aspect = n, this.animationProps.needsRedraw = this.needsRedraw, this.animationProps.engineTime = Date.now() - this.animationProps.startTime, this.timeline && this.timeline.update(this.animationProps.engineTime), this.animationProps.tick = Math.floor(this.animationProps.time / 1e3 * 60), this.animationProps.tock++, this.animationProps.time = this.timeline ? this.timeline.getTime() : this.animationProps.engineTime;
	}
	async _initDevice() {
		if (this.device = await this.props.device, !this.device) throw Error("No device provided");
		this.canvas = this.device.canvasContext?.canvas || null;
	}
	_createInfoDiv() {
		if (this.canvas && this.props.onAddHTML) {
			let e = document.createElement("div");
			document.body.appendChild(e), e.style.position = "relative";
			let t = document.createElement("div");
			t.style.position = "absolute", t.style.left = "10px", t.style.bottom = "10px", t.style.width = "300px", t.style.background = "white", this.canvas instanceof HTMLCanvasElement && e.appendChild(this.canvas), e.appendChild(t);
			let n = this.props.onAddHTML(t);
			n && (t.innerHTML = n);
		}
	}
	_getSizeAndAspect() {
		if (!this.device) return {
			width: 1,
			height: 1,
			aspect: 1
		};
		let [e, t] = this.device?.canvasContext?.getPixelSize() || [1, 1], n = 1, r = this.device?.canvasContext?.canvas;
		return r && r.clientHeight ? n = r.clientWidth / r.clientHeight : e > 0 && t > 0 && (n = e / t), {
			width: e,
			height: t,
			aspect: n
		};
	}
	_resizeViewport() {
		this.props.autoResizeViewport && this.device.gl && this.device.gl.viewport(0, 0, this.device.gl.drawingBufferWidth, this.device.gl.drawingBufferHeight);
	}
	_resizeCanvasDrawingBuffer() {
		this.props.autoResizeDrawingBuffer && this.device?.canvasContext?.resize({ useDevicePixels: this.props.useDevicePixels });
	}
	_beginFrameTimers() {
		this.frameRate.timeEnd(), this.frameRate.timeStart(), this.cpuTime.timeStart();
	}
	_endFrameTimers() {
		this.cpuTime.timeEnd();
	}
	_startEventHandling() {
		this.canvas && (this.canvas.addEventListener("mousemove", this._onMousemove.bind(this)), this.canvas.addEventListener("mouseleave", this._onMouseleave.bind(this)));
	}
	_onMousemove(e) {
		e instanceof MouseEvent && (this._getAnimationProps()._mousePosition = [e.offsetX, e.offsetY]);
	}
	_onMouseleave(e) {
		this._getAnimationProps()._mousePosition = null;
	}
}, Wm = {};
function Gm(e = "id") {
	return Wm[e] = Wm[e] || 1, `${e}-${Wm[e]++}`;
}
// node_modules/@luma.gl/engine/dist/geometry/gpu-geometry.js
var Km = class {
	id;
	userData = {};
	topology;
	bufferLayout = [];
	vertexCount;
	indices;
	attributes;
	constructor(e) {
		if (this.id = e.id || Gm("geometry"), this.topology = e.topology, this.indices = e.indices || null, this.attributes = e.attributes, this.vertexCount = e.vertexCount, this.bufferLayout = e.bufferLayout || [], this.indices && !(this.indices.usage & k.INDEX)) throw Error("Index buffer must have INDEX usage");
	}
	destroy() {
		this.indices?.destroy();
		for (let e of Object.values(this.attributes)) e.destroy();
	}
	getVertexCount() {
		return this.vertexCount;
	}
	getAttributes() {
		return this.attributes;
	}
	getIndexes() {
		return this.indices || null;
	}
	_calculateVertexCount(e) {
		return e.byteLength / 12;
	}
};
function qm(e, t) {
	if (t instanceof Km) return t;
	let n = Jm(e, t), { attributes: r, bufferLayout: i } = Ym(e, t);
	return new Km({
		topology: t.topology || "triangle-list",
		bufferLayout: i,
		vertexCount: t.vertexCount,
		indices: n,
		attributes: r
	});
}
function Jm(e, t) {
	if (!t.indices) return;
	let n = t.indices.value;
	return e.createBuffer({
		usage: k.INDEX,
		data: n
	});
}
function Ym(e, t) {
	let n = [], r = {};
	for (let [i, a] of Object.entries(t.attributes)) {
		let t = i;
		switch (i) {
			case "POSITION":
				t = "positions";
				break;
			case "NORMAL":
				t = "normals";
				break;
			case "TEXCOORD_0":
				t = "texCoords";
				break;
			case "COLOR_0": t = "colors";
		}
		if (a) {
			r[t] = e.createBuffer({
				data: a.value,
				id: `${i}-buffer`
			});
			let { value: o, size: s, normalized: c } = a;
			n.push({
				name: t,
				format: Po(o, s, c)
			});
		}
	}
	return {
		attributes: r,
		bufferLayout: n,
		vertexCount: t._calculateVertexCount(t.attributes, t.indices)
	};
}
// node_modules/@luma.gl/engine/dist/factories/pipeline-factory.js
var Xm = class e {
	static defaultProps = { ...Xa.defaultProps };
	static getDefaultPipelineFactory(t) {
		return t._lumaData.defaultPipelineFactory = t._lumaData.defaultPipelineFactory || new e(t), t._lumaData.defaultPipelineFactory;
	}
	device;
	destroyPolicy;
	_hashCounter = 0;
	_hashes = {};
	_renderPipelineCache = {};
	_computePipelineCache = {};
	constructor(e) {
		this.device = e, this.destroyPolicy = e.props._factoryDestroyPolicy;
	}
	createRenderPipeline(e) {
		let t = {
			...Xa.defaultProps,
			...e
		}, n = this._hashRenderPipeline(t);
		if (!this._renderPipelineCache[n]) {
			let e = this.device.createRenderPipeline({
				...t,
				id: t.id ? `${t.id}-cached` : void 0
			});
			e.hash = n, this._renderPipelineCache[n] = {
				pipeline: e,
				useCount: 0
			};
		}
		return this._renderPipelineCache[n].useCount++, this._renderPipelineCache[n].pipeline;
	}
	createComputePipeline(e) {
		let t = {
			...Qa.defaultProps,
			...e
		}, n = this._hashComputePipeline(t);
		if (!this._computePipelineCache[n]) {
			let e = this.device.createComputePipeline({
				...t,
				id: t.id ? `${t.id}-cached` : void 0
			});
			e.hash = n, this._computePipelineCache[n] = {
				pipeline: e,
				useCount: 0
			};
		}
		return this._computePipelineCache[n].useCount++, this._computePipelineCache[n].pipeline;
	}
	release(e) {
		let t = e.hash, n = e instanceof Qa ? this._computePipelineCache : this._renderPipelineCache;
		n[t].useCount--, n[t].useCount === 0 && this.destroyPolicy === "unused" && (n[t].pipeline.destroy(), delete n[t]);
	}
	_hashComputePipeline(e) {
		return `${this._getHash(e.shader.source)}`;
	}
	_hashRenderPipeline(e) {
		let t = e.vs ? this._getHash(e.vs.source) : 0, n = e.fs ? this._getHash(e.fs.source) : 0, r = this._getHash(JSON.stringify(e.bufferLayout));
		switch (this.device.type) {
			case "webgl": return `${t}/${n}V-BL${r}`;
			default:
				let i = this._getHash(JSON.stringify(e.parameters));
				return `${t}/${n}V-T${e.topology}P${i}BL${r}`;
		}
	}
	_getHash(e) {
		return this._hashes[e] === void 0 && (this._hashes[e] = this._hashCounter++), this._hashes[e];
	}
}, Zm = class e {
	static defaultProps = { ...Ga.defaultProps };
	static getDefaultShaderFactory(t) {
		return t._lumaData.defaultShaderFactory ||= new e(t), t._lumaData.defaultShaderFactory;
	}
	device;
	destroyPolicy;
	_cache = {};
	constructor(e) {
		this.device = e, this.destroyPolicy = e.props._factoryDestroyPolicy;
	}
	createShader(e) {
		let t = this._hashShader(e), n = this._cache[t];
		if (!n) {
			let r = this.device.createShader({
				...e,
				id: e.id ? `${e.id}-cached` : void 0
			});
			this._cache[t] = n = {
				shader: r,
				useCount: 0
			};
		}
		return n.useCount++, n.shader;
	}
	release(e) {
		let t = this._hashShader(e), n = this._cache[t];
		n && (n.useCount--, n.useCount === 0 && this.destroyPolicy === "unused" && (delete this._cache[t], n.shader.destroy()));
	}
	_hashShader(e) {
		return `${e.stage}:${e.source}`;
	}
};
// node_modules/@luma.gl/engine/dist/debug/debug-shader-layout.js
function Qm(e, t) {
	let n = {}, r = "Values";
	if (e.attributes.length === 0 && !e.varyings?.length) return { "No attributes or varyings": { [r]: "N/A" } };
	for (let t of e.attributes) if (t) {
		let e = `${t.location} ${t.name}: ${t.type}`;
		n[`in ${e}`] = { [r]: t.stepMode || "vertex" };
	}
	for (let t of e.varyings || []) {
		let e = `${t.location} ${t.name}`;
		n[`out ${e}`] = { [r]: JSON.stringify(t) };
	}
	return n;
}
// node_modules/@luma.gl/engine/dist/debug/debug-framebuffer.js
var $m = null, eh = null;
function th(e, { id: t, minimap: n, opaque: r, top: i = "0", left: a = "0", rgbaScale: o = 1 }) {
	$m || ($m = document.createElement("canvas"), $m.id = t, $m.title = t, $m.style.zIndex = "100", $m.style.position = "absolute", $m.style.top = i, $m.style.left = a, $m.style.border = "blue 5px solid", $m.style.transform = "scaleY(-1)", document.body.appendChild($m), eh = $m.getContext("2d")), ($m.width !== e.width || $m.height !== e.height) && ($m.width = e.width / 2, $m.height = e.height / 2, $m.style.width = "400px", $m.style.height = "400px");
	let s = e.device.readPixelsToArrayWebGL(e), c = eh?.createImageData(e.width, e.height);
	if (c) {
		for (let e = 0; e < s.length; e += 4) c.data[0 + e + 0] = s[e + 0] * o, c.data[0 + e + 1] = s[e + 1] * o, c.data[0 + e + 2] = s[e + 2] * o, c.data[0 + e + 3] = r ? 255 : s[e + 3] * o;
		eh?.putImageData(c, 0, 0);
	}
}
// node_modules/@luma.gl/engine/dist/utils/deep-equal.js
function nh(e, t, n) {
	if (e === t) return !0;
	if (!n || !e || !t) return !1;
	if (Array.isArray(e)) {
		if (!Array.isArray(t) || e.length !== t.length) return !1;
		for (let r = 0; r < e.length; r++) if (!nh(e[r], t[r], n - 1)) return !1;
		return !0;
	}
	if (Array.isArray(t)) return !1;
	if (typeof e == "object" && typeof t == "object") {
		let r = Object.keys(e), i = Object.keys(t);
		if (r.length !== i.length) return !1;
		for (let i of r) if (!t.hasOwnProperty(i) || !nh(e[i], t[i], n - 1)) return !1;
		return !0;
	}
	return !1;
}
// node_modules/@luma.gl/engine/dist/model/split-uniforms-and-bindings.js
function rh(e) {
	return tr(e) || typeof e == "number" || typeof e == "boolean";
}
function ih(e) {
	let t = {
		bindings: {},
		uniforms: {}
	};
	return Object.keys(e).forEach((n) => {
		let r = e[n];
		rh(r) ? t.uniforms[n] = r : t.bindings[n] = r;
	}), t;
}
// node_modules/@luma.gl/engine/dist/shader-inputs.js
var ah = class {
	options = { disableWarnings: !1 };
	modules;
	moduleUniforms;
	moduleBindings;
	constructor(e, t) {
		Object.assign(this.options, t);
		let n = pi(Object.values(e).filter((e) => e.dependencies));
		for (let t of n) e[t.name] = t;
		D.log(1, "Creating ShaderInputs with modules", Object.keys(e))(), this.modules = e, this.moduleUniforms = {}, this.moduleBindings = {};
		for (let [t, n] of Object.entries(e)) this._addModule(n), n.name && t !== n.name && !this.options.disableWarnings && D.warn(`Module name: ${t} vs ${n.name}`)();
	}
	destroy() {}
	setProps(e) {
		for (let t of Object.keys(e)) {
			let n = t, r = e[n] || {}, i = this.modules[n];
			if (!i) {
				this.options.disableWarnings || D.warn(`Module ${t} not found`)();
				continue;
			}
			let a = this.moduleUniforms[n], o = this.moduleBindings[n], { uniforms: s, bindings: c } = ih(i.getUniforms?.(r, a) || r);
			this.moduleUniforms[n] = {
				...a,
				...s
			}, this.moduleBindings[n] = {
				...o,
				...c
			};
		}
	}
	getModules() {
		return Object.values(this.modules);
	}
	getUniformValues() {
		return this.moduleUniforms;
	}
	getBindingValues() {
		let e = {};
		for (let t of Object.values(this.moduleBindings)) Object.assign(e, t);
		return e;
	}
	getDebugTable() {
		let e = {};
		for (let [t, n] of Object.entries(this.moduleUniforms)) for (let [r, i] of Object.entries(n)) e[`${t}.${r}`] = {
			type: this.modules[t].uniformTypes?.[r],
			value: String(i)
		};
		return e;
	}
	_addModule(e) {
		let t = e.name;
		this.moduleUniforms[t] = e.defaultUniforms || {}, this.moduleBindings[t] = {};
	}
}, oh = "";
async function sh(e, t) {
	let n = new Image();
	return n.crossOrigin = t?.crossOrigin || "anonymous", n.src = e.startsWith("http") ? e : oh + e, await n.decode(), t ? await createImageBitmap(n, t) : await createImageBitmap(n);
}
// node_modules/@luma.gl/engine/dist/async-texture/async-texture.js
var ch = class {
	device;
	id;
	texture;
	sampler;
	view;
	ready;
	isReady = !1;
	destroyed = !1;
	resolveReady = () => {};
	rejectReady = () => {};
	get [Symbol.toStringTag]() {
		return "AsyncTexture";
	}
	toString() {
		return `AsyncTexture:"${this.id}"(${this.isReady ? "ready" : "loading"})`;
	}
	constructor(e, t) {
		this.device = e, this.id = t.id || Gm("async-texture"), typeof t?.data == "string" && t.dimension === "2d" && (t = {
			...t,
			data: sh(t.data)
		}), this.ready = new Promise((e, t) => {
			this.resolveReady = () => {
				this.isReady = !0, e();
			}, this.rejectReady = t;
		}), this.initAsync(t);
	}
	async initAsync(e) {
		let t = e.data, n;
		try {
			n = await lh(t);
		} catch (e) {
			this.rejectReady(e);
		}
		if (this.destroyed) return;
		let r = {
			...e,
			data: n
		};
		this.texture = this.device.createTexture(r), this.sampler = this.texture.sampler, this.view = this.texture.view, this.isReady = !0, this.resolveReady();
	}
	destroy() {
		this.texture &&= (this.texture.destroy(), null), this.destroyed = !0;
	}
	resize(e) {
		if (!this.isReady) throw Error("Cannot resize texture before it is ready");
		if (e.width === this.texture.width && e.height === this.texture.height) return !1;
		if (this.texture) {
			let t = this.texture;
			this.texture = t.clone(e), t.destroy();
		}
		return !0;
	}
};
async function lh(e) {
	if (e = await e, Array.isArray(e)) return await Promise.all(e.map(lh));
	if (e && typeof e == "object" && e.constructor === Object) {
		let t = e, n = await Promise.all(Object.values(t)), r = Object.keys(t), i = {};
		for (let e = 0; e < r.length; e++) i[r[e]] = n[e];
		return i;
	}
	return e;
}
// node_modules/@luma.gl/engine/dist/model/model.js
var uh = 2, dh = 1e4, fh = class e {
	static defaultProps = {
		...Xa.defaultProps,
		source: void 0,
		vs: null,
		fs: null,
		id: "unnamed",
		handle: void 0,
		userData: {},
		defines: {},
		modules: [],
		moduleSettings: void 0,
		geometry: null,
		indexBuffer: null,
		attributes: {},
		constantAttributes: {},
		varyings: [],
		isInstanced: void 0,
		instanceCount: 0,
		vertexCount: 0,
		shaderInputs: void 0,
		pipelineFactory: void 0,
		shaderFactory: void 0,
		transformFeedback: void 0,
		shaderAssembler: Bi.getDefaultShaderAssembler(),
		debugShaders: void 0,
		disableWarnings: void 0
	};
	device;
	id;
	source;
	vs;
	fs;
	pipelineFactory;
	shaderFactory;
	userData = {};
	parameters;
	topology;
	bufferLayout;
	isInstanced = void 0;
	instanceCount = 0;
	vertexCount;
	indexBuffer = null;
	bufferAttributes = {};
	constantAttributes = {};
	bindings = {};
	uniforms = {};
	vertexArray;
	transformFeedback = null;
	pipeline;
	shaderInputs;
	_uniformStore;
	_attributeInfos = {};
	_gpuGeometry = null;
	_getModuleUniforms;
	props;
	_pipelineNeedsUpdate = "newly created";
	_needsRedraw = "initializing";
	_destroyed = !1;
	_lastDrawTimestamp = -1;
	get [Symbol.toStringTag]() {
		return "Model";
	}
	toString() {
		return `Model(${this.id})`;
	}
	constructor(t, n) {
		this.props = {
			...e.defaultProps,
			...n
		}, n = this.props, this.id = n.id || Gm("model"), this.device = t, Object.assign(this.userData, n.userData);
		let r = Object.fromEntries(this.props.modules?.map((e) => [e.name, e]) || []), i = n.shaderInputs || new ah(r, { disableWarnings: this.props.disableWarnings });
		this.setShaderInputs(i);
		let a = mh(t), o = (this.props.modules?.length > 0 ? this.props.modules : this.shaderInputs?.getModules()) || [];
		if (this.device.type === "webgpu" && this.props.source) {
			let { source: e, getUniforms: t } = this.props.shaderAssembler.assembleWGSLShader({
				platformInfo: a,
				...this.props,
				modules: o
			});
			this.source = e, this._getModuleUniforms = t, this.props.shaderLayout ||= Xc(this.source);
		} else {
			let { vs: e, fs: t, getUniforms: n } = this.props.shaderAssembler.assembleGLSLShaderPair({
				platformInfo: a,
				...this.props,
				modules: o
			});
			this.vs = e, this.fs = t, this._getModuleUniforms = n;
		}
		this.vertexCount = this.props.vertexCount, this.instanceCount = this.props.instanceCount, this.topology = this.props.topology, this.bufferLayout = this.props.bufferLayout, this.parameters = this.props.parameters, n.geometry && this.setGeometry(n.geometry), this.pipelineFactory = n.pipelineFactory || Xm.getDefaultPipelineFactory(this.device), this.shaderFactory = n.shaderFactory || Zm.getDefaultShaderFactory(this.device), this.pipeline = this._updatePipeline(), this.vertexArray = t.createVertexArray({ renderPipeline: this.pipeline }), this._gpuGeometry && this._setGeometryAttributes(this._gpuGeometry), "isInstanced" in n && (this.isInstanced = n.isInstanced), n.instanceCount && this.setInstanceCount(n.instanceCount), n.vertexCount && this.setVertexCount(n.vertexCount), n.indexBuffer && this.setIndexBuffer(n.indexBuffer), n.attributes && this.setAttributes(n.attributes), n.constantAttributes && this.setConstantAttributes(n.constantAttributes), n.bindings && this.setBindings(n.bindings), n.uniforms && this.setUniformsWebGL(n.uniforms), n.moduleSettings && this.updateModuleSettingsWebGL(n.moduleSettings), n.transformFeedback && (this.transformFeedback = n.transformFeedback), Object.seal(this);
	}
	destroy() {
		this._destroyed ||= (this.pipelineFactory.release(this.pipeline), this.shaderFactory.release(this.pipeline.vs), this.pipeline.fs && this.shaderFactory.release(this.pipeline.fs), this._uniformStore.destroy(), this._gpuGeometry?.destroy(), !0);
	}
	needsRedraw() {
		this._getBindingsUpdateTimestamp() > this._lastDrawTimestamp && this.setNeedsRedraw("contents of bound textures or buffers updated");
		let e = this._needsRedraw;
		return this._needsRedraw = !1, e;
	}
	setNeedsRedraw(e) {
		this._needsRedraw ||= e;
	}
	predraw() {
		this.updateShaderInputs(), this.pipeline = this._updatePipeline();
	}
	draw(e) {
		let t = this._areBindingsLoading();
		if (t) return D.info(uh, `>>> DRAWING ABORTED ${this.id}: ${t} not loaded`)(), !1;
		try {
			e.pushDebugGroup(`${this}.predraw(${e})`), this.predraw();
		} finally {
			e.popDebugGroup();
		}
		let n;
		try {
			e.pushDebugGroup(`${this}.draw(${e})`), this._logDrawCallStart(), this.pipeline = this._updatePipeline();
			let t = this._getBindings();
			this.pipeline.setBindings(t, { disableWarnings: this.props.disableWarnings }), hh(this.uniforms) || this.pipeline.setUniformsWebGL(this.uniforms);
			let { indexBuffer: r } = this.vertexArray, i = r ? r.byteLength / (r.indexType === "uint32" ? 4 : 2) : void 0;
			n = this.pipeline.draw({
				renderPass: e,
				vertexArray: this.vertexArray,
				isInstanced: this.isInstanced,
				vertexCount: this.vertexCount,
				instanceCount: this.instanceCount,
				indexCount: i,
				transformFeedback: this.transformFeedback || void 0,
				parameters: this.parameters,
				topology: this.topology
			});
		} finally {
			e.popDebugGroup(), this._logDrawCallEnd();
		}
		return this._logFramebuffer(e), n ? (this._lastDrawTimestamp = this.device.timestamp, this._needsRedraw = !1) : this._needsRedraw = "waiting for resource initialization", n;
	}
	setGeometry(e) {
		this._gpuGeometry?.destroy();
		let t = e && qm(this.device, e);
		if (t) {
			this.setTopology(t.topology || "triangle-list");
			let e = new Fo(this.bufferLayout);
			this.bufferLayout = e.mergeBufferLayouts(t.bufferLayout, this.bufferLayout), this.vertexArray && this._setGeometryAttributes(t);
		}
		this._gpuGeometry = t;
	}
	setTopology(e) {
		e !== this.topology && (this.topology = e, this._setPipelineNeedsUpdate("topology"));
	}
	setBufferLayout(e) {
		let t = new Fo(this.bufferLayout);
		this.bufferLayout = this._gpuGeometry ? t.mergeBufferLayouts(e, this._gpuGeometry.bufferLayout) : e, this._setPipelineNeedsUpdate("bufferLayout"), this.pipeline = this._updatePipeline(), this.vertexArray = this.device.createVertexArray({ renderPipeline: this.pipeline }), this._gpuGeometry && this._setGeometryAttributes(this._gpuGeometry);
	}
	setParameters(e) {
		nh(e, this.parameters, 2) || (this.parameters = e, this._setPipelineNeedsUpdate("parameters"));
	}
	setInstanceCount(e) {
		this.instanceCount = e, this.isInstanced === void 0 && e > 0 && (this.isInstanced = !0), this.setNeedsRedraw("instanceCount");
	}
	setVertexCount(e) {
		this.vertexCount = e, this.setNeedsRedraw("vertexCount");
	}
	setShaderInputs(e) {
		this.shaderInputs = e, this._uniformStore = new jo(this.shaderInputs.modules);
		for (let [e, t] of Object.entries(this.shaderInputs.modules)) if (ph(t)) {
			let t = this._uniformStore.getManagedUniformBuffer(this.device, e);
			this.bindings[`${e}Uniforms`] = t;
		}
		this.setNeedsRedraw("shaderInputs");
	}
	updateShaderInputs() {
		this._uniformStore.setUniforms(this.shaderInputs.getUniformValues()), this.setBindings(this.shaderInputs.getBindingValues()), this.setNeedsRedraw("shaderInputs");
	}
	setBindings(e) {
		Object.assign(this.bindings, e), this.setNeedsRedraw("bindings");
	}
	setTransformFeedback(e) {
		this.transformFeedback = e, this.setNeedsRedraw("transformFeedback");
	}
	setIndexBuffer(e) {
		this.vertexArray.setIndexBuffer(e), this.setNeedsRedraw("indexBuffer");
	}
	setAttributes(e, t) {
		let n = t?.disableWarnings ?? this.props.disableWarnings;
		e.indices && D.warn(`Model:${this.id} setAttributes() - indexBuffer should be set using setIndexBuffer()`)(), this.bufferLayout = Io(this.pipeline.shaderLayout, this.bufferLayout);
		let r = new Fo(this.bufferLayout);
		for (let [t, i] of Object.entries(e)) {
			let e = r.getBufferLayout(t);
			if (!e) {
				n || D.warn(`Model(${this.id}): Missing layout for buffer "${t}".`)();
				continue;
			}
			let a = r.getAttributeNamesForBuffer(e), o = !1;
			for (let e of a) {
				let t = this._attributeInfos[e];
				if (t) {
					let e = this.device.type === "webgpu" ? r.getBufferIndex(t.bufferName) : t.location;
					this.vertexArray.setBuffer(e, i), o = !0;
				}
			}
			!o && !n && D.warn(`Model(${this.id}): Ignoring buffer "${i.id}" for unknown attribute "${t}"`)();
		}
		this.setNeedsRedraw("attributes");
	}
	setConstantAttributes(e, t) {
		for (let [n, r] of Object.entries(e)) {
			let e = this._attributeInfos[n];
			e ? this.vertexArray.setConstantWebGL(e.location, r) : (t?.disableWarnings ?? this.props.disableWarnings) || D.warn(`Model "${this.id}: Ignoring constant supplied for unknown attribute "${n}"`)();
		}
		this.setNeedsRedraw("constants");
	}
	setUniforms(e) {
		this.setUniformsWebGL(e);
	}
	setUniformsWebGL(e) {
		hh(e) || (this.pipeline.setUniformsWebGL(e), Object.assign(this.uniforms, e)), this.setNeedsRedraw("uniforms");
	}
	updateModuleSettingsWebGL(e) {
		let { bindings: t, uniforms: n } = ih(this._getModuleUniforms(e));
		Object.assign(this.bindings, t), Object.assign(this.uniforms, n), this.setNeedsRedraw("moduleSettings");
	}
	_areBindingsLoading() {
		for (let e of Object.values(this.bindings)) if (e instanceof ch && !e.isReady) return e.id;
		return !1;
	}
	_getBindings() {
		let e = {};
		for (let [t, n] of Object.entries(this.bindings)) n instanceof ch ? n.isReady && (e[t] = n.texture) : e[t] = n;
		return e;
	}
	_getBindingsUpdateTimestamp() {
		let e = 0;
		for (let t of Object.values(this.bindings)) t instanceof Ra ? e = Math.max(e, t.texture.updateTimestamp) : t instanceof k || t instanceof j ? e = Math.max(e, t.updateTimestamp) : t instanceof ch ? e = t.texture ? Math.max(e, t.texture.updateTimestamp) : Infinity : t instanceof Ja || (e = Math.max(e, t.buffer.updateTimestamp));
		return e;
	}
	_setGeometryAttributes(e) {
		let t = { ...e.attributes };
		for (let [e] of Object.entries(t)) !this.pipeline.shaderLayout.attributes.find((t) => t.name === e) && e !== "positions" && delete t[e];
		this.vertexCount = e.vertexCount, this.setIndexBuffer(e.indices || null), this.setAttributes(e.attributes, { disableWarnings: !0 }), this.setAttributes(t, { disableWarnings: this.props.disableWarnings }), this.setNeedsRedraw("geometry attributes");
	}
	_setPipelineNeedsUpdate(e) {
		this._pipelineNeedsUpdate ||= e, this.setNeedsRedraw(e);
	}
	_updatePipeline() {
		if (this._pipelineNeedsUpdate) {
			let e = null, t = null;
			this.pipeline && (D.log(1, `Model ${this.id}: Recreating pipeline because "${this._pipelineNeedsUpdate}".`)(), e = this.pipeline.vs, t = this.pipeline.fs), this._pipelineNeedsUpdate = !1;
			let n = this.shaderFactory.createShader({
				id: `${this.id}-vertex`,
				stage: "vertex",
				source: this.source || this.vs,
				debugShaders: this.props.debugShaders
			}), r = null;
			this.source ? r = n : this.fs && (r = this.shaderFactory.createShader({
				id: `${this.id}-fragment`,
				stage: "fragment",
				source: this.source || this.fs,
				debugShaders: this.props.debugShaders
			})), this.pipeline = this.pipelineFactory.createRenderPipeline({
				...this.props,
				bufferLayout: this.bufferLayout,
				topology: this.topology,
				parameters: this.parameters,
				bindings: this._getBindings(),
				vs: n,
				fs: r
			}), this._attributeInfos = oo(this.pipeline.shaderLayout, this.bufferLayout), e && this.shaderFactory.release(e), t && this.shaderFactory.release(t);
		}
		return this.pipeline;
	}
	_lastLogTime = 0;
	_logOpen = !1;
	_logDrawCallStart() {
		let e = D.level > 3 ? 0 : dh;
		D.level < 2 || Date.now() - this._lastLogTime < e || (this._lastLogTime = Date.now(), this._logOpen = !0, D.group(uh, `>>> DRAWING MODEL ${this.id}`, { collapsed: D.level <= 2 })());
	}
	_logDrawCallEnd() {
		if (this._logOpen) {
			let e = Qm(this.pipeline.shaderLayout, this.id);
			D.table(uh, e)();
			let t = this.shaderInputs.getDebugTable();
			for (let [e, n] of Object.entries(this.uniforms)) t[e] = { value: n };
			D.table(uh, t)();
			let n = this._getAttributeDebugTable();
			D.table(uh, this._attributeInfos)(), D.table(uh, n)(), D.groupEnd(uh)(), this._logOpen = !1;
		}
	}
	_drawCount = 0;
	_logFramebuffer(e) {
		let t = this.device.props.debugFramebuffers;
		if (this._drawCount++, !t) return;
		let n = e.props.framebuffer;
		n && th(n, {
			id: n.id,
			minimap: !0
		});
	}
	_getAttributeDebugTable() {
		let e = {};
		for (let [t, n] of Object.entries(this._attributeInfos)) {
			let r = this.vertexArray.attributes[n.location];
			e[n.location] = {
				name: t,
				type: n.shaderType,
				values: r ? this._getBufferOrConstantValues(r, n.bufferDataType) : "null"
			};
		}
		if (this.vertexArray.indexBuffer) {
			let { indexBuffer: t } = this.vertexArray, n = t.indexType === "uint32" ? new Uint32Array(t.debugData) : new Uint16Array(t.debugData);
			e.indices = {
				name: "indices",
				type: t.indexType,
				values: n.toString()
			};
		}
		return e;
	}
	_getBufferOrConstantValues(e, t) {
		let n = No(t);
		return (e instanceof k ? new n(e.debugData) : e).toString();
	}
};
function ph(e) {
	return !(!e.uniformTypes || hh(e.uniformTypes));
}
function mh(e) {
	return {
		type: e.type,
		shaderLanguage: e.info.shadingLanguage,
		shaderLanguageVersion: e.info.shadingLanguageVersion,
		gpu: e.info.gpu,
		features: e.features
	};
}
function hh(e) {
	for (let t in e) return !1;
	return !0;
}
// node_modules/@luma.gl/engine/dist/compute/buffer-transform.js
var gh = class e {
	device;
	model;
	transformFeedback;
	static defaultProps = {
		...fh.defaultProps,
		outputs: void 0,
		feedbackBuffers: void 0
	};
	static isSupported(e) {
		return e?.info?.type === "webgl";
	}
	constructor(t, n = e.defaultProps) {
		if (!e.isSupported(t)) throw Error("BufferTransform not yet implemented on WebGPU");
		this.device = t, this.model = new fh(this.device, {
			id: n.id || "buffer-transform-model",
			fs: n.fs || Hi(),
			topology: n.topology || "point-list",
			varyings: n.outputs || n.varyings,
			...n
		}), this.transformFeedback = this.device.createTransformFeedback({
			layout: this.model.pipeline.shaderLayout,
			buffers: n.feedbackBuffers
		}), this.model.setTransformFeedback(this.transformFeedback), Object.seal(this);
	}
	destroy() {
		this.model && this.model.destroy();
	}
	delete() {
		this.destroy();
	}
	run(e) {
		e?.inputBuffers && this.model.setAttributes(e.inputBuffers), e?.outputBuffers && this.transformFeedback.setBuffers(e.outputBuffers);
		let t = this.device.beginRenderPass(e);
		this.model.draw(t), t.end();
	}
	getBuffer(e) {
		return this.transformFeedback.getBuffer(e);
	}
	readAsync(e) {
		let t = this.getBuffer(e);
		if (!t) throw Error("BufferTransform#getBuffer");
		if (t instanceof k) return t.readAsync();
		let { buffer: n, byteOffset: r = 0, byteLength: i = n.byteLength } = t;
		return n.readAsync(r, i);
	}
}, _h = class {
	id;
	topology;
	vertexCount;
	indices;
	attributes;
	userData = {};
	constructor(e) {
		let { attributes: t = {}, indices: n = null, vertexCount: r = null } = e;
		this.id = e.id || Gm("geometry"), this.topology = e.topology, n && (this.indices = ArrayBuffer.isView(n) ? {
			value: n,
			size: 1
		} : n), this.attributes = {};
		for (let [e, n] of Object.entries(t)) {
			let t = ArrayBuffer.isView(n) ? { value: n } : n;
			if (!ArrayBuffer.isView(t.value)) throw Error(`${this._print(e)}: must be typed array or object with value as typed array`);
			if (e !== "POSITION" && e !== "positions" || t.size || (t.size = 3), e === "indices") {
				if (this.indices) throw Error("Multiple indices detected");
				this.indices = t;
			} else this.attributes[e] = t;
		}
		this.indices && this.indices.isIndexed !== void 0 && (this.indices = Object.assign({}, this.indices), delete this.indices.isIndexed), this.vertexCount = r || this._calculateVertexCount(this.attributes, this.indices);
	}
	getVertexCount() {
		return this.vertexCount;
	}
	getAttributes() {
		return this.indices ? {
			indices: this.indices,
			...this.attributes
		} : this.attributes;
	}
	_print(e) {
		return `Geometry ${this.id} attribute ${e}`;
	}
	_setAttributes(e, t) {
		return this;
	}
	_calculateVertexCount(e, t) {
		if (t) return t.value.length;
		let n = Infinity;
		for (let t of Object.values(e)) {
			let { value: e, size: r, constant: i } = t;
			!i && e && r !== void 0 && r >= 1 && (n = Math.min(n, e.length / r));
		}
		return n;
	}
}, vh = {
	blendColorOperation: "add",
	blendColorSrcFactor: "one",
	blendColorDstFactor: "zero",
	blendAlphaOperation: "add",
	blendAlphaSrcFactor: "constant-alpha",
	blendAlphaDstFactor: "zero"
}, yh = class extends am {
	constructor() {
		super(...arguments), this._colorEncoderState = null;
	}
	render(e) {
		return "pickingFBO" in e ? this._drawPickingBuffer(e) : super.render(e);
	}
	_drawPickingBuffer({ layers: e, layerFilter: t, views: n, viewports: r, onViewportActive: i, pickingFBO: a, deviceRect: { x: o, y: s, width: c, height: l }, cullRect: u, effects: d, pass: f = "picking", pickZ: p, shaderModuleProps: m }) {
		this.pickZ = p;
		let h = this._resetColorEncoder(p), g = [
			o,
			s,
			c,
			l
		], _ = super.render({
			target: a,
			layers: e,
			layerFilter: t,
			views: n,
			viewports: r,
			onViewportActive: i,
			cullRect: u,
			effects: d?.filter((e) => e.useInPicking),
			pass: f,
			isPicking: !0,
			shaderModuleProps: m,
			clearColor: [
				0,
				0,
				0,
				0
			],
			colorMask: 15,
			scissorRect: g
		});
		return this._colorEncoderState = null, {
			decodePickingColor: h && xh.bind(null, h),
			stats: _
		};
	}
	shouldDrawLayer(e) {
		let { pickable: t, operation: n } = e.props;
		return t && n.includes("draw") || n.includes("terrain") || n.includes("mask");
	}
	getShaderModuleProps(e, t, n) {
		return {
			picking: {
				isActive: 1,
				isAttribute: this.pickZ
			},
			lighting: { enabled: !1 }
		};
	}
	getLayerParameters(e, t, n) {
		let r = { ...e.props.parameters }, { pickable: i, operation: a } = e.props;
		return !this._colorEncoderState || a.includes("terrain") ? r.blend = !1 : i && a.includes("draw") && (Object.assign(r, vh), r.blend = !0, r.blendColor = bh(this._colorEncoderState, e, n)), r;
	}
	_resetColorEncoder(e) {
		return this._colorEncoderState = e ? null : {
			byLayer: /* @__PURE__ */ new Map(),
			byAlpha: []
		}, this._colorEncoderState;
	}
};
function bh(e, t, n) {
	let { byLayer: r, byAlpha: i } = e, a, o = r.get(t);
	return o ? (o.viewports.push(n), a = o.a) : (a = r.size + 1, a <= 255 ? (o = {
		a,
		layer: t,
		viewports: [n]
	}, r.set(t, o), i[a] = o) : (E.warn("Too many pickable layers, only picking the first 255")(), a = 0)), [
		0,
		0,
		0,
		a / 255
	];
}
function xh(e, t) {
	let n = e.byAlpha[t[3]];
	return n && {
		pickedLayer: n.layer,
		pickedViewports: n.viewports,
		pickedObjectIndex: n.layer.decodePickingColor(t)
	};
}
// node_modules/@deck.gl/core/dist/lifecycle/constants.js
var Sh = {
	NO_STATE: "Awaiting state",
	MATCHED: "Matched. State transferred from previous layer",
	INITIALIZED: "Initialized",
	AWAITING_GC: "Discarded. Awaiting garbage collection",
	AWAITING_FINALIZATION: "No longer matched. Awaiting garbage collection",
	FINALIZED: "Finalized! Awaiting garbage collection"
}, Ch = Symbol.for("component"), wh = Symbol.for("propTypes"), Th = Symbol.for("deprecatedProps"), Eh = Symbol.for("asyncPropDefaults"), Dh = Symbol.for("asyncPropOriginal"), Oh = Symbol.for("asyncPropResolved");
// node_modules/@deck.gl/core/dist/utils/flatten.js
function kh(e, t = () => !0) {
	return Array.isArray(e) ? Ah(e, t, []) : t(e) ? [e] : [];
}
function Ah(e, t, n) {
	let r = -1;
	for (; ++r < e.length;) {
		let i = e[r];
		Array.isArray(i) ? Ah(i, t, n) : t(i) && n.push(i);
	}
	return n;
}
function jh({ target: e, source: t, start: n = 0, count: r = 1 }) {
	let i = t.length, a = r * i, o = 0;
	for (let r = n; o < i; o++) e[r++] = t[o];
	for (; o < a;) o < a - o ? (e.copyWithin(n + o, n, n + o), o *= 2) : (e.copyWithin(n + o, n, n + a - o), o = a);
	return e;
}
// node_modules/@deck.gl/core/dist/lib/resource/resource.js
var Mh = class {
	constructor(e, t, n) {
		this._loadCount = 0, this._subscribers = /* @__PURE__ */ new Set(), this.id = e, this.context = n, this.setData(t);
	}
	subscribe(e) {
		this._subscribers.add(e);
	}
	unsubscribe(e) {
		this._subscribers.delete(e);
	}
	inUse() {
		return this._subscribers.size > 0;
	}
	delete() {}
	getData() {
		return this.isLoaded ? this._error ? Promise.reject(this._error) : this._content : this._loader.then(() => this.getData());
	}
	setData(e, t) {
		if (e === this._data && !t) return;
		this._data = e;
		let n = ++this._loadCount, r = e;
		typeof e == "string" && (r = nr(e)), r instanceof Promise ? (this.isLoaded = !1, this._loader = r.then((e) => {
			this._loadCount === n && (this.isLoaded = !0, this._error = void 0, this._content = e);
		}).catch((e) => {
			this._loadCount === n && (this.isLoaded = !0, this._error = e || !0);
		})) : (this.isLoaded = !0, this._error = void 0, this._content = e);
		for (let e of this._subscribers) e.onChange(this.getData());
	}
}, Nh = class {
	constructor(e) {
		this.protocol = e.protocol || "resource://", this._context = {
			device: e.device,
			gl: e.device?.gl,
			resourceManager: this
		}, this._resources = {}, this._consumers = {}, this._pruneRequest = null;
	}
	contains(e) {
		return e.startsWith(this.protocol) ? !0 : e in this._resources;
	}
	add({ resourceId: e, data: t, forceUpdate: n = !1, persistent: r = !0 }) {
		let i = this._resources[e];
		i ? i.setData(t, n) : (i = new Mh(e, t, this._context), this._resources[e] = i), i.persistent = r;
	}
	remove(e) {
		let t = this._resources[e];
		t && (t.delete(), delete this._resources[e]);
	}
	unsubscribe({ consumerId: e }) {
		let t = this._consumers[e];
		if (t) {
			for (let e in t) {
				let n = t[e], r = this._resources[n.resourceId];
				r && r.unsubscribe(n);
			}
			delete this._consumers[e], this.prune();
		}
	}
	subscribe({ resourceId: e, onChange: t, consumerId: n, requestId: r = "default" }) {
		let { _resources: i, protocol: a } = this;
		e.startsWith(a) && (e = e.replace(a, ""), i[e] || this.add({
			resourceId: e,
			data: null,
			persistent: !1
		}));
		let o = i[e];
		if (this._track(n, r, o, t), o) return o.getData();
	}
	prune() {
		this._pruneRequest ||= setTimeout(() => this._prune(), 0);
	}
	finalize() {
		for (let e in this._resources) this._resources[e].delete();
	}
	_track(e, t, n, r) {
		let i = this._consumers, a = i[e] = i[e] || {}, o = a[t], s = o && o.resourceId && this._resources[o.resourceId];
		s && (s.unsubscribe(o), this.prune()), n && (o ? (o.onChange = r, o.resourceId = n.id) : o = {
			onChange: r,
			resourceId: n.id
		}, a[t] = o, n.subscribe(o));
	}
	_prune() {
		this._pruneRequest = null;
		for (let e of Object.keys(this._resources)) {
			let t = this._resources[e];
			!t.persistent && !t.inUse() && (t.delete(), delete this._resources[e]);
		}
	}
}, Ph = "layerManager.setLayers", Fh = "layerManager.activateViewport", Ih = class {
	constructor(e, t) {
		this._lastRenderedLayers = [], this._needsRedraw = !1, this._needsUpdate = !1, this._nextLayers = null, this._debug = !1, this._defaultShaderModulesChanged = !1, this.activateViewport = (e) => {
			Gr(Fh, this, e), e && (this.context.viewport = e);
		};
		let { deck: n, stats: r, viewport: i, timeline: a } = t || {};
		this.layers = [], this.resourceManager = new Nh({
			device: e,
			protocol: "deck://"
		}), this.context = {
			mousePosition: null,
			userData: {},
			layerManager: this,
			device: e,
			gl: e?.gl,
			deck: n,
			shaderAssembler: Jp(e?.info?.shadingLanguage || "glsl"),
			defaultShaderModules: [zu],
			renderPass: void 0,
			stats: r || new mt({ id: "deck.gl" }),
			viewport: i || new km({ id: "DEFAULT-INITIAL-VIEWPORT" }),
			timeline: a || new Rm(),
			resourceManager: this.resourceManager,
			onError: void 0
		}, Object.seal(this);
	}
	finalize() {
		this.resourceManager.finalize();
		for (let e of this.layers) this._finalizeLayer(e);
	}
	needsRedraw(e = { clearRedrawFlags: !1 }) {
		let t = this._needsRedraw;
		e.clearRedrawFlags && (this._needsRedraw = !1);
		for (let n of this.layers) {
			let r = n.getNeedsRedraw(e);
			t ||= r;
		}
		return t;
	}
	needsUpdate() {
		return this._nextLayers && this._nextLayers !== this._lastRenderedLayers ? "layers changed" : this._defaultShaderModulesChanged ? "shader modules changed" : this._needsUpdate;
	}
	setNeedsRedraw(e) {
		this._needsRedraw = this._needsRedraw || e;
	}
	setNeedsUpdate(e) {
		this._needsUpdate = this._needsUpdate || e;
	}
	getLayers({ layerIds: e } = {}) {
		return e ? this.layers.filter((t) => e.find((e) => t.id.indexOf(e) === 0)) : this.layers;
	}
	setProps(e) {
		"debug" in e && (this._debug = e.debug), "userData" in e && (this.context.userData = e.userData), "layers" in e && (this._nextLayers = e.layers), "onError" in e && (this.context.onError = e.onError);
	}
	setLayers(e, t) {
		Gr(Ph, this, t, e), this._lastRenderedLayers = e;
		let n = kh(e, Boolean);
		for (let e of n) e.context = this.context;
		this._updateLayers(this.layers, n);
	}
	updateLayers() {
		let e = this.needsUpdate();
		e && (this.setNeedsRedraw(`updating layers: ${e}`), this.setLayers(this._nextLayers || this._lastRenderedLayers, e)), this._nextLayers = null;
	}
	addDefaultShaderModule(e) {
		let { defaultShaderModules: t } = this.context;
		t.find((t) => t.name === e.name) || (t.push(e), this._defaultShaderModulesChanged = !0);
	}
	removeDefaultShaderModule(e) {
		let { defaultShaderModules: t } = this.context, n = t.findIndex((t) => t.name === e.name);
		n >= 0 && (t.splice(n, 1), this._defaultShaderModulesChanged = !0);
	}
	_handleError(e, t, n) {
		n.raiseError(t, `${e} of ${n}`);
	}
	_updateLayers(e, t) {
		let n = {};
		for (let t of e) n[t.id] ? E.warn(`Multiple old layers with same id ${t.id}`)() : n[t.id] = t;
		if (this._defaultShaderModulesChanged) {
			for (let t of e) t.setNeedsUpdate(), t.setChangeFlags({ extensionsChanged: !0 });
			this._defaultShaderModulesChanged = !1;
		}
		let r = [];
		this._updateSublayersRecursively(t, n, r), this._finalizeOldLayers(n);
		let i = !1;
		for (let e of r) if (e.hasUniformTransition()) {
			i = `Uniform transition in ${e}`;
			break;
		}
		this._needsUpdate = i, this.layers = r;
	}
	_updateSublayersRecursively(e, t, n) {
		for (let r of e) {
			r.context = this.context;
			let e = t[r.id];
			e === null && E.warn(`Multiple new layers with same id ${r.id}`)(), t[r.id] = null;
			let i = null;
			try {
				this._debug && e !== r && r.validateProps(), e ? (this._transferLayerState(e, r), this._updateLayer(r)) : this._initializeLayer(r), n.push(r), i = r.isComposite ? r.getSubLayers() : null;
			} catch (e) {
				this._handleError("matching", e, r);
			}
			i && this._updateSublayersRecursively(i, t, n);
		}
	}
	_finalizeOldLayers(e) {
		for (let t in e) {
			let n = e[t];
			n && this._finalizeLayer(n);
		}
	}
	_initializeLayer(e) {
		try {
			e._initialize(), e.lifecycle = Sh.INITIALIZED;
		} catch (t) {
			this._handleError("initialization", t, e);
		}
	}
	_transferLayerState(e, t) {
		t._transferState(e), t.lifecycle = Sh.MATCHED, t !== e && (e.lifecycle = Sh.AWAITING_GC);
	}
	_updateLayer(e) {
		try {
			e._update();
		} catch (t) {
			this._handleError("update", t, e);
		}
	}
	_finalizeLayer(e) {
		this._needsRedraw = this._needsRedraw || `finalized ${e}`, e.lifecycle = Sh.AWAITING_FINALIZATION;
		try {
			e._finalize(), e.lifecycle = Sh.FINALIZED;
		} catch (t) {
			this._handleError("finalization", t, e);
		}
	}
};
// node_modules/@deck.gl/core/dist/utils/deep-equal.js
function Lh(e, t, n) {
	if (e === t) return !0;
	if (!n || !e || !t) return !1;
	if (Array.isArray(e)) {
		if (!Array.isArray(t) || e.length !== t.length) return !1;
		for (let r = 0; r < e.length; r++) if (!Lh(e[r], t[r], n - 1)) return !1;
		return !0;
	}
	if (Array.isArray(t)) return !1;
	if (typeof e == "object" && typeof t == "object") {
		let r = Object.keys(e), i = Object.keys(t);
		if (r.length !== i.length) return !1;
		for (let i of r) if (!t.hasOwnProperty(i) || !Lh(e[i], t[i], n - 1)) return !1;
		return !0;
	}
	return !1;
}
// node_modules/@deck.gl/core/dist/lib/view-manager.js
var Rh = class {
	constructor(e) {
		this.views = [], this.width = 100, this.height = 100, this.viewState = {}, this.controllers = {}, this.timeline = e.timeline, this._viewports = [], this._viewportMap = {}, this._isUpdating = !1, this._needsRedraw = "First render", this._needsUpdate = "Initialize", this._eventManager = e.eventManager, this._eventCallbacks = {
			onViewStateChange: e.onViewStateChange,
			onInteractionStateChange: e.onInteractionStateChange
		}, Object.seal(this), this.setProps(e);
	}
	finalize() {
		for (let e in this.controllers) {
			let t = this.controllers[e];
			t && t.finalize();
		}
		this.controllers = {};
	}
	needsRedraw(e = { clearRedrawFlags: !1 }) {
		let t = this._needsRedraw;
		return e.clearRedrawFlags && (this._needsRedraw = !1), t;
	}
	setNeedsUpdate(e) {
		this._needsUpdate = this._needsUpdate || e, this._needsRedraw = this._needsRedraw || e;
	}
	updateViewStates() {
		for (let e in this.controllers) {
			let t = this.controllers[e];
			t && t.updateTransition();
		}
	}
	getViewports(e) {
		return e ? this._viewports.filter((t) => t.containsPixel(e)) : this._viewports;
	}
	getViews() {
		let e = {};
		return this.views.forEach((t) => {
			e[t.id] = t;
		}), e;
	}
	getView(e) {
		return this.views.find((t) => t.id === e);
	}
	getViewState(e) {
		let t = typeof e == "string" ? this.getView(e) : e, n = t && this.viewState[t.getViewStateId()] || this.viewState;
		return t ? t.filterViewState(n) : n;
	}
	getViewport(e) {
		return this._viewportMap[e];
	}
	unproject(e, t) {
		let n = this.getViewports(), r = {
			x: e[0],
			y: e[1]
		};
		for (let i = n.length - 1; i >= 0; --i) {
			let a = n[i];
			if (a.containsPixel(r)) {
				let n = e.slice();
				return n[0] -= a.x, n[1] -= a.y, a.unproject(n, t);
			}
		}
		return null;
	}
	setProps(e) {
		e.views && this._setViews(e.views), e.viewState && this._setViewState(e.viewState), ("width" in e || "height" in e) && this._setSize(e.width, e.height), this._isUpdating || this._update();
	}
	_update() {
		this._isUpdating = !0, this._needsUpdate && (this._needsUpdate = !1, this._rebuildViewports()), this._needsUpdate && (this._needsUpdate = !1, this._rebuildViewports()), this._isUpdating = !1;
	}
	_setSize(e, t) {
		(e !== this.width || t !== this.height) && (this.width = e, this.height = t, this.setNeedsUpdate("Size changed"));
	}
	_setViews(e) {
		e = kh(e, Boolean), this._diffViews(e, this.views) && this.setNeedsUpdate("views changed"), this.views = e;
	}
	_setViewState(e) {
		e ? (Lh(e, this.viewState, 3) || this.setNeedsUpdate("viewState changed"), this.viewState = e) : E.warn("missing `viewState` or `initialViewState`")();
	}
	_createController(e, t) {
		let n = t.type;
		return new n({
			timeline: this.timeline,
			eventManager: this._eventManager,
			onViewStateChange: this._eventCallbacks.onViewStateChange,
			onStateChange: this._eventCallbacks.onInteractionStateChange,
			makeViewport: (t) => this.getView(e.id)?.makeViewport({
				viewState: t,
				width: this.width,
				height: this.height
			})
		});
	}
	_updateController(e, t, n, r) {
		let i = e.controller;
		if (i && n) {
			let a = {
				...t,
				...i,
				id: e.id,
				x: n.x,
				y: n.y,
				width: n.width,
				height: n.height
			};
			return r && r.constructor === i.type || (r = this._createController(e, a)), r && r.setProps(a), r;
		}
		return null;
	}
	_rebuildViewports() {
		let { views: e } = this, t = this.controllers;
		this._viewports = [], this.controllers = {};
		let n = !1;
		for (let r = e.length; r--;) {
			let i = e[r], a = this.getViewState(i), o = i.makeViewport({
				viewState: a,
				width: this.width,
				height: this.height
			}), s = t[i.id], c = !!i.controller;
			c && !s && (n = !0), (n || !c) && s && (s.finalize(), s = null), this.controllers[i.id] = this._updateController(i, a, o, s), o && this._viewports.unshift(o);
		}
		for (let e in t) {
			let n = t[e];
			n && !this.controllers[e] && n.finalize();
		}
		this._buildViewportMap();
	}
	_buildViewportMap() {
		this._viewportMap = {}, this._viewports.forEach((e) => {
			e.id && (this._viewportMap[e.id] = this._viewportMap[e.id] || e);
		});
	}
	_diffViews(e, t) {
		return e.length !== t.length || e.some((n, r) => !e[r].equals(t[r]));
	}
}, zh = /([0-9]+\.?[0-9]*)(%|px)/;
function Bh(e) {
	switch (typeof e) {
		case "number": return {
			position: e,
			relative: !1
		};
		case "string":
			let t = zh.exec(e);
			if (t && t.length >= 3) {
				let e = t[2] === "%", n = parseFloat(t[1]);
				return {
					position: e ? n / 100 : n,
					relative: e
				};
			}
		default: throw Error(`Could not parse position string ${e}`);
	}
}
function Vh(e, t) {
	return e.relative ? Math.round(e.position * t) : e.position;
}
// node_modules/@deck.gl/core/dist/views/view.js
var Hh = class {
	constructor(e) {
		let { id: t, x: n = 0, y: r = 0, width: i = "100%", height: a = "100%", padding: o = null } = e;
		this.id = t || this.constructor.displayName || "view", this.props = {
			...e,
			id: this.id
		}, this._x = Bh(n), this._y = Bh(r), this._width = Bh(i), this._height = Bh(a), this._padding = o && {
			left: Bh(o.left || 0),
			right: Bh(o.right || 0),
			top: Bh(o.top || 0),
			bottom: Bh(o.bottom || 0)
		}, this.equals = this.equals.bind(this), Object.seal(this);
	}
	equals(e) {
		return this === e || this.constructor === e.constructor && Lh(this.props, e.props, 2);
	}
	makeViewport({ width: e, height: t, viewState: n }) {
		n = this.filterViewState(n);
		let r = this.getDimensions({
			width: e,
			height: t
		});
		return !r.height || !r.width ? null : new (this.getViewportType(n))({
			...n,
			...this.props,
			...r
		});
	}
	getViewStateId() {
		let { viewState: e } = this.props;
		return typeof e == "string" ? e : e?.id || this.id;
	}
	filterViewState(e) {
		if (this.props.viewState && typeof this.props.viewState == "object") {
			if (!this.props.viewState.id) return this.props.viewState;
			let t = { ...e };
			for (let e in this.props.viewState) e !== "id" && (t[e] = this.props.viewState[e]);
			return t;
		}
		return e;
	}
	getDimensions({ width: e, height: t }) {
		let n = {
			x: Vh(this._x, e),
			y: Vh(this._y, t),
			width: Vh(this._width, e),
			height: Vh(this._height, t)
		};
		return this._padding && (n.padding = {
			left: Vh(this._padding.left, e),
			top: Vh(this._padding.top, t),
			right: Vh(this._padding.right, e),
			bottom: Vh(this._padding.bottom, t)
		}), n;
	}
	get controller() {
		let e = this.props.controller;
		return e ? e === !0 ? { type: this.ControllerType } : typeof e == "function" ? { type: e } : {
			type: this.ControllerType,
			...e
		} : null;
	}
}, Uh = class {
	constructor(e) {
		this._inProgress = !1, this._handle = null, this.time = 0, this.settings = { duration: 0 }, this._timeline = e;
	}
	get inProgress() {
		return this._inProgress;
	}
	start(e) {
		this.cancel(), this.settings = e, this._inProgress = !0, this.settings.onStart?.(this);
	}
	end() {
		this._inProgress && (this._timeline.removeChannel(this._handle), this._handle = null, this._inProgress = !1, this.settings.onEnd?.(this));
	}
	cancel() {
		this._inProgress &&= (this.settings.onInterrupt?.(this), this._timeline.removeChannel(this._handle), this._handle = null, !1);
	}
	update() {
		if (!this._inProgress) return !1;
		if (this._handle === null) {
			let { _timeline: e, settings: t } = this;
			this._handle = e.addChannel({
				delay: e.getTime(),
				duration: t.duration
			});
		}
		return this.time = this._timeline.getTime(this._handle), this._onUpdate(), this.settings.onUpdate?.(this), this._timeline.isFinished(this._handle) && this.end(), !0;
	}
	_onUpdate() {}
}, Wh = () => {}, Gh = {
	BREAK: 1,
	SNAP_TO_END: 2,
	IGNORE: 3
}, Kh = (e) => e, qh = Gh.BREAK, Jh = class {
	constructor(e) {
		this._onTransitionUpdate = (e) => {
			let { time: t, settings: { interpolator: n, startProps: r, endProps: i, duration: a, easing: o } } = e, s = o(t / a), c = n.interpolateProps(r, i, s);
			this.propsInTransition = this.getControllerState({
				...this.props,
				...c
			}).getViewportProps(), this.onViewStateChange({
				viewState: this.propsInTransition,
				oldViewState: this.props
			});
		}, this.getControllerState = e.getControllerState, this.propsInTransition = null, this.transition = new Uh(e.timeline), this.onViewStateChange = e.onViewStateChange || Wh, this.onStateChange = e.onStateChange || Wh;
	}
	finalize() {
		this.transition.cancel();
	}
	getViewportInTransition() {
		return this.propsInTransition;
	}
	processViewStateChange(e) {
		let t = !1, n = this.props;
		if (this.props = e, !n || this._shouldIgnoreViewportChange(n, e)) return !1;
		if (this._isTransitionEnabled(e)) {
			let r = n;
			if (this.transition.inProgress) {
				let { interruption: e, endProps: t } = this.transition.settings;
				r = {
					...n,
					...e === Gh.SNAP_TO_END ? t : this.propsInTransition || n
				};
			}
			this._triggerTransition(r, e), t = !0;
		} else this.transition.cancel();
		return t;
	}
	updateTransition() {
		this.transition.update();
	}
	_isTransitionEnabled(e) {
		let { transitionDuration: t, transitionInterpolator: n } = e;
		return (t > 0 || t === "auto") && !!n;
	}
	_isUpdateDueToCurrentTransition(e) {
		return this.transition.inProgress && this.propsInTransition ? this.transition.settings.interpolator.arePropsEqual(e, this.propsInTransition) : !1;
	}
	_shouldIgnoreViewportChange(e, t) {
		return this.transition.inProgress ? this.transition.settings.interruption === Gh.IGNORE || this._isUpdateDueToCurrentTransition(t) : !this._isTransitionEnabled(t) || t.transitionInterpolator.arePropsEqual(e, t);
	}
	_triggerTransition(e, t) {
		let n = this.getControllerState(e), r = this.getControllerState(t).shortestPathFrom(n), i = t.transitionInterpolator, a = i.getDuration ? i.getDuration(e, t) : t.transitionDuration;
		if (a === 0) return;
		let o = i.initializeProps(e, r);
		this.propsInTransition = {};
		let s = {
			duration: a,
			easing: t.transitionEasing || Kh,
			interpolator: i,
			interruption: t.transitionInterruption || qh,
			startProps: o.start,
			endProps: o.end,
			onStart: t.onTransitionStart,
			onUpdate: this._onTransitionUpdate,
			onInterrupt: this._onTransitionEnd(t.onTransitionInterrupt),
			onEnd: this._onTransitionEnd(t.onTransitionEnd)
		};
		this.transition.start(s), this.onStateChange({ inTransition: !0 }), this.updateTransition();
	}
	_onTransitionEnd(e) {
		return (t) => {
			this.propsInTransition = null, this.onStateChange({
				inTransition: !1,
				isZooming: !1,
				isPanning: !1,
				isRotating: !1
			}), e?.(t);
		};
	}
};
// node_modules/@deck.gl/core/dist/utils/assert.js
function Yh(e, t) {
	if (!e) throw Error(t || "deck.gl: assertion failed.");
}
// node_modules/@deck.gl/core/dist/transitions/transition-interpolator.js
var Xh = class {
	constructor(e) {
		let { compare: t, extract: n, required: r } = e;
		this._propsToCompare = t, this._propsToExtract = n || t, this._requiredProps = r;
	}
	arePropsEqual(e, t) {
		for (let n of this._propsToCompare) if (!(n in e) || !(n in t) || !il(e[n], t[n])) return !1;
		return !0;
	}
	initializeProps(e, t) {
		let n = {}, r = {};
		for (let i of this._propsToExtract) (i in e || i in t) && (n[i] = e[i], r[i] = t[i]);
		return this._checkRequiredProps(n), this._checkRequiredProps(r), {
			start: n,
			end: r
		};
	}
	getDuration(e, t) {
		return t.transitionDuration;
	}
	_checkRequiredProps(e) {
		this._requiredProps && this._requiredProps.forEach((t) => {
			let n = e[t];
			Yh(Number.isFinite(n) || Array.isArray(n), `${t} is required for transition`);
		});
	}
}, Zh = [
	"longitude",
	"latitude",
	"zoom",
	"bearing",
	"pitch"
], Qh = [
	"longitude",
	"latitude",
	"zoom"
], $h = class extends Xh {
	constructor(e = {}) {
		let t = Array.isArray(e) ? e : e.transitionProps, n = Array.isArray(e) ? {} : e;
		n.transitionProps = Array.isArray(t) ? {
			compare: t,
			required: t
		} : t || {
			compare: Zh,
			required: Qh
		}, super(n.transitionProps), this.opts = n;
	}
	initializeProps(e, t) {
		let n = super.initializeProps(e, t), { makeViewport: r, around: i } = this.opts;
		if (r && i) {
			let a = r(e), o = r(t), s = a.unproject(i);
			n.start.around = i, Object.assign(n.end, {
				around: o.project(s),
				aroundPosition: s,
				width: t.width,
				height: t.height
			});
		}
		return n;
	}
	interpolateProps(e, t, n) {
		let r = {};
		for (let i of this._propsToExtract) r[i] = rl(e[i] || 0, t[i] || 0, n);
		if (t.aroundPosition && this.opts.makeViewport) {
			let i = this.opts.makeViewport({
				...t,
				...r
			});
			Object.assign(r, i.panByPosition(t.aroundPosition, rl(e.around, t.around, n)));
		}
		return r;
	}
}, eg = { transitionDuration: 0 }, tg = 300, ng = (e) => 1 - (1 - e) * (1 - e), rg = {
	WHEEL: ["wheel"],
	PAN: [
		"panstart",
		"panmove",
		"panend"
	],
	PINCH: [
		"pinchstart",
		"pinchmove",
		"pinchend"
	],
	MULTI_PAN: [
		"multipanstart",
		"multipanmove",
		"multipanend"
	],
	DOUBLE_CLICK: ["dblclick"],
	KEYBOARD: ["keydown"]
}, ig = {}, ag = class {
	constructor(e) {
		this.state = {}, this._events = {}, this._interactionState = { isDragging: !1 }, this._customEvents = [], this._eventStartBlocked = null, this._panMove = !1, this.invertPan = !1, this.dragMode = "rotate", this.inertia = 0, this.scrollZoom = !0, this.dragPan = !0, this.dragRotate = !0, this.doubleClickZoom = !0, this.touchZoom = !0, this.touchRotate = !1, this.keyboard = !0, this.transitionManager = new Jh({
			...e,
			getControllerState: (e) => new this.ControllerState(e),
			onViewStateChange: this._onTransition.bind(this),
			onStateChange: this._setInteractionState.bind(this)
		}), this.handleEvent = this.handleEvent.bind(this), this.eventManager = e.eventManager, this.onViewStateChange = e.onViewStateChange || (() => {}), this.onStateChange = e.onStateChange || (() => {}), this.makeViewport = e.makeViewport;
	}
	set events(e) {
		this.toggleEvents(this._customEvents, !1), this.toggleEvents(e, !0), this._customEvents = e, this.props && this.setProps(this.props);
	}
	finalize() {
		for (let e in this._events) this._events[e] && this.eventManager?.off(e, this.handleEvent);
		this.transitionManager.finalize();
	}
	handleEvent(e) {
		this._controllerState = void 0;
		let t = this._eventStartBlocked;
		switch (e.type) {
			case "panstart": return !t && this._onPanStart(e);
			case "panmove": return this._onPan(e);
			case "panend": return this._onPanEnd(e);
			case "pinchstart": return !t && this._onPinchStart(e);
			case "pinchmove": return this._onPinch(e);
			case "pinchend": return this._onPinchEnd(e);
			case "multipanstart": return !t && this._onMultiPanStart(e);
			case "multipanmove": return this._onMultiPan(e);
			case "multipanend": return this._onMultiPanEnd(e);
			case "dblclick": return this._onDoubleClick(e);
			case "wheel": return this._onWheel(e);
			case "keydown": return this._onKeyDown(e);
			default: return !1;
		}
	}
	get controllerState() {
		return this._controllerState = this._controllerState || new this.ControllerState({
			makeViewport: this.makeViewport,
			...this.props,
			...this.state
		}), this._controllerState;
	}
	getCenter(e) {
		let { x: t, y: n } = this.props, { offsetCenter: r } = e;
		return [r.x - t, r.y - n];
	}
	isPointInBounds(e, t) {
		let { width: n, height: r } = this.props;
		if (t && t.handled) return !1;
		let i = e[0] >= 0 && e[0] <= n && e[1] >= 0 && e[1] <= r;
		return i && t && t.stopPropagation(), i;
	}
	isFunctionKeyPressed(e) {
		let { srcEvent: t } = e;
		return !!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey);
	}
	isDragging() {
		return this._interactionState.isDragging || !1;
	}
	blockEvents(e) {
		let t = setTimeout(() => {
			this._eventStartBlocked === t && (this._eventStartBlocked = null);
		}, e);
		this._eventStartBlocked = t;
	}
	setProps(e) {
		e.dragMode && (this.dragMode = e.dragMode), this.props = e, "transitionInterpolator" in e || (e.transitionInterpolator = this._getTransitionProps().transitionInterpolator), this.transitionManager.processViewStateChange(e);
		let { inertia: t } = e;
		this.inertia = Number.isFinite(t) ? t : t === !0 ? tg : 0;
		let { scrollZoom: n = !0, dragPan: r = !0, dragRotate: i = !0, doubleClickZoom: a = !0, touchZoom: o = !0, touchRotate: s = !1, keyboard: c = !0 } = e, l = !!this.onViewStateChange;
		this.toggleEvents(rg.WHEEL, l && n), this.toggleEvents(rg.PAN, l), this.toggleEvents(rg.PINCH, l && (o || s)), this.toggleEvents(rg.MULTI_PAN, l && s), this.toggleEvents(rg.DOUBLE_CLICK, l && a), this.toggleEvents(rg.KEYBOARD, l && c), this.scrollZoom = n, this.dragPan = r, this.dragRotate = i, this.doubleClickZoom = a, this.touchZoom = o, this.touchRotate = s, this.keyboard = c;
	}
	updateTransition() {
		this.transitionManager.updateTransition();
	}
	toggleEvents(e, t) {
		this.eventManager && e.forEach((e) => {
			this._events[e] !== t && (this._events[e] = t, t ? this.eventManager.on(e, this.handleEvent) : this.eventManager.off(e, this.handleEvent));
		});
	}
	updateViewport(e, t = null, n = {}) {
		let r = {
			...e.getViewportProps(),
			...t
		}, i = this.controllerState !== e;
		if (this.state = e.getState(), this._setInteractionState(n), i) {
			let e = this.controllerState && this.controllerState.getViewportProps();
			this.onViewStateChange && this.onViewStateChange({
				viewState: r,
				interactionState: this._interactionState,
				oldViewState: e,
				viewId: this.props.id
			});
		}
	}
	_onTransition(e) {
		this.onViewStateChange({
			...e,
			interactionState: this._interactionState,
			viewId: this.props.id
		});
	}
	_setInteractionState(e) {
		Object.assign(this._interactionState, e), this.onStateChange(this._interactionState);
	}
	_onPanStart(e) {
		let t = this.getCenter(e);
		if (!this.isPointInBounds(t, e)) return !1;
		let n = this.isFunctionKeyPressed(e) || e.rightButton || !1;
		(this.invertPan || this.dragMode === "pan") && (n = !n);
		let r = this.controllerState[n ? "panStart" : "rotateStart"]({ pos: t });
		return this._panMove = n, this.updateViewport(r, eg, { isDragging: !0 }), !0;
	}
	_onPan(e) {
		return this.isDragging() ? this._panMove ? this._onPanMove(e) : this._onPanRotate(e) : !1;
	}
	_onPanEnd(e) {
		return this.isDragging() ? this._panMove ? this._onPanMoveEnd(e) : this._onPanRotateEnd(e) : !1;
	}
	_onPanMove(e) {
		if (!this.dragPan) return !1;
		let t = this.getCenter(e), n = this.controllerState.pan({ pos: t });
		return this.updateViewport(n, eg, {
			isDragging: !0,
			isPanning: !0
		}), !0;
	}
	_onPanMoveEnd(e) {
		let { inertia: t } = this;
		if (this.dragPan && t && e.velocity) {
			let n = this.getCenter(e), r = [n[0] + e.velocityX * t / 2, n[1] + e.velocityY * t / 2], i = this.controllerState.pan({ pos: r }).panEnd();
			this.updateViewport(i, {
				...this._getTransitionProps(),
				transitionDuration: t,
				transitionEasing: ng
			}, {
				isDragging: !1,
				isPanning: !0
			});
		} else {
			let e = this.controllerState.panEnd();
			this.updateViewport(e, null, {
				isDragging: !1,
				isPanning: !1
			});
		}
		return !0;
	}
	_onPanRotate(e) {
		if (!this.dragRotate) return !1;
		let t = this.getCenter(e), n = this.controllerState.rotate({ pos: t });
		return this.updateViewport(n, eg, {
			isDragging: !0,
			isRotating: !0
		}), !0;
	}
	_onPanRotateEnd(e) {
		let { inertia: t } = this;
		if (this.dragRotate && t && e.velocity) {
			let n = this.getCenter(e), r = [n[0] + e.velocityX * t / 2, n[1] + e.velocityY * t / 2], i = this.controllerState.rotate({ pos: r }).rotateEnd();
			this.updateViewport(i, {
				...this._getTransitionProps(),
				transitionDuration: t,
				transitionEasing: ng
			}, {
				isDragging: !1,
				isRotating: !0
			});
		} else {
			let e = this.controllerState.rotateEnd();
			this.updateViewport(e, null, {
				isDragging: !1,
				isRotating: !1
			});
		}
		return !0;
	}
	_onWheel(e) {
		if (!this.scrollZoom) return !1;
		let t = this.getCenter(e);
		if (!this.isPointInBounds(t, e)) return !1;
		e.srcEvent.preventDefault();
		let { speed: n = .01, smooth: r = !1 } = this.scrollZoom === !0 ? {} : this.scrollZoom, { delta: i } = e, a = 2 / (1 + Math.exp(-Math.abs(i * n)));
		i < 0 && a !== 0 && (a = 1 / a);
		let o = this.controllerState.zoom({
			pos: t,
			scale: a
		});
		return this.updateViewport(o, {
			...this._getTransitionProps({ around: t }),
			transitionDuration: r ? 250 : 1
		}, {
			isZooming: !0,
			isPanning: !0
		}), !0;
	}
	_onMultiPanStart(e) {
		let t = this.getCenter(e);
		if (!this.isPointInBounds(t, e)) return !1;
		let n = this.controllerState.rotateStart({ pos: t });
		return this.updateViewport(n, eg, { isDragging: !0 }), !0;
	}
	_onMultiPan(e) {
		if (!this.touchRotate || !this.isDragging()) return !1;
		let t = this.getCenter(e);
		t[0] -= e.deltaX;
		let n = this.controllerState.rotate({ pos: t });
		return this.updateViewport(n, eg, {
			isDragging: !0,
			isRotating: !0
		}), !0;
	}
	_onMultiPanEnd(e) {
		if (!this.isDragging()) return !1;
		let { inertia: t } = this;
		if (this.touchRotate && t && e.velocityY) {
			let n = this.getCenter(e), r = [n[0], n[1] += e.velocityY * t / 2], i = this.controllerState.rotate({ pos: r });
			this.updateViewport(i, {
				...this._getTransitionProps(),
				transitionDuration: t,
				transitionEasing: ng
			}, {
				isDragging: !1,
				isRotating: !0
			}), this.blockEvents(t);
		} else {
			let e = this.controllerState.rotateEnd();
			this.updateViewport(e, null, {
				isDragging: !1,
				isRotating: !1
			});
		}
		return !0;
	}
	_onPinchStart(e) {
		let t = this.getCenter(e);
		if (!this.isPointInBounds(t, e)) return !1;
		let n = this.controllerState.zoomStart({ pos: t }).rotateStart({ pos: t });
		return ig._startPinchRotation = e.rotation, ig._lastPinchEvent = e, this.updateViewport(n, eg, { isDragging: !0 }), !0;
	}
	_onPinch(e) {
		if (!this.touchZoom && !this.touchRotate || !this.isDragging()) return !1;
		let t = this.controllerState;
		if (this.touchZoom) {
			let { scale: n } = e, r = this.getCenter(e);
			t = t.zoom({
				pos: r,
				scale: n
			});
		}
		if (this.touchRotate) {
			let { rotation: n } = e;
			t = t.rotate({ deltaAngleX: ig._startPinchRotation - n });
		}
		return this.updateViewport(t, eg, {
			isDragging: !0,
			isPanning: this.touchZoom,
			isZooming: this.touchZoom,
			isRotating: this.touchRotate
		}), ig._lastPinchEvent = e, !0;
	}
	_onPinchEnd(e) {
		if (!this.isDragging()) return !1;
		let { inertia: t } = this, { _lastPinchEvent: n } = ig;
		if (this.touchZoom && t && n && e.scale !== n.scale) {
			let r = this.getCenter(e), i = this.controllerState.rotateEnd(), a = Math.log2(e.scale), o = 2 ** (a + (a - Math.log2(n.scale)) / (e.deltaTime - n.deltaTime) * t / 2);
			i = i.zoom({
				pos: r,
				scale: o
			}).zoomEnd(), this.updateViewport(i, {
				...this._getTransitionProps({ around: r }),
				transitionDuration: t,
				transitionEasing: ng
			}, {
				isDragging: !1,
				isPanning: this.touchZoom,
				isZooming: this.touchZoom,
				isRotating: !1
			}), this.blockEvents(t);
		} else {
			let e = this.controllerState.zoomEnd().rotateEnd();
			this.updateViewport(e, null, {
				isDragging: !1,
				isPanning: !1,
				isZooming: !1,
				isRotating: !1
			});
		}
		return ig._startPinchRotation = null, ig._lastPinchEvent = null, !0;
	}
	_onDoubleClick(e) {
		if (!this.doubleClickZoom) return !1;
		let t = this.getCenter(e);
		if (!this.isPointInBounds(t, e)) return !1;
		let n = this.isFunctionKeyPressed(e), r = this.controllerState.zoom({
			pos: t,
			scale: n ? .5 : 2
		});
		return this.updateViewport(r, this._getTransitionProps({ around: t }), {
			isZooming: !0,
			isPanning: !0
		}), this.blockEvents(100), !0;
	}
	_onKeyDown(e) {
		if (!this.keyboard) return !1;
		let t = this.isFunctionKeyPressed(e), { zoomSpeed: n, moveSpeed: r, rotateSpeedX: i, rotateSpeedY: a } = this.keyboard === !0 ? {} : this.keyboard, { controllerState: o } = this, s, c = {};
		switch (e.srcEvent.code) {
			case "Minus":
				s = t ? o.zoomOut(n).zoomOut(n) : o.zoomOut(n), c.isZooming = !0;
				break;
			case "Equal":
				s = t ? o.zoomIn(n).zoomIn(n) : o.zoomIn(n), c.isZooming = !0;
				break;
			case "ArrowLeft":
				t ? (s = o.rotateLeft(i), c.isRotating = !0) : (s = o.moveLeft(r), c.isPanning = !0);
				break;
			case "ArrowRight":
				t ? (s = o.rotateRight(i), c.isRotating = !0) : (s = o.moveRight(r), c.isPanning = !0);
				break;
			case "ArrowUp":
				t ? (s = o.rotateUp(a), c.isRotating = !0) : (s = o.moveUp(r), c.isPanning = !0);
				break;
			case "ArrowDown":
				t ? (s = o.rotateDown(a), c.isRotating = !0) : (s = o.moveDown(r), c.isPanning = !0);
				break;
			default: return !1;
		}
		return this.updateViewport(s, this._getTransitionProps(), c), !0;
	}
	_getTransitionProps(e) {
		let { transition: t } = this;
		return !t || !t.transitionInterpolator ? eg : e ? {
			...t,
			transitionInterpolator: new $h({
				...e,
				...t.transitionInterpolator.opts,
				makeViewport: this.controllerState.makeViewport
			})
		} : t;
	}
}, og = class {
	constructor(e, t) {
		this._viewportProps = this.applyConstraints(e), this._state = t;
	}
	getViewportProps() {
		return this._viewportProps;
	}
	getState() {
		return this._state;
	}
}, sg = 5, cg = 1.2, lg = class extends og {
	constructor(e) {
		let { width: t, height: n, latitude: r, longitude: i, zoom: a, bearing: o = 0, pitch: s = 0, altitude: c = 1.5, position: l = [
			0,
			0,
			0
		], maxZoom: u = 20, minZoom: d = 0, maxPitch: f = 60, minPitch: p = 0, startPanLngLat: m, startZoomLngLat: h, startRotatePos: g, startBearing: _, startPitch: v, startZoom: y, normalize: b = !0 } = e;
		Yh(Number.isFinite(i)), Yh(Number.isFinite(r)), Yh(Number.isFinite(a)), super({
			width: t,
			height: n,
			latitude: r,
			longitude: i,
			zoom: a,
			bearing: o,
			pitch: s,
			altitude: c,
			maxZoom: u,
			minZoom: d,
			maxPitch: f,
			minPitch: p,
			normalize: b,
			position: l
		}, {
			startPanLngLat: m,
			startZoomLngLat: h,
			startRotatePos: g,
			startBearing: _,
			startPitch: v,
			startZoom: y
		}), this.makeViewport = e.makeViewport;
	}
	panStart({ pos: e }) {
		return this._getUpdatedState({ startPanLngLat: this._unproject(e) });
	}
	pan({ pos: e, startPos: t }) {
		let n = this.getState().startPanLngLat || this._unproject(t);
		if (!n) return this;
		let r = this.makeViewport(this.getViewportProps()).panByPosition(n, e);
		return this._getUpdatedState(r);
	}
	panEnd() {
		return this._getUpdatedState({ startPanLngLat: null });
	}
	rotateStart({ pos: e }) {
		return this._getUpdatedState({
			startRotatePos: e,
			startBearing: this.getViewportProps().bearing,
			startPitch: this.getViewportProps().pitch
		});
	}
	rotate({ pos: e, deltaAngleX: t = 0, deltaAngleY: n = 0 }) {
		let { startRotatePos: r, startBearing: i, startPitch: a } = this.getState();
		if (!r || i === void 0 || a === void 0) return this;
		let o;
		return o = e ? this._getNewRotation(e, r, a, i) : {
			bearing: i + t,
			pitch: a + n
		}, this._getUpdatedState(o);
	}
	rotateEnd() {
		return this._getUpdatedState({
			startBearing: null,
			startPitch: null
		});
	}
	zoomStart({ pos: e }) {
		return this._getUpdatedState({
			startZoomLngLat: this._unproject(e),
			startZoom: this.getViewportProps().zoom
		});
	}
	zoom({ pos: e, startPos: t, scale: n }) {
		let { startZoom: r, startZoomLngLat: i } = this.getState();
		if (i ||= (r = this.getViewportProps().zoom, this._unproject(t) || this._unproject(e)), !i) return this;
		let { maxZoom: a, minZoom: o } = this.getViewportProps(), s = r + Math.log2(n);
		s = nl(s, o, a);
		let c = this.makeViewport({
			...this.getViewportProps(),
			zoom: s
		});
		return this._getUpdatedState({
			zoom: s,
			...c.panByPosition(i, e)
		});
	}
	zoomEnd() {
		return this._getUpdatedState({
			startZoomLngLat: null,
			startZoom: null
		});
	}
	zoomIn(e = 2) {
		return this._zoomFromCenter(e);
	}
	zoomOut(e = 2) {
		return this._zoomFromCenter(1 / e);
	}
	moveLeft(e = 100) {
		return this._panFromCenter([e, 0]);
	}
	moveRight(e = 100) {
		return this._panFromCenter([-e, 0]);
	}
	moveUp(e = 100) {
		return this._panFromCenter([0, e]);
	}
	moveDown(e = 100) {
		return this._panFromCenter([0, -e]);
	}
	rotateLeft(e = 15) {
		return this._getUpdatedState({ bearing: this.getViewportProps().bearing - e });
	}
	rotateRight(e = 15) {
		return this._getUpdatedState({ bearing: this.getViewportProps().bearing + e });
	}
	rotateUp(e = 10) {
		return this._getUpdatedState({ pitch: this.getViewportProps().pitch + e });
	}
	rotateDown(e = 10) {
		return this._getUpdatedState({ pitch: this.getViewportProps().pitch - e });
	}
	shortestPathFrom(e) {
		let t = e.getViewportProps(), n = { ...this.getViewportProps() }, { bearing: r, longitude: i } = n;
		return Math.abs(r - t.bearing) > 180 && (n.bearing = r < 0 ? r + 360 : r - 360), Math.abs(i - t.longitude) > 180 && (n.longitude = i < 0 ? i + 360 : i - 360), n;
	}
	applyConstraints(e) {
		let { maxZoom: t, minZoom: n, zoom: r } = e;
		e.zoom = nl(r, n, t);
		let { maxPitch: i, minPitch: a, pitch: o } = e;
		e.pitch = nl(o, a, i);
		let { normalize: s = !0 } = e;
		return s && Object.assign(e, jp(e)), e;
	}
	_zoomFromCenter(e) {
		let { width: t, height: n } = this.getViewportProps();
		return this.zoom({
			pos: [t / 2, n / 2],
			scale: e
		});
	}
	_panFromCenter(e) {
		let { width: t, height: n } = this.getViewportProps();
		return this.pan({
			startPos: [t / 2, n / 2],
			pos: [t / 2 + e[0], n / 2 + e[1]]
		});
	}
	_getUpdatedState(e) {
		return new this.constructor({
			makeViewport: this.makeViewport,
			...this.getViewportProps(),
			...this.getState(),
			...e
		});
	}
	_unproject(e) {
		let t = this.makeViewport(this.getViewportProps());
		return e && t.unproject(e);
	}
	_getNewRotation(e, t, n, r) {
		let i = e[0] - t[0], a = e[1] - t[1], o = e[1], s = t[1], { width: c, height: l } = this.getViewportProps(), u = i / c, d = 0;
		a > 0 ? Math.abs(l - s) > sg && (d = a / (s - l) * cg) : a < 0 && s > sg && (d = 1 - o / s), d = nl(d, -1, 1);
		let { minPitch: f, maxPitch: p } = this.getViewportProps(), m = r + 180 * u, h = n;
		return d > 0 ? h = n + d * (p - n) : d < 0 && (h = n - d * (f - n)), {
			pitch: h,
			bearing: m
		};
	}
}, ug = class extends ag {
	constructor() {
		super(...arguments), this.ControllerState = lg, this.transition = {
			transitionDuration: 300,
			transitionInterpolator: new $h({ transitionProps: {
				compare: [
					"longitude",
					"latitude",
					"zoom",
					"bearing",
					"pitch",
					"position"
				],
				required: [
					"longitude",
					"latitude",
					"zoom"
				]
			} })
		}, this.dragMode = "pan";
	}
	setProps(e) {
		e.position = e.position || [
			0,
			0,
			0
		];
		let t = this.props;
		super.setProps(e), t && t.height === e.height || this.updateViewport(new this.ControllerState({
			makeViewport: this.makeViewport,
			...e,
			...this.state
		}));
	}
}, dg = class extends Hh {
	constructor(e = {}) {
		super(e);
	}
	getViewportType() {
		return Am;
	}
	get ControllerType() {
		return ug;
	}
};
dg.displayName = "MapView";
// node_modules/@deck.gl/core/dist/lib/effect-manager.js
var fg = new pm();
function pg(e, t) {
	return (e.order ?? Infinity) - (t.order ?? Infinity);
}
var mg = class {
	constructor(e) {
		this._resolvedEffects = [], this._defaultEffects = [], this.effects = [], this._context = e, this._needsRedraw = "Initial render", this._setEffects([]);
	}
	addDefaultEffect(e) {
		let t = this._defaultEffects;
		if (!t.find((t) => t.id === e.id)) {
			let n = t.findIndex((t) => pg(t, e) > 0);
			n < 0 ? t.push(e) : t.splice(n, 0, e), e.setup(this._context), this._setEffects(this.effects);
		}
	}
	setProps(e) {
		"effects" in e && (Lh(e.effects, this.effects, 1) || this._setEffects(e.effects));
	}
	needsRedraw(e = { clearRedrawFlags: !1 }) {
		let t = this._needsRedraw;
		return e.clearRedrawFlags && (this._needsRedraw = !1), t;
	}
	getEffects() {
		return this._resolvedEffects;
	}
	_setEffects(e) {
		let t = {};
		for (let e of this.effects) t[e.id] = e;
		let n = [];
		for (let r of e) {
			let e = t[r.id], i = r;
			e && e !== r ? e.setProps ? (e.setProps(r.props), i = e) : e.cleanup(this._context) : e || r.setup(this._context), n.push(i), delete t[r.id];
		}
		for (let e in t) t[e].cleanup(this._context);
		this.effects = n, this._resolvedEffects = n.concat(this._defaultEffects), e.some((e) => e instanceof pm) || this._resolvedEffects.push(fg), this._needsRedraw = "effects changed";
	}
	finalize() {
		for (let e of this._resolvedEffects) e.cleanup(this._context);
		this.effects.length = 0, this._resolvedEffects.length = 0, this._defaultEffects.length = 0;
	}
}, hg = class extends am {
	shouldDrawLayer(e) {
		let { operation: t } = e.props;
		return t.includes("draw") || t.includes("terrain");
	}
}, gg = "deckRenderer.renderLayers", _g = class {
	constructor(e) {
		this.device = e, this.layerFilter = null, this.drawPickingColors = !1, this.drawLayersPass = new hg(e), this.pickLayersPass = new yh(e), this.renderCount = 0, this._needsRedraw = "Initial render", this.renderBuffers = [], this.lastPostProcessEffect = null;
	}
	setProps(e) {
		this.layerFilter !== e.layerFilter && (this.layerFilter = e.layerFilter, this._needsRedraw = "layerFilter changed"), this.drawPickingColors !== e.drawPickingColors && (this.drawPickingColors = e.drawPickingColors, this._needsRedraw = "drawPickingColors changed");
	}
	renderLayers(e) {
		if (!e.viewports.length) return;
		let t = this.drawPickingColors ? this.pickLayersPass : this.drawLayersPass, n = {
			layerFilter: this.layerFilter,
			isPicking: this.drawPickingColors,
			...e
		};
		n.effects && this._preRender(n.effects, n);
		let r = this.lastPostProcessEffect ? this.renderBuffers[0] : n.target;
		this.lastPostProcessEffect && (n.clearColor = [
			0,
			0,
			0,
			0
		], n.clearCanvas = !0);
		let i = t.render({
			...n,
			target: r
		});
		n.effects && this._postRender(n.effects, n), this.renderCount++, Gr(gg, this, i, e);
	}
	needsRedraw(e = { clearRedrawFlags: !1 }) {
		let t = this._needsRedraw;
		return e.clearRedrawFlags && (this._needsRedraw = !1), t;
	}
	finalize() {
		let { renderBuffers: e } = this;
		for (let t of e) t.delete();
		e.length = 0;
	}
	_preRender(e, t) {
		this.lastPostProcessEffect = null, t.preRenderStats = t.preRenderStats || {};
		for (let n of e) t.preRenderStats[n.id] = n.preRender(t), n.postRender && (this.lastPostProcessEffect = n.id);
		this.lastPostProcessEffect && this._resizeRenderBuffers();
	}
	_resizeRenderBuffers() {
		let { renderBuffers: e } = this, t = this.device.canvasContext.getDrawingBufferSize();
		e.length === 0 && [0, 1].map((t) => {
			let n = this.device.createTexture({ sampler: {
				minFilter: "linear",
				magFilter: "linear"
			} });
			e.push(this.device.createFramebuffer({
				id: `deck-renderbuffer-${t}`,
				colorAttachments: [n]
			}));
		});
		for (let n of e) n.resize(t);
	}
	_postRender(e, t) {
		let { renderBuffers: n } = this, r = {
			...t,
			inputBuffer: n[0],
			swapBuffer: n[1]
		};
		for (let i of e) if (i.postRender) {
			r.target = i.id === this.lastPostProcessEffect ? t.target : void 0;
			let e = i.postRender(r);
			r.inputBuffer = e, r.swapBuffer = e === n[0] ? n[1] : n[0];
		}
	}
}, vg = {
	pickedColor: null,
	pickedObjectIndex: -1
};
function yg({ pickedColors: e, decodePickingColor: t, deviceX: n, deviceY: r, deviceRadius: i, deviceRect: a }) {
	let { x: o, y: s, width: c, height: l } = a, u = i * i, d = -1, f = 0;
	for (let t = 0; t < l; t++) {
		let i = t + s - r, a = i * i;
		if (a > u) f += 4 * c;
		else for (let t = 0; t < c; t++) {
			if (e[f + 3] - 1 >= 0) {
				let e = t + o - n, r = e * e + a;
				r <= u && (u = r, d = f);
			}
			f += 4;
		}
	}
	if (d >= 0) {
		let n = e.slice(d, d + 4), r = t(n);
		if (r) {
			let e = Math.floor(d / 4 / c), t = d / 4 - e * c;
			return {
				...r,
				pickedColor: n,
				pickedX: o + t,
				pickedY: s + e
			};
		}
		E.error("Picked non-existent layer. Is picking buffer corrupt?")();
	}
	return vg;
}
function bg({ pickedColors: e, decodePickingColor: t }) {
	let n = /* @__PURE__ */ new Map();
	if (e) {
		for (let r = 0; r < e.length; r += 4) if (e[r + 3] - 1 >= 0) {
			let i = e.slice(r, r + 4), a = i.join(",");
			if (!n.has(a)) {
				let e = t(i);
				e ? n.set(a, {
					...e,
					color: i
				}) : E.error("Picked non-existent layer. Is picking buffer corrupt?")();
			}
		}
	}
	return Array.from(n.values());
}
// node_modules/@deck.gl/core/dist/lib/picking/pick-info.js
function xg({ pickInfo: e, viewports: t, pixelRatio: n, x: r, y: i, z: a }) {
	let o = t[0];
	t.length > 1 && (o = wg(e?.pickedViewports || t, {
		x: r,
		y: i
	}));
	let s;
	if (o) {
		let e = [r - o.x, i - o.y];
		a !== void 0 && (e[2] = a), s = o.unproject(e);
	}
	return {
		color: null,
		layer: null,
		viewport: o,
		index: -1,
		picked: !1,
		x: r,
		y: i,
		pixel: [r, i],
		coordinate: s,
		devicePixel: e && "pickedX" in e ? [e.pickedX, e.pickedY] : void 0,
		pixelRatio: n
	};
}
function Sg(e) {
	let { pickInfo: t, lastPickedInfo: n, mode: r, layers: i } = e, { pickedColor: a, pickedLayer: o, pickedObjectIndex: s } = t, c = o ? [o] : [];
	if (r === "hover") {
		let e = n.index, t = n.layerId, r = o ? o.props.id : null;
		if (r !== t || s !== e) {
			if (r !== t) {
				let e = i.find((e) => e.props.id === t);
				e && c.unshift(e);
			}
			n.layerId = r, n.index = s, n.info = null;
		}
	}
	let l = xg(e), u = /* @__PURE__ */ new Map();
	return u.set(null, l), c.forEach((e) => {
		let t = { ...l };
		e === o && (t.color = a, t.index = s, t.picked = !0), t = Cg({
			layer: e,
			info: t,
			mode: r
		});
		let i = t.layer;
		e === o && r === "hover" && (n.info = t), u.set(i.id, t), r === "hover" && i.updateAutoHighlight(t);
	}), u;
}
function Cg({ layer: e, info: t, mode: n }) {
	for (; e && t;) {
		let r = t.layer || null;
		t.sourceLayer = r, t.layer = e, t = e.getPickingInfo({
			info: t,
			mode: n,
			sourceLayer: r
		}), e = e.parent;
	}
	return t;
}
function wg(e, t) {
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		if (r.containsPixel(t)) return r;
	}
	return e[0];
}
// node_modules/@deck.gl/core/dist/lib/deck-picker.js
var Tg = class {
	constructor(e) {
		this._pickable = !0, this.device = e, this.pickLayersPass = new yh(e), this.lastPickedInfo = {
			index: -1,
			layerId: null,
			info: null
		};
	}
	setProps(e) {
		"layerFilter" in e && (this.layerFilter = e.layerFilter), "_pickable" in e && (this._pickable = e._pickable);
	}
	finalize() {
		this.pickingFBO && this.pickingFBO.destroy(), this.depthFBO && this.depthFBO.destroy();
	}
	pickObject(e) {
		return this._pickClosestObject(e);
	}
	pickObjects(e) {
		return this._pickVisibleObjects(e);
	}
	getLastPickedObject({ x: e, y: t, layers: n, viewports: r }, i = this.lastPickedInfo.info) {
		let a = i && i.layer && i.layer.id, o = i && i.viewport && i.viewport.id, s = a ? n.find((e) => e.id === a) : null, c = o && r.find((e) => e.id === o) || r[0], l = {
			x: e,
			y: t,
			viewport: c,
			coordinate: c && c.unproject([e - c.x, t - c.y]),
			layer: s
		};
		return {
			...i,
			...l
		};
	}
	_resizeBuffer() {
		if (!this.pickingFBO && (this.pickingFBO = this.device.createFramebuffer({
			colorAttachments: ["rgba8unorm"],
			depthStencilAttachment: "depth16unorm"
		}), this.device.isTextureFormatRenderable("rgba32float"))) {
			let e = this.device.createFramebuffer({
				colorAttachments: ["rgba32float"],
				depthStencilAttachment: "depth16unorm"
			});
			this.depthFBO = e;
		}
		let { canvas: e } = this.device.getDefaultCanvasContext();
		this.pickingFBO?.resize({
			width: e.width,
			height: e.height
		}), this.depthFBO?.resize({
			width: e.width,
			height: e.height
		});
	}
	_getPickable(e) {
		if (this._pickable === !1) return null;
		let t = e.filter((e) => this.pickLayersPass.shouldDrawLayer(e) && !e.isComposite);
		return t.length ? t : null;
	}
	_pickClosestObject({ layers: e, views: t, viewports: n, x: r, y: i, radius: a = 0, depth: o = 1, mode: s = "query", unproject3D: c, onViewportActive: l, effects: u }) {
		let d = this.device.canvasContext.cssToDeviceRatio(), f = this._getPickable(e);
		if (!f || n.length === 0) return {
			result: [],
			emptyInfo: xg({
				viewports: n,
				x: r,
				y: i,
				pixelRatio: d
			})
		};
		this._resizeBuffer();
		let p = this.device.canvasContext.cssToDevicePixels([r, i], !0), m = [p.x + Math.floor(p.width / 2), p.y + Math.floor(p.height / 2)], h = Math.round(a * d), { width: g, height: _ } = this.pickingFBO, v = this._getPickingRect({
			deviceX: m[0],
			deviceY: m[1],
			deviceRadius: h,
			deviceWidth: g,
			deviceHeight: _
		}), y = {
			x: r - a,
			y: i - a,
			width: a * 2 + 1,
			height: a * 2 + 1
		}, b, x = [], S = /* @__PURE__ */ new Set();
		for (let e = 0; e < o; e++) {
			let a;
			a = v ? yg({
				...this._drawAndSample({
					layers: f,
					views: t,
					viewports: n,
					onViewportActive: l,
					deviceRect: v,
					cullRect: y,
					effects: u,
					pass: `picking:${s}`
				}),
				deviceX: m[0],
				deviceY: m[1],
				deviceRadius: h,
				deviceRect: v
			}) : {
				pickedColor: null,
				pickedObjectIndex: -1
			};
			let p;
			if (a.pickedLayer && c && this.depthFBO) {
				let { pickedColors: e } = this._drawAndSample({
					layers: [a.pickedLayer],
					views: t,
					viewports: n,
					onViewportActive: l,
					deviceRect: {
						x: a.pickedX,
						y: a.pickedY,
						width: 1,
						height: 1
					},
					cullRect: y,
					effects: u,
					pass: `picking:${s}:z`
				}, !0);
				e[3] && (p = e[0]);
			}
			a.pickedLayer && e + 1 < o && (S.add(a.pickedLayer), a.pickedLayer.disablePickingIndex(a.pickedObjectIndex)), b = Sg({
				pickInfo: a,
				lastPickedInfo: this.lastPickedInfo,
				mode: s,
				layers: f,
				viewports: n,
				x: r,
				y: i,
				z: p,
				pixelRatio: d
			});
			for (let e of b.values()) e.layer && x.push(e);
			if (!a.pickedColor) break;
		}
		for (let e of S) e.restorePickingColors();
		return {
			result: x,
			emptyInfo: b.get(null)
		};
	}
	_pickVisibleObjects({ layers: e, views: t, viewports: n, x: r, y: i, width: a = 1, height: o = 1, mode: s = "query", maxObjects: c = null, onViewportActive: l, effects: u }) {
		let d = this._getPickable(e);
		if (!d || n.length === 0) return [];
		this._resizeBuffer();
		let f = this.device.canvasContext.cssToDeviceRatio(), p = this.device.canvasContext.cssToDevicePixels([r, i], !0), m = p.x, h = p.y + p.height, g = this.device.canvasContext.cssToDevicePixels([r + a, i + o], !0), _ = g.x + g.width, v = g.y, y = {
			x: m,
			y: v,
			width: _ - m,
			height: h - v
		}, b = bg(this._drawAndSample({
			layers: d,
			views: t,
			viewports: n,
			onViewportActive: l,
			deviceRect: y,
			cullRect: {
				x: r,
				y: i,
				width: a,
				height: o
			},
			effects: u,
			pass: `picking:${s}`
		})), x = /* @__PURE__ */ new Map(), S = [], C = Number.isFinite(c);
		for (let e = 0; e < b.length && !(C && S.length >= c); e++) {
			let t = b[e], n = {
				color: t.pickedColor,
				layer: null,
				index: t.pickedObjectIndex,
				picked: !0,
				x: r,
				y: i,
				pixelRatio: f
			};
			n = Cg({
				layer: t.pickedLayer,
				info: n,
				mode: s
			});
			let a = n.layer.id;
			x.has(a) || x.set(a, /* @__PURE__ */ new Set());
			let o = x.get(a), c = n.object ?? n.index;
			o.has(c) || (o.add(c), S.push(n));
		}
		return S;
	}
	_drawAndSample({ layers: e, views: t, viewports: n, onViewportActive: r, deviceRect: i, cullRect: a, effects: o, pass: s }, c = !1) {
		let l = c ? this.depthFBO : this.pickingFBO, u = {
			layers: e,
			layerFilter: this.layerFilter,
			views: t,
			viewports: n,
			onViewportActive: r,
			pickingFBO: l,
			deviceRect: i,
			cullRect: a,
			effects: o,
			pass: s,
			pickZ: c,
			preRenderStats: {},
			isPicking: !0
		};
		for (let e of o) e.useInPicking && (u.preRenderStats[e.id] = e.preRender(u));
		let { decodePickingColor: d } = this.pickLayersPass.render(u), { x: f, y: p, width: m, height: h } = i, g = new (c ? Float32Array : Uint8Array)(m * h * 4);
		return this.device.readPixelsToArrayWebGL(l, {
			sourceX: f,
			sourceY: p,
			sourceWidth: m,
			sourceHeight: h,
			target: g
		}), {
			pickedColors: g,
			decodePickingColor: d
		};
	}
	_getPickingRect({ deviceX: e, deviceY: t, deviceRadius: n, deviceWidth: r, deviceHeight: i }) {
		let a = Math.max(0, e - n), o = Math.max(0, t - n), s = Math.min(r, e + n + 1) - a, c = Math.min(i, t + n + 1) - o;
		return s <= 0 || c <= 0 ? null : {
			x: a,
			y: o,
			width: s,
			height: c
		};
	}
}, Eg = {
	"top-left": {
		top: 0,
		left: 0
	},
	"top-right": {
		top: 0,
		right: 0
	},
	"bottom-left": {
		bottom: 0,
		left: 0
	},
	"bottom-right": {
		bottom: 0,
		right: 0
	},
	fill: {
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	}
}, Dg = "top-left", Og = "__root", kg = class {
	constructor({ deck: e, parentElement: t }) {
		this.defaultWidgets = [], this.widgets = [], this.resolvedWidgets = [], this.containers = {}, this.lastViewports = {}, this.deck = e, this.parentElement = t;
	}
	getWidgets() {
		return this.resolvedWidgets;
	}
	setProps(e) {
		e.widgets && !Lh(e.widgets, this.widgets, 1) && this._setWidgets(e.widgets);
	}
	finalize() {
		for (let e of this.getWidgets()) this._remove(e);
		this.defaultWidgets.length = 0, this.resolvedWidgets.length = 0;
		for (let e in this.containers) this.containers[e].remove();
	}
	addDefault(e) {
		this.defaultWidgets.find((t) => t.id === e.id) || (this._add(e), this.defaultWidgets.push(e), this._setWidgets(this.widgets));
	}
	_setWidgets(e) {
		let t = {};
		for (let e of this.resolvedWidgets) t[e.id] = e;
		this.resolvedWidgets.length = 0;
		for (let e of this.defaultWidgets) t[e.id] = null, this.resolvedWidgets.push(e);
		for (let n of e) {
			let e = t[n.id];
			e ? e.viewId !== n.viewId || e.placement !== n.placement ? (this._remove(e), this._add(n)) : n !== e && (e.setProps(n.props), n = e) : this._add(n), t[n.id] = null, this.resolvedWidgets.push(n);
		}
		for (let e in t) {
			let n = t[e];
			n && this._remove(n);
		}
		this.widgets = e;
	}
	_add(e) {
		let { viewId: t = null, placement: n = Dg } = e, r = e.onAdd({
			deck: this.deck,
			viewId: t
		});
		r && this._getContainer(t, n).append(r), e._element = r;
	}
	_remove(e) {
		e.onRemove?.(), e._element && e._element.remove(), e._element = void 0;
	}
	_getContainer(e, t) {
		let n = e || Og, r = this.containers[n];
		r || (r = document.createElement("div"), r.style.pointerEvents = "none", r.style.position = "absolute", r.style.overflow = "hidden", this.parentElement?.append(r), this.containers[n] = r);
		let i = r.querySelector(`.${t}`);
		return i || (i = document.createElement("div"), i.className = t, i.style.position = "absolute", i.style.zIndex = "2", Object.assign(i.style, Eg[t]), r.append(i)), i;
	}
	_updateContainers() {
		let e = this.deck.width, t = this.deck.height;
		for (let n in this.containers) {
			let r = this.lastViewports[n] || null, i = n === Og || r, a = this.containers[n];
			i ? (a.style.display = "block", a.style.left = `${r ? r.x : 0}px`, a.style.top = `${r ? r.y : 0}px`, a.style.width = `${r ? r.width : e}px`, a.style.height = `${r ? r.height : t}px`) : a.style.display = "none";
		}
	}
	onRedraw({ viewports: e, layers: t }) {
		let n = e.reduce((e, t) => (e[t.id] = t, e), {});
		for (let r of this.getWidgets()) {
			let { viewId: i } = r;
			if (i) {
				let e = n[i];
				e && (r.onViewportChange && r.onViewportChange(e), r.onRedraw?.({
					viewports: [e],
					layers: t
				}));
			} else {
				if (r.onViewportChange) for (let t of e) r.onViewportChange(t);
				r.onRedraw?.({
					viewports: e,
					layers: t
				});
			}
		}
		this.lastViewports = n, this._updateContainers();
	}
	onHover(e, t) {
		for (let n of this.getWidgets()) {
			let { viewId: r } = n;
			r && r !== e.viewport?.id || n.onHover?.(e, t);
		}
	}
	onEvent(e, t) {
		let n = jf[t.type];
		if (n) for (let r of this.getWidgets()) {
			let { viewId: i } = r;
			i && i !== e.viewport?.id || r[n]?.(e, t);
		}
	}
}, Ag = {
	zIndex: "1",
	position: "absolute",
	pointerEvents: "none",
	color: "#a0a7b4",
	backgroundColor: "#29323c",
	padding: "10px",
	top: "0",
	left: "0",
	display: "none"
}, jg = class {
	constructor() {
		this.id = "default-tooltip", this.placement = "fill", this.props = {}, this.isVisible = !1;
	}
	onAdd({ deck: e }) {
		let t = document.createElement("div");
		return t.className = "deck-tooltip", Object.assign(t.style, Ag), this.deck = e, this.element = t, t;
	}
	onRemove() {
		this.deck = void 0, this.element = void 0;
	}
	setProps() {}
	onViewportChange(e) {
		this.isVisible && e.id === this.lastViewport?.id && e !== this.lastViewport && this.setTooltip(null);
	}
	onHover(e) {
		let { deck: t } = this, n = t && t.props.getTooltip;
		if (!n) return;
		let r = n(e);
		this.lastViewport = e.viewport, this.setTooltip(r, e.x, e.y);
	}
	setTooltip(e, t, n) {
		let r = this.element;
		if (r) {
			if (typeof e == "string") r.innerText = e;
			else if (e) e.text && (r.innerText = e.text), e.html && (r.innerHTML = e.html), e.className && (r.className = e.className);
			else {
				this.isVisible = !1, r.style.display = "none";
				return;
			}
			this.isVisible = !0, r.style.display = "block", r.style.transform = `translate(${t}px, ${n}px)`, e && typeof e == "object" && "style" in e && Object.assign(r.style, e.style);
		}
	}
}, Mg;
(function(e) {
	e[e.DEPTH_BUFFER_BIT = 256] = "DEPTH_BUFFER_BIT", e[e.STENCIL_BUFFER_BIT = 1024] = "STENCIL_BUFFER_BIT", e[e.COLOR_BUFFER_BIT = 16384] = "COLOR_BUFFER_BIT", e[e.POINTS = 0] = "POINTS", e[e.LINES = 1] = "LINES", e[e.LINE_LOOP = 2] = "LINE_LOOP", e[e.LINE_STRIP = 3] = "LINE_STRIP", e[e.TRIANGLES = 4] = "TRIANGLES", e[e.TRIANGLE_STRIP = 5] = "TRIANGLE_STRIP", e[e.TRIANGLE_FAN = 6] = "TRIANGLE_FAN", e[e.ZERO = 0] = "ZERO", e[e.ONE = 1] = "ONE", e[e.SRC_COLOR = 768] = "SRC_COLOR", e[e.ONE_MINUS_SRC_COLOR = 769] = "ONE_MINUS_SRC_COLOR", e[e.SRC_ALPHA = 770] = "SRC_ALPHA", e[e.ONE_MINUS_SRC_ALPHA = 771] = "ONE_MINUS_SRC_ALPHA", e[e.DST_ALPHA = 772] = "DST_ALPHA", e[e.ONE_MINUS_DST_ALPHA = 773] = "ONE_MINUS_DST_ALPHA", e[e.DST_COLOR = 774] = "DST_COLOR", e[e.ONE_MINUS_DST_COLOR = 775] = "ONE_MINUS_DST_COLOR", e[e.SRC_ALPHA_SATURATE = 776] = "SRC_ALPHA_SATURATE", e[e.CONSTANT_COLOR = 32769] = "CONSTANT_COLOR", e[e.ONE_MINUS_CONSTANT_COLOR = 32770] = "ONE_MINUS_CONSTANT_COLOR", e[e.CONSTANT_ALPHA = 32771] = "CONSTANT_ALPHA", e[e.ONE_MINUS_CONSTANT_ALPHA = 32772] = "ONE_MINUS_CONSTANT_ALPHA", e[e.FUNC_ADD = 32774] = "FUNC_ADD", e[e.FUNC_SUBTRACT = 32778] = "FUNC_SUBTRACT", e[e.FUNC_REVERSE_SUBTRACT = 32779] = "FUNC_REVERSE_SUBTRACT", e[e.BLEND_EQUATION = 32777] = "BLEND_EQUATION", e[e.BLEND_EQUATION_RGB = 32777] = "BLEND_EQUATION_RGB", e[e.BLEND_EQUATION_ALPHA = 34877] = "BLEND_EQUATION_ALPHA", e[e.BLEND_DST_RGB = 32968] = "BLEND_DST_RGB", e[e.BLEND_SRC_RGB = 32969] = "BLEND_SRC_RGB", e[e.BLEND_DST_ALPHA = 32970] = "BLEND_DST_ALPHA", e[e.BLEND_SRC_ALPHA = 32971] = "BLEND_SRC_ALPHA", e[e.BLEND_COLOR = 32773] = "BLEND_COLOR", e[e.ARRAY_BUFFER_BINDING = 34964] = "ARRAY_BUFFER_BINDING", e[e.ELEMENT_ARRAY_BUFFER_BINDING = 34965] = "ELEMENT_ARRAY_BUFFER_BINDING", e[e.LINE_WIDTH = 2849] = "LINE_WIDTH", e[e.ALIASED_POINT_SIZE_RANGE = 33901] = "ALIASED_POINT_SIZE_RANGE", e[e.ALIASED_LINE_WIDTH_RANGE = 33902] = "ALIASED_LINE_WIDTH_RANGE", e[e.CULL_FACE_MODE = 2885] = "CULL_FACE_MODE", e[e.FRONT_FACE = 2886] = "FRONT_FACE", e[e.DEPTH_RANGE = 2928] = "DEPTH_RANGE", e[e.DEPTH_WRITEMASK = 2930] = "DEPTH_WRITEMASK", e[e.DEPTH_CLEAR_VALUE = 2931] = "DEPTH_CLEAR_VALUE", e[e.DEPTH_FUNC = 2932] = "DEPTH_FUNC", e[e.STENCIL_CLEAR_VALUE = 2961] = "STENCIL_CLEAR_VALUE", e[e.STENCIL_FUNC = 2962] = "STENCIL_FUNC", e[e.STENCIL_FAIL = 2964] = "STENCIL_FAIL", e[e.STENCIL_PASS_DEPTH_FAIL = 2965] = "STENCIL_PASS_DEPTH_FAIL", e[e.STENCIL_PASS_DEPTH_PASS = 2966] = "STENCIL_PASS_DEPTH_PASS", e[e.STENCIL_REF = 2967] = "STENCIL_REF", e[e.STENCIL_VALUE_MASK = 2963] = "STENCIL_VALUE_MASK", e[e.STENCIL_WRITEMASK = 2968] = "STENCIL_WRITEMASK", e[e.STENCIL_BACK_FUNC = 34816] = "STENCIL_BACK_FUNC", e[e.STENCIL_BACK_FAIL = 34817] = "STENCIL_BACK_FAIL", e[e.STENCIL_BACK_PASS_DEPTH_FAIL = 34818] = "STENCIL_BACK_PASS_DEPTH_FAIL", e[e.STENCIL_BACK_PASS_DEPTH_PASS = 34819] = "STENCIL_BACK_PASS_DEPTH_PASS", e[e.STENCIL_BACK_REF = 36003] = "STENCIL_BACK_REF", e[e.STENCIL_BACK_VALUE_MASK = 36004] = "STENCIL_BACK_VALUE_MASK", e[e.STENCIL_BACK_WRITEMASK = 36005] = "STENCIL_BACK_WRITEMASK", e[e.VIEWPORT = 2978] = "VIEWPORT", e[e.SCISSOR_BOX = 3088] = "SCISSOR_BOX", e[e.COLOR_CLEAR_VALUE = 3106] = "COLOR_CLEAR_VALUE", e[e.COLOR_WRITEMASK = 3107] = "COLOR_WRITEMASK", e[e.UNPACK_ALIGNMENT = 3317] = "UNPACK_ALIGNMENT", e[e.PACK_ALIGNMENT = 3333] = "PACK_ALIGNMENT", e[e.MAX_TEXTURE_SIZE = 3379] = "MAX_TEXTURE_SIZE", e[e.MAX_VIEWPORT_DIMS = 3386] = "MAX_VIEWPORT_DIMS", e[e.SUBPIXEL_BITS = 3408] = "SUBPIXEL_BITS", e[e.RED_BITS = 3410] = "RED_BITS", e[e.GREEN_BITS = 3411] = "GREEN_BITS", e[e.BLUE_BITS = 3412] = "BLUE_BITS", e[e.ALPHA_BITS = 3413] = "ALPHA_BITS", e[e.DEPTH_BITS = 3414] = "DEPTH_BITS", e[e.STENCIL_BITS = 3415] = "STENCIL_BITS", e[e.POLYGON_OFFSET_UNITS = 10752] = "POLYGON_OFFSET_UNITS", e[e.POLYGON_OFFSET_FACTOR = 32824] = "POLYGON_OFFSET_FACTOR", e[e.TEXTURE_BINDING_2D = 32873] = "TEXTURE_BINDING_2D", e[e.SAMPLE_BUFFERS = 32936] = "SAMPLE_BUFFERS", e[e.SAMPLES = 32937] = "SAMPLES", e[e.SAMPLE_COVERAGE_VALUE = 32938] = "SAMPLE_COVERAGE_VALUE", e[e.SAMPLE_COVERAGE_INVERT = 32939] = "SAMPLE_COVERAGE_INVERT", e[e.COMPRESSED_TEXTURE_FORMATS = 34467] = "COMPRESSED_TEXTURE_FORMATS", e[e.VENDOR = 7936] = "VENDOR", e[e.RENDERER = 7937] = "RENDERER", e[e.VERSION = 7938] = "VERSION", e[e.IMPLEMENTATION_COLOR_READ_TYPE = 35738] = "IMPLEMENTATION_COLOR_READ_TYPE", e[e.IMPLEMENTATION_COLOR_READ_FORMAT = 35739] = "IMPLEMENTATION_COLOR_READ_FORMAT", e[e.BROWSER_DEFAULT_WEBGL = 37444] = "BROWSER_DEFAULT_WEBGL", e[e.STATIC_DRAW = 35044] = "STATIC_DRAW", e[e.STREAM_DRAW = 35040] = "STREAM_DRAW", e[e.DYNAMIC_DRAW = 35048] = "DYNAMIC_DRAW", e[e.ARRAY_BUFFER = 34962] = "ARRAY_BUFFER", e[e.ELEMENT_ARRAY_BUFFER = 34963] = "ELEMENT_ARRAY_BUFFER", e[e.BUFFER_SIZE = 34660] = "BUFFER_SIZE", e[e.BUFFER_USAGE = 34661] = "BUFFER_USAGE", e[e.CURRENT_VERTEX_ATTRIB = 34342] = "CURRENT_VERTEX_ATTRIB", e[e.VERTEX_ATTRIB_ARRAY_ENABLED = 34338] = "VERTEX_ATTRIB_ARRAY_ENABLED", e[e.VERTEX_ATTRIB_ARRAY_SIZE = 34339] = "VERTEX_ATTRIB_ARRAY_SIZE", e[e.VERTEX_ATTRIB_ARRAY_STRIDE = 34340] = "VERTEX_ATTRIB_ARRAY_STRIDE", e[e.VERTEX_ATTRIB_ARRAY_TYPE = 34341] = "VERTEX_ATTRIB_ARRAY_TYPE", e[e.VERTEX_ATTRIB_ARRAY_NORMALIZED = 34922] = "VERTEX_ATTRIB_ARRAY_NORMALIZED", e[e.VERTEX_ATTRIB_ARRAY_POINTER = 34373] = "VERTEX_ATTRIB_ARRAY_POINTER", e[e.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 34975] = "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING", e[e.CULL_FACE = 2884] = "CULL_FACE", e[e.FRONT = 1028] = "FRONT", e[e.BACK = 1029] = "BACK", e[e.FRONT_AND_BACK = 1032] = "FRONT_AND_BACK", e[e.BLEND = 3042] = "BLEND", e[e.DEPTH_TEST = 2929] = "DEPTH_TEST", e[e.DITHER = 3024] = "DITHER", e[e.POLYGON_OFFSET_FILL = 32823] = "POLYGON_OFFSET_FILL", e[e.SAMPLE_ALPHA_TO_COVERAGE = 32926] = "SAMPLE_ALPHA_TO_COVERAGE", e[e.SAMPLE_COVERAGE = 32928] = "SAMPLE_COVERAGE", e[e.SCISSOR_TEST = 3089] = "SCISSOR_TEST", e[e.STENCIL_TEST = 2960] = "STENCIL_TEST", e[e.NO_ERROR = 0] = "NO_ERROR", e[e.INVALID_ENUM = 1280] = "INVALID_ENUM", e[e.INVALID_VALUE = 1281] = "INVALID_VALUE", e[e.INVALID_OPERATION = 1282] = "INVALID_OPERATION", e[e.OUT_OF_MEMORY = 1285] = "OUT_OF_MEMORY", e[e.CONTEXT_LOST_WEBGL = 37442] = "CONTEXT_LOST_WEBGL", e[e.CW = 2304] = "CW", e[e.CCW = 2305] = "CCW", e[e.DONT_CARE = 4352] = "DONT_CARE", e[e.FASTEST = 4353] = "FASTEST", e[e.NICEST = 4354] = "NICEST", e[e.GENERATE_MIPMAP_HINT = 33170] = "GENERATE_MIPMAP_HINT", e[e.BYTE = 5120] = "BYTE", e[e.UNSIGNED_BYTE = 5121] = "UNSIGNED_BYTE", e[e.SHORT = 5122] = "SHORT", e[e.UNSIGNED_SHORT = 5123] = "UNSIGNED_SHORT", e[e.INT = 5124] = "INT", e[e.UNSIGNED_INT = 5125] = "UNSIGNED_INT", e[e.FLOAT = 5126] = "FLOAT", e[e.DOUBLE = 5130] = "DOUBLE", e[e.DEPTH_COMPONENT = 6402] = "DEPTH_COMPONENT", e[e.ALPHA = 6406] = "ALPHA", e[e.RGB = 6407] = "RGB", e[e.RGBA = 6408] = "RGBA", e[e.LUMINANCE = 6409] = "LUMINANCE", e[e.LUMINANCE_ALPHA = 6410] = "LUMINANCE_ALPHA", e[e.UNSIGNED_SHORT_4_4_4_4 = 32819] = "UNSIGNED_SHORT_4_4_4_4", e[e.UNSIGNED_SHORT_5_5_5_1 = 32820] = "UNSIGNED_SHORT_5_5_5_1", e[e.UNSIGNED_SHORT_5_6_5 = 33635] = "UNSIGNED_SHORT_5_6_5", e[e.FRAGMENT_SHADER = 35632] = "FRAGMENT_SHADER", e[e.VERTEX_SHADER = 35633] = "VERTEX_SHADER", e[e.COMPILE_STATUS = 35713] = "COMPILE_STATUS", e[e.DELETE_STATUS = 35712] = "DELETE_STATUS", e[e.LINK_STATUS = 35714] = "LINK_STATUS", e[e.VALIDATE_STATUS = 35715] = "VALIDATE_STATUS", e[e.ATTACHED_SHADERS = 35717] = "ATTACHED_SHADERS", e[e.ACTIVE_ATTRIBUTES = 35721] = "ACTIVE_ATTRIBUTES", e[e.ACTIVE_UNIFORMS = 35718] = "ACTIVE_UNIFORMS", e[e.MAX_VERTEX_ATTRIBS = 34921] = "MAX_VERTEX_ATTRIBS", e[e.MAX_VERTEX_UNIFORM_VECTORS = 36347] = "MAX_VERTEX_UNIFORM_VECTORS", e[e.MAX_VARYING_VECTORS = 36348] = "MAX_VARYING_VECTORS", e[e.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 35661] = "MAX_COMBINED_TEXTURE_IMAGE_UNITS", e[e.MAX_VERTEX_TEXTURE_IMAGE_UNITS = 35660] = "MAX_VERTEX_TEXTURE_IMAGE_UNITS", e[e.MAX_TEXTURE_IMAGE_UNITS = 34930] = "MAX_TEXTURE_IMAGE_UNITS", e[e.MAX_FRAGMENT_UNIFORM_VECTORS = 36349] = "MAX_FRAGMENT_UNIFORM_VECTORS", e[e.SHADER_TYPE = 35663] = "SHADER_TYPE", e[e.SHADING_LANGUAGE_VERSION = 35724] = "SHADING_LANGUAGE_VERSION", e[e.CURRENT_PROGRAM = 35725] = "CURRENT_PROGRAM", e[e.NEVER = 512] = "NEVER", e[e.LESS = 513] = "LESS", e[e.EQUAL = 514] = "EQUAL", e[e.LEQUAL = 515] = "LEQUAL", e[e.GREATER = 516] = "GREATER", e[e.NOTEQUAL = 517] = "NOTEQUAL", e[e.GEQUAL = 518] = "GEQUAL", e[e.ALWAYS = 519] = "ALWAYS", e[e.KEEP = 7680] = "KEEP", e[e.REPLACE = 7681] = "REPLACE", e[e.INCR = 7682] = "INCR", e[e.DECR = 7683] = "DECR", e[e.INVERT = 5386] = "INVERT", e[e.INCR_WRAP = 34055] = "INCR_WRAP", e[e.DECR_WRAP = 34056] = "DECR_WRAP", e[e.NEAREST = 9728] = "NEAREST", e[e.LINEAR = 9729] = "LINEAR", e[e.NEAREST_MIPMAP_NEAREST = 9984] = "NEAREST_MIPMAP_NEAREST", e[e.LINEAR_MIPMAP_NEAREST = 9985] = "LINEAR_MIPMAP_NEAREST", e[e.NEAREST_MIPMAP_LINEAR = 9986] = "NEAREST_MIPMAP_LINEAR", e[e.LINEAR_MIPMAP_LINEAR = 9987] = "LINEAR_MIPMAP_LINEAR", e[e.TEXTURE_MAG_FILTER = 10240] = "TEXTURE_MAG_FILTER", e[e.TEXTURE_MIN_FILTER = 10241] = "TEXTURE_MIN_FILTER", e[e.TEXTURE_WRAP_S = 10242] = "TEXTURE_WRAP_S", e[e.TEXTURE_WRAP_T = 10243] = "TEXTURE_WRAP_T", e[e.TEXTURE_2D = 3553] = "TEXTURE_2D", e[e.TEXTURE = 5890] = "TEXTURE", e[e.TEXTURE_CUBE_MAP = 34067] = "TEXTURE_CUBE_MAP", e[e.TEXTURE_BINDING_CUBE_MAP = 34068] = "TEXTURE_BINDING_CUBE_MAP", e[e.TEXTURE_CUBE_MAP_POSITIVE_X = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X", e[e.TEXTURE_CUBE_MAP_NEGATIVE_X = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X", e[e.TEXTURE_CUBE_MAP_POSITIVE_Y = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y", e[e.TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y", e[e.TEXTURE_CUBE_MAP_POSITIVE_Z = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z", e[e.TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z", e[e.MAX_CUBE_MAP_TEXTURE_SIZE = 34076] = "MAX_CUBE_MAP_TEXTURE_SIZE", e[e.TEXTURE0 = 33984] = "TEXTURE0", e[e.ACTIVE_TEXTURE = 34016] = "ACTIVE_TEXTURE", e[e.REPEAT = 10497] = "REPEAT", e[e.CLAMP_TO_EDGE = 33071] = "CLAMP_TO_EDGE", e[e.MIRRORED_REPEAT = 33648] = "MIRRORED_REPEAT", e[e.TEXTURE_WIDTH = 4096] = "TEXTURE_WIDTH", e[e.TEXTURE_HEIGHT = 4097] = "TEXTURE_HEIGHT", e[e.FLOAT_VEC2 = 35664] = "FLOAT_VEC2", e[e.FLOAT_VEC3 = 35665] = "FLOAT_VEC3", e[e.FLOAT_VEC4 = 35666] = "FLOAT_VEC4", e[e.INT_VEC2 = 35667] = "INT_VEC2", e[e.INT_VEC3 = 35668] = "INT_VEC3", e[e.INT_VEC4 = 35669] = "INT_VEC4", e[e.BOOL = 35670] = "BOOL", e[e.BOOL_VEC2 = 35671] = "BOOL_VEC2", e[e.BOOL_VEC3 = 35672] = "BOOL_VEC3", e[e.BOOL_VEC4 = 35673] = "BOOL_VEC4", e[e.FLOAT_MAT2 = 35674] = "FLOAT_MAT2", e[e.FLOAT_MAT3 = 35675] = "FLOAT_MAT3", e[e.FLOAT_MAT4 = 35676] = "FLOAT_MAT4", e[e.SAMPLER_2D = 35678] = "SAMPLER_2D", e[e.SAMPLER_CUBE = 35680] = "SAMPLER_CUBE", e[e.LOW_FLOAT = 36336] = "LOW_FLOAT", e[e.MEDIUM_FLOAT = 36337] = "MEDIUM_FLOAT", e[e.HIGH_FLOAT = 36338] = "HIGH_FLOAT", e[e.LOW_INT = 36339] = "LOW_INT", e[e.MEDIUM_INT = 36340] = "MEDIUM_INT", e[e.HIGH_INT = 36341] = "HIGH_INT", e[e.FRAMEBUFFER = 36160] = "FRAMEBUFFER", e[e.RENDERBUFFER = 36161] = "RENDERBUFFER", e[e.RGBA4 = 32854] = "RGBA4", e[e.RGB5_A1 = 32855] = "RGB5_A1", e[e.RGB565 = 36194] = "RGB565", e[e.DEPTH_COMPONENT16 = 33189] = "DEPTH_COMPONENT16", e[e.STENCIL_INDEX = 6401] = "STENCIL_INDEX", e[e.STENCIL_INDEX8 = 36168] = "STENCIL_INDEX8", e[e.DEPTH_STENCIL = 34041] = "DEPTH_STENCIL", e[e.RENDERBUFFER_WIDTH = 36162] = "RENDERBUFFER_WIDTH", e[e.RENDERBUFFER_HEIGHT = 36163] = "RENDERBUFFER_HEIGHT", e[e.RENDERBUFFER_INTERNAL_FORMAT = 36164] = "RENDERBUFFER_INTERNAL_FORMAT", e[e.RENDERBUFFER_RED_SIZE = 36176] = "RENDERBUFFER_RED_SIZE", e[e.RENDERBUFFER_GREEN_SIZE = 36177] = "RENDERBUFFER_GREEN_SIZE", e[e.RENDERBUFFER_BLUE_SIZE = 36178] = "RENDERBUFFER_BLUE_SIZE", e[e.RENDERBUFFER_ALPHA_SIZE = 36179] = "RENDERBUFFER_ALPHA_SIZE", e[e.RENDERBUFFER_DEPTH_SIZE = 36180] = "RENDERBUFFER_DEPTH_SIZE", e[e.RENDERBUFFER_STENCIL_SIZE = 36181] = "RENDERBUFFER_STENCIL_SIZE", e[e.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 36048] = "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE", e[e.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 36049] = "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME", e[e.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 36050] = "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL", e[e.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 36051] = "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE", e[e.COLOR_ATTACHMENT0 = 36064] = "COLOR_ATTACHMENT0", e[e.DEPTH_ATTACHMENT = 36096] = "DEPTH_ATTACHMENT", e[e.STENCIL_ATTACHMENT = 36128] = "STENCIL_ATTACHMENT", e[e.DEPTH_STENCIL_ATTACHMENT = 33306] = "DEPTH_STENCIL_ATTACHMENT", e[e.NONE = 0] = "NONE", e[e.FRAMEBUFFER_COMPLETE = 36053] = "FRAMEBUFFER_COMPLETE", e[e.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054] = "FRAMEBUFFER_INCOMPLETE_ATTACHMENT", e[e.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055] = "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT", e[e.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057] = "FRAMEBUFFER_INCOMPLETE_DIMENSIONS", e[e.FRAMEBUFFER_UNSUPPORTED = 36061] = "FRAMEBUFFER_UNSUPPORTED", e[e.FRAMEBUFFER_BINDING = 36006] = "FRAMEBUFFER_BINDING", e[e.RENDERBUFFER_BINDING = 36007] = "RENDERBUFFER_BINDING", e[e.READ_FRAMEBUFFER = 36008] = "READ_FRAMEBUFFER", e[e.DRAW_FRAMEBUFFER = 36009] = "DRAW_FRAMEBUFFER", e[e.MAX_RENDERBUFFER_SIZE = 34024] = "MAX_RENDERBUFFER_SIZE", e[e.INVALID_FRAMEBUFFER_OPERATION = 1286] = "INVALID_FRAMEBUFFER_OPERATION", e[e.UNPACK_FLIP_Y_WEBGL = 37440] = "UNPACK_FLIP_Y_WEBGL", e[e.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 37441] = "UNPACK_PREMULTIPLY_ALPHA_WEBGL", e[e.UNPACK_COLORSPACE_CONVERSION_WEBGL = 37443] = "UNPACK_COLORSPACE_CONVERSION_WEBGL", e[e.READ_BUFFER = 3074] = "READ_BUFFER", e[e.UNPACK_ROW_LENGTH = 3314] = "UNPACK_ROW_LENGTH", e[e.UNPACK_SKIP_ROWS = 3315] = "UNPACK_SKIP_ROWS", e[e.UNPACK_SKIP_PIXELS = 3316] = "UNPACK_SKIP_PIXELS", e[e.PACK_ROW_LENGTH = 3330] = "PACK_ROW_LENGTH", e[e.PACK_SKIP_ROWS = 3331] = "PACK_SKIP_ROWS", e[e.PACK_SKIP_PIXELS = 3332] = "PACK_SKIP_PIXELS", e[e.TEXTURE_BINDING_3D = 32874] = "TEXTURE_BINDING_3D", e[e.UNPACK_SKIP_IMAGES = 32877] = "UNPACK_SKIP_IMAGES", e[e.UNPACK_IMAGE_HEIGHT = 32878] = "UNPACK_IMAGE_HEIGHT", e[e.MAX_3D_TEXTURE_SIZE = 32883] = "MAX_3D_TEXTURE_SIZE", e[e.MAX_ELEMENTS_VERTICES = 33e3] = "MAX_ELEMENTS_VERTICES", e[e.MAX_ELEMENTS_INDICES = 33001] = "MAX_ELEMENTS_INDICES", e[e.MAX_TEXTURE_LOD_BIAS = 34045] = "MAX_TEXTURE_LOD_BIAS", e[e.MAX_FRAGMENT_UNIFORM_COMPONENTS = 35657] = "MAX_FRAGMENT_UNIFORM_COMPONENTS", e[e.MAX_VERTEX_UNIFORM_COMPONENTS = 35658] = "MAX_VERTEX_UNIFORM_COMPONENTS", e[e.MAX_ARRAY_TEXTURE_LAYERS = 35071] = "MAX_ARRAY_TEXTURE_LAYERS", e[e.MIN_PROGRAM_TEXEL_OFFSET = 35076] = "MIN_PROGRAM_TEXEL_OFFSET", e[e.MAX_PROGRAM_TEXEL_OFFSET = 35077] = "MAX_PROGRAM_TEXEL_OFFSET", e[e.MAX_VARYING_COMPONENTS = 35659] = "MAX_VARYING_COMPONENTS", e[e.FRAGMENT_SHADER_DERIVATIVE_HINT = 35723] = "FRAGMENT_SHADER_DERIVATIVE_HINT", e[e.RASTERIZER_DISCARD = 35977] = "RASTERIZER_DISCARD", e[e.VERTEX_ARRAY_BINDING = 34229] = "VERTEX_ARRAY_BINDING", e[e.MAX_VERTEX_OUTPUT_COMPONENTS = 37154] = "MAX_VERTEX_OUTPUT_COMPONENTS", e[e.MAX_FRAGMENT_INPUT_COMPONENTS = 37157] = "MAX_FRAGMENT_INPUT_COMPONENTS", e[e.MAX_SERVER_WAIT_TIMEOUT = 37137] = "MAX_SERVER_WAIT_TIMEOUT", e[e.MAX_ELEMENT_INDEX = 36203] = "MAX_ELEMENT_INDEX", e[e.RED = 6403] = "RED", e[e.RGB8 = 32849] = "RGB8", e[e.RGBA8 = 32856] = "RGBA8", e[e.RGB10_A2 = 32857] = "RGB10_A2", e[e.TEXTURE_3D = 32879] = "TEXTURE_3D", e[e.TEXTURE_WRAP_R = 32882] = "TEXTURE_WRAP_R", e[e.TEXTURE_MIN_LOD = 33082] = "TEXTURE_MIN_LOD", e[e.TEXTURE_MAX_LOD = 33083] = "TEXTURE_MAX_LOD", e[e.TEXTURE_BASE_LEVEL = 33084] = "TEXTURE_BASE_LEVEL", e[e.TEXTURE_MAX_LEVEL = 33085] = "TEXTURE_MAX_LEVEL", e[e.TEXTURE_COMPARE_MODE = 34892] = "TEXTURE_COMPARE_MODE", e[e.TEXTURE_COMPARE_FUNC = 34893] = "TEXTURE_COMPARE_FUNC", e[e.SRGB = 35904] = "SRGB", e[e.SRGB8 = 35905] = "SRGB8", e[e.SRGB8_ALPHA8 = 35907] = "SRGB8_ALPHA8", e[e.COMPARE_REF_TO_TEXTURE = 34894] = "COMPARE_REF_TO_TEXTURE", e[e.RGBA32F = 34836] = "RGBA32F", e[e.RGB32F = 34837] = "RGB32F", e[e.RGBA16F = 34842] = "RGBA16F", e[e.RGB16F = 34843] = "RGB16F", e[e.TEXTURE_2D_ARRAY = 35866] = "TEXTURE_2D_ARRAY", e[e.TEXTURE_BINDING_2D_ARRAY = 35869] = "TEXTURE_BINDING_2D_ARRAY", e[e.R11F_G11F_B10F = 35898] = "R11F_G11F_B10F", e[e.RGB9_E5 = 35901] = "RGB9_E5", e[e.RGBA32UI = 36208] = "RGBA32UI", e[e.RGB32UI = 36209] = "RGB32UI", e[e.RGBA16UI = 36214] = "RGBA16UI", e[e.RGB16UI = 36215] = "RGB16UI", e[e.RGBA8UI = 36220] = "RGBA8UI", e[e.RGB8UI = 36221] = "RGB8UI", e[e.RGBA32I = 36226] = "RGBA32I", e[e.RGB32I = 36227] = "RGB32I", e[e.RGBA16I = 36232] = "RGBA16I", e[e.RGB16I = 36233] = "RGB16I", e[e.RGBA8I = 36238] = "RGBA8I", e[e.RGB8I = 36239] = "RGB8I", e[e.RED_INTEGER = 36244] = "RED_INTEGER", e[e.RGB_INTEGER = 36248] = "RGB_INTEGER", e[e.RGBA_INTEGER = 36249] = "RGBA_INTEGER", e[e.R8 = 33321] = "R8", e[e.RG8 = 33323] = "RG8", e[e.R16F = 33325] = "R16F", e[e.R32F = 33326] = "R32F", e[e.RG16F = 33327] = "RG16F", e[e.RG32F = 33328] = "RG32F", e[e.R8I = 33329] = "R8I", e[e.R8UI = 33330] = "R8UI", e[e.R16I = 33331] = "R16I", e[e.R16UI = 33332] = "R16UI", e[e.R32I = 33333] = "R32I", e[e.R32UI = 33334] = "R32UI", e[e.RG8I = 33335] = "RG8I", e[e.RG8UI = 33336] = "RG8UI", e[e.RG16I = 33337] = "RG16I", e[e.RG16UI = 33338] = "RG16UI", e[e.RG32I = 33339] = "RG32I", e[e.RG32UI = 33340] = "RG32UI", e[e.R8_SNORM = 36756] = "R8_SNORM", e[e.RG8_SNORM = 36757] = "RG8_SNORM", e[e.RGB8_SNORM = 36758] = "RGB8_SNORM", e[e.RGBA8_SNORM = 36759] = "RGBA8_SNORM", e[e.RGB10_A2UI = 36975] = "RGB10_A2UI", e[e.TEXTURE_IMMUTABLE_FORMAT = 37167] = "TEXTURE_IMMUTABLE_FORMAT", e[e.TEXTURE_IMMUTABLE_LEVELS = 33503] = "TEXTURE_IMMUTABLE_LEVELS", e[e.UNSIGNED_INT_2_10_10_10_REV = 33640] = "UNSIGNED_INT_2_10_10_10_REV", e[e.UNSIGNED_INT_10F_11F_11F_REV = 35899] = "UNSIGNED_INT_10F_11F_11F_REV", e[e.UNSIGNED_INT_5_9_9_9_REV = 35902] = "UNSIGNED_INT_5_9_9_9_REV", e[e.FLOAT_32_UNSIGNED_INT_24_8_REV = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV", e[e.UNSIGNED_INT_24_8 = 34042] = "UNSIGNED_INT_24_8", e[e.HALF_FLOAT = 5131] = "HALF_FLOAT", e[e.RG = 33319] = "RG", e[e.RG_INTEGER = 33320] = "RG_INTEGER", e[e.INT_2_10_10_10_REV = 36255] = "INT_2_10_10_10_REV", e[e.CURRENT_QUERY = 34917] = "CURRENT_QUERY", e[e.QUERY_RESULT = 34918] = "QUERY_RESULT", e[e.QUERY_RESULT_AVAILABLE = 34919] = "QUERY_RESULT_AVAILABLE", e[e.ANY_SAMPLES_PASSED = 35887] = "ANY_SAMPLES_PASSED", e[e.ANY_SAMPLES_PASSED_CONSERVATIVE = 36202] = "ANY_SAMPLES_PASSED_CONSERVATIVE", e[e.MAX_DRAW_BUFFERS = 34852] = "MAX_DRAW_BUFFERS", e[e.DRAW_BUFFER0 = 34853] = "DRAW_BUFFER0", e[e.DRAW_BUFFER1 = 34854] = "DRAW_BUFFER1", e[e.DRAW_BUFFER2 = 34855] = "DRAW_BUFFER2", e[e.DRAW_BUFFER3 = 34856] = "DRAW_BUFFER3", e[e.DRAW_BUFFER4 = 34857] = "DRAW_BUFFER4", e[e.DRAW_BUFFER5 = 34858] = "DRAW_BUFFER5", e[e.DRAW_BUFFER6 = 34859] = "DRAW_BUFFER6", e[e.DRAW_BUFFER7 = 34860] = "DRAW_BUFFER7", e[e.DRAW_BUFFER8 = 34861] = "DRAW_BUFFER8", e[e.DRAW_BUFFER9 = 34862] = "DRAW_BUFFER9", e[e.DRAW_BUFFER10 = 34863] = "DRAW_BUFFER10", e[e.DRAW_BUFFER11 = 34864] = "DRAW_BUFFER11", e[e.DRAW_BUFFER12 = 34865] = "DRAW_BUFFER12", e[e.DRAW_BUFFER13 = 34866] = "DRAW_BUFFER13", e[e.DRAW_BUFFER14 = 34867] = "DRAW_BUFFER14", e[e.DRAW_BUFFER15 = 34868] = "DRAW_BUFFER15", e[e.MAX_COLOR_ATTACHMENTS = 36063] = "MAX_COLOR_ATTACHMENTS", e[e.COLOR_ATTACHMENT1 = 36065] = "COLOR_ATTACHMENT1", e[e.COLOR_ATTACHMENT2 = 36066] = "COLOR_ATTACHMENT2", e[e.COLOR_ATTACHMENT3 = 36067] = "COLOR_ATTACHMENT3", e[e.COLOR_ATTACHMENT4 = 36068] = "COLOR_ATTACHMENT4", e[e.COLOR_ATTACHMENT5 = 36069] = "COLOR_ATTACHMENT5", e[e.COLOR_ATTACHMENT6 = 36070] = "COLOR_ATTACHMENT6", e[e.COLOR_ATTACHMENT7 = 36071] = "COLOR_ATTACHMENT7", e[e.COLOR_ATTACHMENT8 = 36072] = "COLOR_ATTACHMENT8", e[e.COLOR_ATTACHMENT9 = 36073] = "COLOR_ATTACHMENT9", e[e.COLOR_ATTACHMENT10 = 36074] = "COLOR_ATTACHMENT10", e[e.COLOR_ATTACHMENT11 = 36075] = "COLOR_ATTACHMENT11", e[e.COLOR_ATTACHMENT12 = 36076] = "COLOR_ATTACHMENT12", e[e.COLOR_ATTACHMENT13 = 36077] = "COLOR_ATTACHMENT13", e[e.COLOR_ATTACHMENT14 = 36078] = "COLOR_ATTACHMENT14", e[e.COLOR_ATTACHMENT15 = 36079] = "COLOR_ATTACHMENT15", e[e.SAMPLER_3D = 35679] = "SAMPLER_3D", e[e.SAMPLER_2D_SHADOW = 35682] = "SAMPLER_2D_SHADOW", e[e.SAMPLER_2D_ARRAY = 36289] = "SAMPLER_2D_ARRAY", e[e.SAMPLER_2D_ARRAY_SHADOW = 36292] = "SAMPLER_2D_ARRAY_SHADOW", e[e.SAMPLER_CUBE_SHADOW = 36293] = "SAMPLER_CUBE_SHADOW", e[e.INT_SAMPLER_2D = 36298] = "INT_SAMPLER_2D", e[e.INT_SAMPLER_3D = 36299] = "INT_SAMPLER_3D", e[e.INT_SAMPLER_CUBE = 36300] = "INT_SAMPLER_CUBE", e[e.INT_SAMPLER_2D_ARRAY = 36303] = "INT_SAMPLER_2D_ARRAY", e[e.UNSIGNED_INT_SAMPLER_2D = 36306] = "UNSIGNED_INT_SAMPLER_2D", e[e.UNSIGNED_INT_SAMPLER_3D = 36307] = "UNSIGNED_INT_SAMPLER_3D", e[e.UNSIGNED_INT_SAMPLER_CUBE = 36308] = "UNSIGNED_INT_SAMPLER_CUBE", e[e.UNSIGNED_INT_SAMPLER_2D_ARRAY = 36311] = "UNSIGNED_INT_SAMPLER_2D_ARRAY", e[e.MAX_SAMPLES = 36183] = "MAX_SAMPLES", e[e.SAMPLER_BINDING = 35097] = "SAMPLER_BINDING", e[e.PIXEL_PACK_BUFFER = 35051] = "PIXEL_PACK_BUFFER", e[e.PIXEL_UNPACK_BUFFER = 35052] = "PIXEL_UNPACK_BUFFER", e[e.PIXEL_PACK_BUFFER_BINDING = 35053] = "PIXEL_PACK_BUFFER_BINDING", e[e.PIXEL_UNPACK_BUFFER_BINDING = 35055] = "PIXEL_UNPACK_BUFFER_BINDING", e[e.COPY_READ_BUFFER = 36662] = "COPY_READ_BUFFER", e[e.COPY_WRITE_BUFFER = 36663] = "COPY_WRITE_BUFFER", e[e.COPY_READ_BUFFER_BINDING = 36662] = "COPY_READ_BUFFER_BINDING", e[e.COPY_WRITE_BUFFER_BINDING = 36663] = "COPY_WRITE_BUFFER_BINDING", e[e.FLOAT_MAT2x3 = 35685] = "FLOAT_MAT2x3", e[e.FLOAT_MAT2x4 = 35686] = "FLOAT_MAT2x4", e[e.FLOAT_MAT3x2 = 35687] = "FLOAT_MAT3x2", e[e.FLOAT_MAT3x4 = 35688] = "FLOAT_MAT3x4", e[e.FLOAT_MAT4x2 = 35689] = "FLOAT_MAT4x2", e[e.FLOAT_MAT4x3 = 35690] = "FLOAT_MAT4x3", e[e.UNSIGNED_INT_VEC2 = 36294] = "UNSIGNED_INT_VEC2", e[e.UNSIGNED_INT_VEC3 = 36295] = "UNSIGNED_INT_VEC3", e[e.UNSIGNED_INT_VEC4 = 36296] = "UNSIGNED_INT_VEC4", e[e.UNSIGNED_NORMALIZED = 35863] = "UNSIGNED_NORMALIZED", e[e.SIGNED_NORMALIZED = 36764] = "SIGNED_NORMALIZED", e[e.VERTEX_ATTRIB_ARRAY_INTEGER = 35069] = "VERTEX_ATTRIB_ARRAY_INTEGER", e[e.VERTEX_ATTRIB_ARRAY_DIVISOR = 35070] = "VERTEX_ATTRIB_ARRAY_DIVISOR", e[e.TRANSFORM_FEEDBACK_BUFFER_MODE = 35967] = "TRANSFORM_FEEDBACK_BUFFER_MODE", e[e.MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS = 35968] = "MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS", e[e.TRANSFORM_FEEDBACK_VARYINGS = 35971] = "TRANSFORM_FEEDBACK_VARYINGS", e[e.TRANSFORM_FEEDBACK_BUFFER_START = 35972] = "TRANSFORM_FEEDBACK_BUFFER_START", e[e.TRANSFORM_FEEDBACK_BUFFER_SIZE = 35973] = "TRANSFORM_FEEDBACK_BUFFER_SIZE", e[e.TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN = 35976] = "TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN", e[e.MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS = 35978] = "MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS", e[e.MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS = 35979] = "MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS", e[e.INTERLEAVED_ATTRIBS = 35980] = "INTERLEAVED_ATTRIBS", e[e.SEPARATE_ATTRIBS = 35981] = "SEPARATE_ATTRIBS", e[e.TRANSFORM_FEEDBACK_BUFFER = 35982] = "TRANSFORM_FEEDBACK_BUFFER", e[e.TRANSFORM_FEEDBACK_BUFFER_BINDING = 35983] = "TRANSFORM_FEEDBACK_BUFFER_BINDING", e[e.TRANSFORM_FEEDBACK = 36386] = "TRANSFORM_FEEDBACK", e[e.TRANSFORM_FEEDBACK_PAUSED = 36387] = "TRANSFORM_FEEDBACK_PAUSED", e[e.TRANSFORM_FEEDBACK_ACTIVE = 36388] = "TRANSFORM_FEEDBACK_ACTIVE", e[e.TRANSFORM_FEEDBACK_BINDING = 36389] = "TRANSFORM_FEEDBACK_BINDING", e[e.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING = 33296] = "FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING", e[e.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE = 33297] = "FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE", e[e.FRAMEBUFFER_ATTACHMENT_RED_SIZE = 33298] = "FRAMEBUFFER_ATTACHMENT_RED_SIZE", e[e.FRAMEBUFFER_ATTACHMENT_GREEN_SIZE = 33299] = "FRAMEBUFFER_ATTACHMENT_GREEN_SIZE", e[e.FRAMEBUFFER_ATTACHMENT_BLUE_SIZE = 33300] = "FRAMEBUFFER_ATTACHMENT_BLUE_SIZE", e[e.FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE = 33301] = "FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE", e[e.FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE = 33302] = "FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE", e[e.FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE = 33303] = "FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE", e[e.FRAMEBUFFER_DEFAULT = 33304] = "FRAMEBUFFER_DEFAULT", e[e.DEPTH24_STENCIL8 = 35056] = "DEPTH24_STENCIL8", e[e.DRAW_FRAMEBUFFER_BINDING = 36006] = "DRAW_FRAMEBUFFER_BINDING", e[e.READ_FRAMEBUFFER_BINDING = 36010] = "READ_FRAMEBUFFER_BINDING", e[e.RENDERBUFFER_SAMPLES = 36011] = "RENDERBUFFER_SAMPLES", e[e.FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER = 36052] = "FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER", e[e.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE = 36182] = "FRAMEBUFFER_INCOMPLETE_MULTISAMPLE", e[e.UNIFORM_BUFFER = 35345] = "UNIFORM_BUFFER", e[e.UNIFORM_BUFFER_BINDING = 35368] = "UNIFORM_BUFFER_BINDING", e[e.UNIFORM_BUFFER_START = 35369] = "UNIFORM_BUFFER_START", e[e.UNIFORM_BUFFER_SIZE = 35370] = "UNIFORM_BUFFER_SIZE", e[e.MAX_VERTEX_UNIFORM_BLOCKS = 35371] = "MAX_VERTEX_UNIFORM_BLOCKS", e[e.MAX_FRAGMENT_UNIFORM_BLOCKS = 35373] = "MAX_FRAGMENT_UNIFORM_BLOCKS", e[e.MAX_COMBINED_UNIFORM_BLOCKS = 35374] = "MAX_COMBINED_UNIFORM_BLOCKS", e[e.MAX_UNIFORM_BUFFER_BINDINGS = 35375] = "MAX_UNIFORM_BUFFER_BINDINGS", e[e.MAX_UNIFORM_BLOCK_SIZE = 35376] = "MAX_UNIFORM_BLOCK_SIZE", e[e.MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS = 35377] = "MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS", e[e.MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS = 35379] = "MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS", e[e.UNIFORM_BUFFER_OFFSET_ALIGNMENT = 35380] = "UNIFORM_BUFFER_OFFSET_ALIGNMENT", e[e.ACTIVE_UNIFORM_BLOCKS = 35382] = "ACTIVE_UNIFORM_BLOCKS", e[e.UNIFORM_TYPE = 35383] = "UNIFORM_TYPE", e[e.UNIFORM_SIZE = 35384] = "UNIFORM_SIZE", e[e.UNIFORM_BLOCK_INDEX = 35386] = "UNIFORM_BLOCK_INDEX", e[e.UNIFORM_OFFSET = 35387] = "UNIFORM_OFFSET", e[e.UNIFORM_ARRAY_STRIDE = 35388] = "UNIFORM_ARRAY_STRIDE", e[e.UNIFORM_MATRIX_STRIDE = 35389] = "UNIFORM_MATRIX_STRIDE", e[e.UNIFORM_IS_ROW_MAJOR = 35390] = "UNIFORM_IS_ROW_MAJOR", e[e.UNIFORM_BLOCK_BINDING = 35391] = "UNIFORM_BLOCK_BINDING", e[e.UNIFORM_BLOCK_DATA_SIZE = 35392] = "UNIFORM_BLOCK_DATA_SIZE", e[e.UNIFORM_BLOCK_ACTIVE_UNIFORMS = 35394] = "UNIFORM_BLOCK_ACTIVE_UNIFORMS", e[e.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 35395] = "UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES", e[e.UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 35396] = "UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER", e[e.UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 35398] = "UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER", e[e.OBJECT_TYPE = 37138] = "OBJECT_TYPE", e[e.SYNC_CONDITION = 37139] = "SYNC_CONDITION", e[e.SYNC_STATUS = 37140] = "SYNC_STATUS", e[e.SYNC_FLAGS = 37141] = "SYNC_FLAGS", e[e.SYNC_FENCE = 37142] = "SYNC_FENCE", e[e.SYNC_GPU_COMMANDS_COMPLETE = 37143] = "SYNC_GPU_COMMANDS_COMPLETE", e[e.UNSIGNALED = 37144] = "UNSIGNALED", e[e.SIGNALED = 37145] = "SIGNALED", e[e.ALREADY_SIGNALED = 37146] = "ALREADY_SIGNALED", e[e.TIMEOUT_EXPIRED = 37147] = "TIMEOUT_EXPIRED", e[e.CONDITION_SATISFIED = 37148] = "CONDITION_SATISFIED", e[e.WAIT_FAILED = 37149] = "WAIT_FAILED", e[e.SYNC_FLUSH_COMMANDS_BIT = 1] = "SYNC_FLUSH_COMMANDS_BIT", e[e.COLOR = 6144] = "COLOR", e[e.DEPTH = 6145] = "DEPTH", e[e.STENCIL = 6146] = "STENCIL", e[e.MIN = 32775] = "MIN", e[e.MAX = 32776] = "MAX", e[e.DEPTH_COMPONENT24 = 33190] = "DEPTH_COMPONENT24", e[e.STREAM_READ = 35041] = "STREAM_READ", e[e.STREAM_COPY = 35042] = "STREAM_COPY", e[e.STATIC_READ = 35045] = "STATIC_READ", e[e.STATIC_COPY = 35046] = "STATIC_COPY", e[e.DYNAMIC_READ = 35049] = "DYNAMIC_READ", e[e.DYNAMIC_COPY = 35050] = "DYNAMIC_COPY", e[e.DEPTH_COMPONENT32F = 36012] = "DEPTH_COMPONENT32F", e[e.DEPTH32F_STENCIL8 = 36013] = "DEPTH32F_STENCIL8", e[e.INVALID_INDEX = 4294967295] = "INVALID_INDEX", e[e.TIMEOUT_IGNORED = -1] = "TIMEOUT_IGNORED", e[e.MAX_CLIENT_WAIT_TIMEOUT_WEBGL = 37447] = "MAX_CLIENT_WAIT_TIMEOUT_WEBGL", e[e.UNMASKED_VENDOR_WEBGL = 37445] = "UNMASKED_VENDOR_WEBGL", e[e.UNMASKED_RENDERER_WEBGL = 37446] = "UNMASKED_RENDERER_WEBGL", e[e.MAX_TEXTURE_MAX_ANISOTROPY_EXT = 34047] = "MAX_TEXTURE_MAX_ANISOTROPY_EXT", e[e.TEXTURE_MAX_ANISOTROPY_EXT = 34046] = "TEXTURE_MAX_ANISOTROPY_EXT", e[e.R16_EXT = 33322] = "R16_EXT", e[e.RG16_EXT = 33324] = "RG16_EXT", e[e.RGB16_EXT = 32852] = "RGB16_EXT", e[e.RGBA16_EXT = 32859] = "RGBA16_EXT", e[e.R16_SNORM_EXT = 36760] = "R16_SNORM_EXT", e[e.RG16_SNORM_EXT = 36761] = "RG16_SNORM_EXT", e[e.RGB16_SNORM_EXT = 36762] = "RGB16_SNORM_EXT", e[e.RGBA16_SNORM_EXT = 36763] = "RGBA16_SNORM_EXT", e[e.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT", e[e.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT", e[e.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT", e[e.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT", e[e.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT", e[e.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT", e[e.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT", e[e.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT", e[e.COMPRESSED_RED_RGTC1_EXT = 36283] = "COMPRESSED_RED_RGTC1_EXT", e[e.COMPRESSED_SIGNED_RED_RGTC1_EXT = 36284] = "COMPRESSED_SIGNED_RED_RGTC1_EXT", e[e.COMPRESSED_RED_GREEN_RGTC2_EXT = 36285] = "COMPRESSED_RED_GREEN_RGTC2_EXT", e[e.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT = 36286] = "COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT", e[e.COMPRESSED_RGBA_BPTC_UNORM_EXT = 36492] = "COMPRESSED_RGBA_BPTC_UNORM_EXT", e[e.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT = 36493] = "COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT", e[e.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT = 36494] = "COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT", e[e.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT = 36495] = "COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT", e[e.COMPRESSED_R11_EAC = 37488] = "COMPRESSED_R11_EAC", e[e.COMPRESSED_SIGNED_R11_EAC = 37489] = "COMPRESSED_SIGNED_R11_EAC", e[e.COMPRESSED_RG11_EAC = 37490] = "COMPRESSED_RG11_EAC", e[e.COMPRESSED_SIGNED_RG11_EAC = 37491] = "COMPRESSED_SIGNED_RG11_EAC", e[e.COMPRESSED_RGB8_ETC2 = 37492] = "COMPRESSED_RGB8_ETC2", e[e.COMPRESSED_RGBA8_ETC2_EAC = 37493] = "COMPRESSED_RGBA8_ETC2_EAC", e[e.COMPRESSED_SRGB8_ETC2 = 37494] = "COMPRESSED_SRGB8_ETC2", e[e.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC = 37495] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC", e[e.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37496] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2", e[e.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2 = 37497] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2", e[e.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG", e[e.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG", e[e.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG", e[e.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG", e[e.COMPRESSED_RGB_ETC1_WEBGL = 36196] = "COMPRESSED_RGB_ETC1_WEBGL", e[e.COMPRESSED_RGB_ATC_WEBGL = 35986] = "COMPRESSED_RGB_ATC_WEBGL", e[e.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL = 35986] = "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL", e[e.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL = 34798] = "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL", e[e.COMPRESSED_RGBA_ASTC_4x4_KHR = 37808] = "COMPRESSED_RGBA_ASTC_4x4_KHR", e[e.COMPRESSED_RGBA_ASTC_5x4_KHR = 37809] = "COMPRESSED_RGBA_ASTC_5x4_KHR", e[e.COMPRESSED_RGBA_ASTC_5x5_KHR = 37810] = "COMPRESSED_RGBA_ASTC_5x5_KHR", e[e.COMPRESSED_RGBA_ASTC_6x5_KHR = 37811] = "COMPRESSED_RGBA_ASTC_6x5_KHR", e[e.COMPRESSED_RGBA_ASTC_6x6_KHR = 37812] = "COMPRESSED_RGBA_ASTC_6x6_KHR", e[e.COMPRESSED_RGBA_ASTC_8x5_KHR = 37813] = "COMPRESSED_RGBA_ASTC_8x5_KHR", e[e.COMPRESSED_RGBA_ASTC_8x6_KHR = 37814] = "COMPRESSED_RGBA_ASTC_8x6_KHR", e[e.COMPRESSED_RGBA_ASTC_8x8_KHR = 37815] = "COMPRESSED_RGBA_ASTC_8x8_KHR", e[e.COMPRESSED_RGBA_ASTC_10x5_KHR = 37816] = "COMPRESSED_RGBA_ASTC_10x5_KHR", e[e.COMPRESSED_RGBA_ASTC_10x6_KHR = 37817] = "COMPRESSED_RGBA_ASTC_10x6_KHR", e[e.COMPRESSED_RGBA_ASTC_10x8_KHR = 37818] = "COMPRESSED_RGBA_ASTC_10x8_KHR", e[e.COMPRESSED_RGBA_ASTC_10x10_KHR = 37819] = "COMPRESSED_RGBA_ASTC_10x10_KHR", e[e.COMPRESSED_RGBA_ASTC_12x10_KHR = 37820] = "COMPRESSED_RGBA_ASTC_12x10_KHR", e[e.COMPRESSED_RGBA_ASTC_12x12_KHR = 37821] = "COMPRESSED_RGBA_ASTC_12x12_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR = 37840] = "COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR = 37841] = "COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR = 37842] = "COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR = 37843] = "COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR = 37844] = "COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR = 37845] = "COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR = 37846] = "COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR = 37847] = "COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR = 37848] = "COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR = 37849] = "COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR = 37850] = "COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR = 37851] = "COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR = 37852] = "COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR", e[e.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR = 37853] = "COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR", e[e.QUERY_COUNTER_BITS_EXT = 34916] = "QUERY_COUNTER_BITS_EXT", e[e.CURRENT_QUERY_EXT = 34917] = "CURRENT_QUERY_EXT", e[e.QUERY_RESULT_EXT = 34918] = "QUERY_RESULT_EXT", e[e.QUERY_RESULT_AVAILABLE_EXT = 34919] = "QUERY_RESULT_AVAILABLE_EXT", e[e.TIME_ELAPSED_EXT = 35007] = "TIME_ELAPSED_EXT", e[e.TIMESTAMP_EXT = 36392] = "TIMESTAMP_EXT", e[e.GPU_DISJOINT_EXT = 36795] = "GPU_DISJOINT_EXT", e[e.COMPLETION_STATUS_KHR = 37297] = "COMPLETION_STATUS_KHR", e[e.DEPTH_CLAMP_EXT = 34383] = "DEPTH_CLAMP_EXT", e[e.FIRST_VERTEX_CONVENTION_WEBGL = 36429] = "FIRST_VERTEX_CONVENTION_WEBGL", e[e.LAST_VERTEX_CONVENTION_WEBGL = 36430] = "LAST_VERTEX_CONVENTION_WEBGL", e[e.PROVOKING_VERTEX_WEBL = 36431] = "PROVOKING_VERTEX_WEBL", e[e.POLYGON_MODE_WEBGL = 2880] = "POLYGON_MODE_WEBGL", e[e.POLYGON_OFFSET_LINE_WEBGL = 10754] = "POLYGON_OFFSET_LINE_WEBGL", e[e.LINE_WEBGL = 6913] = "LINE_WEBGL", e[e.FILL_WEBGL = 6914] = "FILL_WEBGL", e[e.MAX_CLIP_DISTANCES_WEBGL = 3378] = "MAX_CLIP_DISTANCES_WEBGL", e[e.MAX_CULL_DISTANCES_WEBGL = 33529] = "MAX_CULL_DISTANCES_WEBGL", e[e.MAX_COMBINED_CLIP_AND_CULL_DISTANCES_WEBGL = 33530] = "MAX_COMBINED_CLIP_AND_CULL_DISTANCES_WEBGL", e[e.CLIP_DISTANCE0_WEBGL = 12288] = "CLIP_DISTANCE0_WEBGL", e[e.CLIP_DISTANCE1_WEBGL = 12289] = "CLIP_DISTANCE1_WEBGL", e[e.CLIP_DISTANCE2_WEBGL = 12290] = "CLIP_DISTANCE2_WEBGL", e[e.CLIP_DISTANCE3_WEBGL = 12291] = "CLIP_DISTANCE3_WEBGL", e[e.CLIP_DISTANCE4_WEBGL = 12292] = "CLIP_DISTANCE4_WEBGL", e[e.CLIP_DISTANCE5_WEBGL = 12293] = "CLIP_DISTANCE5_WEBGL", e[e.CLIP_DISTANCE6_WEBGL = 12294] = "CLIP_DISTANCE6_WEBGL", e[e.CLIP_DISTANCE7_WEBGL = 12295] = "CLIP_DISTANCE7_WEBGL", e[e.POLYGON_OFFSET_CLAMP_EXT = 36379] = "POLYGON_OFFSET_CLAMP_EXT", e[e.LOWER_LEFT_EXT = 36001] = "LOWER_LEFT_EXT", e[e.UPPER_LEFT_EXT = 36002] = "UPPER_LEFT_EXT", e[e.NEGATIVE_ONE_TO_ONE_EXT = 37726] = "NEGATIVE_ONE_TO_ONE_EXT", e[e.ZERO_TO_ONE_EXT = 37727] = "ZERO_TO_ONE_EXT", e[e.CLIP_ORIGIN_EXT = 37724] = "CLIP_ORIGIN_EXT", e[e.CLIP_DEPTH_MODE_EXT = 37725] = "CLIP_DEPTH_MODE_EXT", e[e.SRC1_COLOR_WEBGL = 35065] = "SRC1_COLOR_WEBGL", e[e.SRC1_ALPHA_WEBGL = 34185] = "SRC1_ALPHA_WEBGL", e[e.ONE_MINUS_SRC1_COLOR_WEBGL = 35066] = "ONE_MINUS_SRC1_COLOR_WEBGL", e[e.ONE_MINUS_SRC1_ALPHA_WEBGL = 35067] = "ONE_MINUS_SRC1_ALPHA_WEBGL", e[e.MAX_DUAL_SOURCE_DRAW_BUFFERS_WEBGL = 35068] = "MAX_DUAL_SOURCE_DRAW_BUFFERS_WEBGL", e[e.MIRROR_CLAMP_TO_EDGE_EXT = 34627] = "MIRROR_CLAMP_TO_EDGE_EXT";
})(Mg ||= {});
// node_modules/@luma.gl/webgl/dist/context/parameters/webgl-parameter-tables.js
var Ng = {
	3042: !1,
	32773: new Float32Array([
		0,
		0,
		0,
		0
	]),
	32777: 32774,
	34877: 32774,
	32969: 1,
	32968: 0,
	32971: 1,
	32970: 0,
	3106: new Float32Array([
		0,
		0,
		0,
		0
	]),
	3107: [
		!0,
		!0,
		!0,
		!0
	],
	2884: !1,
	2885: 1029,
	2929: !1,
	2931: 1,
	2932: 513,
	2928: new Float32Array([0, 1]),
	2930: !0,
	3024: !0,
	35725: null,
	36006: null,
	36007: null,
	34229: null,
	34964: null,
	2886: 2305,
	33170: 4352,
	2849: 1,
	32823: !1,
	32824: 0,
	10752: 0,
	32926: !1,
	32928: !1,
	32938: 1,
	32939: !1,
	3089: !1,
	3088: new Int32Array([
		0,
		0,
		1024,
		1024
	]),
	2960: !1,
	2961: 0,
	2968: 4294967295,
	36005: 4294967295,
	2962: 519,
	2967: 0,
	2963: 4294967295,
	34816: 519,
	36003: 0,
	36004: 4294967295,
	2964: 7680,
	2965: 7680,
	2966: 7680,
	34817: 7680,
	34818: 7680,
	34819: 7680,
	2978: [
		0,
		0,
		1024,
		1024
	],
	36389: null,
	36662: null,
	36663: null,
	35053: null,
	35055: null,
	35723: 4352,
	36010: null,
	35977: !1,
	3333: 4,
	3317: 4,
	37440: !1,
	37441: !1,
	37443: 37444,
	3330: 0,
	3332: 0,
	3331: 0,
	3314: 0,
	32878: 0,
	3316: 0,
	3315: 0,
	32877: 0
}, Q = (e, t, n) => t ? e.enable(n) : e.disable(n), Pg = (e, t, n) => e.hint(n, t), Fg = (e, t, n) => e.pixelStorei(n, t), Ig = (e, t, n) => {
	let r = n === 36006 ? 36009 : 36008;
	return e.bindFramebuffer(r, t);
}, Lg = (e, t, n) => {
	let r = {
		34964: 34962,
		36662: 36662,
		36663: 36663,
		35053: 35051,
		35055: 35052
	}[n];
	e.bindBuffer(r, t);
};
function Rg(e) {
	return Array.isArray(e) || ArrayBuffer.isView(e) && !(e instanceof DataView);
}
var zg = {
	3042: Q,
	32773: (e, t) => e.blendColor(...t),
	32777: "blendEquation",
	34877: "blendEquation",
	32969: "blendFunc",
	32968: "blendFunc",
	32971: "blendFunc",
	32970: "blendFunc",
	3106: (e, t) => e.clearColor(...t),
	3107: (e, t) => e.colorMask(...t),
	2884: Q,
	2885: (e, t) => e.cullFace(t),
	2929: Q,
	2931: (e, t) => e.clearDepth(t),
	2932: (e, t) => e.depthFunc(t),
	2928: (e, t) => e.depthRange(...t),
	2930: (e, t) => e.depthMask(t),
	3024: Q,
	35723: Pg,
	35725: (e, t) => e.useProgram(t),
	36007: (e, t) => e.bindRenderbuffer(36161, t),
	36389: (e, t) => e.bindTransformFeedback?.(36386, t),
	34229: (e, t) => e.bindVertexArray(t),
	36006: Ig,
	36010: Ig,
	34964: Lg,
	36662: Lg,
	36663: Lg,
	35053: Lg,
	35055: Lg,
	2886: (e, t) => e.frontFace(t),
	33170: Pg,
	2849: (e, t) => e.lineWidth(t),
	32823: Q,
	32824: "polygonOffset",
	10752: "polygonOffset",
	35977: Q,
	32926: Q,
	32928: Q,
	32938: "sampleCoverage",
	32939: "sampleCoverage",
	3089: Q,
	3088: (e, t) => e.scissor(...t),
	2960: Q,
	2961: (e, t) => e.clearStencil(t),
	2968: (e, t) => e.stencilMaskSeparate(1028, t),
	36005: (e, t) => e.stencilMaskSeparate(1029, t),
	2962: "stencilFuncFront",
	2967: "stencilFuncFront",
	2963: "stencilFuncFront",
	34816: "stencilFuncBack",
	36003: "stencilFuncBack",
	36004: "stencilFuncBack",
	2964: "stencilOpFront",
	2965: "stencilOpFront",
	2966: "stencilOpFront",
	34817: "stencilOpBack",
	34818: "stencilOpBack",
	34819: "stencilOpBack",
	2978: (e, t) => e.viewport(...t),
	34383: Q,
	10754: Q,
	12288: Q,
	12289: Q,
	12290: Q,
	12291: Q,
	12292: Q,
	12293: Q,
	12294: Q,
	12295: Q,
	3333: Fg,
	3317: Fg,
	37440: Fg,
	37441: Fg,
	37443: Fg,
	3330: Fg,
	3332: Fg,
	3331: Fg,
	3314: Fg,
	32878: Fg,
	3316: Fg,
	3315: Fg,
	32877: Fg,
	framebuffer: (e, t) => {
		let n = t && "handle" in t ? t.handle : t;
		return e.bindFramebuffer(36160, n);
	},
	blend: (e, t) => t ? e.enable(3042) : e.disable(3042),
	blendColor: (e, t) => e.blendColor(...t),
	blendEquation: (e, t) => {
		let n = typeof t == "number" ? [t, t] : t;
		e.blendEquationSeparate(...n);
	},
	blendFunc: (e, t) => {
		let n = t?.length === 2 ? [...t, ...t] : t;
		e.blendFuncSeparate(...n);
	},
	clearColor: (e, t) => e.clearColor(...t),
	clearDepth: (e, t) => e.clearDepth(t),
	clearStencil: (e, t) => e.clearStencil(t),
	colorMask: (e, t) => e.colorMask(...t),
	cull: (e, t) => t ? e.enable(2884) : e.disable(2884),
	cullFace: (e, t) => e.cullFace(t),
	depthTest: (e, t) => t ? e.enable(2929) : e.disable(2929),
	depthFunc: (e, t) => e.depthFunc(t),
	depthMask: (e, t) => e.depthMask(t),
	depthRange: (e, t) => e.depthRange(...t),
	dither: (e, t) => t ? e.enable(3024) : e.disable(3024),
	derivativeHint: (e, t) => {
		e.hint(35723, t);
	},
	frontFace: (e, t) => e.frontFace(t),
	mipmapHint: (e, t) => e.hint(33170, t),
	lineWidth: (e, t) => e.lineWidth(t),
	polygonOffsetFill: (e, t) => t ? e.enable(32823) : e.disable(32823),
	polygonOffset: (e, t) => e.polygonOffset(...t),
	sampleCoverage: (e, t) => e.sampleCoverage(t[0], t[1] || !1),
	scissorTest: (e, t) => t ? e.enable(3089) : e.disable(3089),
	scissor: (e, t) => e.scissor(...t),
	stencilTest: (e, t) => t ? e.enable(2960) : e.disable(2960),
	stencilMask: (e, t) => {
		t = Rg(t) ? t : [t, t];
		let [n, r] = t;
		e.stencilMaskSeparate(1028, n), e.stencilMaskSeparate(1029, r);
	},
	stencilFunc: (e, t) => {
		t = Rg(t) && t.length === 3 ? [...t, ...t] : t;
		let [n, r, i, a, o, s] = t;
		e.stencilFuncSeparate(1028, n, r, i), e.stencilFuncSeparate(1029, a, o, s);
	},
	stencilOp: (e, t) => {
		t = Rg(t) && t.length === 3 ? [...t, ...t] : t;
		let [n, r, i, a, o, s] = t;
		e.stencilOpSeparate(1028, n, r, i), e.stencilOpSeparate(1029, a, o, s);
	},
	viewport: (e, t) => e.viewport(...t)
};
function $(e, t, n) {
	return t[e] === void 0 ? n[e] : t[e];
}
var Bg = {
	blendEquation: (e, t, n) => e.blendEquationSeparate($(32777, t, n), $(34877, t, n)),
	blendFunc: (e, t, n) => e.blendFuncSeparate($(32969, t, n), $(32968, t, n), $(32971, t, n), $(32970, t, n)),
	polygonOffset: (e, t, n) => e.polygonOffset($(32824, t, n), $(10752, t, n)),
	sampleCoverage: (e, t, n) => e.sampleCoverage($(32938, t, n), $(32939, t, n)),
	stencilFuncFront: (e, t, n) => e.stencilFuncSeparate(1028, $(2962, t, n), $(2967, t, n), $(2963, t, n)),
	stencilFuncBack: (e, t, n) => e.stencilFuncSeparate(1029, $(34816, t, n), $(36003, t, n), $(36004, t, n)),
	stencilOpFront: (e, t, n) => e.stencilOpSeparate(1028, $(2964, t, n), $(2965, t, n), $(2966, t, n)),
	stencilOpBack: (e, t, n) => e.stencilOpSeparate(1029, $(34817, t, n), $(34818, t, n), $(34819, t, n))
}, Vg = {
	enable: (e, t) => e({ [t]: !0 }),
	disable: (e, t) => e({ [t]: !1 }),
	pixelStorei: (e, t, n) => e({ [t]: n }),
	hint: (e, t, n) => e({ [t]: n }),
	useProgram: (e, t) => e({ 35725: t }),
	bindRenderbuffer: (e, t, n) => e({ 36007: n }),
	bindTransformFeedback: (e, t, n) => e({ 36389: n }),
	bindVertexArray: (e, t) => e({ 34229: t }),
	bindFramebuffer: (e, t, n) => {
		switch (t) {
			case 36160: return e({
				36006: n,
				36010: n
			});
			case 36009: return e({ 36006: n });
			case 36008: return e({ 36010: n });
			default: return null;
		}
	},
	bindBuffer: (e, t, n) => {
		let r = {
			34962: [34964],
			36662: [36662],
			36663: [36663],
			35051: [35053],
			35052: [35055]
		}[t];
		return r ? e({ [r]: n }) : { valueChanged: !0 };
	},
	blendColor: (e, t, n, r, i) => e({ 32773: new Float32Array([
		t,
		n,
		r,
		i
	]) }),
	blendEquation: (e, t) => e({
		32777: t,
		34877: t
	}),
	blendEquationSeparate: (e, t, n) => e({
		32777: t,
		34877: n
	}),
	blendFunc: (e, t, n) => e({
		32969: t,
		32968: n,
		32971: t,
		32970: n
	}),
	blendFuncSeparate: (e, t, n, r, i) => e({
		32969: t,
		32968: n,
		32971: r,
		32970: i
	}),
	clearColor: (e, t, n, r, i) => e({ 3106: new Float32Array([
		t,
		n,
		r,
		i
	]) }),
	clearDepth: (e, t) => e({ 2931: t }),
	clearStencil: (e, t) => e({ 2961: t }),
	colorMask: (e, t, n, r, i) => e({ 3107: [
		t,
		n,
		r,
		i
	] }),
	cullFace: (e, t) => e({ 2885: t }),
	depthFunc: (e, t) => e({ 2932: t }),
	depthRange: (e, t, n) => e({ 2928: new Float32Array([t, n]) }),
	depthMask: (e, t) => e({ 2930: t }),
	frontFace: (e, t) => e({ 2886: t }),
	lineWidth: (e, t) => e({ 2849: t }),
	polygonOffset: (e, t, n) => e({
		32824: t,
		10752: n
	}),
	sampleCoverage: (e, t, n) => e({
		32938: t,
		32939: n
	}),
	scissor: (e, t, n, r, i) => e({ 3088: new Int32Array([
		t,
		n,
		r,
		i
	]) }),
	stencilMask: (e, t) => e({
		2968: t,
		36005: t
	}),
	stencilMaskSeparate: (e, t, n) => e({ [t === 1028 ? 2968 : 36005]: n }),
	stencilFunc: (e, t, n, r) => e({
		2962: t,
		2967: n,
		2963: r,
		34816: t,
		36003: n,
		36004: r
	}),
	stencilFuncSeparate: (e, t, n, r, i) => e({
		[t === 1028 ? 2962 : 34816]: n,
		[t === 1028 ? 2967 : 36003]: r,
		[t === 1028 ? 2963 : 36004]: i
	}),
	stencilOp: (e, t, n, r) => e({
		2964: t,
		2965: n,
		2966: r,
		34817: t,
		34818: n,
		34819: r
	}),
	stencilOpSeparate: (e, t, n, r, i) => e({
		[t === 1028 ? 2964 : 34817]: n,
		[t === 1028 ? 2965 : 34818]: r,
		[t === 1028 ? 2966 : 34819]: i
	}),
	viewport: (e, t, n, r, i) => e({ 2978: [
		t,
		n,
		r,
		i
	] })
}, Hg = (e, t) => e.isEnabled(t), Ug = {
	3042: Hg,
	2884: Hg,
	2929: Hg,
	3024: Hg,
	32823: Hg,
	32926: Hg,
	32928: Hg,
	3089: Hg,
	2960: Hg,
	35977: Hg
}, Wg = /* @__PURE__ */ new Set([
	34016,
	36388,
	36387,
	35983,
	35368,
	34965,
	35739,
	35738,
	3074,
	34853,
	34854,
	34855,
	34856,
	34857,
	34858,
	34859,
	34860,
	34861,
	34862,
	34863,
	34864,
	34865,
	34866,
	34867,
	34868,
	35097,
	32873,
	35869,
	32874,
	34068
]);
// node_modules/@luma.gl/webgl/dist/context/parameters/unified-parameter-api.js
function Gg(e, t) {
	if (Jg(t)) return;
	let n = {};
	for (let r in t) {
		let i = Number(r), a = zg[r];
		a && (typeof a == "string" ? n[a] = !0 : a(e, t[r], i));
	}
	let r = e.state && e.state.cache;
	if (r) for (let i in n) {
		let n = Bg[i];
		n(e, t, r);
	}
}
function Kg(e, t = Ng) {
	if (typeof t == "number") {
		let n = t, r = Ug[n];
		return r ? r(e, n) : e.getParameter(n);
	}
	let n = Array.isArray(t) ? t : Object.keys(t), r = {};
	for (let t of n) {
		let n = Ug[t];
		r[t] = n ? n(e, Number(t)) : e.getParameter(Number(t));
	}
	return r;
}
function qg(e) {
	Gg(e, Ng);
}
function Jg(e) {
	for (let t in e) return !1;
	return !0;
}
// node_modules/@luma.gl/webgl/dist/context/state-tracker/deep-array-equal.js
function Yg(e, t) {
	if (e === t) return !0;
	if ((Array.isArray(e) || ArrayBuffer.isView(e)) && (Array.isArray(t) || ArrayBuffer.isView(t)) && e.length === t.length) {
		for (let n = 0; n < e.length; ++n) if (e[n] !== t[n]) return !1;
		return !0;
	}
	return !1;
}
// node_modules/@luma.gl/webgl/dist/context/state-tracker/webgl-state-tracker.js
var Xg = class {
	static get(e) {
		return e.state;
	}
	gl;
	program = null;
	stateStack = [];
	enable = !0;
	cache = null;
	log;
	initialized = !1;
	constructor(e, t) {
		this.gl = e, this.log = t?.log || (() => {}), this._updateCache = this._updateCache.bind(this), Object.seal(this);
	}
	push(e = {}) {
		this.stateStack.push({});
	}
	pop() {
		let e = this.stateStack[this.stateStack.length - 1];
		Gg(this.gl, e), this.stateStack.pop();
	}
	trackState(e, t) {
		if (this.cache = t.copyState ? Kg(e) : Object.assign({}, Ng), this.initialized) throw Error("WebGLStateTracker");
		this.initialized = !0, this.gl.state = this, $g(e);
		for (let t in Vg) {
			let n = Vg[t];
			Qg(e, t, n);
		}
		Zg(e, "getParameter"), Zg(e, "isEnabled");
	}
	_updateCache(e) {
		let t = !1, n, r = this.stateStack.length > 0 ? this.stateStack[this.stateStack.length - 1] : null;
		for (let i in e) {
			let a = e[i], o = this.cache[i];
			Yg(a, o) || (t = !0, n = o, r && !(i in r) && (r[i] = o), this.cache[i] = a);
		}
		return {
			valueChanged: t,
			oldValue: n
		};
	}
};
function Zg(e, t) {
	let n = e[t].bind(e);
	e[t] = function(t) {
		if (t === void 0 || Wg.has(t)) return n(t);
		let r = Xg.get(e);
		return t in r.cache || (r.cache[t] = n(t)), r.enable ? r.cache[t] : n(t);
	}, Object.defineProperty(e[t], "name", {
		value: `${t}-from-cache`,
		configurable: !1
	});
}
function Qg(e, t, n) {
	if (!e[t]) return;
	let r = e[t].bind(e);
	e[t] = function(...t) {
		let { valueChanged: i, oldValue: a } = n(Xg.get(e)._updateCache, ...t);
		return i && r(...t), a;
	}, Object.defineProperty(e[t], "name", {
		value: `${t}-to-cache`,
		configurable: !1
	});
}
function $g(e) {
	let t = e.useProgram.bind(e);
	e.useProgram = function(n) {
		let r = Xg.get(e);
		r.program !== n && (t(n), r.program = n);
	};
}
// node_modules/@luma.gl/webgl/dist/context/helpers/create-browser-context.js
function e_(e, t, n) {
	let r = "", i = {
		preserveDrawingBuffer: !0,
		...n
	}, a = null;
	if (a ||= e.getContext("webgl2", i), i.failIfMajorPerformanceCaveat && (r ||= "Only software GPU is available. Set `failIfMajorPerformanceCaveat: false` to allow."), !a && !n.failIfMajorPerformanceCaveat && (i.failIfMajorPerformanceCaveat = !1, a = e.getContext("webgl2", i), a.luma ||= {}, a.luma.softwareRenderer = !0), a || (a = e.getContext("webgl", {}), a && (a = null, r ||= "Your browser only supports WebGL1")), !a) throw r ||= "Your browser does not support WebGL", Error(`Failed to create WebGL context: ${r}`);
	let { onContextLost: o, onContextRestored: s } = t;
	return e.addEventListener("webglcontextlost", (e) => o(e), !1), e.addEventListener("webglcontextrestored", (e) => s(e), !1), a.luma ||= {}, a;
}
// node_modules/@luma.gl/webgl/dist/context/helpers/webgl-extensions.js
function t_(e, t, n) {
	return n[t] === void 0 && (n[t] = e.getExtension(t) || null), n[t];
}
// node_modules/@luma.gl/webgl/dist/adapter/device-helpers/webgl-device-info.js
function n_(e, t) {
	let n = e.getParameter(7936), r = e.getParameter(7937);
	t_(e, "WEBGL_debug_renderer_info", t);
	let i = t.WEBGL_debug_renderer_info, a = e.getParameter(i ? i.UNMASKED_VENDOR_WEBGL : 7936), o = e.getParameter(i ? i.UNMASKED_RENDERER_WEBGL : 7937), s = a || n, c = o || r, l = e.getParameter(7938), u = r_(s, c), d = i_(s, c);
	return {
		type: "webgl",
		gpu: u,
		gpuType: a_(s, c),
		gpuBackend: d,
		vendor: s,
		renderer: c,
		version: l,
		shadingLanguage: "glsl",
		shadingLanguageVersion: 300
	};
}
function r_(e, t) {
	return /NVIDIA/i.exec(e) || /NVIDIA/i.exec(t) ? "nvidia" : /INTEL/i.exec(e) || /INTEL/i.exec(t) ? "intel" : /Apple/i.exec(e) || /Apple/i.exec(t) ? "apple" : /AMD/i.exec(e) || /AMD/i.exec(t) || /ATI/i.exec(e) || /ATI/i.exec(t) ? "amd" : /SwiftShader/i.exec(e) || /SwiftShader/i.exec(t) ? "software" : "unknown";
}
function i_(e, t) {
	return /Metal/i.exec(e) || /Metal/i.exec(t) ? "metal" : /ANGLE/i.exec(e) || /ANGLE/i.exec(t) ? "opengl" : "unknown";
}
function a_(e, t) {
	if (/SwiftShader/i.exec(e) || /SwiftShader/i.exec(t)) return "cpu";
	switch (r_(e, t)) {
		case "intel": return "integrated";
		case "software": return "cpu";
		case "unknown": return "unknown";
		default: return "discrete";
	}
}
// node_modules/@luma.gl/webgl/dist/adapter/converters/vertex-formats.js
function o_(e) {
	switch (e) {
		case "uint8": return 5121;
		case "sint8": return 5120;
		case "unorm8": return 5121;
		case "snorm8": return 5120;
		case "uint16": return 5123;
		case "sint16": return 5122;
		case "unorm16": return 5123;
		case "snorm16": return 5122;
		case "uint32": return 5125;
		case "sint32": return 5124;
		case "float16": return 5131;
		case "float32": return 5126;
	}
	throw Error(String(e));
}
// node_modules/@luma.gl/webgl/dist/adapter/converters/webgl-texture-table.js
var s_ = "WEBGL_compressed_texture_s3tc", c_ = "WEBGL_compressed_texture_s3tc_srgb", l_ = "EXT_texture_compression_rgtc", u_ = "EXT_texture_compression_bptc", d_ = "WEBGL_compressed_texture_etc", f_ = "WEBGL_compressed_texture_astc", p_ = "WEBGL_compressed_texture_etc1", m_ = "WEBGL_compressed_texture_pvrtc", h_ = "WEBGL_compressed_texture_atc", g_ = "EXT_texture_norm16", __ = "EXT_render_snorm", v_ = "EXT_color_buffer_float", y_ = {
	"float32-renderable-webgl": ["EXT_color_buffer_float"],
	"float16-renderable-webgl": ["EXT_color_buffer_half_float"],
	"rgb9e5ufloat-renderable-webgl": ["WEBGL_render_shared_exponent"],
	"snorm8-renderable-webgl": [__],
	"norm16-renderable-webgl": [g_],
	"snorm16-renderable-webgl": [g_, __],
	"float32-filterable": ["OES_texture_float_linear"],
	"float16-filterable-webgl": ["OES_texture_half_float_linear"],
	"texture-filterable-anisotropic-webgl": ["EXT_texture_filter_anisotropic"],
	"texture-blend-float-webgl": ["EXT_float_blend"],
	"texture-compression-bc": [
		s_,
		c_,
		l_,
		u_
	],
	"texture-compression-bc5-webgl": [l_],
	"texture-compression-bc7-webgl": [u_],
	"texture-compression-etc2": [d_],
	"texture-compression-astc": [f_],
	"texture-compression-etc1-webgl": [p_],
	"texture-compression-pvrtc-webgl": [m_],
	"texture-compression-atc-webgl": [h_]
};
function b_(e) {
	return e in y_;
}
function x_(e, t, n) {
	return (y_[t] || []).every((t) => t_(e, t, n));
}
var S_ = {
	r8unorm: {
		gl: 33321,
		rb: !0
	},
	r8snorm: { gl: 36756 },
	r8uint: {
		gl: 33330,
		rb: !0
	},
	r8sint: {
		gl: 33329,
		rb: !0
	},
	rg8unorm: {
		gl: 33323,
		rb: !0
	},
	rg8snorm: { gl: 36757 },
	rg8uint: {
		gl: 33336,
		rb: !0
	},
	rg8sint: {
		gl: 33335,
		rb: !0
	},
	r16uint: {
		gl: 33332,
		rb: !0
	},
	r16sint: {
		gl: 33331,
		rb: !0
	},
	r16float: {
		gl: 33325,
		rb: !0
	},
	"r16unorm-webgl": {
		gl: 33322,
		rb: !0
	},
	"r16snorm-webgl": { gl: 36760 },
	"rgba4unorm-webgl": {
		gl: 32854,
		rb: !0
	},
	"rgb565unorm-webgl": {
		gl: 36194,
		rb: !0
	},
	"rgb5a1unorm-webgl": {
		gl: 32855,
		rb: !0
	},
	"rgb8unorm-webgl": { gl: 32849 },
	"rgb8snorm-webgl": { gl: 36758 },
	rgba8unorm: { gl: 32856 },
	"rgba8unorm-srgb": { gl: 35907 },
	rgba8snorm: { gl: 36759 },
	rgba8uint: { gl: 36220 },
	rgba8sint: { gl: 36238 },
	bgra8unorm: {},
	"bgra8unorm-srgb": {},
	rg16uint: { gl: 33338 },
	rg16sint: { gl: 33337 },
	rg16float: {
		gl: 33327,
		rb: !0
	},
	"rg16unorm-webgl": { gl: 33324 },
	"rg16snorm-webgl": { gl: 36761 },
	r32uint: {
		gl: 33334,
		rb: !0
	},
	r32sint: {
		gl: 33333,
		rb: !0
	},
	r32float: { gl: 33326 },
	rgb9e5ufloat: { gl: 35901 },
	rg11b10ufloat: {
		gl: 35898,
		rb: !0
	},
	rgb10a2unorm: {
		gl: 32857,
		rb: !0
	},
	"rgb10a2uint-webgl": {
		gl: 36975,
		rb: !0
	},
	"rgb16unorm-webgl": { gl: 32852 },
	"rgb16snorm-webgl": { gl: 36762 },
	rg32uint: {
		gl: 33340,
		rb: !0
	},
	rg32sint: {
		gl: 33339,
		rb: !0
	},
	rg32float: {
		gl: 33328,
		rb: !0
	},
	rgba16uint: {
		gl: 36214,
		rb: !0
	},
	rgba16sint: {
		gl: 36232,
		rb: !0
	},
	rgba16float: { gl: 34842 },
	"rgba16unorm-webgl": {
		gl: 32859,
		rb: !0
	},
	"rgba16snorm-webgl": { gl: 36763 },
	"rgb32float-webgl": {
		gl: 34837,
		x: v_,
		dataFormat: 6407,
		types: [5126]
	},
	rgba32uint: {
		gl: 36208,
		rb: !0
	},
	rgba32sint: {
		gl: 36226,
		rb: !0
	},
	rgba32float: {
		gl: 34836,
		rb: !0
	},
	stencil8: {
		gl: 36168,
		rb: !0
	},
	depth16unorm: {
		gl: 33189,
		dataFormat: 6402,
		types: [5123],
		rb: !0
	},
	depth24plus: {
		gl: 33190,
		dataFormat: 6402,
		types: [5125]
	},
	depth32float: {
		gl: 36012,
		dataFormat: 6402,
		types: [5126],
		rb: !0
	},
	"depth24plus-stencil8": {
		gl: 35056,
		rb: !0,
		depthTexture: !0,
		dataFormat: 34041,
		types: [34042]
	},
	"depth32float-stencil8": {
		gl: 36013,
		dataFormat: 34041,
		types: [36269],
		rb: !0
	},
	"bc1-rgb-unorm-webgl": {
		gl: 33776,
		x: s_
	},
	"bc1-rgb-unorm-srgb-webgl": {
		gl: 35916,
		x: c_
	},
	"bc1-rgba-unorm": {
		gl: 33777,
		x: s_
	},
	"bc1-rgba-unorm-srgb": {
		gl: 35916,
		x: c_
	},
	"bc2-rgba-unorm": {
		gl: 33778,
		x: s_
	},
	"bc2-rgba-unorm-srgb": {
		gl: 35918,
		x: c_
	},
	"bc3-rgba-unorm": {
		gl: 33779,
		x: s_
	},
	"bc3-rgba-unorm-srgb": {
		gl: 35919,
		x: c_
	},
	"bc4-r-unorm": {
		gl: 36283,
		x: l_
	},
	"bc4-r-snorm": {
		gl: 36284,
		x: l_
	},
	"bc5-rg-unorm": {
		gl: 36285,
		x: l_
	},
	"bc5-rg-snorm": {
		gl: 36286,
		x: l_
	},
	"bc6h-rgb-ufloat": {
		gl: 36495,
		x: u_
	},
	"bc6h-rgb-float": {
		gl: 36494,
		x: u_
	},
	"bc7-rgba-unorm": {
		gl: 36492,
		x: u_
	},
	"bc7-rgba-unorm-srgb": {
		gl: 36493,
		x: u_
	},
	"etc2-rgb8unorm": { gl: 37492 },
	"etc2-rgb8unorm-srgb": { gl: 37494 },
	"etc2-rgb8a1unorm": { gl: 37496 },
	"etc2-rgb8a1unorm-srgb": { gl: 37497 },
	"etc2-rgba8unorm": { gl: 37493 },
	"etc2-rgba8unorm-srgb": { gl: 37495 },
	"eac-r11unorm": { gl: 37488 },
	"eac-r11snorm": { gl: 37489 },
	"eac-rg11unorm": { gl: 37490 },
	"eac-rg11snorm": { gl: 37491 },
	"astc-4x4-unorm": { gl: 37808 },
	"astc-4x4-unorm-srgb": { gl: 37840 },
	"astc-5x4-unorm": { gl: 37809 },
	"astc-5x4-unorm-srgb": { gl: 37841 },
	"astc-5x5-unorm": { gl: 37810 },
	"astc-5x5-unorm-srgb": { gl: 37842 },
	"astc-6x5-unorm": { gl: 37811 },
	"astc-6x5-unorm-srgb": { gl: 37843 },
	"astc-6x6-unorm": { gl: 37812 },
	"astc-6x6-unorm-srgb": { gl: 37844 },
	"astc-8x5-unorm": { gl: 37813 },
	"astc-8x5-unorm-srgb": { gl: 37845 },
	"astc-8x6-unorm": { gl: 37814 },
	"astc-8x6-unorm-srgb": { gl: 37846 },
	"astc-8x8-unorm": { gl: 37815 },
	"astc-8x8-unorm-srgb": { gl: 37847 },
	"astc-10x5-unorm": { gl: 37819 },
	"astc-10x5-unorm-srgb": { gl: 37851 },
	"astc-10x6-unorm": { gl: 37817 },
	"astc-10x6-unorm-srgb": { gl: 37849 },
	"astc-10x8-unorm": { gl: 37818 },
	"astc-10x8-unorm-srgb": { gl: 37850 },
	"astc-10x10-unorm": { gl: 37819 },
	"astc-10x10-unorm-srgb": { gl: 37851 },
	"astc-12x10-unorm": { gl: 37820 },
	"astc-12x10-unorm-srgb": { gl: 37852 },
	"astc-12x12-unorm": { gl: 37821 },
	"astc-12x12-unorm-srgb": { gl: 37853 },
	"pvrtc-rgb4unorm-webgl": { gl: 35840 },
	"pvrtc-rgba4unorm-webgl": { gl: 35842 },
	"pvrtc-rbg2unorm-webgl": { gl: 35841 },
	"pvrtc-rgba2unorm-webgl": { gl: 35843 },
	"etc1-rbg-unorm-webgl": { gl: 36196 },
	"atc-rgb-unorm-webgl": { gl: 35986 },
	"atc-rgba-unorm-webgl": { gl: 35986 },
	"atc-rgbai-unorm-webgl": { gl: 34798 }
};
function C_(e, t, n) {
	let r = t.create, i = S_[t.format];
	return i?.gl === void 0 && (r = !1), i?.x && (r &&= !!t_(e, i.x, n)), {
		format: t.format,
		create: r && t.create,
		render: r && t.render,
		filter: r && t.filter,
		blend: r && t.blend,
		store: r && t.store
	};
}
function w_(e) {
	let t = S_[e], n = D_(e), r = _a(e);
	return {
		internalFormat: n,
		format: t?.dataFormat || E_(r.channels, r.integer, r.normalized, n),
		type: r.dataType ? o_(r.dataType) : t?.types?.[0] || 5121,
		compressed: r.compressed || !1
	};
}
function T_(e) {
	switch (_a(e).attachment) {
		case "depth": return 36096;
		case "stencil": return 36128;
		case "depth-stencil": return 33306;
		default: throw Error(`Not a depth stencil format: ${e}`);
	}
}
function E_(e, t, n, r) {
	if (r === 6408 || r === 6407) return r;
	switch (e) {
		case "r": return t && !n ? 36244 : 6403;
		case "rg": return t && !n ? 33320 : 33319;
		case "rgb": return t && !n ? 36248 : 6407;
		case "rgba": return t && !n ? 36249 : 6408;
		case "bgra": throw Error("bgra pixels not supported by WebGL");
		default: return 6408;
	}
}
function D_(e) {
	let t = S_[e]?.gl;
	if (t === void 0) throw Error(`Unsupported texture format ${e}`);
	return t;
}
// node_modules/@luma.gl/webgl/dist/adapter/device-helpers/webgl-device-features.js
var O_ = {
	"depth-clip-control": "EXT_depth_clamp",
	"timer-query-webgl": "EXT_disjoint_timer_query_webgl2",
	"compilation-status-async-webgl": "KHR_parallel_shader_compile",
	"polygon-mode-webgl": "WEBGL_polygon_mode",
	"provoking-vertex-webgl": "WEBGL_provoking_vertex",
	"shader-clip-cull-distance-webgl": "WEBGL_clip_cull_distance",
	"shader-noperspective-interpolation-webgl": "NV_shader_noperspective_interpolation",
	"shader-conservative-depth-webgl": "EXT_conservative_depth"
}, k_ = class extends Sa {
	gl;
	extensions;
	testedFeatures = /* @__PURE__ */ new Set();
	constructor(e, t, n) {
		super([], n), this.gl = e, this.extensions = t, t_(e, "EXT_color_buffer_float", t);
	}
	*[Symbol.iterator]() {
		let e = this.getFeatures();
		for (let t of e) this.has(t) && (yield t);
		return [];
	}
	has(e) {
		return !this.disabledFeatures?.[e] && (this.testedFeatures.has(e) || (this.testedFeatures.add(e), b_(e) && x_(this.gl, e, this.extensions) && this.features.add(e), this.getWebGLFeature(e) && this.features.add(e)), this.features.has(e));
	}
	initializeFeatures() {
		let e = this.getFeatures().filter((e) => e !== "polygon-mode-webgl");
		for (let t of e) this.has(t);
	}
	getFeatures() {
		return [...Object.keys(O_), ...Object.keys(y_)];
	}
	getWebGLFeature(e) {
		let t = O_[e];
		return typeof t == "string" ? !!t_(this.gl, t, this.extensions) : !!t;
	}
}, A_ = class extends xa {
	get maxTextureDimension1D() {
		return 0;
	}
	get maxTextureDimension2D() {
		return this.getParameter(3379);
	}
	get maxTextureDimension3D() {
		return this.getParameter(32883);
	}
	get maxTextureArrayLayers() {
		return this.getParameter(35071);
	}
	get maxBindGroups() {
		return 0;
	}
	get maxDynamicUniformBuffersPerPipelineLayout() {
		return 0;
	}
	get maxDynamicStorageBuffersPerPipelineLayout() {
		return 0;
	}
	get maxSampledTexturesPerShaderStage() {
		return this.getParameter(35660);
	}
	get maxSamplersPerShaderStage() {
		return this.getParameter(35661);
	}
	get maxStorageBuffersPerShaderStage() {
		return 0;
	}
	get maxStorageTexturesPerShaderStage() {
		return 0;
	}
	get maxUniformBuffersPerShaderStage() {
		return this.getParameter(35375);
	}
	get maxUniformBufferBindingSize() {
		return this.getParameter(35376);
	}
	get maxStorageBufferBindingSize() {
		return 0;
	}
	get minUniformBufferOffsetAlignment() {
		return this.getParameter(35380);
	}
	get minStorageBufferOffsetAlignment() {
		return 0;
	}
	get maxVertexBuffers() {
		return 16;
	}
	get maxVertexAttributes() {
		return this.getParameter(34921);
	}
	get maxVertexBufferArrayStride() {
		return 2048;
	}
	get maxInterStageShaderComponents() {
		return this.getParameter(35659);
	}
	get maxComputeWorkgroupStorageSize() {
		return 0;
	}
	get maxComputeInvocationsPerWorkgroup() {
		return 0;
	}
	get maxComputeWorkgroupSizeX() {
		return 0;
	}
	get maxComputeWorkgroupSizeY() {
		return 0;
	}
	get maxComputeWorkgroupSizeZ() {
		return 0;
	}
	get maxComputeWorkgroupsPerDimension() {
		return 0;
	}
	gl;
	limits = {};
	constructor(e) {
		super(), this.gl = e;
	}
	getParameter(e) {
		return this.limits[e] === void 0 && (this.limits[e] = this.gl.getParameter(e)), this.limits[e] || 0;
	}
}, j_ = class extends Ya {
	device;
	gl;
	handle;
	colorAttachments = [];
	depthStencilAttachment = null;
	constructor(e, t) {
		super(e, t);
		let n = t.handle === null;
		this.device = e, this.gl = e.gl, this.handle = this.props.handle || n ? this.props.handle : this.gl.createFramebuffer(), n || (e.setSpectorMetadata(this.handle, {
			id: this.props.id,
			props: this.props
		}), this.autoCreateAttachmentTextures(), this.updateAttachments());
	}
	destroy() {
		super.destroy(), !this.destroyed && this.handle !== null && this.gl.deleteFramebuffer(this.handle);
	}
	updateAttachments() {
		let e = this.gl.bindFramebuffer(36160, this.handle);
		for (let e = 0; e < this.colorAttachments.length; ++e) {
			let t = this.colorAttachments[e];
			if (t) {
				let n = 36064 + e;
				this._attachTextureView(n, t);
			}
		}
		if (this.depthStencilAttachment) {
			let e = T_(this.depthStencilAttachment.props.format);
			this._attachTextureView(e, this.depthStencilAttachment);
		}
		if (this.device.props.debug) {
			let e = this.gl.checkFramebufferStatus(36160);
			if (e !== 36053) throw Error(`Framebuffer ${N_(e)}`);
		}
		this.gl.bindFramebuffer(36160, e);
	}
	_attachTextureView(e, t) {
		let { gl: n } = this.device, { texture: r } = t, i = t.props.baseMipLevel, a = t.props.baseArrayLayer;
		switch (n.bindTexture(r.glTarget, r.handle), r.glTarget) {
			case 35866:
			case 32879:
				n.framebufferTextureLayer(36160, e, r.handle, i, a);
				break;
			case 34067:
				let t = M_(a);
				n.framebufferTexture2D(36160, e, t, r.handle, i);
				break;
			case 3553:
				n.framebufferTexture2D(36160, e, 3553, r.handle, i);
				break;
			default: throw Error("Illegal texture type");
		}
		n.bindTexture(r.glTarget, null);
	}
};
function M_(e) {
	return e < 34069 ? e + 34069 : e;
}
function N_(e) {
	switch (e) {
		case 36053: return "success";
		case 36054: return "Mismatched attachments";
		case 36055: return "No attachments";
		case 36057: return "Height/width mismatch";
		case 36061: return "Unsupported or split attachments";
		case 36182: return "Samples mismatch";
		default: return `${e}`;
	}
}
// node_modules/@luma.gl/webgl/dist/adapter/webgl-canvas-context.js
var P_ = class extends ja {
	device;
	format = "rgba8unorm";
	depthStencilFormat = "depth24plus";
	presentationSize;
	_framebuffer = null;
	get [Symbol.toStringTag]() {
		return "WebGLCanvasContext";
	}
	constructor(e, t) {
		super(t), this.device = e, this.presentationSize = [-1, -1], this._setAutoCreatedCanvasId(`${this.device.id}-canvas`), this.update();
	}
	getCurrentFramebuffer() {
		return this.update(), this._framebuffer = this._framebuffer || new j_(this.device, { handle: null }), this._framebuffer;
	}
	update() {
		let e = this.getPixelSize();
		(e[0] !== this.presentationSize[0] || e[1] !== this.presentationSize[1]) && (this.presentationSize = e, this.resize());
	}
	resize(e) {
		if (this.device.gl && this.canvas) {
			let t = this.getDevicePixelRatio(e?.useDevicePixels);
			this.setDevicePixelRatio(t, e);
		}
	}
	commit() {}
};
// node_modules/@luma.gl/webgl/dist/utils/load-script.js
async function F_(e, t) {
	let n = document.getElementsByTagName("head")[0];
	if (!n) throw Error("loadScript");
	let r = document.createElement("script");
	return r.setAttribute("type", "text/javascript"), r.setAttribute("src", e), t && (r.id = t), new Promise((t, i) => {
		r.onload = t, r.onerror = (t) => i(/* @__PURE__ */ Error(`Unable to load script '${e}': ${t}`)), n.appendChild(r);
	});
}
// node_modules/@luma.gl/webgl/dist/context/debug/spector.js
var I_ = 1, L_ = null, R_ = !1, z_ = {
	debugSpectorJS: D.get("debug-spectorjs"),
	debugSpectorJSUrl: "https://cdn.jsdelivr.net/npm/spectorjs@0.9.30/dist/spector.bundle.js",
	gl: void 0
};
async function B_(e) {
	if (!globalThis.SPECTOR) try {
		await F_(e.debugSpectorJSUrl || z_.debugSpectorJSUrl);
	} catch (e) {
		D.warn(String(e));
	}
}
function V_(e) {
	if (e = {
		...z_,
		...e
	}, !e.debugSpectorJS) return null;
	if (!L_ && globalThis.SPECTOR && !globalThis.luma?.spector) {
		D.probe(I_, "SPECTOR found and initialized. Start with `luma.spector.displayUI()`")();
		let { Spector: e } = globalThis.SPECTOR;
		L_ = new e(), globalThis.luma && (globalThis.luma.spector = L_);
	}
	if (!L_) return null;
	if (R_ || (R_ = !0, L_.spyCanvases(), L_?.onCaptureStarted.add((e) => D.info("Spector capture started:", e)()), L_?.onCapture.add((e) => {
		D.info("Spector capture complete:", e)(), L_?.getResultUI(), L_?.resultView.display(), L_?.resultView.addCapture(e);
	})), e.gl) {
		let t = e.gl, n = t.device;
		L_?.startCapture(e.gl, 500), t.device = n, new Promise((e) => setTimeout(e, 2e3)).then((e) => {
			D.info("Spector capture stopped after 2 seconds")(), L_?.stopCapture();
		});
	}
	return L_;
}
// node_modules/@luma.gl/webgl/dist/context/debug/webgl-developer-tools.js
var H_ = "https://unpkg.com/webgl-debug@2.0.1/index.js";
function U_(e) {
	return e.luma = e.luma || {}, e.luma;
}
async function W_() {
	_() && !globalThis.WebGLDebugUtils && (globalThis.global = globalThis.global || globalThis, globalThis.global.module = {}, await F_(H_));
}
function G_(e, t = {}) {
	return t.debugWebGL || t.traceWebGL ? q_(e, t) : K_(e);
}
function K_(e) {
	let t = U_(e);
	return t.realContext ? t.realContext : e;
}
function q_(e, t) {
	if (!globalThis.WebGLDebugUtils) return D.warn("webgl-debug not loaded")(), e;
	let n = U_(e);
	if (n.debugContext) return n.debugContext;
	globalThis.WebGLDebugUtils.init({
		...Mg,
		...e
	});
	let r = globalThis.WebGLDebugUtils.makeDebugContext(e, Y_.bind(null, t), X_.bind(null, t));
	for (let e in Mg) !(e in r) && typeof Mg[e] == "number" && (r[e] = Mg[e]);
	class i {}
	Object.setPrototypeOf(r, Object.getPrototypeOf(e)), Object.setPrototypeOf(i, r);
	let a = Object.create(i);
	return n.realContext = e, n.debugContext = a, a.debug = !0, a;
}
function J_(e, t) {
	t = Array.from(t).map((e) => e === void 0 ? "undefined" : e);
	let n = globalThis.WebGLDebugUtils.glFunctionArgsToString(e, t);
	return n = `${n.slice(0, 100)}${n.length > 100 ? "..." : ""}`, `gl.${e}(${n})`;
}
function Y_(e, t, n, r) {
	r = Array.from(r).map((e) => e === void 0 ? "undefined" : e);
	let i = `${globalThis.WebGLDebugUtils.glEnumToString(t)} in gl.${n}(${globalThis.WebGLDebugUtils.glFunctionArgsToString(n, r)})`;
	D.error(i)();
}
function X_(e, t, n) {
	let r = "";
	D.level >= 1 && (r = J_(t, n), e.traceWebGL && D.log(1, r)());
	for (let e of n) e === void 0 && (r ||= J_(t, n));
}
// node_modules/@luma.gl/webgl/dist/utils/uid.js
var Z_ = {};
function Q_(e = "id") {
	return Z_[e] = Z_[e] || 1, `${e}-${Z_[e]++}`;
}
// node_modules/@luma.gl/webgl/dist/adapter/resources/webgl-buffer.js
var $_ = class extends k {
	device;
	gl;
	handle;
	glTarget;
	glUsage;
	glIndexType = 5123;
	byteLength;
	bytesUsed;
	constructor(e, t = {}) {
		super(e, t), this.device = e, this.gl = this.device.gl;
		let n = typeof t == "object" ? t.handle : void 0;
		this.handle = n || this.gl.createBuffer(), e.setSpectorMetadata(this.handle, {
			...this.props,
			data: typeof this.props.data
		}), this.glTarget = ev(this.props.usage), this.glUsage = tv(this.props.usage), this.glIndexType = this.props.indexType === "uint32" ? 5125 : 5123, t.data ? this._initWithData(t.data, t.byteOffset, t.byteLength) : this._initWithByteLength(t.byteLength || 0);
	}
	_initWithData(e, t = 0, n = e.byteLength + t) {
		let r = this.glTarget;
		this.gl.bindBuffer(r, this.handle), this.gl.bufferData(r, n, this.glUsage), this.gl.bufferSubData(r, t, e), this.gl.bindBuffer(r, null), this.bytesUsed = n, this.byteLength = n, this._setDebugData(e, t, n), this.trackAllocatedMemory(n);
	}
	_initWithByteLength(e) {
		let t = e;
		e === 0 && (t = /* @__PURE__ */ new Float32Array());
		let n = this.glTarget;
		return this.gl.bindBuffer(n, this.handle), this.gl.bufferData(n, t, this.glUsage), this.gl.bindBuffer(n, null), this.bytesUsed = e, this.byteLength = e, this._setDebugData(null, 0, e), this.trackAllocatedMemory(e), this;
	}
	destroy() {
		!this.destroyed && this.handle && (this.removeStats(), this.trackDeallocatedMemory(), this.gl.deleteBuffer(this.handle), this.destroyed = !0, this.handle = null);
	}
	write(e, t = 0) {
		let n = 36663;
		this.gl.bindBuffer(n, this.handle), this.gl.bufferSubData(n, t, e), this.gl.bindBuffer(n, null), this._setDebugData(e, t, e.byteLength);
	}
	async readAsync(e = 0, t) {
		return this.readSyncWebGL(e, t);
	}
	readSyncWebGL(e = 0, t) {
		t ??= this.byteLength - e;
		let n = new Uint8Array(t);
		return this.gl.bindBuffer(36662, this.handle), this.gl.getBufferSubData(36662, e, n, 0, t), this.gl.bindBuffer(36662, null), this._setDebugData(n, e, t), n;
	}
};
function ev(e) {
	return e & k.INDEX ? 34963 : e & k.VERTEX ? 34962 : e & k.UNIFORM ? 35345 : 34962;
}
function tv(e) {
	return e & k.INDEX || e & k.VERTEX ? 35044 : e & k.UNIFORM ? 35048 : 35044;
}
// node_modules/@luma.gl/webgl/dist/adapter/helpers/parse-shader-compiler-log.js
function nv(e) {
	let t = e.split(/\r?\n/), n = [];
	for (let e of t) {
		if (e.length <= 1) continue;
		let t = e.split(":");
		if (t.length === 2) {
			let [e, r] = t;
			n.push({
				message: r.trim(),
				type: rv(e),
				lineNum: 0,
				linePos: 0
			});
			continue;
		}
		let [r, i, a, ...o] = t, s = parseInt(a, 10);
		isNaN(s) && (s = 0);
		let c = parseInt(i, 10);
		isNaN(c) && (c = 0), n.push({
			message: o.join(":").trim(),
			type: rv(r),
			lineNum: s,
			linePos: c
		});
	}
	return n;
}
function rv(e) {
	let t = [
		"warning",
		"error",
		"info"
	], n = e.toLowerCase();
	return t.includes(n) ? n : "info";
}
// node_modules/@luma.gl/webgl/dist/adapter/resources/webgl-shader.js
var iv = class extends Ga {
	device;
	handle;
	constructor(e, t) {
		switch (super(e, t), this.device = e, this.props.stage) {
			case "vertex":
				this.handle = this.props.handle || this.device.gl.createShader(35633);
				break;
			case "fragment":
				this.handle = this.props.handle || this.device.gl.createShader(35632);
				break;
			default: throw Error(this.props.stage);
		}
		this._compile(this.source);
	}
	destroy() {
		this.handle && (this.removeStats(), this.device.gl.deleteShader(this.handle), this.destroyed = !0);
	}
	get asyncCompilationStatus() {
		return this._waitForCompilationComplete().then(() => this.compilationStatus);
	}
	async getCompilationInfo() {
		return await this._waitForCompilationComplete(), this.getCompilationInfoSync();
	}
	getCompilationInfoSync() {
		let e = this.device.gl.getShaderInfoLog(this.handle);
		return e ? nv(e) : [];
	}
	getTranslatedSource() {
		return this.device.getExtension("WEBGL_debug_shaders").WEBGL_debug_shaders?.getTranslatedShaderSource(this.handle) || null;
	}
	async _compile(e) {
		e = e.startsWith("#version ") ? e : `#version 300 es\n${e}`;
		let { gl: t } = this.device;
		if (t.shaderSource(this.handle, e), t.compileShader(this.handle), !this.device.props.debug) this.compilationStatus = "pending";
		else if (this.device.features.has("compilation-status-async-webgl")) D.once(1, "Shader compilation is asynchronous")(), await this._waitForCompilationComplete(), D.info(2, `Shader ${this.id} - async compilation complete: ${this.compilationStatus}`)(), this._getCompilationStatus(), this.debugShader();
		else if (this._getCompilationStatus(), this.debugShader(), this.compilationStatus === "error") throw Error(`GLSL compilation errors in ${this.props.stage} shader ${this.props.id}`);
	}
	async _waitForCompilationComplete() {
		let e = async (e) => await new Promise((t) => setTimeout(t, e));
		if (!this.device.features.has("compilation-status-async-webgl")) {
			await e(10);
			return;
		}
		let { gl: t } = this.device;
		for (;;) {
			if (t.getShaderParameter(this.handle, 37297)) return;
			await e(10);
		}
	}
	_getCompilationStatus() {
		this.compilationStatus = this.device.gl.getShaderParameter(this.handle, 35713) ? "success" : "error";
	}
};
// node_modules/@luma.gl/webgl/dist/adapter/converters/device-parameters.js
function av(e, t, n, r) {
	if (mv(t)) return r(e);
	let i = e;
	i.pushState();
	try {
		return ov(e, t), Gg(i.gl, n), r(e);
	} finally {
		i.popState();
	}
}
function ov(e, t) {
	let n = e, { gl: r } = n;
	if (t.cullMode) switch (t.cullMode) {
		case "none":
			r.disable(2884);
			break;
		case "front":
			r.enable(2884), r.cullFace(1028);
			break;
		case "back": r.enable(2884), r.cullFace(1029);
	}
	if (t.frontFace && r.frontFace(fv("frontFace", t.frontFace, {
		ccw: 2305,
		cw: 2304
	})), t.unclippedDepth && e.features.has("depth-clip-control") && r.enable(34383), t.depthBias !== void 0 && (r.enable(32823), r.polygonOffset(t.depthBias, t.depthBiasSlopeScale || 0)), t.provokingVertex && e.features.has("provoking-vertex-webgl")) {
		let e = n.getExtension("WEBGL_provoking_vertex").WEBGL_provoking_vertex, r = fv("provokingVertex", t.provokingVertex, {
			first: 36429,
			last: 36430
		});
		e?.provokingVertexWEBGL(r);
	}
	if ((t.polygonMode || t.polygonOffsetLine) && e.features.has("polygon-mode-webgl")) {
		if (t.polygonMode) {
			let e = n.getExtension("WEBGL_polygon_mode").WEBGL_polygon_mode, r = fv("polygonMode", t.polygonMode, {
				fill: 6914,
				line: 6913
			});
			e?.polygonModeWEBGL(1028, r), e?.polygonModeWEBGL(1029, r);
		}
		t.polygonOffsetLine && r.enable(10754);
	}
	if (e.features.has("shader-clip-cull-distance-webgl") && (t.clipDistance0 && r.enable(12288), t.clipDistance1 && r.enable(12289), t.clipDistance2 && r.enable(12290), t.clipDistance3 && r.enable(12291), t.clipDistance4 && r.enable(12292), t.clipDistance5 && r.enable(12293), t.clipDistance6 && r.enable(12294), t.clipDistance7 && r.enable(12295)), t.depthWriteEnabled !== void 0 && r.depthMask(pv("depthWriteEnabled", t.depthWriteEnabled)), t.depthCompare && (t.depthCompare === "always" ? r.disable(2929) : r.enable(2929), r.depthFunc(sv("depthCompare", t.depthCompare))), t.stencilWriteMask) {
		let e = t.stencilWriteMask;
		r.stencilMaskSeparate(1028, e), r.stencilMaskSeparate(1029, e);
	}
	if (t.stencilReadMask && D.warn("stencilReadMask not supported under WebGL"), t.stencilCompare) {
		let e = t.stencilReadMask || 4294967295, n = sv("depthCompare", t.stencilCompare);
		t.stencilCompare === "always" ? r.disable(2960) : r.enable(2960), r.stencilFuncSeparate(1028, n, 0, e), r.stencilFuncSeparate(1029, n, 0, e);
	}
	if (t.stencilPassOperation && t.stencilFailOperation && t.stencilDepthFailOperation) {
		let e = cv("stencilPassOperation", t.stencilPassOperation), n = cv("stencilFailOperation", t.stencilFailOperation), i = cv("stencilDepthFailOperation", t.stencilDepthFailOperation);
		r.stencilOpSeparate(1028, n, i, e), r.stencilOpSeparate(1029, n, i, e);
	}
	switch (t.blend) {
		case !0:
			r.enable(3042);
			break;
		case !1: r.disable(3042);
	}
	if (t.blendColorOperation || t.blendAlphaOperation) {
		let e = lv("blendColorOperation", t.blendColorOperation || "add"), n = lv("blendAlphaOperation", t.blendAlphaOperation || "add");
		r.blendEquationSeparate(e, n);
		let i = uv("blendColorSrcFactor", t.blendColorSrcFactor || "one"), a = uv("blendColorDstFactor", t.blendColorDstFactor || "zero"), o = uv("blendAlphaSrcFactor", t.blendAlphaSrcFactor || "one"), s = uv("blendAlphaDstFactor", t.blendAlphaDstFactor || "zero");
		r.blendFuncSeparate(i, a, o, s);
	}
}
function sv(e, t) {
	return fv(e, t, {
		never: 512,
		less: 513,
		equal: 514,
		"less-equal": 515,
		greater: 516,
		"not-equal": 517,
		"greater-equal": 518,
		always: 519
	});
}
function cv(e, t) {
	return fv(e, t, {
		keep: 7680,
		zero: 0,
		replace: 7681,
		invert: 5386,
		"increment-clamp": 7682,
		"decrement-clamp": 7683,
		"increment-wrap": 34055,
		"decrement-wrap": 34056
	});
}
function lv(e, t) {
	return fv(e, t, {
		add: 32774,
		subtract: 32778,
		"reverse-subtract": 32779,
		min: 32775,
		max: 32776
	});
}
function uv(e, t) {
	return fv(e, t, {
		one: 1,
		zero: 0,
		"src-color": 768,
		"one-minus-src-color": 769,
		"dst-color": 774,
		"one-minus-dst-color": 775,
		"src-alpha": 770,
		"one-minus-src-alpha": 771,
		"dst-alpha": 772,
		"one-minus-dst-alpha": 773,
		"src-alpha-saturated": 776,
		"constant-color": 32769,
		"one-minus-constant-color": 32770,
		"constant-alpha": 32771,
		"one-minus-constant-alpha": 32772
	});
}
function dv(e, t) {
	return `Illegal parameter ${t} for ${e}`;
}
function fv(e, t, n) {
	if (!(t in n)) throw Error(dv(e, t));
	return n[t];
}
function pv(e, t) {
	return t;
}
function mv(e) {
	let t = !0;
	for (let n in e) {
		t = !1;
		break;
	}
	return t;
}
// node_modules/@luma.gl/webgl/dist/adapter/converters/sampler-parameters.js
function hv(e) {
	let t = {};
	return e.addressModeU && (t[10242] = gv(e.addressModeU)), e.addressModeV && (t[10243] = gv(e.addressModeV)), e.addressModeW && (t[32882] = gv(e.addressModeW)), e.magFilter && (t[10240] = _v(e.magFilter)), (e.minFilter || e.mipmapFilter) && (t[10241] = vv(e.minFilter || "linear", e.mipmapFilter)), e.lodMinClamp !== void 0 && (t[33082] = e.lodMinClamp), e.lodMaxClamp !== void 0 && (t[33083] = e.lodMaxClamp), e.type === "comparison-sampler" && (t[34892] = 34894), e.compare && (t[34893] = sv("compare", e.compare)), e.maxAnisotropy && (t[34046] = e.maxAnisotropy), t;
}
function gv(e) {
	switch (e) {
		case "clamp-to-edge": return 33071;
		case "repeat": return 10497;
		case "mirror-repeat": return 33648;
	}
}
function _v(e) {
	switch (e) {
		case "nearest": return 9728;
		case "linear": return 9729;
	}
}
function vv(e, t = "none") {
	if (!t) return _v(e);
	switch (t) {
		case "none": return _v(e);
		case "nearest": return e === "nearest" ? 9984 : 9986;
		case "linear": return e === "nearest" ? 9985 : 9987;
	}
}
// node_modules/@luma.gl/webgl/dist/adapter/resources/webgl-sampler.js
var yv = class extends Ja {
	device;
	handle;
	parameters;
	constructor(e, t) {
		super(e, t), this.device = e, this.parameters = hv(t), this.handle = this.handle || this.device.gl.createSampler(), this._setSamplerParameters(this.parameters);
	}
	destroy() {
		this.handle &&= (this.device.gl.deleteSampler(this.handle), void 0);
	}
	toString() {
		return `Sampler(${this.id},${JSON.stringify(this.props)})`;
	}
	_setSamplerParameters(e) {
		for (let [t, n] of Object.entries(e)) {
			let e = Number(t);
			switch (e) {
				case 33082:
				case 33083:
					this.device.gl.samplerParameterf(this.handle, e, n);
					break;
				default: this.device.gl.samplerParameteri(this.handle, e, n);
			}
		}
	}
}, bv = class extends Ra {
	device;
	gl;
	handle;
	texture;
	constructor(e, t) {
		super(e, {
			...j.defaultProps,
			...t
		}), this.device = e, this.gl = this.device.gl, this.handle = null, this.texture = t.texture;
	}
}, xv = "Failed to deduce GL constant from typed array";
function Sv(e) {
	switch (ArrayBuffer.isView(e) ? e.constructor : e) {
		case Float32Array: return 5126;
		case Uint16Array: return 5123;
		case Uint32Array: return 5125;
		case Uint8Array: return 5121;
		case Uint8ClampedArray: return 5121;
		case Int8Array: return 5120;
		case Int16Array: return 5122;
		case Int32Array: return 5124;
		default: throw Error(xv);
	}
}
function Cv(e, t) {
	let { clamped: n = !0 } = t || {};
	switch (e) {
		case 5126: return Float32Array;
		case 5123:
		case 33635:
		case 32819:
		case 32820: return Uint16Array;
		case 5125: return Uint32Array;
		case 5121: return n ? Uint8ClampedArray : Uint8Array;
		case 5120: return Int8Array;
		case 5122: return Int16Array;
		case 5124: return Int32Array;
		default: throw Error("Failed to deduce typed array type from GL constant");
	}
}
// node_modules/@luma.gl/webgl/dist/adapter/helpers/format-utils.js
function wv(e) {
	switch (e) {
		case 6406:
		case 33326:
		case 6403:
		case 36244: return 1;
		case 33339:
		case 33340:
		case 33328:
		case 33320:
		case 33319: return 2;
		case 6407:
		case 36248:
		case 34837: return 3;
		case 6408:
		case 36249:
		case 34836: return 4;
		default: return 0;
	}
}
function Tv(e) {
	switch (e) {
		case 5121: return 1;
		case 33635:
		case 32819:
		case 32820: return 2;
		case 5126: return 4;
		default: return 0;
	}
}
// node_modules/@luma.gl/webgl/dist/context/state-tracker/with-parameters.js
function Ev(e, t, n) {
	if (Dv(t)) return n(e);
	let { nocatch: r = !0 } = t, i = Xg.get(e);
	i.push(), Gg(e, t);
	let a;
	if (r) a = n(e), i.pop();
	else try {
		a = n(e);
	} finally {
		i.pop();
	}
	return a;
}
function Dv(e) {
	for (let t in e) return !1;
	return !0;
}
// node_modules/@luma.gl/webgl/dist/adapter/helpers/webgl-texture-utils.js
function Ov(e, t, n) {
	let { dimension: r, width: i, height: a, depth: o = 0 } = n, { glInternalFormat: s } = n, c = n.glTarget;
	switch (r) {
		case "2d-array":
		case "3d":
			e.texStorage3D(c, t, s, i, a, o);
			break;
		default: e.texStorage2D(c, t, s, i, a);
	}
}
function kv(e, t, n, r) {
	let { width: i, height: a } = r, { dimension: o, depth: s = 0, mipLevel: c = 0 } = r, { x: l = 0, y: u = 0, z: d = 0 } = r, { glFormat: f, glType: p } = r, m = Mv(r.glTarget, o, s);
	Ev(e, r.flipY ? { 37440: !0 } : {}, () => {
		switch (o) {
			case "2d-array":
			case "3d":
				e.bindTexture(m, t), e.texSubImage3D(m, c, l, u, d, i, a, s, f, p, n), e.bindTexture(m, null);
				break;
			case "2d":
			case "cube":
				e.bindTexture(m, t), e.texSubImage2D(m, c, l, u, i, a, f, p, n), e.bindTexture(m, null);
				break;
			default: throw Error(o);
		}
	});
}
function Av(e, t, n) {
	let { dimension: r, width: i, height: a, depth: o = 0, mipLevel: s = 0, byteOffset: c = 0 } = n, { x: l = 0, y: u = 0, z: d = 0 } = n, { glFormat: f, glType: p, compressed: m } = n, h = Mv(n.glTarget, r, o);
	switch (r) {
		case "2d-array":
		case "3d":
			m ? e.compressedTexSubImage3D(h, s, l, u, d, i, a, o, f, t, c) : e.texSubImage3D(h, s, l, u, d, i, a, o, f, p, t, c);
			break;
		case "2d":
		case "cube":
			m ? e.compressedTexSubImage2D(h, s, l, u, i, a, f, t, c) : e.texSubImage2D(h, s, l, u, i, a, f, p, t, c);
			break;
		default: throw Error(r);
	}
}
function jv(e) {
	switch (e) {
		case "1d": break;
		case "2d": return 3553;
		case "3d": return 32879;
		case "cube": return 34067;
		case "2d-array": return 35866;
	}
	throw Error(e);
}
function Mv(e, t, n) {
	return t === "cube" ? 34069 + n : e;
}
function Nv(e, t) {
	let { sourceX: n = 0, sourceY: r = 0, sourceAttachment: i = 0 } = t || {}, { target: a = null, sourceWidth: o, sourceHeight: s, sourceDepth: c, sourceFormat: l, sourceType: u } = t || {}, { framebuffer: d, deleteFramebuffer: f } = Fv(e), { gl: p, handle: m } = d;
	o ||= d.width, s ||= d.height;
	let h = d.colorAttachments[i]?.texture;
	if (!h) throw Error(`Invalid framebuffer attachment ${i}`);
	c = h?.depth || 1, l ||= h?.glFormat || 6408, u ||= h?.glType || 5121, a = Lv(a, u, l, o, s, c), u ||= Sv(a);
	let g = p.bindFramebuffer(36160, m);
	return p.readBuffer(36064 + i), p.readPixels(n, r, o, s, l, u, a), p.readBuffer(36064), p.bindFramebuffer(36160, g || null), f && d.destroy(), a;
}
function Pv(e, t) {
	let { target: n, sourceX: r = 0, sourceY: i = 0, sourceFormat: a = 6408, targetByteOffset: o = 0 } = t || {}, { sourceWidth: s, sourceHeight: c, sourceType: l } = t || {}, { framebuffer: u, deleteFramebuffer: d } = Fv(e);
	s ||= u.width, c ||= u.height;
	let f = u;
	l ||= 5121;
	let p = n;
	if (!p) {
		let e = wv(a), t = Tv(l), n = o + s * c * e * t;
		p = f.device.createBuffer({ byteLength: n });
	}
	let m = e.device.createCommandEncoder();
	return m.copyTextureToBuffer({
		sourceTexture: e,
		width: s,
		height: c,
		origin: [r, i],
		destinationBuffer: p,
		byteOffset: o
	}), m.destroy(), d && u.destroy(), p;
}
function Fv(e) {
	return e instanceof Ya ? {
		framebuffer: e,
		deleteFramebuffer: !1
	} : {
		framebuffer: Iv(e),
		deleteFramebuffer: !0
	};
}
function Iv(e, t) {
	let { device: n, width: r, height: i, id: a } = e;
	return n.createFramebuffer({
		...t,
		id: `framebuffer-for-${a}`,
		width: r,
		height: i,
		colorAttachments: [e]
	});
}
function Lv(e, t, n, r, i, a) {
	if (e) return e;
	t ||= 5121;
	let o = Cv(t, { clamped: !1 }), s = wv(n);
	return new o(r * i * s);
}
// node_modules/@luma.gl/webgl/dist/adapter/resources/webgl-texture.js
var Rv = class extends j {
	device;
	gl;
	handle;
	sampler = void 0;
	view = void 0;
	mipmaps;
	compressed;
	glTarget;
	glFormat;
	glType;
	glInternalFormat;
	textureUnit = 0;
	constructor(e, t) {
		super(e, t);
		let n = { ...this.props };
		n.data = t.data, this.device = e, this.gl = this.device.gl, this.glTarget = jv(this.props.dimension);
		let r = w_(this.props.format);
		this.glInternalFormat = r.internalFormat, this.glFormat = r.format, this.glType = r.type, this.compressed = r.compressed, this.mipmaps = !!this.props.mipmaps, this._initialize(n), Object.seal(this);
	}
	_initialize(e) {
		this.handle = this.props.handle || this.gl.createTexture(), this.device.setSpectorMetadata(this.handle, {
			...this.props,
			data: e.data
		});
		let { width: t, height: n } = e;
		if (!t || !n) {
			let r = j.getTextureDataSize(e.data);
			t = r?.width || 1, n = r?.height || 1;
		}
		if (this.width = t, this.height = n, this.depth = e.depth, this.setSampler(e.sampler), this.view = new bv(this.device, {
			...this.props,
			texture: this
		}), this.bind(), Ov(this.gl, this.mipLevels, this), e.data) switch (e.dimension) {
			case "1d":
				this.setTexture1DData(e.data);
				break;
			case "2d":
				this.setTexture2DData(e.data);
				break;
			case "3d":
				this.setTexture3DData(e.data);
				break;
			case "cube":
				this.setTextureCubeData(e.data);
				break;
			case "2d-array":
				this.setTextureArrayData(e.data);
				break;
			case "cube-array":
				this.setTextureCubeArrayData(e.data);
				break;
			default: throw Error(e.dimension);
		}
		this.mipmaps && this.generateMipmap();
	}
	destroy() {
		this.handle && (this.gl.deleteTexture(this.handle), this.removeStats(), this.trackDeallocatedMemory("Texture"), this.destroyed = !0);
	}
	createView(e) {
		return new bv(this.device, {
			...e,
			texture: this
		});
	}
	setSampler(e = {}) {
		let t;
		e instanceof yv ? (this.sampler = e, t = e.props) : (this.sampler = new yv(this.device, e), t = e);
		let n = hv(t);
		this._setSamplerParameters(n);
	}
	generateMipmap(e) {
		if (!(!(this.device.isTextureFormatRenderable(this.props.format) && this.device.isTextureFormatFilterable(this.props.format)) && (D.warn(`${this} is not renderable or filterable, may not be able to generate mipmaps`)(), !e?.force))) try {
			this.gl.bindTexture(this.glTarget, this.handle), this.gl.generateMipmap(this.glTarget);
		} catch (e) {
			D.warn(`Error generating mipmap for ${this}: ${e.message}`)();
		} finally {
			this.gl.bindTexture(this.glTarget, null);
		}
	}
	copyExternalImage(e) {
		let t = j.getExternalImageSize(e.image), n = {
			...j.defaultCopyExternalImageOptions,
			...t,
			...e
		}, { image: r, depth: i, mipLevel: a, x: o, y: s, z: c, flipY: l } = n, { width: u, height: d } = n, { dimension: f, glTarget: p, glFormat: m, glInternalFormat: h, glType: g } = this;
		if (u = Math.min(u, this.width - o), d = Math.min(d, this.height - s), e.sourceX || e.sourceY) throw Error("WebGL does not support sourceX/sourceY)");
		return kv(this.device.gl, this.handle, r, {
			dimension: f,
			mipLevel: a,
			x: o,
			y: s,
			z: c,
			width: u,
			height: d,
			depth: i,
			glFormat: m,
			glInternalFormat: h,
			glType: g,
			glTarget: p,
			flipY: l
		}), {
			width: n.width,
			height: n.height
		};
	}
	setTexture1DData(e) {
		throw Error("setTexture1DData not supported in WebGL.");
	}
	setTexture2DData(e, t = 0) {
		this.bind();
		let n = j.normalizeTextureData(e, this);
		n.length > 1 && this.props.mipmaps !== !1 && D.warn(`Texture ${this.id} mipmap and multiple LODs.`)();
		for (let e = 0; e < n.length; e++) {
			let r = n[e];
			this._setMipLevel(t, e, r);
		}
		this.unbind();
	}
	setTexture3DData(e) {
		if (this.props.dimension !== "3d") throw Error(this.id);
		ArrayBuffer.isView(e) && (this.bind(), Av(this.device.gl, e, this), this.unbind());
	}
	setTextureCubeData(e, t = 0) {
		if (this.props.dimension !== "cube") throw Error(this.id);
		for (let t of j.CubeFaces) this.setTextureCubeFaceData(e[t], t);
	}
	setTextureArrayData(e) {
		throw this.props.dimension === "2d-array" ? Error("setTextureArrayData not implemented.") : Error(this.id);
	}
	setTextureCubeArrayData(e) {
		throw Error("setTextureCubeArrayData not supported in WebGL2.");
	}
	setTextureCubeFaceData(e, t, n = 0) {
		Array.isArray(e) && e.length > 1 && this.props.mipmaps !== !1 && D.warn(`${this.id} has mipmap and multiple LODs.`)();
		let r = j.CubeFaces.indexOf(t);
		this.setTexture2DData(e, r);
	}
	update() {
		throw Error("Texture.update() not implemented. Use ExternalTexture");
	}
	setImageDataForFace(e) {
		let { face: t, width: n, height: r, pixels: i, data: a, format: o = 6408, type: s = 5121 } = e, { gl: c } = this, l = i || a;
		this.bind(), l instanceof Promise ? l.then((n) => this.setImageDataForFace(Object.assign({}, e, {
			face: t,
			data: n,
			pixels: n
		}))) : this.width || this.height ? c.texImage2D(t, 0, o, n, r, 0, o, s, l) : c.texImage2D(t, 0, o, o, s, l);
	}
	_getImageDataMap(e) {
		for (let t = 0; t < j.CubeFaces.length; ++t) {
			let n = j.CubeFaces[t];
			e[n] && (e[34069 + t] = e[n], delete e[n]);
		}
		return e;
	}
	_setSamplerParameters(e) {
		D.log(1, `${this.id} sampler parameters`, this.device.getGLKeys(e))(), this.gl.bindTexture(this.glTarget, this.handle);
		for (let [t, n] of Object.entries(e)) {
			let e = Number(t), r = n;
			switch (e) {
				case 33082:
				case 33083:
					this.gl.texParameterf(this.glTarget, e, r);
					break;
				case 10241:
					this.gl.texParameteri(this.glTarget, e, r);
					break;
				case 10242:
				case 10243:
					this.gl.texParameteri(this.glTarget, e, r);
					break;
				case 34046:
					this.device.features.has("texture-filterable-anisotropic-webgl") && this.gl.texParameteri(this.glTarget, e, r);
					break;
				default: this.gl.texParameteri(this.glTarget, e, r);
			}
		}
		this.gl.bindTexture(this.glTarget, null);
	}
	_setMipLevel(e, t, n, r = this.glTarget) {
		if (j.isExternalImage(n)) kv(this.device.gl, this.handle, n, {
			...this,
			depth: e,
			mipLevel: t,
			glTarget: r,
			flipY: this.props.flipY
		});
		else if (j.isTextureLevelData(n)) Av(this.device.gl, n.data, {
			...this,
			depth: e,
			mipLevel: t,
			glTarget: r
		});
		else throw Error("Texture: invalid image data");
	}
	getActiveUnit() {
		return this.gl.getParameter(34016) - 33984;
	}
	bind(e) {
		let { gl: t } = this;
		return e !== void 0 && (this.textureUnit = e, t.activeTexture(33984 + e)), t.bindTexture(this.glTarget, this.handle), e;
	}
	unbind(e) {
		let { gl: t } = this;
		return e !== void 0 && (this.textureUnit = e, t.activeTexture(33984 + e)), t.bindTexture(this.glTarget, null), e;
	}
}, zv = [
	1,
	2,
	4,
	8
], Bv = class extends Za {
	device;
	glParameters;
	constructor(e, t) {
		super(e, t), this.device = e;
		let n;
		if (!t?.parameters?.viewport) {
			if (t?.framebuffer) {
				let { width: e, height: r } = t.framebuffer;
				n = [
					0,
					0,
					e,
					r
				];
			} else {
				let [t, r] = e.getCanvasContext().getDrawingBufferSize();
				n = [
					0,
					0,
					t,
					r
				];
			}
		}
		if (this.device.pushState(), this.setParameters({
			viewport: n,
			...this.props.parameters
		}), this.props.framebuffer?.handle) {
			if (this.props.framebuffer) {
				let e = this.props.framebuffer.colorAttachments.map((e, t) => 36064 + t);
				this.device.gl.drawBuffers(e);
			} else this.device.gl.drawBuffers([1029]);
		}
		this.clear();
	}
	end() {
		this.device.popState();
	}
	pushDebugGroup(e) {}
	popDebugGroup() {}
	insertDebugMarker(e) {}
	setParameters(e = {}) {
		let t = { ...this.glParameters };
		t.framebuffer = this.props.framebuffer || null, this.props.depthReadOnly && (t.depthMask = !this.props.depthReadOnly), t.stencilMask = +!this.props.stencilReadOnly, t[35977] = this.props.discard, e.viewport && (e.viewport.length >= 6 ? (t.viewport = e.viewport.slice(0, 4), t.depthRange = [e.viewport[4], e.viewport[5]]) : t.viewport = e.viewport), e.scissorRect && (t.scissorTest = !0, t.scissor = e.scissorRect), e.blendConstant && (t.blendColor = e.blendConstant), e.stencilReference && (e[2967] = e.stencilReference), e.colorMask && (t.colorMask = zv.map((t) => !!(t & e.colorMask))), this.glParameters = t, Gg(this.device.gl, t);
	}
	beginOcclusionQuery(e) {
		this.props.occlusionQuerySet?.beginOcclusionQuery();
	}
	endOcclusionQuery() {
		this.props.occlusionQuerySet?.endOcclusionQuery();
	}
	clear() {
		let e = { ...this.glParameters }, t = 0;
		this.props.clearColors && this.props.clearColors.forEach((e, t) => {
			e && this.clearColorBuffer(t, e);
		}), this.props.clearColor !== !1 && this.props.clearColors === void 0 && (t |= 16384, e.clearColor = this.props.clearColor), this.props.clearDepth !== !1 && (t |= 256, e.clearDepth = this.props.clearDepth), this.props.clearStencil !== !1 && (t |= 1024, e.clearStencil = this.props.clearStencil), t !== 0 && Ev(this.device.gl, e, () => {
			this.device.gl.clear(t);
		});
	}
	clearColorBuffer(e = 0, t = [
		0,
		0,
		0,
		0
	]) {
		Ev(this.device.gl, { framebuffer: this.props.framebuffer }, () => {
			switch (t.constructor) {
				case Int8Array:
				case Int16Array:
				case Int32Array:
					this.device.gl.clearBufferiv(6144, e, t);
					break;
				case Uint8Array:
				case Uint8ClampedArray:
				case Uint16Array:
				case Uint32Array:
					this.device.gl.clearBufferuiv(6144, e, t);
					break;
				case Float32Array:
					this.device.gl.clearBufferfv(6144, e, t);
					break;
				default: throw Error("clearColorBuffer: color must be typed array");
			}
		});
	}
};
// node_modules/@luma.gl/webgl/dist/adapter/helpers/decode-webgl-types.js
function Vv(e) {
	return Hv.includes(e);
}
var Hv = [
	35678,
	35680,
	35679,
	35682,
	36289,
	36292,
	36293,
	36298,
	36299,
	36300,
	36303,
	36306,
	36307,
	36308,
	36311
], Uv = {
	5126: [
		5126,
		1,
		"float",
		"f32",
		"float32"
	],
	35664: [
		5126,
		2,
		"vec2",
		"vec2<f32>",
		"float32x2"
	],
	35665: [
		5126,
		3,
		"vec3",
		"vec3<f32>",
		"float32x3"
	],
	35666: [
		5126,
		4,
		"vec4",
		"vec4<f32>",
		"float32x4"
	],
	5124: [
		5124,
		1,
		"int",
		"i32",
		"sint32"
	],
	35667: [
		5124,
		2,
		"ivec2",
		"vec2<i32>",
		"sint32x2"
	],
	35668: [
		5124,
		3,
		"ivec3",
		"vec3<i32>",
		"sint32x3"
	],
	35669: [
		5124,
		4,
		"ivec4",
		"vec4<i32>",
		"sint32x4"
	],
	5125: [
		5125,
		1,
		"uint",
		"u32",
		"uint32"
	],
	36294: [
		5125,
		2,
		"uvec2",
		"vec2<u32>",
		"uint32x2"
	],
	36295: [
		5125,
		3,
		"uvec3",
		"vec3<u32>",
		"uint32x3"
	],
	36296: [
		5125,
		4,
		"uvec4",
		"vec4<u32>",
		"uint32x4"
	],
	35670: [
		5126,
		1,
		"bool",
		"f32",
		"float32"
	],
	35671: [
		5126,
		2,
		"bvec2",
		"vec2<f32>",
		"float32x2"
	],
	35672: [
		5126,
		3,
		"bvec3",
		"vec3<f32>",
		"float32x3"
	],
	35673: [
		5126,
		4,
		"bvec4",
		"vec4<f32>",
		"float32x4"
	],
	35674: [
		5126,
		8,
		"mat2",
		"mat2x2<f32>"
	],
	35685: [
		5126,
		8,
		"mat2x3",
		"mat2x3<f32>"
	],
	35686: [
		5126,
		8,
		"mat2x4",
		"mat2x4<f32>"
	],
	35687: [
		5126,
		12,
		"mat3x2",
		"mat3x2<f32>"
	],
	35675: [
		5126,
		12,
		"mat3",
		"mat3x3<f32>"
	],
	35688: [
		5126,
		12,
		"mat3x4",
		"mat3x4<f32>"
	],
	35689: [
		5126,
		16,
		"mat4x2",
		"mat4x2<f32>"
	],
	35690: [
		5126,
		16,
		"mat4x3",
		"mat4x3<f32>"
	],
	35676: [
		5126,
		16,
		"mat4",
		"mat4x4<f32>"
	]
};
function Wv(e) {
	let t = Uv[e];
	if (!t) throw Error("uniform");
	let [n, r, , i] = t;
	return {
		format: i,
		components: r,
		glType: n
	};
}
function Gv(e) {
	let t = Uv[e];
	if (!t) throw Error("attribute");
	let [, n, , r, i] = t;
	return {
		attributeType: r,
		vertexFormat: i,
		components: n
	};
}
// node_modules/@luma.gl/webgl/dist/adapter/helpers/get-shader-layout.js
function Kv(e, t) {
	let n = {
		attributes: [],
		bindings: []
	};
	n.attributes = qv(e, t);
	let r = Xv(e, t);
	for (let e of r) {
		let t = e.uniforms.map((e) => ({
			name: e.name,
			format: e.format,
			byteOffset: e.byteOffset,
			byteStride: e.byteStride,
			arrayLength: e.arrayLength
		}));
		n.bindings.push({
			type: "uniform",
			name: e.name,
			group: 0,
			location: e.location,
			visibility: +!!e.vertex & (e.fragment ? 2 : 0),
			minBindingSize: e.byteLength,
			uniforms: t
		});
	}
	let i = Yv(e, t), a = 0;
	for (let e of i) if (Vv(e.type)) {
		let { viewDimension: t, sampleType: r } = Qv(e.type);
		n.bindings.push({
			type: "texture",
			name: e.name,
			group: 0,
			location: a,
			viewDimension: t,
			sampleType: r
		}), e.textureUnit = a, a += 1;
	}
	i.length && (n.uniforms = i);
	let o = Jv(e, t);
	return o?.length && (n.varyings = o), n;
}
function qv(e, t) {
	let n = [], r = e.getProgramParameter(t, 35721);
	for (let i = 0; i < r; i++) {
		let r = e.getActiveAttrib(t, i);
		if (!r) throw Error("activeInfo");
		let { name: a, type: o } = r, s = e.getAttribLocation(t, a);
		if (s >= 0) {
			let { attributeType: e } = Gv(o), t = /instance/i.test(a) ? "instance" : "vertex";
			n.push({
				name: a,
				location: s,
				stepMode: t,
				type: e
			});
		}
	}
	return n.sort((e, t) => e.location - t.location), n;
}
function Jv(e, t) {
	let n = [], r = e.getProgramParameter(t, 35971);
	for (let i = 0; i < r; i++) {
		let r = e.getTransformFeedbackVarying(t, i);
		if (!r) throw Error("activeInfo");
		let { name: a, type: o, size: s } = r, { glType: c, components: l } = Wv(o), u = {
			location: i,
			name: a,
			type: c,
			size: s * l
		};
		n.push(u);
	}
	return n.sort((e, t) => e.location - t.location), n;
}
function Yv(e, t) {
	let n = [], r = e.getProgramParameter(t, 35718);
	for (let i = 0; i < r; i++) {
		let r = e.getActiveUniform(t, i);
		if (!r) throw Error("activeInfo");
		let { name: a, size: o, type: s } = r, { name: c, isArray: l } = $v(a), u = e.getUniformLocation(t, c), d = {
			location: u,
			name: c,
			size: o,
			type: s,
			isArray: l
		};
		if (n.push(d), d.size > 1) for (let r = 0; r < d.size; r++) {
			let i = `${c}[${r}]`;
			u = e.getUniformLocation(t, i);
			let a = {
				...d,
				name: i,
				location: u
			};
			n.push(a);
		}
	}
	return n;
}
function Xv(e, t) {
	let n = (n, r) => e.getActiveUniformBlockParameter(t, n, r), r = [], i = e.getProgramParameter(t, 35382);
	for (let a = 0; a < i; a++) {
		let i = {
			name: e.getActiveUniformBlockName(t, a) || "",
			location: n(a, 35391),
			byteLength: n(a, 35392),
			vertex: n(a, 35396),
			fragment: n(a, 35398),
			uniformCount: n(a, 35394),
			uniforms: []
		}, o = n(a, 35395) || [], s = e.getActiveUniforms(t, o, 35383), c = e.getActiveUniforms(t, o, 35384), l = e.getActiveUniforms(t, o, 35387), u = e.getActiveUniforms(t, o, 35388);
		for (let n = 0; n < i.uniformCount; ++n) {
			let r = e.getActiveUniform(t, o[n]);
			if (!r) throw Error("activeInfo");
			i.uniforms.push({
				name: r.name,
				format: Wv(s[n]).format,
				type: s[n],
				arrayLength: c[n],
				byteOffset: l[n],
				byteStride: u[n]
			});
		}
		r.push(i);
	}
	return r.sort((e, t) => e.location - t.location), r;
}
var Zv = {
	35678: ["2d", "float"],
	35680: ["cube", "float"],
	35679: ["3d", "float"],
	35682: ["3d", "depth"],
	36289: ["2d-array", "float"],
	36292: ["2d-array", "depth"],
	36293: ["cube", "float"],
	36298: ["2d", "sint"],
	36299: ["3d", "sint"],
	36300: ["cube", "sint"],
	36303: ["2d-array", "uint"],
	36306: ["2d", "uint"],
	36307: ["3d", "uint"],
	36308: ["cube", "uint"],
	36311: ["2d-array", "uint"]
};
function Qv(e) {
	let t = Zv[e];
	if (!t) throw Error("sampler");
	let [n, r] = t;
	return {
		viewDimension: n,
		sampleType: r
	};
}
function $v(e) {
	if (e[e.length - 1] !== "]") return {
		name: e,
		length: 1,
		isArray: !1
	};
	let t = /([^[]*)(\[[0-9]+\])?/.exec(e);
	if (!t || t.length < 2) throw Error(`Failed to parse GLSL uniform name ${e}`);
	return {
		name: t[1],
		length: +!!t[2],
		isArray: !!t[2]
	};
}
// node_modules/@luma.gl/webgl/dist/adapter/helpers/set-uniform.js
function ey(e, t, n, r) {
	let i = e, a = r;
	a === !0 && (a = 1), a === !1 && (a = 0);
	let o = typeof a == "number" ? [a] : a;
	switch (n) {
		case 35678:
		case 35680:
		case 35679:
		case 35682:
		case 36289:
		case 36292:
		case 36293:
		case 36298:
		case 36299:
		case 36300:
		case 36303:
		case 36306:
		case 36307:
		case 36308:
		case 36311:
			if (typeof r != "number") throw Error("samplers must be set to integers");
			return e.uniform1i(t, r);
		case 5126: return e.uniform1fv(t, o);
		case 35664: return e.uniform2fv(t, o);
		case 35665: return e.uniform3fv(t, o);
		case 35666: return e.uniform4fv(t, o);
		case 5124: return e.uniform1iv(t, o);
		case 35667: return e.uniform2iv(t, o);
		case 35668: return e.uniform3iv(t, o);
		case 35669: return e.uniform4iv(t, o);
		case 35670: return e.uniform1iv(t, o);
		case 35671: return e.uniform2iv(t, o);
		case 35672: return e.uniform3iv(t, o);
		case 35673: return e.uniform4iv(t, o);
		case 5125: return i.uniform1uiv(t, o, 1);
		case 36294: return i.uniform2uiv(t, o, 2);
		case 36295: return i.uniform3uiv(t, o, 3);
		case 36296: return i.uniform4uiv(t, o, 4);
		case 35674: return e.uniformMatrix2fv(t, !1, o);
		case 35675: return e.uniformMatrix3fv(t, !1, o);
		case 35676: return e.uniformMatrix4fv(t, !1, o);
		case 35685: return i.uniformMatrix2x3fv(t, !1, o);
		case 35686: return i.uniformMatrix2x4fv(t, !1, o);
		case 35687: return i.uniformMatrix3x2fv(t, !1, o);
		case 35688: return i.uniformMatrix3x4fv(t, !1, o);
		case 35689: return i.uniformMatrix4x2fv(t, !1, o);
		case 35690: return i.uniformMatrix4x3fv(t, !1, o);
	}
	throw Error("Illegal uniform");
}
// node_modules/@luma.gl/webgl/dist/utils/split-uniforms-and-bindings.js
function ty(e) {
	return tr(e) !== null || typeof e == "number" || typeof e == "boolean";
}
function ny(e) {
	let t = {
		bindings: {},
		uniforms: {}
	};
	return Object.keys(e).forEach((n) => {
		let r = e[n];
		ty(r) ? t.uniforms[n] = r : t.bindings[n] = r;
	}), t;
}
// node_modules/@luma.gl/webgl/dist/adapter/helpers/webgl-topology-utils.js
function ry(e) {
	switch (e) {
		case "point-list": return 0;
		case "line-list": return 1;
		case "line-strip": return 3;
		case "triangle-list": return 4;
		case "triangle-strip": return 5;
		default: throw Error(e);
	}
}
function iy(e) {
	switch (e) {
		case "point-list": return 0;
		case "line-list": return 1;
		case "line-strip": return 1;
		case "triangle-list": return 4;
		case "triangle-strip": return 4;
		default: throw Error(e);
	}
}
// node_modules/@luma.gl/webgl/dist/adapter/resources/webgl-render-pipeline.js
var ay = 4, oy = class extends Xa {
	device;
	handle;
	vs;
	fs;
	introspectedLayout;
	uniforms = {};
	bindings = {};
	varyings = null;
	_uniformCount = 0;
	_uniformSetters = {};
	constructor(e, t) {
		super(e, t), this.device = e, this.handle = this.props.handle || this.device.gl.createProgram(), this.device.setSpectorMetadata(this.handle, { id: this.props.id }), this.vs = t.vs, this.fs = t.fs;
		let { varyings: n, bufferMode: r = 35981 } = t;
		n && n.length > 0 && (this.varyings = n, this.device.gl.transformFeedbackVaryings(this.handle, n, r)), this._linkShaders(), D.time(1, `RenderPipeline ${this.id} - shaderLayout introspection`)(), this.introspectedLayout = Kv(this.device.gl, this.handle), D.timeEnd(1, `RenderPipeline ${this.id} - shaderLayout introspection`)(), this.shaderLayout = sy(this.introspectedLayout, t.shaderLayout);
	}
	destroy() {
		this.handle && (this.device.gl.deleteProgram(this.handle), this.destroyed = !0);
	}
	setBindings(e, t) {
		for (let [n, r] of Object.entries(e)) {
			let e = this.shaderLayout.bindings.find((e) => e.name === n) || this.shaderLayout.bindings.find((e) => e.name === `${n}Uniforms`);
			if (e) {
				switch (r || D.warn(`Unsetting binding "${n}" in render pipeline "${this.id}"`)(), e.type) {
					case "uniform":
						if (!(r instanceof $_) && !(r.buffer instanceof $_)) throw Error("buffer value");
						break;
					case "texture":
						if (!(r instanceof bv || r instanceof Rv || r instanceof j_)) throw Error("texture value");
						break;
					case "sampler":
						D.warn(`Ignoring sampler ${n}`)();
						break;
					default: throw Error(e.type);
				}
				this.bindings[n] = r;
			} else {
				let e = this.shaderLayout.bindings.map((e) => `"${e.name}"`).join(", ");
				t?.disableWarnings || D.warn(`No binding "${n}" in render pipeline "${this.id}", expected one of ${e}`, r)();
			}
		}
	}
	draw(e) {
		let { renderPass: t, parameters: n = this.props.parameters, topology: r = this.props.topology, vertexArray: i, vertexCount: a, instanceCount: o, isInstanced: s = !1, firstVertex: c = 0, transformFeedback: l } = e, u = ry(r), d = !!i.indexBuffer, f = i.indexBuffer?.glIndexType;
		if (this.linkStatus !== "success") return D.info(2, `RenderPipeline:${this.id}.draw() aborted - waiting for shader linking`)(), !1;
		if (!this._areTexturesRenderable()) return D.info(2, `RenderPipeline:${this.id}.draw() aborted - textures not yet loaded`)(), !1;
		this.device.gl.useProgram(this.handle), i.bindBeforeRender(t), l && l.begin(this.props.topology), this._applyBindings(), this._applyUniforms();
		let p = t;
		return av(this.device, n, p.glParameters, () => {
			d && s ? this.device.gl.drawElementsInstanced(u, a || 0, f, c, o || 0) : d ? this.device.gl.drawElements(u, a || 0, f, c) : s ? this.device.gl.drawArraysInstanced(u, c, a || 0, o || 0) : this.device.gl.drawArrays(u, c, a || 0), l && l.end();
		}), i.unbindAfterRender(t), !0;
	}
	setUniformsWebGL(e) {
		let { bindings: t } = ny(e);
		Object.keys(t).forEach((e) => {
			D.warn(`Unsupported value "${JSON.stringify(t[e])}" used in setUniforms() for key ${e}. Use setBindings() instead?`)();
		}), Object.assign(this.uniforms, e);
	}
	async _linkShaders() {
		let { gl: e } = this.device;
		if (e.attachShader(this.handle, this.vs.handle), e.attachShader(this.handle, this.fs.handle), D.time(ay, `linkProgram for ${this.id}`)(), e.linkProgram(this.handle), D.timeEnd(ay, `linkProgram for ${this.id}`)(), D.level, !this.device.features.has("compilation-status-async-webgl")) {
			let e = this._getLinkStatus();
			this._reportLinkStatus(e);
			return;
		}
		D.once(1, "RenderPipeline linking is asynchronous")(), await this._waitForLinkComplete(), D.info(2, `RenderPipeline ${this.id} - async linking complete: ${this.linkStatus}`)();
		let t = this._getLinkStatus();
		this._reportLinkStatus(t);
	}
	async _reportLinkStatus(e) {
		switch (e) {
			case "success": return;
			default:
				switch (this.vs.compilationStatus) {
					case "error": throw this.vs.debugShader(), Error(`Error during compilation of shader ${this.vs.id}`);
					case "pending": this.vs.asyncCompilationStatus.then(() => this.vs.debugShader());
				}
				switch (this.fs?.compilationStatus) {
					case "error": throw this.fs.debugShader(), Error(`Error during compilation of shader ${this.fs.id}`);
					case "pending": this.fs.asyncCompilationStatus.then(() => this.fs.debugShader());
				}
				let t = this.device.gl.getProgramInfoLog(this.handle);
				throw Error(`Error during ${e}: ${t}`);
		}
	}
	_getLinkStatus() {
		let { gl: e } = this.device;
		return e.getProgramParameter(this.handle, 35714) ? (e.validateProgram(this.handle), e.getProgramParameter(this.handle, 35715) ? (this.linkStatus = "success", "success") : (this.linkStatus = "error", "validation")) : (this.linkStatus = "error", "linking");
	}
	async _waitForLinkComplete() {
		let e = async (e) => await new Promise((t) => setTimeout(t, e));
		if (!this.device.features.has("compilation-status-async-webgl")) {
			await e(10);
			return;
		}
		let { gl: t } = this.device;
		for (;;) {
			if (t.getProgramParameter(this.handle, 37297)) return;
			await e(10);
		}
	}
	_areTexturesRenderable() {
		let e = !0;
		for (let t of this.shaderLayout.bindings) !this.bindings[t.name] && !this.bindings[t.name.replace(/Uniforms$/, "")] && (D.warn(`Binding ${t.name} not found in ${this.id}`)(), e = !1);
		return e;
	}
	_applyBindings() {
		if (this.linkStatus !== "success") return;
		let { gl: e } = this.device;
		e.useProgram(this.handle);
		let t = 0, n = 0;
		for (let r of this.shaderLayout.bindings) {
			let i = this.bindings[r.name] || this.bindings[r.name.replace(/Uniforms$/, "")];
			if (!i) throw Error(`No value for binding ${r.name} in ${this.id}`);
			switch (r.type) {
				case "uniform":
					let { name: a } = r, o = e.getUniformBlockIndex(this.handle, a);
					if (o === 4294967295) throw Error(`Invalid uniform block name ${a}`);
					e.uniformBlockBinding(this.handle, n, o), i instanceof $_ ? e.bindBufferBase(35345, n, i.handle) : e.bindBufferRange(35345, n, i.buffer.handle, i.offset || 0, i.size || i.buffer.byteLength - i.offset), n += 1;
					break;
				case "texture":
					if (!(i instanceof bv || i instanceof Rv || i instanceof j_)) throw Error("texture");
					let s;
					if (i instanceof bv) s = i.texture;
					else if (i instanceof Rv) s = i;
					else if (i instanceof j_ && i.colorAttachments[0] instanceof bv) D.warn("Passing framebuffer in texture binding may be deprecated. Use fbo.colorAttachments[0] instead")(), s = i.colorAttachments[0].texture;
					else throw Error("No texture");
					e.activeTexture(33984 + t), e.bindTexture(s.glTarget, s.handle), t += 1;
					break;
				case "sampler": break;
				case "storage":
				case "read-only-storage": throw Error(`binding type '${r.type}' not supported in WebGL`);
			}
		}
	}
	_applyUniforms() {
		for (let e of this.shaderLayout.uniforms || []) {
			let { name: t, location: n, type: r, textureUnit: i } = e, a = this.uniforms[t] ?? i;
			a !== void 0 && ey(this.device.gl, n, r, a);
		}
	}
};
function sy(e, t) {
	let n = {
		...e,
		attributes: e.attributes.map((e) => ({ ...e }))
	};
	for (let e of t?.attributes || []) {
		let t = n.attributes.find((t) => t.name === e.name);
		t ? (t.type = e.type || t.type, t.stepMode = e.stepMode || t.stepMode) : D.warn(`shader layout attribute ${e.name} not present in shader`);
	}
	return n;
}
// node_modules/@luma.gl/webgl/dist/adapter/resources/webgl-command-buffer.js
var cy = class extends eo {
	device;
	commands = [];
	constructor(e) {
		super(e, {}), this.device = e;
	}
	submitCommands(e = this.commands) {
		for (let t of e) switch (t.name) {
			case "copy-buffer-to-buffer":
				ly(this.device, t.options);
				break;
			case "copy-buffer-to-texture":
				uy(this.device, t.options);
				break;
			case "copy-texture-to-buffer":
				dy(this.device, t.options);
				break;
			case "copy-texture-to-texture":
				fy(this.device, t.options);
				break;
			default: throw Error(t.name);
		}
	}
};
function ly(e, t) {
	let n = t.sourceBuffer, r = t.destinationBuffer;
	e.gl.bindBuffer(36662, n.handle), e.gl.bindBuffer(36663, r.handle), e.gl.copyBufferSubData(36662, 36663, t.sourceOffset ?? 0, t.destinationOffset ?? 0, t.size), e.gl.bindBuffer(36662, null), e.gl.bindBuffer(36663, null);
}
function uy(e, t) {
	throw Error("Not implemented");
}
function dy(e, t) {
	let { sourceTexture: n, mipLevel: r = 0, aspect: i = "all", width: a = t.sourceTexture.width, height: o = t.sourceTexture.height, depthOrArrayLayers: s = 0, origin: c = [0, 0], destinationBuffer: l, byteOffset: u = 0, bytesPerRow: d, rowsPerImage: f } = t;
	if (i !== "all") throw Error("aspect not supported in WebGL");
	if (r !== 0 || s !== 0 || d || f) throw Error("not implemented");
	let { framebuffer: p, destroyFramebuffer: m } = py(n), h;
	try {
		let t = l, n = a || p.width, r = o || p.height, i = w_(p.colorAttachments[0].texture.props.format), s = i.format, d = i.type;
		e.gl.bindBuffer(35051, t.handle), h = e.gl.bindFramebuffer(36160, p.handle), e.gl.readPixels(c[0], c[1], n, r, s, d, u);
	} finally {
		e.gl.bindBuffer(35051, null), h !== void 0 && e.gl.bindFramebuffer(36160, h), m && p.destroy();
	}
}
function fy(e, t) {
	let { sourceTexture: n, destinationMipLevel: r = 0, origin: i = [0, 0], destinationOrigin: a = [0, 0], destinationTexture: o } = t, { width: s = t.destinationTexture.width, height: c = t.destinationTexture.height } = t, { framebuffer: l, destroyFramebuffer: u } = py(n), [d, f] = i, [p, m, h] = a, g = e.gl.bindFramebuffer(36160, l.handle), _ = null, v;
	if (o instanceof Rv) _ = o, s = Number.isFinite(s) ? s : _.width, c = Number.isFinite(c) ? c : _.height, _.bind(0), v = _.glTarget;
	else throw Error("invalid destination");
	switch (v) {
		case 3553:
		case 34067:
			e.gl.copyTexSubImage2D(v, r, p, m, d, f, s, c);
			break;
		case 35866:
		case 32879: e.gl.copyTexSubImage3D(v, r, p, m, h, d, f, s, c);
	}
	_ && _.unbind(), e.gl.bindFramebuffer(36160, g), u && l.destroy();
}
function py(e) {
	if (e instanceof j) {
		let { width: t, height: n, id: r } = e;
		return {
			framebuffer: e.device.createFramebuffer({
				id: `framebuffer-for-${r}`,
				width: t,
				height: n,
				colorAttachments: [e]
			}),
			destroyFramebuffer: !0
		};
	}
	return {
		framebuffer: e,
		destroyFramebuffer: !1
	};
}
// node_modules/@luma.gl/webgl/dist/adapter/resources/webgl-command-encoder.js
var my = class extends $a {
	device;
	commandBuffer;
	constructor(e, t) {
		super(e, t), this.device = e, this.commandBuffer = new cy(e);
	}
	destroy() {}
	finish() {
		this.commandBuffer.submitCommands();
	}
	copyBufferToBuffer(e) {
		this.commandBuffer.commands.push({
			name: "copy-buffer-to-buffer",
			options: e
		});
	}
	copyBufferToTexture(e) {
		this.commandBuffer.commands.push({
			name: "copy-buffer-to-texture",
			options: e
		});
	}
	copyTextureToBuffer(e) {
		this.commandBuffer.commands.push({
			name: "copy-texture-to-buffer",
			options: e
		});
	}
	copyTextureToTexture(e) {
		this.commandBuffer.commands.push({
			name: "copy-texture-to-texture",
			options: e
		});
	}
	pushDebugGroup(e) {}
	popDebugGroup() {}
	insertDebugMarker(e) {}
	resolveQuerySet(e, t, n) {}
};
// node_modules/@luma.gl/webgl/dist/utils/fill-array.js
function hy(e) {
	let { target: t, source: n, start: r = 0, count: i = 1 } = e, a = n.length, o = i * a, s = 0;
	for (let e = r; s < a; s++) t[e++] = n[s];
	for (; s < o;) s < o - s ? (t.copyWithin(r + s, r, r + s), s *= 2) : (t.copyWithin(r + s, r, r + o - s), s = o);
	return e.target;
}
// node_modules/@luma.gl/webgl/dist/adapter/resources/webgl-vertex-array.js
var gy = class e extends ho {
	get [Symbol.toStringTag]() {
		return "VertexArray";
	}
	device;
	handle;
	buffer = null;
	bufferValue = null;
	static isConstantAttributeZeroSupported(e) {
		return v() === "Chrome";
	}
	constructor(e, t) {
		super(e, t), this.device = e, this.handle = this.device.gl.createVertexArray();
	}
	destroy() {
		super.destroy(), this.buffer && this.buffer?.destroy(), this.handle &&= (this.device.gl.deleteVertexArray(this.handle), void 0);
	}
	setIndexBuffer(e) {
		let t = e;
		if (t && t.glTarget !== 34963) throw Error("Use .setBuffer()");
		this.device.gl.bindVertexArray(this.handle), this.device.gl.bindBuffer(34963, t ? t.handle : null), this.indexBuffer = t, this.device.gl.bindVertexArray(null);
	}
	setBuffer(e, t) {
		let n = t;
		if (n.glTarget === 34963) throw Error("Use .setIndexBuffer()");
		let { size: r, type: i, stride: a, offset: o, normalized: s, integer: c, divisor: l } = this._getAccessor(e);
		this.device.gl.bindVertexArray(this.handle), this.device.gl.bindBuffer(34962, n.handle), c ? this.device.gl.vertexAttribIPointer(e, r, i, a, o) : this.device.gl.vertexAttribPointer(e, r, i, s, a, o), this.device.gl.bindBuffer(34962, null), this.device.gl.enableVertexAttribArray(e), this.device.gl.vertexAttribDivisor(e, l || 0), this.attributes[e] = n, this.device.gl.bindVertexArray(null);
	}
	setConstantWebGL(e, t) {
		this._enable(e, !1), this.attributes[e] = t;
	}
	bindBeforeRender() {
		this.device.gl.bindVertexArray(this.handle), this._applyConstantAttributes();
	}
	unbindAfterRender() {
		this.device.gl.bindVertexArray(null);
	}
	_applyConstantAttributes() {
		for (let e = 0; e < this.maxVertexAttributes; ++e) {
			let t = this.attributes[e];
			ArrayBuffer.isView(t) && this.device.setConstantAttributeWebGL(e, t);
		}
	}
	_getAccessor(e) {
		let t = this.attributeInfos[e];
		if (!t) throw Error(`Unknown attribute location ${e}`);
		let n = o_(t.bufferDataType);
		return {
			size: t.bufferComponents,
			type: n,
			stride: t.byteStride,
			offset: t.byteOffset,
			normalized: t.normalized,
			integer: t.integer,
			divisor: +(t.stepMode === "instance")
		};
	}
	_enable(t, n = !0) {
		let r = e.isConstantAttributeZeroSupported(this.device) || t !== 0;
		(n || r) && (t = Number(t), this.device.gl.bindVertexArray(this.handle), n ? this.device.gl.enableVertexAttribArray(t) : this.device.gl.disableVertexAttribArray(t), this.device.gl.bindVertexArray(null));
	}
	getConstantBuffer(e, t) {
		let n = _y(t), r = n.byteLength * e, i = n.length * e;
		if (this.buffer && r !== this.buffer.byteLength) throw Error(`Buffer size is immutable, byte length ${r} !== ${this.buffer.byteLength}.`);
		let a = !this.buffer;
		if (this.buffer = this.buffer || this.device.createBuffer({ byteLength: r }), a ||= !vy(n, this.bufferValue), a) {
			let e = Co(t.constructor, i);
			hy({
				target: e,
				source: n,
				start: 0,
				count: i
			}), this.buffer.write(e), this.bufferValue = t;
		}
		return this.buffer;
	}
};
function _y(e) {
	return Array.isArray(e) ? new Float32Array(e) : e;
}
function vy(e, t) {
	if (!e || !t || e.length !== t.length || e.constructor !== t.constructor) return !1;
	for (let n = 0; n < e.length; ++n) if (e[n] !== t[n]) return !1;
	return !0;
}
// node_modules/@luma.gl/webgl/dist/adapter/resources/webgl-transform-feedback.js
var yy = class extends go {
	device;
	gl;
	handle;
	layout;
	buffers = {};
	unusedBuffers = {};
	bindOnUse = !0;
	_bound = !1;
	constructor(e, t) {
		super(e, t), this.device = e, this.gl = e.gl, this.handle = this.props.handle || this.gl.createTransformFeedback(), this.layout = this.props.layout, t.buffers && this.setBuffers(t.buffers), Object.seal(this);
	}
	destroy() {
		this.gl.deleteTransformFeedback(this.handle), super.destroy();
	}
	begin(e = "point-list") {
		this.gl.bindTransformFeedback(36386, this.handle), this.bindOnUse && this._bindBuffers(), this.gl.beginTransformFeedback(iy(e));
	}
	end() {
		this.gl.endTransformFeedback(), this.bindOnUse && this._unbindBuffers(), this.gl.bindTransformFeedback(36386, null);
	}
	setBuffers(e) {
		this.buffers = {}, this.unusedBuffers = {}, this.bind(() => {
			for (let t in e) this.setBuffer(t, e[t]);
		});
	}
	setBuffer(e, t) {
		let n = this._getVaryingIndex(e), { buffer: r, byteLength: i, byteOffset: a } = this._getBufferRange(t);
		n < 0 ? (this.unusedBuffers[e] = r, D.warn(`${this.id} unusedBuffers varying buffer ${e}`)()) : (this.buffers[n] = {
			buffer: r,
			byteLength: i,
			byteOffset: a
		}, this.bindOnUse || this._bindBuffer(n, r, a, i));
	}
	getBuffer(e) {
		if (by(e)) return this.buffers[e] || null;
		let t = this._getVaryingIndex(e);
		return t >= 0 ? this.buffers[t] : null;
	}
	bind(e = this.handle) {
		if (typeof e != "function") return this.gl.bindTransformFeedback(36386, e), this;
		let t;
		return this._bound ? t = e() : (this.gl.bindTransformFeedback(36386, this.handle), this._bound = !0, t = e(), this._bound = !1, this.gl.bindTransformFeedback(36386, null)), t;
	}
	unbind() {
		this.bind(null);
	}
	_getBufferRange(e) {
		if (e instanceof $_) return {
			buffer: e,
			byteOffset: 0,
			byteLength: e.byteLength
		};
		let { buffer: t, byteOffset: n = 0, byteLength: r = e.buffer.byteLength } = e;
		return {
			buffer: t,
			byteOffset: n,
			byteLength: r
		};
	}
	_getVaryingIndex(e) {
		if (by(e)) return Number(e);
		for (let t of this.layout.varyings) if (e === t.name) return t.location;
		return -1;
	}
	_bindBuffers() {
		for (let e in this.buffers) {
			let { buffer: t, byteLength: n, byteOffset: r } = this._getBufferRange(this.buffers[e]);
			this._bindBuffer(Number(e), t, r, n);
		}
	}
	_unbindBuffers() {
		for (let e in this.buffers) this.gl.bindBufferBase(35982, Number(e), null);
	}
	_bindBuffer(e, t, n = 0, r) {
		let i = t && t.handle;
		!i || r === void 0 ? this.gl.bindBufferBase(35982, e, i) : this.gl.bindBufferRange(35982, e, i, n, r);
	}
};
function by(e) {
	return typeof e == "number" ? Number.isInteger(e) : /^\d+$/.test(e);
}
// node_modules/@luma.gl/webgl/dist/adapter/resources/webgl-query-set.js
var xy = class extends _o {
	device;
	handle;
	target = null;
	_queryPending = !1;
	_pollingPromise = null;
	get [Symbol.toStringTag]() {
		return "Query";
	}
	constructor(e, t) {
		if (super(e, t), this.device = e, t.count > 1) throw Error("WebGL QuerySet can only have one value");
		this.handle = this.device.gl.createQuery(), Object.seal(this);
	}
	destroy() {
		this.device.gl.deleteQuery(this.handle);
	}
	beginTimestampQuery() {
		return this._begin(35007);
	}
	endTimestampQuery() {
		this._end();
	}
	beginOcclusionQuery(e) {
		return this._begin(e?.conservative ? 36202 : 35887);
	}
	endOcclusionQuery() {
		this._end();
	}
	beginTransformFeedbackQuery() {
		return this._begin(35976);
	}
	endTransformFeedbackQuery() {
		this._end();
	}
	async resolveQuery() {
		return [await this.pollQuery()];
	}
	_begin(e) {
		this._queryPending || (this.target = e, this.device.gl.beginQuery(this.target, this.handle));
	}
	_end() {
		this._queryPending || this.target && (this.device.gl.endQuery(this.target), this.target = null, this._queryPending = !0);
	}
	isResultAvailable() {
		if (!this._queryPending) return !1;
		let e = this.device.gl.getQueryParameter(this.handle, 34919);
		return e && (this._queryPending = !1), e;
	}
	isTimerDisjoint() {
		return this.device.gl.getParameter(36795);
	}
	getResult() {
		return this.device.gl.getQueryParameter(this.handle, 34918);
	}
	getTimerMilliseconds() {
		return this.getResult() / 1e6;
	}
	pollQuery(e = Infinity) {
		if (this._pollingPromise) return this._pollingPromise;
		let t = 0;
		return this._pollingPromise = new Promise((n, r) => {
			let i = () => {
				this.isResultAvailable() ? (n(this.getResult()), this._pollingPromise = null) : t++ > e ? (r("Timed out"), this._pollingPromise = null) : requestAnimationFrame(i);
			};
			requestAnimationFrame(i);
		}), this._pollingPromise;
	}
}, Sy = class extends Ca {
	type = "webgl";
	handle;
	features;
	limits;
	info;
	canvasContext;
	lost;
	_resolveContextLost;
	gl;
	debug = !1;
	_canvasSizeInfo = {
		clientWidth: 0,
		clientHeight: 0,
		devicePixelRatio: 1
	};
	_extensions = {};
	_polyfilled = !1;
	spectorJS;
	constructor(e) {
		super({
			...e,
			id: e.id || Q_("webgl-device")
		});
		let t = Ca._getCanvasContextProps(e);
		if (!t) throw Error("WebGLDevice requires props.createCanvasContext to be set");
		let n = t.canvas?.gl?.device;
		if (n) throw Error(`WebGL context already attached to device ${n.id}`);
		this.canvasContext = new P_(this, t), this.lost = new Promise((e) => {
			this._resolveContextLost = e;
		});
		let r = { ...e.webgl };
		t.alphaMode === "premultiplied" && (r.premultipliedAlpha = !0), e.powerPreference !== void 0 && (r.powerPreference = e.powerPreference);
		let i = this.props._handle || e_(this.canvasContext.canvas, {
			onContextLost: (e) => this._resolveContextLost?.({
				reason: "destroyed",
				message: "Entered sleep mode, or too many apps or browser tabs are using the GPU."
			}),
			onContextRestored: (e) => void 0
		}, r);
		if (!i) throw Error("WebGL context creation failed");
		if (n = i.device, n) {
			if (e._reuseDevices) return D.log(1, `Not creating a new Device, instead returning a reference to Device ${n.id} already attached to WebGL context`, n)(), n._reused = !0, n;
			throw Error(`WebGL context already attached to device ${n.id}`);
		}
		this.handle = i, this.gl = i, this.spectorJS = V_({
			...this.props,
			gl: this.handle
		}), this.gl.device = this, this.gl._version = 2, this.info = n_(this.gl, this._extensions), this.limits = new A_(this.gl), this.features = new k_(this.gl, this._extensions, this.props._disabledFeatures), this.props._initializeFeatures && this.features.initializeFeatures(), t.autoResize !== !1 && this.canvasContext.resize(), new Xg(this.gl, { log: (...e) => D.log(1, ...e)() }).trackState(this.gl, { copyState: !1 });
		let a = e.debugWebGL || e.debug, o = e.debugWebGL;
		a && (this.gl = G_(this.gl, {
			debugWebGL: a,
			traceWebGL: o
		}), D.warn("WebGL debug mode activated. Performance reduced.")(), e.debugWebGL && (D.level = Math.max(D.level, 1)));
	}
	destroy() {
		!this.props._reuseDevices && !this._reused && delete this.gl.device;
	}
	get isLost() {
		return this.gl.isContextLost();
	}
	createCanvasContext(e) {
		throw Error("WebGL only supports a single canvas");
	}
	createBuffer(e) {
		let t = this._normalizeBufferProps(e);
		return new $_(this, t);
	}
	createTexture(e) {
		return new Rv(this, e);
	}
	createExternalTexture(e) {
		throw Error("createExternalTexture() not implemented");
	}
	createSampler(e) {
		return new yv(this, e);
	}
	createShader(e) {
		return new iv(this, e);
	}
	createFramebuffer(e) {
		return new j_(this, e);
	}
	createVertexArray(e) {
		return new gy(this, e);
	}
	createTransformFeedback(e) {
		return new yy(this, e);
	}
	createQuerySet(e) {
		return new xy(this, e);
	}
	createRenderPipeline(e) {
		return new oy(this, e);
	}
	beginRenderPass(e) {
		return new Bv(this, e);
	}
	createComputePipeline(e) {
		throw Error("ComputePipeline not supported in WebGL");
	}
	beginComputePass(e) {
		throw Error("ComputePass not supported in WebGL");
	}
	renderPass = null;
	createCommandEncoder(e = {}) {
		return new my(this, e);
	}
	submit() {
		this.renderPass?.end(), this.renderPass = null;
	}
	readPixelsToArrayWebGL(e, t) {
		return Nv(e, t);
	}
	readPixelsToBufferWebGL(e, t) {
		return Pv(e, t);
	}
	setParametersWebGL(e) {
		Gg(this.gl, e);
	}
	getParametersWebGL(e) {
		return Kg(this.gl, e);
	}
	withParametersWebGL(e, t) {
		return Ev(this.gl, e, t);
	}
	resetWebGL() {
		D.warn("WebGLDevice.resetWebGL is deprecated, use only for debugging")(), qg(this.gl);
	}
	_getDeviceSpecificTextureFormatCapabilities(e) {
		return C_(this.gl, e, this._extensions);
	}
	loseDevice() {
		let e = !1, t = this.getExtension("WEBGL_lose_context").WEBGL_lose_context;
		return t && (e = !0, t.loseContext()), this._resolveContextLost?.({
			reason: "destroyed",
			message: "Application triggered context loss"
		}), e;
	}
	pushState() {
		Xg.get(this.gl).push();
	}
	popState() {
		Xg.get(this.gl).pop();
	}
	setSpectorMetadata(e, t) {
		e.__SPECTOR_Metadata = t;
	}
	getGLKey(e, t) {
		let n = Number(e);
		for (let e in this.gl) if (this.gl[e] === n) return `GL.${e}`;
		return t?.emptyIfUnknown ? "" : String(e);
	}
	getGLKeys(e) {
		let t = { emptyIfUnknown: !0 };
		return Object.entries(e).reduce((e, [n, r]) => (e[`${n}:${this.getGLKey(n, t)}`] = `${r}:${this.getGLKey(r, t)}`, e), {});
	}
	_constants;
	setConstantAttributeWebGL(e, t) {
		let n = this.limits.maxVertexAttributes;
		this._constants = this._constants || Array(n).fill(null);
		let r = this._constants[e];
		switch (r && Ey(r, t) && D.info(1, `setConstantAttributeWebGL(${e}) could have been skipped, value unchanged`)(), this._constants[e] = t, t.constructor) {
			case Float32Array:
				Cy(this, e, t);
				break;
			case Int32Array:
				wy(this, e, t);
				break;
			case Uint32Array:
				Ty(this, e, t);
				break;
			default: throw Error("constant");
		}
	}
	getExtension(e) {
		return t_(this.gl, e, this._extensions), this._extensions;
	}
};
function Cy(e, t, n) {
	switch (n.length) {
		case 1:
			e.gl.vertexAttrib1fv(t, n);
			break;
		case 2:
			e.gl.vertexAttrib2fv(t, n);
			break;
		case 3:
			e.gl.vertexAttrib3fv(t, n);
			break;
		case 4: e.gl.vertexAttrib4fv(t, n);
	}
}
function wy(e, t, n) {
	e.gl.vertexAttribI4iv(t, n);
}
function Ty(e, t, n) {
	e.gl.vertexAttribI4uiv(t, n);
}
function Ey(e, t) {
	if (!e || !t || e.length !== t.length || e.constructor !== t.constructor) return !1;
	for (let n = 0; n < e.length; ++n) if (e[n] !== t[n]) return !1;
	return !0;
}
// node_modules/@luma.gl/webgl/dist/context/polyfills/polyfill-webgl1-extensions.js
var Dy = {
	WEBGL_depth_texture: { UNSIGNED_INT_24_8_WEBGL: 34042 },
	OES_element_index_uint: {},
	OES_texture_float: {},
	OES_texture_half_float: { HALF_FLOAT_OES: 5131 },
	EXT_color_buffer_float: {},
	OES_standard_derivatives: { FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 35723 },
	EXT_frag_depth: {},
	EXT_blend_minmax: {
		MIN_EXT: 32775,
		MAX_EXT: 32776
	},
	EXT_shader_texture_lod: {}
}, Oy = (e) => ({
	drawBuffersWEBGL(t) {
		return e.drawBuffers(t);
	},
	COLOR_ATTACHMENT0_WEBGL: 36064,
	COLOR_ATTACHMENT1_WEBGL: 36065,
	COLOR_ATTACHMENT2_WEBGL: 36066,
	COLOR_ATTACHMENT3_WEBGL: 36067
}), ky = (e) => ({
	VERTEX_ARRAY_BINDING_OES: 34229,
	createVertexArrayOES() {
		return e.createVertexArray();
	},
	deleteVertexArrayOES(t) {
		return e.deleteVertexArray(t);
	},
	isVertexArrayOES(t) {
		return e.isVertexArray(t);
	},
	bindVertexArrayOES(t) {
		return e.bindVertexArray(t);
	}
}), Ay = (e) => ({
	VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 35070,
	drawArraysInstancedANGLE(...t) {
		return e.drawArraysInstanced(...t);
	},
	drawElementsInstancedANGLE(...t) {
		return e.drawElementsInstanced(...t);
	},
	vertexAttribDivisorANGLE(...t) {
		return e.vertexAttribDivisor(...t);
	}
});
function jy(e = !0) {
	let t = HTMLCanvasElement.prototype;
	!e && t.originalGetContext ? (t.getContext = t.originalGetContext, t.originalGetContext = void 0) : (t.originalGetContext = t.getContext, t.getContext = function(e, t) {
		if (e === "webgl" || e === "experimental-webgl") {
			let e = this.originalGetContext("webgl2", t);
			return e instanceof HTMLElement && My(e), e;
		}
		return this.originalGetContext(e, t);
	});
}
function My(e) {
	e.getExtension("EXT_color_buffer_float");
	let t = {
		...Dy,
		WEBGL_disjoint_timer_query: e.getExtension("EXT_disjoint_timer_query_webgl2"),
		WEBGL_draw_buffers: Oy(e),
		OES_vertex_array_object: ky(e),
		ANGLE_instanced_arrays: Ay(e)
	}, n = e.getExtension;
	e.getExtension = function(r) {
		return n.call(e, r) || (r in t ? t[r] : null);
	};
	let r = e.getSupportedExtensions;
	e.getSupportedExtensions = function() {
		return (r.apply(e) || [])?.concat(Object.keys(t));
	};
}
// node_modules/@luma.gl/webgl/dist/adapter/webgl-adapter.js
var Ny = 1, Py = class extends Aa {
	type = "webgl";
	constructor() {
		super(), Ca.defaultProps = {
			...Ca.defaultProps,
			...z_
		}, Sy.adapter = this;
	}
	isSupported() {
		return typeof WebGL2RenderingContext < "u";
	}
	enforceWebGL2(e) {
		jy(e);
	}
	async attach(e) {
		if (e instanceof Sy) return e;
		if (e?.device instanceof Ca) return e.device;
		if (!Fy(e)) throw Error("Invalid WebGL2RenderingContext");
		return new Sy({
			_handle: e,
			createCanvasContext: {
				canvas: e.canvas,
				autoResize: !1
			}
		});
	}
	async create(e = {}) {
		D.groupCollapsed(Ny, "WebGLDevice created")();
		let t = [];
		(e.debugWebGL || e.debug) && t.push(W_()), e.debugSpectorJS && t.push(B_(e));
		let n = await Promise.allSettled(t);
		for (let e of n) e.status === "rejected" && D.error(`Failed to initialize debug libraries ${e.reason}`)();
		let r = new Sy(e), i = `\
${r._reused ? "Reusing" : "Created"} device with WebGL2 ${r.debug ? "debug " : ""}context: \
${r.info.vendor}, ${r.info.renderer} for canvas: ${r.canvasContext.id}`;
		return D.probe(Ny, i)(), D.table(Ny, r.info)(), D.groupEnd(Ny)(), r;
	}
};
function Fy(e) {
	return typeof WebGL2RenderingContext < "u" && e instanceof WebGL2RenderingContext || !!(e && Number.isFinite(e._version));
}
var Iy = new Py();
// node_modules/@deck.gl/core/dist/lib/deck.js
function Ly() {}
var Ry = {
	id: "",
	width: "100%",
	height: "100%",
	style: null,
	viewState: null,
	initialViewState: null,
	pickingRadius: 0,
	layerFilter: null,
	parameters: {},
	parent: null,
	device: null,
	deviceProps: {},
	gl: null,
	canvas: null,
	layers: [],
	effects: [],
	views: null,
	controller: null,
	useDevicePixels: !0,
	touchAction: "none",
	eventRecognizerOptions: {},
	_framebuffer: null,
	_animate: !1,
	_pickable: !0,
	_typedArrayManagerProps: {},
	_customRender: null,
	widgets: [],
	onDeviceInitialized: Ly,
	onWebGLInitialized: Ly,
	onResize: Ly,
	onViewStateChange: Ly,
	onInteractionStateChange: Ly,
	onBeforeRender: Ly,
	onAfterRender: Ly,
	onLoad: Ly,
	onError: (e) => E.error(e.message, e.cause)(),
	onHover: null,
	onClick: null,
	onDragStart: null,
	onDrag: null,
	onDragEnd: null,
	_onMetrics: null,
	getCursor: ({ isDragging: e }) => e ? "grabbing" : "grab",
	getTooltip: null,
	debug: !1,
	drawPickingColors: !1
}, zy = class {
	constructor(e) {
		this.width = 0, this.height = 0, this.userData = {}, this.device = null, this.canvas = null, this.viewManager = null, this.layerManager = null, this.effectManager = null, this.deckRenderer = null, this.deckPicker = null, this.eventManager = null, this.widgetManager = null, this.tooltip = null, this.animationLoop = null, this.cursorState = {
			isHovering: !1,
			isDragging: !1
		}, this.stats = new mt({ id: "deck.gl" }), this.metrics = {
			fps: 0,
			setPropsTime: 0,
			updateAttributesTime: 0,
			framesRedrawn: 0,
			pickTime: 0,
			pickCount: 0,
			gpuTime: 0,
			gpuTimePerFrame: 0,
			cpuTime: 0,
			cpuTimePerFrame: 0,
			bufferMemory: 0,
			textureMemory: 0,
			renderbufferMemory: 0,
			gpuMemory: 0
		}, this._metricsCounter = 0, this._needsRedraw = "Initial render", this._pickRequest = {
			mode: "hover",
			x: -1,
			y: -1,
			radius: 0,
			event: null
		}, this._lastPointerDownInfo = null, this._onPointerMove = (e) => {
			let { _pickRequest: t } = this;
			if (e.type === "pointerleave") t.x = -1, t.y = -1, t.radius = 0;
			else if (e.leftButton || e.rightButton) return;
			else {
				let n = e.offsetCenter;
				if (!n) return;
				t.x = n.x, t.y = n.y, t.radius = this.props.pickingRadius;
			}
			this.layerManager && (this.layerManager.context.mousePosition = {
				x: t.x,
				y: t.y
			}), t.event = e;
		}, this._onEvent = (e) => {
			let t = jf[e.type], n = e.offsetCenter;
			if (!t || !n || !this.layerManager) return;
			let r = this.layerManager.getLayers(), i = this.deckPicker.getLastPickedObject({
				x: n.x,
				y: n.y,
				layers: r,
				viewports: this.getViewports(n)
			}, this._lastPointerDownInfo), { layer: a } = i, o = a && (a[t] || a.props[t]), s = this.props[t], c = !1;
			o && (c = o.call(a, i, e)), c || (s?.(i, e), this.widgetManager.onEvent(i, e));
		}, this._onPointerDown = (e) => {
			if (this.device?.type === "webgpu") return;
			let t = e.offsetCenter, n = this._pick("pickObject", "pickObject Time", {
				x: t.x,
				y: t.y,
				radius: this.props.pickingRadius
			});
			this._lastPointerDownInfo = n.result[0] || n.emptyInfo;
		}, this.props = {
			...Ry,
			...e
		}, e = this.props, e.viewState && e.initialViewState && E.warn("View state tracking is disabled. Use either `initialViewState` for auto update or `viewState` for manual update.")(), this.viewState = this.props.initialViewState, e.device && (this.device = e.device);
		let t = this.device;
		!t && e.gl && (e.gl instanceof WebGLRenderingContext && E.error("WebGL1 context not supported.")(), t = Iy.attach(e.gl)), t ||= Oa.createDevice({
			type: "best-available",
			_reuseDevices: !0,
			adapters: [Iy],
			...e.deviceProps,
			createCanvasContext: {
				canvas: this._createCanvas(e),
				useDevicePixels: this.props.useDevicePixels,
				autoResize: !1
			}
		}), this.animationLoop = this._createAnimationLoop(t, e), this.setProps(e), e._typedArrayManagerProps && mm.setOptions(e._typedArrayManagerProps), this.animationLoop.start();
	}
	finalize() {
		this.animationLoop?.stop(), this.animationLoop?.destroy(), this.animationLoop = null, this._lastPointerDownInfo = null, this.layerManager?.finalize(), this.layerManager = null, this.viewManager?.finalize(), this.viewManager = null, this.effectManager?.finalize(), this.effectManager = null, this.deckRenderer?.finalize(), this.deckRenderer = null, this.deckPicker?.finalize(), this.deckPicker = null, this.eventManager?.destroy(), this.eventManager = null, this.widgetManager?.finalize(), this.widgetManager = null, !this.props.canvas && !this.props.device && !this.props.gl && this.canvas && (this.canvas.parentElement?.removeChild(this.canvas), this.canvas = null);
	}
	setProps(e) {
		this.stats.get("setProps Time").timeStart(), "onLayerHover" in e && E.removed("onLayerHover", "onHover")(), "onLayerClick" in e && E.removed("onLayerClick", "onClick")(), e.initialViewState && !Lh(this.props.initialViewState, e.initialViewState, 3) && (this.viewState = e.initialViewState), Object.assign(this.props, e), this._setCanvasSize(this.props);
		let t = Object.create(this.props);
		Object.assign(t, {
			views: this._getViews(),
			width: this.width,
			height: this.height,
			viewState: this._getViewState()
		}), this.animationLoop?.setProps(t), this.layerManager && (this.viewManager.setProps(t), this.layerManager.activateViewport(this.getViewports()[0]), this.layerManager.setProps(t), this.effectManager.setProps(t), this.deckRenderer.setProps(t), this.deckPicker.setProps(t), this.widgetManager.setProps(t)), this.stats.get("setProps Time").timeEnd();
	}
	needsRedraw(e = { clearRedrawFlags: !1 }) {
		if (!this.layerManager) return !1;
		if (this.props._animate) return "Deck._animate";
		let t = this._needsRedraw;
		e.clearRedrawFlags && (this._needsRedraw = !1);
		let n = this.viewManager.needsRedraw(e), r = this.layerManager.needsRedraw(e), i = this.effectManager.needsRedraw(e), a = this.deckRenderer.needsRedraw(e);
		return t = t || n || r || i || a, t;
	}
	redraw(e) {
		if (!this.layerManager) return;
		let t = this.needsRedraw({ clearRedrawFlags: !0 });
		t = e || t, t && (this.stats.get("Redraw Count").incrementCount(), this.props._customRender ? this.props._customRender(t) : this._drawLayers(t));
	}
	get isInitialized() {
		return this.viewManager !== null;
	}
	getViews() {
		return Yh(this.viewManager), this.viewManager.views;
	}
	getViewports(e) {
		return Yh(this.viewManager), this.viewManager.getViewports(e);
	}
	getCanvas() {
		return this.canvas;
	}
	pickObject(e) {
		let t = this._pick("pickObject", "pickObject Time", e).result;
		return t.length ? t[0] : null;
	}
	pickMultipleObjects(e) {
		return e.depth = e.depth || 10, this._pick("pickObject", "pickMultipleObjects Time", e).result;
	}
	pickObjects(e) {
		return this._pick("pickObjects", "pickObjects Time", e);
	}
	_addResources(e, t = !1) {
		for (let n in e) this.layerManager.resourceManager.add({
			resourceId: n,
			data: e[n],
			forceUpdate: t
		});
	}
	_removeResources(e) {
		for (let t of e) this.layerManager.resourceManager.remove(t);
	}
	_addDefaultEffect(e) {
		this.effectManager.addDefaultEffect(e);
	}
	_addDefaultShaderModule(e) {
		this.layerManager.addDefaultShaderModule(e);
	}
	_removeDefaultShaderModule(e) {
		this.layerManager?.removeDefaultShaderModule(e);
	}
	_pick(e, t, n) {
		Yh(this.deckPicker);
		let { stats: r } = this;
		r.get("Pick Count").incrementCount(), r.get(t).timeStart();
		let i = this.deckPicker[e]({
			layers: this.layerManager.getLayers(n),
			views: this.viewManager.getViews(),
			viewports: this.getViewports(n),
			onViewportActive: this.layerManager.activateViewport,
			effects: this.effectManager.getEffects(),
			...n
		});
		return r.get(t).timeEnd(), i;
	}
	_createCanvas(e) {
		let t = e.canvas;
		return typeof t == "string" && (t = document.getElementById(t), Yh(t)), t || (t = document.createElement("canvas"), t.id = e.id || "deckgl-overlay", (e.parent || document.body).appendChild(t)), Object.assign(t.style, e.style), t;
	}
	_setCanvasSize(e) {
		if (!this.canvas) return;
		let { width: t, height: n } = e;
		if (t || t === 0) {
			let e = Number.isFinite(t) ? `${t}px` : t;
			this.canvas.style.width = e;
		}
		if (n || n === 0) {
			let t = Number.isFinite(n) ? `${n}px` : n;
			this.canvas.style.position = e.style?.position || "absolute", this.canvas.style.height = t;
		}
	}
	_updateCanvasSize() {
		let { canvas: e } = this;
		if (!e) return;
		let t = e.clientWidth ?? e.width, n = e.clientHeight ?? e.height;
		(t !== this.width || n !== this.height) && (this.width = t, this.height = n, this.viewManager?.setProps({
			width: t,
			height: n
		}), this.layerManager?.activateViewport(this.getViewports()[0]), this.props.onResize({
			width: t,
			height: n
		}));
	}
	_createAnimationLoop(e, t) {
		let { gl: n, onError: r, useDevicePixels: i } = t;
		return new Um({
			device: e,
			useDevicePixels: i,
			autoResizeDrawingBuffer: !n,
			autoResizeViewport: !1,
			onInitialize: (e) => this._setDevice(e.device),
			onRender: this._onRenderFrame.bind(this),
			onError: r
		});
	}
	_getViewState() {
		return this.props.viewState || this.viewState;
	}
	_getViews() {
		let { views: e } = this.props, t = Array.isArray(e) ? e : e ? [e] : [new dg({ id: "default-view" })];
		return t.length && this.props.controller && (t[0].props.controller = this.props.controller), t;
	}
	_onContextLost() {
		let { onError: e } = this.props;
		this.animationLoop && e && e(/* @__PURE__ */ Error("WebGL context is lost"));
	}
	_pickAndCallback() {
		if (this.device?.type === "webgpu") return;
		let { _pickRequest: e } = this;
		if (e.event) {
			let { result: t, emptyInfo: n } = this._pick("pickObject", "pickObject Time", e);
			this.cursorState.isHovering = t.length > 0;
			let r = n, i = !1;
			for (let n of t) r = n, i = n.layer?.onHover(n, e.event) || i;
			i || (this.props.onHover?.(r, e.event), this.widgetManager.onHover(r, e.event)), e.event = null;
		}
	}
	_updateCursor() {
		let e = this.props.parent || this.canvas;
		e && (e.style.cursor = this.props.getCursor(this.cursorState));
	}
	_setDevice(e) {
		if (this.device = e, !this.animationLoop) return;
		this.canvas ||= this.device.canvasContext?.canvas, this.device.type === "webgl" && this.device.setParametersWebGL({
			blend: !0,
			blendFunc: [
				770,
				771,
				1,
				771
			],
			polygonOffsetFill: !0,
			depthTest: !0,
			depthFunc: 515
		}), this.props.onDeviceInitialized(this.device), this.device.type === "webgl" && this.props.onWebGLInitialized(this.device.gl);
		let t = new Rm();
		t.play(), this.animationLoop.attachTimeline(t), this.eventManager = new Of(this.props.parent || this.canvas, {
			touchAction: this.props.touchAction,
			recognizers: Object.keys(Mf).map((e) => {
				let [t, n, r, i] = Mf[e], a = this.props.eventRecognizerOptions?.[e];
				return {
					recognizer: new t({
						...n,
						...a,
						event: e
					}),
					recognizeWith: r,
					requestFailure: i
				};
			}),
			events: {
				pointerdown: this._onPointerDown,
				pointermove: this._onPointerMove,
				pointerleave: this._onPointerMove
			}
		});
		for (let e in jf) this.eventManager.on(e, this._onEvent);
		this.viewManager = new Rh({
			timeline: t,
			eventManager: this.eventManager,
			onViewStateChange: this._onViewStateChange.bind(this),
			onInteractionStateChange: this._onInteractionStateChange.bind(this),
			views: this._getViews(),
			viewState: this._getViewState(),
			width: this.width,
			height: this.height
		});
		let n = this.viewManager.getViewports()[0];
		this.layerManager = new Ih(this.device, {
			deck: this,
			stats: this.stats,
			viewport: n,
			timeline: t
		}), this.effectManager = new mg({
			deck: this,
			device: this.device
		}), this.deckRenderer = new _g(this.device), this.deckPicker = new Tg(this.device), this.widgetManager = new kg({
			deck: this,
			parentElement: this.canvas?.parentElement
		}), this.widgetManager.addDefault(new jg()), this.setProps(this.props), this._updateCanvasSize(), this.props.onLoad();
	}
	_drawLayers(e, t) {
		let { device: n, gl: r } = this.layerManager.context;
		this.props.onBeforeRender({
			device: n,
			gl: r
		});
		let i = {
			target: this.props._framebuffer,
			layers: this.layerManager.getLayers(),
			viewports: this.viewManager.getViewports(),
			onViewportActive: this.layerManager.activateViewport,
			views: this.viewManager.getViews(),
			pass: "screen",
			effects: this.effectManager.getEffects(),
			...t
		};
		this.deckRenderer?.renderLayers(i), i.pass === "screen" && this.widgetManager.onRedraw({
			viewports: i.viewports,
			layers: i.layers
		}), this.props.onAfterRender({
			device: n,
			gl: r
		});
	}
	_onRenderFrame() {
		this._getFrameStats(), this._metricsCounter++ % 60 == 0 && (this._getMetrics(), this.stats.reset(), E.table(4, this.metrics)(), this.props._onMetrics && this.props._onMetrics(this.metrics)), this._updateCanvasSize(), this._updateCursor(), this.layerManager.updateLayers(), this.device?.type !== "webgpu" && this._pickAndCallback(), this.redraw(), this.viewManager && this.viewManager.updateViewStates();
	}
	_onViewStateChange(e) {
		let t = this.props.onViewStateChange(e) || e.viewState;
		this.viewState && (this.viewState = {
			...this.viewState,
			[e.viewId]: t
		}, this.props.viewState || this.viewManager && this.viewManager.setProps({ viewState: this.viewState }));
	}
	_onInteractionStateChange(e) {
		this.cursorState.isDragging = e.isDragging || !1, this.props.onInteractionStateChange(e);
	}
	_getFrameStats() {
		let { stats: e } = this;
		e.get("frameRate").timeEnd(), e.get("frameRate").timeStart();
		let t = this.animationLoop.stats;
		e.get("GPU Time").addTime(t.get("GPU Time").lastTiming), e.get("CPU Time").addTime(t.get("CPU Time").lastTiming);
	}
	_getMetrics() {
		let { metrics: e, stats: t } = this;
		e.fps = t.get("frameRate").getHz(), e.setPropsTime = t.get("setProps Time").time, e.updateAttributesTime = t.get("Update Attributes").time, e.framesRedrawn = t.get("Redraw Count").count, e.pickTime = t.get("pickObject Time").time + t.get("pickMultipleObjects Time").time + t.get("pickObjects Time").time, e.pickCount = t.get("Pick Count").count, e.gpuTime = t.get("GPU Time").time, e.cpuTime = t.get("CPU Time").time, e.gpuTimePerFrame = t.get("GPU Time").getAverageTime(), e.cpuTimePerFrame = t.get("CPU Time").getAverageTime();
		let n = Oa.stats.get("Memory Usage");
		e.bufferMemory = n.get("Buffer Memory").count, e.textureMemory = n.get("Texture Memory").count, e.renderbufferMemory = n.get("Renderbuffer Memory").count, e.gpuMemory = n.get("GPU Memory").count;
	}
};
zy.defaultProps = Ry, zy.VERSION = Yr;
// node_modules/@deck.gl/core/dist/lib/attribute/gl-utils.js
function By(e) {
	switch (e) {
		case "float64": return Float64Array;
		case "uint8":
		case "unorm8": return Uint8ClampedArray;
		default: return No(e);
	}
}
var Vy = Mo;
function Hy(e, t, n) {
	let r = n === "webgpu" && t.type === "uint8" ? "unorm8" : t.type;
	return {
		attribute: e,
		format: t.size > 1 ? `${r}x${t.size}` : t.type,
		byteOffset: t.offset || 0
	};
}
function Uy(e) {
	return e.stride || e.size * e.bytesPerElement;
}
function Wy(e, t) {
	return e.type === t.type && e.size === t.size && Uy(e) === Uy(t) && (e.offset || 0) === (t.offset || 0);
}
// node_modules/@deck.gl/core/dist/lib/attribute/data-column.js
function Gy(e, t) {
	t.offset && E.removed("shaderAttribute.offset", "vertexOffset, elementOffset")();
	let n = Uy(e), r = t.vertexOffset === void 0 ? e.vertexOffset || 0 : t.vertexOffset, i = t.elementOffset || 0, a = r * n + i * e.bytesPerElement + (e.offset || 0);
	return {
		...t,
		offset: a,
		stride: n
	};
}
function Ky(e, t) {
	let n = Gy(e, t);
	return {
		high: n,
		low: {
			...n,
			offset: n.offset + e.size * 4
		}
	};
}
var qy = class {
	constructor(e, t, n) {
		this._buffer = null, this.device = e, this.id = t.id || "", this.size = t.size || 1;
		let r = t.logicalType || t.type, i = r === "float64", { defaultValue: a } = t;
		a = Number.isFinite(a) ? [a] : a || Array(this.size).fill(0);
		let o;
		o = i ? "float32" : !r && t.isIndexed ? "uint32" : r || "float32";
		let s = By(r || o);
		this.doublePrecision = i, i && t.fp64 === !1 && (s = Float32Array), this.value = null, this.settings = {
			...t,
			defaultType: s,
			defaultValue: a,
			logicalType: r,
			type: o,
			normalized: o.includes("norm"),
			size: this.size,
			bytesPerElement: s.BYTES_PER_ELEMENT
		}, this.state = {
			...n,
			externalBuffer: null,
			bufferAccessor: this.settings,
			allocatedValue: null,
			numInstances: 0,
			bounds: null,
			constant: !1
		};
	}
	get isConstant() {
		return this.state.constant;
	}
	get buffer() {
		return this._buffer;
	}
	get byteOffset() {
		let e = this.getAccessor();
		return e.vertexOffset ? e.vertexOffset * Uy(e) : 0;
	}
	get numInstances() {
		return this.state.numInstances;
	}
	set numInstances(e) {
		this.state.numInstances = e;
	}
	delete() {
		this._buffer &&= (this._buffer.delete(), null), mm.release(this.state.allocatedValue);
	}
	getBuffer() {
		return this.state.constant ? null : this.state.externalBuffer || this._buffer;
	}
	getValue(e = this.id, t = null) {
		let n = {};
		if (this.state.constant) {
			let r = this.value;
			if (t) {
				let i = Gy(this.getAccessor(), t), a = i.offset / r.BYTES_PER_ELEMENT, o = i.size || this.size;
				n[e] = r.subarray(a, a + o);
			} else n[e] = r;
		} else n[e] = this.getBuffer();
		return this.doublePrecision && (this.value instanceof Float64Array ? n[`${e}64Low`] = n[e] : n[`${e}64Low`] = new Float32Array(this.size)), n;
	}
	_getBufferLayout(e = this.id, t = null) {
		let n = this.getAccessor(), r = [], i = {
			name: this.id,
			byteStride: Uy(n),
			attributes: r
		};
		if (this.doublePrecision) {
			let i = Ky(n, t || {});
			r.push(Hy(e, {
				...n,
				...i.high
			}, this.device.type), Hy(`${e}64Low`, {
				...n,
				...i.low
			}, this.device.type));
		} else if (t) {
			let i = Gy(n, t);
			r.push(Hy(e, {
				...n,
				...i
			}, this.device.type));
		} else r.push(Hy(e, n, this.device.type));
		return i;
	}
	setAccessor(e) {
		this.state.bufferAccessor = e;
	}
	getAccessor() {
		return this.state.bufferAccessor;
	}
	getBounds() {
		if (this.state.bounds) return this.state.bounds;
		let e = null;
		if (this.state.constant && this.value) {
			let t = Array.from(this.value);
			e = [t, t];
		} else {
			let { value: t, numInstances: n, size: r } = this, i = n * r;
			if (t && i && t.length >= i) {
				let n = Array(r).fill(Infinity), a = Array(r).fill(-Infinity);
				for (let e = 0; e < i;) for (let i = 0; i < r; i++) {
					let r = t[e++];
					r < n[i] && (n[i] = r), r > a[i] && (a[i] = r);
				}
				e = [n, a];
			}
		}
		return this.state.bounds = e, e;
	}
	setData(e) {
		let { state: t } = this, n;
		n = ArrayBuffer.isView(e) ? { value: e } : e instanceof k ? { buffer: e } : e;
		let r = {
			...this.settings,
			...n
		};
		if (ArrayBuffer.isView(n.value)) {
			if (!n.type) {
				if (this.doublePrecision && n.value instanceof Float64Array) r.type = "float32";
				else {
					let e = Vy(n.value);
					r.type = r.normalized ? e.replace("int", "norm") : e;
				}
			}
			r.bytesPerElement = n.value.BYTES_PER_ELEMENT, r.stride = Uy(r);
		}
		if (t.bounds = null, n.constant) {
			let e = n.value;
			if (e = this._normalizeValue(e, [], 0), this.settings.normalized && (e = this.normalizeConstant(e)), t.constant && this._areValuesEqual(e, this.value)) return !1;
			t.externalBuffer = null, t.constant = !0, this.value = ArrayBuffer.isView(e) ? e : new Float32Array(e);
		} else if (n.buffer) t.externalBuffer = n.buffer, t.constant = !1, this.value = n.value || null;
		else if (n.value) {
			this._checkExternalBuffer(n);
			let e = n.value;
			t.externalBuffer = null, t.constant = !1, this.value = e;
			let { buffer: i } = this, a = Uy(r), o = (r.vertexOffset || 0) * a;
			if (this.doublePrecision && e instanceof Float64Array && (e = Sm(e, r)), this.settings.isIndexed) {
				let t = this.settings.defaultType;
				e.constructor !== t && (e = new t(e));
			}
			let s = e.byteLength + o + a * 2;
			(!i || i.byteLength < s) && (i = this._createBuffer(s)), i.write(e, o);
		}
		return this.setAccessor(r), !0;
	}
	updateSubBuffer(e = {}) {
		this.state.bounds = null;
		let t = this.value, { startOffset: n = 0, endOffset: r } = e;
		this.buffer.write(this.doublePrecision && t instanceof Float64Array ? Sm(t, {
			size: this.size,
			startIndex: n,
			endIndex: r
		}) : t.subarray(n, r), n * t.BYTES_PER_ELEMENT + this.byteOffset);
	}
	allocate(e, t = !1) {
		let { state: n } = this, r = n.allocatedValue, i = mm.allocate(r, e + 1, {
			size: this.size,
			type: this.settings.defaultType,
			copy: t
		});
		this.value = i;
		let { byteOffset: a } = this, { buffer: o } = this;
		return (!o || o.byteLength < i.byteLength + a) && (o = this._createBuffer(i.byteLength + a), t && r && o.write(r instanceof Float64Array ? Sm(r, this) : r, a)), n.allocatedValue = i, n.constant = !1, n.externalBuffer = null, this.setAccessor(this.settings), !0;
	}
	_checkExternalBuffer(e) {
		let { value: t } = e;
		if (!ArrayBuffer.isView(t)) throw Error(`Attribute ${this.id} value is not TypedArray`);
		let n = this.settings.defaultType, r = !1;
		if (this.doublePrecision && (r = t.BYTES_PER_ELEMENT < 4), r) throw Error(`Attribute ${this.id} does not support ${t.constructor.name}`);
		!(t instanceof n) && this.settings.normalized && !("normalized" in e) && E.warn(`Attribute ${this.id} is normalized`)();
	}
	normalizeConstant(e) {
		switch (this.settings.type) {
			case "snorm8": return new Float32Array(e).map((e) => (e + 128) / 255 * 2 - 1);
			case "snorm16": return new Float32Array(e).map((e) => (e + 32768) / 65535 * 2 - 1);
			case "unorm8": return new Float32Array(e).map((e) => e / 255);
			case "unorm16": return new Float32Array(e).map((e) => e / 65535);
			default: return e;
		}
	}
	_normalizeValue(e, t, n) {
		let { defaultValue: r, size: i } = this.settings;
		if (Number.isFinite(e)) return t[n] = e, t;
		if (!e) {
			let e = i;
			for (; --e >= 0;) t[n + e] = r[e];
			return t;
		}
		switch (i) {
			case 4: t[n + 3] = Number.isFinite(e[3]) ? e[3] : r[3];
			case 3: t[n + 2] = Number.isFinite(e[2]) ? e[2] : r[2];
			case 2: t[n + 1] = Number.isFinite(e[1]) ? e[1] : r[1];
			case 1:
				t[n + 0] = Number.isFinite(e[0]) ? e[0] : r[0];
				break;
			default:
				let a = i;
				for (; --a >= 0;) t[n + a] = Number.isFinite(e[a]) ? e[a] : r[a];
		}
		return t;
	}
	_areValuesEqual(e, t) {
		if (!e || !t) return !1;
		let { size: n } = this;
		for (let r = 0; r < n; r++) if (e[r] !== t[r]) return !1;
		return !0;
	}
	_createBuffer(e) {
		this._buffer && this._buffer.destroy();
		let { isIndexed: t, type: n } = this.settings;
		return this._buffer = this.device.createBuffer({
			...this._buffer?.props,
			id: this.id,
			usage: (t ? k.INDEX : k.VERTEX) | k.COPY_DST,
			indexType: t ? n : void 0,
			byteLength: e
		}), this._buffer;
	}
}, Jy = [], Yy = [];
function Xy(e, t = 0, n = Infinity) {
	let r = Jy, i = {
		index: -1,
		data: e,
		target: []
	};
	return e ? typeof e[Symbol.iterator] == "function" ? r = e : e.length > 0 && (Yy.length = e.length, r = Yy) : r = Jy, (t > 0 || Number.isFinite(n)) && (r = (Array.isArray(r) ? r : Array.from(r)).slice(t, n), i.index = t - 1), {
		iterable: r,
		objectInfo: i
	};
}
function Zy(e) {
	return e && e[Symbol.asyncIterator];
}
function Qy(e, t) {
	let { size: n, stride: r, offset: i, startIndices: a, nested: o } = t, s = e.BYTES_PER_ELEMENT, c = r ? r / s : n, l = i ? i / s : 0, u = Math.floor((e.length - l) / c);
	return (t, { index: r, target: i }) => {
		if (!a) {
			let t = r * c + l;
			for (let r = 0; r < n; r++) i[r] = e[t + r];
			return i;
		}
		let s = a[r], d = a[r + 1] || u, f;
		if (o) {
			f = Array(d - s);
			for (let t = s; t < d; t++) {
				let r = t * c + l;
				i = Array(n);
				for (let t = 0; t < n; t++) i[t] = e[r + t];
				f[t - s] = i;
			}
		} else if (c === n) f = e.subarray(s * n + l, d * n + l);
		else {
			f = new e.constructor((d - s) * n);
			let t = 0;
			for (let r = s; r < d; r++) {
				let i = r * c + l;
				for (let r = 0; r < n; r++) f[t++] = e[i + r];
			}
		}
		return f;
	};
}
// node_modules/@deck.gl/core/dist/utils/range.js
var $y = [], eb = [[0, Infinity]];
function tb(e, t) {
	if (e === eb || (t[0] < 0 && (t[0] = 0), t[0] >= t[1])) return e;
	let n = [], r = e.length, i = 0;
	for (let a = 0; a < r; a++) {
		let r = e[a];
		r[1] < t[0] ? (n.push(r), i = a + 1) : r[0] > t[1] ? n.push(r) : t = [Math.min(r[0], t[0]), Math.max(r[1], t[1])];
	}
	return n.splice(i, 0, t), n;
}
// node_modules/@deck.gl/core/dist/lib/attribute/transition-settings.js
var nb = {
	interpolation: {
		duration: 0,
		easing: (e) => e
	},
	spring: {
		stiffness: .05,
		damping: .5
	}
};
function rb(e, t) {
	if (!e) return null;
	Number.isFinite(e) && (e = {
		type: "interpolation",
		duration: e
	});
	let n = e.type || "interpolation";
	return {
		...nb[n],
		...t,
		...e,
		type: n
	};
}
// node_modules/@deck.gl/core/dist/lib/attribute/attribute.js
var ib = class extends qy {
	constructor(e, t) {
		super(e, t, {
			startIndices: null,
			lastExternalBuffer: null,
			binaryValue: null,
			binaryAccessor: null,
			needsUpdate: !0,
			needsRedraw: !1,
			layoutChanged: !1,
			updateRanges: eb
		}), this.constant = !1, this.settings.update = t.update || (t.accessor ? this._autoUpdater : void 0), Object.seal(this.settings), Object.seal(this.state), this._validateAttributeUpdaters();
	}
	get startIndices() {
		return this.state.startIndices;
	}
	set startIndices(e) {
		this.state.startIndices = e;
	}
	needsUpdate() {
		return this.state.needsUpdate;
	}
	needsRedraw({ clearChangedFlags: e = !1 } = {}) {
		let t = this.state.needsRedraw;
		return this.state.needsRedraw = t && !e, t;
	}
	layoutChanged() {
		return this.state.layoutChanged;
	}
	setAccessor(e) {
		var t;
		(t = this.state).layoutChanged || (t.layoutChanged = !Wy(e, this.getAccessor())), super.setAccessor(e);
	}
	getUpdateTriggers() {
		let { accessor: e } = this.settings;
		return [this.id].concat(typeof e != "function" && e || []);
	}
	supportsTransition() {
		return !!this.settings.transition;
	}
	getTransitionSetting(e) {
		if (!e || !this.supportsTransition()) return null;
		let { accessor: t } = this.settings, n = this.settings.transition;
		return rb(Array.isArray(t) ? e[t.find((t) => e[t])] : e[t], n);
	}
	setNeedsUpdate(e = this.id, t) {
		if (this.state.needsUpdate = this.state.needsUpdate || e, this.setNeedsRedraw(e), t) {
			let { startRow: e = 0, endRow: n = Infinity } = t;
			this.state.updateRanges = tb(this.state.updateRanges, [e, n]);
		} else this.state.updateRanges = eb;
	}
	clearNeedsUpdate() {
		this.state.needsUpdate = !1, this.state.updateRanges = $y;
	}
	setNeedsRedraw(e = this.id) {
		this.state.needsRedraw = this.state.needsRedraw || e;
	}
	allocate(e) {
		let { state: t, settings: n } = this;
		return n.noAlloc ? !1 : n.update ? (super.allocate(e, t.updateRanges !== eb), !0) : !1;
	}
	updateBuffer({ numInstances: e, data: t, props: n, context: r }) {
		if (!this.needsUpdate()) return !1;
		let { state: { updateRanges: i }, settings: { update: a, noAlloc: o } } = this, s = !0;
		if (a) {
			for (let [o, s] of i) a.call(r, this, {
				data: t,
				startRow: o,
				endRow: s,
				props: n,
				numInstances: e
			});
			if (this.value) {
				if (this.constant || !this.buffer || this.buffer.byteLength < this.value.byteLength + this.byteOffset) this.setData({
					value: this.value,
					constant: this.constant
				}), this.constant = !1;
				else for (let [t, n] of i) {
					let r = Number.isFinite(t) ? this.getVertexOffset(t) : 0, i = Number.isFinite(n) ? this.getVertexOffset(n) : o || !Number.isFinite(e) ? this.value.length : e * this.size;
					super.updateSubBuffer({
						startOffset: r,
						endOffset: i
					});
				}
			}
			this._checkAttributeArray();
		} else s = !1;
		return this.clearNeedsUpdate(), this.setNeedsRedraw(), s;
	}
	setConstantValue(e) {
		return this.device.type === "webgpu" || e === void 0 || typeof e == "function" ? !1 : (this.setData({
			constant: !0,
			value: e
		}) && this.setNeedsRedraw(), this.clearNeedsUpdate(), !0);
	}
	setExternalBuffer(e) {
		let { state: t } = this;
		return e ? (this.clearNeedsUpdate(), t.lastExternalBuffer === e || (t.lastExternalBuffer = e, this.setNeedsRedraw(), this.setData(e)), !0) : (t.lastExternalBuffer = null, !1);
	}
	setBinaryValue(e, t = null) {
		let { state: n, settings: r } = this;
		if (!e) return n.binaryValue = null, n.binaryAccessor = null, !1;
		if (r.noAlloc) return !1;
		if (n.binaryValue === e) return this.clearNeedsUpdate(), !0;
		if (n.binaryValue = e, this.setNeedsRedraw(), r.transform || t !== this.startIndices) {
			ArrayBuffer.isView(e) && (e = { value: e });
			let i = e;
			Yh(ArrayBuffer.isView(i.value), `invalid ${r.accessor}`);
			let a = !!i.size && i.size !== this.size;
			return n.binaryAccessor = Qy(i.value, {
				size: i.size || this.size,
				stride: i.stride,
				offset: i.offset,
				startIndices: t,
				nested: a
			}), !1;
		}
		return this.clearNeedsUpdate(), this.setData(e), !0;
	}
	getVertexOffset(e) {
		let { startIndices: t } = this;
		return (t ? e < t.length ? t[e] : this.numInstances : e) * this.size;
	}
	getValue() {
		let e = this.settings.shaderAttributes, t = super.getValue();
		if (!e) return t;
		for (let n in e) Object.assign(t, super.getValue(n, e[n]));
		return t;
	}
	getBufferLayout(e) {
		this.state.layoutChanged = !1;
		let t = this.settings.shaderAttributes, n = super._getBufferLayout(), { stepMode: r } = this.settings;
		if (n.stepMode = r === "dynamic" ? e ? e.isInstanced ? "instance" : "vertex" : "instance" : r ?? "vertex", !t) return n;
		for (let e in t) {
			let r = super._getBufferLayout(e, t[e]);
			n.attributes.push(...r.attributes);
		}
		return n;
	}
	_autoUpdater(e, { data: t, startRow: n, endRow: r, props: i, numInstances: a }) {
		if (e.constant && this.context.device.type !== "webgpu") return;
		let { settings: o, state: s, value: c, size: l, startIndices: u } = e, { accessor: d, transform: f } = o, p = s.binaryAccessor || (typeof d == "function" ? d : i[d]);
		typeof p != "function" && (p = () => p), Yh(typeof p == "function", `accessor "${d}" is not a function`);
		let m = e.getVertexOffset(n), { iterable: h, objectInfo: g } = Xy(t, n, r);
		for (let t of h) {
			g.index++;
			let n = p(t, g);
			if (f && (n = f.call(this, n)), u) {
				let t = (g.index < u.length - 1 ? u[g.index + 1] : a) - u[g.index];
				if (n && Array.isArray(n[0])) {
					let t = m;
					for (let r of n) e._normalizeValue(r, c, t), t += l;
				} else n && n.length > l ? c.set(n, m) : (e._normalizeValue(n, g.target, 0), jh({
					target: c,
					source: g.target,
					start: m,
					count: t
				}));
				m += t * l;
			} else e._normalizeValue(n, c, m), m += l;
		}
	}
	_validateAttributeUpdaters() {
		let { settings: e } = this;
		if (!(e.noAlloc || typeof e.update == "function")) throw Error(`Attribute ${this.id} missing update or accessor`);
	}
	_checkAttributeArray() {
		let { value: e } = this, t = Math.min(4, this.size);
		if (e && e.length >= t) {
			let n = !0;
			switch (t) {
				case 4: n &&= Number.isFinite(e[3]);
				case 3: n &&= Number.isFinite(e[2]);
				case 2: n &&= Number.isFinite(e[1]);
				case 1:
					n &&= Number.isFinite(e[0]);
					break;
				default: n = !1;
			}
			if (!n) throw Error(`Illegal attribute generated for ${this.id}`);
		}
	}
};
// node_modules/@deck.gl/core/dist/utils/array-utils.js
function ab(e) {
	let { source: t, target: n, start: r = 0, size: i, getData: a } = e, o = e.end || n.length, s = t.length, c = o - r;
	if (s > c) {
		n.set(t.subarray(0, c), r);
		return;
	}
	if (n.set(t, r), !a) return;
	let l = s;
	for (; l < c;) {
		let e = a(l, t);
		for (let t = 0; t < i; t++) n[r + l] = e[t] || 0, l++;
	}
}
function ob({ source: e, target: t, size: n, getData: r, sourceStartIndices: i, targetStartIndices: a }) {
	if (!i || !a) return ab({
		source: e,
		target: t,
		size: n,
		getData: r
	}), t;
	let o = 0, s = 0, c = r && ((e, t) => r(e + s, t)), l = Math.min(i.length, a.length);
	for (let r = 1; r < l; r++) {
		let l = i[r] * n, u = a[r] * n;
		ab({
			source: e.subarray(o, l),
			target: t,
			start: s,
			end: u,
			size: n,
			getData: c
		}), o = l, s = u;
	}
	return s < t.length && ab({
		source: [],
		target: t,
		start: s,
		size: n,
		getData: c
	}), t;
}
// node_modules/@deck.gl/core/dist/transitions/gpu-transition-utils.js
function sb(e) {
	let { device: t, settings: n, value: r } = e, i = new ib(t, n);
	return i.setData({
		value: r instanceof Float64Array ? /* @__PURE__ */ new Float64Array() : /* @__PURE__ */ new Float32Array(),
		normalized: n.normalized
	}), i;
}
function cb(e) {
	switch (e) {
		case 1: return "float";
		case 2: return "vec2";
		case 3: return "vec3";
		case 4: return "vec4";
		default: throw Error(`No defined attribute type for size "${e}"`);
	}
}
function lb(e) {
	switch (e) {
		case 1: return "float32";
		case 2: return "float32x2";
		case 3: return "float32x3";
		case 4: return "float32x4";
		default: throw Error("invalid type size");
	}
}
function ub(e) {
	e.push(e.shift());
}
function db(e, t) {
	let { doublePrecision: n, settings: r, value: i, size: a } = e, o = n && i instanceof Float64Array ? 2 : 1, s = 0, { shaderAttributes: c } = e.settings;
	if (c) for (let e of Object.values(c)) s = Math.max(s, e.vertexOffset ?? 0);
	return (r.noAlloc ? i.length : (t + s) * a) * o;
}
function fb({ device: e, source: t, target: n }) {
	return (!n || n.byteLength < t.byteLength) && (n?.destroy(), n = e.createBuffer({
		byteLength: t.byteLength,
		usage: t.usage
	})), n;
}
function pb({ device: e, buffer: t, attribute: n, fromLength: r, toLength: i, fromStartIndices: a, getData: o = (e) => e }) {
	let s = n.doublePrecision && n.value instanceof Float64Array ? 2 : 1, c = n.size * s, l = n.byteOffset, u = n.settings.bytesPerElement < 4 ? l / n.settings.bytesPerElement * 4 : l, d = n.startIndices, f = a && d, p = n.isConstant;
	if (!f && t && r >= i) return t;
	let m = n.value instanceof Float64Array ? Float32Array : n.value.constructor, h = p ? n.value : new m(n.getBuffer().readSyncWebGL(l, i * m.BYTES_PER_ELEMENT).buffer);
	if (n.settings.normalized && !p) {
		let e = o;
		o = (t, r) => n.normalizeConstant(e(t, r));
	}
	let g = p ? (e, t) => o(h, t) : (e, t) => o(h.subarray(e + l, e + l + c), t), _ = t ? new Float32Array(t.readSyncWebGL(u, r * 4).buffer) : /* @__PURE__ */ new Float32Array(), v = new Float32Array(i);
	return ob({
		source: _,
		target: v,
		sourceStartIndices: a,
		targetStartIndices: d,
		size: c,
		getData: g
	}), (!t || t.byteLength < v.byteLength + u) && (t?.destroy(), t = e.createBuffer({
		byteLength: v.byteLength + u,
		usage: 35050
	})), t.write(v, u), t;
}
// node_modules/@deck.gl/core/dist/transitions/gpu-transition.js
var mb = class {
	constructor({ device: e, attribute: t, timeline: n }) {
		this.buffers = [], this.currentLength = 0, this.device = e, this.transition = new Uh(n), this.attribute = t, this.attributeInTransition = sb(t), this.currentStartIndices = t.startIndices;
	}
	get inProgress() {
		return this.transition.inProgress;
	}
	start(e, t, n = Infinity) {
		this.settings = e, this.currentStartIndices = this.attribute.startIndices, this.currentLength = db(this.attribute, t), this.transition.start({
			...e,
			duration: n
		});
	}
	update() {
		let e = this.transition.update();
		return e && this.onUpdate(), e;
	}
	setBuffer(e) {
		this.attributeInTransition.setData({
			buffer: e,
			normalized: this.attribute.settings.normalized,
			value: this.attributeInTransition.value
		});
	}
	cancel() {
		this.transition.cancel();
	}
	delete() {
		this.cancel();
		for (let e of this.buffers) e.destroy();
		this.buffers.length = 0;
	}
}, hb = class extends mb {
	constructor({ device: e, attribute: t, timeline: n }) {
		super({
			device: e,
			attribute: t,
			timeline: n
		}), this.type = "interpolation", this.transform = bb(e, t);
	}
	start(e, t) {
		let n = this.currentLength, r = this.currentStartIndices;
		if (super.start(e, t, e.duration), e.duration <= 0) {
			this.transition.cancel();
			return;
		}
		let { buffers: i, attribute: a } = this;
		ub(i), i[0] = pb({
			device: this.device,
			buffer: i[0],
			attribute: a,
			fromLength: n,
			toLength: this.currentLength,
			fromStartIndices: r,
			getData: e.enter
		}), i[1] = fb({
			device: this.device,
			source: i[0],
			target: i[1]
		}), this.setBuffer(i[1]);
		let { transform: o } = this, s = o.model, c = Math.floor(this.currentLength / a.size);
		yb(a) && (c /= 2), s.setVertexCount(c), a.isConstant ? (s.setAttributes({ aFrom: i[0] }), s.setConstantAttributes({ aTo: a.value })) : s.setAttributes({
			aFrom: i[0],
			aTo: a.getBuffer()
		}), o.transformFeedback.setBuffers({ vCurrent: i[1] });
	}
	onUpdate() {
		let { duration: e, easing: t } = this.settings, { time: n } = this.transition, r = n / e;
		t && (r = t(r));
		let { model: i } = this.transform, a = { time: r };
		i.shaderInputs.setProps({ interpolation: a }), this.transform.run({ discard: !0 });
	}
	delete() {
		super.delete(), this.transform.destroy();
	}
}, gb = {
	name: "interpolation",
	vs: "uniform interpolationUniforms {\n  float time;\n} interpolation;\n",
	uniformTypes: { time: "f32" }
}, _b = "#version 300 es\n#define SHADER_NAME interpolation-transition-vertex-shader\n\nin ATTRIBUTE_TYPE aFrom;\nin ATTRIBUTE_TYPE aTo;\nout ATTRIBUTE_TYPE vCurrent;\n\nvoid main(void) {\n  vCurrent = mix(aFrom, aTo, interpolation.time);\n  gl_Position = vec4(0.0);\n}\n", vb = "#version 300 es\n#define SHADER_NAME interpolation-transition-vertex-shader\n\nin ATTRIBUTE_TYPE aFrom;\nin ATTRIBUTE_TYPE aFrom64Low;\nin ATTRIBUTE_TYPE aTo;\nin ATTRIBUTE_TYPE aTo64Low;\nout ATTRIBUTE_TYPE vCurrent;\nout ATTRIBUTE_TYPE vCurrent64Low;\n\nvec2 mix_fp64(vec2 a, vec2 b, float x) {\n  vec2 range = sub_fp64(b, a);\n  return sum_fp64(a, mul_fp64(range, vec2(x, 0.0)));\n}\n\nvoid main(void) {\n  for (int i=0; i<ATTRIBUTE_SIZE; i++) {\n    vec2 value = mix_fp64(vec2(aFrom[i], aFrom64Low[i]), vec2(aTo[i], aTo64Low[i]), interpolation.time);\n    vCurrent[i] = value.x;\n    vCurrent64Low[i] = value.y;\n  }\n  gl_Position = vec4(0.0);\n}\n";
function yb(e) {
	return e.doublePrecision && e.value instanceof Float64Array;
}
function bb(e, t) {
	let n = t.size, r = cb(n), i = lb(n), a = t.getBufferLayout();
	return yb(t) ? new gh(e, {
		vs: vb,
		bufferLayout: [{
			name: "aFrom",
			byteStride: 8 * n,
			attributes: [{
				attribute: "aFrom",
				format: i,
				byteOffset: 0
			}, {
				attribute: "aFrom64Low",
				format: i,
				byteOffset: 4 * n
			}]
		}, {
			name: "aTo",
			byteStride: 8 * n,
			attributes: [{
				attribute: "aTo",
				format: i,
				byteOffset: 0
			}, {
				attribute: "aTo64Low",
				format: i,
				byteOffset: 4 * n
			}]
		}],
		modules: [wu, gb],
		defines: {
			ATTRIBUTE_TYPE: r,
			ATTRIBUTE_SIZE: n
		},
		moduleSettings: {},
		varyings: ["vCurrent", "vCurrent64Low"],
		bufferMode: 35980,
		disableWarnings: !0
	}) : new gh(e, {
		vs: _b,
		bufferLayout: [{
			name: "aFrom",
			format: i
		}, {
			name: "aTo",
			format: a.attributes[0].format
		}],
		modules: [gb],
		defines: { ATTRIBUTE_TYPE: r },
		varyings: ["vCurrent"],
		disableWarnings: !0
	});
}
// node_modules/@deck.gl/core/dist/transitions/gpu-spring-transition.js
var xb = class extends mb {
	constructor({ device: e, attribute: t, timeline: n }) {
		super({
			device: e,
			attribute: t,
			timeline: n
		}), this.type = "spring", this.texture = Eb(e), this.framebuffer = Db(e, this.texture), this.transform = Tb(e, t);
	}
	start(e, t) {
		let n = this.currentLength, r = this.currentStartIndices;
		super.start(e, t);
		let { buffers: i, attribute: a } = this;
		for (let t = 0; t < 2; t++) i[t] = pb({
			device: this.device,
			buffer: i[t],
			attribute: a,
			fromLength: n,
			toLength: this.currentLength,
			fromStartIndices: r,
			getData: e.enter
		});
		i[2] = fb({
			device: this.device,
			source: i[0],
			target: i[2]
		}), this.setBuffer(i[1]);
		let { model: o } = this.transform;
		o.setVertexCount(Math.floor(this.currentLength / a.size)), a.isConstant ? o.setConstantAttributes({ aTo: a.value }) : o.setAttributes({ aTo: a.getBuffer() });
	}
	onUpdate() {
		let { buffers: e, transform: t, framebuffer: n, transition: r } = this, i = this.settings;
		t.model.setAttributes({
			aPrev: e[0],
			aCur: e[1]
		}), t.transformFeedback.setBuffers({ vNext: e[2] });
		let a = {
			stiffness: i.stiffness,
			damping: i.damping
		};
		t.model.shaderInputs.setProps({ spring: a }), t.run({
			framebuffer: n,
			discard: !1,
			parameters: { viewport: [
				0,
				0,
				1,
				1
			] },
			clearColor: [
				0,
				0,
				0,
				0
			]
		}), ub(e), this.setBuffer(e[1]), this.device.readPixelsToArrayWebGL(n)[0] > 0 || r.end();
	}
	delete() {
		super.delete(), this.transform.destroy(), this.texture.destroy(), this.framebuffer.destroy();
	}
}, Sb = {
	name: "spring",
	vs: "uniform springUniforms {\n  float damping;\n  float stiffness;\n} spring;\n",
	uniformTypes: {
		damping: "f32",
		stiffness: "f32"
	}
}, Cb = "#version 300 es\n#define SHADER_NAME spring-transition-vertex-shader\n\n#define EPSILON 0.00001\n\nin ATTRIBUTE_TYPE aPrev;\nin ATTRIBUTE_TYPE aCur;\nin ATTRIBUTE_TYPE aTo;\nout ATTRIBUTE_TYPE vNext;\nout float vIsTransitioningFlag;\n\nATTRIBUTE_TYPE getNextValue(ATTRIBUTE_TYPE cur, ATTRIBUTE_TYPE prev, ATTRIBUTE_TYPE dest) {\n  ATTRIBUTE_TYPE velocity = cur - prev;\n  ATTRIBUTE_TYPE delta = dest - cur;\n  ATTRIBUTE_TYPE force = delta * spring.stiffness;\n  ATTRIBUTE_TYPE resistance = velocity * spring.damping;\n  return force - resistance + velocity + cur;\n}\n\nvoid main(void) {\n  bool isTransitioning = length(aCur - aPrev) > EPSILON || length(aTo - aCur) > EPSILON;\n  vIsTransitioningFlag = isTransitioning ? 1.0 : 0.0;\n\n  vNext = getNextValue(aCur, aPrev, aTo);\n  gl_Position = vec4(0, 0, 0, 1);\n  gl_PointSize = 100.0;\n}\n", wb = "#version 300 es\n#define SHADER_NAME spring-transition-is-transitioning-fragment-shader\n\nin float vIsTransitioningFlag;\n\nout vec4 fragColor;\n\nvoid main(void) {\n  if (vIsTransitioningFlag == 0.0) {\n    discard;\n  }\n  fragColor = vec4(1.0);\n}";
function Tb(e, t) {
	let n = cb(t.size), r = lb(t.size);
	return new gh(e, {
		vs: Cb,
		fs: wb,
		bufferLayout: [
			{
				name: "aPrev",
				format: r
			},
			{
				name: "aCur",
				format: r
			},
			{
				name: "aTo",
				format: t.getBufferLayout().attributes[0].format
			}
		],
		varyings: ["vNext"],
		modules: [Sb],
		defines: { ATTRIBUTE_TYPE: n },
		parameters: {
			depthCompare: "always",
			blendColorOperation: "max",
			blendColorSrcFactor: "one",
			blendColorDstFactor: "one",
			blendAlphaOperation: "max",
			blendAlphaSrcFactor: "one",
			blendAlphaDstFactor: "one"
		}
	});
}
function Eb(e) {
	return e.createTexture({
		data: /* @__PURE__ */ new Uint8Array(4),
		format: "rgba8unorm",
		mipmaps: !1,
		width: 1,
		height: 1
	});
}
function Db(e, t) {
	return e.createFramebuffer({
		id: "spring-transition-is-transitioning-framebuffer",
		width: 1,
		height: 1,
		colorAttachments: [t]
	});
}
// node_modules/@deck.gl/core/dist/lib/attribute/attribute-transition-manager.js
var Ob = {
	interpolation: hb,
	spring: xb
}, kb = class {
	constructor(e, { id: t, timeline: n }) {
		if (!e) throw Error("AttributeTransitionManager is constructed without device");
		this.id = t, this.device = e, this.timeline = n, this.transitions = {}, this.needsRedraw = !1, this.numInstances = 1;
	}
	finalize() {
		for (let e in this.transitions) this._removeTransition(e);
	}
	update({ attributes: e, transitions: t, numInstances: n }) {
		this.numInstances = n || 1;
		for (let n in e) {
			let r = e[n], i = r.getTransitionSetting(t);
			i && this._updateAttribute(n, r, i);
		}
		for (let n in this.transitions) {
			let r = e[n];
			r && r.getTransitionSetting(t) || this._removeTransition(n);
		}
	}
	hasAttribute(e) {
		let t = this.transitions[e];
		return t && t.inProgress;
	}
	getAttributes() {
		let e = {};
		for (let t in this.transitions) {
			let n = this.transitions[t];
			n.inProgress && (e[t] = n.attributeInTransition);
		}
		return e;
	}
	run() {
		if (this.numInstances === 0) return !1;
		for (let e in this.transitions) this.transitions[e].update() && (this.needsRedraw = !0);
		let e = this.needsRedraw;
		return this.needsRedraw = !1, e;
	}
	_removeTransition(e) {
		this.transitions[e].delete(), delete this.transitions[e];
	}
	_updateAttribute(e, t, n) {
		let r = this.transitions[e], i = !r || r.type !== n.type;
		if (i) {
			r && this._removeTransition(e);
			let a = Ob[n.type];
			a ? this.transitions[e] = new a({
				attribute: t,
				timeline: this.timeline,
				device: this.device
			}) : (E.error(`unsupported transition type '${n.type}'`)(), i = !1);
		}
		(i || t.needsRedraw()) && (this.needsRedraw = !0, this.transitions[e].start(n, this.numInstances));
	}
}, Ab = "attributeManager.invalidate", jb = "attributeManager.updateStart", Mb = "attributeManager.updateEnd", Nb = "attribute.updateStart", Pb = "attribute.allocate", Fb = "attribute.updateEnd", Ib = class {
	constructor(e, { id: t = "attribute-manager", stats: n, timeline: r } = {}) {
		this.mergeBoundsMemoized = Pf(Cm), this.id = t, this.device = e, this.attributes = {}, this.updateTriggers = {}, this.needsRedraw = !0, this.userData = {}, this.stats = n, this.attributeTransitionManager = new kb(e, {
			id: `${t}-transitions`,
			timeline: r
		}), Object.seal(this);
	}
	finalize() {
		for (let e in this.attributes) this.attributes[e].delete();
		this.attributeTransitionManager.finalize();
	}
	getNeedsRedraw(e = { clearRedrawFlags: !1 }) {
		let t = this.needsRedraw;
		return this.needsRedraw = this.needsRedraw && !e.clearRedrawFlags, t && this.id;
	}
	setNeedsRedraw() {
		this.needsRedraw = !0;
	}
	add(e) {
		this._add(e);
	}
	addInstanced(e) {
		this._add(e, { stepMode: "instance" });
	}
	remove(e) {
		for (let t of e) this.attributes[t] !== void 0 && (this.attributes[t].delete(), delete this.attributes[t]);
	}
	invalidate(e, t) {
		let n = this._invalidateTrigger(e, t);
		Gr(Ab, this, e, n);
	}
	invalidateAll(e) {
		for (let t in this.attributes) this.attributes[t].setNeedsUpdate(t, e);
		Gr(Ab, this, "all");
	}
	update({ data: e, numInstances: t, startIndices: n = null, transitions: r, props: i = {}, buffers: a = {}, context: o = {} }) {
		let s = !1;
		Gr(jb, this), this.stats && this.stats.get("Update Attributes").timeStart();
		for (let r in this.attributes) {
			let c = this.attributes[r], l = c.settings.accessor;
			c.startIndices = n, c.numInstances = t, i[r] && E.removed(`props.${r}`, `data.attributes.${r}`)(), c.setExternalBuffer(a[r]) || c.setBinaryValue(typeof l == "string" ? a[l] : void 0, e.startIndices) || typeof l == "string" && !a[l] && c.setConstantValue(i[l]) || c.needsUpdate() && (s = !0, this._updateAttribute({
				attribute: c,
				numInstances: t,
				data: e,
				props: i,
				context: o
			})), this.needsRedraw = this.needsRedraw || c.needsRedraw();
		}
		s && Gr(Mb, this, t), this.stats && this.stats.get("Update Attributes").timeEnd(), this.attributeTransitionManager.update({
			attributes: this.attributes,
			numInstances: t,
			transitions: r
		});
	}
	updateTransition() {
		let { attributeTransitionManager: e } = this, t = e.run();
		return this.needsRedraw = this.needsRedraw || t, t;
	}
	getAttributes() {
		return {
			...this.attributes,
			...this.attributeTransitionManager.getAttributes()
		};
	}
	getBounds(e) {
		let t = e.map((e) => this.attributes[e]?.getBounds());
		return this.mergeBoundsMemoized(t);
	}
	getChangedAttributes(e = { clearChangedFlags: !1 }) {
		let { attributes: t, attributeTransitionManager: n } = this, r = { ...n.getAttributes() };
		for (let i in t) {
			let a = t[i];
			a.needsRedraw(e) && !n.hasAttribute(i) && (r[i] = a);
		}
		return r;
	}
	getBufferLayouts(e) {
		return Object.values(this.getAttributes()).map((t) => t.getBufferLayout(e));
	}
	_add(e, t) {
		for (let n in e) {
			let r = e[n], i = {
				...r,
				id: n,
				size: r.isIndexed && 1 || r.size || 1,
				...t
			};
			this.attributes[n] = new ib(this.device, i);
		}
		this._mapUpdateTriggersToAttributes();
	}
	_mapUpdateTriggersToAttributes() {
		let e = {};
		for (let t in this.attributes) this.attributes[t].getUpdateTriggers().forEach((n) => {
			e[n] || (e[n] = []), e[n].push(t);
		});
		this.updateTriggers = e;
	}
	_invalidateTrigger(e, t) {
		let { attributes: n, updateTriggers: r } = this, i = r[e];
		return i && i.forEach((e) => {
			let r = n[e];
			r && r.setNeedsUpdate(r.id, t);
		}), i;
	}
	_updateAttribute(e) {
		let { attribute: t, numInstances: n } = e;
		Gr(Nb, t), t.constant ? t.setConstantValue(t.value) : (t.allocate(n) && Gr(Pb, t, n), t.updateBuffer(e) && (this.needsRedraw = !0, Gr(Fb, t, n)));
	}
}, Lb = class extends Uh {
	get value() {
		return this._value;
	}
	_onUpdate() {
		let { time: e, settings: { fromValue: t, toValue: n, duration: r, easing: i } } = this, a = i(e / r);
		this._value = rl(t, n, a);
	}
}, Rb = 1e-5;
function zb(e, t, n, r, i) {
	let a = t - e;
	return (n - t) * i + -a * r + a + t;
}
function Bb(e, t, n, r, i) {
	if (Array.isArray(n)) {
		let a = [];
		for (let o = 0; o < n.length; o++) a[o] = zb(e[o], t[o], n[o], r, i);
		return a;
	}
	return zb(e, t, n, r, i);
}
function Vb(e, t) {
	if (Array.isArray(e)) {
		let n = 0;
		for (let r = 0; r < e.length; r++) {
			let i = e[r] - t[r];
			n += i * i;
		}
		return Math.sqrt(n);
	}
	return Math.abs(e - t);
}
// node_modules/@deck.gl/core/dist/lib/uniform-transition-manager.js
var Hb = {
	interpolation: Lb,
	spring: class extends Uh {
		get value() {
			return this._currValue;
		}
		_onUpdate() {
			let { fromValue: e, toValue: t, damping: n, stiffness: r } = this.settings, { _prevValue: i = e, _currValue: a = e } = this, o = Bb(i, a, t, n, r), s = Vb(o, t), c = Vb(o, a);
			s < Rb && c < Rb && (o = t, this.end()), this._prevValue = a, this._currValue = o;
		}
	}
}, Ub = class {
	constructor(e) {
		this.transitions = /* @__PURE__ */ new Map(), this.timeline = e;
	}
	get active() {
		return this.transitions.size > 0;
	}
	add(e, t, n, r) {
		let { transitions: i } = this;
		if (i.has(e)) {
			let n = i.get(e), { value: r = n.settings.fromValue } = n;
			t = r, this.remove(e);
		}
		if (r = rb(r), !r) return;
		let a = Hb[r.type];
		if (!a) {
			E.error(`unsupported transition type '${r.type}'`)();
			return;
		}
		let o = new a(this.timeline);
		o.start({
			...r,
			fromValue: t,
			toValue: n
		}), i.set(e, o);
	}
	remove(e) {
		let { transitions: t } = this;
		t.has(e) && (t.get(e).cancel(), t.delete(e));
	}
	update() {
		let e = {};
		for (let [t, n] of this.transitions) n.update(), e[t] = n.value, n.inProgress || this.remove(t);
		return e;
	}
	clear() {
		for (let e of this.transitions.keys()) this.remove(e);
	}
};
// node_modules/@deck.gl/core/dist/lifecycle/props.js
function Wb(e) {
	let t = e[wh];
	for (let n in t) {
		let r = t[n], { validate: i } = r;
		if (i && !i(e[n], r)) throw Error(`Invalid prop ${n}: ${e[n]}`);
	}
}
function Gb(e, t) {
	let n = qb({
		newProps: e,
		oldProps: t,
		propTypes: e[wh],
		ignoreProps: {
			data: null,
			updateTriggers: null,
			extensions: null,
			transitions: null
		}
	}), r = Yb(e, t), i = !1;
	return r || (i = Xb(e, t)), {
		dataChanged: r,
		propsChanged: n,
		updateTriggersChanged: i,
		extensionsChanged: Zb(e, t),
		transitionsChanged: Kb(e, t)
	};
}
function Kb(e, t) {
	if (!e.transitions) return !1;
	let n = {}, r = e[wh], i = !1;
	for (let a in e.transitions) {
		let o = r[a], s = o && o.type;
		(s === "number" || s === "color" || s === "array") && Jb(e[a], t[a], o) && (n[a] = !0, i = !0);
	}
	return i ? n : !1;
}
function qb({ newProps: e, oldProps: t, ignoreProps: n = {}, propTypes: r = {}, triggerName: i = "props" }) {
	if (t === e) return !1;
	if (typeof e != "object" || !e || typeof t != "object" || !t) return `${i} changed shallowly`;
	for (let a of Object.keys(e)) if (!(a in n)) {
		if (!(a in t)) return `${i}.${a} added`;
		let n = Jb(e[a], t[a], r[a]);
		if (n) return `${i}.${a} ${n}`;
	}
	for (let a of Object.keys(t)) if (!(a in n)) {
		if (!(a in e)) return `${i}.${a} dropped`;
		if (!Object.hasOwnProperty.call(e, a)) {
			let n = Jb(e[a], t[a], r[a]);
			if (n) return `${i}.${a} ${n}`;
		}
	}
	return !1;
}
function Jb(e, t, n) {
	let r = n && n.equal;
	return r && !r(e, t, n) || !r && (r = e && t && e.equals, r && !r.call(e, t)) ? "changed deeply" : !r && t !== e ? "changed shallowly" : null;
}
function Yb(e, t) {
	if (t === null) return "oldProps is null, initial diff";
	let n = !1, { dataComparator: r, _dataDiff: i } = e;
	return r ? r(e.data, t.data) || (n = "Data comparator detected a change") : e.data !== t.data && (n = "A new data container was supplied"), n && i && (n = i(e.data, t.data) || n), n;
}
function Xb(e, t) {
	if (t === null || "all" in e.updateTriggers && Qb(e, t, "all")) return { all: !0 };
	let n = {}, r = !1;
	for (let i in e.updateTriggers) i !== "all" && Qb(e, t, i) && (n[i] = !0, r = !0);
	return r ? n : !1;
}
function Zb(e, t) {
	if (t === null) return !0;
	let n = t.extensions, { extensions: r } = e;
	if (r === n) return !1;
	if (!n || !r || r.length !== n.length) return !0;
	for (let e = 0; e < r.length; e++) if (!r[e].equals(n[e])) return !0;
	return !1;
}
function Qb(e, t, n) {
	let r = e.updateTriggers[n];
	r ??= {};
	let i = t.updateTriggers[n];
	return i ??= {}, qb({
		oldProps: i,
		newProps: r,
		triggerName: n
	});
}
// node_modules/@deck.gl/core/dist/utils/count.js
var $b = "count(): argument not an object", ex = "count(): argument not a container";
function tx(e) {
	if (!rx(e)) throw Error($b);
	if (typeof e.count == "function") return e.count();
	if (Number.isFinite(e.size)) return e.size;
	if (Number.isFinite(e.length)) return e.length;
	if (nx(e)) return Object.keys(e).length;
	throw Error(ex);
}
function nx(e) {
	return typeof e == "object" && !!e && e.constructor === Object;
}
function rx(e) {
	return typeof e == "object" && !!e;
}
// node_modules/@deck.gl/core/dist/utils/shader.js
function ix(e, t) {
	if (!t) return e;
	let n = {
		...e,
		...t
	};
	if ("defines" in t && (n.defines = {
		...e.defines,
		...t.defines
	}), "modules" in t && (n.modules = (e.modules || []).concat(t.modules), t.modules.some((e) => e.name === "project64"))) {
		let e = n.modules.findIndex((e) => e.name === "project32");
		e >= 0 && n.modules.splice(e, 1);
	}
	if ("inject" in t) {
		if (!e.inject) n.inject = t.inject;
		else {
			let r = { ...e.inject };
			for (let e in t.inject) r[e] = (r[e] || "") + t.inject[e];
			n.inject = r;
		}
	}
	return n;
}
// node_modules/@deck.gl/core/dist/utils/texture.js
var ax = {
	minFilter: "linear",
	mipmapFilter: "linear",
	magFilter: "linear",
	addressModeU: "clamp-to-edge",
	addressModeV: "clamp-to-edge"
}, ox = {};
function sx(e, t, n, r) {
	if (n instanceof j) return n;
	n.constructor && n.constructor.name !== "Object" && (n = { data: n });
	let i = null;
	n.compressed && (i = {
		minFilter: "linear",
		mipmapFilter: n.data.length > 1 ? "nearest" : "linear"
	});
	let a = t.createTexture({
		...n,
		sampler: {
			...ax,
			...i,
			...r
		},
		mipmaps: !0
	});
	return ox[a.id] = e, a;
}
function cx(e, t) {
	t && t instanceof j && ox[t.id] === e && (t.delete(), delete ox[t.id]);
}
// node_modules/@deck.gl/core/dist/lifecycle/prop-types.js
var lx = {
	boolean: {
		validate(e, t) {
			return !0;
		},
		equal(e, t, n) {
			return !!e == !!t;
		}
	},
	number: { validate(e, t) {
		return Number.isFinite(e) && (!("max" in t) || e <= t.max) && (!("min" in t) || e >= t.min);
	} },
	color: {
		validate(e, t) {
			return t.optional && !e || px(e) && (e.length === 3 || e.length === 4);
		},
		equal(e, t, n) {
			return Lh(e, t, 1);
		}
	},
	accessor: {
		validate(e, t) {
			let n = mx(e);
			return n === "function" || n === mx(t.value);
		},
		equal(e, t, n) {
			return typeof t == "function" || Lh(e, t, 1);
		}
	},
	array: {
		validate(e, t) {
			return t.optional && !e || px(e);
		},
		equal(e, t, n) {
			let { compare: r } = n;
			return r ? Lh(e, t, Number.isInteger(r) ? r : +!!r) : e === t;
		}
	},
	object: { equal(e, t, n) {
		if (n.ignore) return !0;
		let { compare: r } = n;
		return r ? Lh(e, t, Number.isInteger(r) ? r : +!!r) : e === t;
	} },
	function: {
		validate(e, t) {
			return t.optional && !e || typeof e == "function";
		},
		equal(e, t, n) {
			return !n.compare && n.ignore !== !1 || e === t;
		}
	},
	data: { transform: (e, t, n) => {
		if (!e) return e;
		let { dataTransform: r } = n.props;
		return r ? r(e) : typeof e.shape == "string" && e.shape.endsWith("-table") && Array.isArray(e.data) ? e.data : e;
	} },
	image: {
		transform: (e, t, n) => {
			let r = n.context;
			return !r || !r.device ? null : sx(n.id, r.device, e, {
				...t.parameters,
				...n.props.textureParameters
			});
		},
		release: (e, t, n) => {
			cx(n.id, e);
		}
	}
};
function ux(e) {
	let t = {}, n = {}, r = {};
	for (let [i, a] of Object.entries(e)) {
		let e = a?.deprecatedFor;
		if (e) r[i] = Array.isArray(e) ? e : [e];
		else {
			let e = dx(i, a);
			t[i] = e, n[i] = e.value;
		}
	}
	return {
		propTypes: t,
		defaultProps: n,
		deprecatedProps: r
	};
}
function dx(e, t) {
	switch (mx(t)) {
		case "object": return fx(e, t);
		case "array": return fx(e, {
			type: "array",
			value: t,
			compare: !1
		});
		case "boolean": return fx(e, {
			type: "boolean",
			value: t
		});
		case "number": return fx(e, {
			type: "number",
			value: t
		});
		case "function": return fx(e, {
			type: "function",
			value: t,
			compare: !0
		});
		default: return {
			name: e,
			type: "unknown",
			value: t
		};
	}
}
function fx(e, t) {
	return "type" in t ? {
		name: e,
		...lx[t.type],
		...t
	} : "value" in t ? {
		name: e,
		type: mx(t.value),
		...t
	} : {
		name: e,
		type: "object",
		value: t
	};
}
function px(e) {
	return Array.isArray(e) || ArrayBuffer.isView(e);
}
function mx(e) {
	return px(e) ? "array" : e === null ? "null" : typeof e;
}
// node_modules/@deck.gl/core/dist/lifecycle/create-props.js
function hx(e, t) {
	let n;
	for (let e = t.length - 1; e >= 0; e--) {
		let r = t[e];
		"extensions" in r && (n = r.extensions);
	}
	let r = _x(e.constructor, n), i = Object.create(r);
	i[Ch] = e, i[Dh] = {}, i[Oh] = {};
	for (let e = 0; e < t.length; ++e) {
		let n = t[e];
		for (let e in n) i[e] = n[e];
	}
	return Object.freeze(i), i;
}
var gx = "_mergedDefaultProps";
function _x(e, t) {
	if (!(e instanceof Dx.constructor)) return {};
	let n = gx;
	if (t) for (let e of t) {
		let t = e.constructor;
		t && (n += `:${t.extensionName || t.name}`);
	}
	return wx(e, n) || (e[n] = vx(e, t || []));
}
function vx(e, t) {
	if (!e.prototype) return null;
	let n = _x(Object.getPrototypeOf(e)), r = ux(wx(e, "defaultProps") || {}), i = Object.assign(Object.create(null), n, r.defaultProps), a = Object.assign(Object.create(null), n?.[wh], r.propTypes), o = Object.assign(Object.create(null), n?.[Th], r.deprecatedProps);
	for (let e of t) {
		let t = _x(e.constructor);
		t && (Object.assign(i, t), Object.assign(a, t[wh]), Object.assign(o, t[Th]));
	}
	return yx(i, e), xx(i, a), bx(i, o), i[wh] = a, i[Th] = o, t.length === 0 && !Cx(e, "_propTypes") && (e._propTypes = a), i;
}
function yx(e, t) {
	let n = Tx(t);
	Object.defineProperties(e, { id: {
		writable: !0,
		value: n
	} });
}
function bx(e, t) {
	for (let n in t) Object.defineProperty(e, n, {
		enumerable: !1,
		set(e) {
			let r = `${this.id}: ${n}`;
			for (let r of t[n]) Cx(this, r) || (this[r] = e);
			E.deprecated(r, t[n].join("/"))();
		}
	});
}
function xx(e, t) {
	let n = {}, r = {};
	for (let e in t) {
		let i = t[e], { name: a, value: o } = i;
		i.async && (n[a] = o, r[a] = Sx(a));
	}
	e[Eh] = n, e[Dh] = {}, Object.defineProperties(e, r);
}
function Sx(e) {
	return {
		enumerable: !0,
		set(t) {
			typeof t == "string" || t instanceof Promise || Zy(t) ? this[Dh][e] = t : this[Oh][e] = t;
		},
		get() {
			if (this[Oh]) {
				if (e in this[Oh]) return this[Oh][e] || this[Eh][e];
				if (e in this[Dh]) {
					let t = this[Ch] && this[Ch].internalState;
					if (t && t.hasAsyncProp(e)) return t.getAsyncProp(e) || this[Eh][e];
				}
			}
			return this[Eh][e];
		}
	};
}
function Cx(e, t) {
	return Object.prototype.hasOwnProperty.call(e, t);
}
function wx(e, t) {
	return Cx(e, t) && e[t];
}
function Tx(e) {
	let t = e.componentName;
	return t || E.warn(`${e.name}.componentName not specified`)(), t || e.name;
}
// node_modules/@deck.gl/core/dist/lifecycle/component.js
var Ex = 0, Dx = class {
	constructor(...e) {
		this.props = hx(this, e), this.id = this.props.id, this.count = Ex++;
	}
	clone(e) {
		let { props: t } = this, n = {};
		for (let e in t[Eh]) e in t[Oh] ? n[e] = t[Oh][e] : e in t[Dh] && (n[e] = t[Dh][e]);
		return new this.constructor({
			...t,
			...n,
			...e
		});
	}
};
Dx.componentName = "Component", Dx.defaultProps = {};
// node_modules/@deck.gl/core/dist/lifecycle/component-state.js
var Ox = Object.freeze({}), kx = class {
	constructor(e) {
		this.component = e, this.asyncProps = {}, this.onAsyncPropUpdated = () => {}, this.oldProps = null, this.oldAsyncProps = null;
	}
	finalize() {
		for (let e in this.asyncProps) {
			let t = this.asyncProps[e];
			t && t.type && t.type.release && t.type.release(t.resolvedValue, t.type, this.component);
		}
		this.asyncProps = {}, this.component = null, this.resetOldProps();
	}
	getOldProps() {
		return this.oldAsyncProps || this.oldProps || Ox;
	}
	resetOldProps() {
		this.oldAsyncProps = null, this.oldProps = this.component ? this.component.props : null;
	}
	hasAsyncProp(e) {
		return e in this.asyncProps;
	}
	getAsyncProp(e) {
		let t = this.asyncProps[e];
		return t && t.resolvedValue;
	}
	isAsyncPropLoading(e) {
		if (e) {
			let t = this.asyncProps[e];
			return !!(t && t.pendingLoadCount > 0 && t.pendingLoadCount !== t.resolvedLoadCount);
		}
		for (let e in this.asyncProps) if (this.isAsyncPropLoading(e)) return !0;
		return !1;
	}
	reloadAsyncProp(e, t) {
		this._watchPromise(e, Promise.resolve(t));
	}
	setAsyncProps(e) {
		this.component = e[Ch] || this.component;
		let t = e[Oh] || {}, n = e[Dh] || e, r = e[Eh] || {};
		for (let e in t) {
			let n = t[e];
			this._createAsyncPropData(e, r[e]), this._updateAsyncProp(e, n), t[e] = this.getAsyncProp(e);
		}
		for (let e in n) {
			let t = n[e];
			this._createAsyncPropData(e, r[e]), this._updateAsyncProp(e, t);
		}
	}
	_fetch(e, t) {
		return null;
	}
	_onResolve(e, t) {}
	_onError(e, t) {}
	_updateAsyncProp(e, t) {
		this._didAsyncInputValueChange(e, t) && (typeof t == "string" && (t = this._fetch(e, t)), t instanceof Promise ? this._watchPromise(e, t) : Zy(t) ? this._resolveAsyncIterable(e, t) : this._setPropValue(e, t));
	}
	_freezeAsyncOldProps() {
		if (!this.oldAsyncProps && this.oldProps) {
			this.oldAsyncProps = Object.create(this.oldProps);
			for (let e in this.asyncProps) Object.defineProperty(this.oldAsyncProps, e, {
				enumerable: !0,
				value: this.oldProps[e]
			});
		}
	}
	_didAsyncInputValueChange(e, t) {
		let n = this.asyncProps[e];
		return t === n.resolvedValue || t === n.lastValue ? !1 : (n.lastValue = t, !0);
	}
	_setPropValue(e, t) {
		this._freezeAsyncOldProps();
		let n = this.asyncProps[e];
		n && (t = this._postProcessValue(n, t), n.resolvedValue = t, n.pendingLoadCount++, n.resolvedLoadCount = n.pendingLoadCount);
	}
	_setAsyncPropValue(e, t, n) {
		let r = this.asyncProps[e];
		r && n >= r.resolvedLoadCount && t !== void 0 && (this._freezeAsyncOldProps(), r.resolvedValue = t, r.resolvedLoadCount = n, this.onAsyncPropUpdated(e, t));
	}
	_watchPromise(e, t) {
		let n = this.asyncProps[e];
		if (n) {
			n.pendingLoadCount++;
			let r = n.pendingLoadCount;
			t.then((t) => {
				this.component && (t = this._postProcessValue(n, t), this._setAsyncPropValue(e, t, r), this._onResolve(e, t));
			}).catch((t) => {
				this._onError(e, t);
			});
		}
	}
	async _resolveAsyncIterable(e, t) {
		if (e !== "data") {
			this._setPropValue(e, t);
			return;
		}
		let n = this.asyncProps[e];
		if (!n) return;
		n.pendingLoadCount++;
		let r = n.pendingLoadCount, i = [], a = 0;
		for await (let n of t) {
			if (!this.component) return;
			let { dataTransform: t } = this.component.props;
			i = t ? t(n, i) : i.concat(n), Object.defineProperty(i, "__diff", {
				enumerable: !1,
				value: [{
					startRow: a,
					endRow: i.length
				}]
			}), a = i.length, this._setAsyncPropValue(e, i, r);
		}
		this._onResolve(e, i);
	}
	_postProcessValue(e, t) {
		let n = e.type;
		return n && this.component && (n.release && n.release(e.resolvedValue, n, this.component), n.transform) ? n.transform(t, n, this.component) : t;
	}
	_createAsyncPropData(e, t) {
		if (!this.asyncProps[e]) {
			let n = this.component && this.component.props[wh];
			this.asyncProps[e] = {
				type: n && n[e],
				lastValue: null,
				resolvedValue: t,
				pendingLoadCount: 0,
				resolvedLoadCount: 0
			};
		}
	}
}, Ax = class extends kx {
	constructor({ attributeManager: e, layer: t }) {
		super(t), this.attributeManager = e, this.needsRedraw = !0, this.needsUpdate = !0, this.subLayers = null, this.usesPickingColorCache = !1;
	}
	get layer() {
		return this.component;
	}
	_fetch(e, t) {
		let n = this.layer, r = n?.props.fetch;
		return r ? r(t, {
			propName: e,
			layer: n
		}) : super._fetch(e, t);
	}
	_onResolve(e, t) {
		let n = this.layer;
		if (n) {
			let r = n.props.onDataLoad;
			e === "data" && r && r(t, {
				propName: e,
				layer: n
			});
		}
	}
	_onError(e, t) {
		let n = this.layer;
		n && n.raiseError(t, `loading ${e} of ${this.layer}`);
	}
}, jx = "layer.changeFlag", Mx = "layer.initialize", Nx = "layer.update", Px = "layer.finalize", Fx = "layer.matched", Ix = 2 ** 24 - 1, Lx = Object.freeze([]), Rx = Pf(({ oldViewport: e, viewport: t }) => e.equals(t)), zx = /* @__PURE__ */ new Uint8ClampedArray(), Bx = {
	data: {
		type: "data",
		value: Lx,
		async: !0
	},
	dataComparator: {
		type: "function",
		value: null,
		optional: !0
	},
	_dataDiff: {
		type: "function",
		value: (e) => e && e.__diff,
		optional: !0
	},
	dataTransform: {
		type: "function",
		value: null,
		optional: !0
	},
	onDataLoad: {
		type: "function",
		value: null,
		optional: !0
	},
	onError: {
		type: "function",
		value: null,
		optional: !0
	},
	fetch: {
		type: "function",
		value: (e, { propName: t, layer: n, loaders: r, loadOptions: i, signal: a }) => {
			let { resourceManager: o } = n.context;
			i ||= n.getLoadOptions(), r ||= n.props.loaders, a && (i = {
				...i,
				fetch: {
					...i?.fetch,
					signal: a
				}
			});
			let s = o.contains(e);
			return !s && !i && (o.add({
				resourceId: e,
				data: nr(e, r),
				persistent: !1
			}), s = !0), s ? o.subscribe({
				resourceId: e,
				onChange: (e) => n.internalState?.reloadAsyncProp(t, e),
				consumerId: n.id,
				requestId: t
			}) : nr(e, r, i);
		}
	},
	updateTriggers: {},
	visible: !0,
	pickable: !1,
	opacity: {
		type: "number",
		min: 0,
		max: 1,
		value: 1
	},
	operation: "draw",
	onHover: {
		type: "function",
		value: null,
		optional: !0
	},
	onClick: {
		type: "function",
		value: null,
		optional: !0
	},
	onDragStart: {
		type: "function",
		value: null,
		optional: !0
	},
	onDrag: {
		type: "function",
		value: null,
		optional: !0
	},
	onDragEnd: {
		type: "function",
		value: null,
		optional: !0
	},
	coordinateSystem: Z.DEFAULT,
	coordinateOrigin: {
		type: "array",
		value: [
			0,
			0,
			0
		],
		compare: !0
	},
	modelMatrix: {
		type: "array",
		value: null,
		compare: !0,
		optional: !0
	},
	wrapLongitude: !1,
	positionFormat: "XYZ",
	colorFormat: "RGBA",
	parameters: {
		type: "object",
		value: {},
		optional: !0,
		compare: 2
	},
	loadOptions: {
		type: "object",
		value: null,
		optional: !0,
		ignore: !0
	},
	transitions: null,
	extensions: [],
	loaders: {
		type: "array",
		value: [],
		optional: !0,
		ignore: !0
	},
	getPolygonOffset: {
		type: "function",
		value: ({ layerIndex: e }) => [0, -e * 100]
	},
	highlightedObjectIndex: null,
	autoHighlight: !1,
	highlightColor: {
		type: "accessor",
		value: [
			0,
			0,
			128,
			128
		]
	}
}, Vx = class extends Dx {
	constructor() {
		super(...arguments), this.internalState = null, this.lifecycle = Sh.NO_STATE, this.parent = null;
	}
	static get componentName() {
		return Object.prototype.hasOwnProperty.call(this, "layerName") ? this.layerName : "";
	}
	get root() {
		let e = this;
		for (; e.parent;) e = e.parent;
		return e;
	}
	toString() {
		return `${this.constructor.layerName || this.constructor.name}({id: '${this.props.id}'})`;
	}
	project(e) {
		Yh(this.internalState);
		let t = this.internalState.viewport || this.context.viewport, [n, r, i] = Cp(Pm(e, {
			viewport: t,
			modelMatrix: this.props.modelMatrix,
			coordinateOrigin: this.props.coordinateOrigin,
			coordinateSystem: this.props.coordinateSystem
		}), t.pixelProjectionMatrix);
		return e.length === 2 ? [n, r] : [
			n,
			r,
			i
		];
	}
	unproject(e) {
		return Yh(this.internalState), (this.internalState.viewport || this.context.viewport).unproject(e);
	}
	projectPosition(e, t) {
		return Yh(this.internalState), Fm(e, {
			viewport: this.internalState.viewport || this.context.viewport,
			modelMatrix: this.props.modelMatrix,
			coordinateOrigin: this.props.coordinateOrigin,
			coordinateSystem: this.props.coordinateSystem,
			...t
		});
	}
	get isComposite() {
		return !1;
	}
	get isDrawable() {
		return !0;
	}
	setState(e) {
		this.setChangeFlags({ stateChanged: !0 }), Object.assign(this.state, e), this.setNeedsRedraw();
	}
	setNeedsRedraw() {
		this.internalState && (this.internalState.needsRedraw = !0);
	}
	setNeedsUpdate() {
		this.internalState && (this.context.layerManager.setNeedsUpdate(String(this)), this.internalState.needsUpdate = !0);
	}
	get isLoaded() {
		return this.internalState ? !this.internalState.isAsyncPropLoading() : !1;
	}
	get wrapLongitude() {
		return this.props.wrapLongitude;
	}
	isPickable() {
		return this.props.pickable && this.props.visible;
	}
	getModels() {
		let e = this.state;
		return e && (e.models || e.model && [e.model]) || [];
	}
	setShaderModuleProps(...e) {
		for (let t of this.getModels()) t.shaderInputs.setProps(...e);
	}
	getAttributeManager() {
		return this.internalState && this.internalState.attributeManager;
	}
	getCurrentLayer() {
		return this.internalState && this.internalState.layer;
	}
	getLoadOptions() {
		return this.props.loadOptions;
	}
	use64bitPositions() {
		let { coordinateSystem: e } = this.props;
		return e === Z.DEFAULT || e === Z.LNGLAT || e === Z.CARTESIAN;
	}
	onHover(e, t) {
		return this.props.onHover && this.props.onHover(e, t) || !1;
	}
	onClick(e, t) {
		return this.props.onClick && this.props.onClick(e, t) || !1;
	}
	nullPickingColor() {
		return [
			0,
			0,
			0
		];
	}
	encodePickingColor(e, t = []) {
		return t[0] = e + 1 & 255, t[1] = e + 1 >> 8 & 255, t[2] = e + 1 >> 8 >> 8 & 255, t;
	}
	decodePickingColor(e) {
		Yh(e instanceof Uint8Array);
		let [t, n, r] = e;
		return t + n * 256 + r * 65536 - 1;
	}
	getNumInstances() {
		return Number.isFinite(this.props.numInstances) ? this.props.numInstances : this.state && this.state.numInstances !== void 0 ? this.state.numInstances : tx(this.props.data);
	}
	getStartIndices() {
		return this.props.startIndices ? this.props.startIndices : this.state && this.state.startIndices ? this.state.startIndices : null;
	}
	getBounds() {
		return this.getAttributeManager()?.getBounds(["positions", "instancePositions"]);
	}
	getShaders(e) {
		e = ix(e, {
			disableWarnings: !0,
			modules: this.context.defaultShaderModules
		});
		for (let t of this.props.extensions) e = ix(e, t.getShaders.call(this, t));
		return e;
	}
	shouldUpdateState(e) {
		return e.changeFlags.propsOrDataChanged;
	}
	updateState(e) {
		let t = this.getAttributeManager(), { dataChanged: n } = e.changeFlags;
		if (n && t) {
			if (Array.isArray(n)) for (let e of n) t.invalidateAll(e);
			else t.invalidateAll();
		}
		if (t) {
			let { props: n } = e, r = this.internalState.hasPickingBuffer, i = Number.isInteger(n.highlightedObjectIndex) || n.pickable || n.extensions.some((e) => e.getNeedsPickingBuffer.call(this, e));
			if (r !== i) {
				this.internalState.hasPickingBuffer = i;
				let { pickingColors: e, instancePickingColors: n } = t.attributes, r = e || n;
				r && (i && r.constant && (r.constant = !1, t.invalidate(r.id)), !r.value && !i && (r.constant = !0, r.value = [
					0,
					0,
					0
				]));
			}
		}
	}
	finalizeState(e) {
		for (let e of this.getModels()) e.destroy();
		let t = this.getAttributeManager();
		t && t.finalize(), this.context && this.context.resourceManager.unsubscribe({ consumerId: this.id }), this.internalState && (this.internalState.uniformTransitions.clear(), this.internalState.finalize());
	}
	draw(e) {
		for (let t of this.getModels()) t.draw(e.renderPass);
	}
	getPickingInfo({ info: e, mode: t, sourceLayer: n }) {
		let { index: r } = e;
		return r >= 0 && Array.isArray(this.props.data) && (e.object = this.props.data[r]), e;
	}
	raiseError(e, t) {
		t && (e = Error(`${t}: ${e.message}`, { cause: e })), this.props.onError?.(e) || this.context?.onError?.(e, this);
	}
	getNeedsRedraw(e = { clearRedrawFlags: !1 }) {
		return this._getNeedsRedraw(e);
	}
	needsUpdate() {
		return this.internalState ? this.internalState.needsUpdate || this.hasUniformTransition() || this.shouldUpdateState(this._getUpdateParams()) : !1;
	}
	hasUniformTransition() {
		return this.internalState?.uniformTransitions.active || !1;
	}
	activateViewport(e) {
		if (!this.internalState) return;
		let t = this.internalState.viewport;
		this.internalState.viewport = e, t && Rx({
			oldViewport: t,
			viewport: e
		}) || (this.setChangeFlags({ viewportChanged: !0 }), this.isComposite ? this.needsUpdate() && this.setNeedsUpdate() : this._update());
	}
	invalidateAttribute(e = "all") {
		let t = this.getAttributeManager();
		t && (e === "all" ? t.invalidateAll() : t.invalidate(e));
	}
	updateAttributes(e) {
		let t = !1;
		for (let n in e) e[n].layoutChanged() && (t = !0);
		for (let n of this.getModels()) this._setModelAttributes(n, e, t);
	}
	_updateAttributes() {
		let e = this.getAttributeManager();
		if (!e) return;
		let t = this.props, n = this.getNumInstances(), r = this.getStartIndices();
		e.update({
			data: t.data,
			numInstances: n,
			startIndices: r,
			props: t,
			transitions: t.transitions,
			buffers: t.data.attributes,
			context: this
		});
		let i = e.getChangedAttributes({ clearChangedFlags: !0 });
		this.updateAttributes(i);
	}
	_updateAttributeTransition() {
		let e = this.getAttributeManager();
		e && e.updateTransition();
	}
	_updateUniformTransition() {
		let { uniformTransitions: e } = this.internalState;
		if (e.active) {
			let t = e.update(), n = Object.create(this.props);
			for (let e in t) Object.defineProperty(n, e, { value: t[e] });
			return n;
		}
		return this.props;
	}
	calculateInstancePickingColors(e, { numInstances: t }) {
		if (e.constant) return;
		let n = Math.floor(zx.length / 4);
		if (this.internalState.usesPickingColorCache = !0, n < t) {
			t > Ix && E.warn("Layer has too many data objects. Picking might not be able to distinguish all objects.")(), zx = mm.allocate(zx, t, {
				size: 4,
				copy: !0,
				maxCount: Math.max(t, Ix)
			});
			let e = Math.floor(zx.length / 4), r = [
				0,
				0,
				0
			];
			for (let t = n; t < e; t++) this.encodePickingColor(t, r), zx[t * 4 + 0] = r[0], zx[t * 4 + 1] = r[1], zx[t * 4 + 2] = r[2], zx[t * 4 + 3] = 0;
		}
		e.value = zx.subarray(0, t * 4);
	}
	_setModelAttributes(e, t, n = !1) {
		if (!Object.keys(t).length) return;
		if (n) {
			let n = this.getAttributeManager();
			e.setBufferLayout(n.getBufferLayouts(e)), t = n.getAttributes();
		}
		let r = e.userData?.excludeAttributes || {}, i = {}, a = {};
		for (let n in t) {
			if (r[n]) continue;
			let o = t[n].getValue();
			for (let r in o) {
				let s = o[r];
				s instanceof k ? t[n].settings.isIndexed ? e.setIndexBuffer(s) : i[r] = s : s && (a[r] = s);
			}
		}
		e.setAttributes(i), e.setConstantAttributes(a);
	}
	disablePickingIndex(e) {
		let t = this.props.data;
		if (!("attributes" in t)) {
			this._disablePickingIndex(e);
			return;
		}
		let { pickingColors: n, instancePickingColors: r } = this.getAttributeManager().attributes, i = n || r, a = i && t.attributes && t.attributes[i.id];
		if (a && a.value) {
			let n = a.value, r = this.encodePickingColor(e);
			for (let e = 0; e < t.length; e++) {
				let t = i.getVertexOffset(e);
				n[t] === r[0] && n[t + 1] === r[1] && n[t + 2] === r[2] && this._disablePickingIndex(e);
			}
		} else this._disablePickingIndex(e);
	}
	_disablePickingIndex(e) {
		let { pickingColors: t, instancePickingColors: n } = this.getAttributeManager().attributes, r = t || n;
		if (!r) return;
		let i = r.getVertexOffset(e), a = r.getVertexOffset(e + 1);
		r.buffer.write(new Uint8Array(a - i), i);
	}
	restorePickingColors() {
		let { pickingColors: e, instancePickingColors: t } = this.getAttributeManager().attributes, n = e || t;
		n && (this.internalState.usesPickingColorCache && n.value.buffer !== zx.buffer && (n.value = zx.subarray(0, n.value.length)), n.updateSubBuffer({ startOffset: 0 }));
	}
	_initialize() {
		Yh(!this.internalState), Yh(Number.isFinite(this.props.coordinateSystem)), Gr(Mx, this);
		let e = this._getAttributeManager();
		e && e.addInstanced({ instancePickingColors: {
			type: "uint8",
			size: 4,
			noAlloc: !0,
			update: this.calculateInstancePickingColors
		} }), this.internalState = new Ax({
			attributeManager: e,
			layer: this
		}), this._clearChangeFlags(), this.state = {}, Object.defineProperty(this.state, "attributeManager", { get: () => (E.deprecated("layer.state.attributeManager", "layer.getAttributeManager()")(), e) }), this.internalState.uniformTransitions = new Ub(this.context.timeline), this.internalState.onAsyncPropUpdated = this._onAsyncPropUpdated.bind(this), this.internalState.setAsyncProps(this.props), this.initializeState(this.context);
		for (let e of this.props.extensions) e.initializeState.call(this, this.context, e);
		this.setChangeFlags({
			dataChanged: "init",
			propsChanged: "init",
			viewportChanged: !0,
			extensionsChanged: !0
		}), this._update();
	}
	_transferState(e) {
		Gr(Fx, this, this === e);
		let { state: t, internalState: n } = e;
		this !== e && (this.internalState = n, this.state = t, this.internalState.setAsyncProps(this.props), this._diffProps(this.props, this.internalState.getOldProps()));
	}
	_update() {
		let e = this.needsUpdate();
		if (Gr(Nx, this, e), !e) return;
		let t = this.props, n = this.context, r = this.internalState, i = n.viewport, a = this._updateUniformTransition();
		r.propsInTransition = a, n.viewport = r.viewport || i, this.props = a;
		try {
			let e = this._getUpdateParams(), t = this.getModels();
			if (n.device) this.updateState(e);
			else try {
				this.updateState(e);
			} catch {}
			for (let t of this.props.extensions) t.updateState.call(this, e, t);
			this.setNeedsRedraw(), this._updateAttributes();
			let r = this.getModels()[0] !== t[0];
			this._postUpdate(e, r);
		} finally {
			n.viewport = i, this.props = t, this._clearChangeFlags(), r.needsUpdate = !1, r.resetOldProps();
		}
	}
	_finalize() {
		Gr(Px, this), this.finalizeState(this.context);
		for (let e of this.props.extensions) e.finalizeState.call(this, this.context, e);
	}
	_drawLayer({ renderPass: e, shaderModuleProps: t = null, uniforms: n = {}, parameters: r = {} }) {
		this._updateAttributeTransition();
		let i = this.props, a = this.context;
		this.props = this.internalState.propsInTransition || i;
		try {
			t && this.setShaderModuleProps(t);
			let { getPolygonOffset: i } = this.props, o = i && i(n) || [0, 0];
			a.device instanceof Sy && a.device.setParametersWebGL({ polygonOffset: o });
			for (let e of this.getModels()) e.device.type === "webgpu" ? e.setParameters({
				...e.parameters,
				...r
			}) : e.setParameters(r);
			if (a.device instanceof Sy) a.device.withParametersWebGL(r, () => {
				let i = {
					renderPass: e,
					shaderModuleProps: t,
					uniforms: n,
					parameters: r,
					context: a
				};
				for (let e of this.props.extensions) e.draw.call(this, i, e);
				this.draw(i);
			});
			else {
				let i = {
					renderPass: e,
					shaderModuleProps: t,
					uniforms: n,
					parameters: r,
					context: a
				};
				for (let e of this.props.extensions) e.draw.call(this, i, e);
				this.draw(i);
			}
		} finally {
			this.props = i;
		}
	}
	getChangeFlags() {
		return this.internalState?.changeFlags;
	}
	setChangeFlags(e) {
		if (!this.internalState) return;
		let { changeFlags: t } = this.internalState;
		for (let n in e) if (e[n]) {
			let r = !1;
			switch (n) {
				case "dataChanged":
					let i = e[n], a = t[n];
					i && Array.isArray(a) && (t.dataChanged = Array.isArray(i) ? a.concat(i) : i, r = !0);
				default: t[n] || (t[n] = e[n], r = !0);
			}
			r && Gr(jx, this, n, e);
		}
		let n = !!(t.dataChanged || t.updateTriggersChanged || t.propsChanged || t.extensionsChanged);
		t.propsOrDataChanged = n, t.somethingChanged = n || t.viewportChanged || t.stateChanged;
	}
	_clearChangeFlags() {
		this.internalState.changeFlags = {
			dataChanged: !1,
			propsChanged: !1,
			updateTriggersChanged: !1,
			viewportChanged: !1,
			stateChanged: !1,
			extensionsChanged: !1,
			propsOrDataChanged: !1,
			somethingChanged: !1
		};
	}
	_diffProps(e, t) {
		let n = Gb(e, t);
		if (n.updateTriggersChanged) for (let e in n.updateTriggersChanged) n.updateTriggersChanged[e] && this.invalidateAttribute(e);
		if (n.transitionsChanged) for (let r in n.transitionsChanged) this.internalState.uniformTransitions.add(r, t[r], e[r], e.transitions?.[r]);
		return this.setChangeFlags(n);
	}
	validateProps() {
		Wb(this.props);
	}
	updateAutoHighlight(e) {
		this.props.autoHighlight && !Number.isInteger(this.props.highlightedObjectIndex) && this._updateAutoHighlight(e);
	}
	_updateAutoHighlight(e) {
		let t = { highlightedObjectColor: e.picked ? e.color : null }, { highlightColor: n } = this.props;
		e.picked && typeof n == "function" && (t.highlightColor = n(e)), this.setShaderModuleProps({ picking: t }), this.setNeedsRedraw();
	}
	_getAttributeManager() {
		let e = this.context;
		return new Ib(e.device, {
			id: this.props.id,
			stats: e.stats,
			timeline: e.timeline
		});
	}
	_postUpdate(e, t) {
		let { props: n, oldProps: r } = e, i = this.state.model;
		i?.isInstanced && i.setInstanceCount(this.getNumInstances());
		let { autoHighlight: a, highlightedObjectIndex: o, highlightColor: s } = n;
		if (t || r.autoHighlight !== a || r.highlightedObjectIndex !== o || r.highlightColor !== s) {
			let e = {};
			Array.isArray(s) && (e.highlightColor = s), (t || r.autoHighlight !== a || o !== r.highlightedObjectIndex) && (e.highlightedObjectColor = Number.isFinite(o) && o >= 0 ? this.encodePickingColor(o) : null), this.setShaderModuleProps({ picking: e });
		}
	}
	_getUpdateParams() {
		return {
			props: this.props,
			oldProps: this.internalState.getOldProps(),
			context: this.context,
			changeFlags: this.internalState.changeFlags
		};
	}
	_getNeedsRedraw(e) {
		if (!this.internalState) return !1;
		let t = !1;
		t ||= this.internalState.needsRedraw && this.id;
		let n = this.getAttributeManager(), r = n ? n.getNeedsRedraw(e) : !1;
		if (t ||= r, t) for (let e of this.props.extensions) e.onNeedsRedraw.call(this, e);
		return this.internalState.needsRedraw = this.internalState.needsRedraw && !e.clearRedrawFlags, t;
	}
	_onAsyncPropUpdated() {
		this._diffProps(this.props, this.internalState.getOldProps()), this.setNeedsUpdate();
	}
};
Vx.defaultProps = Bx, Vx.layerName = "Layer";
// node_modules/@deck.gl/core/dist/utils/tesselator.js
var Hx = class {
	constructor(e) {
		this.indexStarts = [0], this.vertexStarts = [0], this.vertexCount = 0, this.instanceCount = 0;
		let { attributes: t = {} } = e;
		this.typedArrayManager = mm, this.attributes = {}, this._attributeDefs = t, this.opts = e, this.updateGeometry(e);
	}
	updateGeometry(e) {
		Object.assign(this.opts, e);
		let { data: t, buffers: n = {}, getGeometry: r, geometryBuffer: i, positionFormat: a, dataChanged: o, normalize: s = !0 } = this.opts;
		if (this.data = t, this.getGeometry = r, this.positionSize = i && i.size || (a === "XY" ? 2 : 3), this.buffers = n, this.normalize = s, i && (Yh(t.startIndices), this.getGeometry = this.getGeometryFromBuffer(i), s || (n.vertexPositions = i)), this.geometryBuffer = n.vertexPositions, Array.isArray(o)) for (let e of o) this._rebuildGeometry(e);
		else this._rebuildGeometry();
	}
	updatePartialGeometry({ startRow: e, endRow: t }) {
		this._rebuildGeometry({
			startRow: e,
			endRow: t
		});
	}
	getGeometryFromBuffer(e) {
		let t = e.value || e;
		return ArrayBuffer.isView(t) ? Qy(t, {
			size: this.positionSize,
			offset: e.offset,
			stride: e.stride,
			startIndices: this.data.startIndices
		}) : null;
	}
	_allocate(e, t) {
		let { attributes: n, buffers: r, _attributeDefs: i, typedArrayManager: a } = this;
		for (let o in i) if (o in r) a.release(n[o]), n[o] = null;
		else {
			let r = i[o];
			r.copy = t, n[o] = a.allocate(n[o], e, r);
		}
	}
	_forEachGeometry(e, t, n) {
		let { data: r, getGeometry: i } = this, { iterable: a, objectInfo: o } = Xy(r, t, n);
		for (let t of a) o.index++, e(i ? i(t, o) : null, o.index);
	}
	_rebuildGeometry(e) {
		if (!this.data) return;
		let { indexStarts: t, vertexStarts: n, instanceCount: r } = this, { data: i, geometryBuffer: a } = this, { startRow: o = 0, endRow: s = Infinity } = e || {}, c = {};
		if (e || (t = [0], n = [0]), this.normalize || !a) this._forEachGeometry((e, t) => {
			let r = e && this.normalizeGeometry(e);
			c[t] = r, n[t + 1] = n[t] + (r ? this.getGeometrySize(r) : 0);
		}, o, s), r = n[n.length - 1];
		else if (n = i.startIndices, r = n[i.length] || 0, ArrayBuffer.isView(a)) r ||= a.length / this.positionSize;
		else if (a instanceof k) {
			let e = this.positionSize * 4;
			r ||= a.byteLength / e;
		} else if (a.buffer) {
			let e = a.stride || this.positionSize * 4;
			r ||= a.buffer.byteLength / e;
		} else if (a.value) {
			let e = a.value, t = a.stride / e.BYTES_PER_ELEMENT || this.positionSize;
			r ||= e.length / t;
		}
		this._allocate(r, !!e), this.indexStarts = t, this.vertexStarts = n, this.instanceCount = r;
		let l = {};
		this._forEachGeometry((e, i) => {
			let a = c[i] || e;
			l.vertexStart = n[i], l.indexStart = t[i];
			let o = i < n.length - 1 ? n[i + 1] : r;
			l.geometrySize = o - n[i], l.geometryIndex = i, this.updateGeometryAttributes(a, l);
		}, o, s), this.vertexCount = t[t.length - 1];
	}
}, Ux = {
	CLOCKWISE: 1,
	COUNTER_CLOCKWISE: -1
};
function Wx(e, t, n = {}) {
	return Gx(e, n) !== t && (Jx(e, n), !0);
}
function Gx(e, t = {}) {
	return Math.sign(qx(e, t));
}
var Kx = {
	x: 0,
	y: 1,
	z: 2
};
function qx(e, t = {}) {
	let { start: n = 0, end: r = e.length, plane: i = "xy" } = t, a = t.size || 2, o = 0, s = Kx[i[0]], c = Kx[i[1]];
	for (let t = n, i = r - a; t < r; t += a) o += (e[t + s] - e[i + s]) * (e[t + c] + e[i + c]), i = t;
	return o / 2;
}
function Jx(e, t) {
	let { start: n = 0, end: r = e.length, size: i = 2 } = t, a = (r - n) / i, o = Math.floor(a / 2);
	for (let t = 0; t < o; ++t) {
		let r = n + t * i, o = n + (a - 1 - t) * i;
		for (let t = 0; t < i; ++t) {
			let n = e[r + t];
			e[r + t] = e[o + t], e[o + t] = n;
		}
	}
}
// node_modules/@math.gl/polygon/dist/utils.js
function Yx(e, t) {
	let n = t.length, r = e.length;
	if (r > 0) {
		let i = !0;
		for (let a = 0; a < n; a++) if (e[r - n + a] !== t[a]) {
			i = !1;
			break;
		}
		if (i) return !1;
	}
	for (let i = 0; i < n; i++) e[r + i] = t[i];
	return !0;
}
function Xx(e, t) {
	let n = t.length;
	for (let r = 0; r < n; r++) e[r] = t[r];
}
function Zx(e, t, n, r, i = []) {
	let a = r + t * n;
	for (let t = 0; t < n; t++) i[t] = e[a + t];
	return i;
}
// node_modules/@math.gl/polygon/dist/lineclip.js
function Qx(e, t, n, r, i = []) {
	let a, o;
	if (n & 8) a = (r[3] - e[1]) / (t[1] - e[1]), o = 3;
	else if (n & 4) a = (r[1] - e[1]) / (t[1] - e[1]), o = 1;
	else if (n & 2) a = (r[2] - e[0]) / (t[0] - e[0]), o = 2;
	else if (n & 1) a = (r[0] - e[0]) / (t[0] - e[0]), o = 0;
	else return null;
	for (let n = 0; n < e.length; n++) i[n] = (o & 1) === n ? r[o] : a * (t[n] - e[n]) + e[n];
	return i;
}
function $x(e, t) {
	let n = 0;
	return e[0] < t[0] ? n |= 1 : e[0] > t[2] && (n |= 2), e[1] < t[1] ? n |= 4 : e[1] > t[3] && (n |= 8), n;
}
// node_modules/@math.gl/polygon/dist/cut-by-grid.js
function eS(e, t) {
	let { size: n = 2, broken: r = !1, gridResolution: i = 10, gridOffset: a = [0, 0], startIndex: o = 0, endIndex: s = e.length } = t || {}, c = (s - o) / n, l = [], u = [l], d = Zx(e, 0, n, o), f, p, m = aS(d, i, a, []), h = [];
	Yx(l, d);
	for (let t = 1; t < c; t++) {
		for (f = Zx(e, t, n, o, f), p = $x(f, m); p;) {
			Qx(d, f, p, m, h);
			let e = $x(h, m);
			e && (Qx(d, h, e, m, h), p = e), Yx(l, h), Xx(d, h), oS(m, i, p), r && l.length > n && (l = [], u.push(l), Yx(l, d)), p = $x(f, m);
		}
		Yx(l, f), Xx(d, f);
	}
	return r ? u : u[0];
}
var tS = 0, nS = 1;
function rS(e, t = null, n) {
	if (!e.length) return [];
	let { size: r = 2, gridResolution: i = 10, gridOffset: a = [0, 0], edgeTypes: o = !1 } = n || {}, s = [], c = [{
		pos: e,
		types: o ? Array(e.length / r).fill(nS) : null,
		holes: t || []
	}], l = [[], []], u = [];
	for (; c.length;) {
		let { pos: e, types: t, holes: n } = c.shift();
		sS(e, r, n[0] || e.length, l), u = aS(l[0], i, a, u);
		let d = $x(l[1], u);
		if (d) {
			let i = iS(e, t, r, 0, n[0] || e.length, u, d), a = {
				pos: i[0].pos,
				types: i[0].types,
				holes: []
			}, s = {
				pos: i[1].pos,
				types: i[1].types,
				holes: []
			};
			c.push(a, s);
			for (let c = 0; c < n.length; c++) i = iS(e, t, r, n[c], n[c + 1] || e.length, u, d), i[0] && (a.holes.push(a.pos.length), a.pos = cS(a.pos, i[0].pos), o && (a.types = cS(a.types, i[0].types))), i[1] && (s.holes.push(s.pos.length), s.pos = cS(s.pos, i[1].pos), o && (s.types = cS(s.types, i[1].types)));
		} else {
			let r = { positions: e };
			o && (r.edgeTypes = t), n.length && (r.holeIndices = n), s.push(r);
		}
	}
	return s;
}
function iS(e, t, n, r, i, a, o) {
	let s = (i - r) / n, c = [], l = [], u = [], d = [], f = [], p, m, h, g = Zx(e, s - 1, n, r), _ = Math.sign(o & 8 ? g[1] - a[3] : g[0] - a[2]), v = t && t[s - 1], y = 0, b = 0;
	for (let i = 0; i < s; i++) p = Zx(e, i, n, r, p), m = Math.sign(o & 8 ? p[1] - a[3] : p[0] - a[2]), h = t && t[r / n + i], m && _ && _ !== m && (Qx(g, p, o, a, f), Yx(c, f) && u.push(v), Yx(l, f) && d.push(v)), m <= 0 ? (Yx(c, p) && u.push(h), y -= m) : u.length && (u[u.length - 1] = tS), m >= 0 ? (Yx(l, p) && d.push(h), b += m) : d.length && (d[d.length - 1] = tS), Xx(g, p), _ = m, v = h;
	return [y ? {
		pos: c,
		types: t && u
	} : null, b ? {
		pos: l,
		types: t && d
	} : null];
}
function aS(e, t, n, r) {
	let i = Math.floor((e[0] - n[0]) / t) * t + n[0], a = Math.floor((e[1] - n[1]) / t) * t + n[1];
	return r[0] = i, r[1] = a, r[2] = i + t, r[3] = a + t, r;
}
function oS(e, t, n) {
	n & 8 ? (e[1] += t, e[3] += t) : n & 4 ? (e[1] -= t, e[3] -= t) : n & 2 ? (e[0] += t, e[2] += t) : n & 1 && (e[0] -= t, e[2] -= t);
}
function sS(e, t, n, r) {
	let i = Infinity, a = -Infinity, o = Infinity, s = -Infinity;
	for (let r = 0; r < n; r += t) {
		let t = e[r], n = e[r + 1];
		i = t < i ? t : i, a = t > a ? t : a, o = n < o ? n : o, s = n > s ? n : s;
	}
	return r[0][0] = i, r[0][1] = o, r[1][0] = a, r[1][1] = s, r;
}
function cS(e, t) {
	for (let n = 0; n < t.length; n++) e.push(t[n]);
	return e;
}
// node_modules/@math.gl/polygon/dist/cut-by-mercator-bounds.js
var lS = 85.051129;
function uS(e, t) {
	let { size: n = 2, startIndex: r = 0, endIndex: i = e.length, normalize: a = !0 } = t || {}, o = e.slice(r, i);
	mS(o, n, 0, i - r);
	let s = eS(o, {
		size: n,
		broken: !0,
		gridResolution: 360,
		gridOffset: [-180, -180]
	});
	if (a) for (let e of s) hS(e, n);
	return s;
}
function dS(e, t = null, n) {
	let { size: r = 2, normalize: i = !0, edgeTypes: a = !1 } = n || {};
	t ||= [];
	let o = [], s = [], c = 0, l = 0;
	for (let i = 0; i <= t.length; i++) {
		let a = t[i] || e.length, u = l, d = fS(e, r, c, a);
		for (let t = d; t < a; t++) o[l++] = e[t];
		for (let t = c; t < d; t++) o[l++] = e[t];
		mS(o, r, u, l), pS(o, r, u, l, n?.maxLatitude), c = a, s[i] = l;
	}
	s.pop();
	let u = rS(o, s, {
		size: r,
		gridResolution: 360,
		gridOffset: [-180, -180],
		edgeTypes: a
	});
	if (i) for (let e of u) hS(e.positions, r);
	return u;
}
function fS(e, t, n, r) {
	let i = -1, a = -1;
	for (let o = n + 1; o < r; o += t) {
		let t = Math.abs(e[o]);
		t > i && (i = t, a = o - 1);
	}
	return a;
}
function pS(e, t, n, r, i = lS) {
	let a = e[n], o = e[r - t];
	if (Math.abs(a - o) > 180) {
		let r = Zx(e, 0, t, n);
		r[0] += Math.round((o - a) / 360) * 360, Yx(e, r), r[1] = Math.sign(r[1]) * i, Yx(e, r), r[0] = a, Yx(e, r);
	}
}
function mS(e, t, n, r) {
	let i = e[0], a;
	for (let o = n; o < r; o += t) {
		a = e[o];
		let t = a - i;
		(t > 180 || t < -180) && (a -= Math.round(t / 360) * 360), e[o] = i = a;
	}
}
function hS(e, t) {
	let n, r = e.length / t;
	for (let i = 0; i < r && (n = e[i * t], (n + 180) % 360 == 0); i++);
	let i = -Math.round(n / 360) * 360;
	if (i !== 0) for (let n = 0; n < r; n++) e[n * t] += i;
}
// node_modules/@deck.gl/layers/dist/path-layer/path.js
function gS(e, t, n, r) {
	let i;
	if (Array.isArray(e[0])) {
		let n = e.length * t;
		i = Array(n);
		for (let n = 0; n < e.length; n++) for (let r = 0; r < t; r++) i[n * t + r] = e[n][r] || 0;
	} else i = e;
	return n ? eS(i, {
		size: t,
		gridResolution: n
	}) : r ? uS(i, { size: t }) : i;
}
// node_modules/@deck.gl/layers/dist/path-layer/path-tesselator.js
var _S = 1, vS = 2, yS = 4, bS = class extends Hx {
	constructor(e) {
		super({
			...e,
			attributes: {
				positions: {
					size: 3,
					padding: 18,
					initialize: !0,
					type: e.fp64 ? Float64Array : Float32Array
				},
				segmentTypes: {
					size: 1,
					type: Uint8ClampedArray
				}
			}
		});
	}
	get(e) {
		return this.attributes[e];
	}
	getGeometryFromBuffer(e) {
		return this.normalize ? super.getGeometryFromBuffer(e) : null;
	}
	normalizeGeometry(e) {
		return this.normalize ? gS(e, this.positionSize, this.opts.resolution, this.opts.wrapLongitude) : e;
	}
	getGeometrySize(e) {
		if (xS(e)) {
			let t = 0;
			for (let n of e) t += this.getGeometrySize(n);
			return t;
		}
		let t = this.getPathLength(e);
		return t < 2 ? 0 : this.isClosed(e) ? t < 3 ? 0 : t + 2 : t;
	}
	updateGeometryAttributes(e, t) {
		if (t.geometrySize !== 0) {
			if (e && xS(e)) for (let n of e) {
				let e = this.getGeometrySize(n);
				t.geometrySize = e, this.updateGeometryAttributes(n, t), t.vertexStart += e;
			}
			else this._updateSegmentTypes(e, t), this._updatePositions(e, t);
		}
	}
	_updateSegmentTypes(e, t) {
		let n = this.attributes.segmentTypes, r = e ? this.isClosed(e) : !1, { vertexStart: i, geometrySize: a } = t;
		n.fill(0, i, i + a), r ? (n[i] = yS, n[i + a - 2] = yS) : (n[i] += _S, n[i + a - 2] += vS), n[i + a - 1] = yS;
	}
	_updatePositions(e, t) {
		let { positions: n } = this.attributes;
		if (!n || !e) return;
		let { vertexStart: r, geometrySize: i } = t, a = [
			,
			,
			,
		];
		for (let t = r, o = 0; o < i; t++, o++) this.getPointOnPath(e, o, a), n[t * 3] = a[0], n[t * 3 + 1] = a[1], n[t * 3 + 2] = a[2];
	}
	getPathLength(e) {
		return e.length / this.positionSize;
	}
	getPointOnPath(e, t, n = []) {
		let { positionSize: r } = this;
		t * r >= e.length && (t += 1 - e.length / r);
		let i = t * r;
		return n[0] = e[i], n[1] = e[i + 1], n[2] = r === 3 && e[i + 2] || 0, n;
	}
	isClosed(e) {
		if (!this.normalize) return !!this.opts.loop;
		let { positionSize: t } = this, n = e.length - t;
		return e[0] === e[n] && e[1] === e[n + 1] && (t === 2 || e[2] === e[n + 2]);
	}
};
function xS(e) {
	return Array.isArray(e[0]);
}
// node_modules/@deck.gl/layers/dist/path-layer/path-layer-uniforms.js
var SS = "uniform pathUniforms {\n  float widthScale;\n  float widthMinPixels;\n  float widthMaxPixels;\n  float jointType;\n  float capType;\n  float miterLimit;\n  bool billboard;\n  highp int widthUnits;\n} path;\n", CS = {
	name: "path",
	vs: SS,
	fs: SS,
	uniformTypes: {
		widthScale: "f32",
		widthMinPixels: "f32",
		widthMaxPixels: "f32",
		jointType: "f32",
		capType: "f32",
		miterLimit: "f32",
		billboard: "f32",
		widthUnits: "i32"
	}
}, wS = "#version 300 es\n#define SHADER_NAME path-layer-vertex-shader\nin vec2 positions;\nin float instanceTypes;\nin vec3 instanceStartPositions;\nin vec3 instanceEndPositions;\nin vec3 instanceLeftPositions;\nin vec3 instanceRightPositions;\nin vec3 instanceLeftPositions64Low;\nin vec3 instanceStartPositions64Low;\nin vec3 instanceEndPositions64Low;\nin vec3 instanceRightPositions64Low;\nin float instanceStrokeWidths;\nin vec4 instanceColors;\nin vec3 instancePickingColors;\nuniform float opacity;\nout vec4 vColor;\nout vec2 vCornerOffset;\nout float vMiterLength;\nout vec2 vPathPosition;\nout float vPathLength;\nout float vJointType;\nconst float EPSILON = 0.001;\nconst vec3 ZERO_OFFSET = vec3(0.0);\nfloat flipIfTrue(bool flag) {\nreturn -(float(flag) * 2. - 1.);\n}\nvec3 getLineJoinOffset(\nvec3 prevPoint, vec3 currPoint, vec3 nextPoint,\nvec2 width\n) {\nbool isEnd = positions.x > 0.0;\nfloat sideOfPath = positions.y;\nfloat isJoint = float(sideOfPath == 0.0);\nvec3 deltaA3 = (currPoint - prevPoint);\nvec3 deltaB3 = (nextPoint - currPoint);\nmat3 rotationMatrix;\nbool needsRotation = !path.billboard && project_needs_rotation(currPoint, rotationMatrix);\nif (needsRotation) {\ndeltaA3 = deltaA3 * rotationMatrix;\ndeltaB3 = deltaB3 * rotationMatrix;\n}\nvec2 deltaA = deltaA3.xy / width;\nvec2 deltaB = deltaB3.xy / width;\nfloat lenA = length(deltaA);\nfloat lenB = length(deltaB);\nvec2 dirA = lenA > 0. ? normalize(deltaA) : vec2(0.0, 0.0);\nvec2 dirB = lenB > 0. ? normalize(deltaB) : vec2(0.0, 0.0);\nvec2 perpA = vec2(-dirA.y, dirA.x);\nvec2 perpB = vec2(-dirB.y, dirB.x);\nvec2 tangent = dirA + dirB;\ntangent = length(tangent) > 0. ? normalize(tangent) : perpA;\nvec2 miterVec = vec2(-tangent.y, tangent.x);\nvec2 dir = isEnd ? dirA : dirB;\nvec2 perp = isEnd ? perpA : perpB;\nfloat L = isEnd ? lenA : lenB;\nfloat sinHalfA = abs(dot(miterVec, perp));\nfloat cosHalfA = abs(dot(dirA, miterVec));\nfloat turnDirection = flipIfTrue(dirA.x * dirB.y >= dirA.y * dirB.x);\nfloat cornerPosition = sideOfPath * turnDirection;\nfloat miterSize = 1.0 / max(sinHalfA, EPSILON);\nmiterSize = mix(\nmin(miterSize, max(lenA, lenB) / max(cosHalfA, EPSILON)),\nmiterSize,\nstep(0.0, cornerPosition)\n);\nvec2 offsetVec = mix(miterVec * miterSize, perp, step(0.5, cornerPosition))\n* (sideOfPath + isJoint * turnDirection);\nbool isStartCap = lenA == 0.0 || (!isEnd && (instanceTypes == 1.0 || instanceTypes == 3.0));\nbool isEndCap = lenB == 0.0 || (isEnd && (instanceTypes == 2.0 || instanceTypes == 3.0));\nbool isCap = isStartCap || isEndCap;\nif (isCap) {\noffsetVec = mix(perp * sideOfPath, dir * path.capType * 4.0 * flipIfTrue(isStartCap), isJoint);\nvJointType = path.capType;\n} else {\nvJointType = path.jointType;\n}\nvPathLength = L;\nvCornerOffset = offsetVec;\nvMiterLength = dot(vCornerOffset, miterVec * turnDirection);\nvMiterLength = isCap ? isJoint : vMiterLength;\nvec2 offsetFromStartOfPath = vCornerOffset + deltaA * float(isEnd);\nvPathPosition = vec2(\ndot(offsetFromStartOfPath, perp),\ndot(offsetFromStartOfPath, dir)\n);\ngeometry.uv = vPathPosition;\nfloat isValid = step(instanceTypes, 3.5);\nvec3 offset = vec3(offsetVec * width * isValid, 0.0);\nif (needsRotation) {\noffset = rotationMatrix * offset;\n}\nreturn offset;\n}\nvoid clipLine(inout vec4 position, vec4 refPosition) {\nif (position.w < EPSILON) {\nfloat r = (EPSILON - refPosition.w) / (position.w - refPosition.w);\nposition = refPosition + (position - refPosition) * r;\n}\n}\nvoid main() {\ngeometry.pickingColor = instancePickingColors;\nvColor = vec4(instanceColors.rgb, instanceColors.a * layer.opacity);\nfloat isEnd = positions.x;\nvec3 prevPosition = mix(instanceLeftPositions, instanceStartPositions, isEnd);\nvec3 prevPosition64Low = mix(instanceLeftPositions64Low, instanceStartPositions64Low, isEnd);\nvec3 currPosition = mix(instanceStartPositions, instanceEndPositions, isEnd);\nvec3 currPosition64Low = mix(instanceStartPositions64Low, instanceEndPositions64Low, isEnd);\nvec3 nextPosition = mix(instanceEndPositions, instanceRightPositions, isEnd);\nvec3 nextPosition64Low = mix(instanceEndPositions64Low, instanceRightPositions64Low, isEnd);\ngeometry.worldPosition = currPosition;\nvec2 widthPixels = vec2(clamp(\nproject_size_to_pixel(instanceStrokeWidths * path.widthScale, path.widthUnits),\npath.widthMinPixels, path.widthMaxPixels) / 2.0);\nvec3 width;\nif (path.billboard) {\nvec4 prevPositionScreen = project_position_to_clipspace(prevPosition, prevPosition64Low, ZERO_OFFSET);\nvec4 currPositionScreen = project_position_to_clipspace(currPosition, currPosition64Low, ZERO_OFFSET, geometry.position);\nvec4 nextPositionScreen = project_position_to_clipspace(nextPosition, nextPosition64Low, ZERO_OFFSET);\nclipLine(prevPositionScreen, currPositionScreen);\nclipLine(nextPositionScreen, currPositionScreen);\nclipLine(currPositionScreen, mix(nextPositionScreen, prevPositionScreen, isEnd));\nwidth = vec3(widthPixels, 0.0);\nDECKGL_FILTER_SIZE(width, geometry);\nvec3 offset = getLineJoinOffset(\nprevPositionScreen.xyz / prevPositionScreen.w,\ncurrPositionScreen.xyz / currPositionScreen.w,\nnextPositionScreen.xyz / nextPositionScreen.w,\nproject_pixel_size_to_clipspace(width.xy)\n);\nDECKGL_FILTER_GL_POSITION(currPositionScreen, geometry);\ngl_Position = vec4(currPositionScreen.xyz + offset * currPositionScreen.w, currPositionScreen.w);\n} else {\nprevPosition = project_position(prevPosition, prevPosition64Low);\ncurrPosition = project_position(currPosition, currPosition64Low);\nnextPosition = project_position(nextPosition, nextPosition64Low);\nwidth = vec3(project_pixel_size(widthPixels), 0.0);\nDECKGL_FILTER_SIZE(width, geometry);\nvec3 offset = getLineJoinOffset(prevPosition, currPosition, nextPosition, width.xy);\ngeometry.position = vec4(currPosition + offset, 1.0);\ngl_Position = project_common_position_to_clipspace(geometry.position);\nDECKGL_FILTER_GL_POSITION(gl_Position, geometry);\n}\nDECKGL_FILTER_COLOR(vColor, geometry);\n}\n", TS = "#version 300 es\n#define SHADER_NAME path-layer-fragment-shader\nprecision highp float;\nin vec4 vColor;\nin vec2 vCornerOffset;\nin float vMiterLength;\nin vec2 vPathPosition;\nin float vPathLength;\nin float vJointType;\nout vec4 fragColor;\nvoid main(void) {\ngeometry.uv = vPathPosition;\nif (vPathPosition.y < 0.0 || vPathPosition.y > vPathLength) {\nif (vJointType > 0.5 && length(vCornerOffset) > 1.0) {\ndiscard;\n}\nif (vJointType < 0.5 && vMiterLength > path.miterLimit + 1.0) {\ndiscard;\n}\n}\nfragColor = vColor;\nDECKGL_FILTER_COLOR(fragColor, geometry);\n}\n", ES = [
	0,
	0,
	0,
	255
], DS = {
	widthUnits: "meters",
	widthScale: {
		type: "number",
		min: 0,
		value: 1
	},
	widthMinPixels: {
		type: "number",
		min: 0,
		value: 0
	},
	widthMaxPixels: {
		type: "number",
		min: 0,
		value: 2 ** 53 - 1
	},
	jointRounded: !1,
	capRounded: !1,
	miterLimit: {
		type: "number",
		min: 0,
		value: 4
	},
	billboard: !1,
	_pathType: null,
	getPath: {
		type: "accessor",
		value: (e) => e.path
	},
	getColor: {
		type: "accessor",
		value: ES
	},
	getWidth: {
		type: "accessor",
		value: 1
	},
	rounded: { deprecatedFor: ["jointRounded", "capRounded"] }
}, OS = { enter: (e, t) => t.length ? t.subarray(t.length - e.length) : e }, kS = class extends Vx {
	getShaders() {
		return super.getShaders({
			vs: wS,
			fs: TS,
			modules: [
				Xf,
				Wp,
				CS
			]
		});
	}
	get wrapLongitude() {
		return !1;
	}
	getBounds() {
		return this.getAttributeManager()?.getBounds(["vertexPositions"]);
	}
	initializeState() {
		this.getAttributeManager().addInstanced({
			vertexPositions: {
				size: 3,
				vertexOffset: 1,
				type: "float64",
				fp64: this.use64bitPositions(),
				transition: OS,
				accessor: "getPath",
				update: this.calculatePositions,
				noAlloc: !0,
				shaderAttributes: {
					instanceLeftPositions: { vertexOffset: 0 },
					instanceStartPositions: { vertexOffset: 1 },
					instanceEndPositions: { vertexOffset: 2 },
					instanceRightPositions: { vertexOffset: 3 }
				}
			},
			instanceTypes: {
				size: 1,
				type: "uint8",
				update: this.calculateSegmentTypes,
				noAlloc: !0
			},
			instanceStrokeWidths: {
				size: 1,
				accessor: "getWidth",
				transition: OS,
				defaultValue: 1
			},
			instanceColors: {
				size: this.props.colorFormat.length,
				type: "unorm8",
				accessor: "getColor",
				transition: OS,
				defaultValue: ES
			},
			instancePickingColors: {
				size: 4,
				type: "uint8",
				accessor: (e, { index: t, target: n }) => this.encodePickingColor(e && e.__source ? e.__source.index : t, n)
			}
		}), this.setState({ pathTesselator: new bS({ fp64: this.use64bitPositions() }) });
	}
	updateState(e) {
		super.updateState(e);
		let { props: t, changeFlags: n } = e, r = this.getAttributeManager();
		if (n.dataChanged || n.updateTriggersChanged && (n.updateTriggersChanged.all || n.updateTriggersChanged.getPath)) {
			let { pathTesselator: e } = this.state, i = t.data.attributes || {};
			e.updateGeometry({
				data: t.data,
				geometryBuffer: i.getPath,
				buffers: i,
				normalize: !t._pathType,
				loop: t._pathType === "loop",
				getGeometry: t.getPath,
				positionFormat: t.positionFormat,
				wrapLongitude: t.wrapLongitude,
				resolution: this.context.viewport.resolution,
				dataChanged: n.dataChanged
			}), this.setState({
				numInstances: e.instanceCount,
				startIndices: e.vertexStarts
			}), n.dataChanged || r.invalidateAll();
		}
		n.extensionsChanged && (this.state.model?.destroy(), this.state.model = this._getModel(), r.invalidateAll());
	}
	getPickingInfo(e) {
		let t = super.getPickingInfo(e), { index: n } = t, r = this.props.data;
		return r[0] && r[0].__source && (t.object = r.find((e) => e.__source.index === n)), t;
	}
	disablePickingIndex(e) {
		let t = this.props.data;
		if (t[0] && t[0].__source) for (let n = 0; n < t.length; n++) t[n].__source.index === e && this._disablePickingIndex(n);
		else super.disablePickingIndex(e);
	}
	draw({ uniforms: e }) {
		let { jointRounded: t, capRounded: n, billboard: r, miterLimit: i, widthUnits: a, widthScale: o, widthMinPixels: s, widthMaxPixels: c } = this.props, l = this.state.model, u = {
			jointType: Number(t),
			capType: Number(n),
			billboard: r,
			widthUnits: Af[a],
			widthScale: o,
			miterLimit: i,
			widthMinPixels: s,
			widthMaxPixels: c
		};
		l.shaderInputs.setProps({ path: u }), l.draw(this.context.renderPass);
	}
	_getModel() {
		let e = [
			0,
			1,
			2,
			1,
			4,
			2,
			1,
			3,
			4,
			3,
			5,
			4
		], t = [
			0,
			0,
			0,
			-1,
			0,
			1,
			1,
			-1,
			1,
			1,
			1,
			0
		];
		return new fh(this.context.device, {
			...this.getShaders(),
			id: this.props.id,
			bufferLayout: this.getAttributeManager().getBufferLayouts(),
			geometry: new _h({
				topology: "triangle-list",
				attributes: {
					indices: new Uint16Array(e),
					positions: {
						value: new Float32Array(t),
						size: 2
					}
				}
			}),
			isInstanced: !0
		});
	}
	calculatePositions(e) {
		let { pathTesselator: t } = this.state;
		e.startIndices = t.vertexStarts, e.value = t.get("positions");
	}
	calculateSegmentTypes(e) {
		let { pathTesselator: t } = this.state;
		e.startIndices = t.vertexStarts, e.value = t.get("segmentTypes");
	}
};
kS.defaultProps = DS, kS.layerName = "PathLayer";
// node_modules/@deck.gl/layers/dist/solid-polygon-layer/polygon.js
var AS = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t) => {
	t.exports = n, t.exports.default = n;
	function n(e, t, n) {
		n ||= 2;
		var i = t && t.length, o = i ? t[0] * n : e.length, s = r(e, 0, o, n, !0), c = [];
		if (!s || s.next === s.prev) return c;
		var l, d, f, p, m, h, g;
		if (i && (s = u(e, t, s, n)), e.length > 80 * n) {
			l = f = e[0], d = p = e[1];
			for (var _ = n; _ < o; _ += n) m = e[_], h = e[_ + 1], m < l && (l = m), h < d && (d = h), m > f && (f = m), h > p && (p = h);
			g = Math.max(f - l, p - d), g = g === 0 ? 0 : 32767 / g;
		}
		return a(s, c, n, l, d, g, 0), c;
	}
	function r(e, t, n, r, i) {
		var a, o;
		if (i === se(e, t, n, r) > 0) for (a = t; a < n; a += r) o = T(a, e[a], e[a + 1], o);
		else for (a = n - r; a >= t; a -= r) o = T(a, e[a], e[a + 1], o);
		return o && S(o, o.next) && (ae(o), o = o.next), o;
	}
	function i(e, t) {
		if (!e) return e;
		t ||= e;
		var n = e, r;
		do
			if (r = !1, !n.steiner && (S(n, n.next) || x(n.prev, n, n.next) === 0)) {
				if (ae(n), n = t = n.prev, n === n.next) break;
				r = !0;
			} else n = n.next;
		while (r || n !== t);
		return t;
	}
	function a(e, t, n, r, u, d, f) {
		if (e) {
			!f && d && h(e, r, u, d);
			for (var p = e, m, g; e.prev !== e.next;) if (m = e.prev, g = e.next, d ? s(e, r, u, d) : o(e)) t.push(m.i / n | 0), t.push(e.i / n | 0), t.push(g.i / n | 0), ae(e), e = g.next, p = g.next;
			else if (e = g, e === p) {
				f ? f === 1 ? (e = c(i(e), t, n), a(e, t, n, r, u, d, 2)) : f === 2 && l(e, t, n, r, u, d) : a(i(e), t, n, r, u, d, 1);
				break;
			}
		}
	}
	function o(e) {
		var t = e.prev, n = e, r = e.next;
		if (x(t, n, r) >= 0) return !1;
		for (var i = t.x, a = n.x, o = r.x, s = t.y, c = n.y, l = r.y, u = i < a ? i < o ? i : o : a < o ? a : o, d = s < c ? s < l ? s : l : c < l ? c : l, f = i > a ? i > o ? i : o : a > o ? a : o, p = s > c ? s > l ? s : l : c > l ? c : l, m = r.next; m !== t;) {
			if (m.x >= u && m.x <= f && m.y >= d && m.y <= p && y(i, s, a, c, o, l, m.x, m.y) && x(m.prev, m, m.next) >= 0) return !1;
			m = m.next;
		}
		return !0;
	}
	function s(e, t, n, r) {
		var i = e.prev, a = e, o = e.next;
		if (x(i, a, o) >= 0) return !1;
		for (var s = i.x, c = a.x, l = o.x, u = i.y, d = a.y, f = o.y, p = s < c ? s < l ? s : l : c < l ? c : l, m = u < d ? u < f ? u : f : d < f ? d : f, h = s > c ? s > l ? s : l : c > l ? c : l, g = u > d ? u > f ? u : f : d > f ? d : f, v = _(p, m, t, n, r), b = _(h, g, t, n, r), S = e.prevZ, C = e.nextZ; S && S.z >= v && C && C.z <= b;) {
			if (S.x >= p && S.x <= h && S.y >= m && S.y <= g && S !== i && S !== o && y(s, u, c, d, l, f, S.x, S.y) && x(S.prev, S, S.next) >= 0 || (S = S.prevZ, C.x >= p && C.x <= h && C.y >= m && C.y <= g && C !== i && C !== o && y(s, u, c, d, l, f, C.x, C.y) && x(C.prev, C, C.next) >= 0)) return !1;
			C = C.nextZ;
		}
		for (; S && S.z >= v;) {
			if (S.x >= p && S.x <= h && S.y >= m && S.y <= g && S !== i && S !== o && y(s, u, c, d, l, f, S.x, S.y) && x(S.prev, S, S.next) >= 0) return !1;
			S = S.prevZ;
		}
		for (; C && C.z <= b;) {
			if (C.x >= p && C.x <= h && C.y >= m && C.y <= g && C !== i && C !== o && y(s, u, c, d, l, f, C.x, C.y) && x(C.prev, C, C.next) >= 0) return !1;
			C = C.nextZ;
		}
		return !0;
	}
	function c(e, t, n) {
		var r = e;
		do {
			var a = r.prev, o = r.next.next;
			!S(a, o) && C(a, r, r.next, o) && ne(a, o) && ne(o, a) && (t.push(a.i / n | 0), t.push(r.i / n | 0), t.push(o.i / n | 0), ae(r), ae(r.next), r = e = o), r = r.next;
		} while (r !== e);
		return i(r);
	}
	function l(e, t, n, r, o, s) {
		var c = e;
		do {
			for (var l = c.next.next; l !== c.prev;) {
				if (c.i !== l.i && b(c, l)) {
					var u = ie(c, l);
					c = i(c, c.next), u = i(u, u.next), a(c, t, n, r, o, s, 0), a(u, t, n, r, o, s, 0);
					return;
				}
				l = l.next;
			}
			c = c.next;
		} while (c !== e);
	}
	function u(e, t, n, i) {
		for (var a = [], o = 0, s = t.length, c, l, u; o < s; o++) c = t[o] * i, l = o < s - 1 ? t[o + 1] * i : e.length, u = r(e, c, l, i, !1), u === u.next && (u.steiner = !0), a.push(v(u));
		for (a.sort(d), o = 0; o < a.length; o++) n = f(a[o], n);
		return n;
	}
	function d(e, t) {
		return e.x - t.x;
	}
	function f(e, t) {
		var n = p(e, t);
		if (!n) return t;
		var r = ie(n, e);
		return i(r, r.next), i(n, n.next);
	}
	function p(e, t) {
		var n = t, r = e.x, i = e.y, a = -Infinity, o;
		do {
			if (i <= n.y && i >= n.next.y && n.next.y !== n.y) {
				var s = n.x + (i - n.y) * (n.next.x - n.x) / (n.next.y - n.y);
				if (s <= r && s > a && (a = s, o = n.x < n.next.x ? n : n.next, s === r)) return o;
			}
			n = n.next;
		} while (n !== t);
		if (!o) return null;
		var c = o, l = o.x, u = o.y, d = Infinity, f;
		n = o;
		do
			r >= n.x && n.x >= l && r !== n.x && y(i < u ? r : a, i, l, u, i < u ? a : r, i, n.x, n.y) && (f = Math.abs(i - n.y) / (r - n.x), ne(n, e) && (f < d || f === d && (n.x > o.x || n.x === o.x && m(o, n))) && (o = n, d = f)), n = n.next;
		while (n !== c);
		return o;
	}
	function m(e, t) {
		return x(e.prev, e, t.prev) < 0 && x(t.next, e, e.next) < 0;
	}
	function h(e, t, n, r) {
		var i = e;
		do
			i.z === 0 && (i.z = _(i.x, i.y, t, n, r)), i.prevZ = i.prev, i.nextZ = i.next, i = i.next;
		while (i !== e);
		i.prevZ.nextZ = null, i.prevZ = null, g(i);
	}
	function g(e) {
		var t, n, r, i, a, o, s, c, l = 1;
		do {
			for (n = e, e = null, a = null, o = 0; n;) {
				for (o++, r = n, s = 0, t = 0; t < l && (s++, r = r.nextZ, r); t++);
				for (c = l; s > 0 || c > 0 && r;) s !== 0 && (c === 0 || !r || n.z <= r.z) ? (i = n, n = n.nextZ, s--) : (i = r, r = r.nextZ, c--), a ? a.nextZ = i : e = i, i.prevZ = a, a = i;
				n = r;
			}
			a.nextZ = null, l *= 2;
		} while (o > 1);
		return e;
	}
	function _(e, t, n, r, i) {
		return e = (e - n) * i | 0, t = (t - r) * i | 0, e = (e | e << 8) & 16711935, e = (e | e << 4) & 252645135, e = (e | e << 2) & 858993459, e = (e | e << 1) & 1431655765, t = (t | t << 8) & 16711935, t = (t | t << 4) & 252645135, t = (t | t << 2) & 858993459, t = (t | t << 1) & 1431655765, e | t << 1;
	}
	function v(e) {
		var t = e, n = e;
		do
			(t.x < n.x || t.x === n.x && t.y < n.y) && (n = t), t = t.next;
		while (t !== e);
		return n;
	}
	function y(e, t, n, r, i, a, o, s) {
		return (i - o) * (t - s) >= (e - o) * (a - s) && (e - o) * (r - s) >= (n - o) * (t - s) && (n - o) * (a - s) >= (i - o) * (r - s);
	}
	function b(e, t) {
		return e.next.i !== t.i && e.prev.i !== t.i && !te(e, t) && (ne(e, t) && ne(t, e) && re(e, t) && (x(e.prev, e, t.prev) || x(e, t.prev, t)) || S(e, t) && x(e.prev, e, e.next) > 0 && x(t.prev, t, t.next) > 0);
	}
	function x(e, t, n) {
		return (t.y - e.y) * (n.x - t.x) - (t.x - e.x) * (n.y - t.y);
	}
	function S(e, t) {
		return e.x === t.x && e.y === t.y;
	}
	function C(e, t, n, r) {
		var i = ee(x(e, t, n)), a = ee(x(e, t, r)), o = ee(x(n, r, e)), s = ee(x(n, r, t));
		return !!(i !== a && o !== s || i === 0 && w(e, n, t) || a === 0 && w(e, r, t) || o === 0 && w(n, e, r) || s === 0 && w(n, t, r));
	}
	function w(e, t, n) {
		return t.x <= Math.max(e.x, n.x) && t.x >= Math.min(e.x, n.x) && t.y <= Math.max(e.y, n.y) && t.y >= Math.min(e.y, n.y);
	}
	function ee(e) {
		return e > 0 ? 1 : e < 0 ? -1 : 0;
	}
	function te(e, t) {
		var n = e;
		do {
			if (n.i !== e.i && n.next.i !== e.i && n.i !== t.i && n.next.i !== t.i && C(n, n.next, e, t)) return !0;
			n = n.next;
		} while (n !== e);
		return !1;
	}
	function ne(e, t) {
		return x(e.prev, e, e.next) < 0 ? x(e, t, e.next) >= 0 && x(e, e.prev, t) >= 0 : x(e, t, e.prev) < 0 || x(e, e.next, t) < 0;
	}
	function re(e, t) {
		var n = e, r = !1, i = (e.x + t.x) / 2, a = (e.y + t.y) / 2;
		do
			n.y > a != n.next.y > a && n.next.y !== n.y && i < (n.next.x - n.x) * (a - n.y) / (n.next.y - n.y) + n.x && (r = !r), n = n.next;
		while (n !== e);
		return r;
	}
	function ie(e, t) {
		var n = new oe(e.i, e.x, e.y), r = new oe(t.i, t.x, t.y), i = e.next, a = t.prev;
		return e.next = t, t.prev = e, n.next = i, i.prev = n, r.next = n, n.prev = r, a.next = r, r.prev = a, r;
	}
	function T(e, t, n, r) {
		var i = new oe(e, t, n);
		return r ? (i.next = r.next, i.prev = r, r.next.prev = i, r.next = i) : (i.prev = i, i.next = i), i;
	}
	function ae(e) {
		e.next.prev = e.prev, e.prev.next = e.next, e.prevZ && (e.prevZ.nextZ = e.nextZ), e.nextZ && (e.nextZ.prevZ = e.prevZ);
	}
	function oe(e, t, n) {
		this.i = e, this.x = t, this.y = n, this.prev = null, this.next = null, this.z = 0, this.prevZ = null, this.nextZ = null, this.steiner = !1;
	}
	n.deviation = function(e, t, n, r) {
		var i = t && t.length, a = i ? t[0] * n : e.length, o = Math.abs(se(e, 0, a, n));
		if (i) for (var s = 0, c = t.length; s < c; s++) {
			var l = t[s] * n, u = s < c - 1 ? t[s + 1] * n : e.length;
			o -= Math.abs(se(e, l, u, n));
		}
		var d = 0;
		for (s = 0; s < r.length; s += 3) {
			var f = r[s] * n, p = r[s + 1] * n, m = r[s + 2] * n;
			d += Math.abs((e[f] - e[m]) * (e[p + 1] - e[f + 1]) - (e[f] - e[p]) * (e[m + 1] - e[f + 1]));
		}
		return o === 0 && d === 0 ? 0 : Math.abs((d - o) / o);
	};
	function se(e, t, n, r) {
		for (var i = 0, a = t, o = n - r; a < n; a += r) i += (e[o] - e[a]) * (e[a + 1] + e[o + 1]), o = a;
		return i;
	}
	n.flatten = function(e) {
		for (var t = e[0][0].length, n = {
			vertices: [],
			holes: [],
			dimensions: t
		}, r = 0, i = 0; i < e.length; i++) {
			for (var a = 0; a < e[i].length; a++) for (var o = 0; o < t; o++) n.vertices.push(e[i][a][o]);
			i > 0 && (r += e[i - 1].length, n.holes.push(r));
		}
		return n;
	};
})))(), 1), jS = Ux.CLOCKWISE, MS = Ux.COUNTER_CLOCKWISE, NS = { isClosed: !0 };
function PS(e) {
	if (e = e && e.positions || e, !Array.isArray(e) && !ArrayBuffer.isView(e)) throw Error("invalid polygon");
}
function FS(e) {
	return "positions" in e ? e.positions : e;
}
function IS(e) {
	return "holeIndices" in e ? e.holeIndices : null;
}
function LS(e) {
	return Array.isArray(e[0]);
}
function RS(e) {
	return e.length >= 1 && e[0].length >= 2 && Number.isFinite(e[0][0]);
}
function zS(e) {
	let t = e[0], n = e[e.length - 1];
	return t[0] === n[0] && t[1] === n[1] && t[2] === n[2];
}
function BS(e, t, n, r) {
	for (let i = 0; i < t; i++) if (e[n + i] !== e[r - t + i]) return !1;
	return !0;
}
function VS(e, t, n, r, i) {
	let a = t, o = n.length;
	for (let t = 0; t < o; t++) for (let i = 0; i < r; i++) e[a++] = n[t][i] || 0;
	if (!zS(n)) for (let t = 0; t < r; t++) e[a++] = n[0][t] || 0;
	return NS.start = t, NS.end = a, NS.size = r, Wx(e, i, NS), a;
}
function HS(e, t, n, r, i = 0, a, o) {
	a ||= n.length;
	let s = a - i;
	if (s <= 0) return t;
	let c = t;
	for (let t = 0; t < s; t++) e[c++] = n[i + t];
	if (!BS(n, r, i, a)) for (let t = 0; t < r; t++) e[c++] = n[i + t];
	return NS.start = t, NS.end = c, NS.size = r, Wx(e, o, NS), c;
}
function US(e, t) {
	PS(e);
	let n = [], r = [];
	if ("positions" in e) {
		let { positions: i, holeIndices: a } = e;
		if (a) {
			let e = 0;
			for (let o = 0; o <= a.length; o++) e = HS(n, e, i, t, a[o - 1], a[o], o === 0 ? jS : MS), r.push(e);
			return r.pop(), {
				positions: n,
				holeIndices: r
			};
		}
		e = i;
	}
	if (!LS(e)) return HS(n, 0, e, t, 0, n.length, jS), n;
	if (!RS(e)) {
		let i = 0;
		for (let [a, o] of e.entries()) i = VS(n, i, o, t, a === 0 ? jS : MS), r.push(i);
		return r.pop(), {
			positions: n,
			holeIndices: r
		};
	}
	return VS(n, 0, e, t, jS), n;
}
function WS(e, t, n) {
	let r = e.length / 3, i = 0;
	for (let a = 0; a < r; a++) {
		let o = (a + 1) % r;
		i += e[a * 3 + t] * e[o * 3 + n], i -= e[o * 3 + t] * e[a * 3 + n];
	}
	return Math.abs(i / 2);
}
function GS(e, t, n, r) {
	let i = e.length / 3;
	for (let a = 0; a < i; a++) {
		let i = a * 3, o = e[i + 0], s = e[i + 1], c = e[i + 2];
		e[i + t] = o, e[i + n] = s, e[i + r] = c;
	}
}
function KS(e, t, n, r) {
	let i = IS(e);
	i &&= i.map((e) => e / t);
	let a = FS(e), o = r && t === 3;
	if (n) {
		let e = a.length;
		a = a.slice();
		let r = [];
		for (let i = 0; i < e; i += t) {
			r[0] = a[i], r[1] = a[i + 1], o && (r[2] = a[i + 2]);
			let e = n(r);
			a[i] = e[0], a[i + 1] = e[1], o && (a[i + 2] = e[2]);
		}
	}
	if (o) {
		let e = WS(a, 0, 1), t = WS(a, 0, 2), r = WS(a, 1, 2);
		if (!e && !t && !r) return [];
		e > t && e > r || (t > r ? (n || (a = a.slice()), GS(a, 0, 2, 1)) : (n || (a = a.slice()), GS(a, 2, 0, 1)));
	}
	return (0, AS.default)(a, i, t);
}
// node_modules/@deck.gl/layers/dist/solid-polygon-layer/polygon-tesselator.js
var qS = class extends Hx {
	constructor(e) {
		let { fp64: t, IndexType: n = Uint32Array } = e;
		super({
			...e,
			attributes: {
				positions: {
					size: 3,
					type: t ? Float64Array : Float32Array
				},
				vertexValid: {
					type: Uint16Array,
					size: 1
				},
				indices: {
					type: n,
					size: 1
				}
			}
		});
	}
	get(e) {
		let { attributes: t } = this;
		return e === "indices" ? t.indices && t.indices.subarray(0, this.vertexCount) : t[e];
	}
	updateGeometry(e) {
		super.updateGeometry(e);
		let t = this.buffers.indices;
		if (t) this.vertexCount = (t.value || t).length;
		else if (this.data && !this.getGeometry) throw Error("missing indices buffer");
	}
	normalizeGeometry(e) {
		if (this.normalize) {
			let t = US(e, this.positionSize);
			return this.opts.resolution ? rS(FS(t), IS(t), {
				size: this.positionSize,
				gridResolution: this.opts.resolution,
				edgeTypes: !0
			}) : this.opts.wrapLongitude ? dS(FS(t), IS(t), {
				size: this.positionSize,
				maxLatitude: 86,
				edgeTypes: !0
			}) : t;
		}
		return e;
	}
	getGeometrySize(e) {
		if (JS(e)) {
			let t = 0;
			for (let n of e) t += this.getGeometrySize(n);
			return t;
		}
		return FS(e).length / this.positionSize;
	}
	getGeometryFromBuffer(e) {
		return this.normalize || !this.buffers.indices ? super.getGeometryFromBuffer(e) : null;
	}
	updateGeometryAttributes(e, t) {
		if (e && JS(e)) for (let n of e) {
			let e = this.getGeometrySize(n);
			t.geometrySize = e, this.updateGeometryAttributes(n, t), t.vertexStart += e, t.indexStart = this.indexStarts[t.geometryIndex + 1];
		}
		else {
			let n = e;
			this._updateIndices(n, t), this._updatePositions(n, t), this._updateVertexValid(n, t);
		}
	}
	_updateIndices(e, { geometryIndex: t, vertexStart: n, indexStart: r }) {
		let { attributes: i, indexStarts: a, typedArrayManager: o } = this, s = i.indices;
		if (!s || !e) return;
		let c = r, l = KS(e, this.positionSize, this.opts.preproject, this.opts.full3d);
		s = o.allocate(s, r + l.length, { copy: !0 });
		for (let e = 0; e < l.length; e++) s[c++] = l[e] + n;
		a[t + 1] = r + l.length, i.indices = s;
	}
	_updatePositions(e, { vertexStart: t, geometrySize: n }) {
		let { attributes: { positions: r }, positionSize: i } = this;
		if (!r || !e) return;
		let a = FS(e);
		for (let e = t, o = 0; o < n; e++, o++) {
			let t = a[o * i], n = a[o * i + 1], s = i > 2 ? a[o * i + 2] : 0;
			r[e * 3] = t, r[e * 3 + 1] = n, r[e * 3 + 2] = s;
		}
	}
	_updateVertexValid(e, { vertexStart: t, geometrySize: n }) {
		let { positionSize: r } = this, i = this.attributes.vertexValid, a = e && IS(e);
		if (e && e.edgeTypes ? i.set(e.edgeTypes, t) : i.fill(1, t, t + n), a) for (let e = 0; e < a.length; e++) i[t + a[e] / r - 1] = 0;
		i[t + n - 1] = 0;
	}
};
function JS(e) {
	return Array.isArray(e) && e.length > 0 && !Number.isFinite(e[0]);
}
// node_modules/@deck.gl/layers/dist/solid-polygon-layer/solid-polygon-layer-uniforms.js
var YS = "uniform solidPolygonUniforms {\n  bool extruded;\n  bool isWireframe;\n  float elevationScale;\n} solidPolygon;\n", XS = {
	name: "solidPolygon",
	vs: YS,
	fs: YS,
	uniformTypes: {
		extruded: "f32",
		isWireframe: "f32",
		elevationScale: "f32"
	}
}, ZS = "in vec4 fillColors;\nin vec4 lineColors;\nin vec3 pickingColors;\nout vec4 vColor;\nstruct PolygonProps {\nvec3 positions;\nvec3 positions64Low;\nvec3 normal;\nfloat elevations;\n};\nvec3 project_offset_normal(vec3 vector) {\nif (project.coordinateSystem == COORDINATE_SYSTEM_LNGLAT ||\nproject.coordinateSystem == COORDINATE_SYSTEM_LNGLAT_OFFSETS) {\nreturn normalize(vector * project.commonUnitsPerWorldUnit);\n}\nreturn project_normal(vector);\n}\nvoid calculatePosition(PolygonProps props) {\nvec3 pos = props.positions;\nvec3 pos64Low = props.positions64Low;\nvec3 normal = props.normal;\nvec4 colors = solidPolygon.isWireframe ? lineColors : fillColors;\ngeometry.worldPosition = props.positions;\ngeometry.pickingColor = pickingColors;\nif (solidPolygon.extruded) {\npos.z += props.elevations * solidPolygon.elevationScale;\n}\ngl_Position = project_position_to_clipspace(pos, pos64Low, vec3(0.), geometry.position);\nDECKGL_FILTER_GL_POSITION(gl_Position, geometry);\nif (solidPolygon.extruded) {\n#ifdef IS_SIDE_VERTEX\nnormal = project_offset_normal(normal);\n#else\nnormal = project_normal(normal);\n#endif\ngeometry.normal = normal;\nvec3 lightColor = lighting_getLightColor(colors.rgb, project.cameraPosition, geometry.position.xyz, geometry.normal);\nvColor = vec4(lightColor, colors.a * layer.opacity);\n} else {\nvColor = vec4(colors.rgb, colors.a * layer.opacity);\n}\nDECKGL_FILTER_COLOR(vColor, geometry);\n}\n", QS = `\
#version 300 es
#define SHADER_NAME solid-polygon-layer-vertex-shader
in vec3 vertexPositions;
in vec3 vertexPositions64Low;
in float elevations;
${ZS}
void main(void) {
PolygonProps props;
props.positions = vertexPositions;
props.positions64Low = vertexPositions64Low;
props.elevations = elevations;
props.normal = vec3(0.0, 0.0, 1.0);
calculatePosition(props);
}
`, $S = `\
#version 300 es
#define SHADER_NAME solid-polygon-layer-vertex-shader-side
#define IS_SIDE_VERTEX
in vec2 positions;
in vec3 vertexPositions;
in vec3 nextVertexPositions;
in vec3 vertexPositions64Low;
in vec3 nextVertexPositions64Low;
in float elevations;
in float instanceVertexValid;
${ZS}
void main(void) {
if(instanceVertexValid < 0.5){
gl_Position = vec4(0.);
return;
}
PolygonProps props;
vec3 pos;
vec3 pos64Low;
vec3 nextPos;
vec3 nextPos64Low;
#if RING_WINDING_ORDER_CW == 1
pos = vertexPositions;
pos64Low = vertexPositions64Low;
nextPos = nextVertexPositions;
nextPos64Low = nextVertexPositions64Low;
#else
pos = nextVertexPositions;
pos64Low = nextVertexPositions64Low;
nextPos = vertexPositions;
nextPos64Low = vertexPositions64Low;
#endif
props.positions = mix(pos, nextPos, positions.x);
props.positions64Low = mix(pos64Low, nextPos64Low, positions.x);
props.normal = vec3(
pos.y - nextPos.y + (pos64Low.y - nextPos64Low.y),
nextPos.x - pos.x + (nextPos64Low.x - pos64Low.x),
0.0);
props.elevations = elevations * positions.y;
calculatePosition(props);
}
`, eC = "#version 300 es\n#define SHADER_NAME solid-polygon-layer-fragment-shader\nprecision highp float;\nin vec4 vColor;\nout vec4 fragColor;\nvoid main(void) {\nfragColor = vColor;\ngeometry.uv = vec2(0.);\nDECKGL_FILTER_COLOR(fragColor, geometry);\n}\n", tC = [
	0,
	0,
	0,
	255
], nC = {
	filled: !0,
	extruded: !1,
	wireframe: !1,
	_normalize: !0,
	_windingOrder: "CW",
	_full3d: !1,
	elevationScale: {
		type: "number",
		min: 0,
		value: 1
	},
	getPolygon: {
		type: "accessor",
		value: (e) => e.polygon
	},
	getElevation: {
		type: "accessor",
		value: 1e3
	},
	getFillColor: {
		type: "accessor",
		value: tC
	},
	getLineColor: {
		type: "accessor",
		value: tC
	},
	material: !0
}, rC = { enter: (e, t) => t.length ? t.subarray(t.length - e.length) : e }, iC = class extends Vx {
	getShaders(e) {
		return super.getShaders({
			vs: e === "top" ? QS : $S,
			fs: eC,
			defines: { RING_WINDING_ORDER_CW: !this.props._normalize && this.props._windingOrder === "CCW" ? 0 : 1 },
			modules: [
				Xf,
				Lu,
				Wp,
				XS
			]
		});
	}
	get wrapLongitude() {
		return !1;
	}
	getBounds() {
		return this.getAttributeManager()?.getBounds(["vertexPositions"]);
	}
	initializeState() {
		let { viewport: e } = this.context, { coordinateSystem: t } = this.props, { _full3d: n } = this.props;
		e.isGeospatial && t === Z.DEFAULT && (t = Z.LNGLAT);
		let r;
		t === Z.LNGLAT && (r = n ? e.projectPosition.bind(e) : e.projectFlat.bind(e)), this.setState({
			numInstances: 0,
			polygonTesselator: new qS({
				preproject: r,
				fp64: this.use64bitPositions(),
				IndexType: Uint32Array
			})
		});
		let i = this.getAttributeManager();
		i.remove(["instancePickingColors"]), i.add({
			indices: {
				size: 1,
				isIndexed: !0,
				update: this.calculateIndices,
				noAlloc: !0
			},
			vertexPositions: {
				size: 3,
				type: "float64",
				stepMode: "dynamic",
				fp64: this.use64bitPositions(),
				transition: rC,
				accessor: "getPolygon",
				update: this.calculatePositions,
				noAlloc: !0,
				shaderAttributes: { nextVertexPositions: { vertexOffset: 1 } }
			},
			instanceVertexValid: {
				size: 1,
				type: "uint16",
				stepMode: "instance",
				update: this.calculateVertexValid,
				noAlloc: !0
			},
			elevations: {
				size: 1,
				stepMode: "dynamic",
				transition: rC,
				accessor: "getElevation"
			},
			fillColors: {
				size: this.props.colorFormat.length,
				type: "unorm8",
				stepMode: "dynamic",
				transition: rC,
				accessor: "getFillColor",
				defaultValue: tC
			},
			lineColors: {
				size: this.props.colorFormat.length,
				type: "unorm8",
				stepMode: "dynamic",
				transition: rC,
				accessor: "getLineColor",
				defaultValue: tC
			},
			pickingColors: {
				size: 4,
				type: "uint8",
				stepMode: "dynamic",
				accessor: (e, { index: t, target: n }) => this.encodePickingColor(e && e.__source ? e.__source.index : t, n)
			}
		});
	}
	getPickingInfo(e) {
		let t = super.getPickingInfo(e), { index: n } = t, r = this.props.data;
		return r[0] && r[0].__source && (t.object = r.find((e) => e.__source.index === n)), t;
	}
	disablePickingIndex(e) {
		let t = this.props.data;
		if (t[0] && t[0].__source) for (let n = 0; n < t.length; n++) t[n].__source.index === e && this._disablePickingIndex(n);
		else super.disablePickingIndex(e);
	}
	draw({ uniforms: e }) {
		let { extruded: t, filled: n, wireframe: r, elevationScale: i } = this.props, { topModel: a, sideModel: o, wireframeModel: s, polygonTesselator: c } = this.state, l = {
			extruded: !!t,
			elevationScale: i,
			isWireframe: !1
		};
		s && r && (s.setInstanceCount(c.instanceCount - 1), s.shaderInputs.setProps({ solidPolygon: {
			...l,
			isWireframe: !0
		} }), s.draw(this.context.renderPass)), o && n && (o.setInstanceCount(c.instanceCount - 1), o.shaderInputs.setProps({ solidPolygon: l }), o.draw(this.context.renderPass)), a && n && (a.setVertexCount(c.vertexCount), a.shaderInputs.setProps({ solidPolygon: l }), a.draw(this.context.renderPass));
	}
	updateState(e) {
		super.updateState(e), this.updateGeometry(e);
		let { props: t, oldProps: n, changeFlags: r } = e, i = this.getAttributeManager();
		(r.extensionsChanged || t.filled !== n.filled || t.extruded !== n.extruded) && (this.state.models?.forEach((e) => e.destroy()), this.setState(this._getModels()), i.invalidateAll());
	}
	updateGeometry({ props: e, oldProps: t, changeFlags: n }) {
		if (n.dataChanged || n.updateTriggersChanged && (n.updateTriggersChanged.all || n.updateTriggersChanged.getPolygon)) {
			let { polygonTesselator: t } = this.state, r = e.data.attributes || {};
			t.updateGeometry({
				data: e.data,
				normalize: e._normalize,
				geometryBuffer: r.getPolygon,
				buffers: r,
				getGeometry: e.getPolygon,
				positionFormat: e.positionFormat,
				wrapLongitude: e.wrapLongitude,
				resolution: this.context.viewport.resolution,
				fp64: this.use64bitPositions(),
				dataChanged: n.dataChanged,
				full3d: e._full3d
			}), this.setState({
				numInstances: t.instanceCount,
				startIndices: t.vertexStarts
			}), n.dataChanged || this.getAttributeManager().invalidateAll();
		}
	}
	_getModels() {
		let { id: e, filled: t, extruded: n } = this.props, r, i, a;
		if (t) {
			let t = this.getShaders("top");
			t.defines.NON_INSTANCED_MODEL = 1;
			let n = this.getAttributeManager().getBufferLayouts({ isInstanced: !1 });
			r = new fh(this.context.device, {
				...t,
				id: `${e}-top`,
				topology: "triangle-list",
				bufferLayout: n,
				isIndexed: !0,
				userData: { excludeAttributes: { instanceVertexValid: !0 } }
			});
		}
		if (n) {
			let t = this.getAttributeManager().getBufferLayouts({ isInstanced: !0 });
			i = new fh(this.context.device, {
				...this.getShaders("side"),
				id: `${e}-side`,
				bufferLayout: t,
				geometry: new _h({
					topology: "triangle-strip",
					attributes: { positions: {
						size: 2,
						value: new Float32Array([
							1,
							0,
							0,
							0,
							1,
							1,
							0,
							1
						])
					} }
				}),
				isInstanced: !0,
				userData: { excludeAttributes: { indices: !0 } }
			}), a = new fh(this.context.device, {
				...this.getShaders("side"),
				id: `${e}-wireframe`,
				bufferLayout: t,
				geometry: new _h({
					topology: "line-strip",
					attributes: { positions: {
						size: 2,
						value: new Float32Array([
							1,
							0,
							0,
							0,
							0,
							1,
							1,
							1
						])
					} }
				}),
				isInstanced: !0,
				userData: { excludeAttributes: { indices: !0 } }
			});
		}
		return {
			models: [
				i,
				a,
				r
			].filter(Boolean),
			topModel: r,
			sideModel: i,
			wireframeModel: a
		};
	}
	calculateIndices(e) {
		let { polygonTesselator: t } = this.state;
		e.startIndices = t.indexStarts, e.value = t.get("indices");
	}
	calculatePositions(e) {
		let { polygonTesselator: t } = this.state;
		e.startIndices = t.vertexStarts, e.value = t.get("positions");
	}
	calculateVertexValid(e) {
		e.value = this.state.polygonTesselator.get("vertexValid");
	}
};
iC.defaultProps = nC, iC.layerName = "SolidPolygonLayer";
// node_modules/@deck.gl/json/dist/utils/assert.js
function aC(e, t = "") {
	if (!e) throw Error(`JSON conversion error ${t}`);
}
// node_modules/@deck.gl/json/dist/utils/get.js
function oC(e, t) {
	let n = lC(t), r = e;
	for (let e of n) r = sC(r) ? r[e] : void 0;
	return r;
}
function sC(e) {
	return typeof e == "object" && !!e;
}
var cC = {};
function lC(e) {
	if (typeof e == "string") {
		let t = cC[e];
		return t || (t = e.split("."), cC[e] = t), t;
	}
	return Array.isArray(e) ? e : [e];
}
// node_modules/@deck.gl/json/dist/utils/expression-eval.js
var uC = /* @__PURE__ */ c((/* @__PURE__ */ o(((e, t, n) => {
	(function(n) {
		var r = "Compound", i = "MemberExpression", a = "Literal", o = function(e, t) {
			var n = /* @__PURE__ */ Error(e + " at character " + t);
			throw n.index = t, n.description = e, n;
		}, s = !0, c = {
			"-": s,
			"!": s,
			"~": s,
			"+": s
		}, l = {
			"||": 1,
			"&&": 2,
			"|": 3,
			"^": 4,
			"&": 5,
			"==": 6,
			"!=": 6,
			"===": 6,
			"!==": 6,
			"<": 7,
			">": 7,
			"<=": 7,
			">=": 7,
			"<<": 8,
			">>": 8,
			">>>": 8,
			"+": 9,
			"-": 9,
			"*": 10,
			"/": 10,
			"%": 10
		}, u = function(e) {
			var t = 0, n;
			for (var r in e) (n = r.length) > t && e.hasOwnProperty(r) && (t = n);
			return t;
		}, d = u(c), f = u(l), p = {
			true: !0,
			false: !1,
			null: null
		}, m = "this", h = function(e) {
			return l[e] || 0;
		}, g = function(e, t, n) {
			return {
				type: e === "||" || e === "&&" ? "LogicalExpression" : "BinaryExpression",
				operator: e,
				left: t,
				right: n
			};
		}, _ = function(e) {
			return e >= 48 && e <= 57;
		}, v = function(e) {
			return e === 36 || e === 95 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 128 && !l[String.fromCharCode(e)];
		}, y = function(e) {
			return e === 36 || e === 95 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 48 && e <= 57 || e >= 128 && !l[String.fromCharCode(e)];
		}, b = function(e) {
			for (var t = 0, n = e.charAt, s = e.charCodeAt, u = function(t) {
				return n.call(e, t);
			}, b = function(t) {
				return s.call(e, t);
			}, x = e.length, S = function() {
				for (var e = b(t); e === 32 || e === 9 || e === 10 || e === 13;) e = b(++t);
			}, C = function() {
				var e = ee(), n, r;
				if (S(), b(t) === 63) {
					if (t++, n = C(), n || o("Expected expression", t), S(), b(t) === 58) return t++, r = C(), r || o("Expected expression", t), {
						type: "ConditionalExpression",
						test: e,
						consequent: n,
						alternate: r
					};
					o("Expected :", t);
				} else return e;
			}, w = function() {
				S();
				for (var n = e.substr(t, f), r = n.length; r > 0;) {
					if (l.hasOwnProperty(n) && (!v(b(t)) || t + n.length < e.length && !y(b(t + n.length)))) return t += r, n;
					n = n.substr(0, --r);
				}
				return !1;
			}, ee = function() {
				var e, n, r, i, a, s = te(), c, l, u;
				if (n = w(), !n) return s;
				for (a = {
					value: n,
					prec: h(n)
				}, c = te(), c || o("Expected expression after " + n, t), i = [
					s,
					a,
					c
				]; (n = w()) && (r = h(n), r !== 0);) {
					for (a = {
						value: n,
						prec: r
					}, u = n; i.length > 2 && r <= i[i.length - 2].prec;) c = i.pop(), n = i.pop().value, s = i.pop(), e = g(n, s, c), i.push(e);
					e = te(), e || o("Expected expression after " + u, t), i.push(a, e);
				}
				for (l = i.length - 1, e = i[l]; l > 1;) e = g(i[l - 1].value, i[l - 2], e), l -= 2;
				return e;
			}, te = function() {
				var n, r, i;
				if (S(), n = b(t), _(n) || n === 46) return ne();
				if (n === 39 || n === 34) return re();
				if (n === 91) return se();
				for (r = e.substr(t, d), i = r.length; i > 0;) {
					if (c.hasOwnProperty(r) && (!v(b(t)) || t + r.length < e.length && !y(b(t + r.length)))) return t += i, {
						type: "UnaryExpression",
						operator: r,
						argument: te(),
						prefix: !0
					};
					r = r.substr(0, --i);
				}
				return v(n) || n === 40 ? ae() : !1;
			}, ne = function() {
				for (var e = "", n, r; _(b(t));) e += u(t++);
				if (b(t) === 46) for (e += u(t++); _(b(t));) e += u(t++);
				if (n = u(t), n === "e" || n === "E") {
					for (e += u(t++), n = u(t), (n === "+" || n === "-") && (e += u(t++)); _(b(t));) e += u(t++);
					_(b(t - 1)) || o("Expected exponent (" + e + u(t) + ")", t);
				}
				return r = b(t), v(r) ? o("Variable names cannot start with a number (" + e + u(t) + ")", t) : r === 46 && o("Unexpected period", t), {
					type: a,
					value: parseFloat(e),
					raw: e
				};
			}, re = function() {
				for (var e = "", n = u(t++), r = !1, i; t < x;) {
					if (i = u(t++), i === n) {
						r = !0;
						break;
					}
					if (i === "\\") switch (i = u(t++), i) {
						case "n":
							e += "\n";
							break;
						case "r":
							e += "\r";
							break;
						case "t":
							e += "	";
							break;
						case "b":
							e += "\b";
							break;
						case "f":
							e += "\f";
							break;
						case "v":
							e += "\v";
							break;
						default: e += i;
					}
					else e += i;
				}
				return r || o("Unclosed quote after \"" + e + "\"", t), {
					type: a,
					value: e,
					raw: n + e + n
				};
			}, ie = function() {
				var n = b(t), r = t, i;
				for (v(n) ? t++ : o("Unexpected " + u(t), t); t < x && (n = b(t), y(n));) t++;
				return i = e.slice(r, t), p.hasOwnProperty(i) ? {
					type: a,
					value: p[i],
					raw: i
				} : i === m ? { type: "ThisExpression" } : {
					type: "Identifier",
					name: i
				};
			}, T = function(e) {
				for (var n, i = [], a, s = !1, c = 0; t < x;) {
					if (S(), n = b(t), n === e) {
						s = !0, t++, e === 41 && c && c >= i.length && o("Unexpected token " + String.fromCharCode(e), t);
						break;
					}
					if (n === 44) {
						if (t++, c++, c !== i.length) {
							if (e === 41) o("Unexpected token ,", t);
							else if (e === 93) for (var l = i.length; l < c; l++) i.push(null);
						}
					} else a = C(), a && a.type !== r || o("Expected comma", t), i.push(a);
				}
				return s || o("Expected " + String.fromCharCode(e), t), i;
			}, ae = function() {
				var e = b(t), n = e === 40 ? oe() : ie();
				for (S(), e = b(t); e === 46 || e === 91 || e === 40;) t++, e === 46 ? (S(), n = {
					type: i,
					computed: !1,
					object: n,
					property: ie()
				}) : e === 91 ? (n = {
					type: i,
					computed: !0,
					object: n,
					property: C()
				}, S(), e = b(t), e !== 93 && o("Unclosed [", t), t++) : e === 40 && (n = {
					type: "CallExpression",
					arguments: T(41),
					callee: n
				}), S(), e = b(t);
				return n;
			}, oe = function() {
				t++;
				var e = C();
				if (S(), b(t) === 41) return t++, e;
				o("Unclosed (", t);
			}, se = function() {
				return t++, {
					type: "ArrayExpression",
					elements: T(93)
				};
			}, ce = [], le, ue; t < x;) le = b(t), le === 59 || le === 44 ? t++ : (ue = C()) ? ce.push(ue) : t < x && o("Unexpected \"" + u(t) + "\"", t);
			return ce.length === 1 ? ce[0] : {
				type: r,
				body: ce
			};
		};
		if (b.version = "0.3.5", b.toString = function() {
			return "JavaScript Expression Parser (JSEP) v" + b.version;
		}, b.addUnaryOp = function(e) {
			return d = Math.max(e.length, d), c[e] = s, this;
		}, b.addBinaryOp = function(e, t) {
			return f = Math.max(e.length, f), l[e] = t, this;
		}, b.addLiteral = function(e, t) {
			return p[e] = t, this;
		}, b.removeUnaryOp = function(e) {
			return delete c[e], e.length === d && (d = u(c)), this;
		}, b.removeAllUnaryOps = function() {
			return c = {}, d = 0, this;
		}, b.removeBinaryOp = function(e) {
			return delete l[e], e.length === f && (f = u(l)), this;
		}, b.removeAllBinaryOps = function() {
			return l = {}, f = 0, this;
		}, b.removeLiteral = function(e) {
			return delete p[e], this;
		}, b.removeAllLiterals = function() {
			return p = {}, this;
		}, e === void 0) {
			var x = n.jsep;
			n.jsep = b, b.noConflict = function() {
				return n.jsep === b && (n.jsep = x), b;
			};
		} else t !== void 0 && t.exports ? e = t.exports = b : e.parse = b;
	})(n);
})))(), 1), dC = {
	"||": (e, t) => e || t,
	"&&": (e, t) => e && t,
	"|": (e, t) => e | t,
	"^": (e, t) => e ^ t,
	"&": (e, t) => e & t,
	"==": (e, t) => e == t,
	"!=": (e, t) => e != t,
	"===": (e, t) => e === t,
	"!==": (e, t) => e !== t,
	"<": (e, t) => e < t,
	">": (e, t) => e > t,
	"<=": (e, t) => e <= t,
	">=": (e, t) => e >= t,
	"<<": (e, t) => e << t,
	">>": (e, t) => e >> t,
	">>>": (e, t) => e >>> t,
	"+": (e, t) => e + t,
	"-": (e, t) => e - t,
	"*": (e, t) => e * t,
	"/": (e, t) => e / t,
	"%": (e, t) => e % t
}, fC = {
	"-": (e) => -e,
	"+": (e) => +e,
	"~": (e) => ~e,
	"!": (e) => !e
};
function pC(e, t) {
	return e.map(function(e) {
		return hC(e, t);
	});
}
function mC(e, t) {
	let n = hC(e.object, t), r;
	if (r = e.computed ? hC(e.property, t) : e.property.name, /^__proto__|prototype|constructor$/.test(r)) throw Error(`Access to member "${r}" disallowed.`);
	return [n, n[r]];
}
function hC(e, t) {
	let n = e;
	switch (n.type) {
		case "ArrayExpression": return pC(n.elements, t);
		case "BinaryExpression": return dC[n.operator](hC(n.left, t), hC(n.right, t));
		case "CallExpression":
			let e, r, i;
			return n.callee.type === "MemberExpression" ? (i = mC(n.callee, t), e = i[0], r = i[1]) : r = hC(n.callee, t), typeof r == "function" ? r.apply(e, pC(n.arguments, t)) : void 0;
		case "ConditionalExpression": return hC(n.test, t) ? hC(n.consequent, t) : hC(n.alternate, t);
		case "Identifier": return t[n.name];
		case "Literal": return n.value;
		case "LogicalExpression": return n.operator === "||" ? hC(n.left, t) || hC(n.right, t) : n.operator === "&&" ? hC(n.left, t) && hC(n.right, t) : dC[n.operator](hC(n.left, t), hC(n.right, t));
		case "MemberExpression": return mC(n, t)[1];
		case "ThisExpression": return t;
		case "UnaryExpression": return fC[n.operator](hC(n.argument, t));
		default: return;
	}
}
// node_modules/@deck.gl/json/dist/helpers/parse-expression-string.js
var gC = { "-": (e) => e };
function _C(e, t) {
	if (e in gC) return gC[e];
	let n, r = (0, uC.default)(e);
	return r.type === "Identifier" ? n = (t) => oC(t, e) : (vC(r, (e) => {
		if (e.type === "CallExpression") throw Error("Function calls not allowed in JSON expressions");
	}), n = (e) => hC(r, e)), gC[e] = n, n;
}
function vC(e, t) {
	if (Array.isArray(e)) e.forEach((e) => vC(e, t));
	else if (e && typeof e == "object") {
		e.type && t(e);
		for (let n in e) vC(e[n], t);
	}
}
// node_modules/@deck.gl/json/dist/syntactic-sugar.js
var yC = "@@type", bC = "@@function", xC = (e) => e && typeof e == "object", SC = class {
	constructor(...e) {
		this.typeKey = yC, this.functionKey = bC, this.log = console, this.classes = {}, this.reactComponents = {}, this.enumerations = {}, this.constants = {}, this.functions = {}, this.React = null, this.convertFunction = _C, this.preProcessClassProps = (e, t) => t, this.postProcessConvertedJson = (e) => e;
		for (let t of e) this.merge(t);
	}
	merge(e) {
		for (let t in e) switch (t) {
			case "layers":
			case "views":
				Object.assign(this.classes, e[t]);
				break;
			default: if (t in this) {
				let n = e[t];
				this[t] = xC(this[t]) ? Object.assign(this[t], n) : n;
			}
		}
	}
	validate(e) {
		return aC(!this.typeKey || typeof this.typeKey == "string"), aC(xC(this.classes)), !0;
	}
};
// node_modules/@deck.gl/json/dist/helpers/convert-functions.js
function CC(e) {
	return typeof e == "string" && e.startsWith("@@=");
}
function wC(e) {
	return e.replace("@@=", "");
}
function TC(e, t) {
	let n = {};
	for (let r in e) {
		let i = e[r];
		CC(i) && (i = wC(i), i = _C(i, t)), n[r] = i;
	}
	return n;
}
// node_modules/@deck.gl/json/dist/helpers/instantiate-class.js
function EC(e, t, n) {
	let r = n.classes[e], i = n.reactComponents[e];
	if (!r && !i) {
		let { log: r } = n;
		if (r) {
			let n = JSON.stringify(t, null, 0).slice(0, 40);
			r.warn(`JSON converter: No registered class of type ${e}(${n}...)  `);
		}
		return null;
	}
	return r ? DC(r, t, n) : OC(i, t, n);
}
function DC(e, t, n) {
	return n.preProcessClassProps && (t = n.preProcessClassProps(e, t, n)), t = TC(t, n), new e(t);
}
function OC(e, t, n) {
	let { React: r } = n, { children: i = [] } = t;
	return delete t.children, n.preProcessClassProps && (t = n.preProcessClassProps(e, t, n)), t = TC(t, n), r.createElement(e, t, i);
}
// node_modules/@deck.gl/json/dist/helpers/execute-function.js
function kC(e, t, n) {
	let r = n.functions[e];
	if (!r) {
		let { log: r } = n;
		if (r) {
			let n = JSON.stringify(t, null, 0).slice(0, 40);
			r.warn(`JSON converter: No registered function ${e}(${n}...)  `);
		}
		return null;
	}
	return r(t);
}
// node_modules/@deck.gl/json/dist/helpers/parse-json.js
function AC(e) {
	return typeof e == "string" ? JSON.parse(e) : e;
}
// node_modules/@deck.gl/json/dist/json-converter.js
var jC = (e) => e && typeof e == "object", MC = class {
	constructor(e) {
		this.log = console, this.onJSONChange = () => {}, this.json = null, this.convertedJson = null, this.setProps(e);
	}
	finalize() {}
	setProps(e) {
		"configuration" in e && (this.configuration = e.configuration instanceof SC ? e.configuration : new SC(e.configuration)), "onJSONChange" in e && (this.onJSONChange = e.onJSONChange);
	}
	mergeConfiguration(e) {
		this.configuration.merge(e);
	}
	convert(e) {
		if (!e || e === this.json) return this.convertedJson;
		this.json = e;
		let t = NC(AC(e), this.configuration);
		return t = this.configuration.postProcessConvertedJson(t), this.convertedJson = t, t;
	}
	convertJson(e) {
		return this.convert(e);
	}
};
function NC(e, t) {
	return t = new SC(t), PC(e, "", t);
}
function PC(e, t, n) {
	return Array.isArray(e) ? e.map((e, t) => PC(e, String(t), n)) : FC(e, n) ? IC(e, n) : jC(e) ? "@@function" in e ? LC(e, n) : RC(e, n) : typeof e == "string" ? zC(e, t, n) : e;
}
function FC(e, t) {
	let { typeKey: n } = t;
	return jC(e) && !!e[n];
}
function IC(e, t) {
	let { typeKey: n } = t, r = e[n], i = { ...e };
	return delete i[n], i = RC(i, t), EC(r, i, t);
}
function LC(e, t) {
	let { functionKey: n } = t, r = e[n], i = { ...e };
	return delete i[n], i = RC(i, t), kC(r, i, t);
}
function RC(e, t) {
	aC(jC(e));
	let n = {};
	for (let r in e) {
		let i = e[r];
		n[r] = PC(i, r, t);
	}
	return n;
}
function zC(e, t, n) {
	if (e.startsWith("@@=") && n.convertFunction) return e = e.replace("@@=", ""), n.convertFunction(e, n);
	if (e.startsWith("@@#")) {
		if (e = e.replace("@@#", ""), n.constants[e]) return n.constants[e];
		let [t, r] = e.split(".");
		return n.enumerations[t][r];
	}
	return e;
}
// src/solar.ts
function BC(e, t) {
	if (e === null || !Number.isFinite(e)) return [
		160,
		160,
		160
	];
	let n = Math.max(0, Math.min(e / t, 1));
	return n <= .5 ? [
		255,
		Math.round(255 - n * 254),
		0
	] : [
		255,
		Math.round(256 * (1 - n)),
		0
	];
}
function VC(e, t, n, r) {
	if (!e || t === void 0) return {
		annual: null,
		instant: null,
		sunlit: null
	};
	let i = e.valid[t] && e.timestamps[n] === r;
	return {
		annual: e.annual[t] ?? null,
		instant: i ? e.irradiance[n]?.[t] ?? null : null,
		sunlit: i ? e.sunlit[n]?.[t] ?? null : null
	};
}
// src/index.ts
var HC = /* @__PURE__ */ new WeakMap(), UC = new MC({ configuration: { classes: {
	SolidPolygonLayer: iC,
	PathLayer: kS,
	MapView: dg
} } });
function WC(e) {
	let t = e.data.steps[Number(e.slider.value)];
	if (!t) return;
	let n = t.elevation > 0, r = { ambient: new Qp({
		color: [
			255,
			255,
			255
		],
		intensity: .65
	}) };
	r.sun = new rm({
		color: [
			255,
			250,
			238
		],
		intensity: n ? 1.2 : 0,
		direction: n ? t.direction : [
			0,
			0,
			-1
		],
		_shadow: !0
	}), e.effect.setProps(r), e.effect.shadowColor = [
		0,
		0,
		0,
		n && e.data.shadows ? .55 : 0
	], e.label.textContent = t.label, e.status.textContent = `Sun elevation ${t.elevation.toFixed(1)}° · ${n ? "Clear sky · direct sunlight" : "Night · cast shadows off"}`, e.slider.setAttribute("aria-valuetext", t.label), e.root.dataset.timestamp = String(t.timestamp), e.root.dataset.elevation = String(t.elevation), KC(e), e.deck.redraw("sun changed");
}
function GC(e, t) {
	let n = Number(e.slider.value);
	return VC(e.solarId === e.data.solar_id ? e.solar : null, e.solarIndex.get(t), n, e.data.steps[n]?.timestamp);
}
function KC(e) {
	if (!e.layers.length) return;
	let t = e.data.color_mode ?? "reference", n = `${t}:${e.solarId}:${e.data.solar_id}:${t === "instant" ? e.slider.value : ""}`;
	e.colorKey !== n && (e.colorKey = n, e.layers = e.layers.map((r) => r.id === "roofs" ? r.clone({
		getFillColor: (n) => t === "reference" ? n.color : BC(t === "annual" ? GC(e, n.building_id).annual : GC(e, n.building_id).instant, t === "annual" ? 2200 : 1200),
		updateTriggers: { getFillColor: n }
	}) : r), e.highlightKey = "", qC(e));
}
function qC(e) {
	if (!e.layers.length) return;
	let t = e.data.highlighted_building_ids ?? [], n = JSON.stringify(t);
	if (n === e.highlightKey) return;
	e.highlightKey = n;
	let r = new Set(t), i = new kS({
		id: "chat-results",
		data: e.roofs.filter((e) => r.has(e.building_id)).flatMap((e) => e.polygon.map((t) => ({
			building_id: e.building_id,
			path: t.map((e) => [
				e[0],
				e[1],
				e[2] + .3
			])
		}))),
		getPath: (e) => e.path,
		getColor: [
			0,
			235,
			255
		],
		getWidth: 4,
		widthUnits: "pixels",
		pickable: !0,
		shadowEnabled: !1,
		parameters: { depthCompare: "always" }
	});
	e.deck.setProps({ layers: [...e.layers, i] }), e.root.dataset.highlightedIds = JSON.stringify(t);
}
var JC = ({ parentElement: e, data: t, setStateValue: n }) => {
	let r = HC.get(e);
	if (r?.cleanup && clearTimeout(r.cleanup), r && !r.root.isConnected && (r.deck.finalize(), HC.delete(e), r = void 0), !r) {
		let i = e.querySelector(".shadow-root"), a = i.querySelector(".shadow-canvas"), o = i.querySelector("input"), s = i.querySelector("output"), c = i.querySelector(".shadow-status"), l = {
			root: i,
			slider: o,
			label: s,
			status: c,
			sceneId: "",
			cameraCommand: -1,
			frame: 0,
			cleanup: null,
			effect: new pm({ sun: new rm({
				direction: [
					0,
					0,
					-1
				],
				_shadow: !0
			}) }),
			solar: null,
			solarId: "",
			solarIndex: /* @__PURE__ */ new Map(),
			colorKey: "",
			layers: [],
			roofs: [],
			highlightKey: "",
			info: {},
			data: t,
			emit: n,
			draws: 0,
			renderMs: 0,
			lastStart: 0,
			deck: null
		};
		try {
			l.deck = new zy({
				parent: a,
				views: new dg({ repeat: !1 }),
				controller: !0,
				initialViewState: t.camera ?? {
					longitude: -73.9875,
					latitude: 40.6935,
					zoom: 14.3,
					pitch: 55,
					bearing: -20
				},
				effects: [l.effect],
				width: "100%",
				height: "100%",
				useDevicePixels: Math.min(window.devicePixelRatio, 2),
				getTooltip: ({ object: e, layer: t }) => {
					let n = l.info[e?.building_id];
					if (!n) return null;
					let r = GC(l, e.building_id), i = n.roof_exposure === null ? "No exposure data" : `June 21 exposure · ${n.roof_exposure.toFixed(2)} (units unspecified)`, a = [
						r.annual === null ? "Annual resource unavailable" : `Annual clear-sky · ${r.annual.toFixed(1)} kWh/m²/year`,
						r.instant === null ? "Selected-time result unavailable" : `Clear-sky irradiance · ${r.instant.toFixed(1)} W/m²`,
						r.sunlit === null ? "" : `Sunlit roof · ${(r.sunlit * 100).toFixed(1)}%`
					].filter(Boolean).join("\n"), o = t?.id === "roofs" || t?.id === "chat-results" ? `Roof area · ${n.roof_area_m2.toLocaleString(void 0, { maximumFractionDigits: 2 })} m²\n${(l.data.color_mode ?? "reference") === "reference" ? i : a}` : "Façade";
					return { text: `Building ${e.building_id}\n${o}\nBIN ${n.bin}` };
				},
				onBeforeRender: () => {
					l.lastStart = performance.now();
				},
				onAfterRender: () => {
					l.draws++, l.renderMs = performance.now() - l.lastStart, i.dataset.draws = String(l.draws), i.dataset.renderMs = l.renderMs.toFixed(1);
				},
				onError: (e) => {
					c.textContent = `3D rendering failed: ${e.message}. Try a smaller area or enable WebGL2 in your browser.`, i.dataset.error = e.message, i.dataset.errorStack = e.stack;
				}
			});
		} catch (e) {
			c.textContent = `WebGL2 is required for 3D shadows. ${String(e)}`, i.dataset.error = String(e);
			return;
		}
		o.oninput = () => {
			s.textContent = l.data.steps[Number(o.value)].label, l.data.live && !l.frame && (l.frame = requestAnimationFrame(() => {
				l.frame = 0, WC(l);
			}));
		}, o.onchange = () => {
			l.frame &&= (cancelAnimationFrame(l.frame), 0), WC(l), l.emit("slot", Number(o.value));
		}, a.addEventListener("webglcontextlost", () => {
			c.textContent = "The graphics context was lost. Reload the page or load a smaller area.";
		}, !0), HC.set(e, l), r = l, t.scene || n("loaded_scene_id", ""), t.solar || n("loaded_solar_id", "");
	}
	if (r.data = t, r.emit = n, r.slider.max = String(t.steps.length - 1), r.slider.value = String(Math.min(t.slot, t.steps.length - 1)), r.root.dataset.live = String(t.live), r.root.dataset.shadows = String(t.shadows), r.sceneId !== t.scene_id && t.scene) {
		let n = r;
		n.sceneId = t.scene_id;
		let i = Uint8Array.from(atob(t.scene), (e) => e.charCodeAt(0)), a = new Blob([i]).stream().pipeThrough(new DecompressionStream("gzip"));
		new Response(a).text().then((r) => {
			if (HC.get(e) !== n || n.sceneId !== t.scene_id) return;
			let i = JSON.parse(r);
			n.info = i.buildingInfo;
			let a = UC.convert(i);
			n.layers = a.layers, n.roofs = i.layers.find((e) => e.id === "roofs").data, n.highlightKey = "", n.colorKey = "", qC(n), n.deck.setProps({ initialViewState: n.data.camera ?? a.initialViewState }), n.root.dataset.sceneId = t.scene_id, WC(n), n.emit("loaded_scene_id", t.scene_id);
		}).catch((e) => {
			n.status.textContent = `Could not load the 3D scene: ${String(e)}`;
		});
	}
	if (r.solarId !== t.solar_id && t.solar) {
		let n = r, i = t.solar_id ?? "";
		n.solarId = i, n.solar = null, n.solarIndex.clear();
		let a = Uint8Array.from(atob(t.solar), (e) => e.charCodeAt(0)), o = new Blob([a]).stream().pipeThrough(new DecompressionStream("gzip"));
		new Response(o).text().then((t) => {
			HC.get(e) === n && n.solarId === i && (n.solar = JSON.parse(t), n.solarIndex = new Map(n.solar.ids.map((e, t) => [e, t])), n.colorKey = "", WC(n), n.emit("loaded_solar_id", i));
		}).catch((e) => {
			n.status.textContent = `Could not load roof solar data: ${String(e)}`, n.solarId = "";
		});
	}
	t.camera && r.cameraCommand !== t.camera_command && (r.deck.setProps({ initialViewState: t.camera }), r.cameraCommand = t.camera_command, r.root.dataset.cameraCommand = String(t.camera_command)), qC(r), WC(r);
	let i = r;
	return () => {
		i.cleanup = setTimeout(() => {
			i.frame && cancelAnimationFrame(i.frame), i.deck.finalize(), HC.delete(e);
		}, 0);
	};
};
export { JC as default };
