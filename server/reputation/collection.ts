import type {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import type {Reputation} from './model';
import ReputationModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore reputation
 * stored in MongoDB, including adding, finding, updating, and deleting reputation.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Reputation> is the output of the ReputationModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
 class ReputationCollection {
  /**
   * Add a reputation to the collection
   *
   * @param {User} user - The user of the object
   * @return {Promise<HydratedDocument<Reputation>>} - The newly created reputation
   */
  static async addOne(user: User): Promise<HydratedDocument<Reputation>> {
    const newReputation = new ReputationModel({
      user: user, 
      upvoters: [], 
      upvoting: [],
      downvoters: [],
      downvoting: []
    });

    await newReputation.save(); // Saves reputation to MongoDB
    return newReputation;
  }

  /**
   * Remove a reputation from the collection
   *
   * @param {Types.ObjectId} userID - The userId of the current user to be deleted
   * @return {Promise<Boolean>} - True if user succesfully deleted, else False
   */
   static async removeOne(userID: Types.ObjectId): Promise<Boolean> {
    const removedReputation = await ReputationModel.deleteOne({user: userID});

    await ReputationModel.updateMany({upvoters: [userID]}, {
      $pullAll: {
        upvoters: [userID] 
      }
    });

    await ReputationModel.updateMany({upvoting: [userID]}, {
      $pullAll: {
        upvoting: [userID]
      }
    });

    await ReputationModel.updateMany({downvoters: [userID]}, {
      $pullAll: {
        downvoters: [userID] 
      }
    });

    await ReputationModel.updateMany({downvoting: [userID]}, {
      $pullAll: {
        downvoting: [userID]
      }
    });

    return removedReputation['acknowledged'] == true && removedReputation['deletedCount'] == 1;
  }

  /**
   * Check if user is upvoting followee
   * 
   * @param {Types.ObjectId} userId - The userId of the current user
   * @param {string} username - followee username
   * @return {Promise<boolean>} - Returns true if the user is upvoting the followee, else false
   */
  static async isUpvoting(userId: Types.ObjectId, username: string): Promise<boolean> {
    const upvoteeObj = await UserCollection.findOneByUsername(username);
    const reputationObj = await ReputationModel.findOne({user: userId, upvoting: upvoteeObj._id});
    return reputationObj !== null;
  }

  /**
   * Check if user is downvoting followee
   * 
   * @param {Types.ObjectId} userId - The userId of the current user
   * @param {string} username - followee username
   * @return {Promise<boolean>} - Returns true if the user is downvoting the followee, else false
   */
  static async isDownvoting(userId: Types.ObjectId, username: string): Promise<boolean> {
    const downvoteeObj = await UserCollection.findOneByUsername(username);
    const reputationObj = await ReputationModel.findOne({user: userId, downvoting: downvoteeObj._id});
    return reputationObj !== null;
  }

  /**
   * Get reputation of userID
   * 
   * @param {Types.ObjectId} userID - The userId of the current user
   * @return {Promise<Number>} - the user's reputation
   */
  static async findReputationByID(userID: Types.ObjectId): Promise<number> {
    const reputationObj = await ReputationModel.findOne({user: userID});
    return reputationObj.upvoters.length - reputationObj.downvoters.length;
  }

   /**
   * Get reputation of user with username
   * 
   * @param {string} username - The username of the user of the object
   * @return {Promise<Number>} - the user's follow object
   */
  static async findReputationByUsername(username: string): Promise<number> {
    const userObj = await UserCollection.findOneByUsername(username);
    const reputationObj = await ReputationModel.findOne({user: userObj._id});
    return reputationObj.upvoters.length - reputationObj.downvoters.length;
  }

  /**
   * Upvote another account 
   * 
   * @param {Types.ObjectId} userId - The userId of the current user
   * @param {string} username - username of the user that userId will upvote
   * @return {Promise<HydratedDocument<Reputation>>} - the user's reputation object
   */
  static async upvoteUser(userID: Types.ObjectId, username: string): Promise<HydratedDocument<Reputation>> {
    const upvoterObj = await ReputationModel.findOne({user: userID});
    const upvoteeUserObj = await UserCollection.findOneByUsername(username);
    const upvoteeObj = await ReputationModel.findOne({user: upvoteeUserObj._id});

    upvoterObj.upvoting.push(upvoteeUserObj._id);
    upvoteeObj.upvoters.push(userID);

    await upvoterObj.save();
    await upvoteeObj.save();
    return upvoterObj;
  }

   /**
   * Downvote another account 
   * 
   * @param {Types.ObjectId} userId - The userId of the current user
   * @param {string} username - username of the user that userId will downvote
   * @return {Promise<HydratedDocument<Reputation>>} - the user's reputation object
   */
  static async downvoteUser(userID: Types.ObjectId, username: string): Promise<HydratedDocument<Reputation>> {
    const downvoterObj = await ReputationModel.findOne({user: userID});
    const downvoteeUserObj = await UserCollection.findOneByUsername(username);
    const downvoteeObj = await ReputationModel.findOne({user: downvoteeUserObj._id});

    downvoterObj.downvoting.push(downvoteeUserObj._id);
    downvoteeObj.downvoters.push(userID);

    await downvoterObj.save();
    await downvoteeObj.save();
    return downvoterObj;
  }

  /**
   * Remove an upvote for another account 
   * 
   * @param {Types.ObjectId} userID - The userId of the current user
   * @param {string} username - username of the user that userId will un-upvote
   * @return {Promise<HydratedDocument<Reputation>>} - the user's reputation object
   */
  static async removeUpvote(userID: Types.ObjectId, username: string): Promise<HydratedDocument<Reputation>> {
    const upvotee = await UserCollection.findOneByUsername(username);

    await ReputationModel.findOneAndUpdate({user: userID}, {
      $pullAll: {
        upvoting: [upvotee._id],
      }
    });

    await ReputationModel.findOneAndUpdate({user: upvotee._id}, {
      $pullAll: {
        upvoters: [userID],
      }
    });
  
    const reputationObj = await ReputationModel.findOne({user: userID});
    return reputationObj;
  }

  /**
   * Remove an downvote for another account 
   * 
   * @param {Types.ObjectId} userID - The userId of the current user
   * @param {string} username - username of the user that userId will un-downvote
   * @return {Promise<HydratedDocument<Reputation>>} - the user's reputation object
   */
  static async removeDownvote(userID: Types.ObjectId, username: string): Promise<HydratedDocument<Reputation>> {
    const downvotee = await UserCollection.findOneByUsername(username);

    await ReputationModel.findOneAndUpdate({user: userID}, {
      $pullAll: {
        downvoting: [downvotee._id],
      }
    });

    await ReputationModel.findOneAndUpdate({user: downvotee._id}, {
      $pullAll: {
        downvoters: [userID],
      }
    });
  
    const reputationObj = await ReputationModel.findOne({user: userID});
    return reputationObj;
  }
  
}

export default ReputationCollection;
