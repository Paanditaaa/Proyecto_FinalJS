window.onload = init;

function init() {
    document.querySelector('.btn-success').addEventListener('click', function() {
        window.location.href = "signin.html";
});
    document.querySelector('.btn-danger').addEventListener('click', function() {
        window.location.href = "baja.html";
});
document.querySelector('.btn-primary').addEventListener('click', function() {
        window.location.href = "modificar.html";
});
    document.querySelector('.btn-warning').addEventListener('click', function() {
        window.location.href = "consultar.html";
});
}
