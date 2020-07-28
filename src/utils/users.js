const axios = require('axios').default;
const { getManagementToken } = require('./tokens');

const { AUTH0_DOMAIN } = process.env;

const updateUser = async (userId, given_name, family_name, picture) => (
  axios.patch(`https://${AUTH0_DOMAIN}/api/v2/users/${userId}`,
    { given_name, family_name, picture },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await getManagementToken()}`,
      },
    })
    .then((res) => res)
    .catch((e) => {
      throw e;
    })
);

module.exports = {
  updateUser,
};
