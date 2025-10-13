// src/controllers/userController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { nombre, correo, telefono, contraseña } = req.body;

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    // Verificar si ya existe el correo
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear usuario
    const newUser = new User({
      nombre,
      correo,
      telefono,
      contraseña: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
    }

    console.log("Datos recibidos:", req.body);
    console.log("Conectando a MongoDB con URI:", process.env.MONGO_URI);

    // 1. Búsqueda de usuario (forzando solo la contraseña para la validación)
    const user = await User.findOne({ correo }).select('+contraseña'); 

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // 2. Validación de contraseña
    const isMatch = await bcrypt.compare(contraseña, user.contraseña);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // 3. CONVERSIÓN CRÍTICA: Convertimos el documento de Mongoose a un objeto JavaScript simple
    // Esto asegura que se expongan todos los campos existentes, incluido 'nombre'.
    const cleanUser = user.toObject(); 

    // 4. Limpiamos campos sensibles y preparamos la respuesta
    delete cleanUser.contraseña; // Eliminamos la contraseña del objeto que se enviará
    
    const userResponse = {
      id: cleanUser._id,
      nombre: cleanUser.nombre, // ✅ Ahora debe tomar el valor del objeto limpio
      correo: cleanUser.correo,
      telefono: cleanUser.telefono,
    };
    
    // 🔍 Vuelve a revisar este log para la confirmación final
    console.log("Objeto de usuario enviado al frontend:", userResponse); 

    // 5. Respuesta exitosa
    res.json({
      success: true,
      message: "Login correcto",
      user: userResponse, 
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};