import { IonList, IonSearchbar, IonText, IonSelect, IonSelectOption, IonToolbar, IonButton } from '@ionic/react';
import { useState, useEffect } from 'react';
import AppPage from '../../components/AppPage';
import ManageHomeworksGridItem from '../../components/ManageHomeworksGridItem';
import { useOnErrorAlert } from '../../utils/errors';
import { useMyEditableHomeworks } from '../../services/homeworks';

const ManageHomeworksPage = () => {
  const [homeworks, setHomeworks] = useState([]);

  const [searchObject, setSearchObject] = useState('');
  const handleChangeSearchObject = (event) => {
    setSearchObject(event.target.value);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const handleChangeSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  const { data: homeworkData } = useOnErrorAlert(useMyEditableHomeworks());

  useEffect(() => {
    if (typeof homeworkData !== 'undefined') {
      setHomeworks(homeworkData);
    }
  }, [homeworkData]);

  const filterHomework = (homeworkObject) => {
    if (searchObject === 'all' || !searchObject) {
      const terms = searchTerm.toUpperCase().split(' ');
      const check = (str) => terms.every((term) => str.toUpperCase().includes(term));
      const rObject = homeworkObject.filter((homework) => check(`${homework.homeworkName} ${homework.title} ${homework.yearcode} ${homework.firstName} ${homework.lastName}`));
      return rObject;
    }
    if (searchObject === 'yearcode') {
      const terms = searchTerm.toUpperCase().split(' ');
      const check = (str) => terms.every((term) => str.toUpperCase().includes(term));
      const rObject = homeworkObject.filter((homework) => check(`$ ${homework.yearcode}`));
      return rObject;
    }
    if (searchObject === 'title') {
      const terms = searchTerm.toUpperCase().split(' ');
      const check = (str) => terms.every((term) => str.toUpperCase().includes(term));
      const rObject = homeworkObject.filter((homework) => check(homework.homeworkName));
      return rObject;
    }
    if (searchObject === 'course') {
      const terms = searchTerm.toUpperCase().split(' ');
      const check = (str) => terms.every((term) => str.toUpperCase().includes(term));
      // Ja, die Zuordnung hier und bei "title" ist richtig, auch wenn es widersprüchlich erscheint
      const rObject = homeworkObject.filter((homework) => check(homework.title));
      return rObject;
    }
    if (searchObject === 'creator') {
      const terms = searchTerm.toUpperCase().split(' ');
      const check = (str) => terms.every((term) => str.toUpperCase().includes(term));
      const rObject = homeworkObject.filter((homework) => check(`${homework.firstName} ${homework.lastName}`));
      return rObject;
    }
    return null;
  };

  const filteredHomeworks = filterHomework(homeworks).map((homework) => {
    return (
      <ManageHomeworksGridItem
        key={homework.id}
        homework={homework}
        showEditBtn
        showShowBtn
      />
    );
  });
  return (
    <AppPage title="Manage Homework">
      <IonToolbar style={{ position: 'sticky', top: 0, zIndex: 9999 }}>
        <IonSearchbar placeholder="Search by Title, Course, Yearcode, Creator or specify" value={searchTerm} onIonChange={handleChangeSearchTerm} />
        <IonText slot="end"> Search: </IonText>
        <IonSelect placeholder="All" slot="end" onIonChange={handleChangeSearchObject}>
          <IonSelectOption value="all">All</IonSelectOption>
          <IonSelectOption value="title">Titles</IonSelectOption>
          <IonSelectOption value="course">Courses</IonSelectOption>
          <IonSelectOption value="yearcode">Yearcodes</IonSelectOption>
          <IonSelectOption value="creator">Creator</IonSelectOption>
        </IonSelect>
      </IonToolbar>

      <IonList>
        {filteredHomeworks}
      </IonList>

      <IonToolbar style={{ position: 'sticky', bottom: 0 }}>
        <IonButton style={{ width: '100%' }} href="../../manage/homeworks/add"> Add new Homework</IonButton>
      </IonToolbar>

    </AppPage>
  );
};

export default ManageHomeworksPage;
