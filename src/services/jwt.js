import jwt from "jsonwebtoken";

// @desc    Sign JWT token
// @file   < Middleware >
// @access  Private
const generateJwt = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const tokens = {};
      const options = { expiresIn: "100000" };
      const payload = {};
      if (data.id) {
        payload.userId = data.id;
      } else if (data.email) {
        payload.email = data.email;
      }
      jwt.sign(
        payload,
        process.env.JWT_KEY_SECRET,
        options,
        (err, accessToken) => {
          if (err) {
            reject(err);
          } else {
            tokens["accessToken"] = accessToken;
            resolve(tokens);
          }
        }
      );
    } catch (error) {
        console.log(`Error Generating JWT ${error}`);
        reject(error);
    }
  });
};
export default generateJwt;
