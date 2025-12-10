import prisma from '../utils/prisma.js';
import fs from 'fs';
// import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export const uploadDocument = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        const document = await prisma.document.create({
            data: {
                filename: req.file.originalname,
                filepath: req.file.path,
                filesize: req.file.size
            }
        });

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            data: document
        });
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        next(error);
    }
};

export const getAllDocuments = async (req, res, next) => {
    try {
        const documents = await prisma.document.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            success: true,
            data: documents
        });
    } catch (error) {
        next(error);
    }
};

export const downloadDocument = async (req, res, next) => {
    try {
        const { id } = req.params;

        const document = await prisma.document.findUnique({
            where: { id }
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        if (!fs.existsSync(document.filepath)) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${document.filename}"`);

        const fileStream = fs.createReadStream(document.filepath);
        fileStream.pipe(res);
    } catch (error) {
        next(error);
    }
};

export const deleteDocument = async (req, res, next) => {
    try {
        const { id } = req.params;

        const document = await prisma.document.findUnique({
            where: { id }
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        if (fs.existsSync(document.filepath)) {
            fs.unlinkSync(document.filepath);
        }

        await prisma.document.delete({
            where: { id }
        });

        res.status(200).json({
            success: true,
            message: 'Document deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
