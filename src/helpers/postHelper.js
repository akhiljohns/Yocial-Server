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
  return new Promise((resolve, reject) => {
    Post.findOneAndUpdate({ _id: postId }, { caption: caption }, { new: true })
      .then((res) => {
        console.log(res);
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
