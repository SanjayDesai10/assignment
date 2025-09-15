import React, { useState } from 'react';
import { Edit, Trash2, ExternalLink, Tag as TagIcon } from 'lucide-react';
import AddLinkForm from './AddLinkForm';

const LinkCard = ({ link, onUpdate, onDelete }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = async (updatedData) => {
    try {
      await onUpdate(link.id, updatedData);
      setShowEditForm(false);
    } catch (error) {
      console.error('Error updating link:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(link.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFaviconUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        {/* Header with favicon and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {getFaviconUrl(link.url) && (
              <img
                src={getFaviconUrl(link.url)}
                alt="favicon"
                className="w-6 h-6 flex-shrink-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {link.title}
              </h3>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center mt-1"
              >
                <span className="truncate">{link.url}</span>
                <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setShowEditForm(true)}
              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors duration-200"
              title="Edit link"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
              title="Delete link"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {link.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {link.description}
          </p>
        )}

        {/* Tags */}
        {link.tags && link.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {link.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
              >
                <TagIcon className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer with date */}
        <div className="text-xs text-gray-500 border-t border-gray-100 pt-3">
          Added {formatDate(link.createdAt)}
        </div>
      </div>

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-96 shadow-lg rounded-md bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Link</h3>
            </div>
            <AddLinkForm
              initialData={link}
              onSubmit={handleEdit}
              onCancel={() => setShowEditForm(false)}
              submitButtonText="Update Link"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-96 shadow-lg rounded-md bg-white">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Link
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{link.title}"? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LinkCard;
