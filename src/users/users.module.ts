import { PostsService } from '@app/posts';
import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from '@app/users';

@Module({
  imports: [],
  providers: [UsersService, PostsService, UsersResolver],
  exports: [],
})
export class UsersModule {}
