import React, { useMemo, useState } from "react";
import { calculate, listChildSubnets, ipToInt, clampPrefix } from '../utils/subnetUtils';

function copy(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(()=>{});
}

export default function SubnetCalculator() {
  const [cidr, setCidr] = useState("192.168.1.10/24");
  const base = useMemo(() => calculate(cidr), [cidr]);
  const [childPrefix, setChildPrefix] = useState(26);

  const childSubnets = useMemo(() => {
    if (!base || !base.ok) return [];
    const p = clampPrefix(childPrefix);
    return listChildSubnets(ipToInt(base.networkStr), base.prefix, p);
  }, [base, childPrefix]);

  const gridCols = useMemo(() => {
    if (!base || !base.ok) return 1;
    const p = clampPrefix(childPrefix);
    const factor = Math.pow(2, p - base.prefix);
    if (factor <= 2) return 2;
    if (factor <= 4) return 4;
    if (factor <= 8) return 8;
    if (factor <= 16) return 8;
    return 8;
  }, [base, childPrefix]);

  return (
    <div className="w-full bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Subnet Calculator & Visual Subnetter
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Fast, accurate IPv4 subnet calculations with visual subnetting. 
            Perfect for network engineers, IT professionals, and students. 
            100% client-side — your data never leaves your browser.
          </p>
        </div>

        {/* Main Calculator */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <label className="block text-sm font-semibold mb-3 text-slate-700">Enter CIDR Notation</label>
          <div className="flex gap-3 items-center">
            <input
              className="flex-1 rounded-xl border-2 border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              placeholder="e.g. 10.0.12.34/20 or 192.168.1.0/24"
              value={cidr}
              onChange={(e) => setCidr(e.target.value.trim())}
            />
            <button
              onClick={() => setCidr("192.168.1.10/24")}
              className="rounded-xl border-2 border-slate-300 px-4 py-3 hover:bg-slate-100 transition font-medium"
            >
              Example
            </button>
          </div>

          {!base && (
            <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <p className="text-sm text-rose-600">
                ⚠️ Please enter a valid IPv4 CIDR notation (e.g., 192.168.1.10/24)
              </p>
            </div>
          )}

          {base && (
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <KV label="IP Address" value={base.ip} copyable />
              <KV label="Network Class" value={base.classful} />
              <KV label="Prefix Length" value={`/${base.prefix}`} />
              <KV label="Subnet Mask" value={base.maskStr} copyable />
              <KV label="Wildcard Mask" value={base.wildcardStr} copyable />
              <KV label="Network Address" value={base.networkStr} copyable />
              <KV label="Broadcast Address" value={base.broadcastStr} copyable />
              <KV label="Total Hosts" value={String(base.totalHosts)} />
              <KV label="Usable Hosts" value={String(base.usableHosts)} />
              <KV 
                label="Host Address Range" 
                value={base.firstHostStr && base.lastHostStr ? `${base.firstHostStr} – ${base.lastHostStr}` : "(none)"} 
                copyable={!!(base.firstHostStr && base.lastHostStr)} 
              />
            </div>
          )}
        </section>

        {/* Visual Subnetter */}
        {base && (
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Visual Subnetter</h2>
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 font-medium">Parent Network:</span>
                  <code className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-semibold">
                    {base.networkStr}/{base.prefix}
                  </code>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">
                  Subnet into /{" "}
                </label>
                <input
                  type="number"
                  min={base.prefix}
                  max={32}
                  value={childPrefix}
                  onChange={(e) => setChildPrefix(clampPrefix(e.target.value))}
                  className="w-32 rounded-xl border-2 border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <p className="text-sm text-slate-600 mb-5 p-3 bg-slate-50 rounded-lg">
              💡 <strong>Tip:</strong> Choose a new prefix ≥ {base.prefix} to subdivide the parent network into smaller subnets. 
              Very small blocks like /31 or /32 have no usable host addresses.
            </p>

            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${gridCols > 4 ? 4 : gridCols} gap-4`}>
              {childSubnets.slice(0, 128).map((s, i) => (
                <div 
                  key={i} 
                  className="rounded-xl border-2 border-slate-200 p-4 hover:shadow-md hover:border-indigo-300 transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <code className="font-bold text-indigo-600">{s.network}/{s.prefix}</code>
                    <button
                      onClick={() => copy(`${s.network}/${s.prefix}`)}
                      title="Copy CIDR"
                      className="text-xs px-2 py-1 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 transition font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="text-xs text-slate-700 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Broadcast:</span>
                      <span className="font-mono">{s.broadcast}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Usable:</span>
                      <span className="font-semibold">{s.usable}</span>
                    </div>
                    <div className="pt-1 border-t border-slate-100">
                      <div className="text-slate-500 font-medium mb-1">Host Range:</div>
                      <div className="font-mono text-[10px] leading-tight">
                        {s.firstHost && s.lastHost ? (
                          <>
                            {s.firstHost}<br />– {s.lastHost}
                          </>
                        ) : (
                          <span className="text-slate-400">(none)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {childSubnets.length > 128 && (
              <div className="mt-5 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800">
                  📊 Showing first 128 of {childSubnets.length} subnets for readability. 
                  Increase the prefix length to explore smaller subdivisions.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Features Section */}
        <section className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-lg mb-2">100% Private</h3>
            <p className="text-sm text-slate-600">
              All calculations happen in your browser. No data is sent to any server or stored anywhere.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-lg mb-2">Instant Results</h3>
            <p className="text-sm text-slate-600">
              Real-time calculation and validation. No waiting, no page reloads. Just fast, accurate results.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-bold text-lg mb-2">Visual Subnetting</h3>
            <p className="text-sm text-slate-600">
              See how networks subdivide. Perfect for learning, planning, and documenting network designs.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-12 bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">What is CIDR notation?</h3>
              <p className="text-slate-600">
                CIDR (Classless Inter-Domain Routing) notation is a compact way to specify an IP address and its network mask. 
                For example, <code className="bg-slate-100 px-2 py-1 rounded">192.168.1.0/24</code> means the network 192.168.1.0 
                with a 24-bit subnet mask (255.255.255.0).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">How do I calculate usable hosts?</h3>
              <p className="text-slate-600">
                Usable hosts = Total hosts - 2 (network and broadcast addresses). For example, a /24 network has 
                256 total addresses, but only 254 are usable for hosts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Is IPv6 supported?</h3>
              <p className="text-slate-600">
                Currently, this tool supports IPv4 only. IPv6 support is planned for a future update.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function KV({ label, value, copyable }) {
  return (
    <div className="rounded-xl border-2 border-slate-200 p-4 hover:border-indigo-200 transition">
      <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">{label}</div>
      <div className="flex items-center justify-between gap-3">
        <code className="text-base font-mono break-words flex-1">{value}</code>
        {copyable && (
          <button
            onClick={() => copy(String(value))}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 hover:text-indigo-700 transition font-medium whitespace-nowrap"
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
}
