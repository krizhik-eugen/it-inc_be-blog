import { HTTP_STATUS_CODES } from '../../../constants';
import {
    TDeleteCommentRequest,
    TDeleteCommentResponse,
    TGetCommentRequest,
    TGetCommentResponse,
    TUpdateCommentRequest,
    TUpdateCommentResponse,
} from '../types';
import { commentsService } from '../service';
import { commentsQueryRepository } from '../repository';
import { createResponseError } from '../../../shared/helpers';

export const commentsController = {
    async getComment(req: TGetCommentRequest, res: TGetCommentResponse) {
        const comment = await commentsQueryRepository.getComment(req.params.id);
        if (!comment) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).send({
                errorsMessages: [createResponseError('Comment is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(comment);
    },

    async updateComment(
        req: TUpdateCommentRequest,
        res: TUpdateCommentResponse
    ) {
        const commentId = req.params.id;
        const userId = req.userId!;
        const { content } = req.body;
        const result = await commentsService.updateComment(
            content,
            commentId,
            userId
        );
        if (result.status === 'Forbidden') {
            res.status(HTTP_STATUS_CODES.FORBIDDEN).send({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        if (result.status === 'NotFound') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).send({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },

    async deleteComment(
        req: TDeleteCommentRequest,
        res: TDeleteCommentResponse
    ) {
        const result = await commentsService.deleteComment(
            req.params.id,
            req.userId!
        );
        if (result.status === 'Forbidden') {
            res.status(HTTP_STATUS_CODES.FORBIDDEN).send({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        if (result.status === 'NotFound') {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).send({
                errorsMessages: result.errorsMessages,
            });
            return;
        }
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT);
    },
};
