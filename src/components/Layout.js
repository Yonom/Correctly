import React from 'react';

import '../pages/_app';

export default () => {
  const name = 'Benutzername';
  const role = 'Rolle';

  const logoPath = '/img/pics/full.jpg';

  const iconBurger = '/img/icons/Icon_Burger.svg';
  const iconHelp = '/img/icons/Icon_Help.svg';
  const iconHome = '/img/icons/Icon_Home.svg';
  const iconLogout = '/img/icons/Icon_Logout.svg';
  const iconProfile = '/img/icons/Icon_profiledummy.svg';
  const iconSettings = '/img/icons/Icon_Settings.svg';

  const version = 'V. 1.0.0';

  const clg = 'correctly-light-grey';

  return (
    <ion-app>
      <ion-split-pane content-id="main-content">
        <ion-menu content-id="main-content">
          <ion-header>
            <ion-toolbar color={clg}>
              <ion-img src={logoPath} />
            </ion-toolbar>
          </ion-header>

          <ion-content color={clg}>
            <ion-list>
              <ion-list-header color={clg}>
                <ion-icon src={iconBurger} />
              </ion-list-header>
              <ion-menu-toggle auto-hide="false">
                <ion-item button color={clg}>
                  <ion-icon slot="start" name="home" src={iconHome} />
                  <ion-label>
                    Home
                  </ion-label>
                </ion-item>
                <ion-item button color={clg}>
                  <ion-icon slot="start" name="help" src={iconHelp} />
                  <ion-Label>
                    Hilfe
                  </ion-Label>
                </ion-item>
                <ion-item button color={clg}>
                  <ion-icon slot="start" name="settings" src={iconSettings} />
                  <ion-Label>
                    Einstellungen
                  </ion-Label>
                </ion-item>
                <ion-item button color={clg}>
                  <ion-icon slot="start" name="logout" src={iconLogout} />
                  <ion-Label>
                    Abmelden
                  </ion-Label>
                </ion-item>
              </ion-menu-toggle>
            </ion-list>
          </ion-content>
          <ion-footer>
            <ion-label>
              {version}
            </ion-label>
          </ion-footer>
        </ion-menu>

        <ion-page class="ion-page" id="main-content">
          <ion-header color={clg}>
            <ion-toolbar color={clg}>
              <ion-buttons slot="start">
                <ion-menu-toggle>
                  <ion-button>
                    <ion-icon slot="icon-only" name="menu" src={iconBurger} />
                  </ion-button>
                </ion-menu-toggle>
              </ion-buttons>
              <ion-title>Header</ion-title>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <h1>Main Content</h1>
            <p>Click the icon in the top left to toggle the menu.</p>
          </ion-content>
        </ion-page>
      </ion-split-pane>
    </ion-app>
  );
};
