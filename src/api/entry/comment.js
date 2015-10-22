import Express from 'express';
import { Comment, User } from '../../db/index.js';
import authRequired from '../lib/authRequired.js';
import adminRequired from '../lib/adminRequired.js';

function checkModifiable(req, res, next) {
  if (req.comment.authorId !== req.user.id) {
    adminRequired(req, res, next);
    return;
  }
  next();
}

export const router = new Express.Router();
export default router;

/**
 * @api {get} /entries/:author/:name/comments Get a list of comments
 * @apiGroup Entry/Comment
 * @apiName EntryCommentList
 * @apiUse EntryGet
 * @apiParam (Query) {Integer} [lastIndex] The last comment's ID you've seen
 * @apiDescription Returns a list of comments of the entry.
 *
 *   Pagination is done with 'lastIndex'. Send last comment index you've seen
 *   and this will send comments starting from there.
 */
router.get('/comments', (req, res) => {
  // Entry and the user is accessible /w req.selEntry and req.user
  // However, req.user isn't required in here.
  let query = {
    limit: 20,
    order: [['id', 'AESC']],
    include: [{
      model: User,
      as: 'author',
      attributes: ['username', 'name', 'photo']
    }],
    attributes: ['id', 'description']
  };
  if (req.query.lastIndex) {
    query.where = {
      id: {
        $gt: req.query.lastIndex
      }
    };
  }
  req.selEntry.getComments(query)
  .then(comments => {
    res.json(comments);
  })
  .catch(err => {
    console.log(err);
    res.status(500);
    res.json(err);
  });
});

/**
 * @api {post} /entries/:author/:name/comments Post a new comment
 * @apiGroup Entry/Comment
 * @apiName EntryCommentPost
 * @apiUse EntryGet
 * @apiUse AuthRequired
 * @apiParam (Body) {String} description The comment's description
 * @apiDescription Posts a new comment on the entry.
 *
 *   This will send a notification to the author of the entry. Also, if there is
 *   @ (at) tag in the comment description, this will find the user and send a
 *   notification too.
 */
router.post('/comments', authRequired, (req, res) => {
  const { description } = req.body;
  if (!description) {
    res.status(400);
    res.json({
      id: 'INVALID_DESCRIPTION',
      message: 'Description is invalid.'
    });
    return;
  }
  Comment.create({
    authorId: req.user.id,
    entryId: req.selEntry.id,
    description
  })
  .then(comment => {
    res.json(Object.assign({}, comment.toJSON(), {
      author: req.user,
      authorId: undefined,
      entryId: undefined
    }));
  })
  .catch(err => {
    console.log(err);
    res.status(500);
    res.json(err);
  });
});

const commentRouter = new Express.Router();

router.use('/comments/:id', (req, res, next) => {
  Comment.findOne({
    where: {
      id: req.params.id,
      entryId: req.selEntry.id
    },
    include: [{
      model: User,
      as: 'author',
      attributes: ['username', 'name', 'photo']
    }]
  })
  .then(comment => {
    if (comment == null) {
      res.status(404);
      res.json({
        id: 'COMMENT_NOT_FOUND',
        message: 'Specified comment is not found.'
      });
      return;
    }
    req.comment = comment;
    next();
  })
  .catch(err => {
    console.log(err);
    res.status(500);
    res.json(err);
  });
}, commentRouter);

/**
 * @api {get} /entries/:author/:name/comments/:id Get the comment
 * @apiGroup Entry/Comment
 * @apiName EntryCommentGet
 * @apiUse EntryGet
 * @apiParam (Parameter) {Integer} id The ID of the comment
 * @apiDescription Returns the comment of the entry.
 */
commentRouter.get('/', (req, res) => {
  res.json(Object.assign({}, req.comment.toJSON(), {
    authorId: undefined,
    entryId: undefined
  }));
});

/**
 * @api {put} /entries/:author/:name/comments/:id Edit the comment
 * @apiGroup Entry/Comment
 * @apiName EntryCommentEdit
 * @apiUse EntryGet
 * @apiUse modifiable
 * @apiPermission modifiable
 * @apiParam (Parameter) {Integer} id The ID of the comment
 * @apiParam (Body) {String} description The description of the comment
 * @apiDescription Edits the comment.
 */
router.put('/comments/:id', checkModifiable, (req, res) => {
  const { description } = req.body;
  if (!description) {
    res.status(400);
    res.json({
      id: 'INVALID_DESCRIPTION',
      message: 'Description is invalid.'
    });
    return;
  }
  req.comment.description = description;
  req.comment.save()
  .then(() => {
    res.json(Object.assign({}, req.comment.toJSON(), {
      authorId: undefined,
      entryId: undefined
    }));
  })
  .catch(err => {
    console.log(err);
    res.status(500);
    res.json(err);
  });
});

/**
 * @api {delete} /entries/:author/:name/comments/:id Delete the comment
 * @apiGroup Entry/Comment
 * @apiName EntryCommentDelete
 * @apiUse EntryGet
 * @apiUse modifiable
 * @apiPermission modifiable
 * @apiParam (Parameter) {Integer} id The ID of the comment
 * @apiDescription Deletes the comment.
 */
router.delete('/comments/:id', checkModifiable, (req, res) => {
  req.comment.destroy()
  .then(() => {
    res.json(Object.assign({}, req.comment.toJSON(), {
      deleted: true
    }));
  })
  .catch(err => {
    console.log(err);
    res.status(500);
    res.json(err);
  });
});
