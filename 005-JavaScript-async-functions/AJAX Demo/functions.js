let button = document.querySelector("#load")
let httpRquest;

button.addEventListener('click', eventListenerAction)

function eventListenerAction() {
    let url = "https://api.github.com/users/testnakov/repos";
    httpRquest = new XMLHttpRequest();
    httpRquest.addEventListener('readystatechange', httpHandler);
    httpRquest.open("GET", url);
    httpRquest.send();
}

function httpHandler() {
    if(httpRquest.readyState == 4 && httpRquest.status == 200)
    {
        document.getElementById("res").textContent = httpRquest.responseText;
    }
}
