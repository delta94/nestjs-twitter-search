import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import btoa from 'btoa';
import fetch from 'node-fetch';
import {
  GetTweetArgs,
  GetTweetResponse,
  SearchTweetsResponse,
} from './interfaces';

@Injectable()
export class TwitterService {
  private TWITTER_API_KEY: string;
  private TWITTER_API_SECRET: string;
  private TWITTER_SEARCH_LABEL: string;
  private TWITTER_SEARCH_TYPE = '30day'; // 30day or fullarchive
  private TWITTER_SEARCH_URL = 'https://api.twitter.com/1.1/tweets/search';
  private TWITTER_AUTH_URL = 'https://api.twitter.com/oauth2/token'; //url for fetching a twitter bearer token

  constructor(private configService: ConfigService) {
    this.TWITTER_API_KEY = this.configService.get('TWITTER_API_KEY');
    this.TWITTER_API_SECRET = this.configService.get('TWITTER_API_SECRET');
    this.TWITTER_SEARCH_LABEL = this.configService.get('TWITTER_SEARCH_LABEL');
  }

  /**
   * Function for implementing twitter premium search (30day or archive).  Loops on the 'next' page result
   * for searches that return more than maxResults
   */
  premiumSearchTweets = async (
    query: string,
  ): Promise<SearchTweetsResponse[]> => {
    let ts = new Date();
    const url = `${this.TWITTER_SEARCH_URL}/${this.TWITTER_SEARCH_TYPE}/${this.TWITTER_SEARCH_LABEL}`;

    try {
      const token = await this.getTwitterToken(this.TWITTER_AUTH_URL);

      return await this.getTweets({
        token,
        url,
        query,
      });
    } catch (err) {
      ts = new Date();
      let msg = `${ts.toISOString()} search - url: ${url}, query:${query} - ${err}`;
      console.error(msg);
      throw err;
    }
  };

  /**
   * Function that implements a REST call to the Twitter premium search API
   */
  getTweets = async ({
    token,
    url,
    query,
  }: GetTweetArgs): Promise<GetTweetResponse[]> => {
    let ts = new Date();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const { results } = json;
        const fileName = `./twitter-${query.split(' ').join('-')}.json`;
        console.log(results.length);

        fs.writeFile(fileName, JSON.stringify(results), (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Succcess writing data to ${fileName}`);
          }
        });

        const mappedData =
          results?.length &&
          results.map((ele: any) => {
            return {
              id: ele?.id,
              createdAt: ele?.created_at,
              userName: ele?.user?.name,
              userScreenName: ele?.user?.screen_name,
              userImgUrl:
                ele?.user?.profile_image_url ||
                ele?.user?.profile_image_url_https,
              text: ele?.text,
              hashtags: ele?.entities?.hashtags?.length
                ? ele?.entities?.hashtags.map((ele: any) => ele?.text)
                : [],
              mentions: ele?.entities?.user_mentions?.length
                ? ele?.entities?.user_mentions.map(
                    (ele: any) => ele?.screen_name,
                  )
                : [],
              imageUrls: ele?.entities?.media?.length
                ? ele?.entities?.media.map(
                    (ele: any) => ele?.media_url || ele?.media_url_https,
                  )
                : [],
              replyCount: ele?.reply_count,
              retweetCount: ele?.retweet_count,
              favouriteCount: ele?.favorite_count,
            };
          });

        return mappedData;
      } else {
        let msg = `authorization request response status: ${response.status}`;
        throw new Error(msg);
      }
    } catch (err) {
      ts = new Date();
      let msg = `${ts.toISOString()} getTweetBatch - query:${query} - ${err}`;
      console.error(msg);
      throw err;
    }
  };

  /**
   * Fetches an app-only bearer token via Twitter's oauth2 interface
   */
  getTwitterToken = async (url: string): Promise<string> => {
    let ts = new Date();
    try {
      const consumerToken = btoa(
        this.urlEncode(this.TWITTER_API_KEY) +
          ':' +
          this.urlEncode(this.TWITTER_API_SECRET),
      );

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + consumerToken,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: 'grant_type=client_credentials',
      });

      if (response.ok) {
        const json = await response.json();
        return json.access_token;
      } else {
        let msg = `response status: ${response.status}`;
        throw new Error(msg);
      }
    } catch (err) {
      ts = new Date();
      let msg = `${ts.toISOString()} getTwitterToken - url:${url} - ${err}`;
      console.error(msg);
      throw err;
    }
  };

  /**
   * Function for adding delay to Twitter api calls.  Implements a timer to pause execution via promisified call to setTimeout
   */
  rateLimiter = async (sec: number): Promise<void> => {
    let ts = new Date();
    console.debug(`${ts.toISOString()} rateLimiter - sec:${sec}`);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, sec * 1000);
    });
  };

  /**
   * Function I found on stackoverflow for providing url encoding
   */
  urlEncode = (str: string): string => {
    return encodeURIComponent(str)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A');
  };
}
