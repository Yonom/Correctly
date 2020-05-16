/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonSelect, IonDatetime, IonSelectOption, IonIcon, IonSearchbar, IonItemGroup, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';
import { cloudUploadOutline } from 'ionicons/icons';

/* Custom components */
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

export default () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    //
  };

  return (
    <AppPage title="User-Interface (Superuser" footer="Correctly">
      <IonHeader>
        <IonToolbar>
          <h2>Nuzerdaten ändern</h2>
          <IonSearchbar value="test" />
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <ion-item>Amsterdam</ion-item>
          <ion-item>Bogota</ion-item>
          <ion-item>Buenos Aires</ion-item>
          <ion-item>Cairo</ion-item>
          <ion-item>Dhaka</ion-item>
          <ion-item>Edinburgh</ion-item>
          <ion-item>Geneva</ion-item>
          <ion-item>Genoa</ion-item>
          <ion-item>Glasgow</ion-item>
          <ion-item>Hanoi</ion-item>
          <ion-item>Hong Kong</ion-item>
          <ion-item>Islamabad</ion-item>
          <ion-item>Istanbul</ion-item>
          <ion-item>Jakarta</ion-item>
          <ion-item>Kiel</ion-item>
          <ion-item>Kyoto</ion-item>
          <ion-item>Le Havre</ion-item>
          <ion-item>Lebanon</ion-item>
          <ion-item>Lhasa</ion-item>
          <ion-item>Lima</ion-item>
          <ion-item>London</ion-item>
          <ion-item>Los Angeles</ion-item>
          <ion-item>Madrid</ion-item>
          <ion-item>Manila</ion-item>
          <ion-item>New York</ion-item>
          <ion-item>Olympia</ion-item>
          <ion-item>Oslo</ion-item>
          <ion-item>Panama City</ion-item>
          <ion-item>Peking</ion-item>
          <ion-item>Philadelphia</ion-item>
          <ion-item>San Francisco</ion-item>
          <ion-item>Seoul</ion-item>
          <ion-item>Taipeh</ion-item>
          <ion-item>Tel Aviv</ion-item>
          <ion-item>Tokio</ion-item>
          <ion-item>Uelzen</ion-item>
          <ion-item>Washington</ion-item>
        </IonList>
      </IonContent>
    </AppPage>
  );
};
