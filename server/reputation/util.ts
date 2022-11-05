import {HydratedDocument, Types} from 'mongoose';
import type {Reputation, PopulatedReputation} from './model';
import {User} from '../user/model';
import UserCollection from '../user/collection';
import ReputationCollection from './collection';

// Update this if you add a property to the Reputation type!
type ReputationResponse = {
  _id: string;
  user: string;
  upvoters: string[];
  upvoting: string[];
  downvoters: string[];
  downvoting: string[];
  reputation: number;
};

/**
 * Transform a raw Reputation object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reputation>} reputationObj - A reputation object
 * @returns {ReputationResponse} - The reputation object formatted for the frontend
 */
const constructReputationResponse = async (reputationObj: HydratedDocument<Reputation>): Promise<ReputationResponse> => {
  const reputationCopy: PopulatedReputation = {
    ...reputationObj.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  const userObj = await UserCollection.findOneByUserId(reputationObj.user);

  const upvoters = await reputationObj.populate<{upvoters: User[]}>({
    path: 'upvoters'
  }).then(reputationObj => reputationObj.upvoters.map(user => user.username));

  const upvoting = await reputationObj.populate<{upvoting: User[]}>({
    path: 'upvoting'
  }).then(reputationObj => reputationObj.upvoting.map(user => user.username));

  const downvoters = await reputationObj.populate<{downvoters: User[]}>({
    path: 'downvoters'
  }).then(reputationObj => reputationObj.downvoters.map(user => user.username));

  const downvoting = await reputationObj.populate<{downvoting: User[]}>({
    path: 'downvoting'
  }).then(reputationObj => reputationObj.downvoting.map(user => user.username));

  const reputation = await ReputationCollection.findReputationByID(reputationObj.user);

  return {
    ...reputationCopy,
    _id: reputationCopy._id.toString(),
    user: userObj.username,
    upvoters: upvoters,
    upvoting: upvoting,
    downvoters: downvoters,
    downvoting: downvoting,
    reputation: reputation
  };

};

export {
  constructReputationResponse
};
