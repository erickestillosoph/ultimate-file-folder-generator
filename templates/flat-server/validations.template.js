/**
 * Template for validation files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */

function toCamelCase(str) {
  return str
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}
module.exports = function (component, index) {
  const { name } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  const camelCaseName = toCamelCase(name);
  const pascalName = `${name}`;
  return `
import { string, z } from 'zod';
 
const errorMessages = {
   invalid: 'Invalid Value',
   typeError: 'Type Error',
   invalidDataInput: 'Invalid Data Input',
   required: 'Required Field',
};
 
export const ${camelCaseName}Schema${suffix} = z.object({
   id: string().optional().nullable(),
   dataString: z.string().min(1, errorMessages.required),
   dataNumber: z.number().min(1, errorMessages.required),
   dataBoolean: z.boolean().min(1, errorMessages.required),
   dataDate: z.date().min(1, errorMessages.required),
   dataArray: z.array(z.string()).min(1, errorMessages.required),
});
 
export type ${pascalName}Schema${suffix} = z.infer<typeof ${camelCaseName}Schema${suffix}>;
`;
};
