const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createPerson, updatePerson, deletePerson } = require('../../services/protected/people.service.cjs');
const { requireAdmin } = require('../../middleware/auth.cjs');
const { saveImage, getImageUrl } = require('../../helpers/image.helper.cjs');

const upload = multer({
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB limit
    }
}).single('image');

router.post('/', requireAdmin, (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ error: 'Unexpected file field. Use "image" as the field name.' });
            }
            return next(err);
        }

        try {
            let imageURL = req.body.imageURL;

            if (req.file) {
                try {
                    const savedImage = await saveImage(req.file);
                    imageURL = getImageUrl(savedImage.id);
                } catch (error) {
                    return res.status(400).json({ error: error.message });
                }
            }

            const personData = {
                ...req.body,
                imageURL
            };

            const person = await createPerson(personData);
            res.json(person);
        } catch (error) {
            next(error);
        }
    });
});

router.put('/:id', requireAdmin, (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({ error: 'Unexpected file field. Use "image" as the field name.' });
            }
            return next(err);
        }

        try {
            let imageURL = req.body.imageURL;

            if (req.file) {
                try {
                    const savedImage = await saveImage(req.file);
                    imageURL = getImageUrl(savedImage.id);
                } catch (error) {
                    return res.status(400).json({ error: error.message });
                }
            }

            const personData = {
                ...req.body,
                imageURL
            };

            const person = await updatePerson(req.params.id, personData);
            res.json(person);
        } catch (error) {
            next(error);
        }
    });
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
        const result = await deletePerson(req.params.id);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

module.exports = router; 