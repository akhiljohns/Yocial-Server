import bcrypt, { hash } from "bcrypt"; //imporing bcrypt

import { User } from "../models/userModel.js"; //userModel

  
 export const userLogin = (userData) => {
    try {
      let loginStatus = false;
      let response = {};
      return new Promise((resolve, reject) => {
        User.findOne({ email: userData.email }).then(async (foundUser) => {
          // console.log(foundUser + "----------------------");
          if (foundUser) {
            let status = await bcrypt.compare(
              userData.password,
              foundUser.password
            );
            // console.log(status + "_______________");
            if (status) {
            
              // console.log("logined Successfully");
              response.user = foundUser;
              response.status = true;
            
          } else {
              console.log("login failed");
              response.status = "Login Failed";
            }
          } else {
            console.log("login failed");
            response.status = "Login Failed";

          }

          resolve(response);
        });
      });
    } catch (error) {
      throw error;
    }
  };

export const registration = (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        userData.password = await bcrypt.hash(userData.password, 10);
        let customer = new user(userData);
        await customer.save().then((response) => {
          resolve(response);
        });
      } catch (error) {
        reject(error);
      }
    });
  };
