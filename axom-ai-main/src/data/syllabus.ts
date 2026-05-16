// A mapping of standard subjects and chapters for Assam Board (SEBA/AHSEC) & general curriculum in Assamese
// Structured as: SYLLABUS_DATA[class][subject] = string[]

export const SUBJECTS = [
  "গণিত (Mathematics)",
  "বিজ্ঞান (Science)",
  "ইংৰাজী (English)",
  "অসমীয়া (Assamese)",
  "সমাজ বিজ্ঞান (Social Science)",
  "পদাৰ্থ বিজ্ঞান (Physics)",
  "ৰসায়ন বিজ্ঞান (Chemistry)",
  "জীৱ বিজ্ঞান (Biology)",
  "ইতিহাস (History)",
  "ভূগোল (Geography)",
  "ৰাজনীতি বিজ্ঞান (Political Science)",
  "অৰ্থনীতি (Economics)"
];

export const SYLLABUS_DATA: Record<string, Record<string, string[]>> = {
  "Class 6": {
    "গণিত (Mathematics)": [
      "আমাৰ সংখ্যাক জনা (Knowing Our Numbers)", "পূর্ণ সংখ্যা (Whole Numbers)", "সংখ্যাৰ খেল (Playing with Numbers)", 
      "জ্যামিতিৰ মৌলিক ধাৰণা (Basic Geometrical Ideas)", "প্রাথমিক আকৃতিৰ বুজ লোৱা (Understanding Elementary Shapes)", 
      "পূর্ণাংক (Integers)", "ভগ্নাংশ (Fractions)", "দশমিক (Decimals)", "তথ্যৰ ব্যৱহাৰ (Data Handling)", 
      "পৰিমিতি (Mensuration)", "বীজগণিত (Algebra)", "অনুপাত আৰু সমানুপাত (Ratio and Proportion)", 
      "প্রতিসাম্য (Symmetry)", "ব্যৱহাৰিক জ্যামিতি (Practical Geometry)"
    ],
    "বিজ্ঞান (Science)": [
      "খাদ্য: উৎস (Food: Sources)", "খাদ্যৰ উপাদান (Components of Food)", "আঁহৰ পৰা কাপোৰলৈ (Fibre to Fabric)", 
      "বস্তুবোৰৰ শ্ৰেণীবিভাজন (Sorting Materials)", "পদাৰ্থৰ পৃথকীকৰণ (Separation of Substances)", "আমাৰ চৌপাশৰ পৰিবৰ্তনবোৰ (Changes Around Us)", 
      "উদ্ভিদৰ বিষয়ে জানো আহা (Getting to Know Plants)", "শৰীৰৰ সঞ্চালন (Body Movements)", "সজীৱ বস্তু আৰু ইয়াৰ চৌপাশ (Living Organisms)", 
      "গতি আৰু দূৰত্বৰ জোখ-মাখ (Motion and Measurement)", "পোহৰ, ছাঁ আৰু প্ৰতিফলন (Light, Shadows)", "বিদ্যুৎ আৰু বৰ্তনী (Electricity)", 
      "চুম্বকৰ সৈতে ধেমালি (Fun with Magnets)", "পানী (Water)", "আমাৰ চৌপাশৰ বায়ু (Air Around Us)"
    ],
    "সমাজ বিজ্ঞান (Social Science)": [
      "সৌৰজগতত আমাৰ পৃথিৱী (Earth in the Solar System)", "পৃথিৱীৰ গৰ্ভ আৰু উপৰিভাগ (Inside our Earth)", "আদিম মানুহৰ পৰা কৃষি কাৰ্যলৈ (Primitive Man)", 
      "সিন্ধু সভ্যতা (Indus Valley Civilization)", "গণতন্ত্ৰ আৰু ইয়াৰ প্ৰমূল্য (Democracy)"
    ]
  },
  "Class 7": {
    "গণিত (Mathematics)": [
      "অখণ্ড সংখ্যা (Integers)", "ভগ্নাংশ আৰু দশমিক (Fractions and Decimals)", "তথ্যৰ ব্যৱহাৰ (Data Handling)", 
      "সৰল সমীকৰণ (Simple Equations)", "ৰেখা আৰু কোণ (Lines and Angles)", "ত্ৰিভুজ আৰু ইয়াৰ ধৰ্ম (The Triangle and its Properties)", 
      "ত্ৰিভুজৰ সৰ্বসমতা (Congruence of Triangles)", "ৰাশিৰ তুলনা (Comparing Quantities)", "পৰিমেয় সংখ্যা (Rational Numbers)", 
      "পৰিমিতি (Mensuration)", "বীজগণিতীয় ৰাশি (Algebraic Expressions)", "সূচক আৰু ঘাট (Exponents and Powers)", 
      "প্রতিসাম্য (Symmetry)", "গোটা আকৃতিৰ দৃশ্যমানতা (Visualising Solid Shapes)"
    ],
    "বিজ্ঞান (Science)": [
      "উদ্ভিদৰ পুষ্টি (Nutrition in Plants)", "প্ৰাণীৰ পুষ্টি (Nutrition in Animals)", "তন্ত্ৰৰ পৰা কাপোৰলৈ (Fibre to Fabric)", 
      "তাপ (Heat)", "এচিড, ক্ষাৰক আৰু লৱণ (Acids, Bases and Salts)", "ভৌতিক আৰু ৰাসায়নিক পৰিৱৰ্তন (Physical and Chemical Changes)", 
      "বতৰ, জলবায়ু আৰু অভিযোজন (Weather, Climate and Adaptation)", "প্ৰাণী আৰু উদ্ভিদৰ পৰিবহণ (Transportation in Animals and Plants)"
    ]
  },
  "Class 8": {
    "গণিত (Mathematics)": [
      "পৰিমেয় সংখ্যা (Rational Numbers)", "এক চলকযুক্ত ৰৈখিক সমীকৰণ (Linear Equations)", "চতুৰ্ভুজৰ বুজ লোৱা (Understanding Quadrilaterals)", 
      "তথ্যৰ ব্যৱহাৰ (Data Handling)", "বৰ্গ আৰু বৰ্গমূল (Squares and Square Roots)", "ঘন আৰু ঘনমূল (Cubes and Cube Roots)", 
      "ৰাশিৰ তুলনা (Comparing Quantities)", "বীজগণিতীয় ৰাশি আৰু অভেদ (Algebraic Expressions)", "পৰিমিতি (Mensuration)", 
      "উৎপাদকীকৰণ (Factorisation)", "লেখৰ সৈতে চিনাকি (Introduction to Graphs)"
    ],
    "বিজ্ঞান (Science)": [
      "শস্য উৎপাদন আৰু ব্যৱস্থাপনা (Crop Production)", "অণুজীৱ: মিত্ৰ আৰু শত্ৰু (Microorganisms)", "সংশ্লেষিত আঁহ আৰু প্লাষ্টিক (Synthetic Fibres)", 
      "ধাতু আৰু অধাতু (Metals and Non-metals)", "কয়লা আৰু পেট্ৰ’লিয়াম (Coal and Petroleum)", "দহন আৰু শিখা (Combustion and Flame)", 
      "কোষ- গঠন আৰু কাৰ্য (Cell - Structure and Functions)"
    ]
  },
  "Class 9": {
    "গণিত (Mathematics)": [
      "সংখ্যা প্ৰণালী (Number Systems)", "বহুপদ ৰাশি (Polynomials)", "স্থানাংক জ্যামিতি (Coordinate Geometry)", 
      "দুটা চলকযুক্ত ৰৈখিক সমীকৰণ (Linear Equations)", "ৰেখা আৰু কোণ (Lines and Angles)", "ত্ৰিভুজ (Triangles)", 
      "চতুৰ্ভুজ (Quadrilaterals)", "বৃত্ত (Circles)", "হিৰোণৰ সূত্ৰ (Heron's Formula)", "পৃষ্ঠকালি আৰু আয়তন (Surface Areas and Volumes)", 
      "পৰিসংখ্যা (Statistics)", "সম্ভাৱিতা (Probability)"
    ],
    "বিজ্ঞান (Science)": [
      "আমাৰ চৌপাশৰ পদাৰ্থ (Matter in our Surroundings)", "আমাৰ চৌপাশৰ পদাৰ্থবোৰ বিশুদ্ধনে (Is Matter Around Us Pure)", "পৰমাণু আৰু অণু (Atoms and Molecules)", 
      "পৰমাণুৰ গঠন (Structure of the Atom)", "জীৱৰ মৌলিক একক (The Fundamental Unit of Life)", "কলা (Tissues)", "বল আৰু গতি বিষয়ক সূত্ৰসমূহ (Force and Laws of Motion)", 
      "মহাকৰ্ষণ (Gravitation)", "কাৰ্য আৰু শক্তি (Work and Energy)", "শব্দ (Sound)"
    ]
  },
  "Class 10": {
    "গণিত (Mathematics)": [
      "বাস্তৱ সংখ্যা (Real Numbers)", "বহুপদ ৰাশি (Polynomials)", "দুটা চলকযুক্ত ৰৈখিক সমীকৰণৰ যোৰ (Pair of Linear Equations)", 
      "দ্বিঘাত সমীকৰণ (Quadratic Equations)", "সমান্তৰ প্ৰগতি (Arithmetic Progressions)", "ত্ৰিভুজ (Triangles)", 
      "স্থানাংক জ্যামিতি (Coordinate Geometry)", "ত্ৰিকোণমিতিৰ পৰিচয় (Trigonometry)", "বৃত্ত (Circles)", 
      "বৃত্ত সম্পৰ্কীয় কালি (Areas Related to Circles)", "পৃষ্ঠকালি আৰু আয়তন (Surface Areas and Volumes)", "পৰিসংখ্যা (Statistics)", "সম্ভাৱিতা (Probability)"
    ],
    "বিজ্ঞান (Science)": [
      "ৰাসায়নিক বিক্ৰিয়া আৰু সমীকৰণ (Chemical Reactions)", "এচিড, ক্ষাৰক আৰু লৱণ (Acids, Bases and Salts)", "ধাতু আৰু অধাতু (Metals and Non-metals)", 
      "কাৰ্বন আৰু তাৰ যৌগ (Carbon and its Compounds)", "জীৱন প্ৰক্ৰিয়া (Life Processes)", "নিয়ন্ত্ৰণ আৰু সমন্বয় (Control and Coordination)", 
      "বংশগতি আৰু ক্ৰমবিকাশ (Heredity and Evolution)", "পোহৰ- প্ৰতিফলন আৰু প্ৰতিসৰণ (Light - Reflection and Refraction)", 
      "মানুহৰ চকু আৰু বৰণীয়া পৃথিৱী (Human Eye)", "বিদ্যুৎ (Electricity)", "বিদ্যুৎ প্ৰবাহৰ চুম্বকীয় ক্ৰিয়া (Magnetic Effects)"
    ],
    "সমাজ বিজ্ঞান (Social Science)": [
      "বংগ বিভাজন আৰু স্বদেশী আন্দোলন (Partition of Bengal)", "মহাত্মা গান্ধী আৰু ভাৰতৰ স্বাধীনতা সংগ্ৰাম (Mahatma Gandhi)", 
      "অসমত ব্ৰিটিছ বিৰোধী জাগৰণ (British Resistance in Assam)", "ভাৰতৰ ভৌগোলিক পৰিচয় (Geography of India)", "মুদ্ৰা আৰু বেংক ব্যৱস্থা (Money and Banking)"
    ]
  },
  "Class 11": {
    "পদাৰ্থ বিজ্ঞান (Physics)": [
      "ভৌতিক জগত (Physical World)", "একক আৰু জোখ (Units and Measurement)", "সৰল ৰেখাত গতি (Motion in a Straight Line)", 
      "সমতলত গতি (Motion in a Plane)", "গতিৰ সূত্ৰ (Laws of Motion)", "কাৰ্য, শক্তি আৰু ক্ষমতা (Work, Energy and Power)", 
      "মহাকৰ্ষণ (Gravitation)", "তাপগতিবিদ্যা (Thermodynamics)", "তৰংগ (Waves)"
    ],
    "ৰসায়ন বিজ্ঞান (Chemistry)": [
      "ৰসায়ন বিজ্ঞানৰ মৌলিক ধাৰণা (Basic Concepts)", "পৰমাণুৰ গঠন (Structure of Atom)", "ৰাসায়নিক বান্ধনি (Chemical Bonding)", 
      "তাপগতিবিদ্যা (Thermodynamics)", "সাম্যাৱস্থা (Equilibrium)", "জৈৱ ৰসায়ন (Organic Chemistry)"
    ]
  },
  "Class 12": {
    "পদাৰ্থ বিজ্ঞান (Physics)": [
      "বৈদ্যুতিক আধান আৰু ক্ষেত্ৰ (Electric Charges and Fields)", "স্থিৰ বৈদ্যুতিক বিভৱ আৰু ধাৰকত্ব (Electrostatic Potential)", 
      "বিদ্যুৎ প্ৰবাহ (Current Electricity)", "গতিশীল আধান আৰু চুম্বকত্ব (Moving Charges)", "বিদ্যুৎ চুম্বকীয় আৱেশ (Electromagnetic Induction)", 
      "পোহৰ বিজ্ঞান (Optics)", "পৰমাণু আৰু নিউক্লিয়াছ (Atoms and Nuclei)"
    ],
    "ৰসায়ন বিজ্ঞান (Chemistry)": [
      "দ্ৰৱ (Solutions)", "বিদ্যুৎ ৰসায়ন (Electrochemistry)", "ৰাসায়নিক গতিবিদ্যা (Chemical Kinetics)", "ডি আৰু এফ ব্লক মৌল (d and f Block Elements)", 
      "হেল’এলকেন আৰু হেল’এৰিন (Haloalkanes and Haloarenes)", "এলক’হল, ফেনল আৰু ইথাৰ (Alcohols, Phenols and Ethers)"
    ]
  }
};

// Fallback mapping for other classes/subjects not explicitly defined above
export const FALLBACK_SYLLABUS: Record<string, string[]> = {
  "গণিত (Mathematics)": [
    "বীজগণিত (Algebra)", "জ্যামিতি (Geometry)", "ত্ৰিকোণমিতি (Trigonometry)", "পৰিমিতি (Mensuration)", "পৰিসংখ্যা (Statistics)", "সম্ভাৱিতা (Probability)", "কলন গণিত (Calculus)"
  ],
  "বিজ্ঞান (Science)": [
    "ৰাসায়নিক বিক্ৰিয়া (Chemical Reactions)", "এচিড, ক্ষাৰক আৰু লৱণ (Acids, Bases and Salts)", "ধাতু আৰু অধাতু (Metals and Non-metals)", "জীৱন প্ৰক্ৰিয়া (Life Processes)", "বিদ্যুৎ (Electricity)", "পোহৰ (Light)"
  ],
  "ইংৰাজী (English)": [
    "Grammar - Tenses", "Grammar - Prepositions", "Grammar - Voice", "Grammar - Narration", "Reading Comprehension", "Writing - Letters"
  ],
  "অসমীয়া (Assamese)": [
    "ৰচনা (Essay)", "ব্যাকৰণ (Grammar)", "গল্প (Stories)", "কবিতা (Poems)"
  ],
  "সমাজ বিজ্ঞান (Social Science)": [
    "ইতিহাস (History)", "ভূগোল (Geography)", "ৰাজনীতি বিজ্ঞান (Political Science)", "অৰ্থনীতি (Economics)"
  ]
};

// Helper function to get chapters
export const getChapters = (className: string, subject: string): string[] => {
  if (SYLLABUS_DATA[className] && SYLLABUS_DATA[className][subject]) {
    return SYLLABUS_DATA[className][subject];
  }
  return FALLBACK_SYLLABUS[subject] || ["সকলো অধ্যায় (All Chapters)"];
};
