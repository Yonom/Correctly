import AppPage from '../../components/AppPage';

const impressum = () => {
  return (
    <AppPage title="Impressum" footer="Correctly">
      <b>Simon Farshid</b>
      <p>Friedberger Landstraße 297</p>
      <p>60389 Frankfurt</p>
      <p>E-Mail- Adresse: simon.farshid@fs-students.de</p>

      <b>Online-Streitbeilegung</b>
      <p>
        Die Europäische Kommission stellt unterhttp://ec.europa.eu/consumers/odr/ eine Plattform zuraußergerichtlichen Online-Streitbeilegung (sog. OS-Plattform) bereit. Wir weisen darauf hin, dass wir an einem Streitbeilegungsverfahren vor einer Verbraucherstreitschlichtungsstelle nicht teilnehmen.
      </p>
    </AppPage>
  );
};

export default impressum;
