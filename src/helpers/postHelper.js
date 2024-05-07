import { Post } from "../models/postModel.js";
import { Comment } from "../models/commentModel.js";
import { Report } from "../models/reportsModel.js";

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
  return new Promise(async (resolve, reject) => {
    const postExist = await Post.findById({ _id: postId });

    if (!postExist) {
      reject({
        status: 404,
        message: "Post Not Found",
      });
    }
    Post.findOne({ _id: postId })
      .then((post) => {
        resolve({ status: 404, message: "Single Post Found", post });
      })
      .catch((error) => {
        reject({
          status: error.status || 500,
          message: error.message || "Something Went Wrong, Try After Sometime",
        });
      });
  });
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
      Post.find({ blocked: false, userId: { $ne: user?._id } })
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
            message: "Somethings wrong, Please try again later.",
            error_message: err.message,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong, Please try again later.",
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
        postOwner:postOwner
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
