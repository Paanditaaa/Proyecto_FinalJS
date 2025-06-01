
window.onload = init;

function init() {
    document.querySelector('.btn-secondary').addEventListener('click', function() {
        window.location.href = "datos.html";
    });
    document.querySelector('.btn-primary').addEventListener('click', baja);

}

function baja() {
    var id = document.getElementById('input-id').value;
    var token = localStorage.getItem("token");

    axios({
        method: 'delete',
        url: `http://localhost:3000/user/${id}`, // Usa la ruta correcta con el id
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(function(res) {
        if(res.data.code === 200){
            window.location.href = "baja.html";
            alert("Usuario borrado correctamente.");
        } else {
            alert("No se pudo borrar el usuario.");
        }
    }).catch(function(err){
        alert("No autorizado o error en la petición.");
    })
}