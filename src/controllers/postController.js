import {
  createPostHelper,
  deletePostHelper,
  fetchSinglePostHelper,
  fetchUserPosts,
  getAllPosts,
  getPostsCount,
  likeUnlikeHelper,
  updatePostHelper,
} from "../helpers/postHelper.js";
import { getConnectonHelper } from "../helpers/userHelper.js";

  
  import {
    verifyUser
  } from "../middlewares/authMiddleware.js"

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
export const updatePost = (req, res, next) => {
  try {
    const data = {
      caption: req.body.caption,
      postId: req.params.postId,
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
export const fetchAllPosts = (req, res) => {
  try{
      const perPage = 5, page = req.query.page || 1;
      getAllPosts(perPage, page).then((response)=>{
          res.status(response.status).json(response);
      }).catch((error)=>{
          res
            .status(500)
            .json({
              status: 500,
              error_code: "INTERNAL_SERVER_ERROR",
              message: "Somethings wrong, Please try after sometime.",
              error_message: error.message
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
      fetchUserPosts(userId).then((posts)=> {
          res.status(200).send({status:200, posts:posts});
      }).catch((error) => {
          res.status(500).send(error)
      })
  } catch (error) {
      res.status(500).send(error);
  }
};

// @desc    Fetch posts count
// @route   GET /post/fetch-count
// @access  Private
export const getPostsCountController = (req, res) => {
  try {
      getPostsCount().then((count)=> {
          res.status(200).send(count);
      }).catch((error) => {
          res.status(500).json(error)
      })
  } catch (error) {
      res.status(500).json(error);
  }
}



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
      followers: connRespon.connection.followersCount,
      followings: connRespon.connection.followingCount,
      status: connRespon.status,
    };

    res.status(connRespon.status).send(userDetails);
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
  deletePostHelper(user,postId)
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
