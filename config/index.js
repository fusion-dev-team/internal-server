const { mergeDeep } = require('../utils');

const env = process.env.NODE_ENV || 'development';
let localConfig;
try {
  // eslint-disable-next-line global-require
  localConfig = require('./config.json');
} catch (err) {
  console.error('Local config not found', err);
}

let config = {
  development: {
    username: 'alexey',
    password: 'alexey',
    database: 'fusion_site',
    host: '127.0.0.1',
    dialect: 'postgres',
    slack: {
      conversationId: '',
      slackToken: '',
      slackTokenCRM: '',
      codeReviewChannelId: '',
      codeReviewTeamChannelId: '',
      CRMChannelId: '',
      generalId: '',
      learningChannelId: '',
      slackMessages: {
        newAnnouncement: [],
      },
    },
    common: {
      jwtSecret: 'secret',
      expiresIn: 10080,
      url: 'http://localhost:6800',
      siteAddress: 'http://localhost:3000',
      crmAddress: 'https://crm.fusion-team.com',
      hashType: 'md5',
      hashKey: 'fusion',
      port: '6800',
      maxSizeImage: 3100000,
      qualityImage: 70,
      quantityPicture: 5,
    },
    mail: {
      serviceEmail: 'fusion.team.llc@gmail.com',
      servicePassword: '',
      service: 'gmail',
    },
    externalAPI: {
      linkpreviewUrl: 'http://api.linkpreview.net/',
      linkpreviewApiKey: '',
      vapidPrivateKey: '',
      vapidPublicKey: '',
      vapidMail: 'dev@fusion-team.com',
    },
  },
};

if (localConfig) {
  config = mergeDeep(config, localConfig);
}
module.exports = config[env];
