import { PostsService } from '@app/posts';
import { Module } from '@nestjs/common';
import { PostsResolver } from './posts.resolver';
import { UsersService } from '@app/users';
import { CategoriesService } from '@app/categories';

@Module({
  imports: [],
  providers: [PostsService, PostsResolver, UsersService, CategoriesService],
  exports: [PostsService],
})
export class PostsModule {}
