import { PostsModel, PostsDBSearchParams } from '../model';
import { TMappedSearchQueryParams } from '../../../shared/types';
import { getDBSearchQueries } from '../../../shared/helpers';
import { BlogsModel } from '../../../features/blogs/model';
import { PostViewModel } from '../types';
import { TLikeStatus } from '../../likes/types';
import { LikesQueryRepository } from '../../likes/repository';

export class PostsQueryRepository {
    constructor(private readonly likesQueryRepository: LikesQueryRepository) {}

    async getPosts({
        searchQueries,
        userId,
    }: {
        searchQueries: TMappedSearchQueryParams<PostsDBSearchParams['sortBy']>;
        userId: string | null;
    }) {
        const dbSearchQueries =
            getDBSearchQueries<PostsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await PostsModel.countDocuments({});
        const foundPosts = await PostsModel.find({})
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit);
        const mappedFoundPosts: PostViewModel[] = foundPosts.map((post) => {
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
            for (const post of mappedFoundPosts) {
                post.extendedLikesInfo.myStatus =
                    await this.likesQueryRepository.getLikeStatus(
                        post.id,
                        userId
                    );
            }
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
        const foundPost = await PostsModel.findById(id);
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
        const blog = await BlogsModel.findById(blogId);
        if (!blog) {
            return;
        }
        const dbSearchQueries =
            getDBSearchQueries<PostsDBSearchParams['sortBy']>(searchQueries);
        const totalCount = await PostsModel.countDocuments({ blogId });
        const foundPosts = await PostsModel.find({ blogId })
            .sort({ [dbSearchQueries.sortBy]: dbSearchQueries.sortDirection })
            .skip(dbSearchQueries.skip)
            .limit(dbSearchQueries.limit);
        const mappedFoundPosts: PostViewModel[] = foundPosts.map((post) => {
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
            for (const post of mappedFoundPosts) {
                post.extendedLikesInfo.myStatus =
                    await this.likesQueryRepository.getLikeStatus(
                        post.id,
                        userId
                    );
            }
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
