import { useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { uploadFile } from "../services/fileService";

const FileUpload = ({ onUploadSuccess }) => {

    const fileInputRef = useRef(null);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileSelect = (file) => {

        if (!file) {
            return;
        }

        setSelectedFile(file);
        setError("");
    };


    const handleInputChange = (event) => {

        const file = event.target.files[0];

        handleFileSelect(file);
    };


    const handleDragOver = (event) => {

        event.preventDefault();

        setIsDragging(true);
    };


    const handleDragLeave = (event) => {

        event.preventDefault();

        setIsDragging(false);
    };


    const handleDrop = (event) => {

        event.preventDefault();

        setIsDragging(false);

        const file = event.dataTransfer.files[0];

        handleFileSelect(file);
    };


    const handleUpload = async () => {

        if (!selectedFile) {
            return;
        }

        try {

            setUploading(true);
            setError("");

            await uploadFile(selectedFile);

            setSelectedFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setIsOpen(false);

            if (onUploadSuccess) {
                onUploadSuccess();
            }

        } catch (error) {

            console.error(error);

            setError("File upload failed.");

        } finally {

            setUploading(false);
        }
    };


    const closeModal = () => {

        if (uploading) {
            return;
        }

        setIsOpen(false);
        setSelectedFile(null);
        setError("");
        setIsDragging(false);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };


    return (
        <>
            {/* Upload button */}

            <button
                className="upload-btn"
                onClick={() => setIsOpen(true)}
            >
                <UploadCloud size={18} />
                Upload File
            </button>


            {/* Modal */}

            {isOpen && (

                <div
                    className="upload-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="upload-modal"
                        onClick={(event) => event.stopPropagation()}
                    >

                        {/* Header */}

                        <div className="upload-modal-header">

                            <h2>Upload Files</h2>

                            <button
                                className="close-upload-modal"
                                onClick={closeModal}
                            >
                                <X size={20} />
                            </button>

                        </div>


                        {/* Drop zone */}

                        <div
                            className={`drop-zone ${
                                isDragging ? "dragging" : ""
                            }`}

                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}

                            onClick={() => fileInputRef.current.click()}
                        >

                            <UploadCloud size={48} />

                            <h3>
                                Drag & drop your file here
                            </h3>

                            <p>
                                or
                            </p>

                            <button
                                type="button"
                                className="browse-btn"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    fileInputRef.current.click();
                                }}
                            >
                                Browse Files
                            </button>

                            <span>
                                Maximum file size: 50 MB
                            </span>

                        </div>


                        {/* Hidden file input */}

                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            onChange={handleInputChange}
                        />


                        {/* Selected file */}

                        {selectedFile && (

                            <div className="selected-file">

                                <div>
                                    <strong>
                                        {selectedFile.name}
                                    </strong>

                                    <p>
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>

                                <button
                                    className="remove-file"
                                    onClick={() => setSelectedFile(null)}
                                >
                                    <X size={18} />
                                </button>

                            </div>
                        )}


                        {error && (
                            <p className="upload-error">
                                {error}
                            </p>
                        )}


                        {/* Footer */}

                        <div className="upload-modal-footer">

                            <button
                                className="cancel-btn"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>

                            <button
                                className="upload-btn"
                                disabled={!selectedFile || uploading}
                                onClick={handleUpload}
                            >
                                {uploading
                                    ? "Uploading..."
                                    : "Upload"
                                }
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
};

export default FileUpload;