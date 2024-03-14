import {Point} from 'geojson';

// Response from the server after uploading a file

type UploadResponse = {
  message: string;
  data: {
    filename: string;
    location: Point;
  };
};

export type {UploadResponse};
