import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "./Logo";
import Image from "./Image";
import Footer from "./Footer";

function Notes() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/notes/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3001/notes/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Note uploaded successfully!");
      fetchNotes();
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row">
    <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
      <Logo />
      <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
    {/* <div className="inset-0 h-screen w-screen flex flex-col font-mono"> */}
      <h2 className="text-xl font-bold text-center mt-5">Upload Notes</h2>
      <form className="p-4" onSubmit={handleUpload}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full mt-2"
        />
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          onChange={handleFileChange}
          className="border p-2 w-full mt-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full mt-2">
          Upload
        </button>
      </form>

      <h2 className="text-xl font-bold text-center mt-5">My Notes</h2>
      <div className="p-4">
        {notes.map((note) => (
          <div key={note.id} className="border p-2 mb-2">
            <h3 className="font-bold">{note.title}</h3>
            <p>{note.description}</p>
            <a
              href={`http://localhost:3001${note.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Download File
            </a>
          </div>
        ))}
      </div>
    </div>
    {/* </div> */}
    <Footer/>
    </div>
    <Image/>
    </div>
  );
}

export default Notes;
