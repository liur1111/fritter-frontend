import type {Request, Response, NextFunction} from 'express';
import ViewCollection from './collection';

/**
 * viewer is just refreshing freet over and over
 */
const isLongEnough = async (req: Request, res: Response, next: NextFunction) => {
  const view = await ViewCollection.isLongEnough(req.session.userId, req.body.freetId);
  if (!view) {
    res.status(413).json({
      error: {
        viewTooSoon: `Viewed too soon.`
      }
    });
    return;
  }

  next();
};

export {
  isLongEnough
};
