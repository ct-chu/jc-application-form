/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { Button } from '@mui/material';

interface DownloadJSONProps{
  data?: object|any;
  fileName?: string;
  label?: string;
}

const DownloadJSON: React.FC<DownloadJSONProps> = ({
  data,
  fileName,
  label,
}) => {
  const downloadJSON = () => {
    const jsonData = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const jsonURL = URL.createObjectURL(jsonData);
    const link = document.createElement('a');
    link.href = jsonURL;
    fileName = (fileName == undefined || fileName == null || fileName =="") ? "form" : fileName
    label = (label == undefined || label == null || label =="") ? "Download JSON" : label
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
        variant="contained"
        color="secondary"
        className="rounded-md shadow-sm hover:shadow-md transition-shadow"
        onClick={downloadJSON}
    >
        {label}
    </Button>
  );
}

export default DownloadJSON;