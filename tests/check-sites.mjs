// "Internet test": are Ochir's websites online and fast? Run: npm run check:sites
const SITES = [
  'https://monprocess.org/',
  'https://mongoliantour.guide/',
  'https://purevochir-arch.github.io/ochir/simulators/'
];
let failed = 0;
for (const url of SITES) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(20000) });
    const ms = Date.now() - t0;
    const ok = res.ok && ms < 8000;
    console.log(`${ok ? 'OK  ' : 'FAIL'} ${res.status} ${String(ms).padStart(5)} ms  ${url}`);
    if (!ok) failed++;
  } catch (e) {
    console.log(`FAIL  ---       --  ${url}  (${e.cause?.code || e.name})`);
    failed++;
  }
}
process.exit(failed ? 1 : 0);
