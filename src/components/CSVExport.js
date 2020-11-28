/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect, useRef } from 'react';
import { CSVLink } from 'react-csv';

const CSVExport = ({ asyncExportMethod, children, disable, ...props }) => {
  const [csvData, setCsvData] = useState(false);
  const csvInstance = useRef();
  useEffect(() => {
    if (csvData && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        csvInstance.current.link.dataset.interception = 'off';
        csvInstance.current.link.click();
        setCsvData(false);
      });
    }
  }, [csvData]);
  return (
    <>
      <span
        onClick={async () => {
          if (disable) {
            return;
          }
          const newCsvData = await asyncExportMethod();
          setCsvData(newCsvData);
        }}
      >
        {children}
      </span>
      {csvData
        ? (
          <CSVLink
            {...props}
            data={csvData}
            ref={csvInstance}
          />
        )
        : undefined}
    </>

  );
};

export default CSVExport;
