import { IonList, IonSearchbar, IonToolbar, IonButton } from '@ionic/react';

import { useState, useEffect } from 'react';
import AppPage from '../../components/AppPage';
import ManageHomeworksGridItem from '../../components/ManageHomeworksGridItem';

import { useOnErrorAlert } from '../../utils/errors';
import { useMyEditableHomeworks } from '../../services/homeworks';

const ManageHomeworksPage = () => {
  const [homeworks, setHomeworks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const { data: homeworkData } = useOnErrorAlert(useMyEditableHomeworks());

  useEffect(() => {
    if (typeof homeworkData !== 'undefined') {
      setHomeworks(homeworkData);
    }
  }, [homeworkData]);

  const filterUser = (userObject) => {
    const terms = searchTerm.toUpperCase().split(' ');
    const check = (str) => terms.every((term) => str.toUpperCase().includes(term));
    const rObject = userObject.filter((homework) => check(`${homework.homeworkName} ${homework.title} ${homework.yearcode} ${homework.firstName} ${homework.lastName}`));
    return rObject;
  };

  const filteredHomeworks = filterUser(homeworks).map((homework) => {
    return (
      <ManageHomeworksGridItem
        key={homework.homeworkId}
        homework={homework}
        showEditBtn
        showShowBtn
      />
    );
  });
  return (
    <AppPage title="Manage Homeworks">
      <IonToolbar style={{ position: 'sticky', top: 0, zIndex: 9999 }}>
        <IonSearchbar placeholder="Search by Title, Course, Yearcode, Lecturer..." value={searchTerm} onIonChange={handleChange} />
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
