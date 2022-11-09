import type {Request, Response, NextFunction} from 'express';
import UserCollection from '../user/collection';
import FollowCollection from '../follow/collection';
import ViewCollection from '../view/collection';
import ReputationCollection from './collection';

/**
 * Checks that user doesn't upvote themself
 */
const isNotSelf = async (req: Request, res: Response, next: NextFunction) => {
  const userObj = await UserCollection.findOneByUserId(req.session.userId);
  if (userObj.username == req.body.username) {
    res.status(405).json({
      error: "Cannot upvote yourself."
    });
    return;
  }

  next();
};

/**
 * Checks that user isn't already upvoting them
 */
 const isNotUpvoting = async (req: Request, res: Response, next: NextFunction) => {
  const isUpvoting = await ReputationCollection.isUpvoting(req.session.userId, req.body.username);
  if (isUpvoting) {
    res.status(409).json({
      error: `Already upvoting ${req.body.username}.`
    });
    return;
  }

  next();
};

/**
 * Checks that user isn't already not upvoting them
 */
 const isUpvoting = async (req: Request, res: Response, next: NextFunction) => {
  const isUpvoting = await ReputationCollection.isUpvoting(req.session.userId, req.body.username);
  if (!isUpvoting) {
    res.status(409).json({
      error: `Not upvoting ${req.body.username}.`
    });
    return;
  }

  next();
};

/**
 * Checks that user isn't already downvoting them
 */
 const isNotDownvoting = async (req: Request, res: Response, next: NextFunction) => {
  const isDownvoting = await ReputationCollection.isDownvoting(req.session.userId, req.body.username);
  if (isDownvoting) {
    res.status(409).json({
      error: `Already downvoting ${req.body.username}.`
    });
    return;
  }

  next();
};

/**
 * Checks that user isn't already not downvoting them
 */
 const isDownvoting = async (req: Request, res: Response, next: NextFunction) => {
  const isDownvoting = await ReputationCollection.isDownvoting(req.session.userId, req.body.username);
  if (!isDownvoting) {
    res.status(409).json({
      error: `Not downvoting ${req.body.username}.`
    });
    return;
  }

  next();
};

/**
 * Checks that user can downvote/upvote account by:
 *  1) following account or being followed by account
 *  2) viewing at least 3 of the user's freets
 */
 const isValidToRepute = async (req: Request, res: Response, next: NextFunction) => {
  const isFollowing = await FollowCollection.isFollowing(req.session.userId, req.body.username);
  const reputedUser = await UserCollection.findOneByUsername(req.body.username);
  const user = await UserCollection.findOneByUserId(req.session.userId);
  const isFollowed = await FollowCollection.isFollowing(reputedUser._id, user.username);
  const isViewedEnough = await ViewCollection.hasSeenEnough(req.session.userId, req.body.username);
  if (!isFollowing && !isFollowed && !isViewedEnough) {
    res.status(409).json({
      error: `Not valid to repute ${req.body.username}.`
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
      error: 'Provided username must be nonempty.'
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
      error: 'Provided username must be nonempty.'
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
  isNotUpvoting,
  isUpvoting,
  isNotDownvoting,
  isDownvoting,
  isValidToRepute,
  isUsernameExists,
  getUsernameExists
};
