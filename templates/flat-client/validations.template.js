/**
 * Template for validation files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {string} component.validationType - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */

function toCamelCase(str) {
  return str
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}
module.exports = function (component, index) {
  const { name, validationType } = component;
  const pascalName = `${name}`;
  const suffix = index > 0 ? `${index + 1}` : "";
  const camelCaseName = toCamelCase(name);

  const getTypeValidation = () => {
    let templateContent;
    switch (validationType) {
      case "simple":
        templateContent = `
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
        break;
      case "time":
        templateContent = `
        import { z } from 'zod';

        import { DateFormatPatterns } from '@shared/config';
        import { timeDateConverter } from '@shared/lib';

        const errorMessages = {
          invalid: '無効な値です',
          typeError: '分類を選択してください',
          invalidTimeError: '時間と分のみを入力してください',
          reasonError: '理由を入力してください',
          required: 'この項目は必須です',
        };

        // TODO:Object形で選択肢とInputをセットしてValidationを行う
        export const ${pascalName}Schema = z
          .object({
            // NOTE: InputFieldコンポーネントでEnumの値をname属性として使用しているため、ここではEnumの値をキーにしている。
            message: z.string().min(1, '都道府県は必須です。'),
            city: z.string().min(1, '市区郡は必須です。'),
            startTime: z.string().min(1, errorMessages.required),
            endTime: z.string().min(1, errorMessages.required),
            enable: z.boolean().optional(),
          })
          .refine(
            (val) => {
              const startTime = timeDateConverter({
                value: val.startTime,
                formatInput: DateFormatPatterns.Iso8601Date,
                formatOutput: DateFormatPatterns.TimeNum,
              });
              const endTime = timeDateConverter({
                value: val.endTime,
                formatInput: DateFormatPatterns.Iso8601Date,
                formatOutput: DateFormatPatterns.TimeNum,
              });
              return startTime < endTime;
            },
            {
              message: errorMessages.invalidTimeError,
              path: ['endTime', 'startTime'],
            },
          );

        export type ${camelCaseName}Schema = z.infer<
          typeof ${pascalName}Schema
        >;
      `;
        break;
      default:
        templateContent = ` import { string, z } from 'zod';
        
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
        
        export type ${pascalName}Schema${suffix} = z.infer<typeof ${camelCaseName}Schema${suffix}>;`;
        break;
    }
    return templateContent;
  };

  return getTypeValidation();
};
