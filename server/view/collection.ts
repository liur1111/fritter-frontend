import FreetCollection from '../freet/collection';
import type {HydratedDocument, Types} from 'mongoose';
import type {View} from './model';
import ViewModel from './model';

/**
 * This files contains a class that has the functionality to explore views
 * stored in MongoDB, including adding and deleting views.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<View> is the output of the ViewModel() constructor,
 * and contains all the information in View. https://mongoosejs.com/docs/typescript.html
 */
class ViewCollection {
  /**
   * Add a view to the collection
   *
   * @param {string} viewerId - The id of the viewer
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<View>>} - The newly created view
   */
  static async addOne(viewerId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<View>> {
    const date = new Date();
    const view = new ViewModel({
      viewerId,
      dateViewed: date,
      freetId: freetId
    });
    await view.save(); // Saves view to MongoDB
    return view.populate(['viewerId']);
  }

  /**
   * Get all the views for a given freet
   *
   * @param {string} freetId - The freetID which the replies correspond to
   * @return {Promise<number>} - The freet's views
   */
  static async getViewsByID(freetId: Types.ObjectId | string): Promise<number> {
    return await ViewModel.count({freetId: freetId});
  }

  /**
   * Check if given user can repute - has seen at least 3 freets by a user
   * 
   * @param {string} viewerId - the id of the viewer
   * @param {string} username - the username of the author
   * @return {Promise<boolean>} - True if user can repute, else false
   */
  static async hasSeenEnough(viewerId: Types.ObjectId | string, username: string): Promise<boolean> {
    const freets = await FreetCollection.findAllByUsername(username);
    console.log(freets);
    const view = await ViewModel.find({viewerId: viewerId, freetId: freets});
    return view.length >= 3;
  }

  /**
   * Check if viewer is just refreshing freet over and over 
   * 
   * @param {string} viewerId - the id of the viewer
   * @param {string} freetId - the id of the freet
   * @return {Promise<boolean>} - True if same viewer takes at least 30 seconds to see freet again
   */
  static async isLongEnough(viewerId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<boolean> {
    const date = new Date();
    const viewObj = await ViewModel.find({viewerId: viewerId, freetId: freetId}).sort({dateViewed: -1}).limit(1);
    const oldestDate = (viewObj.length == 1) ? viewObj[0].dateViewed : null;
    oldestDate.setSeconds(oldestDate.getSeconds() + 30);
    return oldestDate < date;
  }

  /**
   * Delete all the views for the given freet
   *
   * @param {string} freetId - The id of freet
   */
  static async deleteManyByFreet(freetId: Types.ObjectId | string): Promise<void> {
    await ViewModel.deleteMany({freetId});
  }
  
}

export default ViewCollection;
