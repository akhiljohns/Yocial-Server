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
          Post.findById(response._id).populate("userId", "-password").then((post)=>{
            resolve({
              status: 200,
              message: "Post Has Been Created",
              post
            });
          })
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

      return {
        status: 200,
        message: "Like Has Been Added To The Post.",
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
        message: "Like Has Been Removed From The Post.",
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



// @desc    Fetch posts
// @route   POST /users/fetch-posts
// @access  Public
export const getAllPosts = (perPage, page) => {
  return new Promise((resolve, reject) => {
    try {
      Post.find({ blocked: false })
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
      Post.countDocuments({}).then((count) => {
        resolve(count);
      }).catch((err)=> {
        reject(err)
      })
    } catch (error) {
      reject(error)
    }
  })
}
