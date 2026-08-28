import { Router } from 'express';
import Bookmark from '../models/Bookmark.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate({ path: 'lesson', populate: { path: 'book', populate: { path: 'category' } } }).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) { next(error); }
});

router.post('/:lessonId', async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { user: req.user._id, lesson: req.params.lessonId },
      { user: req.user._id, lesson: req.params.lessonId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(bookmark);
  } catch (error) { next(error); }
});

router.delete('/:lessonId', async (req, res, next) => {
  try {
    await Bookmark.deleteOne({ user: req.user._id, lesson: req.params.lessonId });
    res.status(204).send();
  } catch (error) { next(error); }
});

export default router;
