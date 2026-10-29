const CACHE='firmabal-v7';
const ASSETS=['./','./index.html','./css/styles.css','./js/app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/logo-badge-96.png','./icons/icon-maskable-512.png','./icons/logo-badge-256.png','./icons/logo-white-256.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(url.origin!==location.origin)return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cl=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cl));return res;}).catch(()=>caches.match('./index.html'))));});
