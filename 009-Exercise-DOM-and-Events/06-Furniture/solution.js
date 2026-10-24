function solve() {
  const [input, output] = document.getElementsByTagName("textarea");
  const [generateButton, buyButton] = document.getElementsByTagName("button");
  const tableBody = document.getElementsByTagName("tbody")[0];

  generateButton.addEventListener("click", generateRow);
  buyButton.addEventListener("click", buyItems);

  function generateRow() {
    let items = JSON.parse(input.value);

    for (let i = 0; i < items.length; i++) {
      let tableRow = document.createElement("tr");

      // Add tableData for the image column
      let imageTableData = document.createElement("td");
      let image = document.createElement("img");
      image.src = items[i].img;
      imageTableData.appendChild(image);
      tableRow.appendChild(imageTableData);

      // Add tableData for name column
      let nameTableData = document.createElement("td");
      let namePara = document.createElement("p");
      namePara.textContent = items[i].name;
      nameTableData.appendChild(namePara);
      tableRow.appendChild(nameTableData);

      // Add tableData for price column
      let priceTableData = document.createElement("td");
      let pricePara = document.createElement("p");
      pricePara.textContent = items[i].price;
      priceTableData.appendChild(pricePara);
      tableRow.appendChild(priceTableData);

      // Add tableData for decFactor column
      let decFactorTableData = document.createElement("td");
      let dFactorPara = document.createElement("p");
      dFactorPara.textContent = items[i].decFactor;
      decFactorTableData.appendChild(dFactorPara);
      tableRow.appendChild(decFactorTableData);

      // Add tableData for mark column
      let markTableData = document.createElement("td");
      let markInput = document.createElement("input");
      markInput.type = "checkbox";
      markTableData.appendChild(markInput);
      tableRow.appendChild(markTableData);


      tableBody.appendChild(tableRow);
    }
  }

  function buyItems() {
    let furniture = [];
    let price = 0;
    let averageDecFactor = 0;
    let checkedItemsCount = 0;
    let tableRows = document.getElementsByTagName("tr");

    for (let i = 1; i < tableRows.length; i++) {
      let isMarkChecked = tableRows[i].children[4].children[0].checked;
      if (isMarkChecked) {
        checkedItemsCount += 1;

        furniture.push(tableRows[i].children[1].children[0].textContent);

        price += Number(tableRows[i].children[2].children[0].textContent);

        averageDecFactor += Number(tableRows[i].children[3].children[0].textContent);
      }
    }

    const average = checkedItemsCount === 0 ? 0 : averageDecFactor / checkedItemsCount;
    const result = `Bought furniture: ${furniture.join(", ")}\nTotal price: ${price}\nAverage decoration factor: ${average}`;

    output.textContent = result;
  }
}