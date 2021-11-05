const validator = require('validator');
const keys = require('../config/keys');
const Transporter = require('../config/mail');

const {
    ServerError
} = require('../errors');
/**
 * 
 * @param {*} field 
 * @throws {ServerError}
 */
const validateFields = (fields) => {

    for (let fieldName in fields) {
        let fieldValue = fields[fieldName].value; 
        const fieldType = fields[fieldName].type;

        if (!fieldValue || fieldValue.length === 0) {
            throw new ServerError(`Lipseste campul ${fieldName}`, 400);
        }

        fieldValue += ''; // validator functioneaza doar pe strings
        switch (fieldType) {
            case 'username':
                if(!validator.isEmail(fieldValue)) {
                    if(!validator.isAlphanumeric(fieldValue)) {
                        throw new ServerError(`Campul ${fieldName} trebuie sa fie o adresa de email valida sau contina doar litere si cifre`, 400);
                    }
                }
                break;
            case 'email':
                if(!validator.isEmail(fieldValue)) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa fie o adresa de email valida`, 400);
                }
                break;
            case 'alphanumeric':
                if(!validator.isAlphanumeric(fieldValue)) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa contina doar litere si cifre`, 400);
                }
                break;
            case 'ascii':
                if (!validator.isAscii(fieldValue)) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa contina doar caractere ascii`, 400);
                }
                break;
            case 'alpha':
                if (!validator.isAlpha(fieldValue)) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa contina doar litere`, 400);
                }
                break;
            case 'int':
                if (!validator.isInt(fieldValue)) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa fie un numar intreg`, 400);
                }
                break;
            case 'jwt':
                if (!validator.isJWT(fieldValue)) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa fie jwt`, 400);
                }
                break;
        }
    }
}

class sendEmail {
    constructor(reciever, type, token, supportMessage) {
        this.reciever = reciever;
        this.type = type;
        this.token = token;
        this.supportMessage = supportMessage;
    }

    email() {
        return new Promise((resolve, reject) => {
            var emailContent = require(`../security/EmailTemplate/${this.type}`)
            var response = {};
            var mailOpts = {
                from: keys.mailer.user,
                to: this.reciever,
                subject: emailContent.subject,
                text: `${emailContent.body}`+ this.reciever + `/` + this.token
            };
            Transporter.sendMail(mailOpts, function (error, info) {
                if (error) {
                    response.error = error;
                    response.responseTimestamp = new Date();
                    response.result = 'Failed';
                    return reject(response);
                }
                else {
                    response.result = 'Success';
                    response.code = 201;
                    return resolve(response)
                }
            });
        })
    }

    supportEmail() {
        return new Promise((resolve, reject) => {
            var emailContent = require(`../security/EmailTemplate/${this.type}`)
            var response = {};
            var mailOpts = {
                from: keys.mailer.user,
                to: this.reciever,
                subject: emailContent.subject,
                text: `${emailContent.body}`+ this.supportMessage.question + `\n\n Answer:\n` + this.supportMessage.answer
            };
            Transporter.sendMail(mailOpts, function (error, info) {
                if (error) {
                    response.error = error;
                    response.responseTimestamp = new Date();
                    response.result = 'Failed';
                    return reject(response);
                }
                else {
                    response.result = 'Success';
                    response.code = 201;
                    return resolve(response)
                }
            });
        })
    }

}

module.exports = {
    sendEmail,
    validateFields
}