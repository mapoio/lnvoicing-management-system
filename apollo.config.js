module.exports = {
  client: {
    // includes: ['./mock/generated-schema.gql'],
    service: {
      name: 'my-service-name',
      // localSchemaFile: './mock/default.graphql',
      url: 'http://localhost:8083/graphql'
    }
  }
};
