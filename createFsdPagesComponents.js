const fs = require("fs");
const path = require("path");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

const args = process.argv.slice(2);

if (args.length > 0 && args[0].toLowerCase() === "help") {
  console.log(`
Usage examples:
  create-component MyComponent                          # Create only page.tsx in the root folder (default)
  create-component MyComponent hk2 fm3 pg2               # Create hooks, forms, and 2 page files in the root folder
  create-component MyComponent --template-fsd           # Create only page.tsx with Feature-Sliced Design template
  create-component MyComponent hk2 pg2 --template-fsd      # Create hooks and 2 page files in the root folder with FSD templates
  create-component MyComponent rp3                       # Create additional root files (legacy "rp" generation)
  create-component MyComponent ct                      # Create one my-component-container.tsx file in the root folder
  cfsd MyComponent ct2                     # Create 2 my-component-container.tsx files in the root folder
  cfsd MyComponent qy2 ms2 sb1 fg1 hk2 pg1 ui2 vl2 ix1 --template-flat-client

Folder prefixes:
  hk = hooks          - Custom React hooks
  fm = forms          - Form-related hooks and components
  pg = page           - Root page file(s) (e.g. page.tsx, page-2.tsx)
  ct = container      - Named container file(s) in the root folder (e.g. my-component-container.tsx)
  qy = query          - Data query hooks
  ms = mutations      - Data mutation hooks
  rp = root           - Additional components in the root folder
  vl = validations    - Validation functions
  rt = container      - (Legacy) Container component in the root folder
  ui = ui             - UI components
  ix = index          - Index files (typically for re-exports)
  --template-fsd      - Use Feature-Sliced Design templates
  --template-bullet   - Use Bullet templates
  --template-mimir    - Use Mimir templates
  --template-flat     - Use Flat templates
  --template-wayslink-client - Use Wayslink client templates
  --template-wayslink-server - Use Wayslink server templates
  --template-wayslink-admin - Use Wayslink prisma templates
  --template-wayslink-prisma - Use Wayslink prisma templates
  --template-flat-client     - Use Flat client templates
  --template-flat-server     - Use Flat server templates
  --template-flat-prisma     - Use Flat prisma templates
  --template-aoike-client     - Use Aoike client templates
  --template-aoike-server     - Use Aoike server templates
  --template-aoike-prisma     - Use Aoike prisma templates
  help                - Display this help message
  `);
  process.exit(0);
}

let componentName;
let templateType = "default";
const flags = new Set();
let hookType = "query";
let queryTableName = "";
let validationType = "zod";

for (const arg of args) {
  if (arg.startsWith("--")) {
    flags.add(arg.toLowerCase());

    if (arg.toLowerCase() === "--template-fsd") {
      templateType = "fsd";
    } else if (arg.toLowerCase() === "--template-bullet") {
      templateType = "bullet";
    } else if (arg.toLowerCase() === "--template-flat") {
      templateType = "flat";
    } else if (arg.toLowerCase() === "--template-mimir") {
      templateType = "mimir";
    } else if (arg.toLowerCase() === "--template-flat-client") {
      templateType = "flat-client";
    } else if (arg.toLowerCase() === "--template-flat-server") {
      templateType = "flat-server";
    } else if (arg.toLowerCase() === "--template-flat-prisma") {
      templateType = "flat-prisma";
    }
  } else if (!componentName) {
    componentName = arg;
  }
}

function promptForTemplate() {
  return new Promise((resolve) => {
    readline.question(
      "Select template type (default: flat-client): \n1. flat-client\n2. flat-server\n3. flat-prisma\nEnter choice (1-3): ",
      (choice) => {
        let selectedTemplate;
        switch (choice) {
          case "1":
            selectedTemplate = "--template-flat-client";
            break;
          case "2":
            selectedTemplate = "--template-flat-server";
            break;
          case "3":
            selectedTemplate = "--template-flat-prisma";
            break;
          default:
            selectedTemplate = "--template-flat-client";
        }
        resolve(selectedTemplate);
      }
    );
  });
}

function promptForParameters() {
  return new Promise((resolve) => {
    readline.question(
      "Enter hook type (default: query or subscription or mutation or upsert): ",
      (inputHookType) => {
        const hookType = inputHookType || "query";

        readline.question("Enter query table name: ", (inputTableName) => {
          const queryTableName = inputTableName || componentName.toLowerCase();

          readline.question(
            "Enter validation type (default: simple or time): ",
            (inputValidationType) => {
              const validationType = inputValidationType || "zod";

              readline.question(
                "Enter mutation type (choices: upsert or mutation ) ",
                (inputMutationType) => {
                  const mutationType = inputMutationType || "default";

                  resolve({
                    hookType,
                    queryTableName,
                    validationType,
                    mutationType,
                  });
                }
              );
            }
          );
        });
      }
    );
  });
}

async function main() {
  if (!componentName) {
    console.log(
      "❌ Please provide a component name!\nExample: node ~/scripts/createComponent.js MyComponent"
    );
    process.exit(1);
  }

  try {
    // Prompt for template type
    const selectedTemplate = await promptForTemplate();
    flags.add(selectedTemplate.toLowerCase());

    // Update template type based on selection
    if (selectedTemplate === "--template-flat-client") {
      templateType = "flat-client";
    } else if (selectedTemplate === "--template-flat-server") {
      templateType = "flat-server";
    } else if (selectedTemplate === "--template-flat-prisma") {
      templateType = "flat-prisma";
    }

    // Get parameters
    const params = await promptForParameters();

    // Close readline after all prompts are complete
    readline.close();

    function toKebabCase(str) {
      return str
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/\s+/g, "-")
        .toLowerCase();
    }

    /**
     * Loads a template based on the template type and component information
     * @param {string} templateType - The type of template to load
     * @param {Object} component - Component information
     * @param {string} component.name - The name of the component
     * @param {string} component.kebabName - The kebab-case version of the component name
     * @param {string} component.queryTableName - The table name used for queries
     * @param {string} component.hookType - The type of hook being generated
     * @param {string} component.validationType - The type of validation being used
     * @param {number} index - The index for multiple file generation
     * @returns {string} The template content
     */
    function loadTemplate(templateType, component, index) {
      const templatesDir = path.join(__dirname, "templates");

      let templateSubdir;
      if (flags.has("--template-fsd")) {
        templateSubdir = "fsd";
      } else if (flags.has("--template-bullet")) {
        templateSubdir = "bullet";
      } else if (flags.has("--template-mimir")) {
        templateSubdir = "mimir";
      } else if (flags.has("--template-flat-client")) {
        templateSubdir = "flat-client";
      } else if (flags.has("--template-flat-server")) {
        templateSubdir = "flat-server";
      } else if (flags.has("--template-flat-prisma")) {
        templateSubdir = "flat-prisma";
      } else {
        templateSubdir = "default";
      }

      const templateTypeDir = path.join(templatesDir, templateSubdir);
      const templateFile = path.join(
        templateTypeDir,
        `${templateType}.template.js`
      );

      try {
        if (!fs.existsSync(templatesDir)) {
          fs.mkdirSync(templatesDir, { recursive: true });
          console.log(`📁 Created templates folder: ${templatesDir}`);
        }

        if (!fs.existsSync(templateTypeDir)) {
          fs.mkdirSync(templateTypeDir, { recursive: true });
          console.log(`📁 Created template type folder: ${templateTypeDir}`);
        }

        if (fs.existsSync(templateFile)) {
          delete require.cache[require.resolve(templateFile)];
          const templateModule = require(templateFile);
          return templateModule(component, index);
        } else {
          createDefaultTemplateFile(templateType, templateFile, templateSubdir);
          const templateModule = require(templateFile);
          return templateModule(component, index);
        }
      } catch (error) {
        console.log(
          `⚠️ Error loading template for ${templateType}: ${error.message}`
        );
        return generateBuiltInTemplate(
          templateType,
          component,
          index,
          templateSubdir
        );
      }
    }

    function createDefaultTemplateFile(templateType, filePath, templateSubdir) {
      let templateContent;

      if (templateSubdir === "fsd") {
        switch (templateType) {
          case "hooks":
            templateContent = `// FSD Template for hook files`;
            break;
          case "ui":
            templateContent = `// FSD Template for UI component files`;
            break;
          case "forms":
            templateContent = `// FSD Template for form files`;
            break;
          case "pages":
          case "page":
            templateContent = `// FSD Template for page files`;
            break;
          case "root":
            templateContent = `// FSD Template for root files`;
            break;
          case "validations":
            templateContent = `// FSD Template for validation files`;
            break;
          case "mutations":
            templateContent = `// FSD Template for mutation files`;
            break;
          case "query":
            templateContent = `// FSD Template for query files`;
            break;
          case "container":
          case "namedContainer":
            templateContent = `// FSD Template for container files`;
            break;
          default:
            templateContent = `// Default FSD template`;
        }
      } else if (templateSubdir === "bullet") {
        switch (templateType) {
          case "hooks":
            templateContent = `// Bullet Template for hook files`;
            break;
          case "forms":
            templateContent = `// Bullet Template for forms`;
            break;
          case "pages":
          case "page":
            templateContent = `// Bullet Template for page files`;
            break;
          case "mutations":
            templateContent = `// Bullet Template for mutations`;
            break;
          case "query":
            templateContent = `// Bullet Template for query`;
            break;
          case "ui":
            templateContent = `// Bullet Template for UI component files`;
            break;
          case "validations":
            templateContent = `// Bullet Template for validations`;
            break;
          case "root":
            templateContent = `// Bullet Template for root files`;
            break;
          case "container":
          case "namedContainer":
            templateContent = `// Bullet Template for container files`;
            break;
          default:
            templateContent = `// Default Bullet template`;
            break;
        }
      } else if (templateSubdir === "mimir") {
        templateContent = `// Mimir Template for ${templateType} files`;
      } else if (templateSubdir === "flat-client") {
        templateContent = `// Flat Client Template for ${templateType} files`;
      } else if (templateSubdir === "flat-server") {
        templateContent = `// Flat Server Template for ${templateType} files`;
      } else if (templateSubdir === "flat-prisma") {
        templateContent = `// Flat Prisma Template for ${templateType} files`;
      } else {
        templateContent = `// Default template for ${templateType} files`;
      }

      fs.writeFileSync(filePath, templateContent, "utf8");
      console.log(`📄 Created template file: ${filePath}`);
    }

    function generateBuiltInTemplate(type, component, index, templateSubdir) {
      const { name } = component;
      if (templateSubdir === "fsd") {
        switch (templateType) {
          case "hooks":
            return `// FSD Template for ${name} hook`;
          case "container":
          case "namedContainer":
            return `// FSD fallback template for ${name} container`;
          default:
            return `// Default FSD template for ${name}`;
        }
      } else if (templateSubdir === "bullet") {
        switch (templateType) {
          case "hooks":
            return `// Bullet Template for ${name} hook`;
          case "container":
          case "namedContainer":
            return `// Bullet fallback template for ${name} container`;
          default:
            return `// Default Bullet template for ${name}`;
        }
      } else if (templateSubdir === "mimir") {
        return `// Mimir Template for ${name} ${type}`;
      } else if (templateSubdir === "flat-client") {
        return `// Flat Client Template for ${name} ${type}`;
      } else if (templateSubdir === "flat-server") {
        return `// Flat Server Template for ${name} ${type}`;
      } else if (templateSubdir === "flat-prisma") {
        return `// Flat Prisma Template for ${name} ${type}`;
      } else {
        return `// Default template for ${name} ${type}`;
      }
    }

    function generateFileContent(folder, componentName, index) {
      const component = {
        name: componentName,
        kebabName: toKebabCase(componentName),
        queryTableName: params.queryTableName,
        hookType: params.hookType,
        validationType: params.validationType,
      };
      return loadTemplate(folder, component, index);
    }

    function getFileName(folder, componentName, index) {
      const component = {
        name: componentName,
        kebabName: toKebabCase(componentName),
      };
      return loadTemplate(folder, component, index);
    }

    function generatePageContent(componentName) {
      const component = {
        name: componentName,
        kebabName: toKebabCase(componentName),
        queryTableName: params.queryTableName,
        hookType: params.hookType,
        validationType: params.validationType,
      };
      return loadTemplate("page", component, 0);
    }

    function generateContainerContent(componentName) {
      const component = {
        name: componentName,
        kebabName: toKebabCase(componentName),
        queryTableName: params.queryTableName,
        hookType: params.hookType,
        validationType: params.validationType,
      };
      return loadTemplate("container", component, 0);
    }

    function parseFileCountArgs(args) {
      const fileCountMap = {
        hooks: 0,
        forms: 0,
        ui: 0,
        query: 0,
        mutations: 0,
        subscription: 0,
        root: 0,
        validations: 0,
        container: 0,
        page: 0,
        namedContainer: 0,
        fragments: 0,
        index: 0,
        upsert: 0,
      };

      const folderPrefixMap = {
        hk: "hooks",
        fm: "forms",
        pg: "page",
        ui: "ui",
        qy: "query",
        ms: "mutations",
        sb: "subscription",
        rp: "root",
        vl: "validations",
        rt: "container",
        ct: "namedContainer",
        fg: "fragments",
        ix: "index",
        up: "upsert",
      };

      let hasCommandArgs = false;

      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg.startsWith("--")) continue;

        // Skip component name
        if (i === 0) continue;

        const prefix = arg.substring(0, 2).toLowerCase();
        const countStr = arg.substring(2);
        let count = parseInt(countStr, 10);

        if (folderPrefixMap[prefix]) {
          if (
            (prefix === "pg" ||
              prefix === "ct" ||
              prefix === "rt" ||
              prefix === "ix") &&
            countStr === ""
          ) {
            count = 1;
          }
          if (!isNaN(count)) {
            fileCountMap[folderPrefixMap[prefix]] = count;
            hasCommandArgs = true;
          }
        }
      }

      if (!hasCommandArgs) {
        fileCountMap["page"] = 1;
      }

      return fileCountMap;
    }

    const projectRoot = process.cwd();
    const baseFolder = path.join(projectRoot, componentName);
    const kebabComponentName = toKebabCase(componentName);

    const subfolders = ["hooks", "forms", "validations", "ui"];

    const fileCountMap = parseFileCountArgs(args);

    const indexFileCount = fileCountMap["index"];
    if (indexFileCount > 0) {
      for (let i = 0; i < indexFileCount; i++) {
        const indexName = getFileName("index", kebabComponentName, i);
        const indexPath = path.join(baseFolder, indexName);
        ensureDirectoryExists(indexPath); // Ensure the directory exists
        if (!fs.existsSync(indexPath)) {
          const indexContent = generateFileContent("index", componentName, i);
          fs.writeFileSync(indexPath, indexContent, "utf8");
          console.log(`📄 Created index file: ${indexPath}`);
        } else {
          console.log(`✅ Index file already exists: ${indexPath}`);
        }
      }
    }

    function getFileName(folder, kebabName, index) {
      const indexSuffix = index > 0 ? `-${index + 1}` : "";
      switch (folder) {
        case "hooks":
          return `use-${kebabName}${indexSuffix}.tsx`;
        case "forms":
          return `use-${kebabName}-form${indexSuffix}.tsx`;
        case "mutations":
          return `update-${kebabName}${indexSuffix}.graphql`;
        case "query":
          return `get-${kebabName}${indexSuffix}.graphql`;
        case "subscription":
          return `${kebabName}-subscription${indexSuffix}.graphql`;
        case "upsert":
          return `upsert-${kebabName}${indexSuffix}.graphql`;
        case "fragments":
          return `${kebabName}-fragment${indexSuffix}.graphql`;
        case "ui":
          return `${kebabName}-ui${indexSuffix}.tsx`;
        case "validations":
          return `${kebabName}-validation${indexSuffix}.schema.ts`;
        case "root":
          return `${kebabName}${indexSuffix}.tsx`;
        case "container":
          return `container${indexSuffix}.tsx`;
        case "index":
          return `index${indexSuffix}.ts`;
        case "namedContainer":
          return `${kebabName}-container${indexSuffix}.tsx`;
        default:
          return `${kebabName}.${folder}${indexSuffix}.tsx`;
      }
    }

    function ensureDirectoryExists(filePath) {
      const directory = path.dirname(filePath);
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        console.log(`�� Created directory: ${directory}`);
      }
    }

    function createFolderStructure(basePath, folders, fileCountMap) {
      folders.forEach((folder) => {
        const fileCount = fileCountMap[folder] || 0;
        if (fileCount === 0) return;

        const folderPath = path.join(basePath, folder);
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
          console.log(`📁 Created folder: ${folderPath}`);
        } else {
          console.log(`✅ Folder already exists: ${folderPath}`);
        }

        for (let i = 0; i < fileCount; i++) {
          const fileName = getFileName(folder, kebabComponentName, i);
          const filePath = path.join(folderPath, fileName);
          if (!fs.existsSync(filePath)) {
            const content = generateFileContent(folder, componentName, i);
            fs.writeFileSync(filePath, content, "utf8");
            console.log(`📄 Created file: ${filePath}`);
          } else {
            console.log(`✅ File already exists: ${filePath}`);
          }
        }
      });

      const projectRoot = process.cwd();
      ensureDirectoryExists(path.join(projectRoot, componentName));

      if (!fs.existsSync(baseFolder)) {
        fs.mkdirSync(baseFolder, { recursive: true });
        console.log(`📁 Created component folder: ${baseFolder}`);
      } else {
        console.log(`✅ Component folder already exists: ${baseFolder}`);
      }

      const apiTypes = [
        "query",
        "mutations",
        "subscription",
        "fragments",
        "upsert",
      ];
      let needsApiFolder = false;

      apiTypes.forEach((type) => {
        if (fileCountMap[type] > 0) {
          needsApiFolder = true;
        }
      });

      if (needsApiFolder) {
        const apiFolder = path.join(basePath, "api");
        if (!fs.existsSync(apiFolder)) {
          fs.mkdirSync(apiFolder, { recursive: true });
          console.log(`📁 Created folder: ${apiFolder}`);
        } else {
          console.log(`✅ Folder already exists: ${apiFolder}`);
        }

        apiTypes.forEach((type) => {
          const fileCount = fileCountMap[type] || 0;
          if (fileCount === 0) return;

          const typeFolder = path.join(apiFolder, type);
          if (!fs.existsSync(typeFolder)) {
            fs.mkdirSync(typeFolder, { recursive: true });
            console.log(`📁 Created folder: ${typeFolder}`);
          } else {
            console.log(`✅ Folder already exists: ${typeFolder}`);
          }

          for (let i = 0; i < fileCount; i++) {
            const fileName = getFileName(type, kebabComponentName, i);
            const filePath = path.join(typeFolder, fileName);
            if (!fs.existsSync(filePath)) {
              const content = generateFileContent(type, componentName, i);
              fs.writeFileSync(filePath, content, "utf8");
              console.log(`📄 Created file: ${filePath}`);
            } else {
              console.log(`✅ File already exists: ${filePath}`);
            }
          }
        });
      }
    }

    if (!fs.existsSync(baseFolder)) {
      fs.mkdirSync(baseFolder, { recursive: true });
      console.log(`📁 Created component folder: ${baseFolder}`);
    } else {
      console.log(`✅ Component folder already exists: ${baseFolder}`);
    }

    const pageFileCount = fileCountMap["page"];
    for (let i = 0; i < pageFileCount; i++) {
      const pageName =
        i === 0
          ? `${kebabComponentName}-page.tsx`
          : `${kebabComponentName}-page-${i + 1}.tsx`;
      const pagePath = path.join(baseFolder, pageName);
      if (!fs.existsSync(pagePath)) {
        const pageContent = generatePageContent(componentName);
        fs.writeFileSync(pagePath, pageContent, "utf8");
        console.log(`📄 Created page file: ${pagePath}`);
      } else {
        console.log(`✅ Page file already exists: ${pagePath}`);
      }
    }

    const namedContainerCount = fileCountMap["namedContainer"];
    if (namedContainerCount > 0) {
      for (let i = 0; i < namedContainerCount; i++) {
        const containerName = getFileName(
          "namedContainer",
          kebabComponentName,
          i
        );
        const containerPath = path.join(baseFolder, containerName);
        if (!fs.existsSync(containerPath)) {
          const containerContent = generateContainerContent(componentName);
          fs.writeFileSync(containerPath, containerContent, "utf8");
          console.log(`📄 Created container file: ${containerPath}`);
        } else {
          console.log(`✅ Container file already exists: ${containerPath}`);
        }
      }
    }

    createFolderStructure(baseFolder, subfolders, fileCountMap);
  } catch (error) {
    console.error("Error:", error);
    readline.close();
    process.exit(1);
  }
}

main().catch(console.error);
