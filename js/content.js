// Define a function to handle URL changes
const regex = /^https?:\/\/www\.youtube\.com\/watch\?v=/;

// need to be capitalized
const like_dislike_buttons_tag_name = 'YT-SMARTIMATION';
const like_button_tag_name = 'LIKE-BUTTON-VIEW-MODEL';
let isObserverRunning = false;

function log(msg, ...args) {
    console.log('[YouLikedIt]', msg, ...args)
}

function getStorage() {
    const options = ['simple', 'playlist', 'queue', 'mymix'];
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(options, (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });
}

async function handleUrlChange() {
    try {
        currentUrl = window.location.href;
        if (!regex.test(currentUrl)) {
            log('URL is invalid');
            return false;
        }
        const result = await getStorage();
        /* bad lazy programming goes brrrrrrrrrr */
        if (!result['playlist'] && currentUrl.includes('&list=PL')) {
            log('Ignore reason: Playlist')
            createNotification('IGNORED (Playlist)', '#8B008B');
            return false;
        }
        if (!result['mymix'] && currentUrl.includes('&list=RD')) {
            log('Ignore reason: My mix')
            createNotification('IGNORED (My Mix)', '#8B008B');
            return false;
        }
        if (!result['queue'] && currentUrl.includes('&list=TL')) {
            log('Ignore reason: Queue')
            createNotification('IGNORED (Queue)', '#8B008B');
            return false;
        }
        if (!result['simple'] && !currentUrl.includes('&list=')) {
            log('Ignore reason: Simple')
            createNotification('IGNORED (Simple)', '#8B008B');
            return false;
        }
        observeLikeButton();
        return true;
    } catch {
        return false
    }
}

// Define the mutation handler function
function handleUrlMutations(mutationsList, observer) {
    mutationsList.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
            if (node.nodeName === 'A' && node.href.includes('youtube.com')) {
                if (currentUrl === window.location.href) {
                    return false;
                }
                return handleUrlChange();
            }
        });
    });
}

function createNotification(message, color) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.backgroundColor = color
    notification.textContent = message;
    document.body.appendChild(notification);

    // Fade away after 3 seconds
    setTimeout(function () {
        notification.style.opacity = 0;
        setTimeout(function () {
            notification.remove();
        }, 1000); // Fade out duration
    }, 3000); // Display duration
}

function clickLike() {
    try {
        const node = document.getElementsByTagName(like_button_tag_name)[0];
        like_button = node.firstChild.firstChild.firstChild;
        if (like_button.title !== 'I like this') {
            log('Video is already LIKED');
            createNotification('ALREADY LIKED', '#cc0000');
        } else {
            log('Clicking LIKE');
            like_button.click();
            createNotification('LIKED', '#33cc33');
        }
    } catch {
        log('LIKE button not found');
    }
}

function clickLikeDelayed() {
    log('Found LIKE button (3s delay...)');
    setTimeout(() => {
        // Once the delay is over, call the clickLike function
        clickLike();
    }, 3000); // 3 seconds delay
}

function clickLikeOnObserverTmo() {
    setTimeout(() => {
        if (isObserverRunning) {
            like_button_observer.disconnect();
            isObserverRunning = false;
            clickLike()
        }
    }, 3000); // 3 seconds delay
}

// Define the mutation handler function
function handlePageMutations(mutationsList, like_button_observer) {
    mutationsList.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
            if (node.tagName == like_dislike_buttons_tag_name) {
                // go down the children tree to get the actual like button object
                try {
                    like_button_view_model = node.firstElementChild.firstChild.firstChild;
                    if (like_button_view_model.tagName == like_button_tag_name) {
                        like_button = like_button_view_model.firstElementChild.firstElementChild.firstElementChild;
                        // Once the target button appears, call the clickLike function
                        clickLikeDelayed();
                        // Disconnect the observer as the target button is found
                        like_button_observer.disconnect();
                        isObserverRunning = false;
                        return true; // Break out of both some loops
                    }
                } catch {
                    return false;
                }
            }
        });
    });
}

// Define a function to reconnect the observer when the URL changes
function observeLikeButton() {
    like_button_observer.disconnect();
    log('Waiting for LIKE button');
    like_button_observer.observe(document.body, { childList: true, subtree: true });
    isObserverRunning = true;
    clickLikeOnObserverTmo();
}

// Define the current URL when the observer is instantiated
let currentUrl = "";

// Observer for url changes when navigating youtube
let url_observer = new MutationObserver(handleUrlMutations);
// Observer for detecting like button appearing
let like_button_observer = new MutationObserver(handlePageMutations);

// Start observing for youtube url change
url_observer.observe(document.body, { childList: true, subtree: true });

log('injected content.js')
