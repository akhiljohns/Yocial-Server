import {
  userLogin,
  registration,
  followHelper,
  unfollowHelper,
  getConnectonHelper,
  fetchUserById,
  sendEmail,
  checkToken,
  changePasswordRequestHelper,
  userByUsernameHelper,
  updateProfielHelper,
  removeSavePostHelper,
  savePostHelper,
  fetchSavedPostsHelper,
  userByKeywordHelper,
  updateAvatarHelper,
} from "../../src/helpers/userHelper.js";
import { verifyEmailChange } from "../services/nodemailer.js";
import responseHandler from "../utils/responseHandler.js";

////////////////////////////////////////////////// USER LOGIN & REGISTRATION //////////////////////////////////////////////////////////////////
// @desc    Login user
// @route   POST /user/login
// @access  Public
export const login = (req, res) => {
  try {
    const userData = {
      credential: req.body.credential,
      password: req.body.password,
    };
    userLogin(userData)
      .then((response) => {
        responseHandler(res, response);
      })
      .catch((err) => {
        responseHandler(res, err);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

// @desc    Register user
// @route   POST /user/register
// @access  Public
export const register = (req, res) => {
  try {
    const userData = req.body;
    registration(userData)
      .then((response) => {
        // if (response.status == 200) {
        //   sendEmail(response.email).then((resp) => {
        //     res.status(resp.status).json(resp);
        //   });
        // }

        responseHandler(res, response);
      })
      .catch((err) => {
        responseHandler(res, err);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

// @desc    Update user
// @route   POST /users/update/profiile
// @access  Public
export const updateProfile = (req, res) => {
  try {
    const userData = req.body;
    updateProfielHelper(userData)
      .then((response) => {
        responseHandler(res, response);
      })
      .catch((err) => {
        responseHandler(res, err);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

// @desc    Update user avatar
// @route   POST /users/update/avtar
// @access  Public
export const updateAvatar = (req, res) => {
  try {
    const userData = req.body;
    updateAvatarHelper(userData)
      .then((response) => {
        responseHandler(res, response);
      })
      .catch((err) => {
        responseHandler(res, err);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

////////////////////////////////////////////////// USER FETCH //////////////////////////////////////////////////////////////////
// @desc    Get users
// @route   GET /user/fetch-users
// @access  Public
export const fetch_Users = (req, res) => {
  try {
    const { userId } = req.query || "";
    fetchUserById(userId)
      .then((response) => {
        res.status(200).json(response)
      })
      .catch((err) => {
        responseHandler(res, err);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

// @desc    Fetch user by username
// @route   /user/fetch/user/username/:username
// @access Authenticated users
export const fetchUserByUsername = (req, res) => {
  try {
    const { username } = req.params;

    userByUsernameHelper(username)
      .then((user) => {
        responseHandler(res, {status:200, user});
      })
      .catch((error) => {
        responseHandler(res, error);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

// @desc    Search users by given keyword
// @route   GET /user/fetch/user/keyword
// @access  Registered users
export const fetchUserByKeyword = async (req, res) => {
  try {
    const { key } = req.params || "";
    if (!key) {
      return res.status(400).json({ message: "Please provide a keyword" });
    }

    const users = await userByKeywordHelper(key);
    users.length <= 0
      ? res.status(404).json({ message: "No users found" })
      : res.status(200).json(users);
  } catch (error) {
    responseHandler(res, error);
  }
};

////////////////////////////////////////////////// CONNECTION SECTION //////////////////////////////////////////////////////////////////
// @desc    Follow user
// @route   POST /user/:userId/follow/:followeeUserId
// @access  Registerd users
export const followUser = (req, res) => {
  try {
    const { userId, followeeUserId } = req.params;
    followHelper(userId, followeeUserId)
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

// @desc    Unfollow user
// @route   POST /user/:userId/unfollow/:followeeUserId
// @access  Registerd users
export const unfollowUser = (req, res) => {
  try {
    const { userId, followeeUserId } = req.params;
    unfollowHelper(userId, followeeUserId)
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

// @desc    Get connections
// @route   GET /user/fetch/connection/:userId
// @access  Registerd users
export const getConnection = (req, res) => {
  try {
    const { userId } = req.params;
    getConnectonHelper(userId)
      .then((connection) => {
        responseHandler(res, connection);
      })
      .catch((err) => {
        responseHandler(res, err);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

////////////////////////////////////////////////// FOR REGISTERING EMAIL //////////////////////////////////////////////////////////////////
// @desc    To send user verification email
// @route   POST /user/send-verification
// @access  Public
export const sendVerificationEmail = (req, res) => {
  try {
    const credential = req.body.credential;
    sendEmail(credential)
      .then((response) => {
        responseHandler(res, response);
      })
      .catch((error) => {
        responseHandler(res, error);
      });
  } catch (error) {
    responseHandler(res, {
      status: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Somethings wrong please try after sometime.",
    });
  }
};

// @desc    To verify user email
// @route   GET /auth/verify/:id/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.params.token;
    const type = "register";
    checkToken(userId, token, type)
      .then((response) => {
        responseHandler(res, response);
      })
      .catch((error) => {
        responseHandler(res, error);
      });
  } catch (error) {
    responseHandler(res, {
      status: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Somethings wrong please try after sometime.",
    });
  }
};

////////////////////////////////////////////////// FOR CHANGING EMAIL //////////////////////////////////////////////////////////////////
// @desc    To send user verification email
// @route   POST /user/send-verification
// @access  Public
export const sendEmailConfirmation = (req, res) => {
  try {
    const userDetails = req.body;
    verifyEmailChange(userDetails)
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

// @desc    To verify changing email
// @route   GET /auth/verify/:id/:token
// @access  Public
export const verifyEmailConfirmation = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.params.token;
    const type = req.params.type;

    checkToken(userId, token, type)
      .then((response) => {
        responseHandler(res, response);
      })
      .catch((error) => {
        responseHandler(res, error);
      });
  } catch (error) {
    responseHandler(res, {
      status: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Somethings wrong please try after sometime.",
    });
  }
};

////////////////////////////////////////////////// POST SAVE SECTION //////////////////////////////////////////////////////////////////
// @desc    Save post
// @route   PUT /user/:userId/save/post/:postId
// @access  Registerd users
export const savePost = (req, res) => {
  try {
    const { userId, postId } = req.params;
    savePostHelper(userId, postId)
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
// @desc    Fetch Saved post
// @route   GET /savedposts/:userid
// @access  Registerd users
export const fetchSavedPosts = (req, res) => {
  try {
    const { userId } = req.params;
    fetchSavedPostsHelper(userId)
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

// @desc    Remove saved post
// @route   PUT /user/:userId/save/post/remove/:postId
// @access  Registerd users
export const removeSavedPost = (req, res) => {
  try {
    const { userId, postId } = req.params;
    removeSavePostHelper(userId, postId)
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

/////////////// password management //////////////
export const requestVerification = (req, res) => {
  try {
    const { password, userId } = req.body;
    changePasswordRequestHelper(userId, password)
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
