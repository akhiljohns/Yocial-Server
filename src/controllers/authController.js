import { changePasswordHelper } from "../helpers/authHelper.js";

///// change password

export const changePassword = (req, res) => {
  try {
    const {token, username} = req.params;

    changePasswordHelper(token, username).then((response)=> {
      res.status(200).send("password has been changed successfully, Please go back to home page.");
    }).catch((error)=> {
      res.status(500).send(error.message)
    })
  } catch (error) {
    res.status(500).send(error.message);
  }
}
