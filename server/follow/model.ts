import {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Follow
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Follow on the backend
export type Follow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
};

export type PopulatedFollow = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  followers: User[];
  following: User[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Follows stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FollowSchema = new Schema<Follow>({
  // User for this object
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // Array of all accounts following the user
  followers: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  }],
  // Array of all accounts followed by the user
  following: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }]
});

const FollowModel = model<Follow>('Follow', FollowSchema);
export default FollowModel;
