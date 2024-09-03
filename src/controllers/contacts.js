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

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const contacts = await getAllCOntacts({
    page,
    perPage,
    sortBy,
    sortOrder,
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
  const contact = await getContactById(contactId);
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
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    parentId: req.user._id,
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
  const result = await deleteContact(contactId);
  if (result === null) {
    throw createHttpError(404, 'Contact is not found');
  }
  res.status(204).end();
  console.log(result);
};
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await patchContact(contactId, req.body);
  if (!result) {
    throw createHttpError(404, 'Contact is not found');
  }
  res.status(200).send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};
