import { PostsService } from '@app/posts';
import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from '@app/users';
import { FriendshipsService } from '@app/friendships';

@Module({
  imports: [],
  providers: [UsersService, PostsService, FriendshipsService, UsersResolver],
  exports: [],
})
export class UsersModule {}
