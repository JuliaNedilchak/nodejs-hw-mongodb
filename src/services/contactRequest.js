import { Contact } from '../db/contacts.js';

export const getAllCOntacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  parentId,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const contactQuery = Contact.find();
  if (typeof filter.minYear !== 'undefined') {
    contactQuery.where('year').gte(filter.minYear);
  }

  if (typeof filter.maxYear !== 'undefined') {
    contactQuery.where('year').lte(filter.maxYear);
  }

  contactQuery.where('parentId').equals(parentId);
  const count = await Contact.countDocuments(contactQuery.getFilter());

  const contacts = await contactQuery
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(perPage);
  //const [contacts, count] = await Promise.all([
  //Contact.countDocuments(contactQuery),
  //contactQuery
  // .sort({ [sortBy]: sortOrder })
  //.skip(skip)
  //.limit(perPage),
  //]);
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

export const getContactById = async (contactId, parentId) => {
  const contact = await Contact.findOne({ _id: contactId, parentId });
  return contact;
};

export const createContact = async (payload) => {
  return Contact.create(payload);
};
export const deleteContact = (contactId, parentId) => {
  return Contact.findOneAndDelete({ _id: contactId, parentId });
};
export const patchContact = (contactId, payload, parentId) => {
  return Contact.findOneAndUpdate({ _id: contactId, parentId }, payload, {
    new: true,
  });
};
