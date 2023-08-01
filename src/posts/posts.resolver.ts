import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UsersService } from '@app/users';
import { PostsService } from '@app/posts';
import { Post } from '../models/post.model';
import { NotFoundException } from '@nestjs/common';
import { Category } from 'src/models/categories.model';
import { CategoriesService } from '@app/categories';
import { User } from 'src/models/users.model';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Query(() => [Post], { name: 'posts' })
  async posts(
    @Args('authorId', { type: () => String, nullable: true }) authorId?: string,
  ) {
    return await this.postsService.findAll(authorId);
  }

  @Query(() => Post)
  async post(@Args('id', { type: () => String }) id: string) {
    const post = await this.postsService.getById(id);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  @ResolveField('categories', () => [Category])
  async categories(@Parent() post: Post) {
    console.log('fetch categories for post: ', post.id);
    return this.categoriesService.fetchCategoriesByPostId(post.id);
  }

  @ResolveField('author', () => User)
  async author(@Parent() post: Post) {
    return this.usersService.getById(post.authorId);
  }

  @Mutation(() => Post)
  async createPost(
    @Args({ name: 'body', type: () => String }) body: string,
    @Args({ name: 'authorId', type: () => String }) authorId: string,
  ) {
    return await this.postsService.create({
      authorId,
      body,
      published: false,
      votes: 0,
    });
  }
}
