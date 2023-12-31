import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../models/users.model';
import { Post } from '../models/post.model';
import { UsersService } from '@app/users';
import { PostsService } from '@app/posts';
import { NotFoundException } from '@nestjs/common';
import { GetUserArgs } from './dto/get-user.args';
import { CreateUserInput } from './dto/create-user.input';
import { FriendshipsService } from '@app/friendships';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly friendsService: FriendshipsService,
  ) {}

  @Query(() => [User])
  async users() {
    return await this.usersService.findAll();
  }

  @Query(() => User)
  async user(@Args() args: GetUserArgs) {
    const user = await this.usersService.findOne(args);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  @ResolveField('posts', () => [Post])
  async posts(@Parent() user: User) {
    return await this.postsService.getByAuthorId(user.id);
  }

  @ResolveField('following', () => [User])
  async following(@Parent() user: User) {
    return await this.friendsService.following(user.id);
  }

  @ResolveField('followers', () => [User])
  async followers(@Parent() user: User) {
    return await this.friendsService.followers(user.id);
  }

  @Mutation(() => User)
  async createUser(@Args('createUserData') args: CreateUserInput) {
    return await this.usersService.create(args);
  }
}
