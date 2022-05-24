var counter = 0
var quantity = 10;

document.addEventListener('DOMContentLoaded', function() {
  
  loadposts();

  // acciones del encabezado

  /* document.querySelector('#allposts').addEventListener('click', () => {
    document.querySelector('#newpostview').style.display = 'none';
    counter = 0;
    loadposts();
  }) */

  /* document.querySelector('#network').addEventListener('click', () => {
    document.querySelector('#newpostview').style.display = 'block';
    counter = 0;
    loadposts();
  }) */

  document.querySelector('#following').addEventListener('click', () => {
    document.querySelector('#newpostview').style.display = 'block';
    counter = 0;
    loadfollowing();
  })

  document.querySelector('#nametitle').addEventListener('click', () => {
    document.querySelector('#newpostview').style.display = 'block';
    nametitle = document.querySelector('#nametitle').innerText;
    counter = 0;
    loaduser(nametitle);
  })



  // accion del post from

  document.querySelector('#postform').onsubmit = () => {
    fetch('/posts', {
      method: 'POST',
      body: JSON.stringify({
        body: document.querySelector('#bodyform').value
      })
    })
    .then(response => response.json())
    .then(() => {
      counter = 0;
      loadposts();
      document.querySelector('#bodyform').value = "";
      //console.log(result);
    });
    return false;
  }
})