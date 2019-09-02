const { RTMClient, WebClient } = require('@slack/client');
const config = require('../../config');
const logger = require('../logger');

class Rtm {
  constructor(token, name = '') {
    this.name = name;

    try {
      this.bot = new RTMClient(token);
      this.webClient = new WebClient(token);
      this.start();
    } catch (err) {
      logger.error({
        text: `Slack bot ${this.name} constructor error: ${err.message}`,
        routeName: 'slack bot'
      });
      this.bot = null;
      this.webClient = null;
    }
  }

  async start() {
    try {
      await this.bot.start();
    } catch (err) {
      console.log(`Slack bot ${this.name} die`, err);
      logger.error({ text: `Slack bot ${this.name} died: ${err.message}`, routeName: 'slack bot' });
    }
  }

  async sendMessage(text, conversationId) {
    if (this.bot) {
      try {
        const result = await this.bot.sendMessage(text, conversationId);
        return result;
      } catch (err) {
        logger.error({
          text: `Bot ${this.name}:id ${conversationId} sendMessage error ${err.message}`,
          routeName: 'slack bot'
        });
        return null;
      }
    }
    return 'wat?';
  }

  async sendToChat(data) {
    if (this.bot) {
      try {
        const result = await this.webClient.chat.postMessage(data);
        return result;
      } catch (err) {
        logger.error({
          text: `Bot ${this.name}:channel ${data.channel} sendToChat error ${err.message}`,
          routeName: 'slack bot'
        });
        return null;
      }
    }
  }
}

const rtm = new Rtm(config.slack.slackToken, 'staff');
const rtmCRM = new Rtm(config.slack.slackTokenCRM, 'CRM');
module.exports = {
  rtm,
  rtmCRM
};
