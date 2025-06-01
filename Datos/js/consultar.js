window.onload = init;

function init() {
    document.querySelector('.btn-secondary').addEventListener('click', function() {
        window.location.href = "datos.html";
    });
    document.querySelector('.btn-primary').addEventListener('click', buscar);

}

function buscar() {
    var user_name = document.getElementById('input-name').value;
    var token = localStorage.getItem("token");

    axios({
        method: 'get',
        url: `http://localhost:3000/user/${user_name}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(function(res) {
        if(res.data.code === 200){
            const usuarios = res.data.message;
            let html = '';
            usuarios.forEach(usuario => {
                html += `
                    <div class="alert alert-success">
                        <strong>Usuario encontrado:</strong><br>
                        <b>ID:</b> ${usuario.ID}<br>
                        <b>Nombre:</b> ${usuario.Nombre}<br>
                        <b>Apellidos:</b> ${usuario.Apellidos}<br>
                        <b>Teléfono:</b> ${usuario.Telefono}<br>
                        <b>Correo:</b> ${usuario.CorreoE}<br>
                        <b>Dirección:</b> ${usuario.Direccion}
                    </div>
                `;
            });
            document.getElementById('resultado-usuario').innerHTML = html;
        } else {
            alert("Usuario no encontrado.");
        }
    }).catch(function(err){
        alert("No autorizado o error en la petición.");
    })
}