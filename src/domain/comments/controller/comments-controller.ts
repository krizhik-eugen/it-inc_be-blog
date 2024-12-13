import { Response } from 'express';
import { HTTP_STATUS_CODES } from '../../../constants';
import {
    TDeleteCommentRequest,
    TGetCommentRequest,
    TGetCommentResponse,
    TUpdateCommentRequest,
} from '../types';
import { commentsService } from '../service';
import { commentsQueryRepository } from '../repository';

export const commentsController = {
    async getComment(req: TGetCommentRequest, res: TGetCommentResponse) {
        const foundComment = await commentsQueryRepository.getComment(
            req.params.id
        );
        if (!foundComment) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(foundComment);
    },

    async updateComment(req: TUpdateCommentRequest, res: Response) {
        const id = req.params.id;
        const { content } = req.body;
        const foundComment = await commentsQueryRepository.getComment(id);
        if (!foundComment) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        if (req.userId !== foundComment.commentatorInfo.userId) {
            res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN);
            return;
        }
        const isCommentUpdated = await commentsService.updateComment({
            content,
            id,
        });
        res.sendStatus(
            isCommentUpdated
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },

    async deleteComment(req: TDeleteCommentRequest, res: Response) {
        const foundComment = await commentsQueryRepository.getComment(
            req.params.id
        );
        if (!foundComment) {
            res.sendStatus(HTTP_STATUS_CODES.NOT_FOUND);
            return;
        }
        if (req.userId !== foundComment.commentatorInfo.userId) {
            res.sendStatus(HTTP_STATUS_CODES.FORBIDDEN);
            return;
        }
        const isCommentDeleted = await commentsService.deleteComment(
            req.params.id
        );
        res.sendStatus(
            isCommentDeleted
                ? HTTP_STATUS_CODES.NO_CONTENT
                : HTTP_STATUS_CODES.NOT_FOUND
        );
    },
};
