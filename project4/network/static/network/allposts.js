var counter = 0
var quantity = 10;

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#newpostview').style.display = 'none';
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


})