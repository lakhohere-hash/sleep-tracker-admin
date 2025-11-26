const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const path = require('path');
const fs = require('fs');

// 🚀 AWS S3 CONFIGURATION
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-access-key',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-key'
    }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'sleep-tracker-audio';

class FileUploadService {
    // 🎵 CONFIGURE MULTER FOR LOCAL UPLOADS (Fallback)
    getMulterConfig() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const uploadDir = 'uploads/audio/';
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExtension = path.extname(file.originalname);
                cb(null, 'audio-' + uniqueSuffix + fileExtension);
            }
        });

        const fileFilter = (req, file, cb) => {
            // 🎵 Accept audio files only
            if (file.mimetype.startsWith('audio/')) {
                cb(null, true);
            } else {
                cb(new Error('Only audio files are allowed!'), false);
            }
        };

        return multer({
            storage: storage,
            fileFilter: fileFilter,
            limits: {
                fileSize: 50 * 1024 * 1024, // 50MB limit
                files: 1 // Single file upload
            }
        });
    }

    // ☁️ UPLOAD TO AWS S3
    async uploadToS3(file, folder = 'audio') {
        try {
            const fileKey = `${folder}/${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
            
            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
                Metadata: {
                    originalName: file.originalname,
                    uploadedAt: new Date().toISOString()
                }
            });

            await s3Client.send(command);
            
            console.log('✅ File uploaded to S3:', fileKey);
            
            return {
                success: true,
                fileKey: fileKey,
                url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileKey}`,
                size: file.size,
                mimetype: file.mimetype
            };
        } catch (error) {
            console.error('❌ S3 upload error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 📥 GET SIGNED URL FOR SECURE ACCESS
    async getSignedFileUrl(fileKey, expiresIn = 3600) {
        try {
            const command = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileKey
            });

            const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
            
            return {
                success: true,
                url: signedUrl,
                expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString()
            };
        } catch (error) {
            console.error('❌ Signed URL error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 🗑️ DELETE FILE FROM S3
    async deleteFromS3(fileKey) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileKey
            });

            await s3Client.send(command);
            
            console.log('✅ File deleted from S3:', fileKey);
            
            return {
                success: true,
                message: 'File deleted successfully'
            };
        } catch (error) {
            console.error('❌ S3 delete error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 💾 SAVE FILE LOCALLY (Fallback when no S3)
    async saveFileLocally(file) {
        try {
            const uploadDir = 'uploads/audio/';
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const fileName = `audio-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
            const filePath = path.join(uploadDir, fileName);

            fs.writeFileSync(filePath, file.buffer);
            
            console.log('✅ File saved locally:', filePath);
            
            return {
                success: true,
                filePath: filePath,
                fileName: fileName,
                size: file.size,
                mimetype: file.mimetype
            };
        } catch (error) {
            console.error('❌ Local file save error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 🎵 VALIDATE AUDIO FILE
    validateAudioFile(file) {
        const allowedTypes = [
            'audio/mpeg', // mp3
            'audio/wav',  // wav
            'audio/x-wav', // wav
            'audio/aac',  // aac
            'audio/ogg',  // ogg
            'audio/flac'  // flac
        ];

        const maxSize = 50 * 1024 * 1024; // 50MB

        if (!allowedTypes.includes(file.mimetype)) {
            return {
                valid: false,
                error: `File type ${file.mimetype} not allowed. Supported: MP3, WAV, AAC, OGG, FLAC`
            };
        }

        if (file.size > maxSize) {
            return {
                valid: false,
                error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum: 50MB`
            };
        }

        return { valid: true };
    }

    // 📊 GET FILE INFO
    async getFileInfo(fileKey) {
        try {
            // This would typically get metadata from your database
            // For now, return basic info
            return {
                success: true,
                fileKey: fileKey,
                uploadedAt: new Date().toISOString(),
                size: 0, // You'd get this from your database
                type: 'audio'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new FileUploadService();