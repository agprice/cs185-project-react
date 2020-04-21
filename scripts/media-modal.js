$(document).ready(function() {
    // Get the modal
    var modal = document.getElementById("mediaModal");
    var modalImg = document.getElementById("modalImage");
    // When the user clicks outside the image, close the modal, and clear the src
    modal.onclick = function() {
        modal.style.display = "none";
        if (modalImg.nodeName == 'VIDEO') {
            modalImg.pause();
        }
        modalImg.removeAttribute('src');
    }
    modalImg.onclick = function(event) {
        if (!event) {
            event = window.event;
        }
        event.stopPropagation();
    }
});

function showModal(event) {
    if (!event) {
        event = window.event;
    }
    $("#mediaModal").css({ display: "block" });
    $("#modalImage").attr("src", event.srcElement.src);
    $("#caption").html(event.srcElement.alt);
}