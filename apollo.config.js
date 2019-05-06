module.exports = {
  client: {
    service: {
      name: 'my-service-name',
      // localSchemaFile: './mock/default.graphql',
      url: 'http://localhost:1337/graphql',
      headers: {
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTU3MDI4NTYyLCJleHAiOjE1NTk2MjA1NjJ9.BUbT1tMt1k_0z1fNaVPj3KjlMebkNOgfxfMznujN9_g'
      }
    }
  }
};
