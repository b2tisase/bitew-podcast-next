import { Episode } from '../types/podcast';

// Default initial catalog with direct production hosted audio URLs
export const INITIAL_EPISODES: Episode[] = [
  {
    id: 'ep-001',
    title: 'Love Unto Crypt Narrative: "Marriage" Part 1',
    amharicTitle: 'ፍቅር እስከ መቃብር ትረካ "ትዳር" ክፍል 1',
    description: 'A deep literary analysis and evocative oral recitation of Haddis Alemayehu\'s classic masterpiece "Fiqir Iske Meqabir", exploring societal hierarchies and traditional marriage institutions.',
    amharicDescription: 'የደራሲ ሀዲስ አለማየሁ ድንቅ ስራ የሆነው "ፍቅር እስከ መቃብር" ድንቅ ትረካ እና ትንታኔ፤ የህብረተሰብ መደቦች እና ባህላዊ የጋብቻ ተቋማት ፈተናዎች።',
    showNotes: `### የክፍሉ ማስታወሻ (Show Notes)
- **00:00 - 05:20**: መግቢያ እና የደራሲ ሀዲስ አለማየሁ ታሪካዊ አውድ
- **05:21 - 18:45**: የቤዛብሽ እና የበዛብህ ገጸ-ባህሪያት አቀራረብ
- **18:46 - 32:10**: የባህላዊ ትዳር ስነ-ስርዓት እና መደባዊ ልዩነቶች
- **32:11 - 42:30**: ትረካ "ትዳር" - ክፍል 1 የመጨረሻ ነጥቦች

#### ዋና ዋና መሪ ሃሳቦች
1. ፍቅር በፊውዳል ማህበረሰብ መዋቅር ውስጥ ያጋጠሙት መሰናክሎች
2. የሴቶች ሚና እና ምርጫ በባህላዊው አኗኗር
3. ቋንቋ፣ ወግ እና ስነ-ጽሑፋዊ ውበት`,
    category: 'Arts',
    season: 1,
    episodeNumber: 1,
    releaseDate: '2026-10-04T10:00:00Z',
    duration: 2552, // 42m 32s
    audioUrl: 'https://firebasestorage.googleapis.com/v0/b/bitew-podcast-next.firebasestorage.app/o/episodes%2F%E1%87%8D%E1%89%85%E1%88%AD%20%E1%8A%A5%E1%88%B5%E1%8A%A8%20%E1%88%98%E1%89%83%E1%89%A5%E1%88%AD%20%E1%89%B5%E1%88%A8%E1%8A%AB%20%22%E1%89%B5%E1%84%83%E1%88%AD%22%20%E1%8A%AD%E1%87%8D%E1%88%8D%201.mp3?alt=media&token=657584eb-7823-483f-846a-4217eb9e88b2',
    status: 'published',
    listensCount: 4820,
    artworkGradient: 'from-purple-900 via-indigo-950 to-black',
    host: 'Bitew & Literary Guests',
  },
  {
    id: 'ep-002',
    title: 'Human Rights & Rule of Law Under Authoritarian Regimes',
    amharicTitle: 'የሰብዓዊ መብቶች እና የህግ የበላይነት በእምባገነን ስርዓቶች',
    description: 'Examining the systemic persecution, legal erosion, and societal resistance when citizens live under unchecked authoritarian control, advocating for restorative justice.',
    amharicDescription: 'በእምባገነን መንግስት ሥር የሚኖሩ ዜጎች በሰብዓዊና ቋሳዊ እጦት እንዳይፈቀዱ፤ ፍትህ እና እኩልነት እንዲሰፍን የሚተጋ ጥልቅ ውይይት።',
    showNotes: `### የክፍሉ ማስታወሻ (Show Notes)
- **00:00 - 08:30**: የእምባገነን መንግስታት የተለመዱ ባህሪያትና የመብት ጥሰቶች
- **08:31 - 22:15**: የህግ የበላይነት ሲሸረሸር በዜጎች ህይወት ላይ የሚደርስ ቀውስ
- **22:16 - 38:00**: የፍትህ ተቋማት ገለልተኝነት እና የሲቪል ማህበረሰብ ሚና
- **38:01 - 50:12**: የመፍትሄ አቅጣጫዎች እና የህዝብ ተሳትፎ`,
    category: 'Human Rights',
    season: 1,
    episodeNumber: 2,
    releaseDate: '2026-10-06T14:30:00Z',
    duration: 3012, // 50m 12s
    audioUrl: '/audio/episodes/bitew_episode_2.mp3',
    status: 'published',
    listensCount: 3910,
    artworkGradient: 'from-violet-950 via-purple-900 to-slate-950',
    host: 'Bitew',
  },
  {
    id: 'ep-003',
    title: 'Rural Healthcare Equity & Preventative Health Systems',
    amharicTitle: 'የጤና ክብካቤ ተደራሽነት እና የመከላከያ ህክምና በገጠር ማህበረሰቦች',
    description: 'Investigating critical healthcare infrastructure deficits, maternal health initiatives, and community-led health posts in remote districts.',
    amharicDescription: 'የጤና አገልግሎት ተደራሽነት እጥረት፣ የእናቶች እና ህጻናት ህክምና እንዲሁም በገጠር የሚገኙ የጤና ኬላዎች ያሏቸው አቅሞች እና ተግዳሮቶች።',
    showNotes: `### የክፍሉ ማስታወሻ (Show Notes)
- **00:00 - 07:15**: በኢትዮጵያ ገጠራማ አካባቢዎች ያለው የጤና አገልግሎት ተጨባጭ ሁኔታ
- **07:16 - 19:40**: የእናቶች ጤና እና የመድኃኒት አቅርቦት ሰንሰለት
- **19:41 - 33:20**: የጤና ኤክስቴንሽን ሰራተኞች የጎላ አስተዋጽኦ
- **33:21 - 44:05**: የበጎ አድራጊ ድርጅቶችና የህክምና ባለሙያዎች አስተያየት`,
    category: 'Healthcare',
    season: 1,
    episodeNumber: 3,
    releaseDate: '2026-10-08T09:15:00Z',
    duration: 2645, // 44m 05s
    audioUrl: '/audio/episodes/bitew_episode_3.mp3',
    status: 'published',
    listensCount: 2740,
    artworkGradient: 'from-indigo-900 via-purple-950 to-neutral-950',
    host: 'Bitew & Dr. Selamawit T.',
  },
  {
    id: 'ep-004',
    title: 'Inflation, Cost of Living & Socio-Economic Survival Strategies',
    amharicTitle: 'የኑሮ ውድነት፣ የዋጋ ግሽበት እና የማህበረሰብ ኢኮኖሚያዊ መፍትሄዎች',
    description: 'Analyzing macroeconomic pressure points, inflation impacts on low-income families, and grassroots financial solidarity structures.',
    amharicDescription: 'የዋጋ ንረት በዝቅተኛ የኑሮ ደረጃ ላይ ባሉ ቤተሰቦች ላይ እያደረሰ ያለው ጫና እና ማህበረሰባዊ የመረዳዳት ስርዓቶች አስፈላጊነት።',
    showNotes: `### የክፍሉ ማስታወሻ (Show Notes)
- **00:00 - 10:00**: የወቅቱ የኢኮኖሚ ምስል እና የዋጋ ግሽበት መንስኤዎች
- **10:01 - 25:30**: የሸማቹ ህዝብ ኑሮ እና የገበያ መዛባት
- **25:31 - 39:15**: እድር፣ እቁብ እና ባህላዊ የፋይናንስ መረቦች
- **39:16 - 48:50**: ወደፊት የሚጠበቁ የፖሊሲ ማሻሻያዎች`,
    category: 'Socio-Economic',
    season: 1,
    episodeNumber: 4,
    releaseDate: '2026-10-10T11:00:00Z',
    duration: 2930, // 48m 50s
    audioUrl: '/audio/episodes/bitew_episode_4.mp3',
    status: 'published',
    listensCount: 5120,
    artworkGradient: 'from-fuchsia-950 via-purple-950 to-zinc-950',
    host: 'Bitew & Economist Yohannes M.',
  },
  {
    id: 'ep-005',
    title: 'Women in Civic Leadership & Defying Societal Silencing',
    amharicTitle: 'የሴቶች ድምጽ በህዝባዊ አመራር እና በማህበራዊ ፍትህ ግንባታ',
    description: 'Amplifying Ethiopian women leaders and grassroot organizers navigating structural marginalization, educational hurdles, and civic transformation.',
    amharicDescription: 'በአመራርና በውሳኔ ሰጪነት ውስጥ የሴቶች ሚና፣ ያጋጠሟቸው እንቅፋቶች እና ማህበረሰባዊ እኩልነትን ለማስፈን የሚደረግ ትግል።',
    showNotes: `### የክፍሉ ማስታወሻ (Show Notes)
- **00:00 - 06:40**: የመክፈቻ ንግግር እና ታሪካዊ ፈተናዎች
- **06:41 - 21:10**: የሴቶች የኢኮኖሚ ነፃነት እና የትምህርት እድል
- **21:11 - 34:50**: በሲቪክ ማህበራት ውስጥ የሴቶች የአመራር ብቃት
- **34:51 - 46:18**: የወደፊት ራዕይ እና የህግ ከለላ`,
    category: 'Women\'s Issues',
    season: 1,
    episodeNumber: 5,
    releaseDate: '2026-10-11T08:00:00Z',
    duration: 2778, // 46m 18s
    audioUrl: '/audio/episodes/bitew_episode_5.mp3',
    status: 'published',
    listensCount: 3200,
    artworkGradient: 'from-purple-900 via-pink-950 to-black',
    host: 'Bitew & Rahel G.',
  },
  {
    id: 'ep-006',
    title: 'Love Unto Crypt Narrative: "Marriage" Part 2',
    amharicTitle: 'ፍቅር እስከ መቃብር ትረካ "ትዳር" ክፍል 2',
    description: 'The continuing serialized narrative of Haddis Alemayehu\'s masterpiece, exploring the tragic escalation of personal conviction against aristocratic decree.',
    amharicDescription: 'ተከታታይ የፍቅር እስከ መቃብር ትረካ፤ የግል እምነት ከባላባታዊ ፍላጎት ጋር የተጋጨበት አሳዛኝና አስገራሚ ትዕይንት።',
    showNotes: `### የክፍሉ ማስታወሻ (Show Notes)
- የክፍል 2 ትረካ በታቀደው ጊዜ (ኦክቶበር 18 ቀን 2026) በቀጥታ ይለቀቃል!
- ትረካ፡ ቢተው
- የድምፅ ቅንብር፡ የቢተው ፖድካስት ስቱዲዮ`,
    category: 'Arts',
    season: 1,
    episodeNumber: 6,
    releaseDate: '2026-10-18T12:00:00Z',
    scheduledDate: '2026-10-18T12:00',
    duration: 2840,
    audioUrl: '/audio/episodes/bitew_episode_6.mp3',
    status: 'scheduled',
    listensCount: 0,
    artworkGradient: 'from-violet-900 via-indigo-900 to-black',
    host: 'Bitew',
  },
  {
    id: 'ep-007',
    title: 'Youth Unemployment & Independent Digital Media Spaces',
    amharicTitle: 'የወጣቶች ስራ አጥነት እና የነጻ ዲጂታል ሚዲያ እድሎች',
    description: 'Working draft on demographic shifts, self-publishing, and grassroots monetization without state censorship.',
    amharicDescription: 'ረቂቅ ዝግጅት፡ በወጣቶች የስራ እድል ፈጠራ እና ራስን በዲጂታል ቴክኖሎጂዎች የመግለጽ ነፃነት ዙሪያ።',
    showNotes: `### ረቂቅ ማስታወሻ
- የድምጽ ጥራት ማስተካከያ ያስፈልገዋል
- ተጨማሪ የስታትስቲክስ መረጃዎችን ማካተት`,
    category: 'Socio-Economic',
    season: 1,
    episodeNumber: 7,
    releaseDate: '2026-10-11T12:00:00Z',
    duration: 1980,
    audioUrl: '/audio/episodes/bitew_episode_7.mp3',
    status: 'draft',
    listensCount: 0,
    artworkGradient: 'from-slate-900 via-purple-950 to-black',
    host: 'Bitew',
  }
];