import { getAllCOntacts, getContactById } from '../services/contactRequest.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res, next) => {
  const contacts = await getAllCOntacts();
  console.log(contacts);
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact is not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
