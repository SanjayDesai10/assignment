import Link from '../models/Link.js';

// Get all links for authenticated user with optional filtering
export const getLinks = async (req, res) => {
  try {
    const { tag, search } = req.query;
    const userId = req.user._id;

    let query = { userId };

    // Add tag filter if provided
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { url: { $regex: search, $options: 'i' } }
      ];
    }

    // If both tag and search are provided, combine them
    if (tag && search) {
      query = {
        userId,
        tags: { $in: [tag.toLowerCase()] },
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { url: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const links = await Link.find(query)
      .sort({ createdAt: -1 })
      .select('_id url title description tags createdAt');

    // Transform the response to match the API design
    const transformedLinks = links.map(link => ({
      id: link._id,
      url: link.url,
      title: link.title,
      description: link.description,
      tags: link.tags,
      createdAt: link.createdAt
    }));

    res.status(200).json({
      success: true,
      links: transformedLinks
    });
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create a new link
export const createLink = async (req, res) => {
  try {
    const { url, title, description, tags } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!url || !title) {
      return res.status(400).json({
        success: false,
        message: 'URL and title are required'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid URL'
      });
    }

    // Process tags (convert to lowercase and filter empty)
    const processedTags = tags
      ? tags.filter(tag => tag.trim()).map(tag => tag.trim().toLowerCase())
      : [];

    const link = new Link({
      userId,
      url,
      title: title.trim(),
      description: description ? description.trim() : '',
      tags: processedTags
    });

    await link.save();

    res.status(201).json({
      success: true,
      message: 'Link created successfully',
      link: {
        id: link._id,
        url: link.url,
        title: link.title,
        description: link.description,
        tags: link.tags,
        createdAt: link.createdAt
      }
    });
  } catch (error) {
    console.error('Create link error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This URL already exists in your bookmarks'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update a link
export const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, title, description, tags } = req.body;
    const userId = req.user._id;

    // Find the link and ensure it belongs to the user
    const link = await Link.findOne({ _id: id, userId });
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    // Validate URL if provided
    if (url) {
      try {
        new URL(url);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid URL'
        });
      }
    }

    // Process tags if provided
    const processedTags = tags !== undefined
      ? tags.filter(tag => tag.trim()).map(tag => tag.trim().toLowerCase())
      : link.tags;

    // Update fields
    const updateData = {};
    if (url) updateData.url = url;
    if (title) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : '';
    if (tags !== undefined) updateData.tags = processedTags;

    const updatedLink = await Link.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Link updated successfully',
      link: {
        id: updatedLink._id,
        url: updatedLink.url,
        title: updatedLink.title,
        description: updatedLink.description,
        tags: updatedLink.tags,
        createdAt: updatedLink.createdAt
      }
    });
  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete a link
export const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find and delete the link, ensuring it belongs to the user
    const deletedLink = await Link.findOneAndDelete({ _id: id, userId });

    if (!deletedLink) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Link deleted successfully'
    });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get unique tags for the authenticated user
export const getTags = async (req, res) => {
  try {
    const userId = req.user._id;

    const tags = await Link.distinct('tags', { userId });

    res.status(200).json({
      success: true,
      tags: tags.sort()
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
