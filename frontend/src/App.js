import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(5);
  const [loading, setLoading] = useState(false);
  const totalPages = Math.ceil(total / limit);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/contacts?page=${page}&limit=${limit}`);
        setContacts(res.data.contacts);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchContacts();
  }, [page]);

  // Add contact
  const addContact = async (contact) => {
    try {
      const res = await axios.post("/contacts", contact);
      setContacts([res.data, ...contacts]);
      setTotal(total + 1);
    } catch (err) {
      alert("Failed to add contact");
    }
  };

  // Delete contact
  const deleteContact = async (id) => {
    try {
      await axios.delete(`/contacts/${id}`);
      setContacts(contacts.filter((c) => c.id !== id));
      setTotal(total - 1);
    } catch (err) {
      alert("Failed to delete contact");
    }
  };

  // ----------------- Components defined inside App.js -----------------

  const ContactForm = ({ onAdd }) => {
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [error, setError] = useState("");

    const validate = () => {
      const emailRegex = /^\S+@\S+\.\S+$/;
      const phoneRegex = /^\d{10}$/;
      if (!form.name) return "Name is required";
      if (!emailRegex.test(form.email)) return "Invalid email";
      if (!phoneRegex.test(form.phone)) return "Phone must be 10 digits";
      return "";
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const validationError = validate();
      if (validationError) return setError(validationError);

      onAdd(form);
      setForm({ name: "", email: "", phone: "" });
      setError("");
    };

    return (
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button type="submit">Add Contact</button>
        {error && <p className="error">{error}</p>}
      </form>
    );
  };

  const ContactList = ({ contacts, onDelete }) => {
    if (contacts.length === 0) return <p>No contacts found</p>;

    return (
      <ul className="contact-list">
        {contacts.map((c) => (
          <li key={c.id}>
            {c.name} | {c.email} | {c.phone}{" "}
            <button onClick={() => onDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    );
  };

  const Pagination = ({ page, totalPages, setPage }) => {
    return (
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  // ----------------- Render -----------------

  return (
    <div className="container">
      <h1>📒 Contact Book</h1>
      <ContactForm onAdd={addContact} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ContactList contacts={contacts} onDelete={deleteContact} />
      )}
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

export default App;
