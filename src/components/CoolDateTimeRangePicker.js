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
  name,
  disabled,
  minimum = moment().startOf('minute').add(1, 'm'),
  defaultValue,
  onIonChange = () => {},
}) => {
  const [value, setValue] = useState([]);
  const [lastDefaultValue, setLastDefaultValue] = useState([]);
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
    if (defaultValue && lastDefaultValue !== defaultValue) {
      setValue([moment(defaultValue).startOf('day'), moment(defaultValue).startOf('minute'), toDate, moment(defaultValue).startOf('minute')]);
      setLastDefaultValue(defaultValue);
    } else if (fromDate?.isBefore(minimum, 'd')) {
      setValue([null, fromTime, toDate, toTime]);
      makeToast({ message: `Start date of ${name} was before the allowed range. Please pick a time after ${moment(minimum)}.` });
    } else if (from?.isBefore(minimum)) {
      setValue([fromDate, null, toDate, toTime]);
      makeToast({ message: `Start time of ${name} was before the allowed range. Please pick a time after ${moment(minimum)}.` });
    } else if (fromDate && toDate?.isBefore(fromDate, 'd')) {
      setValue([fromDate, fromTime, null, toTime]);
      makeToast({ message: `End date of ${name} was before the start date. Please pick a time after ${fromDate}.` });
    } else if (from && to?.isBefore(from)) {
      setValue([fromDate, fromTime, toDate, null]);
      makeToast({ message: `End time of ${name} was before the start time. Please pick a time after ${from}.` });
    }
  }, [name, from, fromDate, fromTime, minimum, to, toDate, toTime, defaultValue, lastDefaultValue]);

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
  const isMinimumDay = fromDate && fromDate.isSame(minimum, 'day');
  const isEndStartDay = fromDate && toDate && fromDate.isSame(toDate, 'day');

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
        <TimePicker
          style={{ width: width / 2 - 8 }}
          className="ion-margin-end"
          size="large"
          disabled={disabled || !fromDate}
          allowClear={false}
          format="HH:mm"
          placeholder="Start time"
          hideDisabledOptions
          disabledHours={() => hours.filter((h) => isMinimumDay && moment(minimum).hour() > h)}
          disabledMinutes={(h) => minutes.filter((m) => isMinimumDay && moment(minimum).hour() === h && moment(minimum).minute() > m)}
          minuteStep={15}
          secondStep={60}
          value={fromTime}
          onChange={(fromTimeNew) => onChange([fromDate, fromTimeNew.startOf('minute'), toDate, fromTimeNew.startOf('minute')])}
        />
        <TimePicker
          style={{ width: width / 2 - 8 }}
          size="large"
          disabled={disabled || !fromTime || !toDate}
          allowClear={false}
          format="HH:mm"
          placeholder="End time"
          defaultPickerValue={fromTime}
          hideDisabledOptions
          disabledHours={() => hours.filter((h) => isEndStartDay && fromTime.hour() > h)}
          disabledMinutes={(h) => minutes.filter((m) => isEndStartDay && fromTime.hour() === h && fromTime.minute() > m)}
          minuteStep={15}
          secondStep={60}
          value={toTime}
          onChange={(toTimeNew) => onChange([fromDate, fromTime, toDate, toTimeNew.startOf('minute')])}
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
const IonDateTimeRangePickerFields = ({ disabled, minimum, value, onChange }) => {
  const [fromDate, fromTime, toDate, toTime] = value;
  const isMinimumDay = fromDate && fromDate.isSame(minimum, 'day');
  const isEndStartDay = fromDate && toDate && fromDate.isSame(toDate, 'day');

  const handleChange = useCallback((eFromDate, eFromTime, eToDate, eToTime) => {
    // only one of the parameteers will be provided, use the existing values for the rest
    // also convert the parameter value to a moment object
    const fromDateNew = eFromDate ? momentOrNull(eFromDate.detail.value)?.startOf('day') : fromDate;
    const fromTimeNew = eFromTime ? momentOrNull(eFromTime.detail.value)?.startOf('minute') : fromTime;
    const toDateNew = eToDate ? momentOrNull(eToDate.detail.value)?.startOf('day') : toDate;
    const toTimeNew = eToTime ? momentOrNull(eToTime.detail.value)?.startOf('minute') : toTime;

    // Ionic sends an onChange update whenever the value changes, we need to filter the events to prevent infinite loops
    if (!fromDateNew?.isSame(fromDate)
      || !fromTimeNew?.isSame(fromTime)
      || !toDateNew?.isSame(toDate)
      || !toTimeNew?.isSame(toTime)) {
      onChange([fromDateNew, fromTimeNew, toDateNew, toTimeNew]);
    }
  }, [fromDate, fromTime, onChange, toDate, toTime]);

  useEffect(() => {
    onChange([fromDate, fromTime, toDate, fromTime]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromTime]);

  // Ionic needs a min and max year
  const minStartDate = moment(minimum).format('yyyy-MM-DD');
  const minStartTime = isMinimumDay ? moment(minimum).format('HH:mm') : '00:00';
  const minEndDate = moment(fromDate)?.format('yyyy-MM-DD');
  const minEndTime = isEndStartDay ? momentOrNull(fromTime)?.format('HH:mm') : '00:00';
  const maxDate = (new Date()).getFullYear() + 3;

  return (
    <>
      <IonItem>
        <IonLabel>
          Start date
          <IonText color="danger">*</IonText>
        </IonLabel>

        <IonDatetime
          min={minStartDate}
          max={maxDate}
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
          min={minStartTime}
          displayFormat="HH:mm"
          onIonChange={(e) => handleChange(null, e)}
          value={fromTime?.toISOString()}
          disabled={disabled || !fromDate}
        />
      </IonItem>

      <IonItem>
        <IonLabel>
          End date
          <IonText color="danger">*</IonText>
        </IonLabel>

        <IonDatetime
          min={minEndDate}
          max={maxDate}
          disabled={disabled || !fromDate}
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
          onIonChange={(e) => handleChange(null, null, null, e)}
          min={minEndTime}
          value={toTime?.toISOString()}
          disabled={disabled || !fromTime || !toDate}
        />
      </IonItem>
    </>
  );
};

export default CoolDateTimeRangePicker;
