/* MySQL uses default port to store DB: port: "3306" */
const config = {
  /* use your DB credentials for a development purposes only: */
  db: {
    host: "localhost",
    user: "root",
    password: "ZuDWA.ftre4",
    database: "test-printers-counters" //printers-counters
  },
  /* use empty DB credentials in production: */
  /*db: {
    host: '',
    user: '',
    password: '',
    database: ''
  },*/
  connectionDB: {
    sessionStart: ''
  },
  listPerPage: 20,
};

module.exports = config;
