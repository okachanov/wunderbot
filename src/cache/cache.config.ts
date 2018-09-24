export default {
  cache: {
    enabled: {
      default: false,
      env: 'CACHE_ENABLED',
    },

    engine: {
      default: 'redis',
      env: 'CACHE_ENGINE',
      format: ['redis', 'memory', 'mongo'],
    },
  },
};
