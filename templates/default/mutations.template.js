/**
 * Template for mutation hook files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function(component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  
  return `import { useMutation } from '@tanstack/react-query';

/**
 * Mutation hook for ${name} functionality
 */
export const use${name}Mutation${suffix} = () => {
  return useMutation({
    mutationFn: async (data) => {
      // Implementation of the mutation
      // e.g., fetch('/api/endpoint', { method: 'POST', body: JSON.stringify(data) })
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, data });
        }, 1000);
      });
    },
    onSuccess: (data) => {
      // Handle successful mutation
      console.log('Mutation successful:', data);
    },
    onError: (error) => {
      // Handle mutation error
      console.error('Mutation error:', error);
    },
  });
};

export default use${name}Mutation${suffix};
`;
};