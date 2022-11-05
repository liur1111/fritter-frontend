import type {HydratedDocument, Types} from 'mongoose';
import type {Reply} from './model';
import ReplyModel from './model';

/**
 * This files contains a class that has the functionality to explore replies
 * stored in MongoDB, including adding, finding, and deleting replies.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Reply> is the output of the ReplyModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class ReplyCollection {
  /**
   * Add a reply to the collection
   *
   * @param {string} authorId - The id of the author of the reply
   * @param {string} content - The id of the content of the reply
   * @param {string} freetId - The id of the post of the reply
   * @return {Promise<HydratedDocument<Reply>>} - The newly created reply
   */
  static async addOne(authorId: Types.ObjectId | string, content: string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Reply>> {
    const date = new Date();
    const reply = new ReplyModel({
      authorId,
      dateCreated: date,
      content,
      freetId: freetId
    });
    await reply.save(); // Saves reply to MongoDB
    return reply.populate(['authorId']);
  }

  /**
   * Find a reply by replyId
   *
   * @param {string} replyId - The id of the reply to find
   * @return {Promise<HydratedDocument<Reply>> | Promise<null> } - The reply with the given reply, if any
   */
  static async findOne(replyId: Types.ObjectId | string): Promise<HydratedDocument<Reply>> {
    return ReplyModel.findOne({_id: replyId}).populate('authorId');
  }

  /**
   * Get all the replies in the database
   *
   * @return {Promise<HydratedDocument<Reply>[]>} - An array of all of the replies
   */
  static async findAll(): Promise<Array<HydratedDocument<Reply>>> {
    // Retrieves replies and sorts them from most to least recent
    return ReplyModel.find({}).sort({dateCreated: -1}).populate(['authorId']);
  }

  /**
   * Get all the replies for a given freet
   *
   * @param {string} freetId - The freetID which the replies correspond to
   * @return {Promise<HydratedDocument<Reply>[]>} - An array of all of the replies
   */
  static async findAllByFreetID(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Reply>>> {
    // Retrieves replies and sorts them from most to least recent
    return ReplyModel.find({freetId: freetId}).sort({dateCreated: -1}).populate(['authorId']);
  }

  /**
   * Delete a reply with given replyId.
   *
   * @param {string} replyId - The replyId of reply to delete
   * @return {Promise<Boolean>} - true if the reply has been deleted, false otherwise
   */
  static async deleteOne(replyId: Types.ObjectId | string): Promise<boolean> {
    const reply = await ReplyModel.deleteOne({_id: replyId});
    return reply !== null;
  }

  /**
   * Delete all the replies by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteManyByAuthor(authorId: Types.ObjectId | string): Promise<void> {
    await ReplyModel.deleteMany({authorId});
  }

  /**
   * Delete all the replies for the given freet
   *
   * @param {string} freetId - The id of freet
   */
  static async deleteManyByFreet(freetId: Types.ObjectId | string): Promise<void> {
    await ReplyModel.deleteMany({freetId});
  }
  
}

export default ReplyCollection;
