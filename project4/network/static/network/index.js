let counter = 0;
const quantity = 10;

document.addEventListener('DOMContentLoaded', function() {

    loadposts();

    document.querySelector('#allposts').addEventListener('click', () => {
        document.querySelector('#newpostview').style.display = 'none';
        counter = 0;
        loadposts();
    })

    document.querySelector('#network').addEventListener('click', () => {
        document.querySelector('#newpostview').style.display = 'block';
        counter = 0;
        loadposts();
    })

    document.querySelector('#following').addEventListener('click', () => {
      document.querySelector('#newpostview').style.display = 'block';
      loadfollowing();
  })

    document.querySelector('#nametitle').addEventListener('click', () => {
      document.querySelector('#newpostview').style.display = 'block';
      nametitle = document.querySelector('#nametitle').innerText
      //nametitle = "ortiztato"
      loaduser(nametitle);
})


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
              counter = 0;
              loadposts();
              document.querySelector('#bodyform').value = "";
              //console.log(result);
        });
        return false;
    }
})

document.querySelector('#next').addEventListener('click', () => {
  loadposts()
})
document.querySelector('#previous').addEventListener('click', () => {
  counter = counter - quantity*2;
  loadposts()
})

function loadposts() {
  
    // Show the mailbox and hide other views
    document.querySelector('#postsview').style.display = 'block';
    document.querySelector('#userview').style.display = 'none';
    //document.querySelector('#compose-view').style.display = 'none';
    //document.querySelector('#email-view').style.display = 'none';
    document.querySelector('#postsview').innerHTML = "";

    const start = counter;
    const end = start + quantity;
    counter = end;
  
    // Show the mailbox name
    const title = document.createElement('h2');
    title.innerHTML = "All Posts";
    title.style.margin = "20px";
    document.querySelector('#postsview').append(title);
    
    fetch(`/loadposts?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      totalposts = data.totalposts;
      pages = Math.ceil(totalposts/quantity)
      //document.querySelector('#postsview').innerHTML = `total pags: ${pages}`;
      document.querySelector('#pages').style.display = 'inline-block';
      document.querySelector('#pages').innerHTML = '';
      for (let i=1; i<pages+1; i++) {
        //document.querySelector('#pages').innerHTML += `<span class="col-1 text-center" id="page${i}">${i}</span>`
        document.querySelector('#pages').innerHTML += `<button type="button" class="btn btn-primary btn-sm mx-1" id="page${i}">${i}</button>`
        document.querySelector(`#page${i}`).addEventListener('click', () => {
          counter = (i*quantity) - 10;
          loadposts()

        })

      }

      for (let post of data.posts) {

        const creator = post.creator;
        const post_id = post.id;
        const body = post.body;
        const time = post.timestamp;
        const likes = post.likes;
        const postliked = data.likedposts;
        
        //para revisar si el usuario ya likeo el post

        if (postliked.find(i => (i === post_id))) {
          var liked = true;
          }
        else {
          var liked = false;
        }


        // crea la base del post

        const divpost = document.createElement('div');
        const postitem = document.createElement('div');
        postitem.name = "itempost";
        divpost.style.border = "1px solid rgb(230, 224, 224)"
        divpost.style.margin = "20px";
        divpost.style.padding = "5px";       
        

        // boton de like

        const likebutton = document.createElement('button');

        likebutton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>`;

        likebutton.className = "col-1 ms-2 mb-2 btn btn-danger"
        likebutton.style.borderColor = "white";
        likebutton.style.backgroundColor = "white";
        if (liked == true){
          likebutton.style.color = "red";
        }
        else {likebutton.style.color = "grey";}
        
        // crea la fila para el like

        const likerow = document.createElement('div');
        likerow.className = "row align-items-center"
        const likenum = document.createElement('div');
        likenum.innerHTML = `<h6>${likes}</h6>`;
        likenum.className = "col-1"
        likerow.append(likebutton);
        likerow.append(likenum);

        // crea el contenido del post

        postitem.innerHTML = `<h5>@<strong>${creator}</strong> <small>${time}</small></h5> 
        <p class="lead">${body}</p><p class="lead">liked:${postliked} ${liked}</p>`;  

        // accion del boton like

        likebutton.addEventListener('click', () => {
          if (document.querySelector('#nametitle') === null){
            alert("you need to log in to like!");}
          else(
              fetch('/like', {
                method: 'PUT',
                body: JSON.stringify({
                  post_id: post_id,
                })
              })
              .then(() => {
                counter=0;
                loadposts()})
            )
            
          })

        // appenda los items y el post

        divpost.append(postitem);
        divpost.append(likerow);
        document.querySelector('#postsview').append(divpost);

        // accion del click post user

        divpost.addEventListener('click', () =>   
        loaduser(`${creator}`));  
      }
      
    })
    
  }

function loaduser(creator) {
    
    document.querySelector('#postsview').style.display = 'none';
    document.querySelector('#newpostview').style.display = 'none';
    document.querySelector('#userview').style.display = 'block';

    document.querySelector('#userview').innerHTML = "";

    const title = document.createElement('h2');
    title.innerHTML = `User: ${creator}`;
    title.style.margin = "20px";
    document.querySelector('#userview').append(title);

    

    fetch(`/loaduserposts/${creator}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const followed = data.followed;
      const followers = data.followers;
      const userrequest = data.user;
      const followdata = data.followdata;
      const userdata = document.createElement('div');
      userdata.innerHTML = `Followed: ${followed}<br/>Followers: ${followers}`;
      userdata.style.margin = "20px";
      document.querySelector('#userview').append(userdata);
     

      if (userrequest !== creator && userrequest !== 0){
        const follow = document.createElement('button');
        if (followdata){
          follow.innerHTML = "Unfollow";
        }
        else {
          follow.innerHTML = "Follow";
        }
        follow.style.margin = "20px";
        document.querySelector('#userview').append(follow);

        follow.addEventListener('click', () => {
          fetch('/follow', {
            method: 'PUT',
            body: JSON.stringify({
              follower: userrequest,
              followed: creator,
              followdata: followdata
            })
          })
          .then(() => loaduser(creator));
        })
      }
      

      for (let post of data.posts) {
        const creator = post.creator;
        const post_id = post.id;
        const idpost1 = post.id;
        const idpost =`post${post.id}`;
        const body = post.body;
        const time = post.timestamp;
        const likes = post.likes;
        const divpost = document.createElement('div');
        const postitem = document.createElement('div');
        postitem.name = "itempost";
        divpost.style.border = "1px solid rgb(230, 224, 224)"
        divpost.style.margin = "20px";
        divpost.style.padding = "5px";
        divpost.id = idpost;
        const postliked = data.likedposts;

        postitem.innerHTML = `<h5>@<strong>${creator}</strong> <small>${time}</small></h5> 
        <p class="lead">${body}</p>`; 

        //para revisar si el usuario ya likeo el post

        if (postliked.find(i => (i === post_id))) {
          var liked = true;
          }
        else {
          var liked = false;
        }
        
        // boton like

        const likebutton = document.createElement('button');

        likebutton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>`;

        likebutton.className = "col-1 ms-2 mb-2 btn btn-danger"
        likebutton.style.borderColor = "white";
        likebutton.style.backgroundColor = "white";
        if (liked == true){
          likebutton.style.color = "red";
        }
        else {likebutton.style.color = "grey";}

        // fila de like

        const likerow = document.createElement('div');
        likerow.className = "row align-items-start"
        const likenum = document.createElement('div');
        likenum.innerHTML = `<h6>${likes}</h6>`;
        likenum.className = "col-1 mt-2"
        likerow.append(likebutton);
        likerow.append(likenum);
        
        
        divpost.append(postitem);
        divpost.append(likerow);

        if (document.querySelector('#nametitle') !== null){
          if (document.querySelector('#nametitle').innerText === creator){
            const editbutton = document.createElement('button');
            editbutton.innerHTML = "Edit";
            editbutton.className = "col-1 btn btn-outline-success btn-sm mt-1"
            likerow.append(editbutton);
            editbutton.addEventListener('click', () => {
              document.querySelector(`#${idpost}`).innerHTML = 
              `${time}<br/>
              User: <strong>${creator}</strong><br/>
              Likes: ${likes}<br/>
              <form id="postform${idpost}">
              <textarea class="form-control" style="margin: 5px" id="bodyform${idpost}">${body}</textarea>
              <input type="submit" class="btn btn-primary" style="margin: 10px" value="Post"/>
              </form>
              `;
              document.querySelector(`#postform${idpost}`).onsubmit = () => {
                fetch('/editpost', {
                  method: 'PUT',
                  body: JSON.stringify({
                      body: document.querySelector(`#bodyform${idpost}`).value,
                      id: idpost1
                  })
                })
              .then(() => loaduser(creator));
              }
            })
          }

        }

        likebutton.addEventListener('click', () => {
          if (document.querySelector('#nametitle') === null){
            alert("you need to log in to like!");}
          else(
              fetch('/like', {
                method: 'PUT',
                body: JSON.stringify({
                  post_id: post_id,
                })
              })
              .then(() => {
                counter=0;
                loaduser(creator)})
            )
            
          })
        
        
      document.querySelector('#userview').append(divpost);

      }

        
        
    })
}

function loadfollowing() {
    
  document.querySelector('#postsview').style.display = 'none';
  document.querySelector('#newpostview').style.display = 'none';
  document.querySelector('#userview').style.display = 'block';

  document.querySelector('#userview').innerHTML = "";

  const title = document.createElement('h2');
  title.innerHTML = 'Posts from followed users';
  title.style.margin = "20px";
  document.querySelector('#userview').append(title);


  fetch('/loadfollowing')
    .then(response => response.json())
    .then(posts => {
      console.log(posts)
      for (let post of posts) {
        const creator = post.creator;
        //const post_id = post.id;
        const body = post.body;
        const time = post.timestamp;
        const likes = post.likes;
        const divpost = document.createElement('div');
        const postitem = document.createElement('div');
        postitem.name = "itempost";
        divpost.style.border = "1px solid rgb(230, 224, 224)"
        //emailitem.style.borderRadius = "1%"
        divpost.style.margin = "20px";
        divpost.style.padding = "5px";
        postitem.innerHTML = `${time}<br/>User: <strong>${creator}</strong> 
        <br/>${body}<br/>Likes: ${likes}`;        
        
        divpost.append(postitem);
        document.querySelector('#userview').append(divpost);

        postitem.addEventListener('click', () =>   
        loaduser(`${creator}`));  
      }
      
    })
}
  