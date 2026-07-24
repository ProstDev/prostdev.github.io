// YouTube uploads DELIBERATELY kept OUT of the curated video catalog (src/data/videos.ts).
//
// The catalog is a hand-picked EDITORIAL subset, not a mirror of the channel. The channel
// also holds ~260 older livestreams, #Codetober dailies, meetups, podcasts, Shorts, and
// off-topic side-quests that we intentionally DON'T surface as individual catalog entries —
// several are already linked as whole playlists via FUN_PLAYLISTS / COMMUNITY_PLAYLISTS at
// the bottom of /videos.
//
// `scripts/sync-youtube-metadata.mjs --discover` diffs the channel's uploads against the
// catalog and nudges "run /add-video" for anything not in it. Without this list, that entire
// back-catalog floods the weekly tracking issue every run and buries the real signal (a genuine
// new upload, a renamed title, a blank duration). The discover step subtracts these IDs so only
// GENUINELY new uploads surface.
//
// To ADD one of these to the site later: run `/add-video` for it (it'll land in videos.ts) and
// delete its line here — or just delete the line to make the next sync re-surface it as a nudge.
// This list only silences the discover nudge; it has NO effect on the live site or the catalog.

export const DISCOVER_IGNORE_IDS: string[] = [
  '07RgkWzH_s8', // 3 AIs mocked MuleSoft data — only 2 made it last 👀 #mulesoft (Short)
  'pgiwM8TH4sA', // using docker compose to create an instant mysql installation locally! #mulesoft #acb #docker #mysql
  '6RhN2O_CQ1k', // #mulesoft #acb #anypointcodebuilder #technology #tech
  'dEeUCDjsADg', // Here’s your best friend in ACB: the Command Palette. #mulesoft #coding
  'n9ErNs6_sDE', // 📊 Only 10% are using ACB daily. New tech always feels weird—until it becomes the default. #mulesoft
  'fYnSh9ewclE', // Not saying ditch Studio just yet...But if you're not already playing with ACB, you're behind.
  'fRo4R3TyNgY', // Getting started with the Anypoint Speedway Season 4 challenge in Anypoint Code Builder!
  'PpQ0DN3GhWo', // #salesforce #einstein and I gave it a shot but ended up in heartbreak #mulesoft #tech #ai #software
  'TxyytWgVLss', // I may not know a lot about #datacloud but I make it work 😂 #mulesoft #salesforce #integration
  'oVwu75vMbks', // [PREVIOUSLY LIVE] Anypoint Speedway Season 3 - Tier 3
  'h15Xr3HPsqs', // [PREVIOUSLY LIVE] Anypoint Speedway Season 3 - Tiers 1 & 2
  'KyHmOJW5EpA', // #salesforce #mulesoft #datacloud #integration #api #postman #tech #software #softwaredeveloper
  'tO8b1bdKyZ0', // 🤣 + live streams at twitch.tv/mulesoft_community #mulesoft #mulesoftcommunity #techjokes #jvm #java
  '2BmFQ8_yMtE', // #acb #anypointcodebuilder #mulesoft #mulesoftcommunity #mulesoftdeveloper #technology #tech
  'KOTG9AHS13A', // Export a Mule project as a deployable JAR file in Anypoint Code Builder | #Codetober 2023 Day 31
  '7fTitIdCT3s', // Differences between the DataWeave extension & Anypoint Code Builder | #Codetober 2023 Day 30
  'u13IzP7YiEg', // Enable Multi-Factor Authentication in MuleSoft with the Salesforce App | #Codetober 2023 Day 29
  'F8jeqW93x2E', // Testing Mule flows with the MUnit recorder in Anypoint Studio | #Codetober 2023 Day 28
  'imPeV-JJrmc', // Using branches in Design Center & Anypoint Code Builder for API specs | #Codetober 2023 Day 27
  'v7Qv3s_RDK0', // Using the Transform Message component (DataWeave) in Anypoint Code Builder | #Codetober 2023 Day 26
  'la0GM2KUbio', // Implement & test a GraphQL API in Anypoint Code Builder (ACB) | #Codetober 2023 Day 25
  'DZGkrtxTyNY', // Debugging the American Flights App in Anypoint Code Builder (ACB) | #Codetober 2023 Day 24
  'UxDPOjUZUCg', // Implementing the American Flights API Spec in Anypoint Code Builder (ACB) | #Codetober 2023 Day 23
  '62w45KzekXM', // Transforming Flight Data with DataWeave in Anypoint Code Builder (ACB) | #Codetober 2023 Day 22
  'PFrBliD2W7I', // Connecting to a Database from the Mule app in Anypoint Code Builder (ACB) | #Codetober 2023 Day 21
  'hAHosASL-cA', // Integrating American Flights Processes in Anypoint Code Builder (ACB) | #Codetober 2023 Day 20
  'mLm34YPn180', // Testing, syncing, and publishing an API in Anypoint Code Builder (ACB) | #Codetober 2023 Day 19
  'Plmry5Usq5U', // Designing the American Flights API Spec in Anypoint Code Builder (ACB) | #Codetober 2023 Day 18
  's9Vd31XAPRM', // Deploy Experience, Process, & System API layers to CloudHub 2.0 from Studio | #Codetober 2023 Day 17
  'SvK68NRfpJM', // ANYPOINT CODE BUILDER IS GA!!!
  'KwlV7BC8lOY', // How to debug several Mule applications in Anypoint Studio at the same time | #Codetober 2023 Day 16
  'vjuS_o12FMA', // Setting up HTTP Requests for Experience, Process, & System layers in Mule 4 | #Codetober 2023 Day 15
  'vccXdAiup3o', // Best practices in Mule apps: global elements & properties files per env | #Codetober 2023 Day 14
  '45XW5Gu4Pgo', // How to run several Mule applications in Anypoint Studio at the same time | #Codetober 2023 Day 13
  'svRDoS1UbOY', // Help us get DataWeave into Exercism for programming challenges/exercises | #Codetober 2023 Day 12
  'Uzz2_yO-DJQ', // 8 examples to import modules/functions in DataWeave & how to use aliases | #Codetober 2023 Day 11
  'x_g-v6gJnbY', // How to use DataWeave 2.5 with the BETA extension in Visual Studio Code | #Codetober 2023 Day 10
  'r3V81EgFdGY', // How to deploy to CloudHub 2.0 with the Mule Maven Plugin & Connected App | #Codetober 2023 Day 9
  'COXOGBnmsSI', // Exploring the GitHub Actions Extension for Visual Studio Code | #Codetober 2023 Day 8
  'za3SZTEUdyA', // come race with me at twitch.tv/devalexmartinez 😁 #tech #technology #livestream #mulesoft #cicd
  'kmSmXjZVrf8', // I SAID I WAS HAVING FUN 😡 | Anypoint Race API Season 2 | Part 2.2 | live coding | live stream
  'mzJnZ1h9VU8', // It was all fun and rainbows... | Anypoint Race API Season 2 | Part 2.1 | live coding | live stream
  'MpXFIdqchII', // Let's race!!! | Anypoint Race API Season 2 | Part 1 | live coding | live stream
  'pVJuvrf1_tM', // How to create custom user snippets in Anypoint Code Builder (VS Code) | #Codetober 2023 Day 7
  'JvAyDtui0A4', // Anypoint Race API Season 2!
  'oIN0tLa8zQ4', // Exploring the Thunder Client Extension for Visual Studio Code | #Codetober 2023 Day 6
  'CY2WeiTAgvk', // DataWeave 2.5 module features: toString, concatWith, version | #Codetober 2023 Day 5
  '8TqtcafHNT8', // Use MuleSoft's visual API Designer to create a To-Do API specification | #Codetober 2023 Day 4
  'Wl9D72kBjso', // How to RE-scaffold Mule flows from an Exchange API spec in Anypoint Studio | #Codetober 2023 Day 3
  'H-yS4PEFWDw', // BATTLESNAKE IS BACK! | Battlesnake Part 14 🐍⚔️ | MuleSoft API | DataWeave language | live coding
  '59PQL1FfM_g', // How to scaffold Mule flows from a published API spec in Anypoint Code Builder | #Codetober 23 Day 2
  'PHfN7Ah9mpc', // How to scaffold Mule flows from a published API spec in Anypoint Studio | #Codetober 2023 Day 1
  'kV-pRhbQGJs', // Exploring Anypoint DataGraph with Alex...for the second time! | live coding | graphql | apis
  '0qTcTQYtttw', // MuleSoft integration with WhatsApp
  'BZmXJ2L5t-Q', // DataWeave + Advent of Code 2022 Day 13 (Part 2)
  'gdn-9pbGFk8', // Secure your data and integrations with Salesforce via Private Connect
  'BjL51QEbIS8', // Let's have some DataWeave fun with Advent of Code! (Day 13, Part 1)
  '1T6dFFSztg8', // Exploring MuleSoft Composer + RPA with Kiranjot!
  'OaZaFJGEalQ', // Exploring API-led in .NET circles & preparing for Mule certification!
  'CbS52VjJYQ4', // Capture KPIs with Metrics Tool Kit, MuleSoft Composer import into Tableau
  '1UhBLO70MTk', // Exploring Global Load Balancing and Resilience with Michael! | architecture | disaster recovery
  'FDYwnJQjL2U', // Exploring the Tracing module with Shyam! | live coding | MuleSoft
  'gp5-VhG3t_A', // share your favorite tech joke! #technology #humor #development #jokes #coding #apis
  'tiyRtvQJypw', // What's new in Anypoint Code Builder?? | June 2023 update
  'H4vpo8C5Wbg', // How Salesforce Admins use MuleSoft Composer and Salesforce Flows | live coding
  '_KBvYH5eDBA', // Shivani talks about Salesforce World Tour New York City...And CHATBOTS!
  '7bDw6pO3Fas', // how to keep creating free trial accounts in Anypoint Platform! #mulesoft #tipsandtricks
  'dIBBkEaP4TY', // Processing large binary files in MuleSoft with Chuck!! | live coding
  '2onlD5E_ZUg', // Exploring Anypoint DataGraph with CI/CD | live coding
  'h3r7BcxWm9c', // Flyway Integration in MuleSoft with Shyam! | live coding
  'C5DSlxvGBW0', // Answering questions and drinking tea with Alex!
  'a32VquPQuCE', // Display keystrokes on screen with keycastr (FREE) | content creation tips | TECH IT or LEAVE IT
  '7cecZ4HSIwU', // Exploring automation and hyperautomation with Shivani!
  'OShl0r0UbUM', // DataWeave + Battlesnake + Python + Vercel | live coding
  '3kOaKLbnLx8', // What's new in Anypoint Code Builder? With Alex!
  'Tnvt7i3AbkE', // Solving the DataWeave challenge #5 - reverse a phrase's words | live coding | lo-fi music
  'croK_zkHpdM', // What is Hyperautomation? Let's find out with Ambassadress Digital Dee!
  'bsM4D-ek-T4', // New Battlesnake using Python/Flask + DataWeave + Vercel | live coding
  'CItYMK19NxM', // Deep dive into Anypoint MQ with Jacky! | live coding | MuleSoft | queues
  '5a5h5xKR7xE', // Exploring MuleSoft's BAT CLI for functional testing | live coding | CI/CD | DataWeave
  'LRe-cke7jOQ', // What is Sentry? | live coding | log4j2 | MuleSoft
  'yuVmgeRC18w', // Why is my snake not working :( | Battlesnake | MuleSoft API | DataWeave programming | live coding
  'Z0ORL0yoKCo', // Exploring CI/CD with GitHub Actions for the MUnit coverage
  '75iwKpD1oKc', // Exploring Anypoint Code Builder (and VSCode in general) with Alex!
  'ckYtfJlxWyw', // Exploring Anypoint Code Builder for the SECOND time!
  '35BgAd0ohAk', // Exploring Anypoint Code Builder for the first time!
  'uoUKH1TJfbY', // Exploring DataWeave in Anypoint Code Builder with Ana Felisatti!
  'zUvc7FM0y6E', // Get'cha battlesnake on 🐍👾 with Alex!
  '23sdn0_YSxk', // BATTLESNAKE TIME!! 🐍 WOOT WOOT
  '99ZUtKFstJg', // Still doing Advent of Code '22 day 5 with DataWeave!
  'GpnpPkh0hyk', // Happy new year!! First stream of 2023 ✨ | Advent of Code day 3
  'K_fddA5tn7g', // Leveraging the Enhanced Mule open-source project to accelerate your Mule apps with Yannick!
  'MV5iDMfQyUk', // Exploring DataWeave modules with Pranav!
  'pbMUpC5_4w4', // Advent of Code 2022 Day 2 with DataWeave!
  'vHYwvwxjio8', // Solving programming puzzles with DataWeave! ~ Advent of Code 2022 Day 1
  'RLUQcwa-npM', // Can we debug DataWeave code in Visual Studio Code? 🧐 Yes, we can!
  '0t_yuq96dBU', // Exploring Anypoint API Catalog CLI with Alex!
  'uzq4EMjvh4s', // Exploring MuleSoft Composer to integrate Twilio and WhatsApp with Joey!
  'Gft6Hql9SKw', // Port-based vs. path-based routing in Flex Gateway with Jacky!
  '3wVFpBC4gcs', // What in the world is Head and Tail in DataWeave?! With Mariano!
  '8pb5YDewe3Q', // Alex does...things... Perhaps Anypoint CLI or DataWeave? (Mostly DW)
  'Au7-_bsOKNI', // Exploring products: Custom connector using MuleSoft XML SDK with Vikalp!
  'wqZpULmHkqk', // Exploring Composer with MuleSoft Mentor Shivani Marrero!
  'dIJExT6vBZk', // Exploring schemas for edi documents with Pranav Davar!
  'P1IsfLbz1wo', // Exploring CloudHub 2.0 with MuleSoft Mentor Anurag Sharma!
  'SRezx0BCojQ', // Exploring Hybrid to Runtime Fabric migrations with Kai!
  'U2giaCab4Jk', // Exploring Anypoint DataGraph with Alex!
  'sjOugrXPWmY', // Exploring products: Flex Gateway in local mode with dev advocate Akshata!
  'TJRHXK7wpIs', // The authors behind the new MuleSoft for Salesforce Developers book | suitable for all beginners!
  '3JroXsa9eq8', // Exploring API Governance with developer advocate Akshata!
  'sqoWSIqZkW8', // Alex tries to install Anypoint Flex Gateway in local mode as a Docker container
  '4naOGtcfmOY', // Exploring products: Anypoint Flex Gateway as a Kubernetes Ingress Controller with Jacky!
  '0itg4t-iHnM', // Exploring products: Flex Gateway with MuleSoft Ambassador Jitendra Bafna!
  'nW3yL0x0-ds', // Setting up MuleSoft CI/CD with GitHub actions! (Part 4) DataWeave libraries
  'jskWSN_g5Y8', // Setting up MuleSoft CI/CD with GitHub actions! (Part 3) DataWeave libraries
  '3vw1bSNH374', // Exploring products: MuleSoft RPA with the Training team!
  'YZhVfVhN8QM', // Exploring products: Navigating through out-of-the-box policies with Akshata!
  'Po6ZTt-BHWs', // Exploring products: DataWeave extension and GitHub actions with Alex!
  'njMbF-54ZIU', // Exploring products: Let's learn some DataWeave with Akshata Sawant!
  'EyzptZRbb1Y', // Setting up MuleSoft CI/CD with GitHub actions! (Part 2) DataWeave libraries
  'JCZhFY6qogk', // Setting up MuleSoft CI/CD with GitHub actions! (Part 1) CloudHub
  'yNXH-9PkShE', // discovering new things 😆 #mulesoft
  'T-ADYjciy8A', // Exploring products: Talk DataWeave to me - with Mariano de Achaval!
  'aqH31jk-CzU', // Exploring MuleSoft for Salesforce CDP with Ally Hepp and Priya Singh
  'ZOYoaShRdQo', // Exploring products: DataWeave extension for VSCode
  'RodVd4b5cjM', // Exploring Anypoint API Governance with Alex!
  'Yq8sWMiK3cg', // How to use the map and reduce functions in DataWeave
  'YmN9oIdWccg', // EKS tutorial for Runtime Fabric Part 2
  'Hs2cu2ABRDE', // Building a Slack modal with MuleSoft!
  'vnaGZwHOLxc', // Let's try out the Amazon EKS tutorial for Runtime Fabric!
  'bA9dQGrI5TQ', // Creating a Slack integration with MuleSoft's Flow Designer from scratch!
  'DMRvFlr2NEs', // Create your first API Specification with the visual API Designer
  '36TENXpOxwo', // Let's see what's new in DataWeave 2.4 Mule 4.4 Part II
  'F4bJHbuWpM0', // Let's see what's new in DataWeave 2.4 Mule 4.4 Part I
  '3MO1svtjJLQ', // Creating a Slack bot with MuleSoft from scratch!
  'xjrG6oE3f7s', // Creating a custom Slack app with MuleSoft from scratch!
  'fWj7O3HO4VQ', // Fixing my Battlesnake's MUnits for the CI/CD pipeline | live coding | lo-fi music | MuleSoft 4
  'DuK-UVX7Y1s', // [LIVE STREAM] BAD MAXINE | Battlesnake Part 10 | MuleSoft API | DataWeave language | live coding
  'iFxPzj0e0eg', // Solving the Tower of Hanoi mathematical puzzle with DataWeave | live coding | lo-fi music
  '9EcgGydHUgw', // Solving a simple (3 disks) Tower of Hanoi | Mathematical puzzle
  'OlrbxUiU_GU', // [LIVE STREAM] Maxine v2 is out! | Battlesnake Part 9 | MuleSoft API | DataWeave programming language
  'Cm_cFXGm2-Q', // [LIVE STREAM] Watching the leaderboard! | Battlesnake Part 8 🐍⚔️ | MuleSoft API | DataWeave
  '4zzb2IESQxE', // [LIVE STREAM] Last code version! | Battlesnake Part 7 🐍⚔️ | MuleSoft API | DataWeave programming
  '6ZeKW0c7st4', // [LIVE STREAM] Improving the head collision thing | Battlesnake Part 6 🐍⚔️ | MuleSoft API | DataWeave
  'a97dYlHwiFo', // [LIVE STREAM] Tips from Rolando | Battlesnake Part 5 🐍⚔️ | MuleSoft API | DataWeave
  'KUTdv5GtJa0', // [LIVE STREAM] C'mon Maxine! | Battlesnake Part 4 🐍⚔️ | MuleSoft API | DataWeave programming | MUnits
  'QaZIRZp-JKs', // [LIVE STREAM] Fixing the bug! | Battlesnake (Part 3) 🐍⚔️ | MuleSoft API | DataWeave programming
  'e8oCt-zqlRk', // almost made it!! #battlesnake #livestream #dataweave #mulesoft #programming
  'MdRyIGAxAyo', // please don't die x3 😆 #adventofcode #dataweave #programming #livestream
  'AVui386_KLU', // [LIVE STREAM] More Battlesnake 🐍⚔️ (Part 2) | MuleSoft API | DataWeave programming
  'UDGiwoIXn8Y', // [LIVE STREAM] Advent of Code 2022 day 9 ✨ Part 2 | DataWeave programming | VSCode
  'ADiU4LjvX3U', // [LIVE STREAM] Advent of Code 2022 day 8.2 and 9.1 with DataWeave ✨
  '5K2Ie-U9emE', // [LIVE STREAM] Improving my Battlesnake 🐍 (Part 1) | MuleSoft API | DataWeave language
  'FpqoYBBsodU', // [LIVE STREAM] Advent of Code 2022 day 8 ✨ (Part 1) with DataWeave
  'TPLgA1iSV7I', // [LIVE STREAM] Advent of Code 2022 day 7 🥹 (Part 3) #fail with DataWeave
  'n3902h-sAF0', // [LIVE STREAM] Advent of Code 2022 day 7 🧐 (Part 2) with DataWeave
  'FpG6s2deJrg', // [LIVE STREAM] Advent of Code 2022 day 7 😭 (Part 1) with DataWeave
  'bWfUth6pvpI', // [LIVE STREAM] Advent of Code 2022 days 5.2 and 6! with DataWeave ✨
  'MTM5J3Qn_aM', // [LIVE STREAM] Advent of Code 2022 day 4 -- with DataWeave!
  'pQNRoY7hJKM', // [LIVE STREAM] Advent of Code 2022 day 3 with DataWeave...FINALIZED!
  'hskmZRLX_-8', // Wrap up! What did we learn? Get in touch and give me your feedback! | #Codetober 2022 Day 31
  'JSlq6KcfYco', // Anypoint API Catalog CLI example using GitHub Actions (CI/CD & Exchange) | #Codetober 2022 Day 30
  '9icVASVvgIk', // Solving puzzles with DataWeave! Advent of Code 2022 | #Codetober 2022 Day 29
  'EETzjigjYX4', // How to debug DataWeave scripts in Visual Studio Code | #Codetober 2022 Day 28
  'WzfFkgw0xhw', // How to generate examples from GitHub to open in the DataWeave Playground | #Codetober 2022 Day 27
  'WDi0g2VtFIg', // DataWeave Scripts repo: infiniteCountFrom func (head & tail constructor) | #Codetober 2022 Day 26
  'UdDzgpOv2oo', // DataWeave Scripts repo: daysUntil function (head and tail constructor) | #Codetober 2022 Day 25
  'BKHgaldKEgs', // DataWeave Scripts repo: getDatesArray tail recursive function | #Codetober 2022 Day 24
  'LKmOEpEVFxw', // What are TAIL-recursive functions and how to use them in DataWeave | #Codetober 2022 Day 23
  '9ewcIXukbtc', // What are recursive functions and how to use them in DataWeave | #Codetober 2022 Day 22
  'HgZWIJbumjc', // To use or not to use... map and flatten vs. flatMap in DataWeave | #Codetober 2022 Day 21
  'oA0bqbxf288', // How to create visual diagrams of your Mule apps (flows, VMs, etc) with mulefd | #Codetober 22 Day 20
  'qqMKTmPxXBc', // Be more productive with the Anypoint Platform Chrome extension by Edgar! | #Codetober 2022 Day 19
  '2r8Yawczy4A', // Intro to Anypoint DataGraph (GraphQL) for your REST APIs in MuleSoft | #Codetober 2022 Day 18
  'FcOHyWh0oBA', // Set reader and writer configuration properties for data formats in DataWeave | #Codetober '22 Day 17
  '3T95ljIuUqE', // Time how long an operation takes in DataWeave with Timer::duration | #Codetober 2022 Day 16
  'bxEGro6ZJWk', // MuleSoft's CloudHub 2.0 overview and demo | #Codetober 2022 Day 15
  '-QAz9TOMh_8', // Generate random numbers with randomInt, now, uuid, & more in DataWeave | #Codetober 2022 Day 14
  '8UqtxXiuSCk', // Same result different functions: reduce, map & object destructor in DataWeave | #Codetober 22 Day 13
  'QUc1Ffs8GY0', // Simplified try-catch strategy in DataWeave with the default keyword | #Codetober 2022 Day 12
  'y2Cs1_PKmVk', // How to transform key-value pairs into objects using pluck in DataWeave | #Codetober 2022 Day 11
  'vXSyzJqEFzk', // XML attributes, namespaces, & syntax stuff in DataWeave (Stack Overflow) | #Codetober 2022 Day 10
  'wy9Z8SPMbCc', // How to groupBy 2 or more fields in DataWeave (taken from Stack Overflow) | #Codetober 2022 Day 9
  'IYUW2J3wZFw', // DataWeave's update operator vs. update function (taken from Stack Overflow) | #Codetober 2022 Day 8
  'xZbdIRDQn3s', // How to install Flex Gateway v1.2.0 in local mode as a Linux service | #Codetober 2022 Day 7
  's2K-nIldmGQ', // How to install Flex Gateway v1.2.0 in connected mode as a Linux service | #Codetober 2022 Day 6
  'UD04GNIpk08', // How to create a Linux (Ubuntu) Virtual Machine with Vagrant with a Terminal | #Codetober 2022 Day 5
  '2f_uQjz5uAI', // DateTime formatting in DataWeave (taken from Stack Overflow) | #Codetober 2022 Day 4
  '7vo5voh7seA', // DataWeave's landing page: StackOverflow, Slack, GitHub, Docs, and more! | #Codetober 2022 Day 3
  'c6j45njYCcE', // CI/CD pipelines with GitHub actions for Mule apps or DataWeave libraries | #Codetober 2022 Day 2
  'w8fOzZOj0D0', // How to look cool while developing DataWeave code 😎 with Visual Studio Code | #Codetober 2022 Day 1
  '8engg8DKVac', // Women Who Mule - November Meetup (EMEA 2021)
  'ybKTljGcPMI', // Women Who Mule - February Meetup (EMEA 2022)
  '3IGoGRhuudo', // It's a wrap! Check out some additional resources! | #Codetober 2021 Day 31
  's56BeAvicLM', // Function Overloading in DataWeave | #Codetober 2021 Day 30
  'O-AmaPWe4Yk', // DataWeave mod function | #Codetober 2021 Day 29
  'sWA-ZVB59nA', // DataWeave every function (Arrays module) | #Codetober 2021 Day 28
  'zt4NgMoQjMg', // DataWeave some function (Arrays module) | #Codetober 2021 Day 27
  'sP_p78lkNAQ', // DataWeave Scripts Repo: containsEmptyValues function | #Codetober 2021 Day 26
  'Mt0tnF6VVL4', // DataWeave mapLeafValues function (Tree module) | #Codetober 2021 Day 25
  'NBWLXaMYUB8', // DataWeave Scripts Repo: maskFields function | #Codetober 2021 Day 24
  'ebeMPyXSIv8', // DataWeave match/case (Pattern Matching) | #Codetober 2021 Day 23
  'A7qiO5UtAV4', // DataWeave typeOf function | #Codetober 2021 Day 22
  'Tu5nRmRURgQ', // DataWeave Scripts Repo: extractPathWithFilters tail recursive function | #Codetober 2021 Day 21
  'X7mTI8ofX5o', // Women Who Mule - Workshop series #3: WordPress
  'klbAr-pJJow', // DataWeave ~= (equal-ish) operator | #Codetober 2021 Day 20
  'io3Ta7geWCE', // DataWeave filter function | #Codetober 2021 Day 19
  'oTvjVf8lrkc', // DataWeave splitBy function | #Codetober 2021 Day 18
  'aKgplxe8w4I', // DataWeave Scripts Repo: filterValueByConditions tail recursive function | #Codetober 2021 Day 17
  'El8RhPF8PjY', // DataWeave scan function | #Codetober 2021 Day 16
  'E0etZZZmwAQ', // DataWeave substringAfter function (Strings module) | #Codetober 2021 Day 15
  'Lglc85pI8xU', // DataWeave isNumeric function (Strings module) | #Codetober 2021 Day 14
  '7bsJYzdkkf0', // Women Who Mule - Workshop series #2: Ghost
  'rg9i_xMO4c0', // DataWeave Scripts Repo: extractPath tail recursive function | #Codetober 2021 Day 13
  'QiP6WalvwRM', // DataWeave Scripts Repo: getDaysBetween tail recursive function | #Codetober 2021 Day 12
  '3UbTlLVNrVE', // Recursive vs. Tail Recursive functions in DataWeave | #Codetober 2021 Day 11
  '7LNsn_Mu_Fw', // DataWeave Scripts Repo: addIndexTailRecursive tail recursive function | #Codetober 2021 Day 10
  'ZRm1POYgwG0', // DataWeave Scripts Repo: getChildren recursive function | #Codetober 2021 Day 9
  '9rOnv2bYqKQ', // Women Who Mule - Workshop series #1: Wix
  'PIfYivW9x1g', // DataWeave output directive | #Codetober 2021 Day 8
  'yK7rVTkR9Pw', // DataWeave input directive | #Codetober 2021 Day 7
  'PKphi-VBAmM', // DataWeave update operator | #Codetober 2021 Day 6
  'k49N81-y7oU', // DataWeave update function | #Codetober 2021 Day 5
  'qWDxuF8Wdqc', // DataWeave Scripts Repo: Utilities | #Codetober 2021 Day 4
  'KoLYzb-eMHQ', // DataWeave Epoch Time | #Codetober 2021 Day 3
  '-zzw3fMBmYA', // DataWeave now function | #Codetober 2021 Day 2
  'hVbdR4ZIhDQ', // DataWeave log function | #Codetober 2021 Day 1
  'LqEdEyLmUmE', // Women Who Mule - September Meetup (EMEA 2021)
  'kuiVN4yKaWY', // Women Who Mule - Workshop series: Create your own blog from scratch without a single line of code!
  'OkH5l8r3Gok', // Digital Transformation Using MuleSoft - Toronto Virtual MuleSoft Meetup #13
  'HAobAYn7T3Q', // Women Who Mule - JAPAC Launch (2021)
  'd1_HDbspVoI', // Testing Strategies and MUnit Test Recorder - Toronto Virtual MuleSoft Meetup #12
  'Zipzwed1NVg', // Women Who Mule: June Meetup - EMEA Launch (2021)
  '2n__tI-wTOM', // TECH IT EASY Podcast (Ep.3) | The obnoxious dude in an HR-less company
  'tHw3b4mhBRE', // Reviewing a Complex DataWeave Transformation Use-case - Toronto Virtual MuleSoft Meetup #11
  'yoBK1GcgOxM', // Cómo generar e implementar monitoreo para aplicaciones de Mule - Online Spanish MuleSoft Meetup #9
  '83kSxA-K2cY', // reCONNECT 2021 May Meetup - Women Who Mule #4
  'FU35BzXt4l8', // API Security - Toronto Virtual MuleSoft Meetup #10
  'PoRwunyUVgg', // TECH IT EASY Podcast (Ep.2) | It's ok to not be ok
  'L0EJJE8C0eA', // [SPANISH]Resolviendo un caso de uso complejo de DW(tail recursive)-Online Spanish MuleSoft Meetup #8
  'TzbcRQF9huk', // Digital Dee: Bits and Bytes of Binary Beginnings (Diane Kesler's Journey) - Women Who Mule #3.2
  'zqFF3xQwZNw', // Twitter's Integration Team Panel Discussion - Women Who Mule #3.1
  'J223UKb9gx8', // TECH IT EASY Podcast (Ep.1) | It's not up to you ("no es tu pedo")
  'Sd0s_X90lTg', // TECH IT EASY Podcast | Intro
  'nH_6xyqQFfE', // KPIs and metrics accelerator - Toronto Virtual MuleSoft Meetup #9
  'AMVpzmk_XOI', // International Women's Day Panel Discussion (2021) - Women Who Mule #2
  'OROlZ31Z24k', // [SPANISH] Demo Creando pruebas unitarias para una API de proceso - Online Spanish MuleSoft Meetup #7
  'g6EV5R8sVvQ', // Tips for Reusability - Toronto Virtual MuleSoft Meetup #8
  'qaEYVhdg88Q', // [SPANISH] MuleSoft para profesionales de Java (segunda edición) - Online Spanish MuleSoft Meetup #6
  'vn2IDgqICR4', // [SPANISH] Continuous Integration and Continuous Delivery in Mule - Online Spanish MuleSoft Meetup #5
  'Z2MtwHelr9s', // ProstDev Live Stream
  'KiH_OzgEivw', // Anypoint VPC, VPN and DLB Architecture - Toronto Virtual MuleSoft Meetup #7
  'Aywke78FzBQ', // [SPANISH] Use of DataType and Library Fragments with API Designer - Monterrey MuleSoft Meetup #4
  'vkYVapgmxlY', // How to use Salesforce composite request connector in Mule - Toronto Virtual MuleSoft Meetup #6
  'M4OKEW68sRQ', // [SPANISH] Mule Integration for Java professionals - Online Spanish MuleSoft Meetup #4
  'PVvcYDkXIO8', // API Security and Threats - Toronto Virtual MuleSoft Meetup #5
  'Dv1-_t--ft8', // Anypoint Monitoring and Visualizer - Toronto Virtual MuleSoft Meetup #4
  '8xQTQDTCUgo', // SSL Implementation in Mule - Toronto Virtual MuleSoft Meetup #3
  'Mqm3OkCdLVk', // MUnit Framework in Mule 4 - Toronto Virtual MuleSoft Meetup #2.2
  'Gi9udfsaGOo', // [SPANISH] Intermediate DataWeave 2.0 - Online Spanish MuleSoft Meetup #2.2
  'Pz7J9eHJTrY', // Intermediate DataWeave 2.0 - Toronto Virtual MuleSoft Meetup #2.1
  'xj0BvMhEwSg', // [SPANISH] Error Handling in Mule 4 On-Error Propagate & Continue Online Spanish MuleSoft Meetup #1.1
  'W16UExsvGJ4', // [SPANISH] Introduction to DataWeave 2.0 - Online Spanish MuleSoft Meetup #1.2
  'hRwqprErzzQ', // [SPANISH] Runtime Fabric Installation in AWS and Huawei - Online Spanish MuleSoft Meetup #2.1
];
