(function(){"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const k=Symbol("Comlink.proxy"),K=Symbol("Comlink.endpoint"),Q=Symbol("Comlink.releaseProxy"),m=Symbol("Comlink.finalizer"),p=Symbol("Comlink.thrown"),P=u=>typeof u=="object"&&u!==null||typeof u=="function",uu={canHandle:u=>P(u)&&u[k],serialize(u){const{port1:D,port2:r}=new MessageChannel;return h(u,D),[r,[r]]},deserialize(u){return u.start(),tu(u)}},Du={canHandle:u=>P(u)&&p in u,serialize({value:u}){let D;return u instanceof Error?D={isError:!0,value:{message:u.message,name:u.name,stack:u.stack}}:D={isError:!1,value:u},[D,[]]},deserialize(u){throw u.isError?Object.assign(new Error(u.value.message),u.value):u.value}},I=new Map([["proxy",uu],["throw",Du]]);function ru(u,D){for(const r of u)if(D===r||r==="*"||r instanceof RegExp&&r.test(D))return!0;return!1}function h(u,D=globalThis,r=["*"]){D.addEventListener("message",function e(t){if(!t||!t.data)return;if(!ru(r,t.origin)){console.warn(`Invalid origin '${t.origin}' for comlink proxy`);return}const{id:F,type:n,path:A}=Object.assign({path:[]},t.data),s=(t.data.argumentList||[]).map(B);let a;try{const C=A.slice(0,-1).reduce((E,i)=>E[i],u),o=A.reduce((E,i)=>E[i],u);switch(n){case"GET":a=o;break;case"SET":C[A.slice(-1)[0]]=B(t.data.value),a=!0;break;case"APPLY":a=o.apply(C,s);break;case"CONSTRUCT":{const E=new o(...s);a=au(E)}break;case"ENDPOINT":{const{port1:E,port2:i}=new MessageChannel;h(u,i),a=Au(E,[E])}break;case"RELEASE":a=void 0;break;default:return}}catch(C){a={value:C,[p]:0}}Promise.resolve(a).catch(C=>({value:C,[p]:0})).then(C=>{const[o,E]=x(C);D.postMessage(Object.assign(Object.assign({},o),{id:F}),E),n==="RELEASE"&&(D.removeEventListener("message",e),L(D),m in u&&typeof u[m]=="function"&&u[m]())}).catch(C=>{const[o,E]=x({value:new TypeError("Unserializable return value"),[p]:0});D.postMessage(Object.assign(Object.assign({},o),{id:F}),E)})}),D.start&&D.start()}function eu(u){return u.constructor.name==="MessagePort"}function L(u){eu(u)&&u.close()}function tu(u,D){return b(u,[],D)}function g(u){if(u)throw new Error("Proxy has been released and is not useable")}function O(u){return f(u,{type:"RELEASE"}).then(()=>{L(u)})}const y=new WeakMap,d="FinalizationRegistry"in globalThis&&new FinalizationRegistry(u=>{const D=(y.get(u)||0)-1;y.set(u,D),D===0&&O(u)});function nu(u,D){const r=(y.get(D)||0)+1;y.set(D,r),d&&d.register(u,D,u)}function Fu(u){d&&d.unregister(u)}function b(u,D=[],r=function(){}){let e=!1;const t=new Proxy(r,{get(F,n){if(g(e),n===Q)return()=>{Fu(t),O(u),e=!0};if(n==="then"){if(D.length===0)return{then:()=>t};const A=f(u,{type:"GET",path:D.map(s=>s.toString())}).then(B);return A.then.bind(A)}return b(u,[...D,n])},set(F,n,A){g(e);const[s,a]=x(A);return f(u,{type:"SET",path:[...D,n].map(C=>C.toString()),value:s},a).then(B)},apply(F,n,A){g(e);const s=D[D.length-1];if(s===K)return f(u,{type:"ENDPOINT"}).then(B);if(s==="bind")return b(u,D.slice(0,-1));const[a,C]=q(A);return f(u,{type:"APPLY",path:D.map(o=>o.toString()),argumentList:a},C).then(B)},construct(F,n){g(e);const[A,s]=q(n);return f(u,{type:"CONSTRUCT",path:D.map(a=>a.toString()),argumentList:A},s).then(B)}});return nu(t,u),t}function Cu(u){return Array.prototype.concat.apply([],u)}function q(u){const D=u.map(x);return[D.map(r=>r[0]),Cu(D.map(r=>r[1]))]}const z=new WeakMap;function Au(u,D){return z.set(u,D),u}function au(u){return Object.assign(u,{[k]:!0})}function x(u){for(const[D,r]of I)if(r.canHandle(u)){const[e,t]=r.serialize(u);return[{type:"HANDLER",name:D,value:e},t]}return[{type:"RAW",value:u},z.get(u)||[]]}function B(u){switch(u.type){case"HANDLER":return I.get(u.name).deserialize(u.value);case"RAW":return u.value}}function f(u,D,r){return new Promise(e=>{const t=Eu();u.addEventListener("message",function F(n){!n.data||!n.data.id||n.data.id!==t||(u.removeEventListener("message",F),e(n.data))}),u.start&&u.start(),u.postMessage(Object.assign({id:t},D),r)})}function Eu(){return new Array(4).fill(0).map(()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16)).join("-")}function ou(u){return u&&u.__esModule&&Object.prototype.hasOwnProperty.call(u,"default")?u.default:u}var w={exports:{}},N={exports:{}};(function(u){function D(r){return r&&r.__esModule?r:{default:r}}u.exports=D,u.exports.__esModule=!0,u.exports.default=u.exports})(N);var su=N.exports,v={exports:{}},S={exports:{}},_={exports:{}},H;function W(){return H||(H=1,function(u){function D(r,e){(e==null||e>r.length)&&(e=r.length);for(var t=0,F=new Array(e);t<e;t++)F[t]=r[t];return F}u.exports=D,u.exports.__esModule=!0,u.exports.default=u.exports}(_)),_.exports}var j;function iu(){return j||(j=1,function(u){var D=W();function r(e){if(Array.isArray(e))return D(e)}u.exports=r,u.exports.__esModule=!0,u.exports.default=u.exports}(S)),S.exports}var T={exports:{}},U;function Bu(){return U||(U=1,function(u){function D(r){if(typeof Symbol<"u"&&r[Symbol.iterator]!=null||r["@@iterator"]!=null)return Array.from(r)}u.exports=D,u.exports.__esModule=!0,u.exports.default=u.exports}(T)),T.exports}var M={exports:{}},V;function cu(){return V||(V=1,function(u){var D=W();function r(e,t){if(e){if(typeof e=="string")return D(e,t);var F=Object.prototype.toString.call(e).slice(8,-1);if(F==="Object"&&e.constructor&&(F=e.constructor.name),F==="Map"||F==="Set")return Array.from(e);if(F==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(F))return D(e,t)}}u.exports=r,u.exports.__esModule=!0,u.exports.default=u.exports}(M)),M.exports}var R={exports:{}},G;function fu(){return G||(G=1,function(u){function D(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}u.exports=D,u.exports.__esModule=!0,u.exports.default=u.exports}(R)),R.exports}var $;function lu(){return $||($=1,function(u){var D=iu(),r=Bu(),e=cu(),t=fu();function F(n){return D(n)||r(n)||e(n)||t()}u.exports=F,u.exports.__esModule=!0,u.exports.default=u.exports}(v)),v.exports}var l={},Y;function pu(){if(Y)return l;Y=1,Object.defineProperty(l,"__esModule",{value:!0});function u(D,r){if(typeof D!="number"||isNaN(D)||D<1||D===1/0)throw new Error("`"+D+"` is not a valid argument for n-gram");if(r=r||D,r<D)throw new Error("to must be larger tha from");return e;function e(t){const F=new Set;if(t==null)return Array.from(F);t=t.slice?t:String(t);for(let n=D;n<=r;n++){let A=t.length-n+1;if(!(A<1))for(;A--;)F.add(t.slice(A,A+n))}return Array.from(F)}}return l.default=u,l.bigram=u(2),l.trigram=u(3),l}(function(u,D){var r=su;Object.defineProperty(D,"__esModule",{value:!0}),D.default=void 0;var e=r(lu()),t=pu(),F=function(){var C=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"";return!C||!C.trim()?"":"  ".concat(C.trim().replace(/\s+/g," ").replace(/\s/g,"  ")," ").toLowerCase()},n=function(){var C=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"";return(0,e.default)(new Set((0,t.trigram)(F(C)).filter(function(o){return!/^(?:[0-9A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u052F\u0531-\u0556\u0559\u0560-\u0588\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u065F\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06EF\u06FA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07CA-\u07F5\u07FA\u07FD\u0800-\u082D\u0840-\u085B\u0860-\u086A\u0870-\u0887\u0889-\u088E\u0898-\u08E1\u08E3-\u0963\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09F0\u09F1\u09FC\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A70-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CF1\u0CF2\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D7A-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u103F\u1050-\u108F\u109A-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1715\u171F-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u180B-\u180D\u180F\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F\u1AA7\u1AB0-\u1ACE\u1B00-\u1B4C\u1B6B-\u1B73\u1B80-\u1BAF\u1BBA-\u1BF3\u1C00-\u1C37\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CD0-\u1CD2\u1CD4-\u1CFA\u1D00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u20D0-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005\u3006\u302A-\u302F\u3031-\u3035\u303B\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA672\uA674-\uA67D\uA67F-\uA6E5\uA6F0\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA827\uA82C\uA840-\uA873\uA880-\uA8C5\uA8E0-\uA8F7\uA8FB\uA8FD-\uA8FF\uA90A-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF\uA9E0-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABEA\uABEC\uABED\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD27\uDE80-\uDEA9\uDEAB\uDEAC\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF50\uDF70-\uDF85\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC46\uDC70-\uDC75\uDC7F-\uDCBA\uDCC2\uDCD0-\uDCE8\uDD00-\uDD34\uDD44-\uDD47\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDC9-\uDDCC\uDDCE\uDDCF\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3B-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC5E-\uDC61\uDC80-\uDCC5\uDCC7\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE80-\uDEB8\uDF00-\uDF1A\uDF1D-\uDF2B\uDF40-\uDF46]|\uD806[\uDC00-\uDC3A\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD35\uDD37\uDD38\uDD3B-\uDD43\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE1\uDDE3\uDDE4\uDE00-\uDE3E\uDE47\uDE50-\uDE99\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDEE0-\uDEF6\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3\uDFE4\uDFF0\uDFF1]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD833[\uDF00-\uDF2D\uDF30-\uDF46]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD837[\uDF00-\uDF1E]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDD00-\uDD2C\uDD30-\uDD3D\uDD4E\uDE90-\uDEAE\uDEC0-\uDEEF]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A]|\uDB40[\uDD00-\uDDEF])[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF][\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]$/gi.test(o)})))},A=function(){var C=arguments.length>0&&arguments[0]!==void 0?arguments[0]:"",o=arguments.length>1&&arguments[1]!==void 0?arguments[1]:"";if(C&&C.trim()&&C===o)return 1;var E=n(C),i=n(o),X=(0,e.default)(new Set([].concat((0,e.default)(E),(0,e.default)(i)))),Z=[];return E.forEach(function(J){i.includes(J)&&Z.push(J)}),X.length===0?0:Z.length/X.length},s=A;D.default=s,u.exports=A})(w,w.exports);var gu=w.exports,yu=ou(gu);const du=()=>{c==null||c("Starting");let u=0;const D=5e8;for(let r=0;r<D;r++)r%(D/100)===0&&(c==null||c(`${100*r/D}% done`)),u+=Math.sqrt(Math.random())**2;return u},xu=(u,D,r,e=.25)=>u.filter(t=>yu(String(t[D]),r)>e);let c;h({expensiveFunction:du,fuzzySearch:xu,onProgress:u=>c=u})})();