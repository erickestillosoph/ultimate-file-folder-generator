/**
 * Template for mutation hook files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */

function toConstantCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toUpperCase();
}
module.exports = function (component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  const pascalSchema = `${name}Schema`;
  const API_ENDPOINT = toConstantCase(kebabName);
  return `
   'use client'
   
   import axios from 'axios';
   import { useMutation } from '@tanstack/react-query';
   import { ${API_ENDPOINT} } from '@/config';

type ${pascalSchema}Type = {
  dataString: string;
  dataNumber: number;
  errorStatus: boolean;
  loadingStatus: boolean;
  dataObject: object;
  dataArray: Array<T>;
  dataStrict: 'strict1' | 'strict2' | 'strict3';
}


   export const use${pascalSchema}Mutation${suffix} = ({dataString, dataNumber, errorStatus, loadingStatus, dataObject, dataArray, dataNull, dataStrict}: ${pascalSchema}Type) => {
     
    const { mutateAsync, mutate, isError, data, isSuccess, status, isPending, error, reset } = useMutation({
        mutationFn: (data: ${pascalSchema}Type) => {
         return axios.post(${API_ENDPOINT}.POST, data);
      },
  });
  
    return { mutateAsync, mutate, isError, data, isSuccess, status, isPending, error, reset };
  };
`;
};
