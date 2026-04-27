import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  authors: '',
  year: '',
  url: '',
  status: 'to_read',
  tags: '',
  summary: '',
  notes: '',
  date_read: ''
};

export default function App() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [editingPaper, setEditingPaper] = useState(null);
  const [editFormData, setEditFormData] = useState(emptyForm);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editFormError, setEditFormError] = useState('');
  const [editFieldErrors, setEditFieldErrors] = useState({});

  useEffect(() => {
    loadPapers();
  }, []);

  async function loadPapers() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/papers');

      if (!response.ok) {
        throw new Error('Failed to fetch papers.');
      }

      const data = await response.json();
      setPapers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Could not load papers. Make sure the backend is running and /api/papers is available.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }

    setFormError('');
    setSuccessMessage('');
  }

  function handleShowAddForm() {
    setFormData(emptyForm);
    setFieldErrors({});
    setFormError('');
    setSuccessMessage('');
    setShowAddForm(true);
    setEditingPaper(null);
  }

  function handleCancelAdd() {
    setShowAddForm(false);
    setFormData(emptyForm);
    setFieldErrors({});
    setFormError('');
  }

  function handleSelectPaper(paper) {
    setEditingPaper(null);
    setSelectedPaper(paper);
  }

  function handleClosePaperCard() {
    setSelectedPaper(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSubmitting(true);
    setFormError('');
    setFieldErrors({});
    setSuccessMessage('');

    try {
      const payload = {
        ...formData,
        year: formData.year === '' ? null : Number(formData.year),
        date_read: formData.date_read || null
      };

      const response = await fetch('/api/papers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.errors) {
          setFieldErrors(data.errors);
        }
        throw new Error(data?.error || 'Failed to create paper.');
      }

      setPapers((prev) => [data, ...prev]);
      setSelectedPaper(data);
      setFormData(emptyForm);
      setShowAddForm(false);
      setSuccessMessage('Paper created successfully.');
    } catch (err) {
      setFormError(err.message || 'Failed to create paper.');
    } finally {
      setSubmitting(false);
    }
  }

  function renderValue(value) {
    if (value === null || value === undefined || value === '') {
      return <span className="text-muted">—</span>;
    }
    return value;
  }

  function handleEditClick(paper) {
    setSelectedPaper(null);
    setShowAddForm(false);
    setEditFormError('');
    setEditFieldErrors({});
    setEditingPaper(paper);
    setEditFormData({
      title: paper.title || '',
      authors: paper.authors || '',
      year: paper.year ?? '',
      url: paper.url || '',
      status: paper.status || 'to_read',
      tags: paper.tags || '',
      summary: paper.summary || '',
      notes: paper.notes || '',
      date_read: paper.date_read ? String(paper.date_read).slice(0, 10) : ''
    });
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (editFieldErrors[name]) {
      setEditFieldErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }

    setEditFormError('');
    setSuccessMessage('');
  }

  function handleCancelEdit() {
    setEditingPaper(null);
    setEditFormData(emptyForm);
    setEditFieldErrors({});
    setEditFormError('');
  }

  async function handleEditSubmit(event) {
    event.preventDefault();

    if (!editingPaper) return;

    setEditSubmitting(true);
    setEditFormError('');
    setEditFieldErrors({});
    setSuccessMessage('');

    try {
      const payload = {
        ...editFormData,
        year: editFormData.year === '' ? null : Number(editFormData.year),
        date_read: editFormData.date_read || null
      };

      const response = await fetch(`/api/papers/${editingPaper.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.errors) {
          setEditFieldErrors(data.errors);
        }
        throw new Error(data?.error || 'Failed to update paper.');
      }

      setPapers((prev) =>
        prev.map((paper) => (paper.id === data.id ? data : paper))
      );
      setSelectedPaper(data);
      setEditingPaper(null);
      setEditFormData(emptyForm);
      setSuccessMessage('Paper updated successfully.');
    } catch (err) {
      setEditFormError(err.message || 'Failed to update paper.');
    } finally {
      setEditSubmitting(false);
    }
  }

  return (
    <main className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="mb-1">Papers</h1>
              <p className="text-muted mb-0">
                Manage your papers collection at Kenyon College. James Skon!
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleShowAddForm}
            >
              Add Paper
            </button>
          </div>

          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {loading && (
            <div className="alert alert-info" role="status">
              Loading papers...
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {showAddForm && (
            <div className="card shadow-sm mb-4">
              <div className="card-header">
                <h2 className="h5 mb-0">Add New Paper</h2>
              </div>
              <div className="card-body">
                {formError && (
                  <div className="alert alert-danger" role="alert">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <input
                        id="title"
                        name="title"
                        type="text"
                        className={`form-control ${fieldErrors.title ? 'is-invalid' : ''}`}
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.title && (
                        <div className="invalid-feedback">{fieldErrors.title}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="authors" className="form-label">
                        Authors
                      </label>
                      <input
                        id="authors"
                        name="authors"
                        type="text"
                        className="form-control"
                        value={formData.authors}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="year" className="form-label">
                        Year
                      </label>
                      <input
                        id="year"
                        name="year"
                        type="number"
                        className={`form-control ${fieldErrors.year ? 'is-invalid' : ''}`}
                        value={formData.year}
                        onChange={handleChange}
                      />
                      {fieldErrors.year && (
                        <div className="invalid-feedback">{fieldErrors.year}</div>
                      )}
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className={`form-select ${fieldErrors.status ? 'is-invalid' : ''}`}
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="to_read">to_read</option>
                        <option value="reading">reading</option>
                        <option value="read">read</option>
                      </select>
                      {fieldErrors.status && (
                        <div className="invalid-feedback">{fieldErrors.status}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label htmlFor="url" className="form-label">
                        URL
                      </label>
                      <input
                        id="url"
                        name="url"
                        type="url"
                        className="form-control"
                        value={formData.url}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="tags" className="form-label">
                        Tags
                      </label>
                      <input
                        id="tags"
                        name="tags"
                        type="text"
                        className="form-control"
                        value={formData.tags}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="summary" className="form-label">
                        Summary
                      </label>
                      <textarea
                        id="summary"
                        name="summary"
                        className="form-control"
                        rows="3"
                        value={formData.summary}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="notes" className="form-label">
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        className="form-control"
                        rows="3"
                        value={formData.notes}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="date_read" className="form-label">
                        Date Read
                      </label>
                      <input
                        id="date_read"
                        name="date_read"
                        type="date"
                        className="form-control"
                        value={formData.date_read}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Saving...' : 'Save Paper'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancelAdd}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {editingPaper ? (
            <div className="card shadow-sm mb-4 border-warning">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h2 className="h5 mb-0">Edit Paper</h2>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleCancelEdit}
                  disabled={editSubmitting}
                >
                  Cancel
                </button>
              </div>
              <div className="card-body">
                {editFormError && (
                  <div className="alert alert-danger" role="alert">
                    {editFormError}
                  </div>
                )}

                <form onSubmit={handleEditSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label htmlFor="edit-title" className="form-label">
                        Title
                      </label>
                      <input
                        id="edit-title"
                        name="title"
                        type="text"
                        className={`form-control ${editFieldErrors.title ? 'is-invalid' : ''}`}
                        value={editFormData.title}
                        onChange={handleEditChange}
                        required
                      />
                      {editFieldErrors.title && (
                        <div className="invalid-feedback">{editFieldErrors.title}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="edit-authors" className="form-label">
                        Authors
                      </label>
                      <input
                        id="edit-authors"
                        name="authors"
                        type="text"
                        className="form-control"
                        value={editFormData.authors}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="edit-year" className="form-label">
                        Year
                      </label>
                      <input
                        id="edit-year"
                        name="year"
                        type="number"
                        className={`form-control ${editFieldErrors.year ? 'is-invalid' : ''}`}
                        value={editFormData.year}
                        onChange={handleEditChange}
                      />
                      {editFieldErrors.year && (
                        <div className="invalid-feedback">{editFieldErrors.year}</div>
                      )}
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="edit-status" className="form-label">
                        Status
                      </label>
                      <select
                        id="edit-status"
                        name="status"
                        className={`form-select ${editFieldErrors.status ? 'is-invalid' : ''}`}
                        value={editFormData.status}
                        onChange={handleEditChange}
                      >
                        <option value="to_read">to_read</option>
                        <option value="reading">reading</option>
                        <option value="read">read</option>
                      </select>
                      {editFieldErrors.status && (
                        <div className="invalid-feedback">{editFieldErrors.status}</div>
                      )}
                    </div>

                    <div className="col-12">
                      <label htmlFor="edit-url" className="form-label">
                        URL
                      </label>
                      <input
                        id="edit-url"
                        name="url"
                        type="url"
                        className="form-control"
                        value={editFormData.url}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="edit-tags" className="form-label">
                        Tags
                      </label>
                      <input
                        id="edit-tags"
                        name="tags"
                        type="text"
                        className="form-control"
                        value={editFormData.tags}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="edit-summary" className="form-label">
                        Summary
                      </label>
                      <textarea
                        id="edit-summary"
                        name="summary"
                        className="form-control"
                        rows="3"
                        value={editFormData.summary}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-12">
                      <label htmlFor="edit-notes" className="form-label">
                        Notes
                      </label>
                      <textarea
                        id="edit-notes"
                        name="notes"
                        className="form-control"
                        rows="3"
                        value={editFormData.notes}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="edit-date-read" className="form-label">
                        Date Read
                      </label>
                      <input
                        id="edit-date-read"
                        name="date_read"
                        type="date"
                        className="form-control"
                        value={editFormData.date_read}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={editSubmitting}
                    >
                      {editSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleCancelEdit}
                      disabled={editSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : selectedPaper ? (
            <div className="card shadow-sm mb-4 border-primary">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h2 className="h5 mb-0">Paper Details</h2>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleClosePaperCard}
                >
                  Close
                </button>
              </div>
              <div className="card-body">
                <h3 className="h4 mb-3">{renderValue(selectedPaper.title)}</h3>

                <div className="row g-3">
                  <div className="col-md-6">
                    <strong>Authors:</strong>
                    <div>{renderValue(selectedPaper.authors)}</div>
                  </div>

                  <div className="col-md-3">
                    <strong>Year:</strong>
                    <div>{renderValue(selectedPaper.year)}</div>
                  </div>

                  <div className="col-md-3">
                    <strong>Status:</strong>
                    <div>
                      {selectedPaper.status ? (
                        <span className="badge text-bg-secondary">{selectedPaper.status}</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <strong>URL:</strong>
                    <div>
                      {selectedPaper.url ? (
                        <a href={selectedPaper.url} target="_blank" rel="noreferrer">
                          {selectedPaper.url}
                        </a>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </div>
                  </div>

                  <div className="col-12">
                    <strong>Tags:</strong>
                    <div>{renderValue(selectedPaper.tags)}</div>
                  </div>

                  <div className="col-12">
                    <strong>Summary:</strong>
                    <div className="mt-1">{renderValue(selectedPaper.summary)}</div>
                  </div>

                  <div className="col-12">
                    <strong>Notes:</strong>
                    <div className="mt-1">{renderValue(selectedPaper.notes)}</div>
                  </div>

                  <div className="col-md-4">
                    <strong>Date Read:</strong>
                    <div>{renderValue(selectedPaper.date_read)}</div>
                  </div>

                  <div className="col-md-4">
                    <strong>Date Added:</strong>
                    <div>{renderValue(selectedPaper.date_added)}</div>
                  </div>

                  <div className="col-md-4">
                    <strong>ID:</strong>
                    <div>{renderValue(selectedPaper.id)}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {!loading && !error && (
            <div className="card shadow-sm">
              <div className="card-body">
                {papers.length === 0 ? (
                  <p className="mb-0 text-muted">No papers found.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Title</th>
                          <th>Authors</th>
                          <th>Year</th>
                          <th>Status</th>
                          <th style={{ width: '160px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {papers.map((paper) => (
                          <tr key={paper.id}>
                            <td>
                              <button
                                type="button"
                                className="btn btn-link p-0 text-start text-decoration-none"
                                onClick={() => handleSelectPaper(paper)}
                              >
                                {paper.title}
                              </button>
                            </td>
                            <td>{paper.authors || '—'}</td>
                            <td>{paper.year || '—'}</td>
                            <td>
                              <span className="badge text-bg-secondary">
                                {paper.status || '—'}
                              </span>
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary"
                                  onClick={() => handleEditClick(paper)}
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  disabled
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}