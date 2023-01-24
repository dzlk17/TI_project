function logUser(form){
    fetch('/db/log', {
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
          window.location = '/';
          console.log("succ log.js/15");
        } else {
          alert("Nieprawidłowy login lub hasło");
        }
      })
      .catch((error) => {
        console.error('Error: log.js/18', error);
      });
}

const togglePass = document.querySelector('#togglePass');
  const pass = document.querySelector('#pass');
  togglePass.addEventListener('click', function (e) {
    const type = pass.getAttribute('type') === 'password' ? 'text' : 'password';
    pass.setAttribute('type', type);
    this.classList.toggle('fa-eye-slash');
});