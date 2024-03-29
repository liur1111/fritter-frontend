import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReputationCollection from './collection';
import FollowCollection from '../follow/collection';
import UserCollection from '../user/collection';
import ViewCollection from '../view/collection';
import * as userValidator from '../user/middleware';
import * as reputationValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get current user's reputation
 *
 * @name GET /api/reputation
 *
 * @return {ReputationResponse} - user USERNAME's reputation
 * @throws {403} - If user is not logged in
 */
/**
 * Get user's reputation by username
 *
 * @name GET /api/reputation?username=username
 *
 * @return {ReputationResponse} - user USERNAME's reputationObj
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.username !== undefined) {
      next();
      return;
    }

    const reputationObj = await ReputationCollection.findReputationByID(req.session.userId);
    res.status(200).json({"reputation": reputationObj});
  },
  [
    reputationValidator.getUsernameExists
  ],
  async (req: Request, res: Response) => {
    const reputationObj = await ReputationCollection.findReputationObjByUsername(req.query.username as string);
    const response = await util.constructReputationResponse(reputationObj);
    res.status(200).json({"reputationObj": response});
  }
);

/**
 * Get reputability of user by username.
 *  Checks that user can downvote/upvote account by:
 *  1) following account or being followed by account
 *  2) viewing at least 3 of the user's freets
 *
 * @name GET /api/reputation/isReputable?username=username
 *
 * @return {Boolean} - True if reputable, False otherwise
 * @throws {400} - If username is not given
 * @throws {404} - If no user has given username
 */
 router.get(
  '/isReputable',
  [
    userValidator.isUserLoggedIn,
    reputationValidator.getUsernameExists,
  ],
  async (req: Request, res: Response) => {
    const isFollowing = await FollowCollection.isFollowing(req.session.userId, req.query.username as string);
    const reputedUser = await UserCollection.findOneByUsername(req.query.username as string);
    const user = await UserCollection.findOneByUserId(req.session.userId);
    const isFollowed = await FollowCollection.isFollowing(reputedUser._id, user.username);
    const isViewedEnough = await ViewCollection.hasSeenEnough(req.session.userId, req.query.username as string);
    if (!isFollowing && !isFollowed && !isViewedEnough) {
      res.status(200).json({"isReputable": false});
    } else {
      res.status(200).json({"isReputable": true});
    }
  } 
);

/**
 * Upvote another user.
 * 
 * @name PUT /api/reputation/upvote
 * 
 * @param {string} upvoteeUsername - username to be upvoted
 * @return {ReputationResponse} - updated user's reputation
 * @throws {400} if username is not given
 * @throws {404} if no user has given username
 * @throws {403} if user is not logged in
 * @throws {405} if user tries to upvote self
 * @throws {409} if user is already upvoting followee
 * @throws {409} if user is not valid to repute
 */
router.put(
  '/upvote',
  [
    userValidator.isUserLoggedIn,
    reputationValidator.isUsernameExists,
    reputationValidator.isNotSelf,
    reputationValidator.isNotUpvoting,
    reputationValidator.isValidToRepute
  ],
  async (req: Request, res: Response) => {
    if (ReputationCollection.isDownvoting(req.session.userId, req.body.username)) {
      await ReputationCollection.removeDownvote(req.session.userId, req.body.username);
    }
    const reputationObj = await ReputationCollection.upvoteUser(req.session.userId, req.body.username);
    const response = await util.constructReputationResponse(reputationObj);

    res.status(200).json({
      message: 'Successfully upvoted user.',
      reputationObj: response
    });
  }
);

/**
 * Downvote another user.
 * 
 * @name PUT /api/reputation
 * 
 * @param {string} downvoteeUsername - username to be downvoted
 * @return {ReputationResponse} - updated user's reputation
 * @throws {400} if username is not given
 * @throws {404} if no user has given username
 * @throws {403} if user is not logged in
 * @throws {405} if user tries to downvote self
 * @throws {409} if user is already downvoting followee
 * @throws {409} if user is not valid to repute
 */
 router.put(
  '/downvote',
  [
    userValidator.isUserLoggedIn,
    reputationValidator.isUsernameExists,
    reputationValidator.isNotSelf,
    reputationValidator.isNotDownvoting,
    reputationValidator.isValidToRepute
  ],
  async (req: Request, res: Response) => {
    if (ReputationCollection.isUpvoting(req.session.userId, req.body.username)) {
      await ReputationCollection.removeUpvote(req.session.userId, req.body.username);
    }
    const reputationObj = await ReputationCollection.downvoteUser(req.session.userId, req.body.username);
    const response = await util.constructReputationResponse(reputationObj);

    res.status(200).json({
      message: 'Successfully downvoted user.',
      reputationObj: response
    });
  }
);

/**
 * Remove upvote for another user.
 * 
 * @name DELETE /api/reputation
 * 
 * @param {string} upvotee - username to be un-upvoted
 * @return {ReputationResponse} - updated user's reputation
 * @throws {400} if username is not given
 * @throws {404} if no user has given username
 * @throws {403} if user is not logged in
 * @throws {405} if user tries to remove upvote for self
 * @throws {409} if user is already not upvoting followee
 */
router.delete(
  '/removeUpvote',
  [
    userValidator.isUserLoggedIn,
    reputationValidator.isUsernameExists,
    reputationValidator.isNotSelf,
    reputationValidator.isUpvoting
  ],
  async (req: Request, res: Response) => {
    const reputationObj = await ReputationCollection.removeUpvote(req.session.userId, req.body.username);
    const response = await util.constructReputationResponse(reputationObj);

    res.status(200).json({
      message: 'Succesfully removed upvote.',
      reputationObj: response
    });
  }
);

/**
 * Remove downvote for another user.
 * 
 * @name DELETE /api/reputation
 * 
 * @param {string} downvotee - username to be un-downvoted
 * @return {ReputationResponse} - updated user's reputation
 * @throws {400} if username is not given
 * @throws {404} if no user has given username
 * @throws {403} if user is not logged in
 * @throws {405} if user tries to downvote self
 * @throws {409} if user is already downvoting followee
 */
 router.delete(
  '/removeDownvote',
  [
    userValidator.isUserLoggedIn,
    reputationValidator.isUsernameExists,
    reputationValidator.isNotSelf,
    reputationValidator.isDownvoting
  ],
  async (req: Request, res: Response) => {
    const reputationObj = await ReputationCollection.removeDownvote(req.session.userId, req.body.username);
    const response = await util.constructReputationResponse(reputationObj);

    res.status(200).json({
      message: 'Succesfully removed downvote.',
      reputationObj: response
    });
  }
);

export {router as reputationRouter};
