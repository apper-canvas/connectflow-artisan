import { getApperClient, getDefaultFetchParams, createWhereCondition, formatError } from '../utils/apperClient';

const TABLE_NAME = 'calendar_event';

/**
 * Fetch all calendar events with optional filtering
 * @param {Object} filters - Optional filters
 * @returns {Promise<Array>} List of calendar events
 */
export const fetchCalendarEvents = async (filters = {}) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      ...getDefaultFetchParams(),
      orderBy: [
        {
          field: "date",
          direction: "ASC"
        }
      ]
    };
    
    // Build where conditions based on filters
    if (Object.keys(filters).length > 0) {
      params.where = Object.entries(filters).map(([key, value]) => 
        createWhereCondition(key, value)
      );
    }
    
    // If no date filter provided, default to events from today onwards
    if (!filters.date && !params.where) {
      params.where = [
        {
          fieldName: "date",
          operator: "GreaterThanEqual",
          values: [new Date().toISOString()]
        }
      ];
    }
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Fetch a single calendar event by ID
 * @param {Number} eventId - Event ID
 * @returns {Promise<Object>} Calendar event
 */
export const fetchEventById = async (eventId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      ...getDefaultFetchParams(),
      where: [
        createWhereCondition("Id", eventId)
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (response && response.data && response.data.length > 0) {
      return response.data[0];
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Create a new calendar event
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event
 */
export const createCalendarEvent = async (eventData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        title: eventData.title,
        description: eventData.description || '',
        date: eventData.date,
        duration: eventData.duration || 30,
        type: eventData.type || 'meeting'
      }]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to create calendar event");
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Update an existing calendar event
 * @param {Number} eventId - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} Updated event
 */
export const updateCalendarEvent = async (eventId, eventData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{
        Id: eventId,
        ...eventData
      }]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      return response.results[0].data;
    }
    
    throw new Error("Failed to update calendar event");
  } catch (error) {
    console.error("Error updating calendar event:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Delete a calendar event
 * @param {Number} eventId - Event ID
 * @returns {Promise<Boolean>} Success status
 */
export const deleteCalendarEvent = async (eventId) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [eventId]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    return response && response.success;
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    throw new Error(formatError(error));
  }
};

/**
 * Fetch events for a specific date range
 * @param {String} startDate - ISO date string for range start
 * @param {String} endDate - ISO date string for range end
 * @returns {Promise<Array>} List of events in the date range
 */
export const fetchEventsByDateRange = async (startDate, endDate) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      ...getDefaultFetchParams(),
      where: [
        {
          fieldName: "date",
          operator: "GreaterThanEqual",
          values: [startDate]
        },
        {
          fieldName: "date",
          operator: "LessThanEqual",
          values: [endDate]
        }
      ],
      orderBy: [
        {
          field: "date",
          direction: "ASC"
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching events by date range:", error);
    throw new Error(formatError(error));
  }
};

export default {
  fetchCalendarEvents,
  fetchEventById,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  fetchEventsByDateRange
};