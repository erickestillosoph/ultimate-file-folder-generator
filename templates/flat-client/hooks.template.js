/**
 * Template for hook files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {string} component.hookType - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */

function toLowerCase(str) {
  return str.toLowerCase();
}

module.exports = function (component, index) {
  const { name, hookType, kebabName } = component;
  const lowerCase = toLowerCase(name);
  const pascalName = `${name}`;

  const getTypeHook = () => {
    let templateContent;
    switch (hookType) {
      case "query":
        templateContent = `import {
          useGet${pascalName}Subscription,
          getFragmentData,
          ${pascalName}FragmentDoc,
        } from '@shared/api';

        export const use${pascalName}Subscribe = () => {
          const {
            data,
            loading: isLoading${pascalName},
            error: error${pascalName},
          } = useGet${pascalName}Subscription();

          const ${pascalName} =
            getFragmentData(${pascalName}FragmentDoc, data?.${lowerCase}) ?? [];

            return {
              ${pascalName},
              isLoading${pascalName},
              error${pascalName},
            };
          };
        `;
        break;
      case "subscription":
        templateContent = `import {
        useGet${pascalName}Subscription,
        getFragmentData,
          ${pascalName}FragmentDoc,
        } from '@shared/api';

        export type ${pascalName}Type = {
          id: string;
          name: string;
        };


        export const use${pascalName}Subscribe = () => {
          const {
            data,
            loading: isLoading${pascalName},
            error: error${pascalName},
            } = useGet${pascalName}Subscription();

          const ${pascalName} =
            getFragmentData(${pascalName}FragmentDoc, data?.${lowerCase}) ?? [];

            return {
              ${pascalName},
              isLoading${pascalName},
              error${pascalName},
          };  
        };
        `;
        break;
      case "mutation":
        templateContent = `import {
          Fetch${pascalName}Document,
          ${pascalName}InsertInput,         
          useInsert${pascalName}Mutation,
        } from '@shared/api';                
        import { useCustomToast } from '@shared/ui';
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

                await inser${pascalName}Mutation({
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
        break;
      case "upsert":
        templateContent = `import {
            useUpsert${pascalName}Mutation  
            ${pascalName}UpdateColumn,
            ${pascalName}Constraint,
          } from '@shared/api';
          import { zodResolver } from '@hookform/resolvers/zod';
          import { useForm } from 'react-hook-form';
          import { Logger } from '@shared/lib';
          import { paths } from '@shared/paths';
          import { useCustomToast } from '@shared/ui';
          import { ${pascalName}Schema,  } from '../validations/${kebabName}.schema';  
          
      export const useUpsert${pascalName} = () => {     
        
        const { handleSubmit, register, reset, formState: { errors: formErrors, isValid }, } = useForm<${pascalName}Schema>({
                resolver: zodResolver(${pascalName}Schema),
            });

            const [upsert${pascalName}, { loading: submitLoading, error: submitError }] = useUpsert${pascalName}Mutation();
            const OnSubmit = async (form: ${pascalName}Schema) => {
                  await upsert${pascalName}({
                    variables: {
                      onConflict: {
                        constraint: ${pascalName}Constraint.${pascalName}UserIdKey,
                        updateColumns: [
                          ${pascalName}nUpdateColumn.${pascalName}                       
                        ],
                      },
                      object: {
                        ${pascalName}: form.${pascalName},
                        userId,
                      },
                    },
                  });
                  toast.success({ title: '車両情報を更新しました' });
                  if (submitError) {
                    toast.error({ title: '車両情報の更新に失敗しました' });
                  }
                };

              return { submitLoading, submitError,  handleSubmit, register, reset, formErrors, isValid };
            };
            `;
        break;
      default:
        templateContent = `// Default Query or Subscription or Upsert`;
        break;
    }
    return templateContent;
  };

  return getTypeHook();
};
