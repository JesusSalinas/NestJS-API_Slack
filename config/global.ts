import { registerAs } from '@nestjs/config';

export default registerAs('global', () => ({
  api_git: process.env.API_GIT,
  api_git_token: process.env.API_GIT_TOKEN,
  api_slack: process.env.API_SLACK,
  api_slack_token: process.env.API_SLACK_TOKEN,
  port: process.env.PORT || 4000,
}));
