import {
    Trash2,
    FileText,
    RotateCcw,
    MoreVertical
} from "lucide-react";

const Trash = () => {

    const deletedFiles = [
        {
            id: 1,
            name: "Old Resume.pdf",
            size: "2.1 MB",
            deletedAt: "Aug 8, 2026"
        },
        {
            id: 2,
            name: "Old Project.zip",
            size: "18 MB",
            deletedAt: "Aug 6, 2026"
        }
    ];

    return (
        <div className="files-page">

            <div className="page-header">

                <div>
                    <h1>Trash</h1>
                    <p>Files you've deleted</p>
                </div>

                <button className="danger-btn">
                    <Trash2 size={18} />
                    Empty Trash
                </button>

            </div>

            {deletedFiles.length === 0 ? (

                <div className="empty-state">

                    <Trash2 size={48} />

                    <h2>Trash is empty</h2>

                    <p>
                        Deleted files will appear here.
                    </p>

                </div>

            ) : (

                <div className="files-container">

                    <div className="files-table-header">
                        <span>Name</span>
                        <span>Size</span>
                        <span>Deleted</span>
                        <span>Restore</span>
                        <span></span>
                    </div>

                    {deletedFiles.map((file) => (

                        <div
                            className="file-table-row"
                            key={file.id}
                        >

                            <div className="file-name">

                                <FileText size={20} />

                                <span>{file.name}</span>

                            </div>

                            <span>{file.size}</span>

                            <span>{file.deletedAt}</span>

                            <button className="restore-btn">
                                <RotateCcw size={17} />
                                Restore
                            </button>

                            <button className="file-menu">
                                <MoreVertical size={20} />
                            </button>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default Trash;