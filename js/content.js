function WaitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

WaitForElement('yt-icon-button#button.style-scope.ytd-toggle-button-renderer.style-text').then((elm) => {
    const like_button = document.getElementById('top-level-buttons-computed').children[0];
    var is_liked = like_button.classList.contains('style-default-active');
    // alert(like_button.classList.toString() + is_liked);
    if (!is_liked) {
        like_button.click();
    }
});