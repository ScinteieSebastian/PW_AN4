const randtoken = require('rand-token');
const {
    Users
} = require('../data');

class verfication {
    verifyEmail(email, code) {
        var response = {};
        return new Promise((resolve, reject) => {
            var query = { 'email': email }
            Users.findOne(query, (err, result, data) => {
                if (err) {
                    //return err in failure handler
                    response.error = err;
                    response.code = 500;
                    response.message = "Server error";
                    return this.failureHandler(response, reject)
                }
                if (result) {
                    if (result.scode == code) {
                        return this.updateStatus(email, 'active', response, resolve);
                    } else {
                        //return err in failure handler
                        response.error = null;
                        response.code = 200;
                        response.message = "Verification link failed";
                        return reject(response);
                    }
                } else {
                    //return err in failure handler
                    response.error = null;
                    response.code = 404;
                    response.message = "User was not found";
                    return reject(response);
                }
            })
        })
    }

    updateStatus(email, status, response, resolve) {
        var tmpToken = randtoken.generate(30);
        var query = { 'email': email };
        var update = { 'scode': tmpToken, 'status': status }
        Users.updateOne(query, update, (err, result) => {
            if (err) {
                //return err in failure handler
                response.error = err;
                response.code = 500;
                response.message = message.SERVER_ERROR;
                response.responseTimestamp = new Date();
                response.result = 'Failed';
                return reject(response);
            }
            if(result) {
                response.result = 'Success'
                response.code = 200;
                response.message = "Verificare email cu success";
                return resolve(response)
            }
        })
    }
}

module.exports = new verfication();