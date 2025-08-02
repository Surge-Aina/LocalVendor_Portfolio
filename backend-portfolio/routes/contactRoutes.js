const express = require('express');
const router = express.Router();
const {
  getContactInfo,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo
} = require('../controllers/contactController');

router.get('/', getContactInfo);
router.post('/', createContactInfo);
router.put('/:id', updateContactInfo);
router.delete('/:id', deleteContactInfo);

module.exports = router;
