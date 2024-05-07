//importing helpers
import {
  adminLogin,
  register,
  getUsers,
  toggelBlockStatus,
  getAllUsers,
  fetchCommentCountHelper,
  fetchPostsHelper,
  getPostReportsHelper,
} from "../helpers/adminHelper.js";
import responseHandler from "../utils/responseHandler.js";

////////////////////////////////////////////////// ADMIN LOGIN //////////////////////////////////////////////////////////////////
// @desc    Login admin
// @route   POST /admin/login
// @access  Private
export const adminPostLogin = (req, res, next) => {
  try {
    const data = req.body;
    adminLogin(data)
      .then((response) => {
        responseHandler(res, response);
      })
      .catch((error) => {
        responseHandler(res, error);
      });
  } catch (error) {}
};

////////////////////////////////////////////////// USER RELATED //////////////////////////////////////////////////////////////////
// @desc    Get users
// @route   GET /admin/fetch-users
// @access  Admin - private
export const fetchUsers = (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 7;
    const search = req.query.search || "";

    getUsers(page, perPage, search)
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
// @desc    Get all users
// @route   GET /admin/fetch-users
// @access  Admin - private
export const fetchAllUsers = (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 7;
    const search = req.query.search || "";

    getAllUsers()
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

// @desc    Change user's block status
// @route   PATCH /admin/:userId/change-status
// @access  Admin - private
export const changeStatus = (req, res) => {
  try {
    const userId = req.params.userId;
    const status = req.body.status;
    toggelBlockStatus(userId, status)
      .then((response) => {
        res.status(response.status).send(response);
      })
      .catch((error) => {
        res.status(error.status).send(error.message);
      });
  } catch (error) {
    res.status(error.status).send(error.message);
  }
};

// @desc    Get post data
// @route   GET /post/fetch-posts
// @access  Public
export const fetchPostsController = (req, res) => {
  try {
    const perPage = 5,
      page = req.query.page || 1;
    fetchPostsHelper(perPage, page)
      .then((response) => {
        res.status(response.status).json(response);
      })
      .catch((error) => {
        res.status(500).json({
          status: 500,
          error_code: "INTERNAL_SERVER_ERROR",
          message: "Somethings wrong, Please try after sometime.",
          error_message: error.message,
          error,
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

// @desc    Get all users
// @route   GET /admin/fetch-users
// @access  Admin - private
export const fetchCommentCount = (req, res) => {
  try {
    const postId = req.params.postId;

    fetchCommentCountHelper(postId)
      .then((response) => {
        res.status(response.status).send(response);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};

//////////////////////////////////////////////// ADMIN REGISTER //////////////////////////////////////////////////////////////////
export const adminPostRegister = (req, res) => {
  try {
    const userData = req.body;
    register(userData)
      .then((response) => {
        res.status(200).json({ ...response });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (error) {
    res.status(500).send(error);
  }
};

// @desc    Fetch post reports
// @route   GET /admin/reports/users
// @access  Admins
export const getPostReports = (req, res) => {
  try {
    const page = req.body.page || 1;
    const perPage = req.body.perPage || 7;
    const search = req.body.search || '';
    getPostReportsHelper(page, perPage, search).then((response)=> {
      res.status(200).json(response);
    }).catch((err)=> {
      res.status(500).json(err);
    })
  } catch (error) {
    res.status(500).json(error)
  }
}
