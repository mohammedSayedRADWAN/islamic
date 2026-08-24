export const sheikhInfo = {
  name: "الشيخ د. محمد بن عبد الله الشنقيطي",
  title: "أستاذ الفقه والسياسة الشرعية",
  bio: "عالم وباحث شرعي، له أكثر من عشرين سنة في تدريس العلوم الشرعية وإلقاء المحاضرات والدروس في الفقه والحديث والتفسير والعقيدة. يهتم بتيسير العلم الشرعي لطلاب العلم والراغبين في تعلم الدين.",
  avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
  totalLessons: 66,
  totalCategories: 4,
  totalHours: "48 ساعة صوتية",
  qualifications: [
    "دكتوراه في الفقه المقارن والسياسة الشرعية بمرتبة الشرف الأولى",
    "مدرس الدروس العلمية بالمسجد الجامع لأكثر من 15 عاماً",
    "عضو الهيئة الاستشارية الشرعية وكاتب بعدة مجلات محكمة",
    "مؤلف عدة متون وشروح علمية مسجلة ومكتوبة"
  ],
  booksTaught: [
    "شرح كتاب الطهارة والصلاة من عمدة الأحكام",
    "شرح الأربعين النووية في أحاديث سيد البرية",
    "تفسير سور المفصل وأحكام القرآن الكريم",
    "كتاب التوحيد وحقيقة الإيمان والاعتقاد"
  ],
  socials: {
    youtube: "https://youtube.com",
    telegram: "https://telegram.org",
    twitter: "https://x.com",
    whatsapp: "https://whatsapp.com"
  }
};

export const categories = [
  {
    id: 1,
    name: "الفقه",
    slug: "fiqh",
    description: "دروس في أحكام العبادات والمعاملات وفقه الطهارة والصلاة والزكاة والصيام",
    icon: "📖",
    badgeClass: "badge-fiqh",
    count: 14,
    color: "#2E7D32"
  },
  {
    id: 2,
    name: "الحديث",
    slug: "hadith",
    description: "شرح الأحاديث النبوية الصحيحة وعلوم السنة المطهرة والمتون الحديثية",
    icon: "📜",
    badgeClass: "badge-hadith",
    count: 18,
    color: "#E65100"
  },
  {
    id: 3,
    name: "التفسير",
    slug: "tafsir",
    description: "تفسير آيات القرآن الكريم واستنباط الأحكام والفوائد والتدبر الإيماني",
    icon: "📚",
    badgeClass: "badge-tafsir",
    count: 24,
    color: "#1565C0"
  },
  {
    id: 4,
    name: "التوحيد",
    slug: "tawheed",
    description: "دروس العقيدة الإسلامية وأصول الإيمان والتوحيد ورسالة الأنبياء",
    icon: "☝️",
    badgeClass: "badge-tawheed",
    count: 10,
    color: "#7B1FA2"
  }
];

export const lessons = [
  {
    id: 1,
    title: "شرح كتاب الطهارة - أحكام المياه وأنواعها",
    category: "fiqh",
    categoryName: "الفقه",
    badgeClass: "badge-fiqh",
    lessonNumber: 1,
    duration: "45:30",
    date: "2026-08-20",
    description: "يتناول الشيخ في هذا الدرس بيان أقسام المياه (الطهور والنجس)، وضوابط التطهير، وأهم المسائل الفقهية المتعلقة بالبحر والبئر والماء المستعمل.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/001.mp3",
    featured: true
  },
  {
    id: 2,
    title: "أركان الصلاة وشروط صحتها واجباتها",
    category: "fiqh",
    categoryName: "الفقه",
    badgeClass: "badge-fiqh",
    lessonNumber: 2,
    duration: "38:15",
    date: "2026-08-18",
    description: "شرح تفصيلي لأركان الصلاة الـ14، والفرق بين الركن والواجب والشرط، وسجود السهو ومواضعه من الكتاب والسنة.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/002.mp3",
    featured: false
  },
  {
    id: 3,
    title: "أحكام الزكاة والصدقات ومصارفها الشرعية",
    category: "fiqh",
    categoryName: "الفقه",
    badgeClass: "badge-fiqh",
    lessonNumber: 3,
    duration: "42:00",
    date: "2026-08-15",
    description: "بيان النصاب الشرعي في أموال التجارة والنقود، وشروط وجوب الزكاة ومصارف الأصناف الثمانية المذكورة في سورة التوبة.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/003.mp3",
    featured: false
  },
  {
    id: 4,
    title: "فقه الصيام وأحكام المفطرات المعاصرة",
    category: "fiqh",
    categoryName: "الفقه",
    badgeClass: "badge-fiqh",
    lessonNumber: 4,
    duration: "50:10",
    date: "2026-08-10",
    description: "دراسة فقهية مستفيضة عن النية في الصوم، ومفسدات الصيام الحقيقية والطبية المعاصرة كالإبر والمغذي وبخاخ الربو.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/004.mp3",
    featured: false
  },
  {
    id: 5,
    title: "شرح حديث: إنما الأعمال بالنيات ومقاصد المكلفين",
    category: "hadith",
    categoryName: "الحديث",
    badgeClass: "badge-hadith",
    lessonNumber: 1,
    duration: "40:25",
    date: "2026-08-22",
    description: "شرح الحديث الأول من الأربعين النووية، وبيان أهمية النية في العبادات والعادات، وكيف تحول المباحات إلى طاعات.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/005.mp3",
    featured: true
  },
  {
    id: 6,
    title: "شرح حديث: الدين النصيحة وآداب الأمر بالمعروف",
    category: "hadith",
    categoryName: "الحديث",
    badgeClass: "badge-hadith",
    lessonNumber: 2,
    duration: "36:50",
    date: "2026-08-19",
    description: "توضيح معنى النصيحة لله ولرسوله ولأئمة المسلمين وعامتهم، وكيفية التناصح بالرفق والحكمة والحلم.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/006.mp3",
    featured: false
  },
  {
    id: 7,
    title: "فضل العلم والعلماء في السنة النبوية",
    category: "hadith",
    categoryName: "الحديث",
    badgeClass: "badge-hadith",
    lessonNumber: 3,
    duration: "44:00",
    date: "2026-08-12",
    description: "استعراض الأحاديث الواردة في فضل طلب العلم الشرعي، وأن العلماء هم ورثة الأنبياء، وآداب طالب العلم مع شيخه.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/007.mp3",
    featured: false
  },
  {
    id: 8,
    title: "تفسير سورة الفاتحة وأسرار أم الكتاب",
    category: "tafsir",
    categoryName: "التفسير",
    badgeClass: "badge-tafsir",
    lessonNumber: 1,
    duration: "48:15",
    date: "2026-08-21",
    description: "وقفات بيانية وإيمانية مع سورة الفاتحة، ولماذا سميت بأم الكتاب، وبيان معنى الاستعانة والهدية إلى الصراط المستقيم.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/008.mp3",
    featured: true
  },
  {
    id: 9,
    title: "تدبر سورة الإخلاص والمعوذتين وفضل الاستعاذة",
    category: "tafsir",
    categoryName: "التفسير",
    badgeClass: "badge-tafsir",
    lessonNumber: 2,
    duration: "33:40",
    date: "2026-08-17",
    description: "تفسير المفصل لسور الإخلاص والفلق والناس، وبيان أسباب النزول والحماية الربانية من الحسد والسحر والوسواس.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/009.mp3",
    featured: false
  },
  {
    id: 10,
    title: "تفسير آية الكرسي وعظمة صفات الله تعالى",
    category: "tafsir",
    categoryName: "التفسير",
    badgeClass: "badge-tafsir",
    lessonNumber: 3,
    duration: "52:30",
    date: "2026-08-14",
    description: "شرح أعظم آية في كتاب الله، وتفنيد الأسماء والصفات الواردة فيها، وعظمة كرسيه وسلطانه جل في علاه.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/010.mp3",
    featured: false
  },
  {
    id: 11,
    title: "شرح أصل التوحيد ومعنى لا إله إلا الله",
    category: "tawheed",
    categoryName: "التوحيد",
    badgeClass: "badge-tawheed",
    lessonNumber: 1,
    duration: "41:10",
    date: "2026-08-23",
    description: "الدرس الأول في شروط كلمة التوحيد السبعة (العلم واليقين والقبول والانقياد والصدق والإخلاص والمحبة).",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/011.mp3",
    featured: true
  },
  {
    id: 12,
    title: "أركان الإيمان الستة وحقيقة القضاء والقدر",
    category: "tawheed",
    categoryName: "التوحيد",
    badgeClass: "badge-tawheed",
    lessonNumber: 2,
    duration: "46:45",
    date: "2026-08-16",
    description: "شرح مراتب القدر الأربعة (العلم، الكتابة، المشيئة، الخلق)، وكيف يجمع المسلم بين الأخذ بالأسباب والتوكل.",
    audioUrl: "https://download.quranicaudio.com/quran/mishaari_raashid_al_afasy/012.mp3",
    featured: false
  }
];
