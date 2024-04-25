//importing helpers
import {
  adminLogin,
  register,
  getUsers,
  toggelBlockStatus,
  getAllUsers,
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
  } catch (error) {
    responseHandler(res, error);
  }
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
        responseHandler(res, response);
      })
      .catch((error) => {
        responseHandler(res, error);
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
        responseHandler(res, response);
      })
      .catch((err) => {
        responseHandler(res, err);
      });
  } catch (error) {
    responseHandler(res, error);
  }
};
