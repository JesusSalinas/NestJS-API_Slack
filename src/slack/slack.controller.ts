import { Controller, Post, Body, Req, HttpCode } from '@nestjs/common';
import { SlackService } from './slack.service';

@Controller('client-services')
export class SlackController {
  constructor(private readonly slackService: SlackService) {}

  @Post('/cy-run')
  @HttpCode(200)
  runCypress(
    @Body('trigger_id') trigger_id: string,
    @Body('response_url') response_url: string,
    //@Body('user_id') user_id: string,
    //@Body('channel_id') channel_id: string,
  ) {
    this.slackService
      .triggerCypressOptions(trigger_id, response_url)
      .subscribe((response) => {
        console.log(response);
      });
  }

  @Post('/help')
  @HttpCode(200)
  returnCommandsInfo(@Body('user_id') user_id: string) {
    const msg = this.slackService.listCommandsInfo(user_id);
    return msg;
  }

  @Post('/slack-interactions')
  @HttpCode(200)
  getUserInteraction(@Req() request) {
    const response = this.slackService.handleModal(request.body);
    return response;
  }
}
