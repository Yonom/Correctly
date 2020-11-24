/* Ionic imports */
import { IonButton, IonCol, IonGrid, IonRow, IonTextarea } from '@ionic/react';
import { useState } from 'react';
import similarity from 'string-cosine-similarity';
import stringSimilarity from 'string-similarity';
import Levenshtein from 'levenshtein';

import AppPage from '../../components/AppPage';

const PlagiarismIsADancer = () => {
  const [text1, setText1] = useState('Hier Text 1 eingeben 🤏 \n \n \n \n \n ');
  const [text2, setText2] = useState('Hier Text 2 eingeben 😂👌 \n \n \n \n');

  const calculateSimilarity = () => {
    const cosineSimilarity = similarity(text1, text2) * 100;
    const levenshteinDistance = new Levenshtein(text1, text2);
    const levenshteinLength = Math.max(text1.length, text2.length);
    const levenshteinSimilarity = (1 - (levenshteinDistance.distance / levenshteinLength)) * 100;
    const diceSimilarity = stringSimilarity.compareTwoStrings(text1, text2) * 100;
    alert(`Similarity (cosine): ${cosineSimilarity}% \nSimilarity (levenshtein): ${levenshteinSimilarity}% \nSimilarity (dice): ${diceSimilarity}% `);
  };

  return (
    <AppPage title="Plagiarism Is A Dancer">
      <IonGrid>
        <IonRow>
          <IonCol size="6">
            <IonTextarea autoGrow value={text1} type="text" name="text1" onIonChange={(e) => { setText1(e.detail.value); }} placeholder="Hier Text 1 eingeben 🤏">
              Text1
            </IonTextarea>

          </IonCol>
          <IonCol size="6">
            <IonTextarea autoGrow value={text2} type="text" name="text2" onIonChange={(e) => { setText2(e.detail.value); }} placeholder="Hier Text 2 eingeben 😂👌">
              Text2
            </IonTextarea>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonButton onClick={calculateSimilarity}>calc</IonButton>
    </AppPage>
  );
};

export default PlagiarismIsADancer;
