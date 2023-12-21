import {
  userLogin,
  registration,
  followHelper,
  unfollowHelper,
  getConnectonHelper,
  fetchUserById,
  sendEmail,
  checkToken,
  changePasswordRequestHelper
} from "../../src/helpers/userHelper.js";

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
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Register user
// @route   POST /user/register
// @access  Public
export const register = (req, res) => {
  try {
    const userData = req.body;
    // console.log(`userData in validateRegister ${userData}`);
    registration(userData)
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

////////////////////////////////////////////////// USER FETCH //////////////////////////////////////////////////////////////////
// @desc    Get users
// @route   GET /user/fetch-users
// @access  Public
export const fetch_Users = (req, res) => {
  try {
    const {userId} = req.query || ''
    fetchUserById(userId).then((response) => {
      res.status(200).json(response)
    }).catch((err) => {
      res.status(500).json(err);
    })
  } catch (error) {
    console.log("error in fetchUsers (userController)", error);
    res.status(500).json(err);
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
    res.status(500).send(error);
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
        res.status(500).send(error);
      });
  } catch (error) {
    res.status(500).send(error);
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
        res.status(500).send(err);
      });
  } catch (error) {
    res.status(500).send(err);
  }
};


////////////////////////////////////////////////// EMAIL VARIFICATION //////////////////////////////////////////////////////////////////
// @desc    To send user verification email
// @route   POST /user/send-verification
// @access  Public
export const sendVerificationEmail = (req, res) => {
  try {
    const email = req.body.email;
    sendEmail(email).then((response) => {
      res.status(200).send(response)
    }).catch((error) => {
      res.status(error.status).send(error)
    })
  } catch (error) {
    res.status(500).send({
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

    checkToken(userId, token).then((response) => {
      res.status(200).send(response)
    }).catch((error) => {
      res.status(error.status).send(error)
    })
  } catch (error) {
    res.status(500).send({
      status: 500,
      error_code: "INTERNAL_SERVER_ERROR",
      message: "Somethings wrong please try after sometime.",
    });
  }
};


/////////////// password management //////////////
export const requestVerification = (req, res) => {
  try {
    const {password, userId} = req.body;
    changePasswordRequestHelper(userId, password).then((response) => {
      res.status(200).send(response)
    }).catch((error) => {
      res.status(500).send(error)
    })
  } catch (error) {
    res.status(500).send(error)
  }
}
