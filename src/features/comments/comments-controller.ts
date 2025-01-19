import { inject, injectable } from 'inversify';

import { CommentsQueryRepository } from './comments-query-repository';
import { CommentsService } from './comments-service';
import {
    TDeleteCommentRequest,
    TGetCommentRequest,
    TGetCommentResponse,
    TUpdateCommentRequest,
} from './types';
import { createResponseError } from '../../shared/helpers';
import { TResponseWithError } from '../../shared/types';
import { TUpdateLikeStatusRequest } from '../likes/types';
import { HTTP_STATUS_CODES } from '../../constants';

@injectable()
export class CommentsController {
    constructor(
        @inject(CommentsQueryRepository)
        protected commentsQueryRepository: CommentsQueryRepository,
        @inject(CommentsService) protected commentsService: CommentsService
    ) {}

    async getComment(req: TGetCommentRequest, res: TGetCommentResponse) {
        const userId = req.userId;
        const comment = await this.commentsQueryRepository.getComment(
            req.params.id,
            userId
        );
        if (!comment) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
                errorsMessages: [createResponseError('Comment is not found')],
            });
            return;
        }
        res.status(HTTP_STATUS_CODES.OK).json(comment);
    }

    async updateComment(req: TUpdateCommentRequest, res: TResponseWithError) {
        const commentId = req.params.id;
        const userId = req.userId!;
        const { content } = req.body;
        const result = await this.commentsService.updateComment(
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
    }

    async updateCommentLikeStatus(
        req: TUpdateLikeStatusRequest,
        res: TResponseWithError
    ) {
        const commentId = req.params.id;
        const userId = req.userId!;
        const { likeStatus } = req.body;

        const result = await this.commentsService.updateCommentLikeStatus(
            likeStatus,
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
    }

    async deleteComment(req: TDeleteCommentRequest, res: TResponseWithError) {
        const result = await this.commentsService.deleteComment(
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
    }
}
