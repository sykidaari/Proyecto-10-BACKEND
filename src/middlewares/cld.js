const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: (req) => {
      switch (true) {
        case req.baseUrl.includes('events'):
          return 'eventsPage/events';
        case req.baseUrl.includes('users'):
          return 'eventsPage/users';
      }
    },
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
  }
});

const upload = multer({ storage });

module.exports = upload;

//? switch usado en vez de if (en const storage) -> mejor para futura escalabilidad. si hubieran más modelos en la app en un futuro, sería fácil añadir un case para sus fotos, también se mantiene legible.
