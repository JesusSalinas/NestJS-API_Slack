import { Injectable, HttpException } from '@nestjs/common';
import {
  slack_message,
  slack_section,
  slack_modal,
  slack_input_modal,
  slack_input_option,
} from './slack.model';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, map, catchError } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class SlackService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  listCommandsInfo(user_id: string) {
    const cypress = new slack_section();
    const k6 = new slack_section();
    const help = new slack_section();
    const header = new slack_section();
    const msg = new slack_message();
    header.slack.text.text = `*Hi  <@${user_id}>*  :wave:\n_Below you will find a list of commands that QA Services provide._`;
    msg.slack.blocks.push(header.slack);
    help.slack.text.text =
      ':sos: Command `/help` provides a list of available commands that QA Services Tool set out';
    cypress.slack.text.text =
      ':sos: Command `/cy-run` trigger a modal where you will be able to select the Cypress Automation params';
    msg.slack.attachments[0].blocks.push(help.slack);
    msg.slack.attachments[0].blocks.push(cypress.slack);
    k6.slack.text.text = ':sos: Command `/k6-run` soon available...';
    msg.slack.attachments[0].blocks.push(k6.slack);
    msg.slack.attachments[0].color = '#FFBF00';
    return msg.slack;
  }

  handleModal(body: any) {
    const payload = JSON.parse(body.payload);
    console.log(payload);
    if (payload.view.private_metadata === 'cypress') {
      this.handleCy(payload);
    } else if (payload.view.private_metadata === 'k6') {
      this.handleK6(payload);
    }
    const response = {
      response_action: 'clear',
    };
    return response;
  }

  handleCy(payload: any) {
    const message = new slack_message();
    const text = new slack_section();

    if (payload.type === 'view_submission') {
      message.slack.attachments[0].color = '#A3D10D';
      text.slack.text.text = `Hi <@${payload.user.id}> :wave:\nYour request is *PROCESSING*...`;
      message.slack.attachments[0].blocks.push(text.slack);
    } else if (payload.type === 'view_closed') {
      message.slack.attachments[0].color = '#D13A0D';
      text.slack.text.text = `Hi <@${payload.user.id}> :wave:\nYour request has *FINISHED*.`;
      message.slack.attachments[0].blocks.push(text.slack);
    } else {
      message.slack.attachments[0].color = '#D13A0D';
      text.slack.text.text = 'Apologies. We are facing some troubles.';
      message.slack.attachments[0].blocks.push(text.slack);
    }
    this.triggerCallback(payload.view.callback_id, message.slack).subscribe(
      (response) => {
        console.log(response);
      },
    );
  }

  handleK6(payload: any) {
    console.log('K6 is in progress...');
  }

  triggerCypressOptions(id: string, url: string) {
    const modal = new slack_modal();
    const inputEnv = this.createInputEnvCy();
    const inputCountry = this.createInputCountryCy();
    const inputType = this.createInputTypeCy();
    modal.slack.trigger_id = id;
    modal.slack.view.title.text = 'Cypress Automation Tests';
    modal.slack.view.private_metadata = 'cypress';
    modal.slack.view.callback_id = url;
    modal.slack.view.blocks.push(inputCountry);
    modal.slack.view.blocks.push(inputEnv);
    modal.slack.view.blocks.push(inputType);
    return this.openSlackModal(modal);
  }

  createInputTypeCy() {
    const type = new slack_input_modal();
    const uiOption = new slack_input_option();
    const apiOption = new slack_input_option();
    uiOption.slack.text.text = 'UI';
    uiOption.slack.value = 'ui';
    apiOption.slack.text.text = 'API';
    apiOption.slack.value = 'api';
    type.slack.element.options.push(uiOption.slack);
    type.slack.element.options.push(apiOption.slack);
    type.slack.label.text = 'Please, select the Test to Perform';
    type.slack.element.action_id = 'type-test-input';
    type.slack.block_id = 'type';
    return type.slack;
  }

  createInputEnvCy() {
    const env = new slack_input_modal();
    const stgOption = new slack_input_option();
    const btaOption = new slack_input_option();
    const prdOption = new slack_input_option();
    stgOption.slack.text.text = 'STAGING';
    stgOption.slack.value = 'staging';
    btaOption.slack.text.text = 'BETA';
    btaOption.slack.value = 'beta';
    prdOption.slack.text.text = 'PRODUCTION';
    prdOption.slack.value = 'prod';
    env.slack.element.options.push(stgOption.slack);
    env.slack.element.options.push(btaOption.slack);
    env.slack.element.options.push(prdOption.slack);
    env.slack.label.text = 'Please, select the Environment';
    env.slack.element.action_id = 'environment-input';
    env.slack.block_id = 'env';
    return env.slack;
  }

  createInputCountryCy() {
    const country = new slack_input_modal();
    const brOption = new slack_input_option();
    const mxOption = new slack_input_option();
    //const coOption = new slack_input_option();
    //coOption.slack.text.text = 'COLOMBIA';
    //coOption.slack.value = 'co';
    brOption.slack.text.text = 'BRAZIL';
    brOption.slack.value = 'br';
    mxOption.slack.text.text = 'MEXICO';
    mxOption.slack.value = 'mx';
    country.slack.element.options.push(mxOption.slack);
    country.slack.element.options.push(brOption.slack);
    country.slack.label.text = 'Please, select the Country';
    country.slack.element.action_id = 'country-input';
    country.slack.block_id = 'country';
    return country.slack;
  }

  openSlackModal(modal: slack_modal): Observable<AxiosResponse<any>> {
    const api = this.configService.get<string>('global.api_slack');
    const headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.configService.get<string>(
          'global.api_slack_token',
        )}`,
      }, // params: {}
    };
    return this.httpService
      .post(`${api}/views.open`, modal.slack, headers)
      .pipe(
        map((response) => response.data),
        catchError((error) => {
          throw new HttpException(error.response.data, error.response.status); //throw new HttpException
        }),
      );
  }

  triggerCallback(url: string, msg: any): Observable<AxiosResponse<any>> {
    const headers = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    return this.httpService.post(url, msg, headers).pipe(
      map((response) => response.data),
      catchError((error) => {
        throw new HttpException(error.response.data, error.response.status); //throw new HttpException
      }),
    );
  }
}
