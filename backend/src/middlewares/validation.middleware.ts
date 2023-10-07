import { ClassConstructor, plainToInstance } from 'class-transformer'; // used to convert the request body into a class
import { validate, ValidationError } from 'class-validator'; // used to check if the conversion from request body to class is not successfull and manage that situation
import * as express from 'express';
import HttpError from '../models/http/errors/HttpError';

/**
 * Validations middleware that checks if the request body corrispond to the "type" class furnished as parameter
 * @template T
 * @param type
 * @param [skipMissingProperties] true if skip the validation of the properties that are null or undefined, otherwise false (default: false)
 * @returns middleware
 */
function validationMiddleware(
  type: ClassConstructor<object>
): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToInstance(type, req.body)).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) => Object.values(error.constraints))
            .join(', ');
          next(new HttpError(400, message, ''));
        } else {
          next();
        }
      }
    );
  };
}

export default validationMiddleware;
