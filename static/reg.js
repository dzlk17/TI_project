function regUser(form){
    fetch('/db/reg', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: form.login.value,
            pass: form.pass.value
        })
      })
      .then((result) => {
        if(result.status == 200) {
          window.location = '/log';
          console.log("succ log.js/15");
        } else {
          alert("Użytkownik o tej nazwie już isntieje");
        }        
      })
      .catch((error) => {
        console.log("errr");
      });
}

const togglePass = document.querySelector('#togglePass');
  const pass = document.querySelector('#pass');
  togglePass.addEventListener('click', function (e) {
    const type = pass.getAttribute('type') === 'password' ? 'text' : 'password';
    pass.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});