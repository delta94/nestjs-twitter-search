export interface SearchTweetsArgs {
  searchType: '30day' | 'fullarchive';
  query: string;
  fromDate?: Date;
  endDate?: Date;
  maxResults?: string;
}

export interface SearchTweetsResponse extends GetTweetResponse {}

export interface GetTweetArgs {
  token: string;
  url: string;
  query: string;
}

export interface GetTweetResponse {
  id: string;
  createdAt: string;
  userName: string;
  userScreenName: string;
  userImgUrl: string;
  text: string;
  hashtags: string[];
  mentions: string[];
  imageUrls: string[];
  replyCount: number;
  retweetCount: number;
  favouriteCount: number;
}
