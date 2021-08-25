import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

// 2.1 login, sign up and error pop up

// 2.1.3 error pop up functions
// login and sign up pop error functons
function popMatchError() {
    document.getElementById('passwordMatch').style.display = "block";
    document.getElementById('btn-1').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('passwordMatch').style.display = "none";
        document.getElementById('feedLogin').style.top = "30%";
    });
}

// Missing username or password
function popMissing () {
    popMatchError();
    document.getElementById('changeText').innerText = "Missing username or password!";
    document.getElementById('passwordMatch').style.top = "30%";
}

// input an invalid username or password
function popInvalidInfo() {
    popMatchError();
    document.getElementById('changeText').innerText = "Invalid username or password!";
    document.getElementById('passwordMatch').style.top = "40%";
}

// username was taken
function popUsernameTaken() {
    popMatchError();
    document.getElementById('changeText').innerText = "Username taken!";
    document.getElementById('passwordMatch').style.top = "40%";
}

// pop up any other fetch error
let fetchError = '';
function fetchErrorPopup(fetchError) {
    popMatchError();
    document.getElementById('changeText').innerText = fetchError;
    document.getElementById('passwordMatch').style.top = "40%";
}

// header show inline item
function showInlineItem() {
    document.getElementById('update-profile').style.display = "inline";
    document.getElementById('add-post').style.display = "inline";
    document.getElementById('follow').style.display = "inline";
    document.getElementById('unfollow').style.display = "inline";
    document.getElementById('btn-0').style.display = "inline";
    document.getElementById('show-posts').style.display = "inline";
    document.getElementById('my-page').style.display = "inline";
    document.getElementById('nav').style.display = "inline";
}
// login feed
function feedLogin() {
    document.getElementById('container').style.display = "none";
    document.getElementById('changeTextFeed').innerText = "Not yet implemented!";
    document.getElementById('changeTextFeed').style.display = "block";
    showInlineItem();
    document.getElementById('btn-0').addEventListener('click', () => {
        // document.getElementById('container').style.display = "block";
        // document.getElementById('feedLogin').style.display = "none";
        // document.getElementById('show-feed-posts').style.display = "none";
        // document.getElementById('nav').style.display = "none";
        window.location.reload(true);// test
    });
}

// sign up feed
function feedSignUp() { // show sign up page and go back to login
    document.getElementById('container').style.display = "none";
    document.getElementById('feedLogin').style.display = "block";
    document.getElementById('changeTextFeed').innerText = "Sign up successfully and welcome to login!";
    showInlineItem();//
    document.getElementById('show-posts').style.display = "none";
    document.getElementById('my-page').style.display = "none";
    document.getElementById('btn-0').innerText = "Login";
    document.getElementById('btn-0').addEventListener('click', () => {
        // document.getElementById('btn-0').innerText = "Logout";
        // document.getElementById('btn-0').style.display = "none";
        // document.getElementById('container').style.display = "block";
        // document.getElementById('feedLogin').style.display = "none";
        // document.getElementById('emailAndName').style.display = "none";
        // document.getElementById('changeLoginInformation').style.display = "block";
        window.location.reload(true);// test
    });
}

// 2.1.1 login fetch functions
let AUTH_TOKEN = '';
let myUsername = '';
document.getElementById('loginButton').addEventListener('click', (e) => {
    e.preventDefault();
    const loginBody = {
        "username": document.getElementById('username').value,
        "password": document.getElementById('password').value,
    };    
    const loginConfirmPassword = document.getElementById('password_2').value;
    if (loginBody["password"] !== loginConfirmPassword) {
        popMatchError();
    } else {
        const result = fetch('http://localhost:5000/auth/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginBody),
        }).then(data => {
            if (data.status === 400) {
                popMissing();
            } else if (data.status === 403) {
                popInvalidInfo();
            } else if (data.status === 200) {
                myUsername = loginBody.username; // add to my page for user check 2.4.1
                data.json().then(result => { // changed
                    AUTH_TOKEN = result.token;
                    getUsersFeed();
                }); 
                // from here changed
                document.getElementById('feedLogin').style.display = "block";
                feedLogin();
            }
        }).catch((error) => {
            fetchError = error;
            fetchErrorPopup(fetchError);
        });
    }
});

// 2.1.2 sign up fetch functions
function createRegisterForm() {
    document.getElementById('emailAndName').style.display = "block";
    document.getElementById('appTitle').innerText = "Please sign up";
    document.getElementById('changeLoginInformation').style.display = "none";
}

document.getElementById('registerButton').addEventListener('click', (e) => {
    e.preventDefault();
    createRegisterForm();
    document.getElementById('btn-signup').addEventListener('click', (e) => {
        e.preventDefault();
        const registerBody = {
            "username": document.getElementById('username').value,
            "password": document.getElementById('password').value,
            "email": document.getElementById('email').value,
            "name": document.getElementById('name').value,
        } 
        const loginConfirmPassword = document.getElementById('password_2').value;
        if (registerBody["password"] !== loginConfirmPassword) {
            popMatchError();
        } else {
            const result = fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerBody),
            }).then(data => {
                if (data.status === 400) {
                    popMissing();
                } else if (data.status === 409) {
                    popUsernameTaken();
                } else if (data.status === 200) {
                    feedSignUp();
                }
            }).catch((error) => {
                fetchError = error;
                fetchErrorPopup(fetchError);
            });
        }
    });   
});

// 2.2.1 get users feed: basic feed
let posts;
function getUsersFeed() {
    const result1 = fetch('http://localhost:5000/user/feed', { // feed?p=0&n=10
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'TOKEN ' + AUTH_TOKEN,
    },
    }).then(response => response.json())
    .then(responseData => {
        posts = responseData.posts;
        if (posts.length > 0) {
            showPost(posts);
            feedPagination (1, 5, posts); // test1
        }
        }).then(data => {
            likeHandler(posts);
            commentHandler(posts);
            showPagination(posts); /// test1
        }).then(profile => {
            userProfile(posts);
        }).then(show => {
            showMyPage();
        }).catch((error) => {
            fetchError = error;
            fetchErrorPopup(fetchError);
        });
    }

// 2.2.1 add a User button as a bonus maybe
document.getElementById('show-posts').addEventListener('click', (e) => {
    e.preventDefault();
    try {
        const mainElement = document.querySelector('#main-element');
        const main = document.querySelector('#show-feed-posts');
        const userMainPage = document.querySelector('#user-main-page-element');
        main.removeChild(mainElement);
        main.removeChild(userMainPage);
    }
    catch(error) {
        fetchError = error;
        fetchErrorPopup(fetchError);
    }
    getUsersFeed();
});

// sort all posts 2.2.1
function sortPost(posts) {
    posts = posts.sort(function(c1, c2) {
        if (c1.meta.published > c2.meta.published) {
          return -1;
        } else {
          return 1;
        }
    });
}

// show all posts
let counter = 0; // prevent always append element
function showPost(posts) {
    sortPost(posts);
    try {
            const main = document.querySelector('#show-feed-posts');
            const mainElement = document.querySelector('#main-element');
            main.removeChild(mainElement);
        }
    catch(error) {
        fetchError = error;
        fetchErrorPopup(fetchError);
    }
    document.getElementById('changeTextFeed').style.display = "none";
    document.getElementById('show-feed-posts').style.display = "block";
    const main = document.querySelector('#show-feed-posts');
    const mainElement = document.createElement('div');
    mainElement.id = "main-element";
    const commentsNumber = document.createElement('span');
    for (let i = 0; i < posts.length; i++) {
        const btn = document.createElement('button'); //button like
        btn.className ="like-btn";
        btn.innerText = 'like';
        btn.id = i;
        const btnUpdate = document.createElement('button'); //button update
        btnUpdate.className ="update-btn";
        btnUpdate.innerText = 'update';
        btnUpdate.id = 'update' + `${i}`;
        const btnDelete = document.createElement('button'); //button delete
        btnDelete.className ="delete-btn";
        btnDelete.innerText = 'delete';
        btnDelete.id = 'delete' + `${i}`;
        const btnComment = document.createElement('button'); //button comment
        btnComment.className ="comment-btn";
        btnComment.innerText = 'comment';
        btnComment.id = 'comment' + `${i}`;
        const section = document.createElement('section');
        const name = document.createElement('h3');
        name.id = 'h3' + `${i}`;
        const description = document.createElement('p');
        description.id = 'user-description';
        const postedTime = document.createElement('span');
        postedTime.id = 'post-time-id';
        const likes = document.createElement('span');
        likes.id = 'like-id';
        const comments = document.createElement('span');
        comments.id = 'comments-id';
        const img = document.createElement('img');
        const divBelowImg = document.createElement('div');
        const hr = document.createElement('hr');
        divBelowImg.className = "div-below-img"; //
        mainElement.appendChild(section);
        section.appendChild(img); // add img
        img.src = "data: image/png;base64," + posts[i].thumbnail;
        divBelowImg.appendChild(name); // add author
        name.innerText = posts[i].meta.author;
        img.alt = posts[i].meta.author;
        divBelowImg.appendChild(description); // add descripption
        description.innerText = posts[i].meta.description_text;
        divBelowImg.appendChild(btn);
        divBelowImg.appendChild(btnUpdate); //
        divBelowImg.appendChild(btnDelete); // delete
        divBelowImg.appendChild(btnComment); // add comment btn
        divBelowImg.appendChild(postedTime); // add time changed position
        let date = new Date(parseInt(posts[i].meta.published) * 1000)
        postedTime.innerText = String(date).slice(0, 25) + ' ';
        divBelowImg.appendChild(likes); // add likes
        likes.innerText = ' likes: ' + String(posts[i].meta.likes.length) + ' ';
        showLikes(divBelowImg, posts[i].meta.likes);
        divBelowImg.appendChild(comments); // add comments content
        comments.innerText = ' comments: ' + String(posts[i].comments.length);
        section.appendChild(divBelowImg);
        showComments(divBelowImg, posts[i].comments);
        section.appendChild(hr);
    }
    main.appendChild(mainElement);
}

// 2.3 more feed

// 2.3.1 show likes
function showLikes(divBelowImg, arr) {
    let countElement = 0
    arr.forEach(element => {
        const result = fetch(`http://localhost:5000/user/?id=${element}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'TOKEN ' + AUTH_TOKEN,
        },
    }).then(res => res.json())
        .then(data => {
            element = data.username
            countElement += 1;
            if (countElement == 1) {
                const node = document.createTextNode(` likes: ${element}`);
                divBelowImg.appendChild(node);
            } else {
                divBelowImg.appendChild(document.createTextNode(` ,${element}`));
            }  
        });
    });
}

// 2.3.2 show comments
function showComments(divBelowImg, comments) {
    comments.forEach(comment => {
        const brNode = document.createElement('br');
        const node = document.createTextNode(` ${comment.author}: ${comment.comment} `);
        divBelowImg.appendChild(node);
        divBelowImg.appendChild(brNode);
    });
}

// 2.3.3 fetch like call back async
function likeHandler(posts) {
    for (let i = 0; i < posts.length; i++) {
        document.getElementById(`${i}`).addEventListener('click', (e) => {
            e.preventDefault();
            const result = fetch(`http://localhost:5000/post/like?id=${posts[i].id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'TOKEN ' + AUTH_TOKEN,
            },
            }).then(response => response.json())
            .catch((error) => console.log('Feed Error: ', error));
        });
    } 
}

// 2.3.4 feed pagination, infinate scroll later
function feedPagination (pageNumber, pageSize, posts) {
    let mainElement = document.getElementById('main-element');
    let postsNumber = mainElement.childNodes.length;
    let totalPage = 0;
    let pSize = pageSize;
    if (postsNumber/pSize > parseInt(postsNumber/pSize)) {
        totalPage = parseInt(postsNumber/pSize) + 1;
    } else {
        totalPage = parseInt(postsNumber/pSize);
    }
    let currentPage = pageNumber;
    let startPost = (currentPage-1) * pSize + 1;
    let endPost = currentPage * pSize;
    for (let i = 1; i < postsNumber + 1; i++) {
        let iPost = mainElement.childNodes[i-1];
        if ((i >= startPost) && (i <= endPost)) {
            iPost.style.display = 'block';
        } else {
            iPost.style.display = 'none';
        }
    }
    let infoText = 'Total posts ' + `${postsNumber}` + ' Total page ' + `${totalPage}` + 
                    ' Current Page ' + `${currentPage}`;
    document.getElementById('show-pagination').innerText = infoText;
}

// 2.3.4 feed pagination
function showPagination(posts) {
    let first = 1;
    let last = parseInt((posts.length)/5) + 1;
    document.getElementById('next-page').addEventListener('click', (e) => {
        e.preventDefault();
        first += 1;
        feedPagination (first, 5, posts);
    });
    document.getElementById('last-page').addEventListener('click', (e) => {
        e.preventDefault();
        first -= 1;
        feedPagination (first, 5, posts);
    });
    document.getElementById('first-page').addEventListener('click', (e) => {
        e.preventDefault();
        first = 1;
        feedPagination (first, 5, posts);
    });
    document.getElementById('end-page').addEventListener('click', (e) => {
        e.preventDefault();
        first = last
        last = parseInt((posts.length)/5) + 1;
        feedPagination (last, 5, posts);
    });
}

// 2.4 Other users and mine
// fetch main error used in main page after login
function fetchErrorMainPage(error) {
    document.getElementById('delete-popout').style.display = "block";
    document.getElementById('delete-error').innerText = error;
    document.getElementById("delete-close").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("delete-popout").style.display = "none";
    });
}
// 2.4.1 profile view others
function userProfile(posts) {
    for (let i = 0; i < posts.length; i++) {
        document.getElementById('h3' + `${i}`).addEventListener('click', (e) => {
            e.preventDefault();
            const result = fetch(`http://localhost:5000/user/?username=${posts[i].meta.author}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'TOKEN ' + AUTH_TOKEN,
            },
            }).then(response => response.json())
            .then(data => {
                showProfile(data);
            })
            .catch((error) => {
                fetchErrorMainPage(error);
            });
        });
    } 
}

// show followers
let followerArray = [];
function showProfile(data) {
    showUserMainPage(data); // show user's mian page
    followerArray = posts.filter(post => post.meta.author == data.username);
    const main = document.querySelector('#show-feed-posts');
    const mainElement = document.querySelector('#main-element');
    main.removeChild(mainElement);
    showPost(followerArray);
}

// show user's main page
function showUserMainPage(data) {
    try {
        const mainElement = document.querySelector('#user-main-page-element');
        const main = document.querySelector('#show-feed-posts');
        main.removeChild(mainElement);
    }
    catch(error) {
        fetchError = error;
        fetchErrorPopup(fetchError);
    }
    const main = document.querySelector('#show-feed-posts');
    const mainElement = document.createElement('div');
    mainElement.id = "user-main-page-element";
    const section = document.createElement('section');
    const username = document.createElement('h2');
    const name = document.createElement('h4');
    const id = document.createElement('h4');
    const email = document.createElement('h4');
    const following = document.createElement('h4');
    const followed = document.createElement('h4');
    const hr = document.createElement('hr');
    main.appendChild(mainElement);
    mainElement.append(section);
    section.append(username);
    username.innerText = `Username: ${data.username}`;
    section.append(name);
    name.innerText = `Name: ${data.name}`;
    section.append(id);
    id.innerText = `id: ${data.id}`;
    section.append(email);
    email.innerText = `Email: ${data.email}`;
    section.append(following);
    following.innerText = "Following: "
    if (data.following.length == 0) {
        following.innerText += 'None';
    } else {
        getFollowerList(data.following, following);/// change below 2 lines
        // following.innerText += 'Number: ' + data.following.length + '. ID: ';
        // data.following.forEach((follow) => following.innerText += follow + ", ");
    }
    section.append(followed);
    followed.innerText = `Followed: ${data.followed_num}`;
    section.appendChild(hr);
}

// 4.4.2 ///
function getFollowerList(userFollows, following) {
    userFollows.forEach((id) => getFollowerName(id));
    // following.innerText += name;
    const olBelowDiv = document.createElement("div");
    olBelowDiv.id = 'ol-below-div-list';
    const ol = document.createElement("ol");
    ol.id = "ol-list";
    const btn = document.createElement('button');
    btn.innerText = "Show following";
    btn.id = 'show-follow';
    const Number = document.createElement('p');
    Number.innerText = "Number: " + userFollows.length;
    following.appendChild(Number);
    following.appendChild(btn);
    following.appendChild(olBelowDiv);
    olBelowDiv.appendChild(ol);
    for (let i = 0; i < name.length; i++) {
        const li = document.createElement('li');
        li.innerText = name[i];
        ol.appendChild(li);
    }
    document.getElementById('show-follow').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('ol-below-div-list').style.display = "block";
        fetchMyPage(); // 
        //document.getElementById('close-follow').style.display = "none";
    })
    name = [];
}

// get the name of followers
let name = [];
function getFollowerName(id) {
    const result = fetch(`http://localhost:5000/user/?id=${id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'TOKEN ' + AUTH_TOKEN,
        },
        }).then(res => res.json())
        .then(data => {
            name.push(data.username);
        });
}
///

// 2.4.1 my own page view
function fetchMyPage() {
    const result = fetch(`http://localhost:5000/user/?username=${myUsername}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'TOKEN ' + AUTH_TOKEN,
        },
        }).then(response => response.json())
        .then(data => {
            try {
                const main = document.querySelector('#show-feed-posts');
                const mainElement = document.querySelector('#main-element');
                main.removeChild(mainElement);
            }
            catch(error) {
                fetchError = error;
                fetchErrorPopup(fetchError);
            }
            showUserMainPage(data);
            getMyPosts(data.posts);
            name = [];
        }).then(myPost => {
            try {
                const main = document.querySelector('#show-feed-posts');
                const mainElement = document.querySelector('#main-element');
                main.removeChild(mainElement);
            }
            catch(error) {
                fetchError = error;
                fetchErrorPopup(fetchError);
            }
        })
        .catch((error) => {
            fetchErrorMainPage(error);
        });  
}
//////////////////////////////////////////////////////////////////////////////
function showMyPage() {
    document.getElementById('my-page').addEventListener('click', (e) => {
        e.preventDefault();
        const result = fetch(`http://localhost:5000/user/?username=${myUsername}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'TOKEN ' + AUTH_TOKEN,
        },
        }).then(response => response.json())
        .then(data => {
            try {
                const main = document.querySelector('#show-feed-posts');
                const mainElement = document.querySelector('#main-element');
                main.removeChild(mainElement);
            }
            catch(error) {
                fetchError = error;
                fetchErrorPopup(fetchError);
            }
            showUserMainPage(data);
            getMyPosts(data.posts);
        }).then(myPost => {
            try {
                const main = document.querySelector('#show-feed-posts');
                const mainElement = document.querySelector('#main-element');
                main.removeChild(mainElement);
            }
            catch(error) {
                fetchError = error;
                fetchErrorPopup(fetchError);
            }
            showPost(myPostsArray); // change sth
            // feedPagination (1, 5, posts); // test111
            updateHandler(myPostsArray); // update 
            deleteHandler(myPostsArray); // delete
            commentHandler(myPostsArray);
            myPostsArray = [];
        })
        .catch((error) => {
            fetchErrorMainPage(error);
        });
    });    
}

// get my post
let myPostsArray = [];
function getMyPosts(postdArray) {
    for (let i = 0; i < postdArray.length; i++) {
        const result = fetch(`http://localhost:5000/post/?id=${postdArray[i]}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'TOKEN ' + AUTH_TOKEN,
            },
        }).then(response => response.json())
        .then(data => {
            setTimeout(myPostsArray.unshift(data), 50);
            if (i === postdArray.length - 1) {
                showPost(myPostsArray);
                updateHandler(myPostsArray);
                deleteHandler(myPostsArray);
                commentHandler(myPostsArray);
                myPostsArray = []
            }
        }).catch((error) => {
            fetchErrorMainPage(error);
        });
    }
}

// 2.4.2 follow and unfollow
// follow
// follow state popup
function followPopup() {
    document.getElementById('follow-success').style.display = "block";
    document.getElementById("close-follow").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("follow-popout").style.display = "none";
        document.getElementById('follow-success').innerText = "";
    });
}

// fetch follow
document.getElementById('follow').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('follow-popout').style.display = "block";
    document.getElementById("close-follow").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("follow-popout").style.display = "none";
    });
    document.getElementById('follow-submit').addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('follow-input').value;
        const result = fetch(`http://localhost:5000/user/follow?username=${name}`,{
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'TOKEN ' + AUTH_TOKEN,
        },
        }).then(res => {
            if (res.status === 200) {
                document.getElementById('follow-success').innerText = "Follow Success";
                followPopup();
            } else if (res.status === 404) {
                document.getElementById('follow-success').innerText = "User Not Found";
                followPopup();
            } else if (res.status === 403) {
                document.getElementById('follow-success').innerText = "Invalid Auth Token";
                followPopup();
            } else if (res.status === 400) {
                document.getElementById('follow-success').innerText = "Malformed Request";
                followPopup();
            }
        }).catch((error) => {
            fetchErrorMainPage(error);
        });
    })
})

// unfollow
// unfollow state function
function unfollowPopup() {
    document.getElementById('unfollow-success').style.display = "block";
    document.getElementById("close-unfollow").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("unfollow-popout").style.display = "none";
        document.getElementById('unfollow-success').innerText = "";
    });
}

// fetch unfollow
document.getElementById('unfollow').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('unfollow-popout').style.display = "block";
    document.getElementById("close-unfollow").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("unfollow-popout").style.display = "none";
    });
    document.getElementById('unfollow-submit').addEventListener('click', (e) => {
        e.preventDefault();
        const name = document.getElementById('unfollow-input').value;
        const result = fetch(`http://localhost:5000/user/unfollow?username=${name}`,{
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'TOKEN ' + AUTH_TOKEN,
        },
        }).then(res => {
            if (res.status === 200) {
                document.getElementById('unfollow-success').innerText = "Unfollow Success";
                unfollowPopup();
            } else if (res.status === 400) {
                document.getElementById('unfollow-success').innerText = "Malformed Request";
                unfollowPopup();
            } else if (res.status === 403) {
                document.getElementById('unfollow-success').innerText = "Invalid Auth Token";
                unfollowPopup();
            } else if (res.status === 404) {
                document.getElementById('unfollow-success').innerText = "User Not Found";
                unfollowPopup();
            }
        }).catch((error) => {
            fetchErrorMainPage(error);
        });
    })
})

// 2.5 adding  and updating content
// read url
let image_src = '';
function getURL() {
    const file = document.getElementById('file1').files[0];
    const reader = new FileReader();
    reader.addEventListener('load', function () {
        image_src = reader.result;
    }, false);
    if (file) {
        reader.readAsDataURL(file);
    }
}

// 2.5.1 adding a post 
// add Post error
function addPostPopup() {
    document.getElementById('post-success').style.display = "block";
    document.getElementById('close-post').style.display = "block";
    document.getElementById("close-post").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("post-popout").style.display = "none";
        document.getElementById('post-success').style.display = 'none';
        document.getElementById('upload-success').style.display = 'none';
        document.getElementById('upload').style.display = 'none';/// check
        document.getElementById('post-success').innerText = "Add Post Success";
    });
}
// add post
document.getElementById('add-post').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('post-popout').style.display = "block";
    document.getElementById('close-post').style.display = "block";
    document.getElementById("close-post").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("post-popout").style.display = "none";
    });
    document.getElementById('upload').addEventListener('click', (e) => {
        e.preventDefault();
        getURL();
        document.getElementById('upload-success').style.display = 'block';
        document.getElementById('post-submit').addEventListener('click', (e) => {
            e.preventDefault();
            getURL();
            let data64 = image_src.slice(22);
            const postBody = {
                "description_text": document.getElementById('post-input').value,
                "src": data64,
            };   
            const result = fetch('http://localhost:5000/post', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'TOKEN ' + AUTH_TOKEN,
                },
                body: JSON.stringify(postBody),
            }).then(data => {
                if (data.status === 200) {
                    document.getElementById('update-post-success').innerText = "Add Post Success";
                    addPostPopup();
                    data.json().then(result => {
                        console.log(result.post_id)
                    });
                } else if (data.status === 403) {
                    document.getElementById('post-success').innerText = "Invalid Auth Token";
                    addPostPopup();
                } else if (data.status === 400) {
                    document.getElementById('post-success').innerText = "Malformed Request, Image could not be processed";
                    addPostPopup();
                }
            }).catch((error) => {
                fetchErrorMainPage(error);
            });
        });
    })
});

// 5.2 delete and update
// update
function postUpdatePopout() {
    document.getElementById('update-post-success').style.display = "block";
    document.getElementById('update-close-post').style.display = "block";
    document.getElementById("update-close-post").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("update-post-popout").style.display = "none";
        document.getElementById("update-post-success").style.display = "none";
        document.getElementById("update-upload-success").style.display = "none";
        document.getElementById('update-upload').style.display = 'none';
        document.getElementById('update-post-success').innerText = "Update Post Success";
    });
}

// post update fetch
function updateHandler(posts) {
    for (let i = 0; i < posts.length; i++) {
        document.getElementById('update' + `${i}`).addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('update-post-popout').style.display = "block";
            document.getElementById('update-close-post').style.display = 'block';
            document.getElementById("update-close-post").addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById("update-post-popout").style.display = "none";
            });
            document.getElementById('update-upload').addEventListener('click', (e) => {
                e.preventDefault();
                getURL();
                document.getElementById('update-upload-success').style.display = 'block';
                document.getElementById('update-post-submit').addEventListener('click', (e) => {
                    e.preventDefault();
                    getURL();
                    // console.log(image_src);
                    let data64 = image_src.slice(22);
                    const updateBody = {
                        "description_text": document.getElementById('update-post-input').value,
                        "src": data64,
                    };  
                    const result = fetch(`http://localhost:5000/post/?id=${posts[i].id}`, {
                        method: 'PUT',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'TOKEN ' + AUTH_TOKEN,
                        },
                        body: JSON.stringify(updateBody),
                    }).then(data => {
                        if (data.status === 200) {
                            document.getElementById('update-post-success').innerText = "Update Post Success";
                            postUpdatePopout();
                            data.json().then(result => {
                                console.log(result);
                            });
                        } else if (data.status === 500) {
                            document.getElementById('update-post-success').innerText = "Internal Server Error";
                            postUpdatePopout();
                        } else if (data.status === 400) {
                            document.getElementById('update-post-success').innerText = "Malformed Request";
                            postUpdatePopout();
                        } else if (data.status === 403) {
                            document.getElementById('update-post-success').innerText = "Invalid Auth Token, Unauthorized to edit Post";
                            postUpdatePopout();
                        } else if (data.status === 400) {
                            document.getElementById('update-post-success').innerText = "Malformed Request";
                            postUpdatePopout();
                        }
                    }).catch((error) => {
                        fetchErrorMainPage(error);
                    });
                });
            })  
        });
    } 
}

// 5.2 delete
// delete error handler
function showDeleteResult() {
    document.getElementById('delete-popout').style.display = "block";
    document.getElementById("delete-close").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("delete-popout").style.display = "none";
        document.getElementById('delete-error').innerText = 'Delete Success';
    });
}
function deleteHandler(posts) {
    for (let i = 0; i < posts.length; i++) {
        document.getElementById('delete' + `${i}`).addEventListener('click', (e) => {
            e.preventDefault();
            const result = fetch(`http://localhost:5000/post/?id=${posts[i].id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'TOKEN ' + AUTH_TOKEN,
                },
            }).then(data => {
                if (data.status === 200) {
                    document.getElementById('delete-error').innerText = "Delete Success";
                    showDeleteResult();
                    data.json().then(result => {
                        console.log(result);
                    });
                } else if (data.status === 404) {
                    document.getElementById('delete-error').innerText = 'Post Not Found';
                    showDeleteResult();
                } else if (data.status === 403) {
                    document.getElementById('delete-error').innerText = 'Invalid Auth Token';
                    showDeleteResult();
                } else if (data.status === 400) {
                    document.getElementById('delete-error').innerText = 'Malformed Request';
                    showDeleteResult();
                }
                // console.log("delete data", data);   
        }).catch((error) => {
            fetchErrorMainPage(error);
        });
    });
    }
}

// 5.3 leaving comments
// show errors of fetch and others
function showCommentResult() {
    document.getElementById('comment-success').style.display = "block";
    document.getElementById('close-comment').style.display = "block";
    document.getElementById("close-comment").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("comment-popout").style.display = "none";
        document.getElementById('comment-success').style.display = "none";
        document.getElementById('comment-success').innerText = 'Comment Success';
    });
}
// comments fetch
function commentHandler(posts) {
    for (let i = 0; i < posts.length; i++) {
        document.getElementById('comment' + `${i}`).addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('comment-popout').style.display = "block";
            document.getElementById('close-comment').style.display = 'block';
            document.getElementById('comment-submit').addEventListener('click', (e) => {
                e.preventDefault();
                const commentBody = {
                    "comment": document.getElementById('comment-input').value,
                };  
                const result = fetch(`http://localhost:5000/post/comment/?id=${posts[i].id}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'TOKEN ' + AUTH_TOKEN,
                    },
                    body: JSON.stringify(commentBody),
                }).then(data => {
                    if (data.status === 200) {
                        document.getElementById('comment-success').innerText = "Post Success";
                        showCommentResult();
                        data.json().then(result => {
                            console.log(result);
                        });
                    } else if (data.status === 404) {
                        document.getElementById('comment-success').innerText = "Post Not Found";
                        showCommentResult();
                    } else if (data.status === 403) {
                        document.getElementById('comment-success').innerText = "Invalid Auth Token";
                        showCommentResult();
                    } else if (data.status === 400) {
                        document.getElementById('comment-success').innerText = "Malformed Request";
                        showCommentResult();
                    }
                    // console.log("comment data", data);  
                }).catch((error) => {
                    document.getElementById('comment-success').innerText = error;
                    showCommentResult();
                });
            });
        });
    } 
}

// 2.5.4 updating the profile
// show error
function updateProfileError() {
    document.getElementById('mine-success').style.display = "block";
    document.getElementById('close-update').style.display = "block";
    document.getElementById("close-update").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("update-popout").style.display = "none";
        document.getElementById('mine-success').style.display = "none";
        document.getElementById('mine-success').innerText = "Update Profile Success";
    });
}
// user profile fetch
document.getElementById('update-profile').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('update-popout').style.display = "block";
    document.getElementById('close-update').style.display = 'block';
    document.getElementById("close-update").addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById("update-popout").style.display = "none";
    });
    document.getElementById('mine-submit').addEventListener('click', (e) => {
        e.preventDefault();
        const postBody = {
            "email": document.getElementById('email-mine').value,
            "name": document.getElementById('name-mine').value,
            "password":document.getElementById('password-mine').value,
        }; 
        const result = fetch('http://localhost:5000/user', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'TOKEN ' + AUTH_TOKEN,
                },
                body: JSON.stringify(postBody),
        }).then(data => {
            if (data.status === 200) {
                document.getElementById('mine-success').innerText = "Update Profile Success";
                updateProfileError();
                data.json().then(result => {
                    console.log(result);
                });
            } else if (data.status === 400) {
                document.getElementById('mine-success').innerText = "Malformed user object";
                updateProfileError();
            } else if (data.status === 403) {
                document.getElementById('mine-success').innerText = "Invalid Authorization Token";
                updateProfileError();
            }
        }).catch((error) => {
            fetchErrorMainPage(error);
        });
    });
});
