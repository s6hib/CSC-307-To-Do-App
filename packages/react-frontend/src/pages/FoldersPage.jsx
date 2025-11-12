import folderPng from "../assets/folders.png";
import "../css/FoldersPage.css";

function FolderPage() {
  return (
    <>
      <h1 className="folders-header">To-Do Folders</h1>
      <div className="folders">
        <button className="tile add-tile">
          <div className="folder-icon">
            <img
              className="icon"
              src={folderPng}
              alt="Folder Icon"
              draggable="false"
            />
          </div>
          <div className="folder-label">+ new folder</div>
        </button>
        <div className="tile folder-tile">
          <div className="folder-icon">
            <img
              className="icon"
              src={folderPng}
              alt="Folder Icon"
              draggable="false"
            />
          </div>
          <div className="folder-label">{"unnamed"}</div>
        </div>
      </div>
    </>
  );
}
export default FolderPage;
