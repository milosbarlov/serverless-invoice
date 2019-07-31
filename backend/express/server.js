const chalk = require('chalk');
const app = require('./app');

const success = chalk.green;
const port = process.env.PORT;

app.listen(port, () =>
  console.log(success(`Server is running on port: ${port}`))
);
