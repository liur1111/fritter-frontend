import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';
import FollowCollection from './collection';

/**
 * Checks that user doesn't follow themself
 */
const isNotSelf = async (req: Request, res: Response, next: NextFunction) => {
  const userObj = await UserCollection.findOneByUserId(req.session.userId);
  if (userObj.username == req.body.username) {
    res.status(405).json({
      error: "Cannot follow yourself."
    });
    return;
  }

  next();
};

/**
 * Checks that user isn't already following them
 */
 const isNotFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const isFollowing = await FollowCollection.isFollowing(req.session.userId, req.body.username);
  if (isFollowing) {
    res.status(409).json({
      error: `Already following ${req.body.username}.`
    });
    return;
  }

  next();
};

/**
 * Checks that user isn't already not following them
 */
 const isFollowing = async (req: Request, res: Response, next: NextFunction) => {
  const isFollowing = await FollowCollection.isFollowing(req.session.userId, req.body.username);
  if (!isFollowing) {
    res.status(409).json({
      error: `Not following ${req.body.username}.`
    });
    return;
  }

  next();
};

/**
 * Checks if a user with username in req.query exists
 */
 const isUsernameExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.username) {
    res.status(400).json({
      error: 'Provided author username must be nonempty.'
    });
    return;
  }

  const user = await UserCollection.findOneByUsername(req.body.username as string);
  if (!user) {
    res.status(404).json({
      error: `A user with username ${req.body.username as string} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if a user with username in req.query exists
 */
 const getUsernameExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.username) {
    res.status(400).json({
      error: 'Provided author username must be nonempty.'
    });
    return;
  }

  const user = await UserCollection.findOneByUsername(req.query.username as string);
  if (!user) {
    res.status(404).json({
      error: `A user with username ${req.query.username as string} does not exist.`
    });
    return;
  }

  next();
};

export {
  isNotSelf,
  isNotFollowing,
  isFollowing,
  isUsernameExists,
  getUsernameExists
};
