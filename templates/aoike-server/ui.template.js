/**
 * FSD Template for UI component files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function (component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";

  return `import { memo } from 'react';
import styles from './${kebabName}.module.css';

/**
 * UI component for ${name} following Feature-Sliced Design
 * Located in the features/${kebabName}/ui layer
 */
export const ${name}UI${suffix} = memo(({ data, isLoading, error }) => {
  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error.message}</div>;
  
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>${name} Component</h2>
      <div className={styles.content}>
        {data && (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
});

${name}UI${suffix}.displayName = '${name}UI${suffix}';

export default ${name}UI${suffix};
`;
};
