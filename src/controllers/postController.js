import {
  createPostHelper,
  deletePostHelper,
  fetchSinglePostHelper,
  fetchUserPosts,
  likeUnlikeHelper,
  updatePostHelper,
} from "../helpers/postHelper.js";

// @desc    Create new post
// @route   POST /post/create-post
// @access  Public
export const createPost = (req, res, next) => {
  try {
    createPostHelper(req.body)
      .then((response) => {
        res.status(response.status).send(response);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  } catch (error) {
    res.status(error.status).send({
      status: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Somethings wrong please try after sometime.",
    });
  }
};
export const updatePost = (req, res, next) => {
  try {
    const data = {
      caption: req.body.caption,
      postId: req.params.postId,
    };
    console.log(data);
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


// @desc    Fetch a user's posts
// @route   GET /post/fetchUserPosts
// @access  Registerd users
export const ctrlFetchUserPosts = (req, res, next) => {
  try {
      const userId = req.query.userId;
      fetchUserPosts(userId).then((posts)=> {
          res.status(200).send({status:200, posts:posts});
      }).catch((error) => {
          res.status(500).send(error)
      })
  } catch (error) {
      res.status(500).send(error);
  }
};
// @desc    Delete post
// @route   GET /delete/post/:postId
// @access  Authenticated user
export const deletePost = (req, res) => {
  const postId = req.params.postId;
  deletePostHelper(postId)
    .then((response) => {
      res.status(response.status).send(response);
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
