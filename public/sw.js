self.addEventListener("install", () => {
  console.log("PWA Installed");
});

self.addEventListener("fetch", () => {
  // No caching, just pass-through
});