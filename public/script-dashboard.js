const formComment = document.querySelectorAll(".post_comment");
// const inputComment = document.querySelectorAll(".comment");
const comments = document.querySelectorAll(".comments");
const parentPosts = document.querySelector(".postFlex");
const bodyOne = document.querySelector("body");
//get all comments and render before page load

formComment.forEach((form) =>
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let post_id = form.firstElementChild.value;
    //   //send a post request
    //find which input
    let input = form.children[1].value;
    form.children[1].value = "";
    axios
      .post("/postComment", {
        postid: post_id,
        comment: input,
      })
      .then((data) => {
        //make a div and append it
        //   const el = document.createElement("div");
        //   el.innerText = data.data;
        //   comments.appendChild(el);
        let nearestComments = form.nextElementSibling;
        // problem
        nearestComments.nextElementSibling.style.display = "none";
        nearestComments.innerHTML = "";
        data.data.forEach((post) => {
          // console.log(post);
          // console.log(post.comments);
          console.log("----------");
          // console.log(post); not working
          if (JSON.stringify(post._id) == JSON.stringify(post_id)) {
            post.comments.forEach((comment) => {
              let el = document.createElement("div");
              el.innerText = comment.comment;
              // console.log(post);
              // console.log(comment.comment);
              nearestComments.appendChild(el);
            });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
    //id of post
  })
);
