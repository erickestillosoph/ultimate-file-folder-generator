/**
 * Bullet Template for hook files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase
 * @param {string} component.kebabName - Component name in kebab-case
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function(component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  
  return `import { createSignal, createEffect } from '@bullet-js/core';

/**
 * Hook for ${name} functionality using Bullet pattern
 */
export const use${name}${suffix} = () => {
  const [data, setData] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(null);

  createEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch data logic here
        setData(/* result */);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  });

  return { 
    data: data(),
    loading: loading(),
    error: error()
  };
};

export default use${name}${suffix};
`;
};