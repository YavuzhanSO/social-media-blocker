// Ayarları Kaydetme Butonuna Tıklama Olayı
document.getElementById('saveSettings').addEventListener('click', function() {
  const blockYouTube = document.getElementById('blockYouTube').checked;
  const blockInstagram = document.getElementById('blockInstagram').checked;
  const blockTikTok = document.getElementById('blockTikTok').checked;
  const blockDuration = parseInt(document.getElementById('blockDuration').value, 10) || 0;

  // Ayarları Chrome Depolamaya Kaydet
  chrome.storage.local.set({
    blockYouTube,
    blockInstagram,
    blockTikTok,
    blockDuration
  }, function() {
    alert('Ayarlar kaydedildi!');
  });

  // Engelleme Süresi Ayarla
  if (blockDuration > 0) {
    chrome.alarms.create('disableBlock', { delayInMinutes: blockDuration });
  }
});

// Yeni Site Ekleme Butonuna Tıklama Olayı
document.getElementById('addSite').addEventListener('click', function() {
  const newSite = document.getElementById('newSite').value;
  if (newSite) {
    // Mevcut Engellenmiş Siteleri Al
    chrome.storage.local.get('blockedSites', function(data) {
      const blockedSites = data.blockedSites || [];
      blockedSites.push(newSite);
      // Yeni Siteyi Engellenmiş Siteler Listesine Ekle
      chrome.storage.local.set({ blockedSites }, function() {
        document.getElementById('newSite').value = '';
        updateSiteList();
      });
    });
  }
});
