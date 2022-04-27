document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#postform').onsubmit = () => {
        //alert("hola");
        fetch('/posts', {
            method: 'POST',
            body: JSON.stringify({
                body: document.querySelector('#bodyform').value
            })
        })
        .then(response => response.json())
        .then(() => {
              //load_mailbox('sent');
              console.log(result);
        });
        return false;
    }
})

