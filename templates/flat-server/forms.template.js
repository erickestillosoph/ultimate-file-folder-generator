/**
 * Template for form hook files
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
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  const schema = `${kebabName}-validation.schema`;
  const mutation = `use-${kebabName}-mutation.ts`;
  const pascalSchema = `${name}Schema`;
  const camelSchema = toCamelCase(`${name}Schema`);
  return `
'use client'

import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { use${name}Mutation } from './${mutation}';
import { ${camelSchema}, ${pascalSchema} } from './validations/${schema}';


type ${pascalSchema}Type = {
  dataString: string;
  dataNumber: number;
  errorStatus: boolean;
  loadingStatus: boolean;
  dataObject: object;
  dataArray: Array<T>;
  dataStrict: 'strict1' | 'strict2' | 'strict3';
}

export const use${name}Form${suffix} = ({dataString, dataNumber, errorStatus, loadingStatus, dataObject, dataArray, dataStrict }: ${pascalSchema}Type) => {
  const [ isLoading, setIsLoading] = useState(false);
  const { mutate } = use${name}Mutation();
  const formData = useForm<${pascalSchema}>({
        resolver: zodResolver(${camelSchema}), 
   });
    const onSubmit = async (data: ${pascalSchema}) => {
    setIsLoading(true);
    try {
      await mutate(data, {
       onSuccess: () => {
          console.log('Created successfully');
       },
       onError: error => {
          console.error('Error creating:', error);
       },
       onSettled: () => {
          setIsLoading(false);
       },
     });
   } catch (error) {
        console.error('Submission error:', error);
        setIsLoading(false);
  }
  return {
    formData,
    isLoading,
    onSubmit
  };
};
};
`;
};
