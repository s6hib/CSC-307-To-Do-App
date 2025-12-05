// import folderPng from "../assets/folders.png";
// import "../css/FoldersPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

export default function FoldersPage() {
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderForm, setShowNewFolderForm] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //Fetch all folders
  useEffect(() => {
    fetch(
      "https://localhost:8000/api/folders",
      //"/api/folders",
      { credentials: "include" }
    )
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((json) => {
        setFolders(Array.isArray(json) ? json : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch folders error:", err);
        setLoading(false);
      });
  }, []);

  //Create a new folder
  async function createFolder() {
    if (!newFolderName.trim()) return;

    try {
      const res = await fetch(
        "hhttps://localhost:8000/api/folders",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newFolderName,
            color: "#a8d5a8"
          })
        }
      );

      if (res.status === 201) {
        const newFolder = await res.json();
        setFolders([...folders, newFolder]);
        setNewFolderName("");
        setShowNewFolderForm(false);
        console.log("201");
        console.log([...folders]);
      } else {
        console.error("Failed to create folder");
      }
    } catch (err) {
      console.error("Create folder error:", err);
    }
  }

  //Delete  folder
  async function deleteFolder(id, e) {
    e.stopPropagation();

    if (
      !window.confirm("Delete this folder and all its tasks?")
    )
      return;

    try {
      const res = await fetch(
        `https://localhost:8000/api/folders/api/folders/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (res.status === 204) {
        setFolders(folders.filter((f) => f._id !== id));
      } else {
        console.error("Failed to delete folder");
      }
    } catch (err) {
      console.error("Delete folder error:", err);
    }
  }

  function openFolder(folderId) {
    navigate(`/folders/${folderId}/tasks`);
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: 16 }}>
        <Navbar />
        <p>Loading folders...</p>
      </div>
    );
  }
  return (
    <div className="container" style={{ padding: 16 }}>
      <Navbar />

      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "300",
            margin: "0 0 5px 0"
          }}
        >
          adder
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#666",
            fontStyle: "italic"
          }}
        >
          a TO-DO lissst
        </p>
      </div>

      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
        to-do folders
      </h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px"
        }}
      >
        {folders.map((folder) => (
          <div
            key={folder._id}
            style={{
              position: "relative",
              backgroundColor: folder.color || "#a8d5a8",
              padding: "40px 20px 20px 20px",
              borderRadius: "8px",
              minWidth: "140px",
              cursor: "pointer",
              transition: "transform 0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            onClick={() => openFolder(folder._id)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform =
                "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform =
                "translateY(0)")
            }
          >
            <button
              onClick={(e) => deleteFolder(folder._id, e)}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                background: "rgba(0,0,0,0.2)",
                border: "none",
                borderRadius: "50%",
                width: "22px",
                height: "22px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold"
              }}
            >
              ×
            </button>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "10px"
                }}
              >
                📁
              </div>
              <div
                style={{
                  fontSize: "14px",
                  wordBreak: "break-word"
                }}
              >
                {folder.name}
              </div>
            </div>
          </div>
        ))}

        {!showNewFolderForm && (
          <div
            onClick={() => setShowNewFolderForm(true)}
            style={{
              backgroundColor: "#e0e0e0",
              padding: "40px 20px 20px 20px",
              borderRadius: "8px",
              minWidth: "140px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed #999",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#d0d0d0";
              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#e0e0e0";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "10px",
                color: "#666"
              }}
            >
              +
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>
              new folder
            </div>
          </div>
        )}
      </div>

      {showNewFolderForm && (
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "300px",
            marginBottom: "20px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "18px" }}>
            create new folder
          </h3>
          <input
            type="text"
            placeholder="folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && createFolder()
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
            autoFocus
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={createFolder}
              style={{
                padding: "10px 20px",
                backgroundColor: "#a8d5a8",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              + Create
            </button>
            <button
              onClick={() => {
                setShowNewFolderForm(false);
                setNewFolderName("");
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ffffffff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
