import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDatabase } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Book from '../models/Book.js';
import Lesson from '../models/Lesson.js';
import Bookmark from '../models/Bookmark.js';

const shouldReset = process.argv.includes('--reset');
const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@islamic.local';
const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin12345!';

const categoryData = [
  { name: 'الفقه', slug: 'fiqh', description: 'دروس في أحكام العبادات والمعاملات', icon: 'book-open', color: '#2E7D32', sortOrder: 1 },
  { name: 'الحديث', slug: 'hadith', description: 'شرح الأحاديث النبوية وعلوم السنة', icon: 'scroll-text', color: '#E65100', sortOrder: 2 },
  { name: 'التفسير', slug: 'tafsir', description: 'تفسير آيات القرآن الكريم والتدبر', icon: 'library', color: '#1565C0', sortOrder: 3 },
  { name: 'التوحيد', slug: 'tawheed', description: 'دروس العقيدة وأصول الإيمان', icon: 'hand-heart', color: '#7B1FA2', sortOrder: 4 }
];

const bookData = [
  { category: 'fiqh', title: 'كتاب الطهارة والصلاة', slug: 'kitab-at-tahara-was-salah', description: 'شرح أحكام الطهارة والصلاة.' },
  { category: 'fiqh', title: 'فقه الصيام والزكاة', slug: 'fiqh-as-siyam-waz-zakah', description: 'دروس في أحكام الصيام والزكاة.' },
  { category: 'hadith', title: 'الأربعون النووية', slug: 'al-arbaoon-an-nawawiyyah', description: 'شرح أحاديث الأربعين النووية.' },
  { category: 'hadith', title: 'رياض الصالحين', slug: 'riyad-as-salihin', description: 'شرح مختارات من رياض الصالحين.' },
  { category: 'tafsir', title: 'تفسير قصار السور', slug: 'tafsir-qisar-as-suwar', description: 'تفسير سور المفصل.' },
  { category: 'tafsir', title: 'تفسير سورة البقرة', slug: 'tafsir-surah-al-baqarah', description: 'وقفات تفسيرية مع سورة البقرة.' },
  { category: 'tawheed', title: 'كتاب التوحيد', slug: 'kitab-at-tawheed', description: 'شرح مسائل التوحيد وأصول العبادة.' },
  { category: 'tawheed', title: 'أصول الإيمان', slug: 'usul-al-iman', description: 'شرح أركان الإيمان والقضاء والقدر.' }
];

const lessonTitles = [
  'أحكام المياه وأنواعها', 'صفة الوضوء الصحيح ونواقضه', 'أركان الصلاة وشروط صحتها', 'سجود السهو وأحكامه',
  'أحكام الزكاة ومصارفها', 'فقه الصيام وأحكام المفطرات', 'شرح حديث إنما الأعمال بالنيات', 'شرح حديث الدين النصيحة',
  'فضل العلم وآداب طالب العلم', 'شرح حديث من حسن إسلام المرء', 'تفسير سورة الفاتحة', 'تفسير سورة الإخلاص',
  'تفسير سورتي الفلق والناس', 'تفسير سورة العصر', 'تفسير آية الكرسي', 'معنى لا إله إلا الله',
  'شروط كلمة التوحيد', 'أركان الإيمان الستة', 'مراتب القدر الأربعة', 'أثر التوحيد في حياة المسلم'
];

const lessonDescriptions = [
  'شرح مؤصل للمسائل مع الأدلة من الكتاب والسنة.',
  'بيان الأحكام المهمة التي يحتاج إليها المسلم في عبادته اليومية.',
  'دراسة مبسطة تجمع بين التأصيل والتطبيق العملي.'
];

async function seed() {
  await connectDatabase();

  if (shouldReset) {
    await Bookmark.deleteMany({});
    await Lesson.deleteMany({});
    await Book.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log('Existing database data cleared');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const admin = await User.findOneAndUpdate(
    { email: adminEmail.toLowerCase() },
    { name: 'الشيخ د. عمر العربي', email: adminEmail.toLowerCase(), passwordHash, role: 'admin', title: 'أستاذ الفقه والسياسة الشرعية', bio: 'عالم وباحث شرعي ومدرس للعلوم الشرعية.' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const regularUsers = await Promise.all([
    ['أحمد محمد', 'ahmed@example.com'],
    ['محمد علي', 'mohamed@example.com'],
    ['فاطمة حسن', 'fatima@example.com']
  ].map(async ([name, email]) => User.findOneAndUpdate(
    { email },
    { name, email, passwordHash: await bcrypt.hash('User12345!', 12), role: 'user' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )));

  const categories = {};
  for (const data of categoryData) {
    categories[data.slug] = await Category.findOneAndUpdate({ slug: data.slug }, data, { upsert: true, new: true, setDefaultsOnInsert: true });
  }

  const books = {};
  for (const data of bookData) {
    books[data.slug] = await Book.findOneAndUpdate(
      { slug: data.slug },
      { ...data, category: categories[data.category]._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const bookList = Object.values(books);
  const lessons = [];
  for (let index = 0; index < lessonTitles.length; index += 1) {
    const book = bookList[index % bookList.length];
    const lessonNumber = Math.floor(index / bookList.length) + 1;
    const lesson = await Lesson.findOneAndUpdate(
      { slug: `lesson-${index + 1}` },
      {
        book: book._id,
        title: lessonTitles[index],
        slug: `lesson-${index + 1}`,
        lessonNumber,
        description: lessonDescriptions[index % lessonDescriptions.length],
        audioUrl: `https://example.com/audio/lesson-${index + 1}.mp3`,
        durationSeconds: 1800 + (index * 73),
        publishedAt: new Date(Date.now() - index * 86400000),
        isFeatured: index === 0,
        status: 'published'
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    lessons.push(lesson);
  }

  await Bookmark.deleteMany({ user: { $in: regularUsers.map(user => user._id) } });
  await Bookmark.insertMany([
    { user: regularUsers[0]._id, lesson: lessons[0]._id },
    { user: regularUsers[0]._id, lesson: lessons[5]._id },
    { user: regularUsers[1]._id, lesson: lessons[2]._id },
    { user: regularUsers[2]._id, lesson: lessons[10]._id }
  ], { ordered: false });

  console.log('Seed complete');
  console.log(`Admin: ${admin.email}`);
  console.log(`Categories: ${Object.keys(categories).length}`);
  console.log(`Books: ${bookList.length}`);
  console.log(`Lessons: ${lessons.length}`);
  console.log('Regular user password: User12345!');
  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error(`Seed failed: ${error.message}`);
  await mongoose.connection.close();
  process.exit(1);
});
