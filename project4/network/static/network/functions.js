var counter = 0
var quantity = 10;

function loadposts() {

  // carga las vistas

  document.querySelector('#postsview').style.display = 'block';
  document.querySelector('#userview').style.display = 'none';
  document.querySelector('#postsview').innerHTML = "";

  //counter para el pagination

  const start = counter;
  const end = start + quantity;
  counter = end;

  // titulo

  const title = document.createElement('h2');
  title.innerHTML = "All Posts";
  title.id = "title"
  title.className = "titleallposts";
  document.querySelector('#postsview').append(title);

  // busca la data

  fetch(`/loadposts?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)



      // pagination 

      totalposts = data.totalposts;
      pages = Math.ceil(totalposts / quantity)
      document.querySelector('#pages').style.display = 'inline-block';
      document.querySelector('#pages').innerHTML = '';
      // previous button
      const previousbutton = document.createElement('button');
      previousbutton.innerHTML = "Previous";
      previousbutton.className = "paginationbutton";
      previousbutton.addEventListener('click', () => {
        counter = counter - quantity * 2;
        loadposts()
      })
      document.querySelector('#pages').append(previousbutton);
      // page buttons
      for (let i = 1; i < pages + 1; i++) {
        const pagebutton = document.createElement('button');
        pagebutton.innerHTML = `${i}`;
        pagebutton.className = "paginationbutton";
        pagebutton.addEventListener('click', () => {
          counter = (i * quantity) - 10;
          loadposts()
        })
        document.querySelector('#pages').append(pagebutton);
      }

      // next button
      const nextbutton = document.createElement('button');
      nextbutton.innerHTML = "Next";
      nextbutton.className = "paginationbutton";
      nextbutton.addEventListener('click', () => {
        loadposts()
      })
      document.querySelector('#pages').append(nextbutton);

      // carga los posts

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
        const divrow = document.createElement('div');
        const postitem = document.createElement('div');
        postitem.name = "itempost";
        divpost.className = "divpost"
        divrow.className = "divrow"
        postitem.className = "divtext"



        // boton de like

        const likebutton = document.createElement('button');

        likebutton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
      </svg>`;

        likebutton.className = "likebutton"

        if (liked == true) {
          likebutton.style.color = "red";
        }
        else { likebutton.style.color = "grey"; }

        // contador de likes

        // likerow.className = "col-md-auto mx-0" // likerow.className = "row align-items-center"
        const likenum = document.createElement('div');
        likenum.innerHTML = `<h6>${likes}</h6>`;
        likenum.className = "likestext"

        // crea el contenido del post

        postitem.innerHTML = `<span><a href="#" class="creatortext">@${creator}</a></span> <span class="timetext">${time}</span> 
      <p class="bodytext">${body}</p>`;


        // accion del boton like

        likebutton.addEventListener('click', () => {
          if (document.querySelector('#nametitle') === null) {
            alert("you need to log in to like! it's instant, no time wasting.\nFor testing you can log in with \nusername: testing \npass: testing");
          }
          else (
            fetch('/like', {
              method: 'PUT',
              body: JSON.stringify({
                post_id: post_id,
              })
            })
              .then(() => {
                counter = 0;
                loadposts()
              })
          )

        })

        // appenda los items y el post

        divrow.append(postitem);
        divrow.append(likebutton);
        divrow.append(likenum);
        divpost.append(divrow);
        document.querySelector('#postsview').append(divpost);

        // accion del click post user

        postitem.addEventListener('click', () => {
          counter = 0;
          loaduser(`${creator}`)
        });

      }

    })

}

// funcion que carga los post de un user especifico

function loaduser(creator) {

  // carga las vistas

  document.querySelector('#postsview').style.display = 'none';
  document.querySelector('#newpostview').style.display = 'none';
  document.querySelector('#userview').style.display = 'block';

  document.querySelector('#userview').innerHTML = "";

  // titulo

  const title = document.createElement('h2');
  title.innerHTML = `User: ${creator}`;
  title.className = "row m-4";
  document.querySelector('#userview').append(title);


  // counter para el pagination

  const start = counter;
  const end = start + quantity;
  counter = end;

  // busca la data

  fetch(`/loaduserposts/${creator}?start=${start}&end=${end}`)
    /* fetch(`/loaduserposts/${creator}`) */
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


      // pagination 

      totalposts = data.totalposts;
      pages = Math.ceil(totalposts / quantity)
      document.querySelector('#pages').style.display = 'inline-block';
      document.querySelector('#pages').innerHTML = '';
      // previous button
      const previousbutton = document.createElement('button');
      previousbutton.innerHTML = "Previous";
      previousbutton.className = "paginationbutton";
      previousbutton.addEventListener('click', () => {
        counter = counter - quantity * 2;
        loaduser(creator)
      })
      document.querySelector('#pages').append(previousbutton);
      // page buttons
      for (let i = 1; i < pages + 1; i++) {
        const pagebutton = document.createElement('button');
        pagebutton.innerHTML = `${i}`;
        pagebutton.className = "paginationbutton";
        pagebutton.addEventListener('click', () => {
          counter = (i * quantity) - 10;
          loaduser(creator)
        })
        document.querySelector('#pages').append(pagebutton);
      }
      // next button
      const nextbutton = document.createElement('button');
      nextbutton.innerHTML = "Next";
      nextbutton.className = "paginationbutton";
      nextbutton.addEventListener('click', () => {
        loaduser(creator)
      })
      document.querySelector('#pages').append(nextbutton);


      // boton de follow

      if (userrequest !== creator && userrequest !== 0) {
        const follow = document.createElement('button');
        if (followdata) {
          follow.innerHTML = "Unfollow";
          follow.className = "unfollowbutton";
        }
        else {
          follow.innerHTML = "Follow";
          follow.className = "followbutton";
        }
        //follow.style.marginLeft = "20px";
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
            .then(() => {
              counter = 0;
              loaduser(creator)
            });
        })
      }

      // carga los posts

      for (let post of data.posts) {
        const creator = post.creator;
        const post_id = post.id;
        const idpost1 = post.id;
        const idpost = `post${post.id}`;
        const body = post.body;
        const time = post.timestamp;
        const likes = post.likes;
        const postliked = data.likedposts;


        // crea la base del post

        const divpost = document.createElement('div');
        divpost.id = idpost;
        const divrow = document.createElement('div');
        const postitem = document.createElement('div');
        postitem.name = "itempost";
        divpost.className = "divpost"
        divrow.className = "divrow"
        postitem.className = "divtext"


        postitem.innerHTML = `<span><a href="#" class="creatortext">@${creator}</a></span> <span class="timetext">${time}</span> 
      <p class="bodytext">${body}</p>`;

        // para revisar si el usuario ya likeo el post

        if (postliked.find(i => (i === post_id))) {
          var liked = true;
        }
        else {
          var liked = false;
        }

        // boton de like

        const likebutton = document.createElement('button');

        likebutton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>`;

        likebutton.className = "likebutton"

        if (liked == true) {
          likebutton.style.color = "red";
        }
        else { likebutton.style.color = "grey"; }

        // contador de likes


        const likenum = document.createElement('div');
        likenum.innerHTML = `<h6>${likes}</h6>`;
        likenum.className = "likestext"


        // appenda los items y el post

        divrow.append(postitem);
        divrow.append(likebutton);
        divrow.append(likenum);
        divpost.append(divrow);
        document.querySelector('#userview').append(divpost);

        // opcion de editar

        if (document.querySelector('#nametitle') !== null) {
          if (document.querySelector('#nametitle').innerText === creator) {
            const editbutton = document.createElement('button');
            editbutton.innerHTML = "Edit";
            editbutton.className = "col-1 btn btn-outline-success btn-sm mt-1"
            postitem.append(editbutton);
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
                  .then(() => {
                    counter = 0;
                    loaduser(creator)
                  });
              }
            })
          }

        }

        // accion sobre el boton de like

        likebutton.addEventListener('click', () => {
          if (document.querySelector('#nametitle') === null) {
            alert("you need to log in to like! it's instant, no time wasting.\nFor testing you can log in with \nusername: testing \npass: testing");
          }
          else (
            fetch('/like', {
              method: 'PUT',
              body: JSON.stringify({
                post_id: post_id,
              })
            })
              .then(() => {
                counter = 0;
                loaduser(creator)
              })
          )

        })


        document.querySelector('#userview').append(divpost);
      }
    }
    )
}

// funcion que carga los post de los users que follow

function loadfollowing() {

  document.querySelector('#postsview').style.display = 'none';
  document.querySelector('#newpostview').style.display = 'none';
  document.querySelector('#userview').style.display = 'block';

  document.querySelector('#userview').innerHTML = "";

  // titulo

  const title = document.createElement('h2');
  title.innerHTML = 'Users Following';
  title.id = "titleuser"
  title.className = "row m-4";
  document.querySelector('#userview').append(title);



  // counter para el pagination

  const start = counter;
  const end = start + quantity;
  counter = end;

  // busca la data

  fetch(`/loadfollowing?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
      console.log(data)

      // pagination

      totalposts = data.totalposts;
      pages = Math.ceil(totalposts / quantity)
      document.querySelector('#pages').style.display = 'inline-block';
      document.querySelector('#pages').innerHTML = '';
      // previous button
      const previousbutton = document.createElement('button');
      previousbutton.innerHTML = "Previous";
      previousbutton.className = "paginationbutton";
      previousbutton.addEventListener('click', () => {
        counter = counter - quantity * 2;
        loadfollowing()
      })
      document.querySelector('#pages').append(previousbutton);
      // page buttons
      for (let i = 1; i < pages + 1; i++) {
        const pagebutton = document.createElement('button');
        pagebutton.innerHTML = `${i}`;
        pagebutton.className = "paginationbutton";
        pagebutton.addEventListener('click', () => {
          counter = (i * quantity) - 10;
          loadfollowing()
        })
        document.querySelector('#pages').append(pagebutton);
      }
      // next button
      const nextbutton = document.createElement('button');
      nextbutton.innerHTML = "Next";
      nextbutton.className = "paginationbutton";
      nextbutton.addEventListener('click', () => {
        loadfollowing()
      })
      document.querySelector('#pages').append(nextbutton);


      // carga los posts

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
        const divrow = document.createElement('div');
        const postitem = document.createElement('div');
        postitem.name = "itempost";
        divpost.className = "divpost"
        divrow.className = "divrow"
        postitem.className = "divtext"


        // boton de like

        const likebutton = document.createElement('button');

        likebutton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
      </svg>`;

        likebutton.className = "likebutton";

        if (liked == true) {
          likebutton.style.color = "red";
        }
        else { likebutton.style.color = "grey"; }

        // contador de likes


        const likenum = document.createElement('div');
        likenum.innerHTML = `<h6>${likes}</h6>`;
        likenum.className = "likestext"


        // crea el contenido del post

        postitem.innerHTML = `<span><a href="#" class="creatortext">@${creator}</a></span> <span class="timetext">${time}</span> 
      <p class="bodytext">${body}</p>`;

        // accion del boton like

        likebutton.addEventListener('click', () => {
          if (document.querySelector('#nametitle') === null) {
            alert("you need to log in to like! it's instant, no time wasting.\nFor testing you can log in with \nusername: testing \npass: testing");
          }
          else (
            fetch('/like', {
              method: 'PUT',
              body: JSON.stringify({
                post_id: post_id,
              })
            })
              .then(() => {
                counter = 0;
                loadfollowing()
              })
          )

        })

        // appenda los items y el post

        divrow.append(postitem);
        divrow.append(likebutton);
        divrow.append(likenum);
        divpost.append(divrow);
        document.querySelector('#userview').append(divpost);

        // accion del click post user

        postitem.addEventListener('click', () => {
          counter = 0;
          loaduser(`${creator}`)
        });

      }
    })





}
