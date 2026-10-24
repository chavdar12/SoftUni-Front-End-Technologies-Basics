function validateInput(input) {
    if(input !== "expectedInput"){
        return Promise.reject("Invalid Input");
    }

    return Promise.resolve("Valid Input");
}

validateInput("expectedInput")
.then(result => {
    console.log(result)
})
.catch(error => {
    console.log(error)
})