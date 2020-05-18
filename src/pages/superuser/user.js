/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonGrid, IonRow, IonSelect, IonDatetime, IonSelectOption, IonIcon, IonSearchbar, IonItemGroup, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';
import { cloudUploadOutline } from 'ionicons/icons';

/* Custom components */
import AppPage from '../../components/AppPage';
import Expandable from '../../components/Expandable';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

import styles from './user.module.css';


export default () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    //
  };

  const test = [{
    name: 'Yannick Aaron',
    email: 'yannick@yannick.de',
  }, {
    name: 'Yannick Aaron',
    email: 'yannick@yannick.de',
  }];
  const testEl = test.map((u) => {
    return (<IonItem><Expandable header={u.name} subheader={u.email} /></IonItem>);
  });
  /* const users = getUsersFromServer();
  const usersEl = users.filter((u) => u.name.startsWith(query)).map((u) => {
    return <UserConfig user={u} />;
  }); userEl just place */

  return (
    <AppPage title="User-Interface (Superuser)" footer="Correctly">
      <IonHeader translucent>
        <IonToolbar>
          <IonSearchbar placeholder="Filter nach Name" />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <Expandable header="Yannick Aaron Lehr" subheader="yannick_aaron.lehr@fs-students.de">

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

            </Expandable>
          </IonItem>
          {testEl}
        </IonList>
      </IonContent>
    </AppPage>
  );
};
