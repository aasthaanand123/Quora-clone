//get the input
const input = document.querySelector(".search");
const body = document.querySelector("body");
const modal_search = document.createElement("div");
const nav = document.querySelector("nav");
modal_search.classList.add("modal_search");
modal_search.style.visibility = "hidden";
let posts;
//when length is zero then make a post request to get posts
input.addEventListener("keydown", (e) => {
  if (input.value.length < 1 || !posts) {
    //make a post request to get posts
    axios
      .get("/getEveryPost")
      .then((data) => {
        posts = data.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (input.value.length < 2) {
    //clear the fields
    modal_search.style.visibility = "hidden";
    modal_search.innerHTML = "";
  }
});
input.addEventListener("keydown", (e) => {
  //if length>1 then start searching from posts
  if (input.value.length >= 2) {
    modal_search.style.visibility = "hidden";
    modal_search.innerHTML = "";
    let val = input.value;
    let postFinal = [];
    posts.forEach((post) => {
      let match = true;
      for (let i = 0; i < val.length; i++) {
        if (val[i] != post.post[i]) {
          match = false;
          break;
        }
      }
      if (match == true) {
        postFinal.push(post);
      }
    });
    if (postFinal.length == 0) {
      postFinal = false;
    }
    if (postFinal == false) {
      const no_el = document.createElement("div");
      no_el.classList.add("nopost");
      no_el.innerText = "no post exists";
      modal_search.appendChild(no_el);
    } else {
      let post = document.createElement("ul");
      postFinal.forEach((p) => {
        let el = document.createElement("a");
        el.setAttribute("href", `/getPostFromSearch?postId=${p._id}`);
        el.classList.add("element_style");
        el.innerText = p.post;
        post.appendChild(el);
      });
      modal_search.appendChild(post);
    }
    modal_search.style.visibility = "visible";
    nav.appendChild(modal_search);
  }
});
