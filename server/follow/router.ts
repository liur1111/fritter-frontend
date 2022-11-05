import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as followValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get curernt user's followers
 * 
 * @name GET /api/follow
 * 
 * @return {FollowResponse} - user's followers
 * @throws {403} if user is not logged in
 */
/**
 * Get user's followers by username
 *
 * @name GET /api/follow?username=username
 *
 * @return {FollowResponse} - user USERNAME's followers
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
      console.log("UNDEFINED");
      next();
      return;
    }

    const followObj = await FollowCollection.findFollowByID(req.session.userId);
    const response = await util.constructFollowResponse(followObj);
    res.status(200).json({
      message: 'Successfully retrieved your followers',
      followObj: response
    });
  },
  [
    followValidator.getUsernameExists
  ],
  async (req: Request, res: Response) => {
    console.log("MADE IT");
    const followObj = await FollowCollection.findFollowByUsername(req.query.username as string);
    const response = await util.constructFollowResponse(followObj);
    res.status(200).json({
      message: `Successfully retrieved followers for ${req.query.username as string}`,
      followObj: response
    });
  }
);

/**
 * Follow another user.
 * 
 * @name PUT /api/follow
 * 
 * @param {string} followeeUsername - username to be followed
 * @return {FollowResponse} - updated user's followers
 * @throws {400} if username is not given
 * @throws {404} if no user has given username
 * @throws {403} if user is not logged in
 * @throws {405} if user tries to follow self
 * @throws {409} if user is already following followee
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.isUsernameExists,
    followValidator.isNotSelf,
    followValidator.isNotFollowing
  ],
  async (req: Request, res: Response) => {
    const followObj = await FollowCollection.followUser(req.session.userId, req.body.username);
    const response = await util.constructFollowResponse(followObj);

    res.status(200).json({
      message: 'Successfully followed user.',
      followObj: response
    });
  }
);

/**
 * Unfollow another user.
 * 
 * @name DELETE /api/follow
 * 
 * @param {string} followeeUsername - username to be unfollowed
 * @return {FollowResponse} - updated user's followers
 * @throws {400} if username is not given
 * @throws {404} if no user has given username
 * @throws {403} if user is not logged in
 * @throws {405} if user tries to unfollow self
 * @throws {409} if user is already unfollowing followee
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.isUsernameExists,
    followValidator.isNotSelf,
    followValidator.isFollowing
  ],
  async (req: Request, res: Response) => {
    const followObj = await FollowCollection.unfollowUser(req.session.userId, req.body.username);
    const response = await util.constructFollowResponse(followObj);

    res.status(200).json({
      message: 'Succesfully unfollowed user.',
      followObj: response
    });
  }
);


export {router as followRouter};
