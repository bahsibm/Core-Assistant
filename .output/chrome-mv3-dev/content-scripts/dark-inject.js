(function(){function e(e){return e}var t=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,n=`#181a1b`,r=`jarvis-dark-override`,i=`jarvis-meta-theme-color`,a=`jarvis-meta-color-scheme`,o=`invert(100%) hue-rotate(180deg)`,s=`
/* ═══════════════════════════════════════════════════════════════════════════
   Jarvis Dark Theme — Dark Reader Filter mode (port)
   ═══════════════════════════════════════════════════════════════════════════ */

@media screen {

/* 1. Leading rule — tüm sayfayı ters çevir */
html {
  -webkit-filter: ${o} !important;
  filter: ${o} !important;
}

/* 2. Reverse rule — medyayı tekrar ters çevir → orijinal görünüm korunur */
img,
video,
:not(object):not(body) > embed,
object,
svg image,
[style*="background:url"],
[style*="background-image:url"],
[style*="background: url"],
[style*="background-image: url"],
[background],
twitterwidget,
.sr-reader,
.sr-backdrop,
iframe:fullscreen,
[class="opinary-iframe"] {
  -webkit-filter: ${o} !important;
  filter: ${o} !important;
}

/* 3. NO INVERT — yukarıdakilerin çocukları çift ters çevrilmesin */
[style*="background:url"] *,
[style*="background-image:url"] *,
[style*="background: url"] *,
[style*="background-image: url"] *,
input,
[background] *,
img[src^="https://s0.wp.com/latex.php"],
img.Wirisformula,
twitterwidget .NaturalImage-image {
  -webkit-filter: none !important;
  filter: none !important;
}

/* 4. REMOVE BG */
.compatibility-with-darkreader-below-4-3-3 {
  background: white !important;
}

/* 5. Tam ekran (fullscreen) → filtreyi kapat */
:-webkit-full-screen,
:-webkit-full-screen * {
  -webkit-filter: none !important;
  filter: none !important;
}
:-moz-full-screen,
:-moz-full-screen * {
  -webkit-filter: none !important;
  filter: none !important;
}
:fullscreen,
:fullscreen * {
  -webkit-filter: none !important;
  filter: none !important;
}

/* 6. Sayfa arka planı — beyaz bırak; leading filter onu koyuya çevirir */
html {
  background: rgb(255, 255, 255) !important;
}

}
`;function c(e){if(e.getElementById(`jarvis-dark-override`))return;let t=e.createElement(`style`);t.id=r,t.textContent=s,(e.head||e.documentElement).appendChild(t)}function l(e){e.getElementById(r)?.remove()}function u(e){let t=e.head;t&&(f(e,t,`theme-color`,i,n),f(e,t,`color-scheme`,a,`light`))}function d(e){for(let t of[i,a]){let n=e.getElementById(t);if(!n)continue;let r=n.getAttribute(`data-jarvis-orig`);r==null?n.remove():(n.content=r,n.removeAttribute(`data-jarvis-orig`),n.removeAttribute(`id`))}}function f(e,t,n,r,i){if(e.getElementById(r))return;let a=e.querySelector(`meta[name="${n}"]`);if(a)a.setAttribute(`data-jarvis-orig`,a.content),a.content=i,a.id=r;else{let a=e.createElement(`meta`);a.name=n,a.content=i,a.id=r,t.prepend(a)}}var p=!1;function m(){if(!p){if(p=!0,console.log(`[dark-inject] enable() — karanlık mod açılıyor`),c(document),console.log(`[dark-inject] style enjekte edildi mi:`,!!document.getElementById(r)),document.head)u(document);else{let e=new MutationObserver(()=>{document.head&&(e.disconnect(),u(document))});e.observe(document.documentElement,{childList:!0})}}}function h(){p&&(p=!1,l(document),d(document))}var g=e({matches:[`<all_urls>`],runAt:`document_start`,main(){console.log(`[dark-inject] content script başlatıldı (document_start).`),t.storage.local.get(`settings`).then(e=>{let t=e.settings;console.log(`[dark-inject] settings.darkModeEnabled =`,t?.darkModeEnabled),t?.darkModeEnabled&&m()}).catch(e=>{console.error(`[dark-inject] storage okunamadı:`,e)}),t.storage.onChanged.addListener((e,t)=>{t===`local`&&e.settings&&(e.settings.newValue?.darkModeEnabled?m():h())}),t.runtime.onMessage.addListener((e,t,n)=>e?.type===`TOGGLE_SITE_THEME`&&(console.log(`[dark-inject] TOGGLE_SITE_THEME mesajı alındı:`,e.enabled),e.enabled?m():h(),n({ok:!0}),!0))}});function _(e,...t){typeof t[0]==`string`?e(`[wxt] ${t.shift()}`,...t):e(`[wxt]`,...t)}var v={debug:(...e)=>_(console.debug,...e),log:(...e)=>_(console.log,...e),warn:(...e)=>_(console.warn,...e),error:(...e)=>_(console.error,...e)},y=class e extends Event{static EVENT_NAME=b(`wxt:locationchange`);constructor(t,n){super(e.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}};function b(e){return`${t?.runtime?.id}:dark-inject:${e}`}var x=typeof globalThis.navigation?.addEventListener==`function`;function S(e){let t,n=!1;return{run(){n||(n=!0,t=new URL(location.href),x?globalThis.navigation.addEventListener(`navigate`,e=>{let n=new URL(e.destination.url);n.href!==t.href&&(window.dispatchEvent(new y(n,t)),t=n)},{signal:e.signal}):e.setInterval(()=>{let e=new URL(location.href);e.href!==t.href&&(window.dispatchEvent(new y(e,t)),t=e)},1e3))}}}var C=class e{static SCRIPT_STARTED_MESSAGE_TYPE=b(`wxt:content-script-started`);id;abortController;locationWatcher=S(this);constructor(e,t){this.contentScriptName=e,this.options=t,this.id=Math.random().toString(36).slice(2),this.abortController=new AbortController,this.stopOldScripts(),this.listenForNewerScripts()}get signal(){return this.abortController.signal}abort(e){return this.abortController.abort(e)}get isInvalid(){return t.runtime?.id??this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(e){return this.signal.addEventListener(`abort`,e),()=>this.signal.removeEventListener(`abort`,e)}block(){return new Promise(()=>{})}setInterval(e,t){let n=setInterval(()=>{this.isValid&&e()},t);return this.onInvalidated(()=>clearInterval(n)),n}setTimeout(e,t){let n=setTimeout(()=>{this.isValid&&e()},t);return this.onInvalidated(()=>clearTimeout(n)),n}requestAnimationFrame(e){let t=requestAnimationFrame((...t)=>{this.isValid&&e(...t)});return this.onInvalidated(()=>cancelAnimationFrame(t)),t}requestIdleCallback(e,t){let n=requestIdleCallback((...t)=>{this.signal.aborted||e(...t)},t);return this.onInvalidated(()=>cancelIdleCallback(n)),n}addEventListener(e,t,n,r){t===`wxt:locationchange`&&this.isValid&&this.locationWatcher.run(),e.addEventListener?.(t.startsWith(`wxt:`)?b(t):t,n,{...r,signal:this.signal})}notifyInvalidated(){this.abort(`Content script context invalidated`),v.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){document.dispatchEvent(new CustomEvent(e.SCRIPT_STARTED_MESSAGE_TYPE,{detail:{contentScriptName:this.contentScriptName,messageId:this.id}})),this.options?.noScriptStartedPostMessage||window.postMessage({type:e.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:this.id},`*`)}verifyScriptStartedEvent(e){let t=e.detail?.contentScriptName===this.contentScriptName,n=e.detail?.messageId===this.id;return t&&!n}listenForNewerScripts(){let t=e=>{!(e instanceof CustomEvent)||!this.verifyScriptStartedEvent(e)||this.notifyInvalidated()};document.addEventListener(e.SCRIPT_STARTED_MESSAGE_TYPE,t),this.onInvalidated(()=>document.removeEventListener(e.SCRIPT_STARTED_MESSAGE_TYPE,t))}};function w(e,...t){typeof t[0]==`string`?e(`[wxt] ${t.shift()}`,...t):e(`[wxt]`,...t)}var T={debug:(...e)=>w(console.debug,...e),log:(...e)=>w(console.log,...e),warn:(...e)=>w(console.warn,...e),error:(...e)=>w(console.error,...e)};return(async()=>{try{let{main:e,...t}=g;return await e(new C(`dark-inject`,t))}catch(e){throw T.error(`The content script "dark-inject" crashed on startup!`,e),e}})()})();