import { IonCardContent, IonItem, IonLabel } from '@ionic/react';
import AppPage from '../../components/AppPage';
import IonCenterContent from '../../components/IonCenterContent';

const impressum = () => {
  return (
    <AppPage title="Impressum" footer="Correctly">
      <IonCenterContent>
        <IonCardContent>

          <IonItem>
            <IonLabel>
              <b>Simon Farshid</b>
              <p>Friedberger Landstraße 297</p>
              <p>60389 Frankfurt</p>
              <p>E-Mail- Adresse: simon.farshid@fs-students.de</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <b>Online-Streitbeilegung</b>
              <p>
                Die Europäische Kommission stellt unterhttp://ec.europa.eu/consumers/odr/ eine Plattform zuraußergerichtlichen Online-Streitbeilegung (sog. OS-Plattform) bereit. Wir weisen darauf hin, dass wir an einem Streitbeilegungsverfahren vor einer Verbraucherstreitschlichtungsstelle nicht teilnehmen.
              </p>
            </IonLabel>
          </IonItem>

        </IonCardContent>
      </IonCenterContent>
    </AppPage>
  );
};

export default impressum;
