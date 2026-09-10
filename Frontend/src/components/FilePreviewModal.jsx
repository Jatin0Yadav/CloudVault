import { X, Download, FileText, Image } from "lucide-react";

const FilePreviewModal = ({ file, onClose }) => {

    if (!file) {
        return null;
    }

    const isImage = file.type === "Image";

    const handleClose = (event) => {
        event.stopPropagation();
        onClose();
    };

    return (
        <div
            className="preview-overlay"
            onClick={onClose}
        >

            <div
                className="preview-modal"
                onClick={(event) => event.stopPropagation()}
            >

                {/* Header */}

                <div className="preview-header">

                    <div>
                        <h2>{file.name}</h2>

                        <span>{file.size}</span>
                    </div>

                    <button
                        type="button"
                        className="preview-close"
                        onClick={handleClose}
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* Preview */}

                <div className="preview-content">

                    {isImage ? (

                        <div className="image-preview">

                            <Image size={70} />

                            <p>Image Preview</p>

                        </div>

                    ) : (

                        <div className="file-preview-placeholder">

                            <FileText size={70} />

                            <h3>{file.name}</h3>

                            <p>
                                Preview will be available here.
                            </p>

                        </div>

                    )}

                </div>


                {/* Footer */}

                <div className="preview-footer">

                    <button
                        type="button"
                        className="download-btn"
                    >
                        <Download size={18} />
                        Download
                    </button>

                </div>

            </div>

        </div>
    );
};

export default FilePreviewModal;