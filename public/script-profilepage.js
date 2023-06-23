const myQuestionsBtn = document.querySelector(".myQ");
const myPostsBtn = document.querySelector(".myP");
const myAnswersBtn = document.querySelector(".myA");
const renderSpace = document.querySelector(".mypostsquestions");

myQuestionsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  renderSpace.innerHTML = "";
  axios
    .get("/myQuestions")
    .then((data) => {
      data.data.forEach((question) => {
        let q = document.createElement("div");
        q.classList.add("myQuestion");
        q.innerHTML = `
        <div>${question.question}</div>
        <a href= "/deleteQuestion?quesId=${question._id}">Delete Question</a>
        <a href= "/updateQuestion?quesId=${question._id}">Update Question</a>

        `;

        renderSpace.appendChild(q);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
myPostsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  renderSpace.innerHTML = "";
  axios
    .get("/myPosts")
    .then((data) => {
      data.data.forEach((post) => {
        let p = document.createElement("div");
        p.classList.add("myPost");

        p.innerHTML = `
        <div>${post.post}</div>
        <a href= "/deletePost?postId=${post._id}">Delete Post</a>
        <a href= "/updatePost?postId=${post._id}">Update Post</a>

        `;
        renderSpace.appendChild(p);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
myAnswersBtn.addEventListener("click", (e) => {
  e.preventDefault();
  renderSpace.innerHTML = "";
  axios
    .get("/myAnswers")
    .then((data) => {
      data.data.forEach((answer) => {
        let a = document.createElement("div");
        a.classList.add("myAnswer");

        a.innerHTML = `
        <div>${answer.answer}</div>
        <a href= "/deleteAnswer?ansId=${answer._id}">Delete Answer</a>
        <a href= "/updateAnswer?ansId=${answer._id}">Update Answer</a>

        `;

        renderSpace.appendChild(a);
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
