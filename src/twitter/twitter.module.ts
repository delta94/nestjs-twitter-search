import { Module } from '@nestjs/common';
import { TwitterService } from 'src/twitter/twitter.service';
import { TwitterResolver } from 'src/twitter/twitter.resolver';

@Module({
  providers: [TwitterResolver, TwitterService],
  exports: [TwitterService],
})
export class TwitterModule {}
