import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TwitterClient } from 'twitter-api-client';

// https://github.com/joeywhelan/twitterSearch/blob/master/twitterSearch.js
/**
 * TODO: create an api that search for full archive in order to filter base on start & end date of the tweets
 */

@Injectable()
export class TwitterService implements OnModuleInit {
  private twitterClient: TwitterClient;
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const TWITTER_API_KEY = this.configService.get('TWITTER_API_KEY');
    const TWITTER_API_SECRET = this.configService.get('TWITTER_API_SECRET');
    const TWITTER_ACCESS_TOKEN = this.configService.get('TWITTER_ACCESS_TOKEN');
    const TWITTER_ACCESS_TOKEN_SCRET = this.configService.get(
      'TWITTER_ACCESS_TOKEN_SCRET',
    );

    const client = new TwitterClient({
      apiKey: TWITTER_API_KEY,
      apiSecret: TWITTER_API_SECRET,
      accessToken: TWITTER_ACCESS_TOKEN,
      accessTokenSecret: TWITTER_ACCESS_TOKEN_SCRET,
    });

    this.twitterClient = client;
  }

  search = async (q: string) => {
    try {
      const response = await this.twitterClient.tweets.search({ q });
      console.log(JSON.stringify(response));
    } catch (error) {
      console.log(error);
    }
  };
}
