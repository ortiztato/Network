document.addEventListener('DOMContentLoaded', function() {

    loadposts();

    document.querySelector('#allposts').addEventListener('click', () => {
        document.querySelector('#newpostview').style.display = 'none';
        loadposts();
    })

    document.querySelector('#network').addEventListener('click', () => {
        document.querySelector('#newpostview').style.display = 'block';
        loadposts();
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
              //loadposts();
              console.log(result);
        });
        return false;
    }
})

function loadposts() {
  
    // Show the mailbox and hide other views
    document.querySelector('#postsview').style.display = 'block';
    document.querySelector('#userview').style.display = 'none';
    //document.querySelector('#compose-view').style.display = 'none';
    //document.querySelector('#email-view').style.display = 'none';
    document.querySelector('#postsview').innerHTML = "";
  
    // Show the mailbox name
    const title = document.createElement('h2');
    title.innerHTML = "All Posts";
    title.style.margin = "20px";
    document.querySelector('#postsview').append(title);
    
    fetch('/loadposts')
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
      }

        // Display message on the screen
        
    })
}
  