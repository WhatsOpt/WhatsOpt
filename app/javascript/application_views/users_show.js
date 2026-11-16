import { patchJson, refreshFromCurrentPage } from '../utils/dom';

class UserShow {
  constructor(relRoot, userId) {
    this.relRoot = relRoot;
    this.userId = userId;
  }

  start() {
    const { relRoot, userId } = this;
    document.getElementById('reset-api-key').addEventListener('click', async () => {
      const apiKey = document.getElementById('user-api-key').textContent.trim();
      try {
        await patchJson(`${relRoot}/api/v1/users/${userId}/api_key`, apiKey, {});
        await refreshFromCurrentPage('#user-api-key');
      } catch (error) {
        console.error(error);
      }
    });
  }
}

export default UserShow;
