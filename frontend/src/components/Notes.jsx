import React, { useState, useEffect } from "react";
import axios from "axios";
import Logo from "./Logo";
import Image from "./Image";
import Footer from "./Footer";
import { MdOutlineDelete } from "react-icons/md";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    if (!token) {
      setMessage("User not authenticated");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3001/notes/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes(res.data); 
    } catch (err) {
      console.error("Error fetching notes:", err);
      setMessage("Not enough data available");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setMessage("Please provide a title and a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      await axios.post("http://localhost:3001/notes/upload", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setMessage("File uploaded successfully");
      setTitle("");
      setDescription("");
      setFile(null);
      fetchNotes(); 
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    try {
        const token = localStorage.getItem("token");
        // console.log(`Sending DELETE request for note ID: ${id}`); // Debugging log
        await axios.delete(`http://localhost:3001/notes/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
        console.error("Error deleting note:", error);
    }
};

  return (
    <div className="inset-0 h-screen w-screen flex flex-col md:flex-row font-mono">
      <div className="w-full md:w-[60%] flex flex-col items-center bg-white shadow-md h-full">
        <Logo />
        <div className="mt-5 flex-1 overflow-y-auto w-full flex flex-col items-center p-4">
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

          {message && <p className="text-center text-red-500">{message}</p>}

          <h2 className="text-xl font-bold text-center mt-5">My Notes</h2>
          <div className="p-4 w-[500px] m-5">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note.id} className="border rounded-md p-2 mb-2 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{note.title}</h3>
                    <p>{note.description}</p>
                    <a
                      href={`http://localhost:3001/uploads/${note.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      Download File
                    </a>
                  </div>
                  <button onClick={() => handleDelete(note.id)} className="text-red-500 hover:text-red-700">
                    <MdOutlineDelete size="24px" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No notes available</p>
            )}
          </div>
        </div>
        <Footer />
      </div>
      <Image />
    </div>
  );
}

export default Notes;
