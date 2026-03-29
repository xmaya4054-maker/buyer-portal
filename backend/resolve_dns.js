const dns = require('dns').promises;

async function resolve() {
  try {
    const srv = await dns.resolveSrv('_mongodb._tcp.cluster0.rghopz4.mongodb.net');
    console.log(JSON.stringify(srv, null, 2));
  } catch (e) {
    console.error('Failed to resolve SRV:', e.message);
  }
}

resolve();
