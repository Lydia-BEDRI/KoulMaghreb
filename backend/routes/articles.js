const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../database/connection');
const { auth, adminAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    let whereClause = '';
    let queryParams = [];

    const conditions = [];
    
    if (search) {
      conditions.push('(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (category) {
      conditions.push('category = ?');
      queryParams.push(category);
    }

    if (conditions.length > 0) {
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }

    const countQuery = `SELECT COUNT(*) as total FROM articles ${whereClause}`;
    const totalResult = await query(countQuery, queryParams);
    const total = totalResult[0].total;

    const articlesQuery = `
      SELECT id, title, slug, excerpt, image, category, created_at
      FROM articles 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const articles = await query(articlesQuery, [...queryParams, parseInt(limit), parseInt(offset)]);

    res.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur récupération articles:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
  }
});

router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const articles = await query(
      'SELECT * FROM articles WHERE slug = ?',
      [req.params.slug]
    );

    if (articles.length === 0) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    res.json({ article: articles[0] });

  } catch (error) {
    console.error('Erreur récupération article:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
  }
});

const createValidation = [
  body('title').notEmpty().trim().withMessage('Le titre est requis'),
  body('slug').notEmpty().trim().withMessage('Le slug est requis'),
  body('excerpt').optional().trim(),
  body('content').notEmpty().withMessage('Le contenu est requis'),
  body('category').notEmpty().trim().withMessage('La catégorie est requise'),
  body('image').optional().trim()
];

router.post('/', auth, adminAuth, createValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, slug, excerpt, content, image, category } = req.body;

    const existingArticle = await query('SELECT id FROM articles WHERE slug = ?', [slug]);
    if (existingArticle.length > 0) {
      return res.status(400).json({ error: 'Ce slug existe déjà' });
    }

    const result = await query(
      'INSERT INTO articles (title, slug, excerpt, content, image, category) VALUES (?, ?, ?, ?, ?, ?)',
      [title, slug, excerpt, content, image, category]
    );

    const newArticle = await query(
      'SELECT * FROM articles WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Article créé avec succès',
      article: newArticle[0]
    });

  } catch (error) {
    console.error('Erreur création article:', error);
    res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
  }
});

const updateValidation = [
  body('title').optional().notEmpty().trim().withMessage('Le titre ne peut pas être vide'),
  body('slug').optional().notEmpty().trim().withMessage('Le slug ne peut pas être vide'),
  body('excerpt').optional().trim(),
  body('content').optional().notEmpty().withMessage('Le contenu ne peut pas être vide'),
  body('category').optional().notEmpty().trim().withMessage('La catégorie ne peut pas être vide'),
  body('image').optional().trim()
];

router.put('/:id', auth, adminAuth, updateValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const articleId = parseInt(req.params.id);
    const { title, slug, excerpt, content, image, category } = req.body;

    const existingArticle = await query('SELECT id FROM articles WHERE id = ?', [articleId]);
    if (existingArticle.length === 0) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    if (slug) {
      const slugExists = await query(
        'SELECT id FROM articles WHERE slug = ? AND id != ?',
        [slug, articleId]
      );
      if (slugExists.length > 0) {
        return res.status(400).json({ error: 'Ce slug existe déjà' });
      }
    }

    const updates = [];
    const values = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (slug !== undefined) { updates.push('slug = ?'); values.push(slug); }
    if (excerpt !== undefined) { updates.push('excerpt = ?'); values.push(excerpt); }
    if (content !== undefined) { updates.push('content = ?'); values.push(content); }
    if (image !== undefined) { updates.push('image = ?'); values.push(image); }
    if (category !== undefined) { updates.push('category = ?'); values.push(category); }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
    }

    updates.push('updated_at = NOW()');
    values.push(articleId);

    await query(
      `UPDATE articles SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedArticle = await query('SELECT * FROM articles WHERE id = ?', [articleId]);

    res.json({
      message: 'Article mis à jour avec succès',
      article: updatedArticle[0]
    });

  } catch (error) {
    console.error('Erreur mise à jour article:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'article' });
  }
});


router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);

    const existingArticle = await query('SELECT id FROM articles WHERE id = ?', [articleId]);
    if (existingArticle.length === 0) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    await query('DELETE FROM articles WHERE id = ?', [articleId]);

    res.json({ message: 'Article supprimé avec succès' });

  } catch (error) {
    console.error('Erreur suppression article:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
  }
});

router.get('/categories/list', async (req, res) => {
  try {
    const categories = await query(
      'SELECT DISTINCT category FROM articles WHERE category IS NOT NULL ORDER BY category'
    );

    res.json({ 
      categories: categories.map(cat => cat.category) 
    });

  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
  }
});

module.exports = router;
