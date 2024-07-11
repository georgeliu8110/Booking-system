import React, { useEffect, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { storage } from '@/app/lib/firebase/config';
import {ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage';
import { useContext } from 'react';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const focusedStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

// Modal Component
const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  console.log('ImageModal - imageSrc:', imageSrc);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="relative bg-white p-4 rounded-lg">
        <button className="absolute top-2 right-2 text-black" onClick={onClose}>
          &times;
        </button>
        <img src={imageSrc} alt="Preview" className="max-w-full max-h-full" />
      </div>
    </div>
  );
};

export default function ImageUpload({setCustomerInput, customerInput}) {
  const [files, setFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log('files:', files)

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      const newFiles = acceptedFiles.slice(0, 3 - files.length)
      setFiles(prevFiles => [
        ...prevFiles,
        ...newFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        }))
      ]);
      newFiles.forEach(file => {uploadFileToFirebase(file);});
    },
    maxFiles: 3
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  const handleImageClick = (imageSrc) => {
    console.log('handleImageClick - imageSrc:', imageSrc);
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name} onClick={() => handleImageClick(file.preview)}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Cleanup the blob URLs on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  const uploadFileToFirebase = async (file) => {
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          setCustomerInput((prev) => ({ ...prev, images: [...prev.images, downloadURL]}));
        });
      }
    );
  }

  return (
    <section className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop up to 3 photos of the issues you described above here, or click to select photos</p>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
      <ImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} imageSrc={selectedImage} />
    </section>
  );
}
