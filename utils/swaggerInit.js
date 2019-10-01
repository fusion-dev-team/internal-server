module.exports = {
  info: {
    // API informations (required)
    title: 'fusion-swagger', // Title (required)
    version: '2.0.0', // Version (required)
    description: 'internal-server swagger' // Description (optional)
  },
  openapi: '3.0.0',
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'authorization'
      }
    }
  },
  security: [{ ApiKeyAuth: [] }],
  apis: ['./controllers/*.js'],
  tags: [
    // {
    //   name: 'projects',
    //   description: 'Projects'
    // },
    // {
    //   name: 'requests',
    //   description: 'Requests'
    // },
    // {
    //   name: 'articles',
    //   description: 'Articles'
    // },
    // {
    //   name: 'skills',
    //   description: 'Skills'
    // },
    // {
    //   name: 'extraHours',
    //   description: 'ExtraHours'
    // },
    // {
    //   name: 'statistics',
    //   description: "user's statistics"
    // },
    // {
    //   name: 'tag',
    //   description: 'tag'
    // },
    {
      name: 'auth',
      description: 'auth'
    },
    // {
    //   name: 'anounsments',
    //   description: 'anounsments'
    // },
    // {
    //   name: 'cv',
    //   description: 'cv creator'
    // },
    // {
    //   name: 'portfolio',
    //   description: 'portfolio creator'
    // },
    // {
    //   name: 'technologies',
    //   description: 'technologies'
    // },
    // {
    //   name: 'techGroup',
    //   description: 'techGroup'
    // },
    {
      name: 'users',
      description: 'users'
    }
    // {
    //   name: 'taskJobs',
    //   description: 'taskJobs'
    // },
    // {
    //   name: 'plans',
    //   description: 'plans'
    // }
  ]
};
