import { Star, FileText, Image } from "lucide-react";
import FileMenu from "../components/FileMenu";

const Favorites = () => {

    const favoriteFiles = [
        {
            id: 1,
            name: "Resume.pdf",
            type: "PDF",
            size: "2.4 MB",
            added: "Aug 9, 2026"
        },
        {
            id: 2,
            name: "Important Notes.pdf",
            type: "PDF",
            size: "1.2 MB",
            added: "Aug 8, 2026"
        }
    ];

    return (
        <div className="files-page">

            <div className="page-header">

                <div>
                    <h1>Favorites</h1>
                    <p>Your starred files</p>
                </div>

            </div>

            {favoriteFiles.length === 0 ? (

                <div className="empty-state">

                    <Star size={48} />

                    <h2>No favorites yet</h2>

                    <p>
                        Star files to quickly access them here.
                    </p>

                </div>

            ) : (

                <div className="files-container">

                    <div className="files-table-header">
                        <span>Name</span>
                        <span>Type</span>
                        <span>Size</span>
                        <span>Added</span>
                        <span></span>
                    </div>

                    {favoriteFiles.map((file) => (

                        <div
                            className="file-table-row"
                            key={file.id}
                        >

                            <div className="file-name">

                                {file.type === "Image"
                                    ? <Image size={20} />
                                    : <FileText size={20} />
                                }

                                <span>{file.name}</span>

                            </div>

                            <span>{file.type}</span>
                            <span>{file.size}</span>
                            <span>{file.added}</span>

                            {/* <button className="file-menu">
                                <MoreVertical size={20} />
                            </button> */}

                            <FileMenu file={file} />

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default Favorites;