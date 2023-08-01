import { PostsService } from '@app/posts';
import { Module } from '@nestjs/common';
import { SubscriptionsResolver } from './subscriptions.resolver';

@Module({
  controllers: [],
  providers: [PostsService, SubscriptionsResolver],
})
export class SubscriptionsModule {}
