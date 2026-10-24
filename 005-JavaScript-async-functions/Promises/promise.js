let promise = new Promise(function(resolve, reject){
    setTimeout(() => {
        let success = true
        if(success){
            resolve("Operation successful")
        }
        else {
            reject("Operation failed")
        }
    }, 1000) 
})

promise
.then(function(result){
    console.log(result)
})
.catch(function(error){
    console.log(error)
})