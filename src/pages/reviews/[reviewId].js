import { IonLabel, IonList } from '@ionic/react';
import { useRouter } from 'next/router';
import AppPage from '../../components/AppPage';
import IonCenterContent from '../../components/IonCenterContent';
import { useReviewToShow } from '../../services/reviews';
import SafariFixedIonItem from '../../components/SafariFixedIonItem';
import { TEXTFIELD } from '../../utils/constants';

const ShowReviewPage = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const { data: review } = useReviewToShow(reviewId);

  // check if the user is allowed to view the specific review and if it is submitted already
  if (review?.issubmitted !== true) {
    return (
      <AppPage title="Show Review">
        <IonCenterContent>
          <IonLabel style={{ fontSize: 32 }}>
            Review has not been submitted yet.
          </IonLabel>
        </IonCenterContent>
      </AppPage>
    );
  }

  const allowedFileExtensions = review?.reviewallowedformats?.filter((f) => f !== TEXTFIELD);

  return (
    <AppPage title="Show Review">
      <IonCenterContent>
        <IonList>

          <h1 className="ion-padding">
            Homework:
            {' '}
            {review?.homeworkname}
          </h1>

          <IonList>

            <SafariFixedIonItem>
              <IonLabel>
                <strong>Student reviewed: </strong>
              </IonLabel>
              <IonLabel>
                {`${review?.studentreviewedfn} ${review?.studentreviewedln}`}
              </IonLabel>
            </SafariFixedIonItem>

            <SafariFixedIonItem>
              <IonLabel>
                <strong>Reviewer:</strong>
              </IonLabel>
              <IonLabel>
                {`${review?.reviewerfn} ${review?.reviewerln}`}
              </IonLabel>
            </SafariFixedIonItem>

          </IonList>

          <br />
          <br />
          <h3 className="ion-padding">
            Review Information
          </h3>

          <IonList>

            <SafariFixedIonItem>
              <IonLabel>
                <strong>Grading: </strong>
              </IonLabel>
              <IonLabel>
                {`${review?.percentagegrade}%`}
              </IonLabel>
            </SafariFixedIonItem>

            {allowedFileExtensions?.length > 0 && (
            <SafariFixedIonItem>
              <IonLabel>
                <strong>Grading document(s): </strong>
              </IonLabel>
              <IonLabel>
                {review?.reviewfilenames && (
                <a href={`/api/reviews/downloadReview?reviewId=${review.id}`} download className="ion-padding-start">
                  {review?.reviewfilenames}
                </a>
                )}
              </IonLabel>
            </SafariFixedIonItem>
            )}

            {review?.reviewallowedformats?.includes(TEXTFIELD) && (
            <SafariFixedIonItem>
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', verticalAlign: 'middle' }}>
                      <strong>Grading comment:</strong>
                    </td>
                    <td style={{ width: '50%', verticalAlign: 'middle' }}>
                      <p />
                      <p>
                        {review?.reviewcomment}
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </SafariFixedIonItem>
            )}

          </IonList>

        </IonList>
      </IonCenterContent>
    </AppPage>
  );
};

export default ShowReviewPage;
