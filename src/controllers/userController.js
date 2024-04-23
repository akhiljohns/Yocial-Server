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
} from "../../src/helpers/userHelper.js";
import { verifyEmailChange } from "../services/nodemailer.js";

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
        res.status(response.status).json(response);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  } catch (error) {
    res.status(err.status).send(error);
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

        res.status(response.status).json(response);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  } catch (error) {
    res.status(error.status).send(error);
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
        res.status(response.status).json(response);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  } catch (error) {
    res.status(error.status).send(error);
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
        res.status(response.status || 200).json(response);
      })
      .catch((err) => {
        res.status(err.status || 500).json(err);
      });
  } catch (error) {
    res.status(error.status || 500).json(err);
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
        res.status(200).send(user);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
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
    res.status(500).send(error);
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
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(error.status || 500).send(error);
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
        res.status(200).send(response);
      })
      .catch((error) => {
        res.status(error?.status || 500).send(error);
      });
  } catch (error) {
    res.status(error.status || 500).send(error);
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
        res.status(200).send(connection);
      })
      .catch((err) => {
        res.status(err?.status || 500).send(err);
      });
  } catch (error) {
    res.status(error?.status || 500).send(err);
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
        res.status(response.status).send(response);
      })
      .catch((error) => {
        res.status(error.status).send(error);
      });
  } catch (error) {
    res.status(error.status).send({
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
        res.status(response.status).send(response);
      })
      .catch((error) => {
        res.status(error.status).send(error);
      });
  } catch (error) {
    res.status(error.status).send({
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
        res.status(response.status || 200).send(response);
      })
      .catch((error) => {
        res.status(error.status || 500).send(error);
      });
  } catch (error) {
    res.status(error.status || 500).send({
      status: error.status || 500,
      error_code: error.code || "INTERNAL_SERVER_ERROR",
      message:
        error.message || "Something went wrong, please try after sometime.",
    });
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
        res.status(response.status || 200).send(response);
      })
      .catch((error) => {
        res.status(error.status || 500).send(error);
      });
  } catch (error) {
    res.status(error.status || 500).send({
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
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
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
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
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
        res.status(200).json(response);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

/////////////// password management //////////////
export const requestVerification = (req, res) => {
  try {
    const { password, userId } = req.body;
    changePasswordRequestHelper(userId, password)
      .then((response) => {
        res.status(response.status).send(response);
      })
      .catch((error) => {
        res.status(error.status).send(error);
      });
  } catch (error) {
    res.status(error.status).send(error);
  }
};
