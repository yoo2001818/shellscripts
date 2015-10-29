import Express from 'express';
import { sequelize, User, Entry, Tag, TagType, EntryLink }
  from '../../db/index.js';
import authRequired from '../lib/authRequired.js';
import adminRequired from '../lib/adminRequired.js';
import starRouter from './star.js';
import commentRouter from './comment.js';
import netConfig from '../../../config/network.config.js';

const defaultGetQuery = {
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
    },
    {
      model: Entry,
      as: 'children',
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
        },
        {
          model: User,
          as: 'author',
          attributes: ['username', 'name', 'photo']
        }
      ],
      attributes: {
        exclude: ['userId', 'author', 'script', 'description', 'requiresRoot']
      }
    }
  ],
  attributes: {
    exclude: ['userId', 'author']
  },
  order: [
    [
      {
        model: Entry,
        as: 'children'
      }, EntryLink, 'id'
    ],
    [
      {
        model: Tag,
        as: 'tags'
      }, 'name'
    ],
    [
      {
        model: Entry,
        as: 'children'
      }, {
        model: Tag,
        as: 'tags'
      }, 'name'
    ]
  ]
};

function checkModifiable(req, res, next) {
  if (req.selUser.id !== req.user.id) {
    adminRequired(req, res, next);
    return;
  }
  next();
}

export function buildEntryGet(options) {
  let { title, tags, username, userId, type, lastIndex } = options;
  const where = {};
  let include = [];
  if (title != null) {
    where.title = {
      $iLike: title
    };
  }
  include.push({
    model: Tag,
    as: 'tags',
    include: [{
      model: TagType,
      as: 'type',
      attributes: ['name']
    }],
    attributes: ['name', 'description']
  });
  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : tags.split(/[ ,]/);
    where.tagIndex = {
      $and: tagArray.map(tag => ({
        $like: '% ' + tag + ' %'
      }))
    };
  }
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
      ['id', 'DESC'],
      [{
        model: Tag,
        as: 'tags'
      }, 'name']
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
  if (req.query.keyword) {
    const { keyword } = req.query;
    const keywords = Array.isArray(keyword) ? keyword : keyword.split(/[ ,]/);
    // Keyword based search.
    // java 8 download script -> find only tags then...
    // 'java', 'script', and name 'java 8 download script'
    // This would work I suppose. :/
    Tag.findAll({
      where: {
        name: {
          $in: keywords
        }
      }
    })
    .then(tags => {
      // Map tags to names
      let tagNames = tags.map(tag => tag.name);
      // If there are more tags than 33% of keywords, continue as tag serach
      let ignoreTitle = tagNames.length >= keywords.length / 3;
      // Then... build query and continue
      Entry.findAll(buildEntryGet({
        lastIndex: req.query.lastIndex,
        tags: ignoreTitle ? tagNames : undefined,
        title: !ignoreTitle ? `%${keyword}%` : undefined
      }))
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
    return;
  }
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
  Entry.findOne(Object.assign({}, defaultGetQuery, {
    where: {
      authorId: req.selUser.id,
      name: name.toLowerCase()
    }
  }))
  .then(entry => {
    req.selEntryName = name;
    req.selEntry = entry;
    next();
  });
}, entryRouter);

function resolveTags(tags, transaction) {
  // Find existing tags first.
  return Tag.findAll({
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
  });
}

function resolveChildren(children, transaction) {
  // This should return an error if ANY of the children doesn't exist.
  // Since we get children data as a string, we've to fetch the data... with
  // tons of queries. Which is kinda awkward.

  // Verify children has right type
  if (!Array.isArray(children)) {
    return Promise.reject({
      id: 'CHILDREN_TYPE_ERROR',
      message: 'Children type must be an array'
    });
  }
  // Start with empty list.
  let childrenPromise = Promise.resolve([]);
  for (let child of children) {
    childrenPromise = childrenPromise.then(array => {
      // This is processed per a child.
      // Verify child type
      if (typeof child !== 'string') {
        throw {
          id: 'CHILDREN_TYPE_ERROR',
          message: 'Child type must be a string'
        };
      }
      // Split author and entry name
      const [authorName, entryName] = child.split('/');
      // Verify author and entry info
      if (authorName == null || entryName == null) {
        throw {
          id: 'CHILDREN_TYPE_ERROR',
          message: 'Not a valid entry ID'
        };
      }
      // First, we have to fetch the author; Ctrl+C / Ctrl+V to the rescue!
      return User.findOne({
        where: { login: authorName.toLowerCase() }, transaction
      })
      .then(author => {
        // Now we have author information; fetch the script.
        // If we don't have author - Too bad - this is an error.
        if (author == null) {
          throw {
            id: 'CHILDREN_USER_NOT_FOUND',
            message: 'User with given username is not found.'
          };
        }
        // Also, Ctrl + C and V is my best friend.
        // Ok, I admit that it isn't my best friend, it's not even a live
        // object. Still, it's pretty cool. Uh. Yeah. ... back to coding.
        return Entry.findOne({
          where: {
            authorId: author.id,
            name: entryName.toLowerCase()
          }, transaction
        });
      })
      .then(entry => {
        // We FINALLY got the entry information.
        // But can't find entry? Too bad. Go away.
        if (entry == null) {
          throw {
            id: 'CHILDREN_ENTRY_NOT_FOUND',
            message: 'Entry with given name is not found.'
          };
        }
        // If it succeeded, throw new array containing received entry.
        // Since 'push' function modifies original object, Use 'concat' function
        // to duplicate array.
        return array.concat([entry]);
      });
    });
  }
  // Okay! to wrap it up, We do.... nothing. Just return a promise...
  // :P
  return childrenPromise;
}

function injectChildrenToEntry(entry, children, transaction) {
  // We assume that entry has already created and saved to the server.

  // Ignore if type is not list;
  if (entry.type !== 'list') return Promise.resolve(entry);
  // Or, fetch the children list. Duhhh
  return resolveChildren(children, transaction)
  .then(children => {
    // Then, clear the children list first, since children list on SQL is not
    // ordered list, we'll have to clear the list to get it in the right order
    return entry.setChildren(null, { transaction })
    .then(() => entry.setChildren(children, { transaction }))
    .then(() => entry);
  });
}

/**
 * @api {post} /entries/:author/:name Create an entry
 * @apiGroup Entry
 * @apiName CreateEntry
 * @apiUse EntryGet
 * @apiParam (Body) {String} title The title of the entry.
 * @apiParam (Body) {String} brief Brief description. (Usually one line)
 * @apiParam (Body) {String} description Detailed description. Accepts markdown.
 * @apiParam (Body) {String[]} tags The tags name of the entry.
 * @apiParam (Body) {String="script","list"} type The type of the entry.
 * @apiParam (Body) {String} [script] The script data of the entry.
 * @apiParam (Body) {Boolean} [requiresRoot] Whether if this requires root.
 * @apiParam (Body) {String[]} [children] The ordered list of child scripts.
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
  let { title, brief, description, tags, type, script, requiresRoot
    , children } = req.body;
  if (title == null || title === '') title = name;
  if (!Array.isArray(tags) && typeof tags === 'string') tags = tags.split(',');
  tags = tags.map(name => name.toLowerCase());
  if (!Array.isArray(children) && typeof children === 'string') {
    children = children.split(',');
  }
  // Since this requires quite a lot of SQL queries, Use transaction to prevent
  // conflictions.
  sequelize.transaction(transaction =>
    resolveTags(tags, transaction)
    // Then create new entry with given data.
    .then(tagObjs => {
      return Entry.create({
        name, title, brief, description, type, script, requiresRoot,
        authorId: req.selUser.id,
        tagIndex: ' ' + tagObjs.map(tag => tag.name).join(' ') + ' '
      }, { transaction })
      // Then set the tags data and we're done.
      .then(entry => {
        return entry.setTags(tagObjs, { transaction })
        .then(() => entry);
      })
      // Then set the children and we're really done.
      .then(entry => injectChildrenToEntry(entry, children, transaction));
    })
    // Re-retrieve entry object with tags and user
    .then(entry => Entry.findOne(Object.assign({}, defaultGetQuery, {
      where: {
        id: entry.id
      }, transaction
    })))
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

// Check validity from here
entryRouter.use((req, res, next) => {
  if (req.selEntry == null) {
    // Not found
    res.status(404);
    res.json({
      id: 'ENTRY_NOT_FOUND',
      message: 'Specified entry is not found.'
    });
    return;
  }
  next();
});

/**
 * @api {get} /entries/:author/:name Get specified entry
 * @apiGroup Entry
 * @apiName GetEntryByName
 * @apiUse EntryGet
 * @apiDescription Returns the entry.
 */
entryRouter.get('/', (req, res) => {
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
  const { author, name } = req.selEntry;
  res.attachment(author.username + '_' + name + '.sh');
  const footer = `\n\n# ${netConfig.url}/${author.username}/${name}`;
  if (req.selEntry.type === 'script') {
    res.send(req.selEntry.script + footer);
  } else {
    // 'Bake' various scripts into a single file.
    const script = '#!/bin/bash\n' + req.selEntry.children.map(child => {
      const author = child.author && child.author.username;
      const link = `${author}/${child.name}`;
      const url = `${netConfig.url}/api/entries/${link}/raw`;
      return `curl -S '${url}' | bash /dev/stdin`;
    }).join('\n');
    res.send(script + footer);
  }
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
 * @apiParam (Body) {String="script","list"} type The type of the entry.
 * @apiParam (Body) {String} [script] The script data of the entry.
 * @apiParam (Body) {Boolean} [requiresRoot] Whether if this requires root.
 * @apiParam (Body) {String[]} [children] The ordered list of child scripts.
 * @apiDescription Edits and returns the entry.
 * @apiUse AuthRequired
 * @apiUse modifiable
 * @apiPermission modifiable
 */
entryRouter.put('/', authRequired, checkModifiable, (req, res) => {
  // TODO This code is copied from entry create part. Prehaps I can merge them?
  const name = req.selEntryName.toLowerCase();
  let { title, brief, description, tags, type, script, requiresRoot
    , children } = req.body;
  if (title == null || title === '') title = name;
  if (!Array.isArray(tags) && typeof tags === 'string') tags = tags.split(',');
  tags = tags.map(name => name.toLowerCase());
  if (!Array.isArray(children) && typeof children === 'string') {
    children = children.split(',');
  }
  // Since this requires quite a lot of SQL queries, Use transaction to prevent
  // conflictions.
  sequelize.transaction(transaction =>
    resolveTags(tags, transaction)
    // Then modify the entry with given data.
    .then(tagObjs => {
      return req.selEntry.update({
        title, brief, description, type, script, requiresRoot,
        tagIndex: ' ' + tagObjs.map(tag => tag.name).join(' ') + ' '
      }, { transaction })
      // Then set the tags data and we're done.
      .then(entry => {
        return entry.setTags(tagObjs, { transaction })
        .then(() => entry);
      })
      // Then set the children and we're really done.
      .then(entry => injectChildrenToEntry(entry, children, transaction));
    })
    // Re-retrieve entry object with tags and user
    .then(entry => Entry.findOne(Object.assign({}, defaultGetQuery, {
      where: {
        id: entry.id
      }, transaction
    })))
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
 * @api {delete} /entries/:author/:name Delete an entry
 * @apiGroup Entry
 * @apiName DeleteEntry
 * @apiUse EntryGet
 * @apiDescription Returns 200 OK.
 * @apiUse AuthRequired
 * @apiUse modifiable
 * @apiPermission modifiable
 */
entryRouter.delete('/', authRequired, checkModifiable, (req, res) => {
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
