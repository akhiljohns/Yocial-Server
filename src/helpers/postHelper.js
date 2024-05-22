import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";
import { Report } from "../models/reportsModel.js";
import { Notifications } from "../models/notificationModel.js";
import User from "../models/userModel.js"; //userModel

// @desc    Create post
// @route   POST /post/create-post
// @access  Logined Users
export const createPostHelper = ({ image, caption, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};
      if (caption) {
        query = {
          userId: userId,
          image: image,
          caption: caption || null,
        };
      } else {
        query = {
          userId: userId,
          image: image,
        };
      }

      const newPost = new Post(query);
      newPost
        .save()
        .then((response) => {
          Post.findById(response._id)
            .populate("userId", "-password")
            .then((post) => {
              resolve({
                status: 200,
                message: "Post Has Been Created",
                post,
              });
            });
        })
        .catch((error) => {
          reject({
            error_code: error.error_code || "DB_SAVE_ERROR",
            message:
              error.message || "Something Went Wrong, Try After Sometime",
            status: error.status || 500,
            error,
          });
        });
    } catch (error) {
      reject({
        error_code: error.error_code || "INTERNAL_SERVER_ERROR",
        message: error.message || "Something Went Wrong, Try After Sometime",
        status: error.status || 500,
        error,
      });
    }
  });
};

// @desc    Update post
// @route   POST /post/update-post
// @access  Logined Users
export const updatePostHelper = ({ caption, postId, userId }) => {
  return new Promise(async (resolve, reject) => {
    const postExist = await Post.findById({ _id: postId });

    if (!postExist) {
      reject({
        status: 404,
        message: "Post Not Found",
      });
    }

    const id1 = postExist?.userId.toString();
    const id2 = userId?.toString();

    if (id1 != id2) {
      return reject({
        status: 403,
        message: "You are not authorized to edit this post",
        error_code: "UNAUTHORIZED_USER",
      });
    }

    Post.findOneAndUpdate({ _id: postId }, { caption: caption }, { new: true })
      .then((res) => {
        resolve({
          status: 200,
          message: "Post Has Been Updated.",
          post: res,
        });
      })
      .catch((error) => {
        reject({
          status: error.status || 500,
          message: error.message || "Something Went Wrong, Try After Sometime",
          res,
        });
      });
  });
};

// @desc    Fetch single posts
// @route   GET /post/fetch-single-post
// @access  Authenticated user
export const fetchSinglePostHelper = (postId) => {
  try {
    return new Promise(async (resolve, reject) => {
      const postExist = await Post.findById({ _id: postId });

      if (!postExist) {
        reject({
          status: 404,
          message: "Post Not Found",
        });
      }
      Post.findOne({ _id: postId })
      .populate('userId', 'username profilePic')
        .then((post) => {
          resolve({ status: 200, message: "Single Post Found", post });
        })
        .catch((error) => {
          reject({
            status: error.status || 500,
            message:
              error.message || "Something Went Wrong, Try After Sometime",
          });
        });
    });
  } catch (error) {
    return error;
  }
};

// @desc    Fetch a user's posts
// @route   GET /post/fetchUserPosts
// @access  Registerd users
export const fetchUserPosts = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      Post.find({ userId: userId })
        .sort({ createdAt: -1 })
        .lean()
        .then((posts) => {
          resolve({
            status: 200,
            message: "Fetched User Posts.",
            posts,
          });
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Delete post
// @route   GET /delete/post/:postId
// @access  Authenticated user
export const deletePostHelper = (user, postId) => {
  return new Promise(async (resolve, reject) => {
    const postExist = await Post.findById({ _id: postId });

    if (!postExist) {
      reject({
        status: 404,
        message: "Post Not Found",
        error_code: "POST_NOT_FOUND",
      });
    }

    const id1 = postExist?.userId.toString();
    const id2 = user?._id.toString();

    if (id1 != id2) {
      reject({
        status: 403,
        message: "You are not authorized to delete this post",
        error_code: "UNAUTHORIZED_USER",
      });
    } else {
      Post.deleteOne({ _id: postId })
        .then((response) => {
          if (response.deletedCount === 1) {
            resolve({
              status: 200,
              message: "Post Has Been Deleted.",
              response,
            });
          } else {
            reject({
              status: 400,
              message: "Failed to delete post. Please try again later",
              response,
            });
          }
        })
        .catch((error) => {
          reject({
            status: error.status || 500,
            message:
              error.message || "Something Went Wrong, Try After Sometime",
          });
        });
    }
  });
};

// @desc    Like/unlike post
// @route   GET /like-unlike/:postId/:userId
// @access  Authenticated user
export const likeUnlikeHelper = async ({ postId, userId }) => {
  try {
    const postExist = await Post.findById(postId);

    if (!postExist) {
      return {
        status: 404,
        message: "Post Not Found",
      };
    }

    const userExists = await Post.exists({ _id: postId, likes: userId });

    if (!userExists) {
      const result = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { likes: userId } },
        { new: true }
      );

      const post = await Post.findById(result?._id).populate(
        "userId",
        "-password"
      );

      return {
        status: 200,
        message: "Like Has Been Added To The Post.",
        post,
      };
    } else {
      const result = await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } },
        { new: true }
      );
      const post = await Post.findById(result?._id).populate(
        "userId",
        "-password"
      );
      return {
        status: 200,
        message: "Like Has Been Removed From The Post.",
        post,
      };
    }
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      // Handle the case where the provided postId is not a valid ObjectId
      return {
        status: 404,
        message: "Post Not Found",
      };
    } else {
      return {
        status: 500,
        message: "Internal Server Error",
        error: error.message || "Something Went Wrong, Try After Sometime",
      };
    }
  }
};

// @desc    Fetch posts
// @route   POST /users/fetch-posts
// @access  Public
export const getAllPosts = (perPage, page, user) => {
  return new Promise((resolve, reject) => {
    try {
      const blockedUserIds = user.blockedUsers.map((blockedUser) =>
        blockedUser.toString()
      );

      Post.find({
        blocked: false,
        userId: { $nin: [...blockedUserIds, user._id] }, // Exclude posts from blocked users and the current user
      })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 })
        .populate("userId", "-password")
        .exec()
        .then((posts) => {
          if (posts) {
            resolve({
              status: 200,
              message: "post fetched successfully",
              posts,
            });
          } else {
            throw new Error("No posts found");
          }
        })
        .catch((err) => {
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: "Something's wrong. Please try again later.",
            error_message: err.message,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Something's wrong. Please try again later.",
        error_message: error.message,
      });
    }
  });
};

// @desc    Fetch posts count
// @route   GET /post/fetch-count
// @access  Private
export const getPostsCount = () => {
  return new Promise((resolve, reject) => {
    try {
      Post.countDocuments({})
        .then((count) => {
          resolve(count);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject(error);
    }
  });
};

//------------------------COMMENT--------------------------------------------------------

// @desc    Add comment
//@route    POST /post/add-comment
// @access  Registerd users
export const addCommentHelper = (userId, postId, content) => {
  return new Promise((resolve, reject) => {
    try {
      const newComment = new Comment({
        userId: userId,
        postId: postId,
        content: content,
      });

      newComment
        .save()
        .then((res) => {
          const response = res.populate("userId", "-password");
          resolve(response);
        })
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Delete comment
//@route    DELETE /post/delete-comment
// @access  Registerd users
export const deleteCommentHelper = (commentId, userId, user) => {
  return new Promise((resolve, reject) => {
    try {
      const id1 = userId.toString();
      const id2 = user._id.toString();

      if (id1 != id2) {
        reject({
          message: "You are not authorized to delete this comment.",
          status: 405,
        });
        return;
      }
      Comment.findOneAndUpdate({ _id: commentId }, { deleted: true })
        .then((response) => {
          resolve({ message: "Comment Deleted", response });
        })
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Get comment
//@route    GET /post/fetch-comment
// @access  Registerd users
export const fetchCommentHelper = (postId) => {
  return new Promise((resolve, reject) => {
    try {
      Comment.find({ postId: postId, deleted: false })
        .sort({ createdAt: -1 })
        .populate("userId", "-password")
        .exec()
        .then((comments) => {
          resolve(comments);
        })
        .catch((err) => reject(err));
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Get reply comments
//@route    GET /post/comments/replies/:commentId
// @access  Registerd users
export const getReplyComments = (commentId) => {
  return new Promise((resolve, reject) => {
    try {
      Comment.find({ parentId: commentId, deleted: false })
        .sort({ createdAt: -1 })
        .populate("userId", "-password")
        .exec()
        .then((comments) => {
          resolve(comments);
        })
        .catch((err) => {
          reject({
            status: "500",
            error_code: "DB_FETCH_ERROR",
            message: "Error fetching comments.",
            err,
          });
        });
    } catch (error) {
      reject({
        status: "500",
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching comments. Server error",
        error,
      });
    }
  });
};

// @desc    Reply comment
//@route    POST /post/comments/reply-to/:commentId
// @access  Registerd users
export const replyToComment = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const newReply = new Comment({
        content: data.content,
        postId: data.postId,
        userId: data.userId,
        parentId: data.parentId,
      });

      newReply
        .save()
        .then(async (response) => {
          await response.populate("userId", "-password");
          resolve(response);
        })
        .catch((err) => {
          reject({
            status: 500,
            error_code: "DB_SAVE_ERROR",
            message: "Error replying to this comment.",
            err,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Can't replay to this comment, server error",
        error,
      });
    }
  });
};

////////////////////////////////////////////////// REPORT SECTION //////////////////////////////////////////////////////////////////
// @desc    Report post
// @route   POST /post/report/post/:userId
// @access  Registerd users
export const reportPostHelper = (
  userId,
  username,
  targetId,
  reason,
  postImageUrl,
  postOwner
) => {
  return new Promise((resolve, reject) => {
    try {
      const newReport = new Report({
        reporterId: userId,
        targetId: targetId,
        details: reason,
        reportPostUrl: postImageUrl,
        reportType: "PostReport",
        reporterUsername: username,
        postOwner: postOwner,
      });

      newReport
        .save()
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: "Error saving to DB",
            err,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Server side error",
        error,
      });
    }
  });
};

////////////////////////////////////////////////// NOTIFICATION SECTION //////////////////////////////////////////////////////////////////

// @desc    Save notification
// @route   POST /post/newnotification/
// @access  Registerd users
export const saveNotificationHelper = (
  userId,
  postId,
  fromUserId,
  message,
  fromUser
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userExists = await User.exists({ _id: userId });
      if (!userExists) {
        reject({
          status: 404,
          message: `User with ID ${userId} does not exist`,
        });
        return;
      }

      const postExists = await Post.exists({ _id: postId });
      if (!postExists) {
        reject({
          status: 404,
          message: `Post with ID ${postId} does not exist`,
        });
        return;
      }

      const newNotification = new Notifications({
        userId: userId,
        postId: postId,
        from: fromUserId,
        message: message,
        fromUser: fromUser,
      });

      const savedNotification = await newNotification.save();

      resolve({
        status: 200,
        message: "Notification Has Been Saved",
        savedNotification,
      });
    } catch (error) {
      reject({
        status: error.status || 500,
        message: error.message || "Something Went Wrong, Try After Sometime",
      });
    }
  });
};

// @desc    fetch notification based on userid
// @route   get /post/fetchnotifications/:userid
// @access  Registerd users
export const fetchNotificationsHelper = (userId) => {
  return Notifications.find({ userId, isRead: false })
    .populate("from", "username profilePic")
    .sort({ createdAt: -1 })
    .exec()
    .then((notifications) => {
      if (notifications.length === 0) {
        return { status: 200, message: "No Notifications Found" };
      }
      return { notifications, status: 200, message: "Notifications Fetched" };
    })
    .catch((error) => {
      throw error;
    });
};

// @desc    change notification read status
// @route   POST /post/notification/readstatus/:notificationId
// @access  Registerd users
export const changeNotificationStatusHelper = (notificationId) => {
  return new Promise((resolve, reject) => {
    Notifications.findById(notificationId)
      .exec()
      .then((notification) => {
        if (!notification) {
          reject({ status: 500, message: "Notification Not Found" });
        } else {
          if (notification.isRead === true) {
            return resolve({
              status: 200,
              message: "Notification Already Read",
              notification,
            });
          }

          notification.isRead = true;
          notification
            .save()
            .then((updatedNotification) => {
              resolve({
                status: 200,
                message: "Notification Status updated",
                updatedNotification,
              });
            })
            .catch((error) => {
              reject({
                status: error.status || 500,
                message: error.message || "Something went wrong",
                error,
              });
            });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// @desc    delete all user notification
// @route   POST /post/notification/delete/:userId
// @access  Registerd users
export const deleteNotificationsByUserIdHelper = (userId) => {
  return new Promise((resolve, reject) => {
    Notifications.deleteMany({ userId: userId })
      .then((result) => {
        resolve({ status: 200, message: "Deleted Notifications", result });
      })
      .catch((error) => {
        reject(error);
      });
  });
};
