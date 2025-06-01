window.onload = init;
var headers = {};
var url = "http://localhost:3000";

function init() {
    if(localStorage.getItem("token")) {
        token = localStorage.getItem("token");
        headers = {
            headers : {
                'Authorization': "bearer" + localStorage.getItem("token")
            }
        }
    }
    else {
        window.location.href = "index.html";
    }
}

function loadUser() {
    axios.get(url + "/user", headers)
    .then(function(res) {
        console.log(res);
        loadUser(res.data.message);
    }).catch(function(err){
        console.log(err);
    })
}

function displayUsers(users){
    console.log("Entro a displayUsers");
    var body = document.querySelector("body");
    for (var i = 0; i < users.length; i++){
        body.innerHTML += `<h3>${users[i].user_name}<h3>`;
    }
}