import { IonLabel, IonList } from '@ionic/react';
import { useRouter } from 'next/router';
import AppPage from '../../components/AppPage';
import IonCenterContent from '../../components/IonCenterContent';
import { useReviewToShow } from '../../services/reviews';
import SafariFixedIonItem from '../../components/SafariFixedIonItem';
import { TEXTFIELD } from '../../utils/constants';
// import { getOriginalGrade } from '../../utils/originalGrade';

const ShowReviewPage = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const { data: review } = useReviewToShow(reviewId);

  // Determine all allowed file extensions (excl. comments)
  const allowedFileExtensions = review?.reviewallowedformats?.filter((f) => f !== TEXTFIELD);
  // const originalGrade = getOriginalGrade(review, review?.percentagegrade);

  // Determine whether the report has already been submitted
  const submitted = review?.issubmitted;

  /**
   * checks if the user is allowed to view the specific review and if it is submitted already and then
   * returns a view of the review with the following elements:
   * Homeworkname
   * The name of the student that was reviewed (reviewee)
   * The name of the student that did the review (reviewer)
   * The grade of the reviewee (in percent)
   * The comment of the reviewer (only visible if the reviewer left a comment)
   * Any files the reviewer uploaded during the review (only visible if the reviewer uploaded files)
   */
  if (submitted === true) {
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
  }
  if (submitted === false) {
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
  return (
    <AppPage title="Show Review">
      <IonCenterContent>
        <IonLabel style={{ fontSize: 32 }} />
      </IonCenterContent>
    </AppPage>
  );
};

export default ShowReviewPage;
