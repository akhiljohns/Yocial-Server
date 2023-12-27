import { changePasswordHelper } from "../helpers/authHelper.js";

///// change password

export const changePassword = (req, res) => {
  try {
    const {token, username} = req.params;

    changePasswordHelper(token, username).then((response)=> {
      res.status(response.status).send("password has been changed successfully, Please go back to home page.");
    }).catch((error)=> {
      res.status(error.status).send(error.message)
    })
  } catch (error) {
    res.status(error.status).send(error.message);
  }
}
