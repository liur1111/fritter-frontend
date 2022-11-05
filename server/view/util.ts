import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {View, PopulatedView} from './model';
import ViewCollection from './collection';

// Update this if you add a property to the Reply type!
type ViewResponse = {
  _id: string;
  viewerId: string;
  dateViewed: string;
  freetId: string;
  numViews: Promise<number>;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw View object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<View>} view - A view
 * @returns {ViewResponse} - The view object formatted for the frontend
 */
const constructViewResponse = (view: HydratedDocument<View>): ViewResponse => {
  const viewCopy: PopulatedView = {
    ...view.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = viewCopy.viewerId;
  const numViews = ViewCollection.getViewsByID(view.freetId);
  delete viewCopy.viewerId;
  return {
    ...viewCopy,
    _id: viewCopy._id.toString(),
    viewerId: username,
    dateViewed: formatDate(view.dateViewed),
    freetId: viewCopy.freetId._id.toString(),
    numViews: numViews
  };
};

export {
  constructViewResponse
};
