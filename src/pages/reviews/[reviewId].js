import { IonLabel, IonList } from '@ionic/react';
import { useRouter } from 'next/router';
import Linkify from 'react-linkify';
import AppPage from '../../components/AppPage';
import IonCenterContent from '../../components/IonCenterContent';
import { useReviewToShow } from '../../services/reviews';
import SafariFixedIonItem from '../../components/SafariFixedIonItem';
import { TEXTFIELD } from '../../utils/constants';

const ViewReviewPage = () => {
  const router = useRouter();
  const { reviewId } = router.query;
  const { data: review } = useReviewToShow(reviewId);

  // Determine all allowed file extensions (excl. comments)
  const allowedFileExtensions = review?.reviewallowedformats?.filter((f) => f !== TEXTFIELD);

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
      <AppPage title="View Review">
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
                  {review?.issystemreview ? 'SYSTEM' : `${review?.reviewerfn} ${review?.reviewerln}`}
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
                <Linkify>
                  {review?.reviewfilenames && (
                  <a href={`/api/reviews/downloadReview?reviewId=${review.id}`} download className="ion-padding-start">
                    {review?.reviewfilenames}
                  </a>
                  )}
                </Linkify>
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
                        <p style={{ whiteSpace: 'pre-line' }}>
                          <Linkify>
                            {review?.reviewcomment}
                          </Linkify>
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
  // Page is not shown when the review has not been submitted
  if (submitted === false && !review?.issystemreview) {
    return (
      <AppPage title="View Review">
        <IonCenterContent>
          <IonLabel style={{ fontSize: 32 }}>
            Review has not been submitted yet.
          </IonLabel>
        </IonCenterContent>
      </AppPage>
    );
  }
  // Show an empty page for the time it takes to load the value of "submitted"
  return (
    <AppPage title="View Review">
      <IonCenterContent>
        <IonLabel style={{ fontSize: 32 }} />
      </IonCenterContent>
    </AppPage>
  );
};

export default ViewReviewPage;
