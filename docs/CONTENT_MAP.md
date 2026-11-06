# Content Map: Slide → Page

Maps each website page to its source slides from Chapter_6_Attacking_Authentication_Lecture.pptx (65 slides).

## / Home
- **Hero**: Slide 1 ("Identity • Evidence • Trust", title, subtitle)
- **Learning objectives**: Slide 3 (5 objectives)
- **Access chain diagram**: Slide 5 (Claim → Verify → Bind → Monitor)
- **CTA buttons**: to /technologies (Learn) and /labs (Labs)

## /technologies (Slides 6–10)
| Slide | Topic |
|-------|-------|
| 6 | Authentication technologies overview (forms, MFA, certs, HTTP auth, third-party) |
| 7 | Forms-based login pattern |
| 8 | Multifactor authentication (factor categories, password+PIN ≠ MFA) |
| 9 | Certificates, smartcards, integrated authentication |
| 10 | Federated authentication (IdP, assertions, trust) |

## /design-flaws (Slides 11–26)
| Slide | Topic | Flaw Type |
|-------|-------|-----------|
| 11 | Design flaws section intro | Section map |
| 12 | Bad passwords | Design flaw |
| 13 | Brute-force, stuffing, spraying | Attack pattern |
| 14 | Rate limits and lockout | Defense design |
| 15 | Account enumeration via messages | Information leakage |
| 16 | Credentials in transit | Design flaw |
| 17 | Password change vulnerabilities | Design flaw |
| 18 | Recovery as alternate auth path | Design flaw |
| 19 | "Remember me" lifecycle | Design flaw |
| 20 | User impersonation | Design flaw |
| 21 | Incomplete validation | Design flaw |
| 22 | Nonunique usernames | Design flaw |
| 23 | Predictable usernames | Design flaw |
| 24 | Predictable initial passwords | Design flaw |
| 25 | Insecure credential distribution | Design flaw |
| 26 | Design flaws recap | Section recap |

## /implementation-flaws (Slides 27–32)
| Slide | Topic |
|-------|-------|
| 27 | Implementation flaws section intro |
| 28 | Fail-open login |
| 29 | Multistage login state machine |
| 30 | Validate-each-transition procedure |
| 31 | Replayable/selectable random questions |
| 32 | Credential storage and breach impact |

## /threat-model (Slide 33)
| Slide | Topic |
|-------|-------|
| 33 | Weakness → attacker capability map (online oracle, client state, DB disclosure, recovery path) |

## /defenses (Slides 34–44)
| Slide | Topic | Layer |
|-------|-------|-------|
| 34 | Defense framework intro (risk + usability) | Framework |
| 35 | Strong credentials (modern interpretation) | Credential |
| 36 | Secret handling (transit, storage, logs) | Credential |
| 37 | Password hashing (Argon2id, bcrypt, scrypt) | Credential |
| 38 | Consistent validation, fail-safe | Protocol |
| 39 | Prevent information leakage | Protocol |
| 40 | Prevent guessing/reuse attacks | Protocol |
| 41 | Password change protection | Lifecycle |
| 42 | Account recovery protection | Lifecycle |
| 43 | Logging, monitoring, notification | Operations |
| 44 | Practical architecture (4 layers) | Synthesis |

## /assessment (Slides 45–47)
| Slide | Topic |
|-------|-------|
| 45 | Safe assessment workflow |
| 46 | Case: account enumeration |
| 47 | Case: multistage authentication |

## /then-vs-now (Slides 49–58)
| Slide | Topic | Tag |
|-------|-------|-----|
| 49 | Update module intro | — |
| 50 | Historical frame (2011 ecosystem) | Historical |
| 51 | What changed and why | Evolution |
| 52 | Passwords (NIST 800-63B-4 rules) | Updated practice |
| 53 | Password verifier storage (Argon2id etc.) | Updated practice |
| 54 | Phishing-resistant auth / passkeys | Updated practice |
| 55 | MFA is not one security level | Updated practice |
| 56 | Identity lifecycle / assurance levels | Updated practice |
| 57 | Side-by-side comparison | Comparison |
| 58 | Practical implications | Implications |

## /labs
All labs are client-side simulations. Source slides for concepts:
| Lab | Name | Primary Slides |
|-----|------|---------------|
| 1 | Access Chain Explorer | 5 |
| 2 | Enumeration Comparator | 15, 46 |
| 3 | Rate-Limit Simulator | 14, 40 |
| 4 | Multistage State Machine | 29, 30, 47 |
| 5 | Password Storage Cost | 32, 37, 53 |
| 6 | Policy Checker | 12, 35, 52 |
| 7 | MFA Factor Sorter | 8, 55 |
| 8 | Then-vs-Now Slider | 50–58 |

## /quiz
Questions derived from all sections. Minimum 5 per major section:
- Technologies (slides 6–10)
- Design flaws (slides 11–26)
- Implementation flaws (slides 27–32)
- Defenses (slides 34–44)
- Then vs Now (slides 49–58)

## /checklist (Slide 62)
Interactive checklist from slide 62's review list (register, login, change, remember, recover, federate, impersonate, revoke + state tracing + secret protection + defense/observe).

## /references (Slide 59)
- NIST SP 800-63-4 / 63B-4
- OWASP Authentication and Password Storage Cheat Sheets
- FIDO Alliance passkeys guidance (2025)

## Recap slides (60–64) used across site
| Slide | Used in |
|-------|---------|
| 48 | Chapter summary (footer/about) |
| 60 | Home page summary section |
| 61 | Glossary definitions |
| 64 | Key takeaways (home page) |
| 65 | Not used (Q&A slide) |
