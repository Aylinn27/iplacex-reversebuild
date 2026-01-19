const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
    desc: { type: String, required: true },
    ord: { type: Number, required: true },
    img: { type: String }, 
    comp: { type: Boolean, default: false } 
});

const ServiceSchema = new mongoose.Schema({
    cliente: {
        rut: { type: String, required: true },
        nombre: { type: String, required: true }
    },
    equipo: {
        tipo: { type: String, required: true },
        sn: { type: String, required: true }
    },
    fecha: { 
        type: Date, 
        default: Date.now 
    },
    estado: { 
        type: String, 
        enum: ['Desarme', 'Rearme', 'Finalizado'], 
        default: 'Desarme' 
    },
    pasos: [StepSchema] 
});

module.exports = mongoose.model('Service', ServiceSchema);
