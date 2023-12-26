import { Post } from "../models/postModel.js";

// @desc    Create post
// @route   POST /post/create-post
// @access  Public
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
