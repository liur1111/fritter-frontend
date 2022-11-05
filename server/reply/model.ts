import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import { Freet } from '../freet/model';

/**
 * This file defines the properties stored in a Reply
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Reply on the backend
export type Reply = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  freetId: Types.ObjectId;
};

export type PopulatedReply = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
  freetId: Freet;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Replies stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReplySchema = new Schema<Reply>({
  // The author of the freet
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the reply was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the reply
  content: {
    type: String,
    required: true
  },
  // The freet which the reply corresponds to
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }
});

const ReplyModel = model<Reply>('Reply', ReplySchema);
export default ReplyModel;
