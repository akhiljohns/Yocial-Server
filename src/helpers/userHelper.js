import bcrypt, { hash } from "bcrypt"; //imporing bcrypt
const saltRounds = 10; //setting salt rounds
import generateJwt from "../services/jwt.js"; //imporing jwt

// importing models
import User from "../models/userModel.js"; //userModel
import { Post } from "../models/postModel.js";
import { Connection } from "../models/connectionModel.js"; //CollectionModel
import { Verify } from "../models/verifyModel.js";

import {
  generateTokenForPassword,
  verificationEmail,
} from "../services/nodemailer.js";
import { findQuery } from "../services/query.js";

////////////////////////////////////////////////// USER LOGIN & REGISTRATION //////////////////////////////////////////////////////////////////
// @desc    Login user
// @route   POST /users/login
// @access  Public
export const userLogin = async ({ credential, password }) => {
  try {
    const queryRes = await findQuery(credential);

    if (queryRes.error) {
      throw { status: queryRes.error.status, message: queryRes.error.message };
    }

    let query = queryRes;

    const user = await User.findOne(query);

    if (!user) {
      throw {
        status: 422,
        message: "Account Does Not Exist",
        error_code: "USER_NOT_FOUND",
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw {
        status: 403,
        message: "Wrong Password",
        error_code: "Unauthorized",
      };
    }

    if (!user.verified) {
      throw {
        status: 403,
        message: "Kindly Verify Your Email Before Proceeding",
        error_code: "Unauthorized_verify",
        userVerified: false,
      };
    }

    if (user.blocked) {
      throw {
        status: 403,
        message: "Your Account Is Temporarily Blocked",
        error_code: "FORBIDDEN_LOGIN",
      };
    }

    const tokens = await generateJwt(user);
    user.password = null;

    return {
      status: 200,
      message: "Login Successful",
      tokens,
      user,
    };
  } catch (error) {
    console.error("Error in userLogin:", error);
    return {
      error_code: error.error_code || "INTERNAL_SERVER_ERROR",
      message: error.message || "Something Went Wrong, Try After Sometime",
      status: error.status || 500,
      userVerified: error.userVerified,
    };
  }
};

// @desc    Register user
// @route   POST /users/register
// @access  Public
export const registration = async ({
  fName,
  lName,
  username,
  email,
  password,
  phone,
}) => {
  try {
    // Check if username exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return {
        status: 409,
        error_code: "USERNAME_TAKEN",
        message: "Username not available",
      };
    }

    // Check if email exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return {
        status: 409,
        error_code: "EMAIL_ALREADY_REGISTERED",
        message: "Email has already been registered",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name: fName + " " + lName,
      phone: phone ? phone : null,
    });

    // Save the user to the database
    await newUser.save();

    const emailResp = await sendEmail(newUser.email);
    return {
      status: emailResp.status || 200,
      message: emailResp.message || "Account Created Successfully",
    };
  } catch (error) {
    return {
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong, try again later",
      status: 500,
    };
  }
};
////////////////////////////////////////////////// USER PROFILE UPDATE //////////////////////////////////////////////////////////////////
// @desc    Update user
// @route   POST /users/update-profile
// @access  Public
export const updateProfielHelper = async ({ userId, name, username, bio }) => {
  try {
    return new Promise(async (resolve, reject) => {
      const existingUsername = await User.findOne({ username });

      if (
        existingUsername &&
        existingUsername?._id.toString() !== userId.toString()
      ) {
        reject({
          status: 409,
          error_code: "USERNAME_TAKEN",
          message: "Username not available",
        });
        return;
      } else {
        await User.findOneAndUpdate(
          { _id: userId },
          {
            $set: {
              name,
              username,
              bio,
            },
          },
          { new: true, runValidators: true, setDefaultsOnInsert: true }
        )
          .select("-password")
          .then((response) => {
            resolve({
              user: response,
              status: 200,
              message: "Profile has been Updated",
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
      }
    });
  } catch (error) {
    return {
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong, try again later",
      status: 500,
    };
  }
};
// @desc    Update user
// @route   POST /users/update-profile
// @access  Public
export const updateAvatarHelper = async ({ userId, profilePic }) => {
  try {
    return new Promise(async (resolve, reject) => {
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            profilePic,
          },
        },
        { new: true }
      )
        .select("-password")
        .then((response) => {
          resolve({
            user: response,
            status: 200,
            message: "Profile Avatar Has been Updated",
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
    });
  } catch (error) {
    return {
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong, try again later",
      status: 500,
    };
  }
};

// @desc    Update user
// @route   POST /users/update-profile
// @access  Public
export const updateEmailHelper = ({ userId, email }) => {
  try {
    return new Promise(async (resolve, reject) => {
      const existingUsername = await User.findOne({ email });

      if (
        existingUsername &&
        existingUsername?._id.toString() !== userId.toString()
      ) {
        reject({
          status: 409,
          error_code: "EMAIL_TAKEN",
          message: "Email is not available",
        });
        return;
      }
    });
  } catch (error) {}
};
////////////////////////////////////////////////// USER FETCH //////////////////////////////////////////////////////////////////
// @desc    Get users
// @route   GET /user/fetch-users
// @access  Public
export const fetchUserById = (userId) => {
  return new Promise((resolve, reject) => {
    try {
      userId = userId.trim();
      let query = {};
      if (userId && userId !== undefined) {
        query = { _id: userId };
      }

      User.find(query)
        .select("-password")
        .exec()
        .then((user) => {
          resolve({ status: 200, user });
        })
        .catch((error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Search user by username
// @route   GET /user/fetch/user/username/:username
// @access  Registerd users
export const userByUsernameHelper = (username) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOne({ username: username })
        .select("-password")
        .exec()
        .then((user) => {
          resolve(user);
        })
        .catch((err) => {
          resolve({
            status: 500,
            error_code: "DB_FETCH_ERROR",
            message: err.message,
          });
        });
    } catch (error) {
      resolve({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: err.message,
      });
    }
  });
};

// @desc    Search users by given key
// @route   GET /user/fetch/user/key
// @access  Registerd users
export const userByKeywordHelper = (key) => {
  return new Promise((resolve, reject) => {
    try {
      User.find({
        $or: [
          { username: { $regex: key, $options: "i" } },
          { name: { $regex: key, $options: "i" } },
        ],
      }).then((users) => {
        return resolve(users);
      });
    } catch (error) {
      reject(error);
    }
  });
};

////////////////////////////////////////////////// CONNECTION SECTION //////////////////////////////////////////////////////////////////
// @desc    To check valid user
// @access  Private
const isValidUserId = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    return !!user;
  } catch (error) {
    return false;
  }
};

// @desc    Follow user
// @route   POST /user/:userId/follow/:followeeUserId
// @access  Registerd users
export const followHelper = (userId, followeeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Checking userIDs
      if (!isValidUserId(userId) && !isValidUserId(followeeId)) {
        reject(new Error("Invalid user ID"));
        return;
      }

      // Create the Connection collection if it doesn't exist
      await Connection.init();

      const userConnection = await Connection.findOneAndUpdate(
        { userId: userId },
        { $addToSet: { following: followeeId } },
        { upsert: true, new: true }
      ).exec();

      const followeeConnection = await Connection.findOneAndUpdate(
        { userId: followeeId },
        { $addToSet: { followers: userId } },
        { upsert: true, new: true }
      ).exec();

      resolve({ status: 200, userConnection, followeeConnection });
    } catch (error) {
      reject(error);
    }
  });
};

export const unfollowHelper = (userId, followeeId) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate user IDs
      if (!isValidUserId(userId) || !isValidUserId(followeeId)) {
        reject(new Error("Invalid user ID"));
        return;
      }

      // Create the Connection collection if it doesn't exist
      await Connection.init();

      const userConnection = await Connection.findOneAndUpdate(
        { userId: userId },
        { $pull: { following: followeeId } },
        { new: true }
      ).exec();

      const followeeConnection = await Connection.findOneAndUpdate(
        { userId: followeeId },
        { $pull: { followers: userId } },
        { new: true }
      ).exec();

      resolve({ status: 200, userConnection, followeeConnection });
    } catch (error) {
      reject(error);
    }
  });
};

// @desc    Get connections
// @route   GET /user/fetch/connection/:userId
// @access  Registered users
export const getConnectonHelper = async (userId) => {
  try {
    const response = await Connection.findOne({ userId: userId });
    let connection = {};
    if (!response) {
      connection = { followers: 0, following: 0 };
    } else {
      connection = {
        followers: response.followers,
        following: response.following,
      };
    }

    return {
      status: 200,
      message: "User Connection Fetched",
      connection,
    };
  } catch (error) {
    throw {
      status: error.status || 500,
      error_code: error?.error_code || "DB_FETCH_ERROR",
      message: error.message,
      error,
    };
  }
};

////////////////////////////////////////////////// USER BLOCK SECTION //////////////////////////////////////////////////////////////////

// @desc    Block User
// @route   GET /user/block/
// @access  Registered users
export const blockUserHelper = async (userId, blockUserId) => {
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.blockedUsers.includes(blockUserId)) {
      throw new Error("User Already Blocked");
    } else {
      user.blockedUsers.push(blockUserId);
      await user.save();
    }

    return { status: 200, message: "User Has Been Blocked", user };
  } catch (error) {
    throw {
      status: error.status || 500,
      error_code: error?.error_code || "BLOCK_USER_ERROR",
      message: error.message,
      error,
    };
  }
};

// @desc    UnBlock User
// @route   GET /user/unblock/
// @access  Registered users
export const unBlockUserHelper = async (userId, unBlockUserId) => {
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.blockedUsers.includes(unBlockUserId)) {
      user.blockedUsers = user.blockedUsers.filter(
        (id) => id.toString() !== unBlockUserId.toString()
      );
      await user.save();
      return { status: 200, message: "User Has Been Unblocked", user };
    } else {
      return { status: 200, message: "User was not blocked" };
    }
  } catch (error) {
    throw {
      status: error.status || 500,
      error_code: error?.error_code || "UNBLOCK_USER_ERROR",
      message: error.message,
      error,
    };
  }
};

// @desc    get blocked Users
// @route   GET /user/blockedusers/
// @access  Registered users
export const getBlockedUsersHelper = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      status: 200,
      message: "Fetched Blocked Users",
      blockedUsers: user.blockedUsers,
    };
  } catch (error) {
    throw {
      status: error.status || 500,
      error_code: error?.error_code || "GET_BLOCKED_USERS_ERROR",
      message: error.message,
      error,
    };
  }
};

////////////////////////////////////////////////// EMAIL VERIFICATION //////////////////////////////////////////////////////////////////
// @desc    Sent verification link
// @route   GET /auth/send-verification
// @access  Public - Registerd users
export const sendEmail = (credential) => {
  return new Promise(async (resolve, reject) => {
    try {
      const queryRes = await findQuery(credential);

      if (queryRes.error) {
        throw {
          status: queryRes.error.status,
          message: queryRes.error.message,
        };
      }

      let query = queryRes;

      User.findOne(query)
        .select("-password")
        .exec()
        .then((user) => {
          if (user) {
            verificationEmail(user.email, user.username, user.id)
              .then((response) => {
                resolve({
                  status: 200,
                  message:
                    "A Verification Email has been sent to the registered Email Address,kindly verify the email before proceeding",
                });
              })
              .catch((error) => {
                reject({
                  status: error.status,
                  message:
                    error.message || "Something went wrong,try again later",
                  error,
                });
              });
          } else {
            reject({ status: 404, message: "User not found" });
          }
        })
        .catch((error) => {
          reject({
            status: error.status,
            message: error.message || "Something went wrong,try again later",
            error,
          });
        });
    } catch (error) {
      reject({
        status: 500,
        error_code: "INTERNAL_SERVER_ERROR",
        message: "Somethings wrong please try after sometime.",
      });
    }
  });
};

/////////////////////////////////////////////////CHECK TOKEN //////////////////////////////////////////////////////////////////
export const checkToken = async (userId, token, type) => {
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return Promise.reject({ status: 404, message: "User not found" });
    }

    if (type === "register" && user.verified) {
      return Promise.reject({ status: 400, message: "User Already verified" });
    }

    if (type === "register") {
      const existingToken = await Verify.findOne({
        token: token,
      });

      if (!existingToken) {
        return Promise.reject({
          status: 400,
          message:
            "Token is expired or invalid. Try Sending Another Verification Mail",
        });
      }

      // Update the 'used' key in the Verify schema to true
      existingToken.used = true;
      await existingToken.save();

      // Update the 'verified' key in the User schema to true
      user.verified = true;
      await user.save();

      return Promise.resolve({
        status: 200,
        message: "Token is valid, user verified",
      });
    } else if (type === "update") {
      const existingToken = await Verify.findOne({
        token: token,
      });
      const thirtyMinutesAgo = new Date(Date.now() - 1000 * 60 * 30);
      if (existingToken) {
        existingToken.token2used = true;
        await existingToken.save();

        const newEmail = existingToken.newEmail;

        const user = await User.findOneAndUpdate(
          { _id: userId },
          { email: newEmail }
        );
        return Promise.resolve({
          status: 200,
          message: "Email Has Been Updated",
          email: newEmail,
        });
      } else {
        return Promise.reject({
          status: 500,
          message: "Invalid Token",
        });
      }
    }
  } catch (error) {
    return Promise.reject({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

/////////////////////////////// password management //////////////////////////////

export const changePasswordRequestHelper = (userId, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.findOne({ _id: userId });

      generateTokenForPassword({
        email: user.email,
        password: hashedPassword,
        username: user.username,
      })
        .then((res) => {
          resolve({
            status: res.status || 200,
            message: erroresr.message || "Success",
            res,
          });
        })
        .catch((err) => {
          reject({
            status: err.status || 500,

            message: err.message || "went wrong",
            err,
          });
        });
    } catch (error) {
      reject(error);
    }
  });
};

////////////////////////////////////////////////// POST SAVE SECTION //////////////////////////////////////////////////////////////////
// @desc    Save post
// @route   PUT /user/:userId/save/post/:postId
// @access  Registerd users
export const savePostHelper = (userId, postId) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate(
        { _id: userId },
        { $push: { savedPosts: postId } },
        { new: true }
      )
        .then((user) => {
          Post.findOneAndUpdate(
            { _id: postId },
            { $push: { saved: userId } },
            { new: true }
          )
            .then((post) => {
              resolve({ status: 200, message: "Post Saved", user, post });
            })
            .catch((error) => reject(error));
        })
        .catch((err) => {
          reject({
            status: err.status || 500,

            message: err.message || "went wrong",
            err,
          });
        });
    } catch (err) {
      reject({
        status: err.status || 500,

        message: err.message || "went wrong",
        err,
      });
    }
  });
};
// @desc    Fetch saved Posts
// @route   GET /savedPosts/:userid
// @access  Registered users
export const fetchSavedPostsHelper = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      return {
        status: 404,
        message: "User not found",
      };
    }

    const posts = await user.populate("savedPosts");

    return {
      status: 200,
      message: "Fetched Saved Posts",
      posts: posts.savedPosts,
    };
  } catch (error) {
    return {
      status: error.status || 500,
      error_code: error.code || "INTERNAL_SERVER_ERROR",
      message: error.message || "Something went wrong, please try again later",
    };
  }
};

// @desc    Remove from saved
// @route   DELETE /user/:userId/save/post/remove/:postId
// @access  Registerd users
export const removeSavePostHelper = (userId, postId) => {
  return new Promise((resolve, reject) => {
    try {
      User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedPosts: postId } },
        { new: true }
      )
        .then((user) => {
          Post.findOneAndUpdate(
            { _id: postId },
            { $pull: { saved: userId } },
            { new: true }
          )
            .then((post) => {
              resolve({
                status: 200,
                message: "Post Removed From Saved List",
                user,
                post,
              });
            })
            .catch((error) => reject(error));
        })
        .catch((err) => {
          reject({
            status: err.status || 500,

            message: err.message || "went wrong",
            err,
          });
        });
    } catch (err) {
      reject({
        status: err.status || 500,

        message: err.message || "went wrong",
        err,
      });
    }
  });
};

// @desc    Remove from saved
// @route   DELETE /user/:userId/save/post/remove/:postId
// @access  Registerd users
// export const  getMutualFriendsHelper = async (userId) =>{
//   try {
//     // Find the user's connections
//     const userConnections = await Connection.findOne({ userId }).populate('followers following', 'username');
// console.log('userConnections :>> ', userConnections);
//     if (!userConnections) {
//       throw new Error('User connections not found');
//     }

//     // Extract followers and following lists
//     const { followers, following } = userConnections;

//   console.log('followers,following :>> ', followers,following);
//     // Find users who are friends with the same person but not friends with each other
//     const mutuals = [];
//     for (const follower of followers) {
//       for (const follow of following) {
//         if (follower._id.equals(follow._id)) continue; // Skip if the same user
//         const mutualConnection = await Connection.findOne({
//           userId: follow._id,
//           followers: follower._id,
//         });

//         if (mutualConnection) {
//           const mutualFriend = {
//             user1: follower.username,
//             user2: follow.username,
//             mutualFriend: mutualConnection.userId.username,
//           };
//           mutuals.push(mutualFriend);
//         }
//       }
//     }

//     return mutuals;
//   } catch (error) {
//     throw new Error(`Failed to fetch mutual friends: ${error.message}`);
//   }
// }

export const getMutualFriendsHelper = async (userId) => {
  try {
    const userConnections = await Connection.findOne({ userId }).populate(
      "followers following",
      "username profilePic"
    );
    if (!userConnections) {
      throw new Error("User connections not found");
    }

    const { followers, following } = userConnections;

    const suggestedMutualFriends = [];

    for (const connectedUser of [...followers, ...following]) {
      const connectedUserConnections = await Connection.findOne({
        userId: connectedUser._id,
      }).populate("followers following", "username profilePic");
      if (!connectedUserConnections) {
        continue;
      }

      const { followers: connectedFollowers, following: connectedFollowing } =
        connectedUserConnections;

      for (const suggestedUser of [
        ...connectedFollowers,
        ...connectedFollowing,
      ]) {
        if (
          suggestedUser._id.equals(userId) ||
          followers.some((f) => f._id.equals(suggestedUser._id)) ||
          following.some((f) => f._id.equals(suggestedUser._id))
        ) {
          continue;
        }

        suggestedMutualFriends.push({
          username: suggestedUser.username,
          userId: suggestedUser._id,
          profilePic: suggestedUser.profilePic,
        });
      }
    }

    const uniqueSuggestedMutualFriends = suggestedMutualFriends.filter(
      (value, index, self) =>
        self.findIndex((v) => v.userId.equals(value.userId)) === index
    );

    for (let i = uniqueSuggestedMutualFriends.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueSuggestedMutualFriends[i], uniqueSuggestedMutualFriends[j]] = [
        uniqueSuggestedMutualFriends[j],
        uniqueSuggestedMutualFriends[i],
      ];
    }

    const randomizedMutualFriends = uniqueSuggestedMutualFriends.slice(0, 5);

    return {
      status: 200,
      message: "Fetched Mutual Friends List",
      uniqueSuggestedMutualFriends: randomizedMutualFriends,
    };
  } catch (error) {
    throw new Error(`Failed to suggest mutual friends: ${error.message}`);
  }
};
