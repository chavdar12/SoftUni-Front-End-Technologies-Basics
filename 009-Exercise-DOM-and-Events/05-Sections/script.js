function create(words) {
   let divContent = document.getElementById("content");

   for (let i = 0; i < words.length; i++) {
      let newDiv = document.createElement("div");
      let newPara = document.createElement("p");
      newPara.textContent = words[i];
      newPara.style.display = "none";

      newDiv.appendChild(newPara);
      divContent.appendChild(newDiv);

      newDiv.addEventListener("click", function () {
         newPara.style.display = "";
      })
   }
}