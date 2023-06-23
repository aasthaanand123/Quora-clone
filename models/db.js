//get the database here, then create a class which provides functions which can manipulate the database indirectly
const { ObjectId, AggregationCursor } = require("mongodb");
let { getDb } = require("../database/connection.js");
let collection = "users";
let collectionQuestions = "questions";
let collectionPosts = "posts";
let collectionAnswers = "answers";
//class
class usersDb {
  constructor(email, password, interests) {
    //creates a user
    this._id = new ObjectId();
    this.email = email;
    this.password = password;
    this.active = false;
    this.postsId = [];
    this.questionsId = [];
    this.answersId = [];
    this.interests = interests;
  }
  createInDb() {
    return new Promise(async (res, rej) => {
      //put its properties in database if it does not exist
      //get the database
      let db = getDb().collection(collection);
      //check if it exists or not
      try {
        let val = await db.findOne({ _id: this._id });
        if (val == null) {
          let date = new Date();
          date = date.toDateString();
          //if it is in database then do nothing otherwise create in database
          await db.insertOne({
            _id: this._id,
            email: this.email,
            password: this.password,
            active: this.active,
            postsId: this.postsId,
            questionsId: this.questionsId,
            answersId: this.answersId,
            interest: this.interests,
            date: date,
          });
          res("added successfully");
        } else {
          rej("not added successfully");
        }
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static activateUser(_id) {
    //set its state to active
    //get the user from db and update its state
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collection);
      try {
        let user = db.findOne({ _id: _id });
        if (user) {
          //if user exists
          //update its active state
          await db.updateOne(
            { _id: _id },
            {
              $set: { active: true },
            }
          );
          res("updated state");
        } else {
          rej("user does not exist");
        }
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static deactivateAll() {
    return new Promise(async (res, rej) => {
      //update all users
      let db = getDb().collection(collection);
      try {
        await db.updateMany(
          {},
          {
            $set: { active: false },
          }
        );
        res("deactivated all");
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  //returns the user(if exists otherwise error) and set its state to active
  static getUserFromDb(email, password) {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collection);
      try {
        let user = await db.findOne({ email: email, password: password });
        if (user) {
          res(user);
        } else {
          res(false);
        }
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static doesNotExist(email, password) {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collection);
      try {
        let user = await db.findOne({ email: email, password: password });
        if (user == {} || user == null) {
          //that means the user does not exist and return true so signing up can proceed
          res(true);
        } else {
          res(false);
        }
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static getUserbyId(id) {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collection);
      try {
        let userD = await db.findOne({ _id: new ObjectId(id) });
        res(userD);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static getQuestionbyId(id) {
    return new Promise(async (res, rej) => {
      let quesDb = getDb().collection(collectionQuestions);
      try {
        let userD = await quesDb.findOne({ _id: new ObjectId(id) });
        res(userD);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static getActiveUser() {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collection);
      try {
        let user = await db.findOne({ active: true });
        res(user);
      } catch (err) {
        console.log(err);
      }
    });
  }
  // add a question in collection of add collection and add the id of that question in the questionsId array in user
  static addQuestion(question) {
    //add question in collection
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collectionQuestions);
      let dbUser = getDb().collection(collection);
      try {
        let user = await dbUser.findOne({ active: true }); //the one which is logged in
        //update collection
        let date = new Date();
        let answerIds = [];
        date = date.toDateString();
        await db.insertOne({
          question: question,
          date: date,
          userId: user._id,
          answer_id: answerIds,
        });
        let q = await db.findOne({
          question: question,
          date: date,
          userId: user._id,
          answer_id: answerIds,
        });

        let q_id = q._id;
        //get the active users data

        let q_array = user.questionsId;

        q_array.push(q_id);

        //insert this id in the user
        await dbUser.updateOne(
          { _id: user._id },
          {
            $set: {
              questionsId: q_array,
            },
          }
        );
        let updatedUser = await dbUser.findOne({ _id: user._id });
        res(updatedUser);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static addPost(post, image) {
    return new Promise(async (res, rej) => {
      //get main db
      let mainDb = getDb().collection(collection);
      //get post db
      let postDb = getDb().collection(collectionPosts);
      try {
        let user = await mainDb.findOne({ active: true });
        //add the post in it
        let date = new Date();
        date = date.toDateString();
        let upvoteUserIds = [];
        let downvoteUserIds = [];
        let comments = [];
        await postDb.insertOne({
          post: post,
          date: date,
          userId: user._id,
          upvoteCount: 0,
          downvoteCount: 0,
          upvoteUserIds: upvoteUserIds,
          downvoteUserIds: downvoteUserIds,
          comments: comments,
          image: image,
        });
        //post from db
        let postFromDb = await postDb.findOne({
          post: post,
          date: date,
          userId: user._id,
          upvoteCount: 0,
          downvoteCount: 0,
          upvoteUserIds: upvoteUserIds,
          downvoteUserIds: downvoteUserIds,
          comments: comments,
          image: image,
        });
        //insert the post id to the users db on that user

        let postid_ar = user.postsId;
        postid_ar.push(postFromDb._id);
        //update user
        await mainDb.updateOne(
          { _id: user._id },
          {
            $set: { postsId: postid_ar },
          }
        );
        let updatedUser = await mainDb.findOne({ _id: user._id });
        //posts of that user
        //join users db with posts db on id
        //aggregation
        res(updatedUser);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static getAllQuestions() {
    return new Promise(async (res, rej) => {
      //get questions db
      let ques_db = getDb().collection(collectionQuestions);
      try {
        //get all questions
        let allqs = await ques_db.find({}).toArray();
        res(allqs);
      } catch (err) {
        console.log(err);
      }
    });
  }
  static AllUsers() {
    return new Promise(async (res, rej) => {
      let db = getDb().collection(collection);
      try {
        let all_users = await db.find({}).toArray();
        res(all_users);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static joinQandUsers() {
    return new Promise(async (res, rej) => {
      let db = getDb();
      try {
        //returns aggregated table of qs and users
        let data = await db
          .collection("questions")
          .aggregate([
            {
              $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "question_user",
              },
            },
          ])
          .toArray();
        data.forEach((element) => {
          element.question_user = element.question_user[0];
        });
        res(data);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  // static joinPandUsers() {
  //   return new Promise(async (res, rej) => {
  //     let db = getDb();
  //     try {
  //       let user = await usersDb.getActiveUser();
  //       let table = await db
  //         .collection(collection)
  //         .aggregate([
  //           {
  //             $lookup: {
  //               from: "posts",
  //               localField: "postsId",
  //               foreignField: "_id",
  //               as: "posts_user",
  //             },
  //           },
  //         ])
  //         .toArray();
  //       //send only the users posts array
  //       // for (let i = 0; i < table.length; i++) {
  //       //   if (JSON.stringify(user._id) == JSON.stringify(table[i]._id)) {
  //       //     table = table[i];
  //       //     break;
  //       //   }
  //       // }
  //       // console.log(table);
  //       // res(table.posts_user);
  //       //forward all the posts
  //       let allposts = [];
  //       for (let i = 0; i < table.length; i++) {
  //         if (table[i].posts_user != []) {
  //           allposts.push(table[i].posts_user);
  //         }
  //       }
  //       console.log(allposts);
  //       res(allposts);
  //     } catch (err) {
  //       rej(err);
  //       console.log(err);
  //     }
  //   });
  // }
  static postAnswer(answer, ques_id, active_user) {
    return new Promise(async (res, rej) => {
      console.log(answer);
      try {
        let dbAnswers = getDb().collection(collectionAnswers);
        let dbQuestions = getDb().collection(collectionQuestions);
        let dbUsers = getDb().collection(collection);
        //post this answer
        await dbAnswers.insertOne({
          answer: answer,
          question_id: new ObjectId(ques_id),
          user: active_user._id,
        });
        //resolve true
        let answerPosted = await dbAnswers.findOne({
          answer: answer,
          question_id: new ObjectId(ques_id),
          user: active_user._id,
        });
        //update question also
        let question = await dbQuestions.findOne({
          _id: new ObjectId(ques_id),
        });
        let answers_id = question.answer_id;
        let a_id = answerPosted._id;
        answers_id.push(a_id);
        await dbQuestions.updateOne(
          { _id: new ObjectId(ques_id) },
          {
            $set: {
              answer_id: answers_id,
            },
          }
        );
        //now update active user to set the answerids of their own
        let updatedAnswersId = active_user.answersId;
        updatedAnswersId.push(answerPosted._id);
        await dbUsers.updateOne(
          { _id: new ObjectId(active_user._id) },
          {
            $set: {
              answersId: updatedAnswersId,
            },
          }
        );
        res(answerPosted);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static joinQuesAndAns(q_id) {
    return new Promise(async (res, rej) => {
      try {
        let db = getDb();
        let table = await db
          .collection(collectionQuestions)
          .aggregate([
            {
              $lookup: {
                from: "answers",
                localField: "answer_id",
                foreignField: "_id",
                as: "answers",
              },
            },
          ])
          .toArray();
        let qObj;
        for (let i = 0; i < table.length; i++) {
          if (table[i]._id == q_id) {
            qObj = table[i];
          }
        }
        res(qObj);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static upvoteFunc(postid) {
    return new Promise(async (res, rej) => {
      let dbPosts = getDb().collection(collectionPosts);
      try {
        //get the active user
        let user = await usersDb.getActiveUser();
        //get the post from post id
        let post = await dbPosts.findOne({ _id: new ObjectId(postid) });
        //update its upvoteUserIds array by adding current
        //user id
        //if it does not contain that user id then push it
        //otherwise do nothing
        //is it users own post: post id in user
        let ownUser = false;
        for (let i = 0; i < user.postsId.length; i++) {
          let poststr = JSON.stringify(postid);
          let userPoststr = JSON.stringify(user.postsId[i]);
          if (poststr == userPoststr) {
            ownUser = true;
            break;
          }
        }
        //has it been already liked
        let present = false;

        let userstring = JSON.stringify(user._id);
        for (let i = 0; i < post.upvoteUserIds.length; i++) {
          let upvoteuserstring = JSON.stringify(post.upvoteUserIds[i]);
          if (userstring == upvoteuserstring) {
            present = true;
            break;
          }
        }
        if (!present && !ownUser) {
          //check if it has been downvoted before
          let alreadyDownvoted = false;
          for (let i = 0; i < post.downvoteUserIds.length; i++) {
            let downvoteStr = JSON.stringify(post.downvoteUserIds[i]);
            if (userstring == downvoteStr) {
              alreadyDownvoted = true;
              break;
            }
          }
          //increase the upvote
          //current upvote value+1
          let newUpvoteVal = post.upvoteCount + 1;
          //add the user to post upvote array
          post.upvoteUserIds.push(user._id);
          //if it is not own post, not already liked nor disliked do the following
          if (!alreadyDownvoted) {
            //increase upvote without changing anything in downvote
            //update the db
            await dbPosts.updateOne(
              { _id: new ObjectId(postid) },
              {
                $set: {
                  upvoteUserIds: post.upvoteUserIds,
                  upvoteCount: newUpvoteVal,
                },
              }
            );
          } else {
            //update the downvote
            let newDownvoteVal = post.downvoteCount - 1;
            //remove postid from downvote
            let newDownvoteIds = post.downvoteUserIds.filter(
              (id) => JSON.stringify(id) != JSON.stringify(user._id)
            );
            //update the db
            await dbPosts.updateOne(
              { _id: new ObjectId(postid) },
              {
                $set: {
                  upvoteUserIds: post.upvoteUserIds,
                  upvoteCount: newUpvoteVal,
                  downvoteCount: newDownvoteVal,
                  downvoteUserIds: newDownvoteIds,
                },
              }
            );
          }
        }
        res("updated successfully");
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static downvoteFunc(postid) {
    return new Promise(async (res, rej) => {
      try {
        let db = getDb().collection(collectionPosts);
        let user = await usersDb.getActiveUser();
        let posts = await db.findOne({ _id: new ObjectId(postid) });
        let useridstr = JSON.stringify(user._id);
        //check if its users own post
        let ownPost = false;
        for (let i = 0; i < user.postsId.length; i++) {
          let userpostid = JSON.stringify(user.postsId[i]);
          let postidstr = JSON.stringify(postid);
          if (userpostid == postidstr) {
            //means this is users post
            ownPost = true;
            break;
          }
        }
        //check if user has previously already downvoted
        let alreadyDownvoted = false;
        for (let i = 0; i < posts.downvoteUserIds.length; i++) {
          let strdownvoteuserID = JSON.stringify(posts.downvoteUserIds[i]);
          if (useridstr == strdownvoteuserID) {
            alreadyDownvoted = true;
            break;
          }
        }
        console.log(alreadyDownvoted);
        //update the post object for the same
        if (!alreadyDownvoted && !ownPost) {
          //check if it has been upvoted before
          let alreadyUpvoted = false;
          for (let i = 0; i < posts.upvoteUserIds.length; i++) {
            let upvoteStr = JSON.stringify(posts.upvoteUserIds[i]);
            if (useridstr == upvoteStr) {
              alreadyUpvoted = true;
              break;
            }
          }
          //increase downvote value
          let newDownvoteCount = posts.downvoteCount + 1;
          posts.downvoteUserIds.push(user._id);
          //update downvote if not already upvoted
          if (!alreadyUpvoted) {
            await db.updateOne(
              { _id: new ObjectId(posts._id) },
              {
                $set: {
                  downvoteCount: newDownvoteCount,
                  downvoteUserIds: posts.downvoteUserIds,
                },
              }
            );
          } else {
            //if already upvoted change that value also
            posts.upvoteCount -= 1;
            console.log(posts.upvoteCount);
            //remove user from upvoteuserids array also
            let newUpvoteIds = posts.upvoteUserIds.filter((el) => {
              JSON.stringify(el) != JSON.stringify(user._id);
            });
            console.log(newUpvoteIds);
            await db.updateOne(
              { _id: new ObjectId(posts._id) },
              {
                $set: {
                  downvoteCount: newDownvoteCount,
                  downvoteUserIds: posts.downvoteUserIds,
                  upvoteCount: posts.upvoteCount,
                  upvoteUserIds: newUpvoteIds,
                },
              }
            );
          }
        }
        res("updated successfully");
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static getAllPosts() {
    return new Promise(async (res, rej) => {
      try {
        let dbpost = getDb().collection(collectionPosts);
        let posts = await dbpost.find({}).toArray();
        res(posts);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static postComment(postid, comment) {
    return new Promise(async (res, rej) => {
      try {
        let dbPosts = getDb().collection(collectionPosts);
        postid = new ObjectId(postid);
        let allPosts = await usersDb.getAllPosts();
        //find out the post which matches the postid
        let postToUpdate;
        for (let i = 0; i < allPosts.length; i++) {
          if (JSON.stringify(postid) == JSON.stringify(allPosts[i]._id)) {
            postToUpdate = allPosts[i];
            break;
          }
        }
        //post to update is taken
        //update its comment array
        postToUpdate.comments.push({
          _id: new ObjectId(),
          comment: comment,
        });
        //now update in db
        await dbPosts.updateOne(
          { _id: postid },
          {
            $set: {
              comments: postToUpdate.comments,
            },
          }
        );
        //return all posts
        let postsAll = await dbPosts.find({}).toArray();
        res(postsAll);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static myPosts() {
    return new Promise(async (res, rej) => {
      try {
        let allPosts = getDb().collection(collectionPosts);
        let user = await usersDb.getActiveUser();
        //get post of active user
        let allPostsOfactiveuser = await allPosts
          .find({
            userId: new ObjectId(user._id),
          })
          .toArray();
        res(allPostsOfactiveuser);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static myQuestions() {
    return new Promise(async (res, rej) => {
      try {
        let allQuestions = getDb().collection(collectionQuestions);
        let user = await usersDb.getActiveUser();
        //get post of active user
        let allQuestionsofActiveUser = await allQuestions
          .find({
            userId: new ObjectId(user._id),
          })
          .toArray();
        res(allQuestionsofActiveUser);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static myAnswers() {
    return new Promise(async (res, rej) => {
      try {
        //get all answers from answers db
        let ansdb = getDb().collection(collectionAnswers);
        //find out matching
        let allans = await ansdb.find({}).toArray();
        //active user
        let activeUser = await usersDb.getActiveUser();
        //now filter the answers having user id same as
        //active user
        let ans_ar = [];
        allans.forEach((ans) => {
          if (JSON.stringify(ans.user) == JSON.stringify(activeUser._id)) {
            ans_ar.push(ans);
          }
        });
        //now we have got the answers for the active user
        res(ans_ar);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static deleteUser(userid) {
    return new Promise(async (res, rej) => {
      try {
        //get the users db
        let db = getDb().collection(collection);
        await db.deleteOne({ _id: new ObjectId(userid) });
        res("deleted");
      } catch (err) {
        rej(err);

        console.log(err);
      }
    });
  }
  static getsinglePost(postid) {
    return new Promise(async (res, rej) => {
      try {
        let posts = await usersDb.getAllPosts();
        //find the post with the post id
        let post;
        for (let i = 0; i < posts.length; i++) {
          if (JSON.stringify(postid) == JSON.stringify(posts[i]._id)) {
            post = posts[i];
            break;
          }
        }
        res(post);
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static deleteAQuestion(quesId) {
    return new Promise(async (res, rej) => {
      try {
        let dbQ = getDb().collection(collectionQuestions);
        await dbQ.deleteOne({ _id: new ObjectId(quesId) });
        //update the active user(remove the question)
        let dbUsers = getDb().collection(collection);
        let active_user = await usersDb.getActiveUser();
        let updatedquestions_id = active_user.questionsId.filter(
          (q) => JSON.stringify(q._id) != JSON.stringify(quesId)
        );
        //add this on the active user
        await dbUsers.updateOne(
          { _id: new ObjectId(active_user._id) },
          {
            $set: {
              questionsId: updatedquestions_id,
            },
          }
        );
        res("deleted");
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static deleteAPost(postId) {
    return new Promise(async (res, rej) => {
      try {
        let dbP = getDb().collection(collectionPosts);
        await dbP.deleteOne({ _id: new ObjectId(postId) });
        //update the active user(remove the question)
        let dbUsers = getDb().collection(collection);
        let active_user = await usersDb.getActiveUser();
        let updatedposts_id = active_user.postsId.filter(
          (q) => JSON.stringify(q._id) != JSON.stringify(postId)
        );
        //add this on the active user
        await dbUsers.updateOne(
          { _id: new ObjectId(active_user._id) },
          {
            $set: {
              postsId: updatedposts_id,
            },
          }
        );
        res("deleted");
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
  static deleteAnAnswer(ansId) {
    return new Promise(async (res, rej) => {
      try {
        let dbA = getDb().collection(collectionAnswers);
        let dbQ = getDb().collection(collectionQuestions);
        let ans = await dbA.findOne({ _id: new ObjectId(ansId) });
        await dbA.deleteOne({ _id: new ObjectId(ansId) });
        //update the active user(remove the question)
        let dbUsers = getDb().collection(collection);
        let active_user = await usersDb.getActiveUser();
        let updatedanswers_id = active_user.answersId.filter(
          (q) => JSON.stringify(q._id) != JSON.stringify(ansId)
        );
        //add this on the active user
        await dbUsers.updateOne(
          { _id: new ObjectId(active_user._id) },
          {
            $set: {
              answersId: updatedanswers_id,
            },
          }
        );
        let qid = ans.question_id;
        //update answerid on question also if answer is deleted
        let q = await dbQ.findOne({ _id: new ObjectId(qid) });
        //update q's answer array
        let updatedAnswersid = q.answer_id.filter(
          (ans) => JSON.stringify(ans._id) != JSON.stringify(ansId)
        );
        //now update question
        await dbQ.updateOne(
          { _id: new ObjectId(q._id) },
          {
            $set: {
              answer_id: updatedAnswersid,
            },
          }
        );
        res("deleted");
      } catch (err) {
        rej(err);
        console.log(err);
      }
    });
  }
}

//export the class
module.exports.usersDb = usersDb;
