window.addEventListener('load', solution);

function solution() {
  // initial element map
  let employeeElement = document.getElementById('employee');
  let categoryElement = document.getElementById('category');
  let urgencyElement = document.getElementById('urgency');
  let teamElement = document.getElementById('team');
  let descriptionElement = document.getElementById('description');
  let addButtonElement = document.getElementById('add-btn');

  let previewElement = document.querySelector('.preview-list');
  let pendingElement = document.querySelector('.pending-list');
  let resolvedElement = document.querySelector('.resolved-list');

  // add listener for the add button
  addButtonElement.addEventListener('click', onNext);

  function onNext(e) {
    e.preventDefault(); // Remove the default function. Remove refreshing of the page

    // if some of the fields are empty should not allow submit
    if (
      employeeElement.value == '' ||
      categoryElement.value == '' ||
      urgencyElement.value == '' ||
      teamElement.value == '' ||
      descriptionElement.value == ''
    ) {
      return;
    }

    // build elements to add into the UL for preview list
    let liElement = document.createElement('li');
    liElement.setAttribute('class', 'problem-content');

    // create article element
    let articleElement = document.createElement('article');

    // create paragraphs
    let fromParagraph = document.createElement('p');
    fromParagraph.textContent = `From: ${employeeElement.value}`;

    let categoryParagraph = document.createElement('p');
    categoryParagraph.textContent = `Category: ${categoryElement.value}`;

    let urgencyParagraph = document.createElement('p');
    urgencyParagraph.textContent = `Urgency: ${urgencyElement.value}`;

    let assignedToParagraph = document.createElement('p');
    assignedToParagraph.textContent = `Assigned to: ${teamElement.value}`;

    let descriptionParagraph = document.createElement('p');
    descriptionParagraph.textContent = `Description: ${descriptionElement.value}`;

    // create buttons
    let editBtn = document.createElement('button');
    editBtn.setAttribute('class', 'edit-btn');
    editBtn.textContent = 'Edit';

    let continueBtn = document.createElement('button');
    continueBtn.setAttribute('class', 'continue-btn');
    continueBtn.textContent = 'Continue';

    // append all children
    articleElement.appendChild(fromParagraph);
    articleElement.appendChild(categoryParagraph);
    articleElement.appendChild(urgencyParagraph);
    articleElement.appendChild(assignedToParagraph);
    articleElement.appendChild(descriptionParagraph);

    liElement.appendChild(articleElement);
    liElement.appendChild(editBtn);
    liElement.appendChild(continueBtn);

    previewElement.appendChild(liElement);

    // before removing the values from the fields we should keep the input data
    // otherwise we will lose it
    let editedEmployee = employeeElement.value;
    let editedCategory = categoryElement.value;
    let editedUrgency = urgencyElement.value;
    let editedTeam = teamElement.value;
    let editedDescription = descriptionElement.value;

    // clear the input fields
    employeeElement.value = '';
    categoryElement.value = '';
    urgencyElement.value = '';
    teamElement.value = '';
    descriptionElement.value = '';
    addButtonElement.disabled = true;

    // when click edit button functionality
    editBtn.addEventListener('click', onEdit);

    function onEdit() {
      employeeElement.value = editedEmployee;
      categoryElement.value = editedCategory;
      urgencyElement.value = editedUrgency;
      teamElement.value = editedTeam;
      descriptionElement.value = editedDescription;

      liElement.remove();
      addButtonElement.disabled = false;
    }

    // when click continue button functionality
    continueBtn.addEventListener('click', onContinue);

    function onContinue() {
      let liElementContinue = document.createElement('li');
      liElementContinue.setAttribute('class', 'problem-content');

      let articleElementContinue = document.createElement('article');
      // we do not need to create other 5 paragraps, just need to apply the previous article to the new article
      articleElementContinue = articleElement;

      let resolvedBtn = document.createElement('button');
      resolvedBtn.setAttribute('class', 'resolve-btn');
      resolvedBtn.textContent = 'Resolved'

      // appending to the DOM tree
      liElementContinue.appendChild(articleElementContinue);
      liElementContinue.appendChild(resolvedBtn);

      // appending to the Pending section
      pendingElement.appendChild(liElementContinue);

      // remove the Edit and Continue buttons from the  preview section
      liElement.remove();

      // turn on the functionality available of the Add button
      addButtonElement.disabled = false;

      // when click on Resolve button functionality
      resolvedBtn.addEventListener('click', onResolve)
      
      function onResolve() {
        let liElementResolved = document.createElement('li');
        liElementResolved.setAttribute('class', 'problem-content');

        let articleElementResolved = document.createElement('article');
        articleElementResolved = articleElementContinue;

        let clearBtn = document.createElement('button');
        clearBtn.setAttribute('class', 'clear-btn');
        clearBtn.textContent = 'Clear';

        liElementResolved.appendChild(articleElementResolved);
        liElementResolved.appendChild(clearBtn);
        resolvedElement.appendChild(liElementResolved);

        liElementContinue.remove();

        // when click on button clear functionality
        clearBtn.addEventListener('click', onClear);

        function onClear() {
          liElementResolved.remove();
        }
      }
    }
  }
}




