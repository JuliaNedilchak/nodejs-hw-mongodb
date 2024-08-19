import { Contact } from '../db/contacts.js';

export const getAllCOntacts = async () => {
  const contacts = await Contact.find();
  return contacts;
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
