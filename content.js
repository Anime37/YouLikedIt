var element = document.getElementById('top-level-buttons-computed').children[0];
var isLiked = element.classList.contains('style-default-active');
if (!isLiked) {
    element.click();
}