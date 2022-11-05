import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import ReplyCollection from './collection';

/**
 * Checks if the content of the reply in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
 const isValidReplyContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Reply content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Reply content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if a freet with freetId in req.body exists
 */
 const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.freetId) {
    res.status(400).json({
      error: 'Provided freetId must be nonempty.'
    });
    return;
  }

  const validFormat = Types.ObjectId.isValid(req.body.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.body.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.body.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a reply with replyId is req.params exists
 */
 const isReplyExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.replyId);
  const reply = validFormat ? await ReplyCollection.findOne(req.params.replyId) : '';
  if (!reply) {
    res.status(404).json({
      error: {
        freetNotFound: `Reply with reply ID ${req.params.replyId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the reply whose replyid is in req.params
 */
 const isValidReplyModifier = async (req: Request, res: Response, next: NextFunction) => {
  const reply = await ReplyCollection.findOne(req.params.replyId);
  const userId = reply.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' replies.'
    });
    return;
  }

  next();
};

export {
  isValidReplyContent,
  isFreetExists,
  isReplyExists,
  isValidReplyModifier
};
