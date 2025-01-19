(function() {
  // Sabitler
  const SHORTS_URL_PREFIX = "https://www.youtube.com/shorts/";
  const WATCH_URL_PREFIX = "https://www.youtube.com/watch?v=";
  const TIKTOK_URL_PREFIX = "https://www.tiktok.com/";
  const INSTAGRAM_REELS_URL_PREFIX = "https://www.instagram.com/reels/";
  const SHORTS_LOGO_SELECTOR = 'ytd-topbar-logo-renderer';

  // URL Dönüştürme Fonksiyonları
  function convertShortsToWatch() {
    const url = window.location.href;
    if (url.includes(SHORTS_URL_PREFIX)) {
      const videoId = url.split(SHORTS_URL_PREFIX)[1];
      const newUrl = `${WATCH_URL_PREFIX}${videoId}`;
      window.location.replace(newUrl);
    }
  }

  function convertTikTokURL() {
    const url = window.location.href;
    if (url.includes(TIKTOK_URL_PREFIX)) {
      const videoId = url.split(TIKTOK_URL_PREFIX)[1];
      const newUrl = `${WATCH_URL_PREFIX}${videoId}`;
      window.location.replace(newUrl);
    }
  }

  function convertInstagramReelsURL() {
    const url = window.location.href;
    if (url.includes(INSTAGRAM_REELS_URL_PREFIX)) {
      const videoId = url.split(INSTAGRAM_REELS_URL_PREFIX)[1];
      const newUrl = `${WATCH_URL_PREFIX}${videoId}`;
      window.location.replace(newUrl);
    }
  }

  // Kullanıcı Etkileşimlerini İzleme
  function monitorUserInteractions() {
    const observer = new MutationObserver(() => {
      const shortsLogo = document.querySelector(SHORTS_LOGO_SELECTOR);
      if (shortsLogo) {
        shortsLogo.addEventListener('click', () => {
          window.location.reload();
          convertShortsToWatch();
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Ziyaretleri ve Engellemeleri Loglama
  function logVisit(url) {
    chrome.storage.local.get('visitLog', function(data) {
      const visitLog = data.visitLog || [];
      visitLog.push({ url: url, timestamp: new Date().toLocaleString() });
      chrome.storage.local.set({ visitLog });
    });
  }

  function logBlockedSite(url) {
    chrome.storage.local.get('blockedSites', function(data) {
      const blockedSites = data.blockedSites || [];
      blockedSites.push(url);
      chrome.storage.local.set({ blockedSites });
    });
  }

  // Sayfa Yüklendiğinde Başlatma
  window.addEventListener('load', function() {
    convertShortsToWatch();
    convertTikTokURL();
    convertInstagramReelsURL();
    monitorUserInteractions();
  });

  // Sayfa Her Yenilendiğinde Başlatma
  window.addEventListener('yt-navigate-finish', function() {
    convertShortsToWatch();
  });

  // Tarayıcıdaki Etkileşimleri Dinleme
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'logVisit') {
      logVisit(request.url);
      sendResponse({ status: 'success' });
    } else if (request.action === 'logBlockedSite') {
      logBlockedSite(request.url);
      sendResponse({ status: 'success' });
    }
  });

  // Otomatik Log Temizleme Fonksiyonu
  function autoClearLogs() {
    chrome.storage.local.get('visitLog', function(data) {
      const visitLog = data.visitLog || [];
      const now = new Date().getTime();
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // Bir hafta
      const filteredLog = visitLog.filter(entry => now - new Date(entry.timestamp).getTime() < oneWeek);
      chrome.storage.local.set({ visitLog: filteredLog });
    });

    chrome.storage.local.get('blockedSites', function(data) {
      const blockedSites = data.blockedSites || [];
      const now = new Date().getTime();
      const oneWeek = 7 * 24 * 60 * 60 * 1000; // Bir hafta
      const filteredSites = blockedSites.filter(entry => now - new Date(entry.timestamp).getTime() < oneWeek);
      chrome.storage.local.set({ blockedSites: filteredSites });
    });
  }

  // Haftalık Temizleme İşlemini Başlatma
  setInterval(autoClearLogs, 24 * 60 * 60 * 1000); // Günde bir kez çalıştır

})();
