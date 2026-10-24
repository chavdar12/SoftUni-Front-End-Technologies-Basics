function toggle() {
    let textDiv = document.getElementById("extra");
    let button = document.getElementsByClassName("button")[0];

    if (button.textContent === "More") {
        textDiv.style.display = "block";
        button.textContent = "Less";

    } else if (button.textContent === "Less") {
        textDiv.style.display = "none";
        button.textContent = "More"
    }
}