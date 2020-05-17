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

export default () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    //
  };

  return (
    <AppPage title="User-Interface (Superuser)" footer="Correctly">
      <IonHeader translucent>
        <IonToolbar>
          <IonSearchbar value="test" placeholder="Filter nach Name" />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem>
            <IonGrid>
              <IonRow>
                <IonLabel>
                  <div>
                    <h2>Max Hans Mustermann</h2>
                    <h3>max_hans.mustermann@fs-students.de</h3>
                  </div>
                </IonLabel>
              </IonRow>
              <hr />
              <IonRow>
                <IonItem>
                  <IonLabel position="stacked">
                    Name
                    {' '}
                    <IonText color="danger">*</IonText>
                  </IonLabel>
                  <IonInput required type="text" />
                </IonItem>
              </IonRow>
              <IonRow>
                <IonItem>
                  <IonLabel position="stacked">
                    Vorname
                    {' '}
                    <IonText color="danger">*</IonText>
                  </IonLabel>
                  <IonInput required type="text" />
                </IonItem>
              </IonRow>
              <IonRow>
                <IonItem>
                  <IonLabel position="stacked">
                    Matrikelnummer
                    {' '}
                    <IonText color="danger">*</IonText>
                  </IonLabel>
                  <IonInput required type="text" />
                </IonItem>
              </IonRow>
              <IonRow>
                <IonItem>
                  <IonLabel position="stacked">
                    E-Mail
                    {' '}
                    <IonText color="danger">*</IonText>
                  </IonLabel>
                  <IonInput required type="text" />
                </IonItem>
              </IonRow>
            </IonGrid>
          </IonItem>
        </IonList>
      </IonContent>
    </AppPage>
  );
};
