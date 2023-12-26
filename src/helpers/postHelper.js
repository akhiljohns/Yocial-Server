import { Post } from "../models/postModel.js";

// @desc    Create post
// @route   POST /post/create-post
// @access  Logined Users
export const createPostHelper = ({ imageUrl, caption, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};
      if (caption) {
        query = {
          userId: userId,
          image: imageUrl,
          caption: caption || null,
        };
      } else {
        query = {
          userId: userId,
          image: imageUrl,
        };
      }

      const newPost = new Post(query);
      await newPost.save();
      resolve({
        status: 200,
        message: "Post Has Been Created Succcefully.",
      });
    } catch (error) {
      reject({
        error_code: error.error_code || "INTERNAL_SERVER_ERROR",
        message: error.message || "Something Went Wrong, Try After Sometime",
        status: error.status || 500,
      });
    }
  });
};

// @desc    Update post
// @route   POST /post/update-post
// @access  Logined Users
export const updatePostHelper = ({ caption, postId }) => {
  return new Promise(async (resolve, reject) => {
    const postExist = await Post.findById({ _id: postId });

    if (!postExist) {
      reject({
        status: 404,
        message: "Post Not Found",
      });
    }
    Post.findOneAndUpdate({ _id: postId }, { caption: caption }, { new: true })
      .then((res) => {
        resolve({
          status: 200,
          message: "Post Has Been Updated Succcefully.",
          res,
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
        resolve(post);
      })
      .catch((error) => {
        reject({
          status: error.status || 500,
          message: error.message || "Something Went Wrong, Try After Sometime",
        });
      });
  });
};

// @desc    Delete post
// @route   GET /delete/post/:postId
// @access  Authenticated user
export const deletePostHelper = (postId) => {
  return new Promise(async (resolve, reject) => {
    const postExist = await Post.findById({ _id: postId });

    if (!postExist) {
      reject({
        status: 404,
        message: "Post Not Found",
      });
    }

    Post.deleteOne({ _id: postId })
      .then((response) => {
        resolve({
          status: 200,
          message: "Post Has Been Deleted Succcefully.",
          response,
        });
      })
      .catch((error) => {
        reject({
          status: error.status || 500,
          message: error.message || "Something Went Wrong, Try After Sometime",
        });
      });
  });
};
