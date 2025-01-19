chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.local.get(['blockYouTube', 'blockInstagram', 'blockTikTok', 'blockDuration'], function(data) {
    chrome.storage.local.set(data);
  });
});

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  chrome.storage.local.get(['blockYouTube', 'blockInstagram', 'blockTikTok', 'blockedSites'], function(data) {
    const blockedSites = data.blockedSites || [];
    if (data.blockYouTube) blockedSites.push("https://www.youtube.com/shorts/");
    if (data.blockInstagram) blockedSites.push("https://www.instagram.com/reels/");
    if (data.blockTikTok) blockedSites.push("https://www.tiktok.com/");

    if (blockedSites.some(site => details.url.startsWith(site))) {
      const newUrl = details.url.replace("youtube.com/shorts/", "youtube.com/watch?v=");
      chrome.tabs.update(details.tabId, { url: newUrl });
      chrome.notifications.create('blockNotification', {
        type: 'basic',
        iconUrl: 'icons/blocked-icon.png',
        title: 'URL Değiştirildi',
        message: 'YouTube Shorts URL\'si standart video formatına dönüştürüldü.'
      });

      chrome.storage.local.get('accessAttempts', function(data) {
        const accessAttempts = data.accessAttempts || [];
        accessAttempts.push({ url: details.url, timestamp: new Date().toLocaleString() });
        chrome.storage.local.set({ accessAttempts });
      });
    }
  });
}, { url: [{ hostContains: "youtube.com" }, { hostContains: "instagram.com" }, { hostContains: "tiktok.com" }] });

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === "disableBlock") {
    chrome.storage.local.set({
      blockYouTube: false,
      blockInstagram: false,
      blockTikTok: false
    });
  }
});
