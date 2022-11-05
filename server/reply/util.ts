import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Reply, PopulatedReply} from './model';

// Update this if you add a property to the Reply type!
type ReplyResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  freetId: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Reply object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reply>} reply - A reply
 * @returns {ReplyResponse} - The reply object formatted for the frontend
 */
const constructReplyResponse = (reply: HydratedDocument<Reply>): ReplyResponse => {
  const replyCopy: PopulatedReply = {
    ...reply.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = replyCopy.authorId;
  delete replyCopy.authorId;
  return {
    ...replyCopy,
    _id: replyCopy._id.toString(),
    author: username,
    dateCreated: formatDate(reply.dateCreated),
    freetId: replyCopy.freetId._id.toString()
  };
};

export {
  constructReplyResponse
};
