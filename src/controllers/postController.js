import {
  createPostHelper,
  deletePostHelper,
  fetchSinglePostHelper,
  updatePostHelper,
} from "../helpers/postHelper.js";

// @desc    Create new post
// @route   POST /post/create-post
// @access  Public
export const createPost = (req, res, next) => {
  try {
    createPostHelper(req.body)
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  } catch (error) {
    res.status(500).send({
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
        res.status(200).send(response);
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
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
};

// @desc    Delete post
// @route   GET /delete/post/:postId
// @access  Authenticated user
export const deletePost = (req, res) => {
  const postId = req.params.postId;
  deletePostHelper(postId)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(err.status).send(err);
    });
};
