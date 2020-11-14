/* Ionic imports */
import { IonInput, IonLoading } from '@ionic/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AppPage from '../../components/AppPage';

import IonController from '../../components/IonController';

import { makeAPIErrorAlert, onSubmitError } from '../../utils/errors';

import { makeToast } from '../../components/GlobalNotifications';
import SubmitButton from '../../components/SubmitButton';
import { checkPlagiarism } from '../../services/plagiarism';

const PlagiarismIsADancer = () => {
  const [updateLoading, setUpdateLoading] = useState(false);

  const doCheckPlagiarism = async (data) => {
    try {
      // send the data to the api and show the loading component in
      // the meantime to inform user and prevent double requests
      makeToast({ message: '🅱️lagiarism 🅱️eck 🅱️initiated. 🤯👀' });
      setUpdateLoading(true);
      await checkPlagiarism(data);
      setUpdateLoading(false);
      makeToast({ message: '🅱️lagiarism 🅱️eck successfully. ✅😩' });
      return true;
    } catch (ex) {
      setUpdateLoading(false);
      return makeAPIErrorAlert(ex);
    }
  };
  const { control, handleSubmit } = useForm();

  const onSubmit = (data) => {
    doCheckPlagiarism(data);
  };

  return (
    <AppPage title="Plagiarism Is A Dancer">
      <IonLoading isOpen={updateLoading} />
      <form name="plagiarismForm" onSubmit={handleSubmit(onSubmit, onSubmitError)}>
        <IonController type="text" as={IonInput} control={control} placeholder="Homework ID" name="homeworkId" required />
        <SubmitButton color="secondary" expand="block">Create course</SubmitButton>
      </form>
    </AppPage>
  );
};

export default PlagiarismIsADancer;
