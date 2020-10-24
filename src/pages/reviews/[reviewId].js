import { IonLabel, IonList } from '@ionic/react';
import { useRouter } from 'next/router';
import AppPage from '../../components/AppPage';
import IonCenterContent from '../../components/IonCenterContent';
import { useReviewToShow } from '../../services/reviews';
import SafariFixedIonItem from '../../components/SafariFixedIonItem';

const ShowReviewPage = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const { data: review } = useReviewToShow(reviewId);

  // check if the user is allowed to view the specific review and if it is submitted already
  if (review?.issubmitted) {
    return (
      <AppPage title="Submit Review">
        <IonCenterContent>
          <IonLabel style={{ fontSize: 32 }}>
            Review has not been submitted yet.
          </IonLabel>
        </IonCenterContent>
      </AppPage>
    );
  }

  return (
    <AppPage title="Show Review">
      <IonCenterContent>
        <IonList>
          <SafariFixedIonItem>
            <h1 className="ion-padding">
              Homework:
              {' '}
              {review?.homeworkname}
            </h1>
          </SafariFixedIonItem>
          <SafariFixedIonItem>
            <h1 className="ion-padding">
              Student reviewed:
              {' '}
              {review?.studentreviewed}
            </h1>
            <h1 className="ion-padding">
              Reviewer:
              {' '}
              {review?.reviewer}
            </h1>
          </SafariFixedIonItem>
          <SafariFixedIonItem>
            <h1 className="ion-padding">
              Review Information
            </h1>
            <h1 className="ion-padding">
              Grading:
              {' '}
              {review?.percentagegrade}
            </h1>
            <h1 className="ion-padding">
              Grading document:
              {' '}
              {review?.reviewfilenames}
            </h1>
            <h1 className="ion-padding">
              Grading comment:
              {' '}
              {review?.reviewcomment}
            </h1>
          </SafariFixedIonItem>
        </IonList>
      </IonCenterContent>
    </AppPage>
  );
};

export default ShowReviewPage;
