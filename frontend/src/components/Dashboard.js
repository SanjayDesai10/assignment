import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { linksAPI } from '../services/api';
import LinkCard from './LinkCard';
import AddLinkForm from './AddLinkForm';
import { Plus, Search, Tag, LogOut } from 'lucide-react';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');

  const { user, logout } = useAuth();

  // Fetch links and tags
  const fetchData = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedTag) params.tag = selectedTag;

      const [linksResponse, tagsResponse] = await Promise.all([
        linksAPI.getLinks(params),
        linksAPI.getTags()
      ]);

      setLinks(linksResponse.data.links);
      setTags(tagsResponse.data.tags);
      setError('');
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, selectedTag]);

  const handleAddLink = async (linkData) => {
    try {
      await linksAPI.createLink(linkData);
      setShowAddForm(false);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error adding link:', error);
      throw error;
    }
  };

  const handleUpdateLink = async (id, linkData) => {
    try {
      await linksAPI.updateLink(id, linkData);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error updating link:', error);
      throw error;
    }
  };

  const handleDeleteLink = async (id) => {
    try {
      await linksAPI.deleteLink(id);
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Error deleting link:', error);
      throw error;
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">LinkKeeper</h1>
              <p className="text-gray-600">Welcome back, {user?.username}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Tag Filter */}
            <div className="md:w-64">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Tags</option>
                  {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedTag) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">
                {searchTerm || selectedTag
                  ? 'No bookmarks found matching your search.'
                  : 'No bookmarks yet. Add your first bookmark!'
                }
              </div>
            </div>
          ) : (
            links.map(link => (
              <LinkCard
                key={link.id}
                link={link}
                onUpdate={handleUpdateLink}
                onDelete={handleDeleteLink}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Link Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-96 shadow-lg rounded-md bg-white">
            <AddLinkForm
              onSubmit={handleAddLink}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
