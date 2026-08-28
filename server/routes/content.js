import { Router } from 'express';
import Category from '../models/Category.js';
import Book from '../models/Book.js';
import Lesson from '../models/Lesson.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
    res.json(categories);
  } catch (error) { next(error); }
});

router.get('/books', async (req, res, next) => {
  try {
    const filter = req.query.category ? { category: req.query.category, isActive: true } : { isActive: true };
    const books = await Book.find(filter).populate('category', 'name slug').sort({ sortOrder: 1, title: 1 });
    res.json(books);
  } catch (error) { next(error); }
});

router.get('/lessons', async (req, res, next) => {
  try {
    const filter = { status: 'published' };
    if (req.query.book) filter.book = req.query.book;
    const lessons = await Lesson.find(filter).populate({ path: 'book', populate: { path: 'category', select: 'name slug' } }).sort({ publishedAt: -1, lessonNumber: 1 });
    res.json(lessons);
  } catch (error) { next(error); }
});

router.post('/categories', requireAuth, requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await Category.create(req.body)); } catch (error) { next(error); }
});

router.post('/books', requireAuth, requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await Book.create(req.body)); } catch (error) { next(error); }
});

router.post('/lessons', requireAuth, requireAdmin, async (req, res, next) => {
  try { res.status(201).json(await Lesson.create(req.body)); } catch (error) { next(error); }
});

export default router;
