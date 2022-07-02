var like_button = document.getElementsByTagName('ytd-toggle-button-renderer').item(2);
var is_liked = like_button.classList.contains('style-default-active');
if (!is_liked) {
    like_button.click();
}
