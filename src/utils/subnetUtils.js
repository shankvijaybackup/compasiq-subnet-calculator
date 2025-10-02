/**
 * Subnet Calculator Utility Functions
 * Pure functions for IPv4 subnet calculations
 */

export function isValidIPv4(str) {
  const parts = str.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    if (!/^\d+$/.test(p)) return false;
    const n = Number(p);
    return n >= 0 && n <= 255 && String(n) === p.replace(/^0+(?=\d)/, n === 0 ? "0" : String(n));
  });
}

export function ipToInt(ip) {
  const [a, b, c, d] = ip.split(".").map(Number);
  return (((a << 24) | (b << 16) | (c << 8) | d) >>> 0);
}

export function intToIp(n) {
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255,
  ].join(".");
}

export function prefixToMask(prefix) {
  if (prefix < 0 || prefix > 32) return 0;
  return (prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0);
}

export function maskToPrefix(mask) {
  let count = 0;
  for (let i = 31; i >= 0; i--) {
    if ((mask >>> i) & 1) count++;
  }
  return count;
}

export function maskToString(mask) {
  return intToIp(mask >>> 0);
}

export function wildcardFromMask(mask) {
  return (~mask) >>> 0;
}

export function getClassful(ipInt) {
  const first = (ipInt >>> 24) & 255;
  if (first <= 127) return "Class A";
  if (first <= 191) return "Class B";
  if (first <= 223) return "Class C";
  if (first <= 239) return "Class D (Multicast)";
  return "Class E (Experimental)";
}

export function clampPrefix(p) {
  const n = Number(p);
  if (!Number.isFinite(n)) return 24;
  return Math.min(32, Math.max(0, Math.floor(n)));
}

export function calculate(cidr) {
  if (!cidr) return null;
  const parts = cidr.split("/");
  if (parts.length !== 2) return null;
  const [ipStr, prefixStr] = parts;
  if (!isValidIPv4(ipStr)) return null;
  const prefix = clampPrefix(prefixStr);

  const ip = ipToInt(ipStr);
  const mask = prefixToMask(prefix);
  const wildcard = wildcardFromMask(mask);
  const network = (ip & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  // For /0, (1 << 32) overflows, so handle separately
  const totalHosts = prefix === 32 ? 1 : prefix === 0 ? 4294967296 : (1 << (32 - prefix)) >>> 0;
  const usable = prefix >= 31 ? 0 : Math.max(0, totalHosts - 2);
  const firstHost = prefix >= 31 ? null : (network + 1) >>> 0;
  const lastHost = prefix >= 31 ? null : (broadcast - 1) >>> 0;

  return {
    ok: true,
    ip: ipStr,
    prefix,
    classful: getClassful(ip),
    mask,
    maskStr: maskToString(mask),
    wildcard,
    wildcardStr: maskToString(wildcard),
    network,
    networkStr: intToIp(network),
    broadcast,
    broadcastStr: intToIp(broadcast),
    totalHosts,
    usableHosts: usable,
    firstHostStr: firstHost !== null ? intToIp(firstHost) : null,
    lastHostStr: lastHost !== null ? intToIp(lastHost) : null,
  };
}

export function listChildSubnets(parentNetwork, parentPrefix, newPrefix) {
  if (newPrefix < parentPrefix) return [];
  const parentMask = prefixToMask(parentPrefix);
  const wildcard = (~parentMask) >>> 0;
  const broadcast = (parentNetwork | wildcard) >>> 0;

  const blockSize = 1 << (32 - newPrefix);
  const firstChild = parentNetwork;
  const lastChild = (broadcast - ((broadcast - parentNetwork) % blockSize)) >>> 0;

  const subnets = [];
  for (let net = firstChild; net <= lastChild; net = (net + blockSize) >>> 0) {
    const netStr = intToIp(net);
    const bc = (net + (blockSize - 1)) >>> 0;
    const bcStr = intToIp(bc);
    const first = newPrefix >= 31 ? null : intToIp((net + 1) >>> 0);
    const last = newPrefix >= 31 ? null : intToIp((bc - 1) >>> 0);
    const total = 1 << (32 - newPrefix);
    const usable = newPrefix >= 31 ? 0 : Math.max(0, total - 2);
    subnets.push({
      network: netStr,
      broadcast: bcStr,
      prefix: newPrefix,
      total,
      usable,
      firstHost: first,
      lastHost: last,
    });

    if (subnets.length >= 1024) break;
  }
  return subnets;
}
