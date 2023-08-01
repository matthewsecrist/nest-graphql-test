import { PostsService } from '@app/posts';
import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Post } from '../models/post.model';
import { Subscription } from '../models/subscriptions.model';

@Resolver(() => Subscription)
export class SubscriptionsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query(() => [Subscription])
  async subscriptions() {
    return [
      {
        id: 1,
        foo: 'asdfasdf',
        posts: await this.postsService.findAll(),
      },
    ];
  }

  @ResolveField('posts', () => [Post])
  async posts() {
    return this.postsService.findAll();
  }
}
