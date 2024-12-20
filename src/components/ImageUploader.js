import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ onDrop, images, setImages }) => {
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setImages(newImages); // Only keep the new images
      onDrop(newImages);
    },
    [onDrop, setImages]
  );

  const handleRemove = () => {
    setImages([]); // Clear all images
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
  });

  return (
    <div>
      {images.length === 0 ? (
        <div {...getRootProps()} style={styles.dropzone}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the image here ...</p>
          ) : (
            <p>Drag 'n' drop an image here, or click to select image</p>
          )}
        </div>
      ) : (
        <div style={styles.previewContainer}>
          {images.map((file, index) => (
            <div key={index} style={styles.preview}>
              <img
                src={file.preview}
                alt="Preview"
                style={{ width: "100px", height: "100px" }}
              />
              <button onClick={handleRemove} style={styles.removeButton}>
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  dropzone: {
    border: "2px dashed #cccccc",
    borderRadius: "5px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
  },
  previewContainer: {
    display: "flex",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  preview: {
    position: "relative",
    marginRight: "10px",
  },
  removeButton: {
    position: "absolute",
    top: "4px",
    right: "4px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    width: "20px",
  },
};

export default ImageUploader;
