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
  value = [],
  onIonChange = () => {},
}) => {
  const [innerValue, setInnerValue] = useState([]);
  const [fromDate, fromTime, toDate, toTime] = innerValue;

  // combine the date and time
  const from = useMemo(() => combineMoments(fromDate, fromTime), [fromDate, fromTime]);
  const to = useMemo(() => combineMoments(toDate, toTime), [toDate, toTime]);

  const valueFrom = value[0] ?? from;
  const valueTo = value[1] ?? to;

  // call onIonChange when updated
  useEffect(() => {
    const val = from && to ? [from.toDate(), to.toDate()] : undefined;
    onIonChange(val);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  // ensure the from value is always after minimum and to value is always after from value
  useEffect(() => {
    if ((valueFrom && (!from || !from.isSame(valueFrom)))
      || (valueTo && (!to || !to.isSame(valueTo)))) {
      setInnerValue([
        momentOrNull(valueFrom)?.startOf('day'),
        momentOrNull(valueFrom)?.startOf('minute'),
        momentOrNull(valueTo)?.startOf('day'),
        momentOrNull(valueTo || valueFrom)?.startOf('minute'),
      ]);
    } else if (fromDate?.isBefore(minimum, 'd')) {
      setInnerValue([null, fromTime, toDate, toTime]);
      makeToast({ message: `Start date of ${name} was before the allowed range. Please pick a time after ${moment(minimum)}.` });
    } else if (from?.isBefore(minimum)) {
      setInnerValue([fromDate, null, toDate, toTime]);
      makeToast({ message: `Start time of ${name} was before the allowed range. Please pick a time after ${moment(minimum)}.` });
    } else if (fromDate && toDate?.isBefore(fromDate, 'd')) {
      setInnerValue([fromDate, fromTime, null, toTime]);
      makeToast({ message: `End date of ${name} was before the start date. Please pick a time after ${fromDate}.` });
    } else if (from && to?.isBefore(from)) {
      setInnerValue([fromDate, fromTime, toDate, null]);
      makeToast({ message: `End time of ${name} was before the start time. Please pick a time after ${from}.` });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueFrom, valueTo]);

  return <ResponsiveDateTimeRangePickerFields value={innerValue} onChange={setInnerValue} disabled={disabled} minimum={minimum} />;
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

const datePickerWidth = 250;

/**
 * A customized time picker.
 *
 * @param {*} props
 */
const AntTimePicker = (props) => {
  return (
    <TimePicker
      className="ion-margin-end"
      style={{ width: datePickerWidth / 2 - 8, marginBottom: 0 }}
      size="large"
      format="HH:mm"
      allowClear={false}
      showNow={false}
      hideDisabledOptions
      minuteStep={15}
      secondStep={60}
      {...props}
    />
  );
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

  return (
    <>
      <div className="ion-margin-start ion-margin-bottom ion-margin-end">
        <DatePicker.RangePicker
          style={{ width: datePickerWidth }}
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
        <AntTimePicker
          placeholder="Start time"
          disabled={disabled || !fromDate}
          disabledHours={() => hours.filter((h) => isMinimumDay && moment(minimum).hour() > h)}
          disabledMinutes={(h) => minutes.filter((m) => isMinimumDay && moment(minimum).hour() === h && moment(minimum).minute() > m)}
          value={fromTime}
          onChange={(fromTimeNew) => onChange([fromDate, fromTimeNew.startOf('minute'), toDate, fromTimeNew.startOf('minute')])}
        />
        <AntTimePicker
          placeholder="End time"
          disabled={disabled || !fromTime || !toDate}
          disabledHours={() => hours.filter((h) => isEndStartDay && fromTime.hour() > h)}
          disabledMinutes={(h) => minutes.filter((m) => isEndStartDay && fromTime.hour() === h && fromTime.minute() > m)}
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
