import Express from 'express';
import { sequelize } from '../../db/index.js';
import authRequired from '../lib/authRequired.js';
import adminRequired from '../lib/adminRequired.js';

export const router = new Express.Router();
export default router;

/**
 * @api {post} /entries/:author/:name/reports Report the entry
 * @apiGroup Entry
 * @apiName ReportEntry
 * @apiUse EntryGet
 * @apiDescription Report the entry.
 *
 *   This will silently fail if the user already reported the entry.
 *   However, nothing will be shown to the user; it's hidden.
 * @apiUse AuthRequired
 */
router.post('/reports', authRequired, (req, res) => {
  sequelize.transaction(transaction =>
    req.selEntry.hasReportedUser(req.user, { transaction })
    .then(result => {
      if (result) {
        res.json(req.selEntry.toJSON());
        return;
      }
      return req.selEntry.addReportedUser(req.user, { transaction })
      .then(() => {
        return req.selEntry.update({
          reports: req.selEntry.reports + 1
        }, { transaction })
        .then(() => {
          res.json(req.selEntry.toJSON());
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
 * @api {delete} /entries/:author/:name/reports Clear reported count
 * @apiGroup Entry
 * @apiName ClearReportEntry
 * @apiUse EntryGet
 * @apiDescription Clears reported count.
 *
 *   However, this won't clear already reported user list, so
 *   already reported user won't be able to increment the count.
 *
 *   This will fail if the user isn't admin.
 * @apiUse AuthRequired
 * @apiUse modifiable
 * @apiPermission modifiable
 */
router.delete('/reports', adminRequired, (req, res) => {
  req.selEntry.update({
    reports: 0
  })
  .then(() => {
    res.json(Object.assign({}, req.selEntry.toJSON(), {
      tags: undefined,
      description: undefined,
      script: undefined
    }));
  })
  .catch(err => {
    console.log(err);
    res.status(500);
    res.json(err);
  });
});
/**
 * @api {get} /entries/:author/:name/reports Get users reported the entry
 * @apiGroup Entry
 * @apiName EntryUserReported
 * @apiUse EntryGet
 * @apiDescription Returns users who has reported the entry.
 *
 *   This will fail if the user isn't admin.
 * @apiUse AuthRequired
 * @apiUse modifiable
 * @apiPermission modifiable
 */
router.get('/reports', adminRequired, (req, res) => {
  // TODO pagination?
  req.selEntry.getReportedUsers({
    attributes: ['username', 'name', 'photo']
  })
  .then(users => {
    res.json(users.map(entry => {
      let displayEntry = entry.toJSON();
      Object.assign(displayEntry, {
        reportedEntry: undefined
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
