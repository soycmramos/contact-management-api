import { Router } from 'express'

const router = Router()

import { checkBody, checkHeaders } from '../../middlewares/checkRequest.js'

import createContact from '../../controllers/contacts/createContact.js'
import getAllContacts from '../../controllers/contacts/getAllContacts.js'
import getContactById from '../../controllers/contacts/getContactById.js'
import updateContactById from '../../controllers/contacts/updateContactById.js'
import deleteContactById from '../../controllers/contacts/deleteContactById.js'

router.put('/', checkHeaders, checkBody, createContact)
router.get('/', checkHeaders, getAllContacts)
router.get('/:id', checkHeaders, getContactById)
router.patch('/:id', checkHeaders, checkBody, updateContactById)
router.delete('/:id', checkHeaders, deleteContactById)

export default router
