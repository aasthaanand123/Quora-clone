const add_postbtn = document.querySelector(".add_q");
const modal_post = document.querySelector(".addq_modal");
const overlay = document.querySelector(".overlay");
const cross_postmodal = document.querySelector(".cross");
const modalbtn_addq = document.querySelector(".addqbtn");
const modalbtn_createpost = document.querySelector(".createpostbtn");
// add q wrapper
const addq_wrapper = document.querySelector(".addquestion");
const createpost_wrapper = document.querySelector(".addpostform");
const inputQuestion = document.querySelector("#question");
const inputPost = document.querySelector(".post_content");
// const body = document.querySelector("body");
function reset() {
  inputQuestion.value = "";
  inputPost.value = "";
  body.style.overflow = "visible";
}
function showModal() {
  modal_post.style.visibility = "visible";
  overlay.style.visibility = "visible";
  body.style.overflow = "hidden";
  showAddq();
  activeAddq();
}
function hideModal() {
  modal_post.style.visibility = "hidden";
  addq_wrapper.style.visibility = "hidden";
  createpost_wrapper.style.visibility = "hidden";
  overlay.style.visibility = "hidden";
  body.style.overflow = "visible";

  reset();
}
function showAddq() {
  addq_wrapper.style.visibility = "visible";
  addq_wrapper.style.display = "block";
}
function hideAddq() {
  addq_wrapper.style.visibility = "hidden";
  addq_wrapper.style.display = "none";
}
function showcreatePost() {
  createpost_wrapper.style.visibility = "visible";
  createpost_wrapper.style.display = "flex";
}
function hidecreatePost() {
  createpost_wrapper.style.visibility = "hidden";
  createpost_wrapper.style.display = "none";
}
function activeAddq() {
  modalbtn_createpost.style.borderColor = "rgba(128, 128, 128, 0.393)";
  modalbtn_addq.style.borderColor = "blue";
}
function activeCreatepost() {
  modalbtn_addq.style.borderColor = "rgba(128, 128, 128, 0.393)";
  modalbtn_createpost.style.borderColor = "blue";
}
add_postbtn.addEventListener("click", (e) => {
  e.preventDefault();
  //show modal
  showModal();
});
cross_postmodal.addEventListener("click", () => {
  hideModal();
});
modalbtn_addq.addEventListener("click", () => {
  //visibility of addq should be visible
  //visibility of postquestion should be hidden
  activeAddq();
  showAddq();
  hidecreatePost();
});
modalbtn_createpost.addEventListener("click", () => {
  //visibility of createPost should be visible
  //visibility of addq should be hidden
  //border color of createpost btn to be blue
  activeCreatepost();
  showcreatePost();
  hideAddq();
});
//disable cancel button to go to a url
const cancelBtn = document.querySelector(".cancel");
cancelBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //will prevent from sending request
  //instead remove the modal when this btn is clicked
  hideModal();
});
