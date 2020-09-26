/* Ionic imports */
import { IonButton, IonLabel, IonItem, IonInput, IonText, IonRadioGroup, IonGrid, IonRow, IonCol, IonLoading } from '@ionic/react';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/router';

import fetchPost from '../../../utils/fetchPost';

import AppPage from '../../../components/AppPage';
import IonController from '../../../components/IonController';
import IonCenterContent from '../../../components/IonCenterContent';

import { makeToast } from '../../../components/GlobalNotifications';
import SearchListModal from '../../../components/SearchListModal';
import UserItem from '../../../components/UserItem';
import UserRadio from '../../../components/UserRadio';
import UserChip from '../../../components/UserChip';
import { makeAPIErrorAlert, useOnErrorAlert } from '../../../utils/errors';
import { useAllUsers } from '../../../services/users';
import { useAttends } from '../../../services/attends';
import { useCourse } from '../../../services/courses';
import SubmitButton from '../../../components/SubmitButton';

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
  console.log('selected users before update: ', selectedUsers);
  console.log('update user: ', u.firstname, '; MC; ', u.selectedModuleCoordinator, '; L: ', u.selectedLecturer, '; S: ', u.selectedStudent);
  if (!u.selectedModuleCoordinator && !u.selectedLecturer && !u.selectedStudent) {
    selectedUsers = selectedUsers.filter((obj) => {
      return obj.userid !== u.userid;
    });
  } else {
    // add or update at selectedUsers
    upsertSelectedUsers(u);
  }
  console.log('selected users after update: ', selectedUsers);
}

/**
 * delets the role of
 */
function clearModuleCoordinator() {
  selectedUsers.forEach((element) => { element.selectedModuleCoordinator = undefined; });
}

let selectedModuleCoordinator;

/**
 * @param attendees
 */
function initializeAttendees(attendees) {
  let attendee;
  for (attendee of attendees) {
    const attendeeId = attendee.userid;
    const foundId = users.findIndex(({ userid }) => userid === attendeeId);
    users[foundId].selectedLecturer = attendee.islecturer;
    users[foundId].selectedModuleCoordinator = attendee.ismodulecoordinator;
    if (attendee.ismodulecoordinator) {
      selectedModuleCoordinator = users[foundId];
    }
    users[foundId].selectedStudent = attendee.isstudent;
    console.log('attendeeUser = ', users[foundId]);
    updateSelectedUsers(users[foundId]);
  }
}

const EditCoursePage = () => {
  // initialize router
  const router = useRouter();
  const courseId = router.query.id;

  // get data and attendees about selected course
  const { data: course, error: errorCourse } = useOnErrorAlert(useCourse(courseId));
  const { data: attendees, error: errorAttendees } = useAttends(courseId);

  useEffect(() => {
    if (typeof attendees !== 'undefined') {
      initializeAttendees(attendees);
    }
  }, [attendees]);

  users = useOnErrorAlert(useAllUsers()).data || [];

  // initialize state variables:
  //    modals
  const [showModuleCoordinatorModal, setShowModuleCoordinatorModal] = useState(false);
  const [showLecturerModal, setShowLecturerModal] = useState(false);
  const [showStudentModal, setShowStudentsModal] = useState(false);
  //    searchbars
  const [searchTermModuleCoordinator, setSearchTermModuleCoordinator] = useState('');
  const [searchTermLecturer, setSearchTermLecturer] = useState('');
  const [searchTermStudent, setSearchTermStudent] = useState('');
  //    radiobutton selection
  const [selectedModuleCoordinatorItem, setSelectedModuleCoordinatorItem] = useState(undefined);

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
    console.log(selectedUsers);
  };

  const onClickChip = (e, u, r, setShowChip) => {
    console.log(`test ${u}`);
    switch (r) {
      case roleStringModuleCoordintator:
        users.find((x) => x.userid === u.userid).selectedModuleCoordinator = false;
        // setClearSelection(true);
        setSelectedModuleCoordinatorItem(undefined);
        break;
      case roleStringLecturer:
        users.find((x) => x.userid === u.userid).selectedLecturer = false;
        break;
      case roleStringStudent:
        users.find((x) => x.userid === u.userid).selectedStudent = false;
        break;
      default:
    }
    updateSelectedUsers(u);
    console.log(selectedUsers);
    setShowChip(false);
  };

  /**
   * @param {Event} e  the corresponding event
   */
  const onRadio = (e) => {
    const key = e.detail.value;
    // setSelectedModuleCoordinatorItem(key);
    const oldSelectedModuleCoordinator = selectedModuleCoordinator;

    // if a user has been deselected
    if (key === undefined || key === null) {
      selectedModuleCoordinator = undefined;
      const oldU = users.find((x) => x.userid === oldSelectedModuleCoordinator);
      if (oldU !== undefined) {
        console.log('delete user: ', oldU);
        oldU.selectedModuleCoordinator = false;
        updateSelectedUsers(oldU);
      }
    } else {
      const selectedUId = key.replace('radio_u', '');
      // if another MC has been defined before
      if (oldSelectedModuleCoordinator !== undefined) {
        // deselect 'selectedModuleCoordinator' attribute and update selectedUsers
        const oldU = users.find((x) => x.userid === oldSelectedModuleCoordinator);
        if (oldU !== undefined) {
          console.log('delete user: ', oldU);
          oldU.selectedModuleCoordinator = false;
          updateSelectedUsers(oldU);
        }
      }
      const newU = users.find((x) => x.userid === selectedUId);
      newU.selectedModuleCoordinator = true;
      updateSelectedUsers(newU);
      selectedModuleCoordinator = selectedUId;
    }
    console.log('selection end: ', selectedModuleCoordinator, selectedUsers);
  };

  // filtering functions for the modulecoordinator, lecturer and student elements:
  // returns all users which contain the search term in:
  // - firstname
  // - lastname or
  // - email
  const moduleCoordinatorItems = users.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermModuleCoordinator.toLowerCase())).map((u) => {
    // return element list with radio button items
    return (
      <UserRadio
        user={u}
        key={`radio_u${u.userid}`}
      />
    );
  });
  const lecturersItems = users.filter((u) => u.firstname.concat(u.lastname, u.email).toLowerCase().includes(searchTermLecturer.toLowerCase())).map((u) => {
    return (
      <UserItem
        user={u}
        key={`lecturerBox_u${u.userid}`}
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
        key={`studentsBox_u${u.userid}`}
        selected={u.selectedStudent}
        roleString={roleStringStudent}
        onCheck={onCheck}
      />
    );
  });

  const moduleCoordinatorsChips = selectedUsers.filter((u) => `radio_u${u.userid}` === selectedModuleCoordinatorItem).map((u) => {
    return (
      <UserChip
        user={u}
        id={`moduleCoordinatorChip_u${u.userid}`}
        roleString={roleStringModuleCoordintator}
        onCheck={onClickChip}
      />
    );
  });

  const lecturersChips = selectedUsers.filter((u) => u.selectedLecturer).map((u) => {
    return (
      <UserChip
        user={u}
        id={`lecturerChip_u${u.userid}`}
        roleString={roleStringLecturer}
        onCheck={onClickChip}
      />
    );
  });

  const studentsChips = selectedUsers.filter((u) => u.selectedStudent).map((u) => {
    return (
      <UserChip
        user={u}
        key={`studentsChip_u${u.userid}`}
        roleString={roleStringStudent}
        onCheck={onClickChip}
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
  const { control, handleSubmit, reset } = useForm();

  useEffect(() => {
    reset({
      courseTitle: course?.title,
      yearCode: course?.yearcode,
    });
  }, [reset, course]);

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
    <AppPage title="Editing courses">
      <IonLoading isOpen={!course && !errorCourse} />
      <SearchListModal
        title="Select module coordination"
        key="moduleCoordinationModal"
        isOpen={showModuleCoordinatorModal}
        doCloseModal={doCloseModuleCoordinatorModal}
        searchTerm={searchTermModuleCoordinator}
        setSearchTerm={setSearchTermModuleCoordinator}
      >
        <IonRadioGroup
          key="radioGroupModuleCoordination"
          allowEmptySelection
          onIonChange={(e) => {
            const key = e.detail.value;
            setSelectedModuleCoordinatorItem(key);
            onRadio(e);
          }}
          value={selectedModuleCoordinatorItem}
        >
          {moduleCoordinatorItems}
        </IonRadioGroup>
      </SearchListModal>
      <SearchListModal
        title="Select Lecturer"
        key="lecturerModal"
        isOpen={showLecturerModal}
        doCloseModal={doCloseLecturerModal}
        searchTerm={searchTermLecturer}
        setSearchTerm={setSearchTermLecturer}
      >
        {lecturersItems}
      </SearchListModal>
      <SearchListModal
        title="Select Students"
        key="studentsModal"
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
                Course title
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" as={IonInput} control={control} name="courseTitle" required defaultValue={course?.title} />
            </IonItem>
            <IonItem>
              <IonLabel position="floating">
                Year code
                {' '}
                <IonText color="danger">*</IonText>
              </IonLabel>
              <IonController type="text" expand="block" as={IonInput} control={control} name="yearCode" required defaultValue={course?.yearcode} />
            </IonItem>
            <IonGrid>
              <IonRow>
                <IonCol size="9">
                  <IonLabel>Module coordination</IonLabel>
                </IonCol>
                <IonCol>
                  <IonButton onClick={() => doShowModuleCoordinatorModal()} expand="block">
                    Select
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  {moduleCoordinatorsChips}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="9">
                  <IonLabel position="floating">Lecturers</IonLabel>
                </IonCol>
                <IonCol>
                  <IonButton onClick={() => doShowLecturerModal()} expand="block">
                    Select
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  {lecturersChips}
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="9">
                  <IonLabel position="floating">Students</IonLabel>
                </IonCol>
                <IonCol>
                  <IonButton onClick={() => doShowStudentsModal()} expand="block">
                    Select
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  {studentsChips}
                </IonCol>
              </IonRow>
              <IonRow />
            </IonGrid>
            <SubmitButton color="secondary" expand="block">Save edits</SubmitButton>
          </div>
        </form>
        <section className="ion-padding">
          <Link href="/" passHref>
            <IonButton color="medium" size="default" fill="clear" expand="block" class="ion-no-margin">Back to the menu</IonButton>
          </Link>
        </section>
      </IonCenterContent>
    </AppPage>
  );
};

export default EditCoursePage;
