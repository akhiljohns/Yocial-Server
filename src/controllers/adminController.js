//importing helpers
import {
    adminLogin,
    // register
  } from "../helpers/adminHelper.js";
  

////////////////////////////////////////////////// ADMIN LOGIN //////////////////////////////////////////////////////////////////
// @desc    Login admin
// @route   POST /admin/login
// @access  Private
export const adminPostLogin = (req, res, next) => {
    try {
        const data = req.body;
        adminLogin(data).then((response) => {
            res.status(200).json({...response});
        }).catch((error) => {
            res.status(200).json({status:500, error_code: "INTERNAL_SERVER_ERROR", message:error.message});
        })
    } catch (error) {
        console.log("error logging in admin", error);
    }
}

// export const adminPostRegister = (req, res) => {
//     try {
//       const userData = req.body;
//       register(userData)
//         .then((response) => {
//           res.status(200).json({...response})
//         })
//         .catch((err) => {
//           res.status(500).send(err);
//         });
//     } catch (error) {
//       res.status(500).send(error);
//     }
//   };

