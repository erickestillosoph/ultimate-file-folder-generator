/**
 * Template for query hook files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function(component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  
  return `import { useQuery } from '@tanstack/react-query';

/**
 * Query hook for ${name} functionality
 */
export const use${name}Query${suffix} = (params) => {
  return useQuery({
    queryKey: ['${kebabName}', params],
    queryFn: async () => {
      // Implementation of the query
      // e.g., const response = await fetch('/api/endpoint');
      //       return response.json();
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 1,
            name: '${name} Data',
            // Add more mock data as needed
          });
        }, 1000);
      });
    },
  });
};

export default use${name}Query${suffix};
`;
};