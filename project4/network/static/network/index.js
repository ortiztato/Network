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
      document.querySelector('#pages').style.display = 'block';
      document.querySelector('#pages').innerHTML = '';
      for (let i=1; i<pages+1; i++) {
        elementpage = document.createElement('li');
        elementpage.innerHTML = `<class="page-item"><a class="page-link" id="page${i}">${i}</a>`;
        document.querySelector('#pages').append(elementpage);
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
        const divpost = document.createElement('div');
        const postitem = document.createElement('div');
        postitem.name = "itempost";
        divpost.style.border = "1px solid rgb(230, 224, 224)"
        //emailitem.style.borderRadius = "1%"
        divpost.style.margin = "20px";
        divpost.style.padding = "5px";
        postitem.innerHTML = `${time}<br/>User: <strong>${creator}</strong> 
        <br/>${body}<br/>Likes: ${likes}`;        
        
        const likebutton = document.createElement('button');

        likebutton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
        </svg>`;

        likebutton.style.borderColor = "white";
        likebutton.style.backgroundColor = "white";
        likebutton.style.boxShadow = "none";

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
              .then(() => loadposts())
            )
            
          })

        divpost.append(postitem);
        divpost.prepend(likebutton);
        document.querySelector('#postsview').append(divpost);

        postitem.addEventListener('click', () => 
        //alert(`${creator}`));  
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
        const idpost1 = post.id;
        const idpost =`post${post.id}`;
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
        divpost.id = idpost;
        postitem.innerHTML = `${time}<br/>User: <strong>${creator}</strong> 
        <br/>${body}<br/>Likes: ${likes}`;        
        
        divpost.append(postitem);

        if (document.querySelector('#nametitle').innerText === creator){
          const editbutton = document.createElement('button');
          editbutton.innerHTML = "Edit";
          divpost.append(editbutton);
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
        
      document.querySelector('#userview').append(divpost);

      }

        // Display message on the screen
        
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
        //alert(`${creator}`));  
        loaduser(`${creator}`));  
      }
      
    })
}
  