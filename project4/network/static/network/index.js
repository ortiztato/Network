document.addEventListener('DOMContentLoaded', function() {

    //document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
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
              //loadposts();
              console.log(result);
        });
        return false;
    }
    loadposts();
})

function loadposts() {
  
    // Show the mailbox and hide other views
    document.querySelector('#postsview').style.display = 'block';
    //document.querySelector('#compose-view').style.display = 'none';
    //document.querySelector('#email-view').style.display = 'none';
  
    // Show the mailbox name
    document.querySelector('#postsview').innerHTML = "";
    
    fetch('/loadposts')
    .then(response => response.json())
    .then(posts => {
      console.log(posts)
      for (let post of posts) {
        const creator = post.creator;
        //const post_id = post.id;
        const body = post.body;
        const time = post.timestamp;
        const divpost = document.createElement('div');
        const postitem = document.createElement('div');
        postitem.name = "itempost";
        divpost.style.border = "1px solid rgb(230, 224, 224)"
        //emailitem.style.borderRadius = "1%"
        divpost.style.margin = "20px";
        divpost.style.padding = "5px";
        postitem.innerHTML = `${time}<br/>User: <strong>${creator}</strong> 
        <br/>${body}`;        
        
        divpost.append(postitem);
        document.querySelector('#postsview').append(divpost);  
      }
      
    })
  }
  