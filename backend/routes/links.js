import { Router } from 'express';
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  getTags
} from '../controllers/link.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const linkRouter = Router();

// All link routes require authentication
linkRouter.use(authenticateToken);

// GET /links?tag=js&search=react - Get all links with optional filters
linkRouter.get('/', getLinks);

// GET /links/tags - Get all unique tags for the user
linkRouter.get('/tags', getTags);

// POST /links - Create a new link
linkRouter.post('/', createLink);

// PATCH /links/:id - Update a link
linkRouter.patch('/:id', updateLink);

// DELETE /links/:id - Delete a link
linkRouter.delete('/:id', deleteLink);

export default linkRouter;
