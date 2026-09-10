import { useEffect, useState } from "react";

import {
    Files,
    HardDrive,
    Clock,
    Upload,
    FileText,
    Image
} from "lucide-react";

import {
    getMyFiles,
    uploadFile
} from "../services/fileService";

import { getApiErrorMessage } from "../utils/errorHandler";


const Dashboard = () => {

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

            const data = await getMyFiles();

            setFiles(Array.isArray(data) ? data : []);

        } catch (error) {

            console.error(
                "Failed to load dashboard files:",
                error
            );

            setError(
                getApiErrorMessage(
                    error,
                    "Failed to load dashboard data."
                )
            );

            setFiles([]);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchFiles();
    }, []);


    // ==========================================
    // Calculate Storage
    // ==========================================

    const totalFiles = files.length;

    const totalStorage = files.reduce(
        (total, file) =>
            total + (file.size || 0),
        0
    );


    // ==========================================
    // Format Storage
    // ==========================================

    const formatStorage = (bytes) => {

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
            return `${(
                bytes /
                (1024 * 1024)
            ).toFixed(2)} MB`;
        }

        return `${(
            bytes /
            (1024 * 1024 * 1024)
        ).toFixed(2)} GB`;
    };


    // ==========================================
    // Recent Files
    // ==========================================

    const recentFiles = [...files]
        .sort(
            (a, b) =>
                new Date(b.uploadedAt || 0) -
                new Date(a.uploadedAt || 0)
        )
        .slice(0, 5);


    // ==========================================
    // Upload File
    // ==========================================

    const handleUpload = async (e) => {

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

            console.error(
                "Dashboard upload failed:",
                error
            );

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
    // File Type Icon
    // ==========================================

    const getFileIcon = (file) => {

        if (
            file.contentType &&
            file.contentType.startsWith("image/")
        ) {
            return <Image size={20} />;
        }

        return <FileText size={20} />;
    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (
            <div className="files-page">

                <div className="dashboard-header">

                    <div>

                        <h1>Dashboard</h1>

                        <p>
                            Loading your CloudVault...
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    return (

        <div className="dashboard-page">

            {/* =================================
                Header
            ================================== */}

            <div className="dashboard-header">

                <div>

                    <h1>Dashboard</h1>

                    <p>
                        Welcome back, Chief
                    </p>

                </div>

                <label
                    htmlFor="dashboard-file-upload"
                    className="upload-btn"
                >

                    <Upload size={18} />

                    {uploading
                        ? "Uploading..."
                        : "Upload File"
                    }

                </label>

                <input
                    id="dashboard-file-upload"
                    type="file"
                    hidden
                    onChange={handleUpload}
                    disabled={uploading}
                />

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
                Statistics
            ================================== */}

            <div className="stats-grid">

                {/* Total Files */}

                <div className="stat-card">

                    <div className="stat-icon">
                        <Files size={22} />
                    </div>

                    <div>

                        <h3>Total Files</h3>

                        <p>
                            {totalFiles}
                        </p>

                    </div>

                </div>


                {/* Storage */}

                <div className="stat-card">

                    <div className="stat-icon">
                        <HardDrive size={22} />
                    </div>

                    <div>

                        <h3>Storage Used</h3>

                        <p>
                            {formatStorage(
                                totalStorage
                            )}
                        </p>

                    </div>

                </div>


                {/* Recent */}

                <div className="stat-card">

                    <div className="stat-icon">
                        <Clock size={22} />
                    </div>

                    <div>

                        <h3>Recent Files</h3>

                        <p>
                            {recentFiles.length}
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================
                Storage Card
            ================================== */}

            <div className="storage-card">

                <div className="storage-header">

                    <div>

                        <h2>Storage</h2>

                        <p>
                            Total storage currently used
                        </p>

                    </div>

                    <span>
                        {formatStorage(totalStorage)}
                    </span>

                </div>


                <div className="storage-bar">

                    <div
                        className="storage-progress"
                        style={{
                            width: `${Math.min(
                                (
                                    totalStorage /
                                    (100 * 1024 * 1024)
                                ) * 100,
                                100
                            )}%`
                        }}
                    />

                </div>

            </div>


            {/* =================================
                Recent Files
            ================================== */}

            <div className="recent-files">

                <h2>Recent Files</h2>

                {recentFiles.length === 0 ? (

                    <div className="empty-state">

                        <Files size={40} />

                        <h2>
                            No files yet
                        </h2>

                        <p>
                            Upload a file to see it here.
                        </p>

                    </div>

                ) : (

                    <div className="file-list">

                        {recentFiles.map((file) => (

                            <div
                                className="file-row"
                                key={file.id}
                            >

                                <div className="file-name">

                                    {getFileIcon(file)}

                                    <span>
                                        {file.originalName}
                                    </span>

                                </div>

                                <span>
                                    {file.contentType}
                                </span>

                                <span>
                                    {formatStorage(
                                        file.size
                                    )}
                                </span>

                                <span>

                                    {file.uploadedAt
                                        ? new Date(
                                            file.uploadedAt
                                        ).toLocaleDateString()
                                        : "-"
                                    }

                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};


export default Dashboard;