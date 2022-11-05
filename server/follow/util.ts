import {HydratedDocument, Types} from 'mongoose';
import type {Follow, PopulatedFollow} from './model';
import UserCollection from '../user/collection';
import {User} from '../user/model';

// Update this if you add a property to the Follow type!
type FollowResponse = {
  _id: string;
  user: string;
  followers: string[];
  following: string[];
};

/**
 * Transform a raw Follow object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Follow>} followObj - A follow object
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
const constructFollowResponse = async (followObj: HydratedDocument<Follow>): Promise<FollowResponse> => {
  const followCopy: PopulatedFollow = {
    ...followObj.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  const userObj = await UserCollection.findOneByUserId(followObj.user);

  const followers = await followObj.populate<{followers: User[]}>({
    path: 'followers'
  }).then(followObj => followObj.followers.map(user => user.username));

  const following = await followObj.populate<{following: User[]}>({
    path: 'following'
  }).then(followObj => followObj.following.map(user => user.username));

  return {
    ...followCopy,
    _id: followCopy._id.toString(),
    user: userObj.username,
    followers: followers,
    following: following,
  };

};

export {
  constructFollowResponse
};
