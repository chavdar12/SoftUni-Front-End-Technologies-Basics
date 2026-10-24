window.addEventListener("load", solve);

function solve() {
  let snowmanNameElement = document.getElementById('snowman-name');
  let snowmanHeightElement = document.getElementById('snowman-height');
  let locationElement = document.getElementById('location');
  let creatorNameElement = document.getElementById('creator-name');
  let attributeElement = document.getElementById('special-attribute');

  let addButtonElement = document.querySelector('.add-btn');

  let snowListElement = document.querySelector('.snowman-preview');

  let showSnowmanElement = document.querySelector('.snow-list');

  let main = document.getElementById('hero');

  let bodyElement = document.querySelector('.body');

  let backImg = document.getElementById('back-img');

  addButtonElement.addEventListener('click', onAdd);

  function onAdd(e) {
    e.preventDefault();

    // check valid data
    if (
      snowmanNameElement.value == '' ||
      snowmanHeightElement.value == '' ||
      locationElement.value == '' ||
      creatorNameElement.value == '' ||
      attributeElement.value == ''
    ) {
      return;
    }

    // create paragraph elements for the snowman details list
    let articleElementInfo = document.createElement('article');

    let listElementInfor = document.createElement('li');
    listElementInfor.setAttribute('class', 'snowman-info');

    let buttonContainer = document.createElement('div');
    buttonContainer.setAttribute('class', 'btn-container');

    let snowmanName = document.createElement('p');
    snowmanName.textContent = `Name: ${snowmanNameElement.value}`;

    let snowmanHeight = document.createElement('p');
    snowmanHeight.textContent = `Height: ${snowmanHeightElement.value}`;

    let location = document.createElement('p');
    location.textContent = `Location: ${locationElement.value}`;

    let creator = document.createElement('p');
    creator.textContent = `Creator: ${creatorNameElement.value}`;

    let attribute = document.createElement('p');
    attribute.textContent = `Attribute: ${attributeElement.value}`;


    // create button elements for the Edit and Next buttons
    let editButton = document.createElement('button');
    editButton.setAttribute('class', 'edit-btn');
    editButton.textContent = 'Edit';

    let nextButton = document.createElement('button');
    nextButton.setAttribute('class', 'next-btn');
    nextButton.textContent = 'Next';

    //add all fields and buttons to the snowman article element
    articleElementInfo.appendChild(snowmanName);
    articleElementInfo.appendChild(snowmanHeight);
    articleElementInfo.appendChild(location);
    articleElementInfo.appendChild(creator);
    articleElementInfo.appendChild(attribute);

    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(nextButton);

    listElementInfor.appendChild(articleElementInfo);
    listElementInfor.appendChild(buttonContainer);

    snowListElement.appendChild(listElementInfor);

    // save filled in fields in let variables and reset form
    let editedSnowmanName = snowmanNameElement.value;
    let editedHeight = snowmanHeightElement.value;
    let editedLocation = locationElement.value;
    let editedCreator = creatorNameElement.value;
    let editedAttribute = attributeElement.value;

    // reset form
    snowmanNameElement.value = '';
    snowmanHeightElement.value = '';
    locationElement.value = '';
    creatorNameElement.value = '';
    attributeElement.value = '';

    addButtonElement.disabled = true;

    /**
     * On Edit functionality
     */

    editButton.addEventListener('click', onEdit);
    function onEdit() {
      snowmanNameElement.value = editedSnowmanName;
      snowmanHeightElement.value = editedHeight;
      locationElement.value = editedLocation;
      creatorNameElement.value = editedCreator;
      attributeElement.value = editedAttribute;

      listElementInfor.remove();
      addButtonElement.disabled = false;
    }


    /**
     * Add next button funcitonality
     */

    nextButton.addEventListener('click', onNext);

    function onNext() {
      let liElementconfirm = document.createElement("li");
      liElementconfirm.setAttribute("class", "snowman-content");

      let articleElementContinue = document.createElement("article");
      articleElementContinue = articleElementInfo;

      let sendBtn = document.createElement("button");
      sendBtn.setAttribute("class", "send-btn");
      sendBtn.textContent = "Send";
      articleElementContinue.appendChild(sendBtn);
      liElementconfirm.appendChild(articleElementContinue);

      listElementInfor.remove();

      showSnowmanElement.appendChild(liElementconfirm);

      // logic on click send button
      sendBtn.addEventListener('click', onConfirm);
      function onConfirm() {
        // remove main element
        main.remove();

        // create back button
        let backBtn = document.createElement("button");
        backBtn.setAttribute("class", "back-btn");
        backBtn.textContent = "Back";

        // make back image visible
        backImg.hidden = false;

        // add back button to body element
        bodyElement.appendChild(backBtn);

        backBtn.addEventListener('click', onBack);
        function onBack() {
          window.location.reload();
        }
      }
    }
  }
}
