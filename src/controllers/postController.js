import {
  addCommentHelper,
  changeNotificationStatusHelper,
  createPostHelper,
  deleteCommentHelper,
  deletePostHelper,
  fetchCommentHelper,
  fetchNotificationsHelper,
  fetchSinglePostHelper,
  fetchUserPosts,
  getAllPosts,
  getPostsCount,
  getReplyComments,
  likeUnlikeHelper,
  replyToComment,
  reportPostHelper,
  saveNotificationHelper,
  updatePostHelper,
} from "../helpers/postHelper.js";
import { getConnectonHelper } from "../helpers/userHelper.js";

import { verifyUser } from "../middlewares/authMiddleware.js";
import responseHandler from "../utils/responseHandler.js";

// @desc    Create new post
// @route   POST /post/create-post
// @access  Public
export const createPost = (req, res, next) => {
  try {
    createPostHelper(req.body)
      .then((response) => {
        res.status(response.status || 200).send(response);
      })
      .catch((err) => {
        res.status(err.status || 500).send(err);
      });
  } catch (error) {
    res.status(error.status || 500).send({
      status: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Somethings wrong please try after sometime.",
    });
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const user = await verifyUser(req.headers.authorization);
    const data = {
      caption: req.body.caption,
      postId: req.params.postId,
      userId: user._id,
    };
    updatePostHelper(data)
      .then((response) => {
        res.status(response.status).send(response);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  } catch (error) {}
};

// @desc    Fetch single posts
// @route   GET /post/fetch-single-post
// @access  Authenticated user
export const fetchSinglePost = (req, res, next) => {
  const postId = req.params.postId;
  fetchSinglePostHelper(postId)
    .then((response) => {
      res.status(response.status).send(response);
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
};

// @desc    Get post data
// @route   GET /post/fetch-posts
// @access  Public
export const fetchAllPosts = async (req, res) => {
  try {
    const user = await verifyUser(req.headers.authorization);
    const perPage = 5,
      page = req.query.page || 1;
    getAllPosts(perPage, page, user)
      .then((response) => {
        res.status(response.status).json(response);
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          error_code: "INTERNAL_SERVER_ERROR",
          message: "Somethings wrong, Please try after sometime.",
          error_message: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      status: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Somethings wrong, Please try after sometime.",
      error_message: error.message,
    });
  }
};

// @desc    Fetch a user's posts
// @route   GET /post/fetchUserPosts
// @access  Registerd users
export const ctrlFetchUserPosts = (req, res, next) => {
  try {
    const userId = req.query.userId;
    fetchUserPosts(userId)
      .then((posts) => {
        res.status(200).send({ status: 200, posts: posts });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Fetch posts count
// @route   GET /post/fetch-count
// @access  Private
export const getPostsCountController = (req, res) => {
  try {
    getPostsCount()
      .then((count) => {
        res.status(200).send(count);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

// @desc    Fetch a user's posts
// @route   GET /post/fetchUserPosts
// @access  Registered users
export const fetchUserDetails = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const postRepon = await fetchUserPosts(userId);
    const connRespon = await getConnectonHelper(userId);

    const userDetails = {
      posts: postRepon.posts,
      followers: connRespon.connection.followers,
      followings: connRespon.connection.following,
      status: connRespon.status,
    };

    res.status(connRespon.status || 200).send(userDetails);
  } catch (error) {
    res.status(error.status || 500).send(error);
  }
};

// @desc    Delete post
// @route   GET /delete/post/:postId
// @access  Authenticated user
export const deletePost = async (req, res) => {
  const user = await verifyUser(req.headers.authorization);
  const postId = req.params.postId;
  deletePostHelper(user, postId)
    .then((response) => {
      res.status(response.status || 200).send(response);
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
};

// @desc    Like/unlike post
// @route   GET /like-unlike/:postId/:userId
// @access  Authenticated user
export const likeUnlikePost = (req, res) => {
  try {
    const data = {
      userId: req.params.userId,
      postId: req.params.postId,
    };

    likeUnlikeHelper(data)
      .then((response) => {
        res.status(response.status).send(response);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  } catch (error) {
    res.status(error).send({
      status: error.status || 500,
      error_code: error.code || "INTERNAL_SERVER_ERROR",
      message: error.message || "Somethings wrong please try after sometime.",
    });
  }
};

//------------------------COMMENT--------------------------------------------------------

// @desc    Comment a post
//@route    POST /post/add-comment
// @access  Registerd users
export const addComment = (req, res) => {
  try {
    const { userId, postId, content } = req.body;
    addCommentHelper(userId, postId, content)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Delete comment
//@route    DELETE /post/delete-comment
// @access  Registerd users
export const deleteComment = async (req, res) => {
  try {
    const { commentId, userId } = req.body;
    const user = await verifyUser(req.headers.authorization);

    deleteCommentHelper(commentId, userId, user)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(error.status || 500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Get comment
//@route    GET /post/fetch-comment
// @access  Registerd users
export const fetchComment = (req, res) => {
  try {
    const { postId, type } = req.params;
    fetchCommentHelper(postId)
      .then((comments) => {
        if (type === "count") {
          const count = comments?.length;
          res.status(200).send({ count });
        } else {
          res.status(200).send(comments);
        }
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Get reply comments
//@route    GET /post/comments/replies/:commentId
// @access  Registerd users
export const fetchReplyComments = (req, res) => {
  try {
    const commentId = req.params.commentId;
    getReplyComments(commentId)
      .then((comments) => {
        res.status(200).json(comments);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

// @desc    Reply comment
//@route    POST /post/comments/reply-to/:commentId
// @access  Registerd users
export const addReply = (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { postId, content, userId } = req.body;

    const data = {
      userId: userId,
      parentId: commentId,
      postId: postId,
      content: content,
    };

    replyToComment(data)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

////////////////////////////////////////////////// REPORT SECTION //////////////////////////////////////////////////////////////////

// @desc    Report user
// @route   POST /post/report/post/:userId
// @access  Registerd users
export const reportPost = (req, res) => {
  try {
    const { userId, username } = req.params;
    const { targetId, reason, postImageUrl, postOwner } = req.body;
    reportPostHelper(
      userId,
      username,
      targetId,
      reason,
      postImageUrl,
      postOwner
    )
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getEveryPostCtrl = (req, res) => {
  try {
    const { page } = req.query || 1;
    getEveryPost(page)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

////////////////////////////////////////////////// NOTIFICATION SECTION //////////////////////////////////////////////////////////////////

// @desc    Save notification
// @route   POST /post/newnotification/
// @access  Registerd users
export const saveNotification = async (req, res) => {
  try {
    const { userId, postId, fromUserId, message ,fromUser } = req.body;
    saveNotificationHelper(userId, postId, fromUserId, message)
      .then((response) => {
        responseHandler(res, response);
      })
      .catch((error) => {
        responseHandler(res, error);
      });
    } catch (error) {
    responseHandler(res, error);

  }
};
// @desc    Save notification
// @route   POST /post/fetch-notifications/:id
// @access  Registerd users
export const fetchNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    fetchNotificationsHelper(userId)
      .then((response) => {
        responseHandler(res, response);
      })
      .catch((error) => {
        responseHandler(res, error);
      });
    } catch (error) {
    responseHandler(res, error);

  }
};
// @desc    Save notification
// @route   POST /post/newnotification/
// @access  Registerd users
export const changeNotifStatus = async (req, res) => {
  try {
    const { notificationId } = req.params;
    changeNotificationStatusHelper(notificationId)
      .then((response) => {
        ('response :>> ', response);
        responseHandler(res, response);
      })
      .catch((error) => {
        responseHandler(res, error);
      });
    } catch (error) {
    responseHandler(res, error);

  }
};
