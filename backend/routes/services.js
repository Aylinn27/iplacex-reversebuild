const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.post('/', async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.json(newService);
    } catch (err) { res.status(500).json(err); }
});

router.post('/:id/pasos', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        const nextOrder = service.pasos.length + 1;
        
        service.pasos.push({
            desc: req.body.desc,
            img: req.body.img, 
            ord: nextOrder
        });
        await service.save();
        res.json(service);
    } catch (err) { res.status(500).json(err); }
});

router.get('/:id/rearme', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        const pasosInvertidos = service.pasos.sort((a, b) => b.ord - a.ord);
        res.json({ ...service._doc, pasos: pasosInvertidos });
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;