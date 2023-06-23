const { ObjectId } = require("mongodb");
const { usersDb } = require("../models/db");
const { getDb } = require("../database/connection");
const path = require("path");
//import models file here
//create user in database on signing up
module.exports.signUp = async (req, res) => {
  //get the data from the request sent by client
  let { email, password, interests } = req.body;
  //create a new user from these details if it does not exist
  try {
    let doesNotExist = await usersDb.doesNotExist(email, password);
    if (doesNotExist == true) {
      //then create a new user
      let new_user = new usersDb(email, password, interests);
      await new_user.createInDb();
      //deactivate all users
      await usersDb.deactivateAll();
      //activate it
      await usersDb.activateUser(new_user._id);
      let user = await usersDb.getUserFromDb(new_user.email, new_user.password);
      res.send(user);
    } else {
      //tell that the user already exists and to proceed by logging in instead
      //for now simply render the homepage
      res.redirect("/"); //open homepage and show message that user already exists and login instead
    }
  } catch (err) {
    console.log(err);
  }
};
//get the user if it exists
//it it does then set the state to active and open its dashboard
module.exports.getUser = async (req, res) => {
  let { email, password } = req.query;
  try {
    let user = await usersDb.getUserFromDb(email, password); //returns object
    if (user) {
      await usersDb.activateUser(user._id);
      //after activating state render it to user
      res.redirect("/getAllPosts");
    } else {
      //if user does not exist render sign up page
      res.render("signUp");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.getLogin = (req, res) => {
  //render the dashboard page
  let details = JSON.parse(req.body.details);
  //get all posts here
  // res.render("dashboard", { user: details });
  res.redirect("/getAllPosts");
};
module.exports.getLoginGET = async (req, res) => {
  let { email, password } = req.query;
  try {
    let details = await usersDb.getUser(email, password);
    res.render("dashboard", { details });
  } catch (err) {
    console.log(err);
  }
};
module.exports.getuserProfile = async (req, res) => {
  let page = req.query.page;
  //get user
  try {
    let userData = await usersDb.getActiveUser();
    if (page == "home") {
      res.redirect("/getAllPosts");
    } else if ((await usersDb.getActiveUser()) == null) {
      //userdata me check if it is active if not then render this
      //send the file index
      res.sendFile(
        "C:/Users/Dell/OneDrive/Desktop/practice-webd/backend-server/ssr/QUORA- 2/public/index.html"
      );
    } else {
      res.render("profilepage", { user: userData });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports.postPostQuestion = async (req, res) => {
  //extract data from body
  let { question } = req.body;

  //post it to db
  try {
    let user = await usersDb.addQuestion(question);
    res.redirect("/allquestions");
  } catch (err) {
    console.log(err);
  }
};
module.exports.postAddPost = async (req, res) => {
  let { post, image } = req.body;
  try {
    //gets the user after posting post
    console.log(image);
    let user = await usersDb.addPost(post, image);
    //gets the posts of user
    // let posts = await usersDb.joinPandUsers(); //joined table
    //get all posts
    let posts = await usersDb.getAllPosts();
    res.render("dashboard", { user, posts });
  } catch (err) {
    console.log(err);
  }
};
module.exports.getAllQuestions = async (req, res) => {
  try {
    let user = await usersDb.getActiveUser();
    //get questions from db
    // let questions = await usersDb.joinQandUsers();
    let questions = await usersDb.getAllQuestions();
    //find out the users of all the posts
    res.render("allquestions", { user, questions });
  } catch (err) {
    console.log(err);
  }
};
module.exports.getAllPosts = async (req, res) => {
  try {
    let user = await usersDb.getActiveUser();
    //get posts from db
    // let posts = await usersDb.joinPandUsers();
    let posts = await usersDb.getAllPosts();
    res.render("dashboard", { user, posts });
  } catch (err) {
    console.log(err);
  }
};
module.exports.postAnswer_q = async (req, res) => {
  try {
    //get the answer and the question
    let answer = req.body.answertoq;
    let ques_id = req.body.questionToAns;
    let activeUser = await usersDb.getActiveUser();
    //post it to db collections via method
    let answerPosted = await usersDb.postAnswer(answer, ques_id, activeUser);
    console.log(answerPosted);
    //render the questions page again
    res.redirect("/allquestions");
  } catch (err) {
    console.log(err);
  }
};
module.exports.getUserFordisplay = async (req, res) => {
  let id = req.body.id;
  try {
    //request to db to request for a user of this id
    let user = await usersDb.getQuestionbyId(id);
    res.send(user);
  } catch (err) {
    console.log(err);
  }
};
module.exports.getGetAnswer = async (req, res) => {
  let ques_id = req.query.q_id;
  //find the answers corresponding to the question
  //aggregate both tables
  try {
    let table = await usersDb.joinQuesAndAns(ques_id);
    let activeUser = await usersDb.getActiveUser();
    //display this table
    res.render("displayAnswerToq", { table, user: activeUser });
  } catch (err) {
    console.log(err);
  }
};
//upvote and downvote
module.exports.postUpvote = async (req, res) => {
  try {
    //take data from body
    let postid = req.body.postid;
    //add the user on the post id
    //get user
    await usersDb.upvoteFunc(postid);
    res.redirect("/getAllPosts");
    //redirect request to dashboard
  } catch (err) {
    console.log(err);
  }
};
module.exports.postDownvote = async (req, res) => {
  try {
    let postid = req.body.postid;
    await usersDb.downvoteFunc(postid);
    res.redirect("/getAllPosts");
  } catch (err) {
    console.log(err);
  }
};
module.exports.allPost = async (req, res) => {
  try {
    let posts = await usersDb.getAllPosts();
    res.send(posts);
  } catch (err) {
    console.log(err);
  }
};
module.exports.postPostComment = async (req, res) => {
  try {
    let { postid, comment } = req.body;
    //post it to db and return all posts
    let posts = await usersDb.postComment(postid, comment);
    res.send(posts);
  } catch (err) {
    console.log(err);
  }
};
// module.exports.getAllComments = async (req, res) => {
//   try {

//   } catch (err) {
//     console.log(err);
//   }
// };
module.exports.getMyQuestions = async (req, res) => {
  try {
    let myqs = await usersDb.myQuestions();
    console.log(myqs);
    res.send(myqs);
  } catch (err) {
    console.log(err);
  }
};
module.exports.getMyPosts = async (req, res) => {
  try {
    let myps = await usersDb.myPosts();
    res.send(myps);
  } catch (err) {
    console.log(err);
  }
};
module.exports.getMyAnswers = async (req, res) => {
  try {
    let myans = await usersDb.myAnswers();
    console.log(myans);
    res.send(myans);
  } catch (err) {
    console.log(err);
  }
};
module.exports.logoutUser = async (req, res) => {
  try {
    //deactivate all and send homepage
    await usersDb.deactivateAll();
    res.sendFile(
      "C:/Users/Dell/OneDrive/Desktop/practice-webd/backend-server/ssr/QUORA- 2/public/index.html"
    );
    //render index page
  } catch (err) {
    console.log(err);
  }
};
module.exports.signoutUser = async (req, res) => {
  try {
    //get active user from db
    let active_user = await usersDb.getActiveUser();
    //deactivate all and send homepage
    await usersDb.deactivateAll();
    //delete that user from db
    await usersDb.deleteUser(active_user._id);
    //render index page
    res.sendFile(
      "C:/Users/Dell/OneDrive/Desktop/practice-webd/backend-server/ssr/QUORA- 2/public/index.html"
    );
  } catch (err) {
    console.log(err);
  }
};
module.exports.getsinglePost = async (req, res) => {
  try {
    //get the post id
    let postId = req.query.postId;
    //find single post
    let post = await usersDb.getsinglePost(postId);
    let user = await usersDb.getActiveUser();
    res.render("onePost", { user, post });
  } catch (err) {
    console.log(err);
  }
};
module.exports.postdeleteQuestion = async (req, res) => {
  try {
    let q_id = req.query.quesId;
    await usersDb.deleteAQuestion(q_id);
    let active_user = await usersDb.getActiveUser();
    let my_questions = await usersDb.myQuestions();
    //get my questions
    res.render("myQuestions", {
      user: active_user,
      questions: my_questions,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.postdeletePost = async (req, res) => {
  try {
    let p_id = req.query.postId;
    await usersDb.deleteAPost(p_id);
    let active_user = await usersDb.getActiveUser();
    let my_posts = await usersDb.myPosts();
    //get my questions
    res.render("myPosts", {
      user: active_user,
      posts: my_posts,
    });
  } catch (err) {
    console.log(err);
  }
};
module.exports.postdeleteAnswer = async (req, res) => {
  try {
    let a_id = req.query.ansId;
    await usersDb.deleteAnAnswer(a_id);
    let active_user = await usersDb.getActiveUser();
    let my_answers = await usersDb.myAnswers();
    //get my answers
    res.render("myAnswers", {
      user: active_user,
      answers: my_answers,
    });
  } catch (err) {
    console.log(err);
  }
};
