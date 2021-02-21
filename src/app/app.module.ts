import { Module } from '@nestjs/common';
import { AppService } from 'src/app/app.service';
import { ConfigModule } from 'src/config/config.module';
import { GraphQLModule } from 'src/graphql/graphql.module';
import { TwitterModule } from 'src/twitter/twitter.module';

@Module({
  imports: [ConfigModule, GraphQLModule, TwitterModule],
  providers: [AppService],
})
export class AppModule {}
