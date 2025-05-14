// Centralized ApperClient utility for data operations

/**
 * Get an initialized ApperClient instance
 * @returns {Object} ApperClient instance
 */
export const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

/**
 * Format error message from Apper response
 * @param {Object} error - Error object
 * @returns {String} Formatted error message
 */
export const formatError = (error) => {
  if (!error) return "Unknown error occurred";
  
  if (error.message) return error.message;
  
  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    return error.errors.map(e => e.message || e).join(', ');
  }
  
  return "An error occurred during the operation";
};

/**
 * Default fetch parameters with common configuration
 * @returns {Object} Fetch parameters
 */
export const getDefaultFetchParams = () => {
  return {
    pagingInfo: {
      limit: 100,
      offset: 0
    }
  };
};

/**
 * Create basic where condition for field equality
 * @param {String} fieldName - Field name to filter on
 * @param {any} value - Value to match
 * @returns {Object} Where condition
 */
export const createWhereCondition = (fieldName, value) => {
  return {
    fieldName,
    operator: "ExactMatch",
    values: [value]
  };
};

/**
 * Create a parameter object for fetching a single record by ID
 * @param {Number|String} id - Record ID
 * @returns {Object} Fetch parameters with ID filter
 */
export const getFetchByIdParams = (id) => {
  return {
    ...getDefaultFetchParams(),
    where: [
      createWhereCondition("Id", id)
    ]
  };
};

/**
 * Format record for creation or update operation
 * @param {Object} data - Record data
 * @returns {Object} Formatted record
 */
export const formatRecord = (data) => {
  return {
    ...data,
    // Add any common field transformations here
  };
};

export default {
  getApperClient,
  formatError,
  getDefaultFetchParams,
  createWhereCondition,
  getFetchByIdParams,
  formatRecord
};