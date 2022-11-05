import type {Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as viewValidator from './middleware';
import * as util from './util';
import ViewCollection from './collection';

const router = express.Router();

/**
 * Get views by freet.
 *
 * @name GET /api/views?freetId=id
 *
 * @return {ViewResponse} - Views created by post with freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 */
router.get(
  '/',
  [
    freetValidator.isFreetQueryExists
  ],
  async (req: Request, res: Response) => {
    const viewObj = await ViewCollection.getViewsByID(req.query.freetId as string);
    res.status(200).json({"numViews": viewObj});
  }
);

/**
 * Create a new view.
 *
 * @name POST /api/views
 *
 * @param {string} viewerId - The viewer
 * @param {string} freetId - The freetId 
 * @return {ViewResponse} - The created reply
 * @throws {403} - If the user is not logged in
 * @throws {413} - If the user refreshes the freet (re-clicks on freet) within 30 seconds
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    viewValidator.isLongEnough
  ],
  async (req: Request, res: Response) => {
    const viewerId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const viewObj = await ViewCollection.addOne(viewerId, req.body.freetId);
    const response = util.constructViewResponse(viewObj);
    res.status(201).json(response);
  }
);

export {router as viewRouter};
