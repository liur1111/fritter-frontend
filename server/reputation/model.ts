import {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Reputation
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Reputation on the backend
export type Reputation = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  upvoters: Types.ObjectId[];
  upvoting: Types.ObjectId[];
  downvoters: Types.ObjectId[];
  downvoting: Types.ObjectId[];
};

export type PopulatedReputation = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  upvoters: User[];
  upvoting: User[];
  downvoters: User[];
  downvoting: User[];
};

// Mongoose schema definition for interfacing with a MongoDB table
// Reputations stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReputationSchema = new Schema<Reputation>({
  // User for this object
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // Array of all accounts upvoting the user
  upvoters: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  }],
  // Array of all accounts upvoted by the user
  upvoting: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }],
  // Array of all accounts downvoting the user
  downvoters: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  }],
  // Array of all accounts downvoted by the user
  downvoting: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }]
});

const ReputationModel = model<Reputation>('Reputation', ReputationSchema);
export default ReputationModel;
