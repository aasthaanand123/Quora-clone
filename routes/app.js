const express = require("express");
const hbs = require("hbs");
let router = express.Router();
//get controller
const controller = require("../controllers/users");
// const passport = require("../auth/passport");
// passport.initialize();
//requests
//1. when login clicked user will be set to active if exists otherwise error shown on login page itself
router.get("/getUser", controller.getUser);
// router.get("/signUp", controller.getsignUp);
router.post("/createUser", controller.signUp);
router.post("/getLogin", controller.getLogin);
// router.get("/auth/facebook", passport.authenticate("facebook"));

// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/" }),
//   function (req, res) {
//     // Successful authentication, redirect dashboard
//     res.redirect("/getLogin");
//   }
// );
router.get("/userProfile", controller.getuserProfile);
router.post("/postquestion", controller.postPostQuestion);
router.post("/addPost", controller.postAddPost);
router.get("/allquestions", controller.getAllQuestions);
router.get("/getAllPosts", controller.getAllPosts);
router.post("/answer_q", controller.postAnswer_q);
router.post("/getUserFromdb", controller.getUserFordisplay);
router.get("/getAnswer", controller.getGetAnswer);
router.post("/upvote", controller.postUpvote);
router.post("/downvote", controller.postDownvote);
router.get("/getEveryPost", controller.allPost);
router.post("/postComment", controller.postPostComment);
router.get("/AllComments", controller.allPost);
router.get("/myQuestions", controller.getMyQuestions);
router.get("/myPosts", controller.getMyPosts);
router.get("/myAnswers", controller.getMyAnswers);
router.get("/logout", controller.logoutUser);
router.get("/signout", controller.signoutUser);
router.get("/getPostFromSearch", controller.getsinglePost);
router.get("/deleteQuestion", controller.postdeleteQuestion);
router.get("/deletePost", controller.postdeletePost);
router.get("/deleteAnswer", controller.postdeleteAnswer);
module.exports = router;
