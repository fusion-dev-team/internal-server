const _get = require('lodash/get');
const { WebClient } = require('@slack/client');
const config = require('../../config');
const logger = require('../logger');

/**
 * RTM instance for sending emails to slack
 */
class Rtm {
  constructor(token, botname = 'Fusion Dev Bot') {
    this.botname = botname;

    try {
      this.webClient = new WebClient(token);
      console.log(`Slack is running as ${this.botname}`);
    } catch (err) {
      logger.error({
        text: `Slack bot ${this.name} constructor error: ${err.message}`,
        routeName: 'slack bot'
      });
      this.bot = null;
      this.webClient = null;
    }
  }

  async sendToChat(data) {
    const params = {
      type: 'message',
      as_user: false,
      username: this.botname,
      icon_url: config.siteAddress + config.slackBotIconPath,
      ...data
    };
    if (this.webClient) {
      try {
        const result = await this.webClient.chat.postMessage(params);
        return result;
      } catch (err) {
        console.log(`${this.botname}:channel ${data.channel} sendToChat error ${err.message}`);
        return null;
      }
    }
  }
}

/**
 * Create slack message prefixes, titles and etc
 */
class SlackMessageGenerator {
  static get announcementVariants() {
    return [
      ':mega: Оп-па! Да у нас новое объявление! :conga-parrot:',
      ':male-pilot::skin-tone-2: Ребята, у нас труп! Возможно криминал :gun:',
      ':man-shrugging::skin-tone-2: Никогда такого не было и вот опять :man-facepalming::skin-tone-2:',
      ':crossed_fingers::skin-tone-2: Ну, надеюсь, что хоть это корпоратив... :fiesta_parrot:',
      ..._get(config, 'slackMessages.newAnnouncement', [])
    ];
  }

  static getRandomIndex(max = 0) {
    return Math.floor(Math.random() * max);
  }

  static getRandomItem(arr = []) {
    return arr[SlackMessageGenerator.getRandomIndex(arr.length)];
  }

  static get newAnnouncement() {
    return SlackMessageGenerator.getRandomItem(SlackMessageGenerator.announcementVariants);
  }
}

const rtm = new Rtm(config.slackToken, config.slackbot_username);
module.exports = {
  rtm,
  SlackMessageGenerator
};
