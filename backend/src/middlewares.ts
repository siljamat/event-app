/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from 'express';
import CustomError from './classes/CustomError';
import {ErrorResponse} from './types/MessageTypes';
import {getLocationCoordinates} from './functions/geocode';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) => {
  console.error('errorHandler', err.message);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const getCoordinates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {address} = req.body;
    const coords = await getLocationCoordinates(address);
    req.body.coords = coords;
    next();
  } catch (error) {
    next(error);
  }
};

export {notFound, errorHandler, getCoordinates};
