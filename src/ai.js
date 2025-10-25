/**
 * Module to generate Arabic poems from a static list.
 */

const poems = [
  'حين تبتسمين، يشرق الصباح مرتين\nوتبدو الشمس كأنها تقتبس ضوءها منكِ\nحتى العصافير تغيّر ألحانها احترامًا لفرحكِ',
  'كل ما فيكِ استثناء\nنغمة خارجة عن المألوف\nولحظة تكسر ترتيب الجمال في الكون',
  'في حضوركِ، تسكت الأصوات\nويفقد الكلام معناه\nكأنكِ اللغة الوحيدة التي يفهمها القلب',
  'كل العيون حين تراكِ\nتتعلّم كيف تنظر\nوكل القلوب حين تمرين، تتعلّم كيف تخفق',
  'أنتِ فكرة لا تتكرر\nنسخة من الحلم لم تُكتب من قبل\nوكل من يراكِ، يشعر أنه رأى الجمال لأول مرة',
  'حين تمشين، يتبعك الضوء\nوتتراجع الظلال بخجل\nكأنكِ أوّل سبب وُجد لأجله النهار',
  'كل الزهور تخجل حين تمرين\nتخفض رؤوسها احترامًا\nلأنها تعرف أن جمالها مستعار من طيفكِ',
  'في عينيكِ، تذوب المسافات\nوتنسى الأيام عدّها\nكأن الزمن يختصر نفسه ليعيشكِ فقط',
  'ما بين صوتكِ وصمتكِ\nيتكوّن السلام\nوتولد القصائد دون قصد منكِ',
  'كل شيء جميل يفقد بريقه بجانبكِ\nكأن العالم وُجد ليكون خلفية لكِ\nوأنتِ، اللوحة التي لا يجرؤ أحد على تعديلها'
];

let usedPoems = new Set();

/**
 * Generates a random Arabic poem from the list without repeating until all are used, then resets.
 * @returns {string} The generated poem.
 */
async function generatePoem() {
  if (usedPoems.size === poems.length) {
    usedPoems.clear(); // Reset after all poems are used
  }

  let poem;
  do {
    poem = poems[Math.floor(Math.random() * poems.length)];
  } while (usedPoems.has(poem));

  usedPoems.add(poem);
  return poem;
}

module.exports = { generatePoem };
