var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork({
      SERVER_NO_FORK: true
    });
  }

  cluster.on('exit', function(worker) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
  // If slave, imply link to index
  require('./index.js');
}
