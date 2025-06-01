
window.onload = init;

function init() {
    document.querySelector('.btn-primary').addEventListener('click', login);

}

function login() {
    var mail = document.getElementById('input-mail').value;
    var pass = document.getElementById('input-password').value;

    console.log(mail, pass);

    axios({
        method: 'post',
        url: 'http://localhost:3000/user/login',
        data: {
            user_mail: mail,
            user_password: pass
        }
    }).then(function(res) {
        if(res.data.code === 200){
            localStorage.setItem("token", res.data.message);
            window.location.href = "datos.html";
        } else {
            alert("No se pudo registrar el usuario.");
        }
    })}