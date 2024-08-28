import { Contact } from '../db/contacts.js';

export const getAllCOntacts = async ({ page, perPage, sortBy, sortOrder }) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const [contacts, count] = await Promise.all([
    Contact.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
    Contact.countDocuments(),
  ]);
  const totalPages = Math.ceil(count / perPage);
  //const contacts = await Contact.find().skip(skip).limit(perPage);
  //const count = await Contact.countDocuments();
  return {
    contacts,
    page,
    perPage,
    totalItems: count,
    totalPages: totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages - page > 0,
  };
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  return Contact.create(payload);
};
export const deleteContact = (contactId) => {
  return Contact.findByIdAndDelete(contactId);
};
export const patchContact = (contactId, payload) => {
  return Contact.findByIdAndUpdate(contactId, payload, {
    new: true,
  });
};
