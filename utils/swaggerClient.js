window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const { ui } = window;
    const authToken = localStorage.getItem('authToken') || null;

    const preAuthorizeButton = document.querySelector('button.authorize');
    preAuthorizeButton.addEventListener('click', () => {
      setTimeout(() => {
        const logoutButton = document.querySelector('button.modal-btn');
        if (logoutButton) {
          logoutButton.addEventListener('click', () => {
            if (authToken) {
              localStorage.removeItem('authToken');
            }
          });
        }

        const authorizeButton = document.querySelector('button[type="submit"]');
        if (authorizeButton) {
          authorizeButton.addEventListener('click', () => {
            const inputValue = authorizeButton.parentNode.parentNode.querySelector('input').value;
            localStorage.setItem('authToken', inputValue);
          });
        }
      }, 100);
    });

    if (authToken) {
      ui.authActions.authorize({
        ApiKeyAuth: {
          name: 'ApiKeyAuth',
          schema: {
            type: 'apiKey',
            in: 'header',
            name: 'authorization',
            description: ''
          },
          value: authToken
        }
      });
    }
  }, 100);
});
