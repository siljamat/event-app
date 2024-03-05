import {Point} from 'geojson';

type UploadResponse = {
  message: string;
  data: {
    filename: string;
    location: Point;
  };
};

export type {UploadResponse};
