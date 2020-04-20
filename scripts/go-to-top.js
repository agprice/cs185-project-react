$(document).ready(function() {
    var topBtn = document.getElementById("topBtn");
});
window.onscroll = function() {
    showTopBtn()
};
// This function shows and hides the top button when you have scrolled 25%
function showTopBtn() {
    var documentHeight = $(document).height()
    var scrollTop = $(window).scrollTop()
    var windowHeight = $(window).height()
    var scrollPercent = Math.round(scrollTop / (documentHeight - windowHeight) * 100)
    console.log(scrollPercent);
    if (scrollPercent > 25) {
        $(topBtn).fadeIn(200);
    } else {
        $(topBtn).fadeOut(200);

    }
}

// This takes the user to the top of the page
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}