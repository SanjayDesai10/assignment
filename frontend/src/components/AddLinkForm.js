import React, { useState, useEffect } from 'react';
import { X, Plus, Tag as TagIcon } from 'lucide-react';

const AddLinkForm = ({ initialData = {}, onSubmit, onCancel, submitButtonText = "Add Link" }) => {
  const [formData, setFormData] = useState({
    url: initialData.url || '',
    title: initialData.title || '',
    description: initialData.description || '',
    tags: initialData.tags || []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Basic validation
      if (!formData.url || !formData.title) {
        throw new Error('URL and title are required');
      }

      // URL validation
      try {
        new URL(formData.url);
      } catch {
        throw new Error('Please enter a valid URL');
      }

      await onSubmit({
        url: formData.url.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: formData.tags
      });
    } catch (error) {
      setError(error.message || 'Failed to save link');
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch title from URL (optional enhancement)
  const fetchTitleFromUrl = async (url) => {
    if (!url || !url.startsWith('http')) return;

    try {
      // This is a simple approach - in a real app you might want to use a service
      // For now, we'll just suggest the domain as title if no title is set
      const urlObj = new URL(url);
      if (!formData.title) {
        setFormData(prev => ({
          ...prev,
          title: urlObj.hostname.replace('www.', '')
        }));
      }
    } catch (error) {
      console.error('Error fetching title:', error);
    }
  };

  useEffect(() => {
    if (formData.url && !initialData.title) {
      const timeoutId = setTimeout(() => fetchTitleFromUrl(formData.url), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.url]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* URL Field */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          URL *
        </label>
        <input
          type="url"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="https://example.com"
        />
      </div>

      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Link title"
        />
      </div>

      {/* Description Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Optional description..."
        />
      </div>

      {/* Tags Field */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <div className="flex space-x-2 mb-2">
          <input
            type="text"
            id="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagInputKeyPress}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Add a tag..."
          />
          <button
            type="button"
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Tags Display */}
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default AddLinkForm;
