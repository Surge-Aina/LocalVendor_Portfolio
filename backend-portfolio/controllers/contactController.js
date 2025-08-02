const ContactInfo = require('../models/ContactInfo');

exports.getContactInfo = async (req, res) => {
  try {
    const info = await ContactInfo.find();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contact info' });
  }
};

exports.createContactInfo = async (req, res) => {
  try {
    const newInfo = new ContactInfo(req.body);
    const saved = await newInfo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create contact info' });
  }
};

exports.updateContactInfo = async (req, res) => {
  try {
    const updated = await ContactInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Contact info not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update contact info' });
  }
};

exports.deleteContactInfo = async (req, res) => {
  try {
    const deleted = await ContactInfo.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Contact info not found' });
    res.json({ message: 'Contact info deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete contact info' });
  }
};