function clickLike(like_button) {
    if (like_button.title !== 'I like this') {
        console.log('already liked');
        return;
    }
    console.log('clicking like click');
    console.log(like_button.title);
    like_button.click();
}

// Define the mutation handler function
function handleMutations(mutationsList, observer) {
    mutationsList.some(mutation => {
        return Array.from(mutation.addedNodes).some(node => {
            if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BUTTON' && node.title === 'I like this') {
                // Once the target button appears, call the clickLike function
                setTimeout(() => {
                    // Once the delay is over, call the clickLike function
                    clickLike(node);
                }, 3000); // 3 seconds delay
                // Disconnect the observer as the target button is found
                observer.disconnect();
                return true; // Break out of both some loops
            }
        });
    });
}

// Define a function to reconnect the observer when the URL changes
function reconnectObserver() {
    // Reconnect the observer with the updated URL
    observer.disconnect();
    observer.observe(document.body, { childList: true, subtree: true });
}

// Define a function to handle URL changes
function handleUrlChange() {
    // Check if the URL has changed
    if (initialUrl !== window.location.href) {
        // Update the initial URL
        initialUrl = window.location.href;
        // Reconnect the observer
        reconnectObserver();
    }
}

// Define the initial URL when the observer is instantiated
let initialUrl = window.location.href;

// Check for URL changes periodically
setInterval(handleUrlChange, 1000); // Check every second

// Create a MutationObserver instance
let observer = new MutationObserver(handleMutations);
reconnectObserver();
