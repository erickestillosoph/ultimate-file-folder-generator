const fs = require("fs");
const path = require("path");

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
  create-component MyComponent ct2                     # Create 2 my-component-container.tsx files in the root folder

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
  --template-fsd      - Use Feature-Sliced Design templates
  --template-bullet   - Use Bullet templates
  help                - Display this help message
  `);
  process.exit(0);
}

let componentName;
let templateType = "default";
const flags = new Set();

for (const arg of args) {
  if (arg.startsWith("--")) {
    flags.add(arg.toLowerCase());

    if (arg.toLowerCase() === "--template-fsd") {
      templateType = "fsd";
    } else if (arg.toLowerCase() === "--template-bullet") {
      templateType = "bullet";
    }
  } else if (!componentName) {
    componentName = arg;
  }
}

if (!componentName) {
  console.log(
    "❌ Please provide a component name!\nExample: node ~/scripts/createComponent.js MyComponent [--template-fsd | --template-bullet]"
  );
  process.exit(1);
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

function loadTemplate(templateType, component, index) {
  const templatesDir = path.join(__dirname, "templates");

  let templateSubdir;
  if (flags.has("--template-fsd")) {
    templateSubdir = "fsd";
  } else if (flags.has("--template-bullet")) {
    templateSubdir = "bullet";
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
  } else {
    templateContent = `// Default template for ${templateType} files`;
  }

  fs.writeFileSync(filePath, templateContent, "utf8");
  console.log(`📄 Created template file: ${filePath}`);
}

function generateBuiltInTemplate(type, component, index, templateSubdir) {
  const { name } = component;
  if (templateSubdir === "fsd") {
    switch (type) {
      case "hooks":
        return `// FSD fallback template for ${name} hook`;
      case "container":
      case "namedContainer":
        return `// FSD fallback template for ${name} container`;
      default:
        return `// FSD fallback template for ${name} ${type}`;
    }
  } else if (templateSubdir === "bullet") {
    switch (type) {
      case "hooks":
        return `// Bullet fallback template for ${name} hook`;
      case "container":
      case "namedContainer":
        return `// Bullet fallback template for ${name} container`;
      default:
        return `// Bullet fallback template for ${name} ${type}`;
    }
  } else {
    switch (type) {
      case "hooks":
        return `// Default ${name} hook component`;
      case "container":
      case "namedContainer":
        return `// Default ${name} container component`;
      default:
        return `// Default ${name} component`;
    }
  }
}

function generateFileContent(folder, componentName, index) {
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
  };
  return loadTemplate("page", component, 0);
}

function generateContainerContent(componentName) {
  const component = {
    name: componentName,
    kebabName: toKebabCase(componentName),
  };
  return loadTemplate("container", component, 0);
}

function parseFileCountArgs(args) {
  // Initialize counts for both subfolder keys and new root files.
  const fileCountMap = {
    hooks: 0,
    forms: 0,
    ui: 0,
    query: 0,
    mutations: 0,
    root: 0,
    validations: 0,
    container: 0, // legacy container files (rt)
    page: 0, // new: root page file(s)
    namedContainer: 0, // new: root container file(s) with component name
  };

  const folderPrefixMap = {
    hk: "hooks",
    fm: "forms",
    pg: "page", // now maps to root page file count
    ui: "ui",
    qy: "query",
    ms: "mutations",
    rp: "root",
    vl: "validations",
    rt: "container", // legacy container files
    ct: "namedContainer", // new container file(s)
  };

  let hasCommandArgs = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) continue;
    // Skip the component name (first argument)
    if (i === 0 || (i > 0 && args[0].startsWith("--") && i === 1)) continue;

    const prefix = arg.substring(0, 2).toLowerCase();
    const countStr = arg.substring(2);
    let count = parseInt(countStr, 10);
    // For new flags, if no numeric value is specified, default to 1.
    if (folderPrefixMap[prefix]) {
      if (
        (prefix === "pg" || prefix === "ct" || prefix === "rt") &&
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

  // Defaults: if no pg (page) was specified, create one page file.
  if (fileCountMap["page"] === 0) {
    fileCountMap["page"] = 1;
  }
  // By default create one named container file if not provided.
  if (fileCountMap["namedContainer"] === 0) {
    fileCountMap["namedContainer"] = 1;
  }
  return fileCountMap;
}

const projectRoot = process.cwd();
const baseFolder = path.join(projectRoot, componentName);
const kebabComponentName = toKebabCase(componentName);

// Exclude "pages" from subfolders since page files will be created in the root.
const subfolders = [
  "hooks",
  "forms",
  "mutations",
  "query",
  "validations",
  "ui",
];

const fileCountMap = parseFileCountArgs(args);

function getFileName(folder, kebabName, index) {
  const indexSuffix = index > 0 ? `-${index + 1}` : "";
  switch (folder) {
    case "hooks":
      return `use-hook-${kebabName}${indexSuffix}.tsx`;
    case "forms":
      return `use-hook-${kebabName}-form${indexSuffix}.tsx`;
    case "mutations":
      return `use-${kebabName}-mutation${indexSuffix}.graphql.ts`;
    case "query":
      return `use-${kebabName}-query${indexSuffix}.graphql.ts`;
    case "ui":
      return `${kebabName}-ui-page${indexSuffix}.tsx`;
    case "validations":
      return `${kebabName}-validation${indexSuffix}.schema.ts`;
    case "root":
      return `${componentName}.${folder}${indexSuffix}.tsx`;
    case "container": // legacy container files if provided via rt
      return `container${indexSuffix}.tsx`;
    default:
      return `${componentName}.${folder}${indexSuffix}.tsx`;
  }
}

function createFolderStructure(basePath, folders, fileCountMap) {
  // Process subfolders for hooks, forms, mutations, query, validations, and ui.
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

  // Create root page file(s) — controlled by "pg" flag.
  const pageCount = fileCountMap["page"] || 1;
  for (let i = 0; i < pageCount; i++) {
    const pageFileName = i === 0 ? "page.tsx" : `page-${i + 1}.tsx`;
    const pageFilePath = path.join(basePath, pageFileName);
    if (!fs.existsSync(pageFilePath)) {
      const pageContent = generatePageContent(componentName);
      fs.writeFileSync(pageFilePath, pageContent, "utf8");
      console.log(`📄 Created file: ${pageFilePath}`);
    } else {
      console.log(`✅ File already exists: ${pageFilePath}`);
    }
  }

  // Create named container file(s) — controlled by "ct" flag.
  const namedContainerCount = fileCountMap["namedContainer"] || 1;
  for (let i = 0; i < namedContainerCount; i++) {
    const namedContainerFileName =
      i === 0
        ? `${kebabComponentName}-container.tsx`
        : `${kebabComponentName}-container-${i + 1}.tsx`;
    const namedContainerFilePath = path.join(basePath, namedContainerFileName);
    if (!fs.existsSync(namedContainerFilePath)) {
      const containerContent = generateContainerContent(componentName);
      fs.writeFileSync(namedContainerFilePath, containerContent, "utf8");
      console.log(`📄 Created file: ${namedContainerFilePath}`);
    } else {
      console.log(`✅ File already exists: ${namedContainerFilePath}`);
    }
  }

  // Legacy: create additional root files if "rp" flag was given.
  const rootFileCount = fileCountMap["root"] || 0;
  for (let i = 1; i < rootFileCount; i++) {
    const additionalFilePath = path.join(
      basePath,
      `${kebabComponentName}-${i + 1}.tsx`
    );
    if (!fs.existsSync(additionalFilePath)) {
      const content = generateFileContent("root", componentName, i);
      fs.writeFileSync(additionalFilePath, content, "utf8");
      console.log(`📄 Created file: ${additionalFilePath}`);
    } else {
      console.log(`✅ File already exists: ${additionalFilePath}`);
    }
  }
}

if (!fs.existsSync(baseFolder)) {
  fs.mkdirSync(baseFolder, { recursive: true });
  console.log(`📁 Created component folder: ${baseFolder}`);
}

createFolderStructure(baseFolder, subfolders, fileCountMap);

console.log(
  `✅ Component "${componentName}" structure created successfully in "${componentName}"!`
);

console.log(`
Usage examples:
  create-component MyComponent                          # Create only page.tsx in the root folder
  create-component MyComponent hk2 fm3 pg2               # Create hooks, forms, and 2 page files in the root folder
  create-component MyComponent --template-fsd           # Create only page.tsx with Feature-Sliced Design template
  create-component MyComponent hk2 pg2 --template-fsd      # Create hooks and 2 page files in the root folder with FSD templates
  create-component MyComponent rp3                       # Create additional root files (legacy)
  create-component MyComponent ct                       # Create one my-component-container.tsx file in the root folder
  create-component MyComponent ct2                      # Create 2 my-component-container.tsx files in the root folder
`);

const child_process = require("child_process");
const legendImagePath = path.join(__dirname, "the-legend.jpg");

if (fs.existsSync(legendImagePath)) {
  console.log("\n🕒 The legend will appear in...");

  let countDown = 5;
  const timer = setInterval(() => {
    console.log(`   ${countDown}...`);
    countDown--;
    if (countDown === 0) {
      clearInterval(timer);
      try {
        if (process.platform === "darwin") {
          child_process.execSync(`open "${legendImagePath}"`);
        } else if (process.platform === "win32") {
          child_process.execSync(`start "" "${legendImagePath}"`);
        } else {
          child_process.execSync(`xdg-open "${legendImagePath}"`);
        }
        console.log(
          `\n🖼️  The legend has appeared! Check out the image viewer.`
        );
      } catch (error) {
        console.log(`\n⚠️  Could not display image: ${error.message}`);
      }
    }
  }, 1000);
} else {
  console.log(`\n Could not find image file at: ${legendImagePath}`);
}
