//importing helpers
import {
  adminLogin,
  register,
  getUsers,
  toggelBlockStatus,
  getAllUsers
} from "../helpers/adminHelper.js";

////////////////////////////////////////////////// ADMIN LOGIN //////////////////////////////////////////////////////////////////
// @desc    Login admin
// @route   POST /admin/login
// @access  Private
export const adminPostLogin = (req, res, next) => {
  try {
    const data = req.body;
    adminLogin(data)
      .then((response) => {
        res.status(response.status).json({ ...response });
      })
      .catch((error) => {
        res.status(error.status).json({
          status: 500,
          error_code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      });
  } catch (error) {
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
        res.status(response.status).json(response);
      })
      .catch((err) => {
        res.status(err.status).json(err);
      });
  } catch (error) {
    res.status(error.status).json(err);
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
        res.status(response.status).json(response);
      })
      .catch((err) => {
        res.status(err.status).json(err);
      });
  } catch (error) {
    res.status(error.status).json(err);
  }
};


// @desc    Change user's block status
// @route   PATCH /admin/:userId/change-status
// @access  Admin - private
export const changeStatus = (req, res) => {
    try {
        const userId = req.params.userId;
        const status = req.body.status;
        console.log(userId,status);
        toggelBlockStatus(userId, status).then((response) =>{
            res.status(response.status).send(response);
        }).catch((error) => {
            res.status(error.status).send(error.message);
        })
    } catch (error) {
        res.status(error.status).send(error.message);
    }
}
















//////////////////////////////////////////////// ADMIN REGISTER //////////////////////////////////////////////////////////////////
export const adminPostRegister = (req, res) => {
    try {
      const userData = req.body;
      register(userData)
        .then((response) => {
          res.status(200).json({...response})
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    } catch (error) {
      res.status(500).send(error);
    }
  };
