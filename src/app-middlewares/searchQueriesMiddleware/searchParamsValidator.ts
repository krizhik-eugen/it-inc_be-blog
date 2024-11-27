import { Schema } from "express-validator";
import { requestValidator } from "../../helpers";


export const querySchema: Schema = {
    sortBy: {
        in: ['query'],
        optional: true,
        isIn: {
            options: [['createdAt', 'name']],
            errorMessage: "sortBy must be either 'createdAt' or 'name'"
        }
    },
    sortDirection: {
        in: ['query'],
        optional: true,
        isIn: {
            options: [['asc', 'desc']],
            errorMessage: 'sortDirection must be either "asc" or "desc"'
        }
    },
    pageNumber: {
        in: ['query'],
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'pageNumber must be a non-negative integer'
        },
        toInt: true
    },
    pageSize: {
        in: ['query'],
        optional: true,
        isInt: {
            options: { min: 1 },
            errorMessage: 'pageSize must be a positive integer'
        },
        toInt: true
    }
};


export const searchQueryParamsValidator = requestValidator({ querySchema });