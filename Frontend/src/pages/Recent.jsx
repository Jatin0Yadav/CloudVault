import { useEffect, useState } from "react";
import { FileText, Image } from "lucide-react";
import { getMyFiles } from "../services/fileService";
import { getApiErrorMessage } from "../utils/errorHandler";
import FileMenu from "../components/FileMenu";
const Recent = () => {
    const [recentFiles, setRecentFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    // ==========================================
    // Fetch Recent Files
    // ==========================================
    const fetchRecentFiles = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getMyFiles();
            const sortedFiles = [...data]
                .sort(
                    (a, b) =>
                        new Date(b.uploadedAt || 0) -
                        new Date(a.uploadedAt || 0)
                )
                .slice(0, 10);
            setRecentFiles(sortedFiles);
        } catch (error) {
            console.error(
                "Failed to fetch recent files:",
                error
            );
            setError(
                getApiErrorMessage(
                    error,
                    "Failed to load recent files."
                )
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRecentFiles();
    }, []);
    // ==========================================
    // Loading
    // ==========================================
    if (loading) {
        return (
            <div className="files-page">
                <div className="page-header">
                    <div>
                        <h1>Recent Files</h1>
                        <p>Loading recent files...</p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="files-page">
            {/* =================================
                Header
            ================================== */}
            <div className="page-header">
                <div>
                    <h1>Recent Files</h1>
                    <p>Files you've accessed recently</p>
                </div>
            </div>
            {/* =================================
                Error
            ================================== */}
            {error && (
                <div className="file-error">
                    {error}
                </div>
            )}
            {/* =================================
                Empty State
            ================================== */}
            {recentFiles.length === 0 ? (
                <div className="empty-state">
                    <FileText size={48} />
                    <h2>No recent files</h2>
                    <p>
                        Your recently uploaded files will appear here.
                    </p>
                </div>
            ) : (
                /* =================================
                   Recent Files
                ================================== */
                <div className="files-container">
                    <div className="files-table-header">
                        <span>Name</span>
                        <span>Type</span>
                        <span>Size</span>
                        <span>Last Accessed</span>
                        <span></span>
                    </div>
                    {recentFiles.map((file) => (
                        <div
                            className="file-table-row"
                            key={file.id}
                        >
                            <div className="file-name">
                                {file.contentType?.startsWith("image/")
                                    ? <Image size={20} />
                                    : <FileText size={20} />
                                }
                                <span>
                                    {file.originalName}
                                </span>
                            </div>
                            <span>
                                {file.contentType || "Unknown"}
                            </span>
                            <span>
                                {formatFileSize(file.size)}
                            </span>
                            <span>
                                {file.uploadedAt
                                    ? new Date(
                                          file.uploadedAt
                                      ).toLocaleString()
                                    : "-"
                                }
                            </span>
                            <FileMenu
                                file={file}
                                onRefresh={fetchRecentFiles}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
const formatFileSize = (bytes) => {
    if (!bytes) {
        return "0 Bytes";
    }
    if (bytes < 1024) {
        return `${bytes} Bytes`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
    }
    if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};
export default Recent;