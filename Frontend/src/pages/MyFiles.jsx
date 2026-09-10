import { useEffect, useState } from "react";
import {
    File,
    Upload
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
    getMyFiles,
    uploadFile,
    searchFiles
} from "../services/fileService";
import FileMenu from "../components/FileMenu";
import { getApiErrorMessage } from "../utils/errorHandler";
const MyFiles = () => {
    const [searchParams] = useSearchParams();
    const searchKeyword = searchParams.get("search");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    // ==========================================
    // Fetch Files
    // ==========================================
    const fetchFiles = async () => {
        try {
            setLoading(true);
            setError("");
            let data;
            if (searchKeyword) {
                data = await searchFiles(searchKeyword);
            } else {
                data = await getMyFiles();
            }
            setFiles(data);
        } catch (error) {
            console.error("Failed to fetch files:", error);
            setError(
                getApiErrorMessage(
                    error,
                    searchKeyword
                        ? "Failed to search files."
                        : "Failed to load files."
                )
            );
        } finally {
            setLoading(false);
        }
    };
    // ==========================================
    // Fetch when page/search changes
    // ==========================================
    useEffect(() => {
        fetchFiles();
    }, [searchKeyword]);
    // ==========================================
    // Upload File
    // ==========================================
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        try {
            setUploading(true);
            setError("");
            await uploadFile(file);
            await fetchFiles();
            e.target.value = "";
        } catch (error) {
            console.error("File upload failed:", error);
            setError(
                getApiErrorMessage(
                    error,
                    "Failed to upload file."
                )
            );
        } finally {
            setUploading(false);
        }
    };
    // ==========================================
    // Loading
    // ==========================================
    if (loading) {
        return (
            <div className="files-page">
                <h1>
                    {searchKeyword
                        ? "Search Results"
                        : "My Files"}
                </h1>
                <p>Loading files...</p>
            </div>
        );
    }
    return (
        <div className="files-page">
            {/* =================================
                Header
            ================================== */}
            <div className="files-header">
                <div>
                    <h1>
                        {searchKeyword
                            ? "Search Results"
                            : "My Files"}
                    </h1>
                    <p>
                        {searchKeyword
                            ? `Results for "${searchKeyword}"`
                            : "Manage your uploaded files"}
                    </p>
                </div>
                {/* =================================
                    Upload
                ================================== */}
                <div>
                    <label
                        htmlFor="file-upload"
                        className="upload-button"
                    >
                        <Upload size={18} />
                        {uploading
                            ? "Uploading..."
                            : "Upload File"}
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        hidden
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
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
            {files.length === 0 ? (
                <div className="empty-files">
                    <File size={48} />
                    <h3>
                        {searchKeyword
                            ? "No files found"
                            : "No files yet"}
                    </h3>
                    <p>
                        {searchKeyword
                            ? `No files matched "${searchKeyword}".`
                            : "Upload your first file to get started."}
                    </p>
                </div>
            ) : (
                /* =================================
                   Files
                ================================== */
                <div className="files-list">
                    {files.map((file) => (
                        <div
                            className="file-item"
                            key={file.id}
                        >
                            {/* =================================
                                File Information
                            ================================== */}
                            <div className="file-info">
                                <div className="file-icon">
                                    <File size={22} />
                                </div>
                                <div>
                                    <h3>
                                        {file.originalName}
                                    </h3>
                                    <p>
                                        {file.contentType}
                                    </p>
                                </div>
                            </div>
                            {/* =================================
                                Metadata + File Menu
                            ================================== */}
                            <div className="file-meta">
                                <span>
                                    {file.size} bytes
                                </span>
                                <FileMenu
                                    file={file}
                                    onRefresh={fetchFiles}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default MyFiles;