

window.onload = init;

function init() {
    document.querySelector('.btn-secondary').addEventListener('click', function(){
        window.location.href = "datos.html"
    });


    document.querySelector('.btn-primary').addEventListener('click', signin);

}

async function signin() {
    try {
        var name = document.getElementById('input-name').value;
        var mail = document.getElementById('input-mail').value;
        var pass = document.getElementById('input-password').value;
        var address = document.getElementById('input-address').value;
        var surname = document.getElementById('input-surname').value;
        var phone = document.getElementById('input-phone').value;

        // Validación de campos vacíos
        if (!name || !mail || !pass || !address || !surname || !phone) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        axios({
            method: 'post',
            url: 'http://localhost:3000/user/alta',
            data: {
                user_name: name,
                user_mail: mail,
                user_password: pass,
                user_phone: phone,
                user_address: address,
                user_surname: surname
            }
        });

        window.location.href = "signin.html";
        alert("Usuario registrado correctamente.");
    } catch (err) {
        alert("Ocurrió un error al registrar el usuario.");
        
    }
}