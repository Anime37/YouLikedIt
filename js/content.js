// Define a function to handle URL changes
const regex = /^https?:\/\/www\.youtube\.com\/watch\?v=/;
function handleUrlChange() {
    // Update the current URL
    currentUrl = window.location.href;
    if (regex.test(currentUrl)) {
        // Reconnect the observer
        console.log('url correct');
        observeLikeButton();
    } else {
        console.log('url incorrect');
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
                console.log('URL changed:', node.href);
                handleUrlChange();
                return true; // Break out of both some loops
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
        console.log('already liked');
        createNotification('ALREADY LIKED', '#cc0000');
        return;
    }
    console.log('clicking like click');
    like_button.click();
    createNotification('LIKED', '#33cc33');
}

// Define the mutation handler function
function handlePageMutations(mutationsList, like_button_observer) {
    mutationsList.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BUTTON' && node.title === 'I like this') {
                // Once the target button appears, call the clickLike function
                console.log('found button');
                setTimeout(() => {
                    // Once the delay is over, call the clickLike function
                    clickLike(node);
                }, 3000); // 3 seconds delay
                // Disconnect the observer as the target button is found
                like_button_observer.disconnect();
                return true; // Break out of both some loops
            }
        });
    });
}

// Define a function to reconnect the observer when the URL changes
function observeLikeButton() {
    console.log('observing');
    like_button_observer.disconnect();
    like_button_observer.observe(document.body, { childList: true, subtree: true });
}

// Define the current URL when the observer is instantiated
let currentUrl = "";

// Observe url changes when navigating youtube
let url_observer = new MutationObserver(handleUrlMutations);
// Observer for detecting like button appearing
let like_button_observer = new MutationObserver(handlePageMutations);

// Start observing for youtube url change
url_observer.observe(document.body, { childList: true, subtree: true });

console.log('injected content.js')
