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
  // const schema = `${kebabName}-validation.schema`;
  // const mutation = `use-${kebabName}-mutation.ts`;
  const pascalName = name;
  // const pascalSchema = `${name}Schema`;
  // const camelSchema = toCamelCase(`${name}Schema`);
  return `import {
          Fetch${pascalName}Document,
          ${pascalName}InsertInput,         
          useInsert${pascalName}Mutation,
        } from '@shared/api';                
        import { useCustomToast } from '@shared/ui';
        import { Logger } from '@shared/lib';
        import { useCallback } from 'react';
        import { ${pascalName}Schema } from '../validations/${kebabName}.schema';  
        
    export const use${pascalName}Mutation = ({
            reset,
            userId,
          }: Props) => {            

            const [insert${pascalName}Mutation, { loading }] =
              useInsert${pascalName}Mutation();
            const toast = useCustomToast();

            const insert${pascalName} = useCallback(
              async (input: ${pascalName}InsertInput) => {
                if (!userId) {
                  toast.error({
                    title: 'エラー',
                    description: 'ユーザーIDが無効です。',
                  });
                  Logger.error('userId is null or undefined.');
                  return;
                }

                await insert${pascalName}Mutation({
                  variables: {
                    object: {
                      prefecture: input.prefecture,
                      city: input.city,
                      startTime: input.startTime,
                      endTime: input.endTime,
                    },
                  },
                  onCompleted: () => {
                    toast.success({
                      title: '通知設定の保存に成功しました。',
                    });                    
                  },
                  onError: (error) => {
                    toast.error({
                      title: '通知設定の保存に失敗しました。',
                    });
                    Logger.error(error);
                  },
                  refetchQueries: [
                    {
                      query: Fetch${pascalName}Document,
                      variables: {
                        where: {
                          userId: { _eq: userId },
                        },
                      },
                    },
                  ],
                });
              },
              // eslint-disable-next-line react-hooks/exhaustive-deps
              [insert${pascalName}Mutation, reset],
            );

            return { insert${pascalName}, loading };
          };
          `;
};
