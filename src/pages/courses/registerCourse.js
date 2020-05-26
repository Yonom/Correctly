/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonModal, IonInput, IonText, IonSelect, IonSelectOption, IonAlert, IonSearchbar, IonToolbar, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCheckbox } from '@ionic/react';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';

/* Custom components */
import Router from 'next/router';
import { database } from 'firebase';
import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

import styles from './registerCourse.module.css';

//= ======================================
// TODOS:
// - fetch User Data from Database
// - adapt: send data to api accordingly
// - remove console logs
// - refactoring
//   - modals into component
//   -
// - comments
//= ======================================

const users = [{
  id: '1',
  firstname: 'u1',
  lastname: 'nach_u1',
  email: 'yannick@yannick.de',
  selectedModuleCoordinator: undefined,
  selectedLecturer: undefined,
  selectedStudent: undefined,
}, {
  id: '2',
  firstname: 'u2',
  lastname: 'nach_u2',
  email: 'yannick@yannick.de',
  selectedModuleCoordinator: false,
  selectedLecturer: false,
  selectedStudent: false,
}, {
  id: '3',
  firstname: 'u3',
  lastname: 'nach_u3',
  email: 'yannick@yannick.de',
  selectedModuleCoordinator: false,
  selectedLecturer: false,
  selectedStudent: false,
}, {
  id: '4',
  firstname: 'u4',
  lastname: 'nach_u4',
  email: 'yannick@yannick.de',
  selectedModuleCoordinator: false,
  selectedLecturer: false,
  selectedStudent: false,
}, {
  id: '5',
  firstname: 'u5',
  lastname: 'nach_u5',
  email: 'yannick@yannick.de',
  selectedModuleCoordinator: false,
  selectedLecturer: false,
  selectedStudent: false,
}];

export default () => {
  const [searchTermModuleCoordinator, setSearchTermModuleCoordinator] = useState('');
  const [searchTermLecturer, setSearchTermLecturer] = useState('');
  const [searchTermStudent, setSearchTermStudent] = useState('');

  const roleStringModuleCoordintator = 'moduleCoordinator';
  const roleStringLecturer = 'lecturer';
  const roleStringStudent = 'student';

  const onCheck = (e, u, f, r) => {
    console.log('2.', users);
    const checkboxState = e.detail.checked;
    console.log('for user id = ', u.id, ' selected as: ', r);
    users.find((x) => x.id === u.id).selected = checkboxState;
    f(e.detail.checked);
    switch (r) {
      case roleStringModuleCoordintator:
        users.find((x) => x.id === u.id).selectedModuleCoordinator = checkboxState;
        break;
      case roleStringLecturer:
        users.find((x) => x.id === u.id).selectedLecturer = checkboxState;
        break;
      case roleStringStudent:
        console.log("set as 'selected student as: ", checkboxState);
        users.find((x) => x.id === u.id).selectedStudent = checkboxState;
        break;
      default:
        console.log('invalid role string');
    }
    console.log('3.', users);
  };


  const moduleCoordinatorItems = users.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermModuleCoordinator.toLowerCase())).map((u) => {
    // console.log('1.', users);
    const [checked, setChecked] = useState(u.selectedModuleCoordinator);
    // console.log(u.id, ': object.selectedModuleCoordinator=', u.selectedModuleCoordinator, 'checked=', checked);
    return (
      <IonItem key={u.id}>
        <IonLabel>{`${u.firstname} ${u.lastname}`}</IonLabel>
        <IonCheckbox checked={checked} onIonChange={(e) => onCheck(e, u, setChecked, roleStringModuleCoordintator)} />
      </IonItem>
    );
  });

  const lecturersItems = users.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().startsWith(searchTermLecturer.toLowerCase())).map((u) => {
    const [checked, setChecked] = useState(u.selectedLecturer);
    return (
      <div style={{ width: '100%' }}>
        <IonItem key={u.id}>
          <IonLabel>{`${u.firstname} ${u.lastname}`}</IonLabel>
          <IonCheckbox checked={checked} onIonChange={(e) => onCheck(e, u, setChecked, roleStringLecturer)} />
        </IonItem>
      </div>
    );
  });

  const studentsItems = users.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().startsWith(searchTermStudent.toLowerCase())).map((u) => {
    const [checked, setChecked] = useState(u.selectedStudent);
    return (
      <div style={{ width: '100%' }}>
        <IonItem key={u.id}>
          <IonLabel>{`${u.firstname} ${u.lastname}`}</IonLabel>
          <IonCheckbox checked={checked} onIonChange={(e) => onCheck(e, u, setChecked, roleStringStudent)} />
        </IonItem>
      </div>
    );
  });

  const handleChangeModuleCoordinator = (event) => {
    console.log('handleChangeModuleCoordinator');
    setSearchTermModuleCoordinator(event.target.value);
  };

  const handleChangeLecturer = (event) => {
    console.log('handleChangeLecturer');
    setSearchTermLecturer(event.target.value);
  };

  const handleChangeStudent = (event) => {
    console.log('handleChangeStudent');
    setSearchTermStudent(event.target.value);
    console.log(event.target.value);
  };

  const [showModuleCoordinatorModal, setShowModuleCoordinatorModal] = useState(false);
  const [showLecturerModal, setShowLecturerModal] = useState(false);
  const [showStudentModal, setShowStudentsModal] = useState(false);


  const [showAlertFail, setShowAlertFail] = useState(false);

  const doCreateCourse = async (data) => {
    try {
      const formdata = {
        courseTitle: data.courseTitle,
        yearCode: data.yearCode,
      };
      const moduleCoordinator = {
        id: data.moduleCoordinator,
        role: 'module coordinator',
      };
      const lecturer1 = {
        id: data.lecturer1,
        role: 'lecturer',
      };
      const lecturer2 = {
        id: data.lecturer1,
        role: 'lecturer',
      };
      const lecturer3 = {
        id: data.lecturer1,
        role: 'lecturer',
      };
      const user1 = {
        id: 9,
        role: 'student',
      };
      formdata.users = [moduleCoordinator, lecturer1, lecturer2, lecturer3, user1];
      const response = await axios.post('../api/courses/registerCourse', { formdata });
    } catch (ex) {
      setShowAlertFail(true);
    }
  };

  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    doCreateCourse(data);
  };

  const doShowModuleCoordinatorModal = () => {
    // await fill modal with Modal
    setShowModuleCoordinatorModal(true);
    console.log('openModuleCoModal');
  };

  const doShowLecturerModal = () => {
    // await fill modal with Lecture
    setShowLecturerModal(true);
    console.log('openLecturerModal');
  };

  const doShowStudentsModal = () => {
    // await fill modal with sutdents
    setShowStudentsModal(true);
    console.log('openStudentsModal');
  };

  const doCloseModuleCoordinatorModal = () => {
    setShowModuleCoordinatorModal(false);
  };

  const doCloseLecturerModal = () => {
    setShowLecturerModal(false);
  };

  const doCloseStudentsModal = () => {
    setShowStudentsModal(false);
  };

  const doCloseModal = () => {
    setShowModal(false);
  };

  return (
    <AppPage title="Neuen Kurs anlegen" footer="Correctly">
      <IonContent>
        <IonModal isOpen={showModuleCoordinatorModal}>
          <IonSearchbar placeholder="Filter nach Name" value={searchTermModuleCoordinator} onIonChange={handleChangeModuleCoordinator} />
          test_1
          <IonList>
            {moduleCoordinatorItems}
          </IonList>
          <IonButton onClick={() => doCloseModuleCoordinatorModal()}>Close Modal</IonButton>
        </IonModal>
        <IonModal isOpen={showLecturerModal}>
          <IonSearchbar placeholder="Filter nach Name" value={searchTermLecturer} onIonChange={handleChangeLecturer} />
          test_2
          <IonList>
            {lecturersItems}
          </IonList>
          <IonButton onClick={() => doCloseLecturerModal()}>Close Modal</IonButton>
        </IonModal>
        <IonModal isOpen={showStudentModal}>
          <IonSearchbar placeholder="Filter nach Name" value={searchTermStudent} onIonChange={handleChangeStudent} />
          test_3
          <IonList>
            {studentsItems}
          </IonList>
          <IonButton onClick={() => doCloseStudentsModal()}>Close Modal</IonButton>
        </IonModal>
        <IonCenterContent innerStyle={{ padding: '5%' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="ion-padding">
              <IonItem>
                <IonLabel position="floating">
                  Kurstitel eingeben
                  {' '}
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController type="text" as={IonInput} control={control} name="courseTitle" required />
              </IonItem>
              <IonItem>
                <IonLabel position="floating">
                  Jahres-Code eingeben
                  {' '}
                  <IonText color="danger">*</IonText>
                </IonLabel>
                <IonController type="text" expand="block" as={IonInput} control={control} name="yearCode" required />
              </IonItem>
              <IonLabel>Modulkoordinator*in</IonLabel>
              <IonButton expand="block" onClick={() => doShowModuleCoordinatorModal()}>
                Modulkoordinator*in auswählen
              </IonButton>
              <IonLabel position="floating">Lehrende</IonLabel>
              <IonButton expand="block" onClick={() => doShowLecturerModal()}>
                Lehrende auswählen
              </IonButton>
              <IonLabel position="floating">Studierende</IonLabel>
              <IonButton expand="block" onClick={() => doShowStudentsModal()} class="ion-no-margin">
                Studierende auswählen
              </IonButton>
              <IonButton type="submit" expand="block" color="secondary">Kurs anlegen</IonButton>
            </div>
          </form>
          <section className="ion-padding">
            <Link href="/" passHref>
              <IonButton color="medium" size="default" fill="clear" expand="block" class="ion-no-margin">Zurück zum Menü</IonButton>
            </Link>
          </section>
        </IonCenterContent>
      </IonContent>
    </AppPage>
  );
};
