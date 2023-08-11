import Resizer from 'react-image-file-resizer';
const resizeFile = (file) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            150,
            150,
            'JPEG',
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            'base64',
        );
    });

export default resizeFile;
