import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import { Freet } from '../freet/model';

/**
 * This file defines the properties stored in a View
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for View on the backend
export type View = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  viewerId: Types.ObjectId;
  dateViewed: Date;
  freetId: Types.ObjectId;
};

export type PopulatedView = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  viewerId: User;
  dateViewed: Date;
  freetId: Freet;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Views stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ViewSchema = new Schema<View>({
  // The viewer of the freet
  viewerId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was viewed
  dateViewed: {
    type: Date,
    required: true
  },
  // The freet which the view corresponds to
  freetId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  }
});

const ViewModel = model<View>('View', ViewSchema);
export default ViewModel;
