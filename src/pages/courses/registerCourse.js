/* Ionic imports */
import { IonButton, IonContent, IonLabel, IonItem, IonModal, IonInput, IonText, IonSelect, IonSelectOption, IonAlert, IonSearchbar, IonToolbar, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCheckbox } from '@ionic/react';

import React, { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';

/* Custom components */
import Router from 'next/router';
import { database } from 'firebase';

import useSWR from 'swr';
// import { Suspense } from 'react';

import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';


//= ======================================
// TODOS:
// - fetch User Data from Database
// - adapt: send data to api accordingly
// - remove console logs
// - refactoring
//   - modals into component
// - comments
//= ======================================

const users = [{
  id: '1',
  firstname: 'u1',
  lastname: 'ModuleCoordinator',
  email: 'yannick@yannick.de',
}, {
  id: '2',
  firstname: 'Teacher',
  lastname: 'nach_u2',
  email: 'yannick@yannick.de',
}, {
  id: '3',
  firstname: 'Student',
  lastname: 'nach_u3',
  email: 'yannick@yannick.de',
}, {
  id: '4',
  firstname: 'u4',
  lastname: 'Teacher',
  email: 'yannick@yannick.de',
}, {
  id: '5',
  firstname: 'Student',
  lastname: 'nach_u5',
  email: 'yannick@yannick.de',
}];


let selectedUsers = [];

/**
 * @param u the user that should be updated if it exists and insterted
 *  if it does not exist in the aray 'selectedUsers'
 */
function upsertSelectedUsers(u) {
  // check if the User exists in the selectedUser Array.
  const foundId = selectedUsers.findIndex(({ id }) => id === u.id);
  if (foundId !== -1) {
    // update user, if it already exists
    console.log('the user has already been selected -> update');
    selectedUsers[foundId] = u;
  } else {
    // insert user if it does not exist
    console.log('the user has not been selected -> insert');
    selectedUsers.push(u);
  }
}

export default () => {
  const [searchTermModuleCoordinator, setSearchTermModuleCoordinator] = useState('');
  const [searchTermLecturer, setSearchTermLecturer] = useState('');
  const [searchTermStudent, setSearchTermStudent] = useState('');

  const roleStringModuleCoordintator = 'moduleCoordinator';
  const roleStringLecturer = 'lecturer';
  const roleStringStudent = 'student';

  const onCheck = (e, u, f, r) => {
    // console.log('2.', users);
    const checkboxState = e.detail.checked;
    console.log('for user id = ', u.id, ' selected as: ', r);
    f(e.detail.checked);
    switch (r) {
      case roleStringModuleCoordintator:
        users.find((x) => x.id === u.id).selectedModuleCoordinator = checkboxState;
        break;
      case roleStringLecturer:
        users.find((x) => x.id === u.id).selectedLecturer = checkboxState;
        break;
      case roleStringStudent:
        console.log("set as 'selected student' as: ", checkboxState);
        users.find((x) => x.id === u.id).selectedStudent = checkboxState;
        break;
      default:
        console.log('invalid role string');
    }
    // determine wheter we should add the selected user to the selctedUsers variable which will
    // later be sent to the backend. If the user is not selected as any role (=deselection of roles)
    // it will be removed from the array
    if (!u.selectedModuleCoordinator && !u.selectedLecturer && !u.selectedStudent) {
      selectedUsers = selectedUsers.filter((obj) => {
        return obj.id !== u.id;
      });
    } else {
      console.log('add User to selected Users');
      upsertSelectedUsers(u);
    }
    console.log('selected users:', selectedUsers);
    //  console.log('3.', users);
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
        users: selectedUsers,
      };
      const response = await axios.post('../api/courses/registerCourse', { formdata });
      console.log('res: ', response);
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
