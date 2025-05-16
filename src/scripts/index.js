// CSS imports
import '../styles/styles.css';

import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      await app.renderPage();
    });
  } else {
    await app.renderPage();
  }

  window.addEventListener('hashchange', async () => {
  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      await app.renderPage();
    });
  } else {
    await app.renderPage();
  }
});
});
