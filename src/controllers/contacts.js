import * as fs from 'node:fs/promises';

import {
  getAllCOntacts,
  getContactById,
  createContact,
  deleteContact,
  patchContact,
} from '../services/contactRequest.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const contacts = await getAllCOntacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    parentId: req.user._id,
  });
  console.log(contacts);
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const parentId = req.user._id;

  const contact = await getContactById(contactId, parentId);
  if (!contact) {
    throw createHttpError(404, 'Contact is not found');
  }
  if (contact.parentId.toString() !== req.user._id.toString()) {
    return next(createHttpError(403, 'Contact is not allowed'));
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
export const CreateContactController = async (req, res) => {
  let photo = null;

  if (typeof req.file !== 'undefined') {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      console.log(result);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    }
  }
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    contactType: req.body.contactType,
    parentId: req.user._id,
    photo,
  };
  const createdContact = await createContact(contact);
  console.log({ createdContact });
  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: createdContact,
  });
};
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const parentId = req.user._id;
  const result = await deleteContact(contactId, parentId);
  if (result === null) {
    throw createHttpError(404, 'Contact is not found');
  }
  res.status(204).end();
  console.log(result);
};
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const parentId = req.user._id;

  let updatedData = { ...req.body };
  let resultPhoto = null;

  if (typeof req.file !== 'undefined') {
    if (process.env.ENABLE_CLOUDINARY === 'true') {
      resultPhoto = await uploadToCloudinary(req.file.path);
      updatedData.photo = resultPhoto.secure_url;
      await fs.unlink(req.file.path);
    }
  }

  const result = await patchContact(contactId, updatedData, parentId);
  if (!result) {
    throw createHttpError(404, 'Contact is not found');
  }
  res.status(200).send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};
