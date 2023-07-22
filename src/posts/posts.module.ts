import { PostsService } from '@app/posts';
import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';
import { UsersService } from '@app/users';

@Module({
  imports: [],
  providers: [PostsService, PostsResolver, UsersService],
  exports: [PostsService],
})
export class PostsModule {}
