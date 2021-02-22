import { Resolver, Query, Args, ObjectType, Field, Int } from '@nestjs/graphql';
import { TwitterService } from 'src/twitter/twitter.service';

@ObjectType()
export class PremiumSearchTweetsDto {
  @Field(() => String)
  id: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  userName: string;

  @Field(() => String)
  userScreenName: string;

  @Field(() => String)
  userImgUrl: string;

  @Field(() => String)
  text: string;

  @Field(() => [String], { nullable: true })
  hashtags: string[];

  @Field(() => [String], { nullable: true })
  mentions: string[];

  @Field(() => [String], { nullable: true })
  imageUrls: string[];

  @Field(() => Int, { nullable: true })
  replyCount: number;

  @Field(() => Int, { nullable: true })
  retweetCount: number;

  @Field(() => Int, { nullable: true })
  favouriteCount: number;
}
@Resolver()
export class TwitterResolver {
  constructor(private twitterService: TwitterService) {}

  // Query that fetches premium search tweets.
  @Query(() => [PremiumSearchTweetsDto])
  async premiumSearchTweets(
    @Args('query', { type: () => String }) query: string,
  ): Promise<PremiumSearchTweetsDto[]> {
    return this.twitterService.premiumSearchTweets(query);
  }
}
