import Express from 'express';
import { sequelize, User, Entry, Tag, TagType } from '../../db/index.js';
import authRequired from '../lib/authRequired.js';
import adminRequired from '../lib/adminRequired.js';
import starRouter from './star.js';
import commentRouter from './comment.js';

function checkModifiable(req, res, next) {
  if (req.selUser.id !== req.user.id) {
    adminRequired(req, res, next);
    return;
  }
  next();
}

function buildEntryGet(options) {
  let { title, tags, username, userId, type, lastIndex } = options;
  const where = {};
  const include = [];
  if (title != null) {
    where.title = {
      $like: title
    };
  }
  include.push({
    model: Tag,
    as: 'tags',
    where: tags ? ({
      name: {
        $in: tags
      }
    }) : undefined,
    include: [{
      model: TagType,
      as: 'type',
      attributes: ['name']
    }],
    attributes: ['name', 'description']
  });
  include.push({
    model: User,
    as: 'author',
    where: username != null ? ({
      login: {
        $like: username.toLowerCase()
      }
    }) : undefined,
    attributes: ['username', 'name', 'photo']
  });
  /*
  include.push({
    model: User,
    as: 'starredUsers',
    attributes: ['username']
  });
  */
  if (userId != null) where.authorId = userId;
  if (type != null) {
    where.type = type;
  }
  // This shouldn't be done in here but whatever. :/
  lastIndex = parseInt(lastIndex);
  if (!isNaN(lastIndex)) {
    where.id = {
      $lt: lastIndex
    };
  }
  return {
    where,
    include,
    // TODO currently it's hardcoded. should be changed
    limit: 20,
    order: [
      [{
        model: Tag,
        as: 'tags'
      }, 'name'],
      ['id', 'DESC']
    ],
    attributes: {
      exclude: ['userId', 'author', 'script', 'description', 'requiresRoot']
    }
  };
}

/**
 * @apiDefine EntryGet
 * @apiParam (Parameter) {String} author The author of the entry
 * @apiParam (Parameter) {String} name The name of the entry
 */

export const router = new Express.Router();
export default router;

/**
 * @api {get} /entries/ Get entries list
 * @apiGroup Entry
 * @apiName SearchEntries
 * @apiParam (Query) {String} [title] The entries' title to search
 * @apiParam (Query) {String[]} [tags] The entries' tags to search
 * @apiParam (Query) {String} [username] The entries' username to search
 * @apiParam (Query) {String} [type] The entries' type
 * @apiParam (Query) {Integer} [lastIndex] The last entry's ID you've seen
 * @apiDescription Returns entries matching the criteria, or lists all entries
 *   if no criteria was given.
 *
 *   Entries' name are searched using 'LIKE' query.
 *
 *   Pagination is done with 'lastIndex'. Send last entry index you've seen
 *   and this will send entries starting from there.
 */
router.get('/entries/', (req, res) => {
  Entry.findAll(buildEntryGet(req.query))
  .then(entries => {
    res.json(entries.map(entry => {
      let displayEntry = entry.toJSON();
      Object.assign(displayEntry, {
        tags: displayEntry.tags.map(tag => Object.assign({}, tag, {
          entryTag: undefined
        }))
      });
      return displayEntry;
    }));
  });
});

// /entries/:author router
export const authorRouter = new Express.Router();

router.use('/entries/:author', (req, res, next) => {
  // Inject author and continue....
  // This is copied from user.js's /users/:username. Should merge them :P

  // Retrieve the user
  const { author } = req.params;
  if (author == null) {
    // This can't happen
    res.sendStatus(500);
    return;
  }
  User.findOne({
    where: { login: author.toLowerCase() }
  })
  .then(user => {
    if (user == null) {
      // Not found
      res.status(404);
      res.json({
        id: 'USER_NOT_FOUND',
        message: 'User with given username is not found.'
      });
      return;
    }
    req.selUser = user;
    next();
  });
}, authorRouter);

/**
 * @api {get} /entries/:author Get entries list of user
 * @apiGroup Entry
 * @apiName SearchEntriesByAuthor
 * @apiParam (Parameter) {String} author The author to search
 * @apiParam (Query) {Integer} [lastIndex] The last entry's ID you've seen
 * @apiDescription Returns a list of entries written by the user.
 *
 *   Pagination is done with 'lastIndex'. Send last entry index you've seen
 *   and this will send entries starting from there.
 */
authorRouter.get('/', (req, res) => {
  Entry.findAll(buildEntryGet(Object.assign({}, req.query, {
    userId: req.selUser.id
  })))
  .then(entries => {
    res.json(entries.map(entry => {
      let displayEntry = entry.toJSON();
      Object.assign(displayEntry, {
        tags: displayEntry.tags.map(tag => Object.assign({}, tag, {
          entryTag: undefined
        }))
      });
      return displayEntry;
    }));
  });
});

export const entryRouter = new Express.Router();

authorRouter.use('/:name', (req, res, next) => {
  const { name } = req.params;
  // Inject entry to request
  Entry.findOne({
    where: {
      authorId: req.selUser.id,
      name: name.toLowerCase()
    },
    include: [
      {
        model: Tag,
        as: 'tags',
        include: [{
          model: TagType,
          as: 'type',
          attributes: ['name']
        }],
        attributes: ['name', 'description']
      }, {
        model: User,
        as: 'author',
        attributes: ['username', 'name', 'photo']
      }
    ],
    attributes: {
      exclude: ['userId', 'author']
    },
    order: [[{
      model: Tag,
      as: 'tags'
    }, 'name']]
  })
  .then(entry => {
    req.selEntryName = name;
    req.selEntry = entry;
    next();
  });
}, entryRouter);

/**
 * @api {get} /entries/:author/:name Get specified entry
 * @apiGroup Entry
 * @apiName GetEntryByName
 * @apiUse EntryGet
 * @apiDescription Returns the entry.
 */
entryRouter.get('/', (req, res) => {
  if (req.selEntry == null) {
    // Not found
    res.status(404);
    res.json({
      id: 'ENTRY_NOT_FOUND',
      message: 'Specified entry is not found.'
    });
    return;
  }
  let entry = req.selEntry.toJSON();
  Object.assign(entry, {
    tags: entry.tags.map(tag => Object.assign({}, tag, {
      entryTag: undefined
    }))
  });
  if (req.user) {
    req.selEntry.hasStarredUser(req.user)
    .then(result => {
      Object.assign(entry, {
        voted: result
      });
      res.json(entry);
    })
    .catch(err => {
      res.status(500);
      console.log(err);
      res.json(err);
    });
  } else {
    res.json(entry);
  }
});

/**
 * @api {get} /entries/:author/:name/raw Get raw script file of the entry
 * @apiGroup Entry
 * @apiName EntryGetRawScript
 * @apiUse EntryGet
 * @apiDescription Returns the script of the entry as a downloadable format.
 */
entryRouter.get('/raw', (req, res) => {
  if (req.selEntry == null) {
    // Not found
    res.status(404);
    res.json({
      id: 'ENTRY_NOT_FOUND',
      message: 'Specified entry is not found.'
    });
    return;
  }
  const { author, name } = req.selEntry;
  res.attachment(author.username + '_' + name + '.sh');
  // TODO Put sitename in a config file?
  const footer = `\n\n# http://localhost:8000/${author.username}/${name}`;
  if (req.selEntry.type === 'script') {
    res.send(req.selEntry.script + footer);
  } else {
    // 'Bake' various scripts into a single file.
  }
});

/**
 * @api {post} /entries/:author/:name Create an entry
 * @apiGroup Entry
 * @apiName CreateEntry
 * @apiUse EntryGet
 * @apiParam (Body) {String} title The title of the entry.
 * @apiParam (Body) {String} brief Brief description. (Usually one line)
 * @apiParam (Body) {String} description Detailed description. Accepts markdown.
 * @apiParam (Body) {String[]} tags The tags name of the entry.
 * @apiParam (Body) {String="script","collection"} type The type of the entry.
 * @apiParam (Body) {String} [script] The script data of the entry.
 * @apiParam (Body) {Boolean} [requiresRoot] Whether if this requires root.
 * @apiDescription Creates and returns a new entry.
 * @apiUse AuthRequired
 */
entryRouter.post('/', authRequired, checkModifiable, (req, res) => {
  if (req.selEntry != null) {
    // Wut.
    res.status(409);
    res.send({
      id: 'AUTH_ENTRY_EXISTS',
      message: 'Entry with the name already exists.'
    });
    return;
  }
  const name = req.selEntryName.toLowerCase();
  let { title, brief, description, tags, type, script, requiresRoot } =
    req.body;
  if (title == null || title === '') title = name;
  if (!Array.isArray(tags) && typeof tags === 'string') tags = tags.split(',');
  tags = tags.map(name => name.toLowerCase());
  // Since this requires quite a lot of SQL queries, Use transaction to prevent
  // conflictions.
  sequelize.transaction(transaction =>
    // Find existing tags first.
    Tag.findAll({
      where: {
        name: {
          $in: tags
        }
      }, transaction
    })
    .then(tagObjs => {
      // Remove tag with existing ID from the array.
      tagObjs.forEach(tagObj => tags.splice(tags.indexOf(tagObj.name), 1));
      // Then, bulk create missing tags
      if (tags.length > 0) {
        return Tag.bulkCreate(tags.map(tagName => ({
          name: tagName
          // TODO And other default values
        })), { transaction })
        // Since bulkCreate doesn't return created objects, we have to fetch
        // them again. Which is pretty awkward though.
        .then(() => Tag.findAll({
          where: {
            name: {
              $in: tags
            }
          }, transaction
        }))
        // Then, concat new tags to original tags array.
        .then(newTagObjs => {
          tagObjs = tagObjs.concat(newTagObjs);
          return tagObjs;
        });
      }
      return tagObjs;
    })
    // Then create new entry with given data.
    .then(tagObjs => {
      return Entry.create({
        name, title, brief, description, type, script, requiresRoot,
        authorId: req.selUser.id
      }, { transaction })
      // Then set the tags data and we're done.
      .then(entry => {
        return entry.setTags(tagObjs, { transaction })
        .then(() => entry);
      });
    })
    // Re-retrieve entry object with tags and user
    .then(entry => Entry.findOne({
      where: {
        id: entry.id
      },
      include: buildEntryGet({}).include,
      order: buildEntryGet({}).order,
      transaction
    }))
  )
  .then(entry => {
    let displayEntry = entry.toJSON();
    Object.assign(displayEntry, {
      tags: displayEntry.tags.map(tag => Object.assign({}, tag, {
        entryTag: undefined
      }))
    });
    res.json(displayEntry);
  })
  .catch(err => {
    console.log(err.stack);
    res.status(500);
    res.json(err);
  });
});

/**
 * @api {put} /entries/:author/:name Edit an entry
 * @apiGroup Entry
 * @apiName EditEntry
 * @apiUse EntryGet
 * @apiParam (Body) {String} title The title of the entry.
 * @apiParam (Body) {String} brief Brief description. (Usually one line)
 * @apiParam (Body) {String} description Detailed description. Accepts markdown.
 * @apiParam (Body) {String[]} tags The tags name of the entry.
 * @apiParam (Body) {String="script","collection"} type The type of the entry.
 * @apiParam (Body) {String} [script] The script data of the entry.
 * @apiParam (Body) {Boolean} [requiresRoot] Whether if this requires root.
 * @apiDescription Edits and returns the entry.
 * @apiUse AuthRequired
 * @apiUse modifiable
 * @apiPermission modifiable
 */
entryRouter.put('/', authRequired, checkModifiable, (req, res) => {
  if (req.selEntry == null) {
    // Not found
    res.status(404);
    res.json({
      id: 'ENTRY_NOT_FOUND',
      message: 'Specified entry is not found.'
    });
    return;
  }
  // TODO This code is copied from entry create part. Prehaps I can merge them?
  const name = req.selEntryName.toLowerCase();
  let { title, brief, description, tags, type, script, requiresRoot } =
    req.body;
  if (title == null || title === '') title = name;
  if (!Array.isArray(tags) && typeof tags === 'string') tags = tags.split(',');
  tags = tags.map(name => name.toLowerCase());
  // Since this requires quite a lot of SQL queries, Use transaction to prevent
  // conflictions.
  sequelize.transaction(transaction =>
    // Find existing tags first.
    Tag.findAll({
      where: {
        name: {
          $in: tags
        }
      }, transaction
    })
    .then(tagObjs => {
      // Remove tag with existing ID from the array.
      tagObjs.forEach(tagObj => tags.splice(tags.indexOf(tagObj.name), 1));
      // Then, bulk create missing tags
      if (tags.length > 0) {
        return Tag.bulkCreate(tags.map(tagName => ({
          name: tagName
          // TODO And other default values
        })), { transaction })
        // Since bulkCreate doesn't return created objects, we have to fetch
        // them again. Which is pretty awkward though.
        .then(() => Tag.findAll({
          where: {
            name: {
              $in: tags
            }
          }, transaction
        }))
        // Then, concat new tags to original tags array.
        .then(newTagObjs => {
          tagObjs = tagObjs.concat(newTagObjs);
          return tagObjs;
        });
      }
      return tagObjs;
    })
    // Then modify the entry with given data.
    .then(tagObjs => {
      return req.selEntry.update({
        title, brief, description, type, script, requiresRoot
      }, { transaction })
      // Then set the tags data and we're done.
      .then(entry => {
        return entry.setTags(tagObjs, { transaction })
        .then(() => entry);
      });
    })
    // Re-retrieve entry object with tags and user
    .then(entry => Entry.findOne({
      where: {
        id: entry.id
      },
      include: buildEntryGet({}).include,
      order: buildEntryGet({}).order,
      transaction
    }))
  )
  .then(entry => {
    let displayEntry = entry.toJSON();
    Object.assign(displayEntry, {
      tags: displayEntry.tags.map(tag => Object.assign({}, tag, {
        entryTag: undefined
      }))
    });
    res.json(displayEntry);
  })
  .catch(err => {
    console.log(err.stack);
    res.status(500);
    res.json(err);
  });
});

/**
 * @api {post} /entries/:author/:name Delete an entry
 * @apiGroup Entry
 * @apiName DeleteEntry
 * @apiUse EntryGet
 * @apiDescription Returns 200 OK.
 * @apiUse AuthRequired
 * @apiUse modifiable
 * @apiPermission modifiable
 */
entryRouter.delete('/', authRequired, checkModifiable, (req, res) => {
  if (req.selEntry == null) {
    // Not found
    res.status(404);
    res.json({
      id: 'ENTRY_NOT_FOUND',
      message: 'Specified entry is not found.'
    });
    return;
  }
  // Delete the entry. :P
  req.selEntry.destroy()
  .then(() => {
    res.json(Object.assign({}, req.selEntry.toJSON(), {
      deleted: true
    }));
  })
  .catch(err => {
    console.log(err.stack);
    res.status(500);
    res.json(err);
  });
});

entryRouter.use(starRouter);
entryRouter.use(commentRouter);
