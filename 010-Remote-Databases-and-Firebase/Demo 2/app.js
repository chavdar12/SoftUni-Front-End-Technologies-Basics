// Unique FireBase Object
// Copied from someone else's Firebase project; paste your own web config from the Firebase console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

// Variable to access the DB
const db = firestore.collection("responsiveForm");

// Get submit button
let submitButton = document.getElementById("submit");

// Add eventListener to submit button
submitButton.addEventListener("click", (e) => {
    // Prevent default form submission
    e.preventDefault();

    // Get form values
    let firstName = document.getElementById("fname").value;
    let lastName = document.getElementById("lname").value;
    let email = document.getElementById("email").value;
    let country = document.getElementById("country-input").value;

    // Save data to Firebase
    db.doc().set({
        fname: firstName,
        lname: lastName,
        email: email,
        country: country
    }).then(() => {
        console.log("Data is saved");
        // only report success once the write actually succeeded
        alert("Form is submitted successfully");
    }).catch((error) => {
        console.log(error);
    })
});

// Function to fetch the information and display from db
function fetchRecords() {
    const recordsLists = document.getElementById("records-list");
    recordsLists.innerHTML = "";

    db.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const record = doc.data();
            const listItem = document.createElement("li");
            listItem.textContent = `First name: ${record.fname}, Last Name: ${record.lname}, Email: ${record.email}, Country: ${record.country}`
            recordsLists.appendChild(listItem);
        });
    }).catch((error) => {
        console.log("Error while fetching data", error);
    })
}

let getUsersButton = document.getElementById("getRecords");
getUsersButton.addEventListener("click", fetchRecords);

window.fetchRecords = fetchRecords;