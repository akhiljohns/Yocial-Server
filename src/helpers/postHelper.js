import { Post } from "../models/postModel.js";

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
          resolve({
            status: 200,
            message: "Post Has Been Created Succcefully.",
          });
        })
        .catch((error) => {
          console.log(error);

          reject({
            error_code: error.error_code || "DB_SAVE_ERROR",
            message:
              error.message || "Something Went Wrong, Try After Sometime",
            status: error.status || 500,
            error,
          });
        });
    } catch (error) {
      console.log(error);

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
            message: "Fetched Used Posts Succesfully.",
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

      return {
        status: 200,
        message: "Like Has Been Added To The Post Successfully.",
        result,
      };
    } else {
      const result = await Post.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: userId } },
        { new: true }
      );

      return {
        status: 200,
        message: "Like Has Been Removed From The Post Successfully.",
        result,
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
