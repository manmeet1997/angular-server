const express = require('express');
const router = express.Router();
const FAQ = require('../models/faq');

// Getting all FAQs
router.get('/', async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Getting FAQ by id
router.get('/:id', async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: "Cannot find such FAQ" });
        }
        res.json(faq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Creating a FAQ
router.post('/', async (req, res) => {
    const faq = new FAQ({
        question: req.body.question,
        answer: req.body.answer
    });
    try {
        const newFAQ = await faq.save();
        res.status(201).json(newFAQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Updating the answer in FAQ by id
router.patch('/:id', async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: "Cannot find such FAQ" });
        }
        if (req.body.answer != null) {
            faq.answer = req.body.answer;
        }
        await faq.save();
        res.json(faq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete FAQ by id
router.delete('/:id', async (req, res) => {
    try {
        await FAQ.findByIdAndDelete(req.params.id);
        res.json({ message: "FAQ Deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;