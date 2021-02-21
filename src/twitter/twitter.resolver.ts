import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { TwitterService } from 'src/twitter/twitter.service';

@Resolver()
export class TwitterResolver {
  constructor(private twitterService: TwitterService) {}

  @Query(() => String)
  async searchTweets(
    @Args('search', { type: () => String }) search: string,
  ): Promise<string> {
    const tweets = this.twitterService.search(search);

    return 'ok';
  }
}
