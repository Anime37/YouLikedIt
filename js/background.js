chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url &&
        changeInfo.url.includes('youtube.com/watch?v=') &&
        !(changeInfo.url.includes('&list'))) {
        console.log('Video detected')
        setTimeout(() => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['js/content.js']
            });
        }, 3000)
    }
});
