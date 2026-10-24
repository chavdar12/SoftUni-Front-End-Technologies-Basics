function lockedProfile() {
    let buttons = document.getElementsByTagName("button");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", showInfo);   
    }

    function showInfo(event) {
        let lockRadioButton = event.target.parentNode.children[2];
        let divHiddenContent = event.target.previousElementSibling;

        if (lockRadioButton.checked === false) {
            if (event.target.textContent === "Hide it") {
                divHiddenContent.style.display = "none";
                event.target.textContent = "Show more";
            }
            else {
                divHiddenContent.style.display = "inline";
                event.target.textContent = "Hide it";
            }
        }
    }
}