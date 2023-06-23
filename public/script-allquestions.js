// when answer button is clicked the modal visibility will be shown
const answer_btn = document.querySelectorAll(".answer");
const ans_modal = document.querySelector(".answer_modal");
const crossAnswer = document.querySelector(".crossAns");
const OverlayOne = document.querySelector(".overlay-one");
// question to answer
const questionToAns = document.querySelector(".question_toanswer");
// post request data of question
const hiddenDataQ = document.querySelector(".questionToAns");
// input text area
const textArea = document.querySelector(".post_answer");
function resetAns() {
  textArea.value = "";
}
function showAnsModal(text) {
  axios
    .post("/getUserFromdb", { id: text })
    .then((data) => {
      questionToAns.innerText = data.data.question;
      ans_modal.style.visibility = "visible";
      OverlayOne.style.visibility = "visible";
      //make an axios request to get question
      hiddenDataQ.value = data.data._id;
    })
    .catch((err) => {
      console.log(err);
    });
}
function hideAnsModal() {
  OverlayOne.style.visibility = "hidden";
  ans_modal.style.visibility = "hidden";
  resetAns();
}
answer_btn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    let text = btn.previousElementSibling.innerText;
    //open the modal
    showAnsModal(text);
  });
});

crossAnswer.addEventListener("click", () => {
  hideAnsModal();
});
