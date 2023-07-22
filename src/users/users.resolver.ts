import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './models/users.model';
import { Post } from '../posts/models/post.model';
import { UsersService } from '@app/users';
import { PostsService } from '@app/posts';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  @Query(() => [User])
  async users() {
    return await this.usersService.findAll();
  }

  @Query(() => User)
  async user(@Args('id', { type: () => String }) id: string) {
    const user = await this.usersService.getById(id);

    if (!user) {
      throw new NotFoundException(id);
    }

    return user;
  }

  @ResolveField('posts', () => [Post])
  async posts(@Parent() user: User) {
    return await this.postsService.getByAuthorId(user.id);
  }

  @Mutation(() => User)
  async createUser(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'username', type: () => String }) username: string,
  ) {
    return await this.usersService.create({
      email,
      username,
    });
  }
}
