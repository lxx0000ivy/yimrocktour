import type { Locale } from '../i18n';

export interface CoursePrice {
  amountCNY: number;
  unit: string;
  note?: string;
}

export interface CourseDay {
  label: string;
  items: string[];
}

export interface Course {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  prereq: string;
  curriculum: CourseDay[];
  prices: CoursePrice[];
  ratio?: string;
  perks?: string[];
}

type Locales = Record<Locale, Course[]>;

export const courses: Locales = {
  zh: [
    {
      id: 'top-rope',
      name: '顶绳攀岩课程',
      nameEn: 'Top Rope Climbing',
      tagline: '两天拿到独立顶绳攀爬的全套能力。',
      prereq: '任何想要接触野攀的朋友——有无室内攀岩经历都可。',
      curriculum: [
        {
          label: 'Day 1',
          items: [
            '攀爬装备的认识与使用',
            '攀爬常用绳结学习',
            '攀爬前检查事项',
            '攀爬前、中、后保护员与攀爬者的沟通及常用术语',
            '顶绳保护练习',
            '注意事项与风险管理',
            '岩场礼仪',
          ],
        },
        {
          label: 'Day 2',
          items: [
            '拆站所需装备的认识与使用',
            '拆站常用绳结学习',
            '用辅绳自制 PAS',
            '保护站的认识、建立与 LOWER OFF 拆除法',
            '顶绳攀爬技巧',
            '顶绳攀爬与保护练习',
          ],
        },
      ],
      prices: [{ amountCNY: 1800, unit: '人 / 两天', note: '含教练费、装备使用费' }],
      ratio: '1:1 / 1:2',
      perks: ['双人同行报名有优惠'],
    },
    {
      id: 'lead',
      name: '先锋攀岩课程',
      nameEn: 'Lead Climbing',
      tagline: '三天从顶绳走到带头攀。',
      prereq: '顶绳攀爬水平在 V2 / 5.10A 以上，需要自带个人装备（安全带、头盔、鞋子）。',
      curriculum: [
        {
          label: 'Day 1',
          items: [
            '装备的认识与使用',
            '攀爬前检查事项',
            '攀爬前、中、后保护员与攀爬者的沟通及常用术语',
            '先锋保护',
            '先锋入挂手法',
            '绳索管理',
            '建立保护站',
            '注意事项与风险管理',
            '岩场礼仪',
            '（顶绳模拟）攀爬与保护实操练习',
          ],
        },
        {
          label: 'Day 2',
          items: [
            '常用绳结学习',
            '常见的先锋攀爬与保护错误',
            'LOWERING OFF 拆站练习 / 双绳降',
            '先锋攀爬进阶技巧',
            '攀爬与保护实操练习',
          ],
        },
        {
          label: 'Day 3',
          items: ['建站与拆站复习', '攀爬与保护练习', '先锋冲坠与动态保护技术', '视攀 ONSIGHT 小技巧'],
        },
      ],
      prices: [{ amountCNY: 2800, unit: '人 / 三天', note: '含教练费、安全认证的装备使用费' }],
      ratio: '1:1 / 1:2',
      perks: ['双人同行报名有优惠'],
    },
    {
      id: 'multi-pitch',
      name: '结组攀岩课程',
      nameEn: 'Multi-pitch Climbing',
      tagline: '把一天延长到整面墙。',
      prereq: '攀爬水平在 5.10C 以上，且已经会先锋攀岩的岩友，需要个人装备。',
      curriculum: [
        {
          label: 'Day 1',
          items: [
            '结组攀岩理念介绍',
            '结组所需装备的认识与使用',
            '结组攀岩常用绳结学习',
            '攀爬前、中、后的沟通及常用术语 / 学习绳索信号',
            '建立上方保护',
            '结组攀岩注意事项与风险管理',
            '结组攀岩礼仪',
          ],
        },
        {
          label: 'Day 2',
          items: [
            '复习上方保护，沟通术语，ROPE SIGNAL',
            '双绳降风险管理',
            '结组攀岩绳索管理',
            '结组前的准备工作',
          ],
        },
        {
          label: 'Day 3',
          items: ['意外情况的发生', '如何自救', '3 人结组技术'],
        },
      ],
      prices: [{ amountCNY: 3000, unit: '人 / 三天', note: '含教练费、装备使用费' }],
    },
    {
      id: 'trad',
      name: '传统攀岩课程',
      nameEn: 'Trad Climbing',
      tagline: '自己放保护，从第一块塞到烟囱线。',
      prereq:
        '先锋攀爬水平在 5.10C 以上，需要自带个人装备（安全带、头盔、鞋子、手套）。',
      curriculum: [
        {
          label: 'Day 1',
          items: [
            '装备的认识与使用',
            '攀爬前检查事项',
            '攀爬前、中、后的沟通及常用术语',
            '传统攀岩保护',
            '传统攀先锋中放保护装置的频率与技巧',
            '绳索管理',
            '传统攀常见动作——涨手涨脚',
            '注意事项与风险管理',
            '岩场礼仪',
            'AID CLIMBING 器械攀登练习',
          ],
        },
        {
          label: 'Day 2',
          items: [
            '常用绳结学习',
            '常见的传统攀爬与保护错误',
            '建立传统攀保护站',
            'LOWERING OFF 拆站练习 / 双绳降',
            '传统攀常见动作——涨指涨拳',
            '攀爬与保护实操练习',
          ],
        },
        {
          label: 'Day 3',
          items: [
            '复习传统攀建站',
            '攀爬、冲坠与保护练习（顶绳或挂片备份）',
            'OFF-WIDTH 与烟囱线攀爬技巧',
            '视攀 ONSIGHT 小技巧',
          ],
        },
      ],
      prices: [{ amountCNY: 4500, unit: '人 / 三天', note: '含教练费、安全认证的装备使用费' }],
      ratio: '1:1 / 1:2',
      perks: ['多人同行报名有优惠'],
    },
  ],
  en: [
    {
      id: 'top-rope',
      name: 'Top Rope Climbing',
      nameEn: 'Top Rope Climbing',
      tagline: 'Two days to self-sufficient top-rope climbing.',
      prereq: 'Anyone curious about outdoor climbing — gym experience not required.',
      curriculum: [
        {
          label: 'Day 1',
          items: [
            'Climbing gear overview and use',
            'Common climbing knots',
            'Pre-climb checks',
            'Belayer-climber communication and standard calls',
            'Top-rope belay practice',
            'Risk management',
            'Crag etiquette',
          ],
        },
        {
          label: 'Day 2',
          items: [
            'Rappel gear overview and use',
            'Common rappel knots',
            'Building a PAS from cordelette',
            'Anchor recognition, building, and LOWER OFF cleaning',
            'Top-rope climbing technique',
            'Top-rope climbing and belay practice',
          ],
        },
      ],
      prices: [
        { amountCNY: 1800, unit: 'per person / 2 days', note: 'Includes instructor and gear' },
      ],
      ratio: '1:1 or 1:2',
      perks: ['Two-person group discount'],
    },
    {
      id: 'lead',
      name: 'Lead Climbing',
      nameEn: 'Lead Climbing',
      tagline: 'Three days from top-roping to leading your own pitch.',
      prereq: 'Top-roping V2 / 5.10A or above. Personal gear required (harness, helmet, shoes).',
      curriculum: [
        {
          label: 'Day 1',
          items: [
            'Gear overview and use',
            'Pre-climb checks',
            'Belayer-climber communication and standard calls',
            'Lead belay',
            'Clipping technique',
            'Rope management',
            'Building anchors',
            'Risk management',
            'Crag etiquette',
            '(Mock top-rope) climbing and belay practice',
          ],
        },
        {
          label: 'Day 2',
          items: [
            'Common climbing knots',
            'Common lead climbing and belay mistakes',
            'LOWERING OFF practice / double-rope rappel',
            'Advanced lead technique',
            'Climbing and belay practice',
          ],
        },
        {
          label: 'Day 3',
          items: [
            'Building and breaking down anchors (review)',
            'Climbing and belay practice',
            'Lead falls and dynamic belay technique',
            'Onsight tactics',
          ],
        },
      ],
      prices: [
        { amountCNY: 2800, unit: 'per person / 3 days', note: 'Includes instructor and certified gear' },
      ],
      ratio: '1:1 or 1:2',
      perks: ['Two-person group discount'],
    },
    {
      id: 'multi-pitch',
      name: 'Multi-pitch Climbing',
      nameEn: 'Multi-pitch Climbing',
      tagline: 'Stretch a day of climbing into a whole wall.',
      prereq: 'Climbers at 5.10C and above who already lead. Personal gear required.',
      curriculum: [
        {
          label: 'Day 1',
          items: [
            'Multi-pitch philosophy and overview',
            'Multi-pitch gear overview and use',
            'Common multi-pitch knots',
            'Pre/during/post-climb communication and rope signals',
            'Building top anchors',
            'Multi-pitch risk management',
            'Multi-pitch etiquette',
          ],
        },
        {
          label: 'Day 2',
          items: [
            'Review: top anchors, calls, rope signals',
            'Double-rope rappel risk management',
            'Rope management on multi-pitch',
            'Pre-climb prep',
          ],
        },
        {
          label: 'Day 3',
          items: ['Dealing with incidents', 'Self-rescue', '3-person multi-pitch technique'],
        },
      ],
      prices: [
        { amountCNY: 3000, unit: 'per person / 3 days', note: 'Includes instructor and gear' },
      ],
    },
    {
      id: 'trad',
      name: 'Trad Climbing',
      nameEn: 'Trad Climbing',
      tagline: 'Place your own gear — from first cam to chimneys.',
      prereq:
        'Leading 5.10C and above. Personal gear required (harness, helmet, shoes, gloves).',
      curriculum: [
        {
          label: 'Day 1',
          items: [
            'Gear overview and use',
            'Pre-climb checks',
            'Communication and standard calls',
            'Trad belay',
            'Placement frequency and technique on lead',
            'Rope management',
            'Trad movement — hand jams and foot jams',
            'Risk management',
            'Crag etiquette',
            'AID CLIMBING practice',
          ],
        },
        {
          label: 'Day 2',
          items: [
            'Common climbing knots',
            'Common trad lead and belay mistakes',
            'Building trad anchors',
            'LOWERING OFF practice / double-rope rappel',
            'Trad movement — finger and fist jams',
            'Climbing and belay practice',
          ],
        },
        {
          label: 'Day 3',
          items: [
            'Trad anchor review',
            'Climbing, lead falls, and belay practice (top-rope or bolt backup)',
            'OFF-WIDTH and chimney technique',
            'Onsight tactics',
          ],
        },
      ],
      prices: [
        { amountCNY: 4500, unit: 'per person / 3 days', note: 'Includes instructor and certified gear' },
      ],
      ratio: '1:1 or 1:2',
      perks: ['Group discounts for 3+ climbers'],
    },
  ],
};

export interface InstructorBullet {
  label: string;
}

export const instructor: Record<Locale, { name: string; bullets: string[] }> = {
  zh: {
    name: '陈逸民',
    bullets: [
      '曾在澳大利亚任职攀岩教练',
      '热爱冒险与视攀，讨厌磕线与冲坠',
      '爬过国内外百条结组',
      '红十字会急救员，重装徒步爱好者',
      '多国语言爱好者，可全英教学',
    ],
  },
  en: {
    name: 'Chen Yimin',
    bullets: [
      'Former climbing instructor in Australia',
      'Loves adventure and onsight — avoids projecting and whippers',
      'Hundreds of multi-pitches at home and abroad',
      'Red Cross certified first-aid responder, backpacker',
      'Multilingual — can teach entirely in English',
    ],
  },
};

export interface VideoEpisode {
  title: string;
  duration?: string;
  src?: string;
  poster?: string;
}

export interface VideoSeries {
  id: string;
  title: string;
  summary: string;
  tag: string;
  episodes: VideoEpisode[];
}

export const videoSeries: Record<Locale, VideoSeries[]> = {
  zh: [
    {
      id: 'knots',
      title: '绳结速查',
      summary: '从八字结到意大利半扣，一集一个结，附慢动作与常见错误。',
      tag: '基础',
      episodes: [
        { title: '八字结 Figure 8', duration: '03:40' },
        { title: '意大利半扣 Munter Hitch', duration: '04:12' },
        { title: '普鲁士结 Prusik', duration: '03:55' },
      ],
    },
    {
      id: 'belay',
      title: '保护手法',
      summary: '顶绳与先锋的全套保护动作、冲坠接法、常见错误复盘。',
      tag: '顶绳 / 先锋',
      episodes: [
        { title: '顶绳保护基础手法', duration: '06:20' },
        { title: '先锋动态保护', duration: '08:05' },
        { title: '冲坠分析：3 个典型案例', duration: '09:40' },
      ],
    },
    {
      id: 'anchor',
      title: '保护站与拆站',
      summary: '从锚点读取到 LOWER OFF 拆除，带你看教练在岩壁上一步步做。',
      tag: '进阶',
      episodes: [
        { title: '保护站的基本原则', duration: '05:30' },
        { title: 'LOWER OFF 拆站全过程', duration: '07:10' },
        { title: '双绳降风险管理', duration: '08:25' },
      ],
    },
  ],
  en: [
    {
      id: 'knots',
      title: 'Knots quick reference',
      summary: 'One knot per episode — figure 8, munter, prusik — slow-mo and common mistakes.',
      tag: 'Fundamentals',
      episodes: [
        { title: 'Figure 8', duration: '03:40' },
        { title: 'Munter Hitch', duration: '04:12' },
        { title: 'Prusik', duration: '03:55' },
      ],
    },
    {
      id: 'belay',
      title: 'Belaying',
      summary: 'Top-rope and lead belay technique, catching falls, mistake post-mortems.',
      tag: 'Top-rope / Lead',
      episodes: [
        { title: 'Top-rope belay fundamentals', duration: '06:20' },
        { title: 'Dynamic lead belay', duration: '08:05' },
        { title: 'Fall analysis: 3 case studies', duration: '09:40' },
      ],
    },
    {
      id: 'anchor',
      title: 'Anchors and cleaning',
      summary: 'From reading an anchor to a full LOWER OFF — step-by-step at the crag.',
      tag: 'Advanced',
      episodes: [
        { title: 'Anchor principles', duration: '05:30' },
        { title: 'LOWER OFF — the full sequence', duration: '07:10' },
        { title: 'Double-rope rappel risk management', duration: '08:25' },
      ],
    },
  ],
};

export const fieldRecord: Record<Locale, { place: string; note: string }[]> = {
  zh: [
    { place: '澳大利亚 · Mt Tibrogargan', note: '带 Yuji Hirayama 旅攀' },
    { place: '澳大利亚 · Short Leanings Ridge', note: '阿尔卑斯式结组' },
    { place: '蓝山 · Better than Benhur', note: '传统结组' },
    { place: 'Mt Maroon · Ruby of India', note: '传统结组' },
    { place: '大岩壁器械攀登', note: '悬崖吊帐上的日出' },
    { place: '老挝 · Thakhek', note: '石灰岩运动攀' },
    { place: '云南 · 大理白石溪', note: '家门口的岩场' },
  ],
  en: [
    { place: 'Mt Tibrogargan, Australia', note: 'Guided Yuji Hirayama' },
    { place: 'Short Leanings Ridge, Australia', note: 'Alpine-style multi-pitch' },
    { place: 'Blue Mountains · Better than Benhur', note: 'Trad multi-pitch' },
    { place: 'Mt Maroon · Ruby of India', note: 'Trad multi-pitch' },
    { place: 'Big-wall aid climbing', note: 'Sunrise from a portaledge' },
    { place: 'Thakhek, Laos', note: 'Limestone sport' },
    { place: 'Baishixi, Dali, Yunnan', note: 'Home crag' },
  ],
};
