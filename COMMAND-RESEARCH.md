# Command documentation research

Reviewed on 2026-11-02. The library contains **443 examples for 75 tools and APIs**, with 3–8 examples per tool. This adds 271 examples and command coverage for 21 tool/service entries. The reviewed alias registry still covers 88 tools/services.

This is a curated set of practical workflows, not every possible command, flag combination, or installation-specific plugin. The research pass retrieved 67 official documentation/source documents and used additional vendor references online. Source URLs appear under each tool in the app. Retrieval hashes are in `src/data/commandSourceAudit.json`; upstream documentation text is not redistributed.

## Corrections and new coverage

- Removed the unsupported Objection `list-applications` example and replaced it with documented attach, spawn, local/network, and startup-script workflows. The current upstream uses `start`; older packages may still use `explore`.
- Corrected Fingerprintx JSON output to `--json`.
- Replaced the unconfirmed ASAR list flag with documented list, extract, extract-file, and pack operations.
- Used the current BuiltWith v26 domain API and its documented Authorization header.
- Added domain intelligence requests for DNSDumpster, SecurityTrails, VirusTotal, Censys, Cert Spotter, Internet Archive, Common Crawl, FOFA, ZoomEye, Chaos, Wappalyzer, and BuiltWith.
- Added missing native-analysis examples for fsmon, Keychain Dumper, dnSpyEx console, ILSpyCmd, IDA, and Process Monitor.
- Added client-side proxy checks for Squid and CCProxy, clearly identified as curl commands rather than invented server switches.

## Verification limits

The app was built and its nine automated tests passed. Tools were not installed, scans were not run, and authenticated API requests were not sent. No real API key is embedded in any example. Set the named environment variables in your own terminal. POSIX shell syntax, local tools, API quotas, subscriptions, platform support, and permissions are noted where applicable.

351 examples retain a **verify flags** badge because default-branch documentation, legacy upstream code, or platform/edition differences do not establish compatibility with every installed stable release. A documentation review date is not a claim of runtime verification.

## Tool inventory and references

| Tool | Examples | References |
| --- | ---: | --- |
| adb | 8 | [source 1](https://developer.android.com/tools/adb) |
| amass | 8 | [source 1](https://github.com/owasp-amass/amass/wiki/User-Guide) · [source 2](https://github.com/owasp-amass/amass/blob/master/doc/user_guide.md) |
| apktool | 6 | [source 1](https://apktool.org/docs/cli-parameters/) |
| asar | 4 | [source 1](https://github.com/electron/asar/blob/main/README.md) |
| assetfinder | 4 | [source 1](https://github.com/tomnomnom/assetfinder/blob/master/main.go) |
| builtwith | 3 | [source 1](https://api.builtwith.com/domain-api) |
| burp | 7 | [source 1](https://portswigger.net/burp/documentation/desktop/getting-started/launch-from-command-line) |
| ccproxy | 3 | [source 1](https://www.youngzsoft.net/ccproxy/basic-server-settings.htm) · [source 2](https://curl.se/docs/manpage.html) |
| censys | 3 | [source 1](https://docs.censys.com/reference/get-started) · [source 2](https://docs.censys.com/reference/v3-globaldata-search-query) |
| certspotter | 3 | [source 1](https://sslmate.com/help/reference/ct_search_api_v1) |
| cfr | 4 | [source 1](https://www.benf.org/other/cfr/) |
| chaos | 4 | [source 1](https://github.com/projectdiscovery/chaos-client/blob/main/README.md) |
| class-dump | 5 | [source 1](https://github.com/nygard/class-dump) · [source 2](https://github.com/nygard/class-dump/blob/master/README.md) |
| common-crawl | 3 | [source 1](https://index.commoncrawl.org/) · [source 2](https://github.com/webrecorder/pywb/wiki/CDX-Server-API) |
| crt.sh | 3 | [source 1](https://crt.sh/) · [source 2](https://github.com/crtsh/certwatch_db) |
| curl | 8 | [source 1](https://curl.se/docs/manpage.html) |
| cycript | 5 | [source 1](https://www.cycript.org/manual/) |
| dig | 8 | [source 1](https://bind9.readthedocs.io/en/latest/manpages.html) |
| dirsearch | 8 | [source 1](https://github.com/maurosoria/dirsearch/blob/master/docs/USAGE.md) · [source 2](https://github.com/maurosoria/dirsearch/blob/master/README.md) |
| dnscan | 8 | [source 1](https://github.com/rbsec/dnscan/blob/master/README.md) |
| dnsdumpster | 3 | [source 1](https://dnsdumpster.com/developer/) |
| dnspy | 3 | [source 1](https://github.com/dnSpyEx/dnSpy/blob/master/dnSpy/dnSpy.Console/Program.cs) |
| dnsrecon | 6 | [source 1](https://github.com/darkoperator/dnsrecon/blob/master/README.md) |
| droopescan | 6 | [source 1](https://github.com/droope/droopescan/blob/master/README.md) |
| drozer | 7 | [source 1](https://github.com/WithSecureLabs/drozer) · [source 2](https://github.com/WithSecureLabs/drozer/blob/develop/README.md) |
| feroxbuster | 8 | [source 1](https://github.com/epi052/feroxbuster/blob/main/README.md) |
| ffuf | 8 | [source 1](https://github.com/ffuf/ffuf) · [source 2](https://github.com/ffuf/ffuf/blob/master/README.md) |
| findomain | 6 | [source 1](https://github.com/Findomain/Findomain/blob/master/README.md) |
| fingerprintx | 8 | [source 1](https://github.com/praetorian-inc/fingerprintx/blob/main/README.md) |
| fofa | 4 | [source 1](https://github.com/fofapro/fofa-py/blob/master/docs/README_EN.md) · [source 2](https://github.com/fofapro/fofa-py/blob/master/README.md) |
| frida | 8 | [source 1](https://frida.re/docs/frida-cli/) · [source 2](https://frida.re/docs/frida-ps/) · [source 3](https://github.com/frida/frida-tools) |
| fsmon | 5 | [source 1](https://github.com/nowsecure/fsmon/blob/master/README.md) |
| gau | 8 | [source 1](https://github.com/lc/gau/blob/master/README.md) |
| gobuster | 8 | [source 1](https://github.com/OJ/gobuster) · [source 2](https://github.com/OJ/gobuster/blob/master/README.md) |
| hakrawler | 8 | [source 1](https://github.com/hakluke/hakrawler/blob/master/README.md) |
| httpx | 8 | [source 1](https://github.com/projectdiscovery/httpx) · [source 2](https://github.com/projectdiscovery/httpx/blob/dev/README.md) |
| ida | 3 | [source 1](https://docs.hex-rays.com/user-guide/configuration/command-line-switches) |
| ilspy | 5 | [source 1](https://github.com/icsharpcode/ILSpy/blob/master/ICSharpCode.ILSpyCmd/README.md) |
| jadx | 8 | [source 1](https://github.com/skylot/jadx) · [source 2](https://github.com/skylot/jadx/blob/master/README.md) |
| joomscan | 5 | [source 1](https://github.com/OWASP/joomscan/blob/master/README.md) |
| katana | 8 | [source 1](https://github.com/projectdiscovery/katana/blob/main/README.md) |
| keychain-dumper | 3 | [source 1](https://github.com/ptoomey3/Keychain-Dumper/blob/master/README.md) |
| knockpy | 8 | [source 1](https://github.com/guelfoweb/knock/blob/master/README.md) |
| linkfinder | 6 | [source 1](https://github.com/GerbenJavado/LinkFinder/blob/master/README.md) |
| lldb | 8 | [source 1](https://lldb.llvm.org/use/map.html) |
| masscan | 6 | [source 1](https://github.com/robertdavidgraham/masscan/blob/master/README.md) |
| massdns | 6 | [source 1](https://github.com/blechschmidt/massdns/blob/master/README.md) |
| mitmproxy | 8 | [source 1](https://docs.mitmproxy.org/stable/overview/features/) · [source 2](https://docs.mitmproxy.org/stable/) · [source 3](https://docs.mitmproxy.org/stable/concepts/options/) |
| naabu | 8 | [source 1](https://github.com/projectdiscovery/naabu/blob/dev/README.md) |
| nmap | 8 | [source 1](https://nmap.org/book/man-briefoptions.html) · [source 2](https://nmap.org/book/man.html) |
| nuclei | 8 | [source 1](https://projectdiscovery.io/open-source) · [source 2](https://github.com/projectdiscovery/nuclei/blob/dev/README.md) |
| objection | 8 | [source 1](https://github.com/sensepost/objection/wiki/Using-objection) · [source 2](https://github.com/sensepost/objection/blob/master/objection/console/cli.py) |
| openssl | 8 | [source 1](https://docs.openssl.org/3.6/man1/openssl-s_client/) · [source 2](https://docs.openssl.org/3.6/man1/openssl-x509/) |
| paramspider | 5 | [source 1](https://github.com/devanshbatham/ParamSpider/blob/master/README.md) |
| process-monitor | 3 | [source 1](https://learn.microsoft.com/en-us/troubleshoot/windows-client/shell-experience/troubleshoot-apps-start-failure-use-process-monitor) · [source 2](https://learn.microsoft.com/sysinternals/downloads/procmon) |
| rpcinfo | 5 | [source 1](https://man7.org/linux/man-pages/man8/rpcinfo.8.html) |
| rustscan | 6 | [source 1](https://github.com/RustScan/RustScan/wiki/Usage) · [source 2](https://github.com/RustScan/RustScan/blob/master/README.md) |
| securitytrails | 4 | [source 1](https://docs.securitytrails.com/docs/examples) · [source 2](https://docs.securitytrails.com/docs/authentication) · [source 3](https://docs.securitytrails.com/reference/list-subdomains-old-1) |
| shodan | 7 | [source 1](https://cli.shodan.io/) |
| sqlmap | 8 | [source 1](https://github.com/sqlmapproject/sqlmap/wiki/Usage) · [source 2](https://github.com/wiki/sqlmapproject/blob/sqlmap/Usage.md) |
| squid | 3 | [source 1](https://www.squid-cache.org/Doc/man/squid.html) · [source 2](https://curl.se/docs/manpage.html) · [source 3](https://www.squid-cache.org/Doc/config/) |
| subfinder | 8 | [source 1](https://github.com/projectdiscovery/subfinder) · [source 2](https://github.com/projectdiscovery/subfinder/blob/dev/README.md) |
| sublist3r | 5 | [source 1](https://github.com/aboul3la/Sublist3r/blob/master/README.md) |
| testssl.sh | 8 | [source 1](https://github.com/testssl/testssl.sh/blob/3.2/doc/testssl.1.md) |
| unicornscan | 3 | [source 1](https://sourceforge.net/p/osace/wiki/Unicornscan/) |
| virustotal | 3 | [source 1](https://docs.virustotal.com/reference/domains-object) · [source 2](https://docs.virustotal.com/reference/domain-object-subdomains) · [source 3](https://docs.virustotal.com/reference/authentication) |
| wafw00f | 5 | [source 1](https://github.com/EnableSecurity/wafw00f/blob/master/README.md) |
| wappalyzer | 3 | [source 1](https://www.wappalyzer.com/docs/api/v2/lookup/) · [source 2](https://www.wappalyzer.com/api/) |
| wayback-machine | 4 | [source 1](https://github.com/internetarchive/wayback/tree/master/wayback-cdx-server) · [source 2](https://github.com/internetarchive/wayback/blob/master/wayback-cdx-server/README.md) |
| waybackurls | 5 | [source 1](https://github.com/tomnomnom/waybackurls/blob/master/main.go) |
| webanalyze | 8 | [source 1](https://github.com/rverton/webanalyze/blob/master/README.md) |
| whatweb | 8 | [source 1](https://github.com/urbanadventurer/WhatWeb/blob/master/README.md) |
| wireshark | 8 | [source 1](https://www.wireshark.org/docs/man-pages/tshark.html) |
| wpscan | 8 | [source 1](https://github.com/wpscanteam/wpscan/blob/master/README.md) |
| zoomeye | 3 | [source 1](https://www.zoomeye.ai/agent/doc) |

## Remaining gaps

The command report lists 14 checks with missing command coverage across these 13 entries. Entries linked alongside a supported tool still show that supported tool's commands.

- **turbo-intruder**: Burp extension with a Python script editor; no supported standalone CLI. Use its shipped templates inside Burp.
- **google-transparency**: Web reporting interface; no documented stable domain-search CLI found.
- **facebook-ct**: Legacy Facebook certificate-search endpoint; current supported domain-query API could not be confirmed.
- **rapid7-sonar**: Dataset access and credentials vary. No current universal domain-query command was confirmed.
- **recon.dev**: No current maintained API contract could be confirmed. Legacy examples were not copied.
- **bufferover.run**: Legacy endpoint; current DNS API and authentication contract could not be confirmed.
- **dorkassistant**: The checklist does not identify a unique maintained project or command interface.
- **jsparser**: The identifiable NahamSec project is a legacy Python 2 web service, not a current standalone parsing CLI.
- **xposed**: Android runtime framework with module-specific setup; no universal Xposed scan command.
- **hopper**: GUI workflow and platform-specific launcher; no current documented batch CLI was confirmed.
- **jd-gui**: Java GUI decompiler; no documented batch decompilation command. CFR provides the related CLI workflow.
- **api-monitor**: Rohitab GUI API monitor; no supported command-line capture contract was confirmed.
- **cheat-engine**: GUI memory inspection workflow. No general app-analysis CLI was confirmed.

Run `npm run commands:report` for the check IDs and exact checklist text.
