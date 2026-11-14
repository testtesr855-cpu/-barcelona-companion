// Offline support: keeps the page, the Zurich terminal map and its PDF on the phone.
// Network first (so updates show up when online), saved copy when offline.
const CACHE='bcn-companion-v2.6';
const FILES=['./','index.html','zurich-terminal-map.png','zurich-terminal-map.pdf'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET'||new URL(req.url).origin!==location.origin)return; // maps, photos and routing stay online-only
 e.respondWith(fetch(req).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return r;})
  .catch(()=>caches.match(req,{ignoreSearch:true})));
});
