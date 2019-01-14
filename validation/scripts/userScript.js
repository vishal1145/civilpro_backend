module.exports = {
    'email': {
        notEmpty: {
            errorMessage: 'email is required'
        },
        isEmail: {
            errorMessage: 'Please enter valid email'
        },
        errorMessage: 'email is required'
    },
    'password': {
        notEmpty: {
            errorMessage: 'password is required'
        },
        isLength: {
            options: [{ min: 4 , max: 20 }],
            errorMessage: 'Your password contain at least 4 characters'
        },
        errorMessage: 'password is required'
    },
    'country': {
        notEmpty: {
            errorMessage: 'country is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000 }],
            errorMessage: 'country should contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'country should only contain numbers'
        },
        errorMessage: 'country is required'
    },
    'category': {
        notEmpty: {
            errorMessage: 'category is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000 }],
            errorMessage: 'category should only contain numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'category should only contain numbers'
        },
        errorMessage: 'category is required'
    },
    'phone': {
        notEmpty: {
            errorMessage: 'phone is required'
        },
        matches: {
            options: [/^[\+]?[0-9]*$/],
            errorMessage: 'phone no should only contain numbers'
        },
        errorMessage: 'phone is required'
    },
    'first_name': {
        notEmpty: {
            errorMessage: 'first_name is required'
        },
        errorMessage: 'first_name is required'
    },
    'last_name': {
        notEmpty: {
            errorMessage: 'last_name is required'
        },
        errorMessage: 'last_name is required'
    },
    'gender': {
        notEmpty: {
            errorMessage: 'gender is required'
        },
        isLength: {
            options: [{ min: 1 , max: 20000 }],
            errorMessage: 'gender should contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'gender should contain at least one numbers'
        },
        errorMessage: 'gender is required'
    },
    'profession': {
        notEmpty: {
            errorMessage: 'profession is required'
        },
        errorMessage: 'profession is required'
    },
    'city': {
        notEmpty: {
            errorMessage: 'city is required'
        },
        isLength: {
            options: [{ min: 1 , max: 20000 }],
            errorMessage: 'city should contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'city should only contain numbers'
        },
        errorMessage: 'city is required'
    },
    'agency_name': {
        notEmpty: {
            errorMessage: 'Agency name is required'
        },
        errorMessage: 'Agency name is required'
    },
    'agency_address': {
        notEmpty: {
            errorMessage: 'agency_address is required'
        },
        errorMessage: 'agency_address is required'
    },
    'role_type': {
        notEmpty: {
            errorMessage: 'role_type is required'
        },
        errorMessage: 'role_type is required'
    },
    'user_id': {
        notEmpty: {
            errorMessage: 'user_id is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000}],
            errorMessage: 'user_id should  contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'user_id should only contain numbers'
        },
        errorMessage: 'user_id is required'
    },
    'latitude': {
        notEmpty: {
            errorMessage: 'latitude is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000 }],
            errorMessage: 'latitude should only contain numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'latitude should contain at least one numbers'
        },
        errorMessage: 'latitude is required'
    },
    'longitude': {
        notEmpty: {
            errorMessage: 'longitude is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000 }],
            errorMessage: 'longitude should contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'longitude should only contain numbers'
        },
        errorMessage: 'longitude is required'
    },
    'level': {
        notEmpty: {
            errorMessage: 'level is required'
        },
        isLength: {
            options: [{ min: 1 , max: 2000}],
            errorMessage: 'level should contain at least one numbers'
        },
        matches: {
            options: [/^[\+]?[0-9._-]*$/],
            errorMessage: 'level should only contain numbers'
        },
        errorMessage: 'level is required'
    },
    'dob': {
        notEmpty: {
            errorMessage: 'dob is required'
        },
        errorMessage: 'dob is required'
    },
}