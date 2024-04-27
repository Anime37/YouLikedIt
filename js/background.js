chrome.runtime.onMessage.addListener(function (like_button) {
    console.log('clicking like');
    like_button.click();
});
