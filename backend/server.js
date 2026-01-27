const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

router.post('/', async (req, res) => {
    try {
        const newService = new Service(req.body);
        await newService.save();
        res.json(newService);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al crear servicio' });
    }
});

router.post('/:id/pasos', async (req, res) => {
    try {
        if (!req.body.desc) {
            return res.status(400).json({ msg: 'La descripción es obligatoria' });
        }

        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ msg: 'Servicio no encontrado' });
        }

        const nextOrder = service.pasos.length + 1;

        service.pasos.push({
            desc: req.body.desc,
            img: req.body.img || '',
            ord: nextOrder
        });

        await service.save();
        res.json(service);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al guardar paso' });
    }
});

router.get('/:id/rearme', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ msg: 'Servicio no encontrado' });
        }

        const pasosInvertidos = [...service.pasos].sort((a, b) => b.ord - a.ord);
        res.json({ ...service._doc, pasos: pasosInvertidos });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener rearme' });
    }
});

router.put('/:id/finalizar', async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ msg: 'Servicio no encontrado' });
        }

        service.estado = 'Finalizado';
        await service.save();

        res.json({
            msg: 'Servicio finalizado correctamente',
            service
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al finalizar servicio' });
    }
});

module.exports = router;
