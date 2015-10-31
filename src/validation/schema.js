export const User = {
  login: {
    is: {
      key: 'AUTH_USERNAME_POLICY',
      value: /^[a-z0-9]+$/
    }
  },
  username: {
    is: {
      key: 'AUTH_USERNAME_POLICY',
      value: /^[a-zA-Z0-9]+$/
    },
    len: {
      key: 'FIELD_TOO_LONG',
      value: [1, 32]
    },
    notIn: {
      key: 'FIELD_RESERVED',
      value: ['login', 'signup', 'search', 'settings', 'new', 'admin', 'root',
        'help', 'about', 'contact', 'administrator', 'starred', 'notification',
        'form']
    },
    notEmpty: true
  },
  email: {
    isEmail: true
  },
  name: {
    len: {
      key: 'FIELD_TOO_LONG',
      value: [0, 64]
    }
  },
  bio: {
    len: {
      key: 'FIELD_TOO_LONG',
      value: [0, 280]
    }
  },
  website: {
    isURL: true,
    len: {
      key: 'FIELD_TOO_LONG',
      value: [0, 256]
    }
  }
};

export const TagType = {
  name: {
    is: {
      key: 'TAG_TYPE_NAME_POLICY',
      value: /^([a-z0-9][a-z0-9\-]+[a-z0-9]|[a-z0-9]+)$/
    },
    len: {
      key: 'FIELD_TOO_LONG',
      value: [1, 32]
    },
    notEmpty: true
  }
};

export const Tag = {
  name: {
    is: {
      key: 'TAG_NAME_POLICY',
      value: /^([a-z0-9][a-z0-9\-]+[a-z0-9]|[a-z0-9]+)$/
    },
    len: {
      key: 'FIELD_TOO_LONG',
      value: [1, 32]
    },
    notEmpty: true
  }
};

export const Entry = {
  name: {
    is: {
      key: 'ENTRY_NAME_POLICY',
      value: /^([a-z0-9][a-z0-9\-]+[a-z0-9]|[a-z0-9]+)$/
    },
    len: {
      key: 'FIELD_TOO_LONG',
      value: [1, 32]
    },
    notIn: {
      key: 'FIELD_RESERVED',
      value: ['starred', 'settings', 'privacy', 'profile', 'ban', 'unban',
        'disable', 'enable']
    },
    notEmpty: true
  },
  title: {
    len: {
      key: 'FIELD_TOO_LONG',
      value: [1, 150]
    },
    notEmpty: true
  },
  brief: {
    len: {
      key: 'FIELD_TOO_LONG',
      value: [0, 400]
    }
  }
};
