import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReplyCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as replyValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the replies
 *
 * @name GET /api/replies
 *
 * @return {ReplyResponse[]} - A list of all the replies sorted in descending order by date modified
 */
/**
 * Get replies by freet.
 *
 * @name GET /api/replies?freetId=id
 *
 * @return {ReplyResponse[]} - An array of replies created by post with freetId 
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if freetId query parameter was supplied
    if (req.query.freetId !== undefined) {
      next();
      return;
    }

    const allReplies = await ReplyCollection.findAll();
    const response = allReplies.map(util.constructReplyResponse);
    res.status(200).json(response);
  }, 
  [
    freetValidator.isFreetQueryExists
  ],
  async (req: Request, res: Response) => {
    const freetReplies = await ReplyCollection.findAllByFreetID(req.query.freetId as string);
    const response = freetReplies.map(util.constructReplyResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new reply.
 *
 * @name POST /api/replies
 *
 * @param {string} content - The content of the reply
 * @param {string} freetId - The freetId which corresponds to the reply
 * @return {ReplyResponse} - The created reply
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the reply content is empty or a stream of empty spaces
 * @throws {413} - If the reply content is more than 140 characters long
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    replyValidator.isFreetExists,
    replyValidator.isValidReplyContent
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const reply = await ReplyCollection.addOne(userId, req.body.content, req.body.freetId);

    res.status(201).json({
      message: 'Your reply was created successfully.',
      reply: util.constructReplyResponse(reply)
    });
  }
);

/**
 * Delete a reply
 *
 * @name DELETE /api/replies/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of the reply
 * @throws {404} - If the freetId is not valid
 */
router.delete(
  '/:replyId?',
  [
    userValidator.isUserLoggedIn,
    replyValidator.isReplyExists,
    replyValidator.isValidReplyModifier
  ],
  async (req: Request, res: Response) => {
    await ReplyCollection.deleteOne(req.params.replyId);
    res.status(200).json({
      message: 'Your reply was deleted successfully.'
    });
  }
);

export {router as replyRouter};
