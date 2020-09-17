import { IonDatetime, IonItem, IonLabel, IonText } from '@ionic/react';
import { useMediaQuery } from '@react-hook/media-query';
import DatePicker from 'antd/lib/date-picker';
import TimePicker from 'antd/lib/time-picker';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { makeToast } from './GlobalNotifications';

/**
 * Combines a date and time component to a moment object
 *
 * @param {*} date
 * @param {*} time
 */
const combineMoments = (date, time) => {
  return date && time
    ? moment(date).set({
      hour: moment(time).hour(),
      minute: moment(time).minute(),
    })
    : null;
};

const momentOrNull = (date) => {
  if (!date) return null;
  return moment(date);
};

/**
 * Displays a cool datetime range picker.
 *
 * @param {*} params
 */
const CoolDateTimeRangePicker = ({
  disabled,
  minimum = moment().endOf('minute'),
  onIonChange = () => {},
}) => {
  const [value, setValue] = useState([]);
  const [fromDate, fromTime, toDate, toTime] = value;

  // combine the date and time
  const from = useMemo(() => combineMoments(fromDate, fromTime), [fromDate, fromTime]);
  const to = useMemo(() => combineMoments(toDate, toTime), [toDate, toTime]);

  // call onIonChange when updated
  useEffect(() => {
    onIonChange([from?.toDate(), to?.toDate()]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  // ensure the from value is always after minimum and to value is always after from value
  useEffect(() => {
    if (fromDate?.isBefore(minimum, 'd')) {
      setValue([null, fromTime, toDate, toTime]);
      makeToast({ message: `Start date was before the allowed range. Please pick a time after ${moment(minimum)}.` });
    } else if (from?.isBefore(minimum)) {
      setValue([fromDate, null, toDate, toTime]);
      makeToast({ message: `Start time was before the allowed range. Please pick a time after ${moment(minimum)}.` });
    } else if (fromDate && toDate?.isBefore(fromDate, 'd')) {
      setValue([fromDate, fromTime, null, toTime]);
      makeToast({ message: `End date was before the start date. Please pick a time after ${fromDate}.` });
    } else if (from && to?.isBefore(from)) {
      setValue([fromDate, fromTime, toDate, null]);
      makeToast({ message: `End time was before the start time. Please pick a time after ${from}.` });
    }
  }, [from, fromDate, fromTime, minimum, to, toDate, toTime]);

  return <ResponsiveDateTimeRangePickerFields value={value} onChange={setValue} disabled={disabled} minimum={minimum} />;
};

/**
 * Displays the fields of a cool datetime range picker
 *
 * @param {*} params
 */
const ResponsiveDateTimeRangePickerFields = (params) => {
  // ionic lg breakpoint
  const lgOrUp = useMediaQuery('(min-width: 992px)');
  return lgOrUp
    ? <AntDateTimeRangePickerFields {...params} />
    : <IonDateTimeRangePickerFields {...params} />;
};

/**
 * Displays the fields using Ant Design library.
 *
 * @param {*} param
 */
const AntDateTimeRangePickerFields = ({ disabled, minimum, value, onChange }) => {
  const [fromDate, fromTime, toDate, toTime] = value;
  const isToday = fromDate && fromDate.isSame(minimum, 'day');

  // used for disabling the times that are forbidden
  const hours = [...Array(24).keys()];
  const minutes = [...Array(60).keys()];

  const width = 250;
  return (
    <>
      <div className="ion-margin-start ion-margin-bottom">
        <DatePicker.RangePicker
          style={{ width }}
          format="DD.MM.YYYY"
          allowClear={false}
          size="large"
          disabled={[disabled, disabled]}
          disabledDate={(d) => moment(minimum).startOf('day').isAfter(d)}
          value={[fromDate, toDate]}
          onChange={([fromDateNew, toDateNew]) => onChange([fromDateNew.startOf('day'), fromTime, toDateNew.startOf('day'), toTime])}
        />
      </div>
      <div className="ion-margin-start">
        <TimePicker.RangePicker
          style={{ width }}
          size="large"
          disabled={[disabled || !fromDate, disabled || !toDate]}
          allowClear={false}
          format="HH:mm"
          hideDisabledOptions
          disabledHours={() => hours.filter((h) => isToday && moment(minimum).hour() > h)}
          disabledMinutes={(h) => minutes.filter((m) => isToday && moment(minimum).hour() === h && moment(minimum).minute() > m)}
          minuteStep={15}
          secondStep={60}
          value={[fromTime, toTime]}
          onChange={([fromTimeNew, toTimeNew]) => onChange([fromDate, fromTimeNew.startOf('minute'), toDate, toTimeNew.startOf('minute')])}
        />
      </div>
    </>
  );
};

/**
 * Displays the fields using the Ionic library.
 *
 * @param {*} param
 */
const IonDateTimeRangePickerFields = ({ disabled, value, onChange }) => {
  const [fromDate, fromTime, toDate, toTime] = value;

  const handleChange = useCallback((eFromDate, eFromTime, eToDate, eToTime) => {
    // only one of the parameteers will be provided, use the existing values for the rest
    // also convert the parameter value to a moment object
    const fromDateNew = eFromDate ? momentOrNull(eFromDate.detail.value).startOf('day') : fromDate;
    const fromTimeNew = eFromTime ? momentOrNull(eFromTime.detail.value).startOf('minute') : fromTime;
    const toDateNew = eToDate ? momentOrNull(eToDate.detail.value).startOf('day') : toDate;
    const toTimeNew = eToTime ? momentOrNull(eToTime.detail.value).startOf('minute') : toTime;

    // Ionic sends an onChange update whenever the value changes, we need to filter the events to prevent infinite loops
    if (!fromDateNew?.isSame(fromDate)
      || !fromTimeNew?.isSame(fromTime)
      || !toDateNew?.isSame(toDate)
      || !toTimeNew?.isSame(toTime)) {
      onChange([fromDateNew, fromTimeNew, toDateNew, toTimeNew]);
    }
  }, [fromDate, fromTime, onChange, toDate, toTime]);

  // Ionic needs a min and max year
  const minYear = (new Date()).getFullYear();
  const maxYear = (new Date()).getFullYear() + 3;

  return (
    <>
      <IonItem>
        <IonLabel>
          Start date
          <IonText color="danger">*</IonText>
        </IonLabel>

        <IonDatetime
          min={minYear}
          max={maxYear}
          value={fromDate?.toISOString()}
          onIonChange={(e) => handleChange(e)}
          disabled={disabled}
        />
      </IonItem>

      <IonItem>
        <IonLabel>
          Start time
          <IonText color="danger">*</IonText>
        </IonLabel>
        <IonDatetime
          displayFormat="HH:mm"
          onIonChange={(e) => handleChange(null, e)}
          value={fromTime?.toISOString()}
          disabled={disabled}
        />
      </IonItem>

      <IonItem>
        <IonLabel>
          End date
          <IonText color="danger">*</IonText>
        </IonLabel>

        <IonDatetime
          min={minYear}
          max={maxYear}
          disabled={disabled}
          value={toDate?.toISOString()}
          onIonChange={(e) => handleChange(null, null, e)}
        />
      </IonItem>

      <IonItem>
        <IonLabel>
          End time
          <IonText color="danger">*</IonText>
        </IonLabel>
        <IonDatetime
          displayFormat="HH:mm"
          value={toTime?.toISOString()}
          onIonChange={(e) => handleChange(null, null, null, e)}
          disabled={disabled}
        />
      </IonItem>
    </>
  );
};

export default CoolDateTimeRangePicker;
