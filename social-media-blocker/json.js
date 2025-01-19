{
    "manifest_version": 2,
    "name": "Advanced Social Media Blocker",
    "version": "1.0",
    "description": "Bu eklenti, YouTube Shorts, Instagram Reels ve TikTok'a erişimi engeller. Kullanıcı tercihlerine göre zamanlı engellemeye de izin verir.",
    "permissions": [
      "tabs",
      "storage",
      "webNavigation",
      "notifications"
    ],
    "background": {
      "scripts": ["background.js"],
      "persistent": false
    },
    "browser_action": {
      "default_popup": "popup.html"
    },
    "content_scripts": [
      {
        "matches": ["<all_urls>"],
        "js": ["content.js"]
      }
    ],
    "icons": {
      "48": "icons/blocked-icon.png"
    }
  }
  