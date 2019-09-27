const { WebClient } = require('@slack/client');
const config = require('../../config');
const db = require('../../db/models');

const { Op } = db.Sequelize;

const webClient = new WebClient(config.slackToken);
const webClientCRM = new WebClient(config.slackTokenCRM);

/**
 *
 * @param {*} req
 */
async function updateUserConversationId(req) {
  try {
    const usersList = await webClient.apiCall('users.list');
    let userId = null;
    for (let i = 0; i < usersList.members.length; i += 1) {
      const member = usersList.members[i];
      if (member.profile && member.profile.display_name === req.body.slack_name) {
        userId = member.id;
        break;
      }
    }

    return await updateUser(userId, req.userData.login, req.body.slack_name);
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

/**
 *
 */
async function updateAllUsersConversationId() {
  const options = {
    where: {
      slack_name: { [Op.ne]: null }
    },
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt']
    }
  };

  try {
    const allUserInDb = await db.user.findAll(options);

    if (!allUserInDb.length) {
      throw new Error('No users found with slack_name');
    }

    const usersList = await webClient.apiCall('users.list');

    for (const user of allUserInDb) {
      let userId = null;

      for (let i = 0; i < usersList.members.length; i += i) {
        const member = usersList.members[i];
        if (member.profile && member.profile.display_name === user.slack_name) {
          userId = member.id;
          break;
        }
      }

      await updateUser(userId, user.login, user.slack_name);
    }
  } catch (error) {
    console.error(error.message);
    return false;
  }
  return true;
}

/**
 *
 * @param {*} userId
 * @param {*} login
 * @param {*} slack_name
 */
async function updateUser(userId, login, slack_name) {
  try {
    if (userId === null) {
      throw new Error(`There are no user "${slack_name}" in our workspace`);
    } else {
      const result = await webClient.apiCall('im.open', { user: userId });
      const resultForCrm = await webClientCRM.apiCall('im.open', {
        user: userId
      });

      if (result && result.ok && resultForCrm && resultForCrm.ok) {
        const slack_conversational_id = result.channel.id;
        const slack_conversational_crm_id = resultForCrm.channel.id;

        await db.user.update(
          {
            slack_conversational_id,
            slack_conversational_crm_id
          },
          {
            where: { login }
          }
        );
        console.log(
          `The slack_conversational for ${userId} ${slack_name} was updated: ${slack_conversational_id} ${slack_conversational_crm_id}`
        );
        return true;
      }
      throw new Error(`Can't load conversationalId for Id: ${userId}`);
    }
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

module.exports = {
  updateUserConversationId,
  updateAllUsersConversationId
};
