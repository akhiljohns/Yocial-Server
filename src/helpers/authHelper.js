import User from "../models/userModel.js"; //userModel

import { Verify } from "../models/verifyModel.js"







export const changePasswordHelper = (token, username) => {
    return new Promise((resolve, reject) => {
        try {
            Verify.findOneAndUpdate({username: username, token: token, used: false}, {used: true}).then((res) => {
                if(res){
                    User.findOneAndUpdate({username:username}, {password: res.password}).then(async (response)=> {
                        resolve({
                            status: 200,
                            message: "User Password Updated Successfully",
                            response
                          })
                    }).catch((err) => {
                        reject(err);
                    })
                }
            }).catch((err) => {
                reject(err);
            })
        } catch (error) {
            reject(error);
        }
    })
}