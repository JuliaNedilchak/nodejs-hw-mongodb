import { Router } from 'express';
import express from 'express';
import {
  getAllContactsController,
  getContactByIdController,
  CreateContactController,
  deleteContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();
const jsonParser = express.json();

router.get('/contacts', ctrlWrapper(getAllContactsController));
router.get(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);
router.post(
  '/contacts',
  jsonParser,
  validateBody(createContactSchema),
  ctrlWrapper(CreateContactController),
);
router.delete(
  '/contacts/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);
router.patch(
  '/contacts/:contactId',
  isValidId,
  jsonParser,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);
export default router;
