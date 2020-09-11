const staticWeather = "gads-weather-app-v1"
const assets = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/app.js",
  "/images/logo.png",
  "/images/banner.png"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticWeather).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
})