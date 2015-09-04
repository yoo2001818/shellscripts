import sailsMemoryAdapter from 'sails-memory';

const dbConfig = {
  adapters: {
    memory: sailsMemoryAdapter
  },
  connections: {
    'default': {
      adapter: 'memory'
    }
  }
};

export default dbConfig;
