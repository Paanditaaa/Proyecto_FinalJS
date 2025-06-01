

window.onload = init;

function init() {
    document.querySelector('.btn-secondary').addEventListener('click', function(){
        window.location.href = "login.html"
    });


    document.querySelector('.btn-primary').addEventListener('click', signin);

}

function signin() {
    var name = document.getElementById('input-name').value;
    var mail = document.getElementById('input-mail').value;
    var pass = document.getElementById('input-password').value;
    var address = document.getElementById('input-address').value;
    var surname = document.getElementById('input-surname').value;
    var phone = document.getElementById('input-phone').value;



    axios({
        method: 'post',
        url: 'http://localhost:3000/user/signin',
        data: {
            user_name: name,
            user_mail: mail,
            user_password: pass,
            user_phone: phone,
            user_address: address,
            user_surname: surname
            
        }
    }).then(function(res){
        console.log(res);
    }).catch(function(err){
        
    })
}