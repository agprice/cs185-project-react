// import $ from 'jquery';
import ReactDOM from "react-dom";


// $(document).ready(function() {
//     // Get the modal
//     // var modal = document.getElementById("mediaModal");
//     // var modalImg = document.getElementById("modalImage");
//     // // When the user clicks outside the image, close the modal, and clear the src
//     // modal.onclick = function() {
//     //     modal.style.display = "none";
//     //     if (modalImg.nodeName == 'VIDEO') {
//     //         modalImg.pause();
//     //     }
//     //     modalImg.removeAttribute('src');
//     // }
//     // modalImg.onclick = function(event) {
//     //     if (!event) {
//     //         event = window.event;
//     //     }
//     //     event.stopPropagation();
//     // }
// });

export default function showModal(event) {
    console.log("Show modal ran");
    if (!event) {
        event = window.event;
    }
    document.getElementById("mediaModel").style.display = "block";
    document.getElementById("modalImage").attr.src = event.srcElement.src;
    document.getElementById("caption").html(event.srcElement.alt);

    // $("#mediaModal").css({ display: "block" });
    // $("#modalImage").attr("src", event.srcElement.src);
    // $("#caption").html(event.srcElement.alt);
}