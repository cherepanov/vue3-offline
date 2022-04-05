import { matchPrecache, precacheAndRoute } from 'workbox-precaching'
import { setDefaultHandler, setCatchHandler } from 'workbox-routing'
import { StaleWhileRevalidate } from 'workbox-strategies'

const FALLBACK_HTML_URL = 'public/index.html'
const FALLBACK_IMAGE_URL = 'assets/logo.png'

// Optional: use the injectManifest mode of one of the Workbox
// build tools to precache a list of URLs, including fallbacks.
precacheAndRoute(self.__WB_MANIFEST)

// Use a stale-while-revalidate strategy to handle requests by default.
setDefaultHandler(new StaleWhileRevalidate())

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
setCatchHandler(async ({ event }) => {
  // Fallback assets are precached when the service worker is installed, and are
  // served in the event of an error below. Use `event`, `request`, and `url` to
  // figure out how to respond, or use request.destination to match requests for
  // specific resource types.
  switch (event.request.destination) {
    case 'document':
      // FALLBACK_HTML_URL must be defined as a precached URL for this to work:
      return matchPrecache(FALLBACK_HTML_URL)

    case 'image':
      // FALLBACK_IMAGE_URL must be defined as a precached URL for this to work:
      return matchPrecache(FALLBACK_IMAGE_URL)

    default:
      // If we don't have a fallback, return an error response.
      return Response.error()
  }
})
