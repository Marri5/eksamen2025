/**
 * Fox Service
 * Handles fetching random fox images from randomfox.ca API
 */

const axios = require('axios');
const config = require('../config');

class FoxService {
  constructor() {
    this.baseUrl = config.foxApi.baseUrl;
    this.timeout = config.foxApi.timeout;
    
    // Create axios instance with configuration
    this.api = axios.create({
      timeout: this.timeout,
      headers: {
        'User-Agent': 'Fox-Voting-System/1.0'
      }
    });
  }

  /**
   * Fetch a random fox image
   * @returns {Promise<Object>} Fox image data with id and url
   */
  async getRandomFox() {
    try {
      const response = await this.api.get('https://randomfox.ca/floof/');
      
      if (response.data && response.data.image) {
        const imageUrl = response.data.image;
        const foxId = this.extractFoxId(imageUrl);
        
        return {
          foxId: foxId,
          imageUrl: imageUrl,
          success: true
        };
      } else {
        throw new Error('Invalid response format from fox API');
      }
    } catch (error) {
      console.error('Error fetching random fox:', error.message);
      
      // Return fallback fox image
      return this.getFallbackFox();
    }
  }

  /**
   * Fetch multiple random fox images
   * @param {number} count Number of foxes to fetch
   * @returns {Promise<Array>} Array of fox image data
   */
  async getMultipleFoxes(count = 2) {
    const foxes = [];
    const promises = [];

    // Create promises for concurrent requests
    for (let i = 0; i < count; i++) {
      promises.push(this.getRandomFox());
    }

    try {
      const results = await Promise.all(promises);
      
      // Filter out failed requests and ensure unique foxes
      const uniqueFoxes = new Map();
      
      results.forEach(fox => {
        if (fox.success && !uniqueFoxes.has(fox.foxId)) {
          uniqueFoxes.set(fox.foxId, fox);
        }
      });

      // Convert map to array
      for (let fox of uniqueFoxes.values()) {
        foxes.push(fox);
      }

      // If we don't have enough unique foxes, fetch more
      if (foxes.length < count) {
        const additionalNeeded = count - foxes.length;
        const additionalFoxes = await this.getMultipleFoxes(additionalNeeded);
        
        additionalFoxes.forEach(fox => {
          if (!uniqueFoxes.has(fox.foxId)) {
            foxes.push(fox);
          }
        });
      }

      return foxes.slice(0, count);
    } catch (error) {
      console.error('Error fetching multiple foxes:', error.message);
      
      // Return fallback foxes
      return Array(count).fill(null).map((_, index) => 
        this.getFallbackFox(index)
      );
    }
  }

  /**
   * Extract fox ID from image URL
   * @param {string} imageUrl Full image URL
   * @returns {string} Fox ID
   */
  extractFoxId(imageUrl) {
    try {
      const parts = imageUrl.split('/');
      const filename = parts[parts.length - 1];
      return filename.split('.')[0]; // Remove file extension
    } catch (error) {
      console.error('Error extracting fox ID:', error.message);
      return `fox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  /**
   * Get fallback fox image when API fails
   * @param {number} index Optional index for generating unique fallback
   * @returns {Object} Fallback fox data
   */
  getFallbackFox(index = 0) {
    const fallbackId = `fallback_fox_${index}_${Date.now()}`;
    
    return {
      foxId: fallbackId,
      imageUrl: `${this.baseUrl}fallback.jpg`, // Fallback image
      success: false,
      isFallback: true
    };
  }

  /**
   * Validate if image URL is from allowed domain
   * @param {string} imageUrl Image URL to validate
   * @returns {boolean} Whether URL is valid
   */
  isValidFoxImage(imageUrl) {
    try {
      const url = new URL(imageUrl);
      return url.hostname === 'randomfox.ca' || url.hostname.endsWith('.randomfox.ca');
    } catch (error) {
      return false;
    }
  }

  /**
   * Get health status of fox API
   * @returns {Promise<Object>} API health status
   */
  async getApiHealth() {
    try {
      const start = Date.now();
      await this.api.get('https://randomfox.ca/floof/');
      const responseTime = Date.now() - start;
      
      return {
        status: 'healthy',
        responseTime: responseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = new FoxService(); 