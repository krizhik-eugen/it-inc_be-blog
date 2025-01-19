export const blogWebsiteUrlValidation = {
    pattern:
        /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
    errorMessagePattern: 'Website URL should be a valid URL',
    maxLength: 100,
};

export const blogNameValidation = {
    maxLength: 15,
};

export const blogDescriptionValidation = {
    maxLength: 500,
};
