import dns from "node:dns/promises";

try {
  const records = await dns.resolveSrv(
    "_mongodb._tcp.cluster0.epkuno9.mongodb.net"
  );
  console.log("SRV Records:");
  console.log(records);
} catch (err) {
  console.error("DNS Error:");
  console.error(err);
}