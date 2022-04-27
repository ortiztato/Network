document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#postform').onsubmit = () => {
        //alert("hola");
        fetch('/posts', {})
    }
})