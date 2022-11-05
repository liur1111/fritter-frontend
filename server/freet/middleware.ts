import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from './collection';
import UserCollection from '../user/collection';

/**
 * Checks if a freet with freetId in req.params exists
 */
const isFreetParamsExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.params.freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId in req.query exists
 */
 const isFreetQueryExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.freetId) {
    res.status(400).json({
      error: 'Provided freetId must be nonempty.'
    });
    return;
  }
  
  const validFormat = Types.ObjectId.isValid(req.query.freetId as string);
  const freet = validFormat ? await FreetCollection.findOne(req.query.freetId as string) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.query.freetId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId in req.query exists
 * If not, check that user with authorId as req.query exists
 */
 const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.freetId) {
    next();
    return;
  }

  if (!req.query.author) {
    res.status(400).json({
      error: 'Provided author username must be nonempty.'
    });
    return;
  }

  const user = await UserCollection.findOneByUsername(req.query.author as string);
  if (!user) {
    res.status(404).json({
      error: `A user with username ${req.query.author as string} does not exist.`
    });
    return;
  }

  next();
};

export {
  isValidFreetContent,
  isFreetParamsExists,
  isFreetQueryExists,
  isValidFreetModifier,
  isAuthorExists
};
