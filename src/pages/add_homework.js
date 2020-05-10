/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonList, IonInput, IonText, IonSelect, IonDatetime, IonSelectOption, IonIcon } from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';
import { cloudUploadOutline } from 'ionicons/icons';

/* Custom components */
import AppPage from '../components/AppPage';
import IonController from '../components/IonController';
import IonCenterContent from '../components/IonCenterContent';

export default () => {
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    //
  };

  return (
    <AppPage title="Hausaufgaben Upload" footer="Correctly">
      <IonContent>
        <IonCenterContent innerStyle={{ padding: '10%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonList lines="full">
              <IonItem>
                <IonLabel position="stacked">Hausaufgaben Datei-Upload<IonText color="danger">*</IonText></IonLabel>
                <IonController type="file" as={IonInput} control={control} name="password" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Musterlösung Datei-Upload<IonText color="danger">*</IonText></IonLabel>
                <IonController type="file" as={IonInput} control={control} name="password_confirm" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Bewertung Datei-Upload<IonText color="danger">*</IonText></IonLabel>
                <IonController type="file" as={IonInput} control={control} name="password_confirm" />
              </IonItem>

              <IonItem>
                <IonText position="stacked">Auswahl der Kurse<IonText color="danger">*</IonText></IonText>
                <IonSelect value="hi" okText="Okay" cancelText="Dismiss">
                  <IonSelectOption value="brown">Brown</IonSelectOption>
                  <IonSelectOption value="blonde">Blonde</IonSelectOption>
                  <IonSelectOption value="black">Black</IonSelectOption>
                  <IonSelectOption value="red">Red</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonText position="stacked">Auswahl der Lehrenden<IonText color="danger">*</IonText></IonText>
                <IonSelect value="hi" okText="Okay" cancelText="Dismiss">
                  <IonSelectOption value="brown">Brown</IonSelectOption>
                  <IonSelectOption value="blonde">Blonde</IonSelectOption>
                  <IonSelectOption value="black">Black</IonSelectOption>
                  <IonSelectOption value="red">Red</IonSelectOption>
                </IonSelect>
              </IonItem>


              <IonItem>
                <IonText position="stacked">Bearbeitungs-Zeitraum<IonText color="danger">*</IonText></IonText>
                <IonText />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Start Datum<IonText color="danger">*</IonText></IonLabel>
                <IonDatetime control={control} name="password_confirm" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Start Zeit<IonText color="danger">*</IonText></IonLabel>
                <IonDatetime displayFormat="hh:mm A" control={control} name="password_confirm" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">End Datum<IonText color="danger">*</IonText></IonLabel>
                <IonDatetime control={control} name="password_confirm" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">End Zeit<IonText color="danger">*</IonText></IonLabel>
                <IonDatetime displayFormat="hh:mm A" control={control} name="password_confirm" />
              </IonItem>


              <IonItem>
                <IonText position="stacked">Korrektur-Zeitraum<IonText color="danger">*</IonText></IonText>
                <IonText />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Start Datum<IonText color="danger">*</IonText></IonLabel>
                <IonDatetime control={control} name="password_confirm" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Start Zeit<IonText color="danger">*</IonText></IonLabel>
                <IonDatetime displayFormat="hh:mm A" control={control} name="password_confirm" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">End Datum<IonText color="danger">*</IonText></IonLabel>
                <IonDatetime control={control} name="password_confirm" />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">End Zeit<IonText color="danger">*</IonText></IonLabel>
                <IonDatetime displayFormat="hh:mm A" control={control} name="password_confirm" />
              </IonItem>


              <IonItem>
                <IonText position="stacked">Zulässige Dateiformate<IonText color="danger">*</IonText></IonText>
                <IonSelect multiple="true" value="hi" okText="Okay" cancelText="Dismiss">
                  <IonSelectOption value="brown">.pdf</IonSelectOption>
                  <IonSelectOption value="blonde">.py</IonSelectOption>
                  <IonSelectOption value="black">.jpeg</IonSelectOption>
                  <IonSelectOption value="red">.docx</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonText position="stacked">Auswahl des Korrekturformats<IonText color="danger">*</IonText></IonText>
                <IonSelect value="hi" okText="Okay" cancelText="Dismiss">
                  <IonSelectOption value="brown">Eins</IonSelectOption>
                  <IonSelectOption value="blonde">Zwei</IonSelectOption>
                  <IonSelectOption value="black">Drei</IonSelectOption>
                  <IonSelectOption value="red">Vier</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonText position="stacked">Auswahl der Korrekturen pro Lösung<IonText color="danger">*</IonText></IonText>
                <IonSelect value="hi" okText="Okay" cancelText="Dismiss">
                  <IonSelectOption value="brown">1</IonSelectOption>
                  <IonSelectOption value="blonde">2</IonSelectOption>
                  <IonSelectOption value="black">3</IonSelectOption>
                  <IonSelectOption value="red">3</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonText position="stacked">Anzahl der zu überprüfenden Korrekturen<IonText color="danger">*</IonText></IonText>
                <IonSelect value="hi" okText="Okay" cancelText="Dismiss">
                  <IonSelectOption value="brown">1</IonSelectOption>
                  <IonSelectOption value="blonde">2</IonSelectOption>
                  <IonSelectOption value="black">3</IonSelectOption>
                  <IonSelectOption value="red">4</IonSelectOption>
                </IonSelect>
              </IonItem>


              <IonItem>
                <IonText position="stacked">Kritische Schwelle bei Abweichungen zwischen mehreren Korrekturen zu einer Lösung</IonText>
                <IonSelect value="hi" okText="Okay" cancelText="Dismiss">
                  <IonSelectOption value="brown">10%</IonSelectOption>
                  <IonSelectOption value="blonde">20%</IonSelectOption>
                  <IonSelectOption value="black">30%</IonSelectOption>
                  <IonSelectOption value="red">40%</IonSelectOption>
                </IonSelect>
              </IonItem>

            </IonList>


            <div className="ion-padding">
              <IonButton type="submit" expand="block" class="ion-no-margin"><IonIcon icon={cloudUploadOutline} />Hochladen</IonButton>
            </div>
          </form>
        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
