export const yearLevels = [
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
] as const;

const elementaryCore = [
  "English",
  "Filipino",
  "Mathematics",
  "Science",
  "Araling Panlipunan",
  "GMRC / Values Education",
  "MAPEH",
  "Edukasyong Pantahanan at Pangkabuhayan",
  "Technology and Livelihood Education",
  "Physical Education and Health",
];

const juniorHighCore = [
  "English",
  "Filipino",
  "Mathematics",
  "Science",
  "Araling Panlipunan",
  "Edukasyon sa Pagpapakatao",
  "MAPEH",
  "Technology and Livelihood Education",
  "Physical Education and Health",
];

const seniorHighCore = [
  "Oral Communication",
  "Reading and Writing Skills",
  "21st Century Literature from the Philippines and the World",
  "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
  "Pagbasa at Pagsusuri ng Iba't Ibang Teksto Tungo sa Pananaliksik",
  "Media and Information Literacy",
  "General Mathematics",
  "Statistics and Probability",
  "Earth and Life Science",
  "Physical Science",
  "Personal Development",
  "Understanding Culture, Society and Politics",
  "Introduction to the Philosophy of the Human Person",
  "Contemporary Philippine Arts from the Regions",
  "Physical Education and Health",
  "Work Immersion",
  "Entrepreneurship",
  "Practical Research",
  "Empowerment Technologies",
];

const seniorHighTracks = [
  "English for Academic and Professional Purposes",
  "Inquiries, Investigations and Immersion",
  "Business Mathematics",
  "Fundamentals of Accountancy, Business and Management",
  "Pre-Calculus",
  "Basic Calculus",
  "General Biology",
  "General Chemistry",
  "General Physics",
  "Creative Writing",
  "Creative Industries",
  "Information and Communications Technology",
  "Technical-Vocational-Livelihood Specialization",
];

export function subjectsForYearLevel(yearLevel: string) {
  if (yearLevel === "Kindergarten") {
    return [
      "Language",
      "Reading and Literacy",
      "Mathematics",
      "Makabansa",
      "Good Manners and Right Conduct",
      "Physical Development",
      "Socio-Emotional Development",
    ];
  }
  if (["Grade 1", "Grade 2", "Grade 3"].includes(yearLevel)) {
    return [
      "Language",
      "Reading and Literacy",
      "Mathematics",
      "Makabansa",
      "GMRC / Values Education",
      "English",
      "Filipino",
      "Music and Arts",
      "Physical Education and Health",
    ];
  }
  if (["Grade 4", "Grade 5", "Grade 6"].includes(yearLevel)) {
    return elementaryCore;
  }
  if (["Grade 7", "Grade 8", "Grade 9", "Grade 10"].includes(yearLevel)) {
    return juniorHighCore;
  }
  return [...seniorHighCore, ...seniorHighTracks];
}

const uppercaseWords = new Set([
  "abm",
  "epp",
  "esp",
  "gmrc",
  "ict",
  "k-12",
  "mapeh",
  "shs",
  "stem",
  "tle",
  "tvl",
]);

export function titleCaseSubject(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {
      const normalized = word.toLowerCase();
      if (uppercaseWords.has(normalized)) return normalized.toUpperCase();
      if (/^[a-z]\/$/i.test(word)) return word.toUpperCase();
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    })
    .join(" ");
}
