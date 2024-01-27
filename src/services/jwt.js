import jwt from "jsonwebtoken";




// @desc    Sign JWT Refresh token
// @file   < Middleware-function >
// @access  Private
const generateRefreshToken = (payload) => {
  return new Promise((resolve, reject) => {
    const options = { expiresIn: "10d" };
    //signing new refresh token with an expiration time  of 10days
    jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      options,
      (err, refreshToken) => {
        if (err) {
          reject(err);
        } else {
          resolve(refreshToken);
        }
      }
    );
  });
};

// @desc    Sign JWT token
// @file   < Middleware >
// @access  Private
const generateJwt = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const tokens = {};
      const options = { expiresIn: "360000" },
      payload = {};
      if (data._id) {
        payload.userId = data._id;
      } else if (data.email) {
        payload.email = data.email;
      }
      //signing new access token with an expiration time of 1hr
      jwt.sign(
        payload,
        process.env.JWT_KEY_SECRET,
        options,
        (err, accessToken) => {
          if (err) {
            reject(err);
          } else {
            tokens["accessToken"] = accessToken;

            //calling function to generate refresh token
            generateRefreshToken(payload)
              .then((refreshToken) => {
                tokens["refreshToken"] = refreshToken;

                resolve(tokens);
              })
              .catch((err) => {
                reject(err);
              });
          }
        }
        );
    } catch (error) {
      reject(error);
    }
  });
};

       
export default generateJwt;