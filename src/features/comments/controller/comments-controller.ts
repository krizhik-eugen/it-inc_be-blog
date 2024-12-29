import { HTTP_STATUS_CODES } from '../../../constants';
import {
    TDeleteCommentRequest,
    TGetCommentRequest,
    TGetCommentResponse,
    TUpdateCommentRequest,
} from '../types';
import { commentsService } from '../service';
import { commentsQueryRepository } from '../repository';
import { createResponseError } from '../../../shared/helpers';
import { TResponseWithError } from '../../../shared/types';

export const commentsController = {
    async getComment(req: TGetCommentRequest, res: TGetCommentResponse) {
        const comment = await commentsQueryRepository.getComment(req.params.id);
        if (!comment) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Comment is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(comment);
    },

    async updateComment(req: TUpdateCommentRequest, res: TResponseWithError) {
        const commentId = req.params.id;
        const userId = req.userId!;
        const { content } = req.body;
        const result = await commentsService.updateComment(
            content,
            commentId,
            userId
        );
        if (result.status === 'Forbidden') {
            res.status(HTTP_STATUS_CODES.FORBIDDEN).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        if (result.status === 'NotFound') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },

    async deleteComment(req: TDeleteCommentRequest, res: TResponseWithError) {
        const result = await commentsService.deleteComment(
            req.params.id,
            req.userId!
        );
        if (result.status === 'Forbidden') {
            res.status(HTTP_STATUS_CODES.FORBIDDEN).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        if (result.status === 'NotFound') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },
};
