// selecting signupwithemail button
const signUpBtn = document.querySelector(".signupwithemail");
//signup modal
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".modal-overlay");
const cross = document.querySelector(".cross");
const signup = document.querySelector(".signupbtn");
//sign up inputs
const signupEmail = document.querySelector("#email_signup");
const signupPassword = document.querySelector("#password_signup");
//interest modal
const interest_modal = document.querySelector(".interests");
//submit interest tag
const create_user = document.querySelector(".submituser");
const interests = document.querySelector(".interest_flex");
//final sign up
const formSignup = document.querySelector(".finalsignup");
const inputSignup = document.querySelector("#finalSignup");
function hideSignUp() {
  modal.style.visibility = "hidden";
}
function hideInterests() {
  interest_modal.style.visibility = "hidden";
}
function hideSignUpfinal() {
  formSignup.style.visibility = "hidden";
}
function hideOverlay() {
  overlay.style.visibility = "hidden";
}
let userDetails = {};
//add an event
signUpBtn.addEventListener("click", (e) => {
  //when this button is clicked then the modal should pop up and background should have a black transparent background
  //set styling
  e.preventDefault(); //prevents default behaviour of making a request
  modal.style.visibility = "visible";
  overlay.style.visibility = "visible";
});
//selecting cross of modal and applying an event of closing modal on clicking cross
cross.addEventListener("click", () => {
  hideSignUp();
  hideOverlay();
});
signup.addEventListener("click", (e) => {
  e.preventDefault();
  try {
    //take complete data from user
    userDetails = {
      email: signupEmail.value,
      password: signupPassword.value,
    };
    //now show interests page and hide signup page
    hideSignUp();
    interest_modal.style.visibility = "visible";
    overlay.style.visibility = "visible";
    //now show interest
  } catch (err) {
    console.log(err);
  }
});
//when submit in interest page is clicked then post a request to create a user and clear the
//userdetails object
//whenever any interest is clicked, it is saved in an array for that user
let interestList = [];
interests.addEventListener("click", (e) => {
  //e.target.value is added to interests if its valid
  //then create a user with the above userdetails obj
  let interest_val = e.target.innerText;
  //if interest_list array does not contain this value then push it
  let contains = interestList.includes(interest_val);
  if (!contains) {
    interestList.push(interest_val);
  }
});
//final step before dashboard showing: pushing user to db along with its interests
create_user.addEventListener("click", (e) => {
  e.preventDefault();
  interest_modal.style.opacity = 1;
  axios
    .post("/createUser", {
      email: userDetails.email,
      password: userDetails.password,
      interests: interestList,
    })
    .then((data) => {
      hideInterests();
      formSignup.style.visibility = "visible";
      inputSignup.value = JSON.stringify(data.data);
    })
    .catch((err) => {
      console.log(err);
    });
});
