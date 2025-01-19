export const userLoginValidation = {
    minLength: 3,
    maxLength: 10,
    errorMessage: 'Login must be between 3 and 20 symbols',
    pattern: /^[a-zA-Z0-9_-]*$/,
    errorMessagePattern:
        'Login should contain only latin letters, numbers, - and _',
};

export const userEmailValidation = {
    pattern: /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/,
    errorMessagePattern:
        'Email should be a valid email address, example: example@example.com',
};
