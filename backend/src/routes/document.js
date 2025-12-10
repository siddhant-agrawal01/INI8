import express from "express"


const router = express.router()


router.post('upload',upload.single('file'),updateDocument)

router.get('/',getAllDocument);

router.get('/:id',downloadDocument)
router.delete('/:id',deleteDocument)

export default router;

