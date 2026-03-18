import { useState } from 'react';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';

function AddLesson({ courseId, onLessonAdded, onCancel }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    order: 0
  });
  const [loading, setLoading] = useState(false);

  const { title, content, videoUrl, order } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/lessons/${courseId}`, formData);
      onLessonAdded(res.data);
      setFormData({ title: "", content: "", videoUrl: "", order: 0 });
      showToast("Lesson added successfully!", "success");
    } catch (err) {
      console.error("Error adding lesson", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6 border-l-4 border-l-green-500">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Add New Lesson</h3>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="e.g., Introduction to Hooks"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (Optional)</label>
            <input
              type="text"
              name="videoUrl"
              value={videoUrl}
              onChange={onChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="YouTube or Vimeo link"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content / Instructions</label>
          <textarea
            name="content"
            value={content}
            onChange={onChange}
            rows="4"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Provide context or instructions for this lesson..."
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order (Sequence Number)</label>
          <input
            type="number"
            name="order"
            value={order}
            onChange={onChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="0"
          />
        </div>
        
        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors disabled:bg-green-300"
          >
            {loading ? 'Adding...' : 'Add Lesson'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddLesson;
