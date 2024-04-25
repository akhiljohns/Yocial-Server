import { changePasswordHelper } from "../helpers/authHelper.js";
import responseHandler from "../utils/responseHandler.js";

///// change password

export const changePassword = (req, res) => {
  try {
    const { token, username } = req.params;

    changePasswordHelper(token, username)
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
