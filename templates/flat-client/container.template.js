/**
 * Default FSD template for pages
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase
 * @param {string} component.kebabName - Component name in kebab-case
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */

function toCamelCase(str) {
  return str
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

module.exports = function (component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  const pascalName = `${name}${suffix}`;
  const camelName = toCamelCase(name);
  return ` 
import { useFormState } from 'react-hook-form';

import { PageTemplate } from '@shared/ui';

import { ${pascalName} } from './${kebabName}';
import { use${pascalName}Form } from '../lib/use-${kebabName}-form';

export const ${pascalName}Container = () => {
  const { handleSubmit, control, onSubmit, loading,${camelName} } =
    use${pascalName}Form();

  const { isValid } = useFormState({ control });

  return (
    <PageTemplate>
      <${pascalName}
        initialValues={${camelName}}
        control={control}
        loading={loading}
        isValid={isValid}
        handleSubmit={handleSubmit(onSubmit)}
      />
    </PageTemplate>
  );
};

`;
};
