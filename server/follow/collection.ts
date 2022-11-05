import type {HydratedDocument, Types} from 'mongoose';
import type {User} from '../user/model';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore follows
 * stored in MongoDB, including adding, finding, updating, and deleting follows.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Follow> is the output of the FollowModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
 class FollowCollection {
  /**
   * Add a follow to the collection
   *
   * @param {User} user - The user of the object
   * @return {Promise<HydratedDocument<Follow>>} - The newly created follow
   */
  static async addOne(user: User): Promise<HydratedDocument<Follow>> {
    const newFollow = new FollowModel({
      user: user, 
      followers: [], 
      following: []
    });

    await newFollow.save(); // Saves follow to MongoDB
    return newFollow;
  }

  /**
   * Remove a follow from the collection
   *
   * @param {Types.ObjectId} userID - The userId of the current user to be deleted
   * @return {Promise<Boolean>} - True if user succesfully deleted, else False
   */
   static async removeOne(userID: Types.ObjectId): Promise<Boolean> {
    const removedFollow = await FollowModel.deleteOne({user: userID});

    await FollowModel.updateMany({followers: [userID]}, {
      $pullAll: {
        followers: [userID] 
      }
    });

    await FollowModel.updateMany({following: [userID]}, {
      $pullAll: {
        following: [userID]
      }
    });

    return removedFollow['acknowledged'] == true && removedFollow['deletedCount'] == 1;
  }

  /**
   * Check if user is following followee
   * 
   * @param {Types.ObjectId} userId - The userId of the current user
   * @param {string} username - followee username
   * @return {Promise<boolean>} - Returns true if the user is following the followee, else false
   */
  static async isFollowing(userId: Types.ObjectId, username: string): Promise<boolean> {
    const followeeObj = await UserCollection.findOneByUsername(username);
    const followObj = await FollowModel.findOne({user: userId, following: followeeObj._id});
    return followObj !== null;
  }

  /**
   * Get all accounts followed by and following the userID
   * Use to find the number of followers and following on a user's profile.
   * 
   * @param {Types.ObjectId} userID - The userId of the current user
   * @return {Promise<HydratedDocument<Follow>>} - the user's follow object
   */
  static async findFollowByID(userID: Types.ObjectId): Promise<HydratedDocument<Follow>> {
    const followObj = await FollowModel.findOne({user: userID});
    return followObj;
  }

   /**
   * Get all accounts followed by and following the username
   * Use to find the number of followers and following on a user's profile.
   * 
   * @param {string} username - The username of the user of the object
   * @return {Promise<HydratedDocument<Follow>>} - the user's follow object
   */
  static async findFollowByUsername(username: string): Promise<HydratedDocument<Follow>> {
    const userObj = await UserCollection.findOneByUsername(username);
    const followObj = await FollowModel.findOne({user: userObj._id});
    return followObj;
  }

  /**
   * Follow another account 
   * 
   * @param {Types.ObjectId} userId - The userId of the current user
   * @param {string} username - username of the user that userId will follow
   * @return {Promise<HydratedDocument<Follow>>} - the user's follow object
   */
  static async followUser(userID: Types.ObjectId, username: string): Promise<HydratedDocument<Follow>> {
    const followerObj = await FollowModel.findOne({user: userID});
    const followeeUserObj = await UserCollection.findOneByUsername(username);
    const followeeObj = await FollowModel.findOne({user: followeeUserObj._id});

    followerObj.following.push(followeeUserObj._id);
    followeeObj.followers.push(userID);

    await followerObj.save();
    await followeeObj.save();
    return followerObj;
  }

  /**
   * Unfollow another account 
   * 
   * @param {Types.ObjectId} userID - The userId of the current user
   * @param {string} username - username of the user that userId will unfollow
   * @return {Promise<HydratedDocument<Follow>>} - the user's follow object
   */
     static async unfollowUser(userID: Types.ObjectId, username: string): Promise<HydratedDocument<Follow>> {
      const followee = await UserCollection.findOneByUsername(username);

      await FollowModel.findOneAndUpdate({user: userID}, {
        $pullAll: {
          following: [followee._id],
        }
      });

      await FollowModel.findOneAndUpdate({user: followee._id}, {
        $pullAll: {
          followers: [userID],
        }
      });
    
      const followerObj = await FollowModel.findOne({user: userID});
      return followerObj;
    }
  
}

export default FollowCollection;
