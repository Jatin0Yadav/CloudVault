import { useState } from "react";

import {
    MoreVertical,
    Download,
    Pencil,
    Trash2
} from "lucide-react";

import {
    downloadFile,
    renameFile,
    deleteFile
} from "../services/fileService";


const FileMenu = ({ file, onRefresh }) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    // ==========================================
    // Download
    // ==========================================

    const handleDownload = async () => {

        try {

            setLoading(true);

            const response =
                await downloadFile(file.id);


            const blob = new Blob(
                [response.data],
                {
                    type:
                        response.headers[
                            "content-type"
                        ]
                }
            );


            const url =
                window.URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                file.originalName ||
                file.name;


            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            setMenuOpen(false);

        } catch (error) {

            console.error(
                "Download failed:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // Rename
    // ==========================================

    const handleRename = async () => {

        const currentName =
            file.originalName ||
            file.name;


        const newName =
            window.prompt(
                "Enter new file name:",
                currentName
            );


        if (!newName) {
            return;
        }


        if (newName === currentName) {
            return;
        }


        try {

            setLoading(true);

            await renameFile(
                file.id,
                newName
            );

            setMenuOpen(false);

            if (onRefresh) {
                await onRefresh();
            }

        } catch (error) {

            console.error(
                "Rename failed:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // Delete
    // ==========================================

    const handleDelete = async () => {

        const currentName =
            file.originalName ||
            file.name;


        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${currentName}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            setLoading(true);

            await deleteFile(file.id);

            setMenuOpen(false);

            if (onRefresh) {
                await onRefresh();
            }

        } catch (error) {

            console.error(
                "Delete failed:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="file-menu-wrapper">

            <button
                className="file-menu"
                type="button"
                onClick={(e) => {

                    e.stopPropagation();

                    setMenuOpen(!menuOpen);

                }}
                disabled={loading}
            >

                <MoreVertical size={20} />

            </button>


            {menuOpen && (

                <div
                    className="file-menu-dropdown"
                    onClick={(e) =>
                        e.stopPropagation()
                    }
                >

                    <button
                        type="button"
                        onClick={handleDownload}
                        disabled={loading}
                    >

                        <Download size={17} />

                        Download

                    </button>


                    <button
                        type="button"
                        onClick={handleRename}
                        disabled={loading}
                    >

                        <Pencil size={17} />

                        Rename

                    </button>


                    <div className="menu-divider" />


                    <button
                        type="button"
                        className="delete-action"
                        onClick={handleDelete}
                        disabled={loading}
                    >

                        <Trash2 size={17} />

                        Delete

                    </button>

                </div>

            )}

        </div>
    );
};


export default FileMenu;