(function(){function e(e){return e}var t=globalThis.browser?.runtime?.id?globalThis.browser:globalThis.chrome,n=`jarvis-dark-override`,r=`
/* Jarvis Akıllı Tersine Çevirme (Filter Mode) */
html.jarvis-invert {
  background-color: #ffffff !important;
  filter: invert(1) hue-rotate(180deg) saturate(1.2) !important;
  color-scheme: dark !important;
}

/* Tersine çevrilince beyaz parlayan gölgeleri tamamen kapat (Hover beyazlamasını çözer) */
html.jarvis-invert * {
  box-shadow: none !important;
}

/* Medya elementlerini eski haline döndür (Yoksa negatif röntgen gibi görünürler) */
html.jarvis-invert img,
html.jarvis-invert video,
html.jarvis-invert iframe,
html.jarvis-invert canvas,
html.jarvis-invert picture,
html.jarvis-invert embed,
html.jarvis-invert object {
  filter: saturate(0.8333) hue-rotate(180deg) invert(1) !important;
}

/* Koyu arka planlı medya elementlerinin içindeki SVG'ler bozulmasın */
html.jarvis-invert svg {
  color-scheme: light !important;
}

/* ── YOUTUBE ÖZEL DÜZELTMELERİ ── */
/* Logonun filtresini tersine çevirerek kırmızıyı %100 orijinal yaparız. */
html.jarvis-invert ytd-topbar-logo-renderer {
  filter: saturate(0.8333) hue-rotate(180deg) invert(1) !important;
}
/* Sadece "YouTube" yazısının harflerini beyaz yap. (Kırmızı butonu ellemek yok) */
html.jarvis-invert ytd-topbar-logo-renderer #youtube-paths path,
html.jarvis-invert ytd-topbar-logo-renderer svg path:not([fill]) {
  fill: #ffffff !important;
}

/* Fareyle üzerine gelince çıkan siyah bilgi kutucuklarının beyaz parlamasını engelle */
html.jarvis-invert tp-yt-paper-tooltip {
  filter: saturate(0.8333) hue-rotate(180deg) invert(1) !important;
}
`;function i(e){let t=e.match(/rgba?\(\s*([\d.]+)(?:\s*,\s*|\s+)([\d.]+)(?:\s*,\s*|\s+)([\d.]+)(?:(?:\s*,\s*|\s*\/\s*)([\d.]+))?\s*\)/);return t?[Number(t[1]),Number(t[2]),Number(t[3]),t[4]==null?1:Number(t[4])]:null}function a(e,t,n){return(.2126*e+.7152*t+.0722*n)/255}function o(){if(typeof window>`u`)return!1;if(document.body){let e=i(getComputedStyle(document.body).backgroundColor);if(e&&e[3]>.1&&a(e[0],e[1],e[2])<.4)return!0}return!!(window.matchMedia&&window.matchMedia(`(prefers-color-scheme: dark)`).matches)}var s=null;function c(e){typeof window>`u`||(d(e),o()?e.documentElement.classList.remove(`jarvis-invert`):e.documentElement.classList.add(`jarvis-invert`),s||=window.setInterval(()=>{o()?e.documentElement.classList.remove(`jarvis-invert`):e.documentElement.classList.add(`jarvis-invert`)},2e3))}function l(){typeof window>`u`||(s&&=(window.clearInterval(s),null))}function u(e){typeof window>`u`||e.documentElement.classList.remove(`jarvis-invert`)}function d(e){if(typeof window>`u`||e.getElementById(`jarvis-dark-override`))return;let t=e.createElement(`style`);t.id=n,t.textContent=r,(e.head||e.documentElement).appendChild(t)}var f=!1;function p(){f||(f=!0,console.log(`[dark-inject] enable() — karanlık mod açılıyor (Dark Reader)`),c(document))}function m(){f&&(f=!1,console.log(`[dark-inject] disable() — karanlık mod kapatılıyor (Dark Reader)`),l(),u(document))}var h=e({matches:[`<all_urls>`],runAt:`document_start`,main(){console.log(`[dark-inject] content script başlatıldı (document_start).`),t.storage.local.get(`settings`).then(e=>{let t=e.settings;console.log(`[dark-inject] settings.darkModeEnabled =`,t?.darkModeEnabled),t?.darkModeEnabled&&p()}).catch(e=>{console.error(`[dark-inject] storage okunamadı:`,e)}),t.storage.onChanged.addListener((e,t)=>{t===`local`&&e.settings&&(e.settings.newValue?.darkModeEnabled?p():m())}),t.runtime.onMessage.addListener((e,t,n)=>e?.type===`TOGGLE_SITE_THEME`&&(console.log(`[dark-inject] TOGGLE_SITE_THEME mesajı alındı:`,e.enabled),e.enabled?p():m(),n({ok:!0}),!0))}}),g={debug:(...e)=>([...e],void 0),log:(...e)=>([...e],void 0),warn:(...e)=>([...e],void 0),error:(...e)=>([...e],void 0)},_=class e extends Event{static EVENT_NAME=v(`wxt:locationchange`);constructor(t,n){super(e.EVENT_NAME,{}),this.newUrl=t,this.oldUrl=n}};function v(e){return`${t?.runtime?.id}:dark-inject:${e}`}var y=typeof globalThis.navigation?.addEventListener==`function`;function b(e){let t,n=!1;return{run(){n||(n=!0,t=new URL(location.href),y?globalThis.navigation.addEventListener(`navigate`,e=>{let n=new URL(e.destination.url);n.href!==t.href&&(window.dispatchEvent(new _(n,t)),t=n)},{signal:e.signal}):e.setInterval(()=>{let e=new URL(location.href);e.href!==t.href&&(window.dispatchEvent(new _(e,t)),t=e)},1e3))}}}var x=class e{static SCRIPT_STARTED_MESSAGE_TYPE=v(`wxt:content-script-started`);id;abortController;locationWatcher=b(this);constructor(e,t){this.contentScriptName=e,this.options=t,this.id=Math.random().toString(36).slice(2),this.abortController=new AbortController,this.stopOldScripts(),this.listenForNewerScripts()}get signal(){return this.abortController.signal}abort(e){return this.abortController.abort(e)}get isInvalid(){return t.runtime?.id??this.notifyInvalidated(),this.signal.aborted}get isValid(){return!this.isInvalid}onInvalidated(e){return this.signal.addEventListener(`abort`,e),()=>this.signal.removeEventListener(`abort`,e)}block(){return new Promise(()=>{})}setInterval(e,t){let n=setInterval(()=>{this.isValid&&e()},t);return this.onInvalidated(()=>clearInterval(n)),n}setTimeout(e,t){let n=setTimeout(()=>{this.isValid&&e()},t);return this.onInvalidated(()=>clearTimeout(n)),n}requestAnimationFrame(e){let t=requestAnimationFrame((...t)=>{this.isValid&&e(...t)});return this.onInvalidated(()=>cancelAnimationFrame(t)),t}requestIdleCallback(e,t){let n=requestIdleCallback((...t)=>{this.signal.aborted||e(...t)},t);return this.onInvalidated(()=>cancelIdleCallback(n)),n}addEventListener(e,t,n,r){t===`wxt:locationchange`&&this.isValid&&this.locationWatcher.run(),e.addEventListener?.(t.startsWith(`wxt:`)?v(t):t,n,{...r,signal:this.signal})}notifyInvalidated(){this.abort(`Content script context invalidated`),g.debug(`Content script "${this.contentScriptName}" context invalidated`)}stopOldScripts(){document.dispatchEvent(new CustomEvent(e.SCRIPT_STARTED_MESSAGE_TYPE,{detail:{contentScriptName:this.contentScriptName,messageId:this.id}})),this.options?.noScriptStartedPostMessage||window.postMessage({type:e.SCRIPT_STARTED_MESSAGE_TYPE,contentScriptName:this.contentScriptName,messageId:this.id},`*`)}verifyScriptStartedEvent(e){let t=e.detail?.contentScriptName===this.contentScriptName,n=e.detail?.messageId===this.id;return t&&!n}listenForNewerScripts(){let t=e=>{!(e instanceof CustomEvent)||!this.verifyScriptStartedEvent(e)||this.notifyInvalidated()};document.addEventListener(e.SCRIPT_STARTED_MESSAGE_TYPE,t),this.onInvalidated(()=>document.removeEventListener(e.SCRIPT_STARTED_MESSAGE_TYPE,t))}},S={debug:(...e)=>([...e],void 0),log:(...e)=>([...e],void 0),warn:(...e)=>([...e],void 0),error:(...e)=>([...e],void 0)};return(async()=>{try{let{main:e,...t}=h;return await e(new x(`dark-inject`,t))}catch(e){throw S.error(`The content script "dark-inject" crashed on startup!`,e),e}})()})();