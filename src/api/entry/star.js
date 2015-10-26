import Express from 'express';
import { sequelize } from '../../db/index.js';
import authRequired from '../lib/authRequired.js';

export const router = new Express.Router();
export default router;

/**
 * @api {post} /entries/:author/:name/stars Star the entry
 * @apiGroup Entry/Star
 * @apiName StarEntry
 * @apiUse EntryGet
 * @apiDescription Gives a star to the entry.
 *
 *   This will fail if the user already gave a star to the entry.
 *   If that happens, this'll return 409 Conflict.
 * @apiUse AuthRequired
 */
router.post('/stars', authRequired, (req, res) => {
  sequelize.transaction(transaction =>
    req.selEntry.hasStarredUser(req.user, { transaction })
    .then(result => {
      if (result) {
        res.status(409);
        res.json({
          id: 'ENTRY_ALREADY_STARRED',
          message: 'You already have starred the entry.'
        });
        return;
      }
      return req.selEntry.addStarredUser(req.user, { transaction })
      .then(() => {
        return req.selEntry.update({
          stars: req.selEntry.stars + 1
        }, { transaction })
        .then(() => {
          res.json(Object.assign({}, req.selEntry.toJSON(), {
            voted: true
          }));
        });
      });
    })
  )
  .catch(err => {
    console.log(err);
    res.status(500);
    res.json(err);
  });
});

/**
 * @api {delete} /entries/:author/:name/stars Unstar the entry
 * @apiGroup Entry/Star
 * @apiName UntarEntry
 * @apiUse EntryGet
 * @apiDescription Unstars the entry.
 *
 *   This will fail if the user hasn't given a star yet.
 *   If that happens, this'll return 404 Not Found.
 * @apiUse AuthRequired
 */
router.delete('/stars', authRequired, (req, res) => {
  sequelize.transaction(transaction =>
    req.selEntry.hasStarredUser(req.user, { transaction })
    .then(result => {
      if (!result) {
        res.status(404);
        res.json({
          id: 'ENTRY_NOT_STARRED',
          message: 'You haven\'t starred the entry.'
        });
        return;
      }
      return req.selEntry.removeStarredUser(req.user, { transaction })
      .then(() => {
        return req.selEntry.update({
          stars: req.selEntry.stars - 1
        }, { transaction })
        .then(() => {
          res.json(Object.assign({}, req.selEntry.toJSON(), {
            voted: false,
            tags: undefined,
            description: undefined,
            script: undefined
          }));
        });
      });
    })
  )
  .catch(err => {
    console.log(err);
    res.status(500);
    res.json(err);
  });
});
/**
 * @api {get} /entries/:author/:name/stars Get users starred the entry
 * @apiGroup Entry/Star
 * @apiName EntryUserStarred
 * @apiUse EntryGet
 * @apiDescription Returns the full list of users who has starred the entry.
 */
router.get('/stars', authRequired, (req, res) => {
  // TODO pagination?
  req.selEntry.getStarredUsers({
    attributes: ['username', 'name', 'photo']
  })
  .then(users => {
    res.json(users.map(entry => {
      let displayEntry = entry.toJSON();
      Object.assign(displayEntry, {
        starredEntry: undefined
      });
      return displayEntry;
    }));
  })
  .catch(err => {
    console.log(err);
    res.status(500);
    res.json(err);
  });
});
