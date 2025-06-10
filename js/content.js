// Define a function to handle URL changes
const regex = /^https?:\/\/www\.youtube\.com\/watch\?v=/;

// need to be capitalized
const like_dislike_buttons_tag_name = 'YT-SMARTIMATION';
const like_button_tag_name = 'LIKE-BUTTON-VIEW-MODEL';

function log(msg, ...args) {
    console.log('[YouLikedIt]', msg, ...args)
}

function handleUrlChange() {
    currentUrl = window.location.href;
    if (currentUrl.includes('&list=RD')) {
        log('Ignore reason: My mix')
        return false;
    }
    if (!regex.test(currentUrl)) {
        log('URL is invalid');
        return false;
    }
    observeLikeButton();
    return true;
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

function clickLike(like_button) {
    if (like_button.title !== 'I like this') {
        log('Video is already LIKED');
        createNotification('ALREADY LIKED', '#cc0000');
    } else {
        log('Clicking LIKE');
        like_button.click();
        createNotification('LIKED', '#33cc33');
    }
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
                        log('Found LIKE button (3s delay...)');
                        setTimeout(() => {
                            // Once the delay is over, call the clickLike function
                            clickLike(like_button);
                        }, 3000); // 3 seconds delay
                        // Disconnect the observer as the target button is found
                        like_button_observer.disconnect();
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
    log('Waiting for LIKE button');
    like_button_observer.disconnect();
    like_button_observer.observe(document.body, { childList: true, subtree: true });
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
