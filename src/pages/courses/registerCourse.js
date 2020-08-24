/* Ionic imports */
import { IonButton, IonLabel, IonItem, IonInput, IonText, IonRadio } from '@ionic/react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import useSWR from 'swr';

import fetchPost from '../../utils/fetchPost';

import AppPage from '../../components/AppPage';
import IonController from '../../components/IonController';
import IonCenterContent from '../../components/IonCenterContent';

import { makeToast } from '../../components/GlobalNotifications';
import SearchListModal from '../../components/SearchListModal';
import UserItem from '../../components/UserItem';
import { makeAPIErrorAlert } from '../../utils/errors';

// the array to load all existing users
let users = [];

// the users that are relevant for any role and will be send to the api
let selectedUsers = [];

/**
 * @param {object} u the user that should be updated if it exists and insterted
 *  if it does not exist in the aray 'selectedUsers'
 */
function upsertSelectedUsers(u) {
  // check if the User exists in the selectedUser Array.
  const foundId = selectedUsers.findIndex(({ userid }) => userid === u.userid);
  if (foundId !== -1) {
    // update user, if it already exists
    selectedUsers[foundId] = u;
  } else {
    // insert user if it does not exist
    selectedUsers.push(u);
  }
}

/**
 * @param {object} u the user for which a role has been changed. Will be updated/inserted at selectedUser or
 * dropped if it is not relevant any more (= deselected completely
 */
function updateSelectedUsers(u) {
  // determine wheter we should add the selected user to the selctedUsers variable which will
  // later be sent to the backend. If the user is not selected as any role (=deselection of roles)
  // it will be removed from the array
  if (!u.selectedModuleCoordinator && !u.selectedLecturer && !u.selectedStudent) {
    selectedUsers = selectedUsers.filter((obj) => {
      return obj.userid !== u.userid;
    });
  } else {
    // add or update at selectedUsers
    upsertSelectedUsers(u);
  }
}

const RegisterCourse = () => {
  // get all users from the api
  users = useSWR('/api/users/allUsers').data || [];

  // initalize state variables:
  //    modals
  const [showModuleCoordinatorModal, setShowModuleCoordinatorModal] = useState(false);
  const [showLecturerModal, setShowLecturerModal] = useState(false);
  const [showStudentModal, setShowStudentsModal] = useState(false);
  //    searchbars
  const [searchTermModuleCoordinator, setSearchTermModuleCoordinator] = useState('');
  const [searchTermLecturer, setSearchTermLecturer] = useState('');
  const [searchTermStudent, setSearchTermStudent] = useState('');
  //    radiobutton selection
  //    =====> throws eslint error but we think we need it.
  // eslint-disable-next-line no-unused-vars
  const [selectedRadioModuleCoordinator, setSelectedRadioModuleCoordinator] = useState('');
  let selectedModuleCoordinator = '';

  // roleStrings for the onCheck function
  const roleStringModuleCoordintator = 'moduleCoordinator';
  const roleStringLecturer = 'lecturer';
  const roleStringStudent = 'student';

  /**
   * the oncheck function which is called by the userItems for a checked or unchecked
   * checkbox
   *
   * @param {Event} e the corresponding event
   * @param {object} u the corresponding user
   * @param {Function} f the function to set the state
   * @param {string} r the roleString which indicates whether the role should be assigned as
   * module coordinator, lecturer or student
   */
  const onCheck = (e, u, f, r) => {
    const checkboxState = e.detail.checked;
    f(e.detail.checked);
    switch (r) {
      case roleStringModuleCoordintator:
        users.find((x) => x.userid === u.userid).selectedModuleCoordinator = checkboxState;
        break;
      case roleStringLecturer:
        users.find((x) => x.userid === u.userid).selectedLecturer = checkboxState;
        break;
      case roleStringStudent:
        users.find((x) => x.userid === u.userid).selectedStudent = checkboxState;
        break;
      default:
    }
    updateSelectedUsers(u);
  };

  /**
   * @param {Event} e  the corresponding event
   * @param {Function} setValue the corresponsding setValue function
   */
  const onRadio = (e, setValue) => {
    // if there is currently another module coordinator selected
    if (selectedModuleCoordinator !== '') {
      // deselect 'selectedModuleCoordinator' attribute and update selectedUsers
      const oldU = users.find((x) => x.userid === selectedModuleCoordinator);
      oldU.selectedModuleCoordinator = false;
      updateSelectedUsers(oldU);
      // if modulecoordinator deselected, reset corresponding values
      if (!e.detail.value) {
        selectedModuleCoordinator = '';
        setValue('');
      // if modulecoordinator changed, replace local variables and update selectedUsers
      } else {
        const selectedUId = e.detail.value.replace('radio_u', '');
        selectedModuleCoordinator = selectedUId;
        setValue(`radio_u${selectedUId}`);
        const newU = users.find((x) => x.userid === selectedModuleCoordinator);
        newU.selectedModuleCoordinator = true;
        updateSelectedUsers(newU);
      }
      // if there is currently no other module coordinator selected
    } else {
      const selectedUId = e.detail.value.replace('radio_u', '');
      selectedModuleCoordinator = selectedUId;
      setValue(`radio_u${selectedUId}`);
      const newU = users.find((x) => x.userid === selectedModuleCoordinator);
      newU.selectedModuleCoordinator = true;
      updateSelectedUsers(newU);
    }
  };

  // filtering functions for the modulecoordinator, lecturer and student elements:
  // returns all users which contain the search term in:
  // - firstname
  // - lastname or
  // - email
  const moduleCoordinatorItems = users.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermModuleCoordinator.toLowerCase())).map((u) => {
    // return element list with radio button items
    return (
      <div style={{ width: '100%' }}>
        <IonItem key={u.userid}>
          <IonLabel>{`${u.firstname} ${u.lastname}`}</IonLabel>
          <IonRadio value={`radio_u${u.userid}`} />
        </IonItem>
      </div>
    );
  });
  const lecturersItems = users.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermLecturer.toLowerCase())).map((u) => {
    return (
      <UserItem
        user={u}
        selected={u.selectedLecturer}
        roleString={roleStringLecturer}
        onCheck={onCheck}
      />
    );
  });
  const studentsItems = users.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermStudent.toLowerCase())).map((u) => {
    return (
      <UserItem
        user={u}
        selected={u.selectedStudent}
        roleString={roleStringStudent}
        onCheck={onCheck}
      />
    );
  });

  // Sending the form and handling the response
  const doCreateCourse = async (data) => {
    try {
      const formdata = {
        courseTitle: data.courseTitle,
        yearCode: data.yearCode,
        users: selectedUsers,
      };
      await fetchPost('../api/courses/registerCourse', formdata);
      makeToast({ message: 'Course created successfully 🔥🤣😩🙏' });
    } catch (ex) {
      makeAPIErrorAlert(ex);
    }
  };
  const { control, handleSubmit } = useForm();
  const onSubmit = (data) => {
    doCreateCourse(data);
  };

  // Modal open/close handlers
  const doShowModuleCoordinatorModal = () => {
    setShowModuleCoordinatorModal(true);
  };
  const doShowLecturerModal = () => {
    setShowLecturerModal(true);
  };
  const doShowStudentsModal = () => {
    setShowStudentsModal(true);
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
      <SearchListModal
        title="Modulkoordinator*in auswählen"
        isOpen={showModuleCoordinatorModal}
        doCloseModal={doCloseModuleCoordinatorModal}
        searchTerm={searchTermModuleCoordinator}
        setSearchTerm={setSearchTermModuleCoordinator}
        selectedRadio={setSelectedRadioModuleCoordinator}
        radioAction={onRadio}
      >
        {moduleCoordinatorItems}
      </SearchListModal>
      <SearchListModal
        title="Lehrende auswählen"
        isOpen={showLecturerModal}
        doCloseModal={doCloseLecturerModal}
        searchTerm={searchTermLecturer}
        setSearchTerm={setSearchTermLecturer}
      >
        {lecturersItems}
      </SearchListModal>
      <SearchListModal
        title="Studierende auswählen"
        isOpen={showStudentModal}
        doCloseModal={doCloseStudentsModal}
        searchTerm={searchTermStudent}
        setSearchTerm={setSearchTermStudent}
      >
        {studentsItems}
      </SearchListModal>
      <IonCenterContent>
        <form name="courseForm" onSubmit={handleSubmit(onSubmit)}>
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
    </AppPage>
  );
};

export default RegisterCourse;
