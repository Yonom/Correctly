/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonGrid, IonRow, IonSelect, IonDatetime, IonSelectOption, IonIcon, IonSearchbar, IonItemGroup, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

import React, { useState } from 'react';

/* Custom components */
import AppPage from '../../components/AppPage';
import Expandable from '../../components/Expandable';

import styles from './user.module.css';


export default () => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const test = [{
    id: '123',
    name: 'Yannick Aaron',
    email: 'yannick@yannick.de',
  }, {
    id: '1234',
    name: 'Yannick Aaron',
    email: 'yannick@yannick.de',
  }];

  const testEl = test.filter((u) => u.name.startsWith(searchTerm)).map((u) => {
    return (
      <IonItem key={u.id}>
        <Expandable header={u.name} subheader={u.email}>
          <div style={{ width: '100%' }}>
            <IonLabel position="stacked">
              Name

              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonInput required type="text" />
          </div>

          <div>
            <IonLabel position="stacked">
              Vorname
              {' '}
              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonInput required type="text" />
          </div>

          <div>
            <IonLabel position="stacked">
              Matrikelnummer
              {' '}
              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonInput required type="text" />
          </div>

          <div>
            <IonLabel position="stacked">
              E-Mail
              {' '}
              <IonText color="danger">*</IonText>
            </IonLabel>
            <IonInput required type="text" />
          </div>
          <div className={styles.userFooter}>
            <IonButton color="danger">Nutzer löschen</IonButton>
          </div>
        </Expandable>
      </IonItem>
    );
  });

  return (
    <AppPage title="User-Interface (Superuser)" footer="Correctly">
      <IonHeader translucent>
        <IonToolbar>
          <IonSearchbar placeholder="Filter nach Name" value={searchTerm} onIonChange={handleChange} />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          {testEl}
        </IonList>
      </IonContent>
    </AppPage>
  );
};
