chrome.runtime.onInstalled.addListener(() => {
    const defaultConfig = {
        simple: true,
        playlist: true,
        queue: true,
        mymix: false
    };

    chrome.storage.sync.set(defaultConfig, () => {
        console.log("Initial config set:", defaultConfig);
    });
});
