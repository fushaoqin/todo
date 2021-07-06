const isEmpty = (str) => {
    if (str.trim() === '') return true;
    else return false;
};

const isEmail = (email) => {
    //https://www.regular-expressions.info/email.html
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    //if (email.match(emailRegex)) return true;
    return emailRegex.test(email);
}

exports.validateLoginData = (data) => {
    let errors = {};
    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
};

exports.validateSignUpData = (data) => {
    let errors = {};

    if (isEmpty(data.email)) {
        errors.email = 'Must not be empty';
    } else if (!isEmail(data.email)) {
        errors.email = 'Must be valid email address';
    }

    if (isEmpty(data.firstName)) errors.firstName = 'Must not be empty';
    if (isEmpty(data.lastName)) errors.lastName = 'Must not be empty';
    if (isEmpty(data.phoneNumber)) errors.phoneNumber = 'Must not be empty';
    if (isEmpty(data.country)) errors.country = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    if (isEmpty(data.username)) errors.username = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
}