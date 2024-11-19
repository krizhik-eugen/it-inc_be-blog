import { Schema } from 'express-validator';
import { requestValidator } from '../../helpers';

const nameLength = 15;
const descriptionLength = 500;
const websiteUrlLength = 100;
const websiteUrlPattern =
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

const paramSchema: Schema = {
    id: {
        in: ['params'],
        isString: true,
        notEmpty: {
            errorMessage: 'ID is required',
        },
    },
};

const bodySchema: Schema = {
    name: {
        in: ['body'],
        exists: {
            errorMessage: 'Name is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Name is required',
        },
        isLength: {
            options: { max: nameLength },
            errorMessage: `Name length should be max ${nameLength} characters`,
        },
    },
    description: {
        in: ['body'],
        exists: {
            errorMessage: 'Description is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'Description is required',
        },
        isLength: {
            options: { max: descriptionLength },
            errorMessage: `Description length should be max ${descriptionLength} characters`,
        },
    },
    websiteUrl: {
        in: ['body'],
        exists: {
            errorMessage: 'WebsiteUrl is required',
        },
        isString: true,
        trim: true,
        notEmpty: {
            errorMessage: 'WebsiteUrl is required',
        },
        isLength: {
            options: { max: websiteUrlLength },
            errorMessage: `Website URL length should be max ${websiteUrlLength} characters`,
        },
        matches: {
            options: websiteUrlPattern,
            errorMessage: 'Website URL should be a valid URL',
        },
    },
};

export const blogsValidators = {
    postRequest: requestValidator(bodySchema),
    putRequest: requestValidator(bodySchema, paramSchema),
};
