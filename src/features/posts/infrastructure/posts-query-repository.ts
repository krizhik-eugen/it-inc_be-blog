import { inject, injectable } from 'inversify';
import { LikesQueryRepository } from '../../likes/likes-query-repository';
import { TMappedSearchQueryParams } from '../../../shared/types';
import { PostModel } from '../domain/post-entity';
import { getDBSearchQueries } from '../../../shared/helpers';
import { PostViewModel } from '../api/types';
import { TLikeStatus } from '../../likes/types';
import { BlogModel } from '../../blogs/domain/blog-entity';
import { PostsDBSearchParams } from '../domain/types';

@injectable()
export class PostsQueryRepository {
    constructor(
        @inject(LikesQueryRepository)
        protected likesQueryRepository: LikesQueryRepository
    ) {}

    async getPosts({
        searchQueries,
        userId,
    }: {
        searchQueries: TMappedSearchQueryParams<PostsDBSearchParams['sortBy']>;
        userId: string | null;
    }) {
        const dbSearchQueries =
            getDBSearchQueries<PostsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await PostModel.countDocuments({});
        const foundPosts = await PostModel.find({})
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit);
        const postsIds: string[] = [];
        const mappedFoundPosts: PostViewModel[] = foundPosts.map((post) => {
            postsIds.push(post.id);
            return {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.likesCount,
                    dislikesCount: post.dislikesCount,
                    myStatus: 'None',
                    newestLikes: [],
                },
            };
        });
        if (userId) {
            const likesForPosts = await this.likesQueryRepository.getLikesArray(
                postsIds,
                userId
            );
            mappedFoundPosts.forEach((post) => {
                const like = likesForPosts.find(
                    (like) => like.parentId === post.id
                );
                post.extendedLikesInfo.myStatus = like?.status ?? 'None';
            });
        }
        for (const post of mappedFoundPosts) {
            post.extendedLikesInfo.newestLikes =
                await this.likesQueryRepository.getLastThreeLikes(post.id);
        }
        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: mappedFoundPosts,
        };
    }

    async getPost(id: string, userId: string | null) {
        const foundPost = await PostModel.findById(id);
        if (!foundPost) return undefined;
        let likeStatus: TLikeStatus = 'None';
        if (userId) {
            likeStatus = await this.likesQueryRepository.getLikeStatus(
                id,
                userId
            );
        }
        const newestLikes =
            await this.likesQueryRepository.getLastThreeLikes(id);
        const mappedPost: PostViewModel = {
            id: foundPost.id,
            title: foundPost.title,
            shortDescription: foundPost.shortDescription,
            content: foundPost.content,
            blogId: foundPost.blogId,
            blogName: foundPost.blogName,
            createdAt: foundPost.createdAt,
            extendedLikesInfo: {
                likesCount: foundPost.likesCount,
                dislikesCount: foundPost.dislikesCount,
                myStatus: likeStatus,
                newestLikes,
            },
        };
        return mappedPost;
    }

    async getBlogPosts({
        searchQueries,
        blogId,
        userId,
    }: {
        searchQueries: TMappedSearchQueryParams<PostsDBSearchParams['sortBy']>;
        blogId: string;
        userId: string | null;
    }) {
        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            return;
        }
        const dbSearchQueries =
            getDBSearchQueries<PostsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await PostModel.countDocuments({ blogId });
        const foundPosts = await PostModel.find({ blogId })
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit);
        const postsIds: string[] = [];
        const mappedFoundPosts: PostViewModel[] = foundPosts.map((post) => {
            postsIds.push(post.id);
            return {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.likesCount,
                    dislikesCount: post.dislikesCount,
                    myStatus: 'None',
                    newestLikes: [],
                },
            };
        });
        if (userId) {
            const likesForPosts = await this.likesQueryRepository.getLikesArray(
                postsIds,
                userId
            );
            mappedFoundPosts.forEach((post) => {
                const like = likesForPosts.find(
                    (like) => like.parentId === post.id
                );
                post.extendedLikesInfo.myStatus = like?.status ?? 'None';
            });
        }
        for (const post of mappedFoundPosts) {
            post.extendedLikesInfo.newestLikes =
                await this.likesQueryRepository.getLastThreeLikes(post.id);
        }
        return {
            pagesCount: Math.ceil(totalCount / searchQueries.pageSize),
            page: searchQueries.pageNumber,
            pageSize: searchQueries.pageSize,
            totalCount,
            items: mappedFoundPosts,
        };
    }
}
