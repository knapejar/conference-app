import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SRC_DIR = path.join(process.cwd(), 'src');
const DOT_FILE = path.join(process.cwd(), 'vue-usage.dot');
const SVG_FILE = path.join(process.cwd(), 'vue-usage.svg');

// List of standard HTML and Ionic components to exclude
const excludedComponents = new Set([
  'AddIcons', 'MainLayoutHeaderToolbarBell', 'MainLayoutHeaderToolbarSettings', 'QuestionsIconButton', 'PromptUserToInstallButton',
  'IonApp', 'IonRouterOutlet', 'IonPage', 'IonHeader', 'IonToolbar', 'IonTitle',
  'IonSegment', 'IonSegmentButton', 'IonLabel', 'IonContent', 'IonText', 'H1',
  'IonList', 'IonItem', 'IonInput', 'P', 'IonButton', 'Div', 'IonRefresher',
  'IonRefresherContent', 'Input', 'IonFab', 'IonFabButton', 'IonIcon', 'IonItemGroup',
  'IonItemDivider', 'H2', 'H3', 'IonCard', 'IonCardHeader', 'IonCardTitle',
  'IonCardContent', 'IonTextarea', 'Img', 'IonSelect', 'IonSelectOption',
  'IonToggle', 'IonAvatar', 'IonNote', 'IonChip', 'IonButtons', 'IonBackButton',
  'Slot', 'IonFooter', 'IonToolbar', 'IonTabs', 'IonTabBar', 'IonTabButton',
  'IonMenuToggle', 'IonMenu', 'IonSpinner', 'Template', 'Span', 'IonBadge', 'IonText', 'IonImg',
]);

// Get store modules
function getStoreModules() {
  const storeModulesDir = path.join(SRC_DIR, 'store', 'modules');
  const modules = fs.readdirSync(storeModulesDir)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.basename(file, '.ts'));
  return modules;
}

// Get API modules
function getApiModules() {
  const apiDir = path.join(SRC_DIR, 'api');
  const modules = fs.readdirSync(apiDir)
    .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
    .map(file => path.basename(file, '.ts'));
  return modules;
}

// Detect store usage in a file
function detectStoreUsage(content) {
  const storeModules = getStoreModules();
  const usedModules = new Set();
  
  // Check for store.dispatch and store.commit usage
  const dispatchRegex = /store\.dispatch\(['"]([^'"]+)['"]/g;
  const commitRegex = /store\.commit\(['"]([^'"]+)['"]/g;
  const mapStateRegex = /mapState\(['"]([^'"]+)['"]/g;
  const mapGettersRegex = /mapGetters\(['"]([^'"]+)['"]/g;
  const mapActionsRegex = /mapActions\(['"]([^'"]+)['"]/g;
  const mapMutationsRegex = /mapMutations\(['"]([^'"]+)['"]/g;
  
  let match;
  
  // Check dispatch calls
  while ((match = dispatchRegex.exec(content))) {
    const module = match[1].split('/')[0];
    if (storeModules.includes(module)) {
      usedModules.add(module);
    }
  }
  
  // Check commit calls
  while ((match = commitRegex.exec(content))) {
    const module = match[1].split('/')[0];
    if (storeModules.includes(module)) {
      usedModules.add(module);
    }
  }
  
  // Check mapState usage
  while ((match = mapStateRegex.exec(content))) {
    const module = match[1];
    if (storeModules.includes(module)) {
      usedModules.add(module);
    }
  }
  
  // Check mapGetters usage
  while ((match = mapGettersRegex.exec(content))) {
    const module = match[1];
    if (storeModules.includes(module)) {
      usedModules.add(module);
    }
  }
  
  // Check mapActions usage
  while ((match = mapActionsRegex.exec(content))) {
    const module = match[1];
    if (storeModules.includes(module)) {
      usedModules.add(module);
    }
  }
  
  // Check mapMutations usage
  while ((match = mapMutationsRegex.exec(content))) {
    const module = match[1];
    if (storeModules.includes(module)) {
      usedModules.add(module);
    }
  }
  
  return Array.from(usedModules);
}

// Detect API usage in a file
function detectApiUsage(content) {
  const apiModules = getApiModules();
  const usedModules = new Set();
  
  // Check for API imports and usage
  const importRegex = /import\s+.*\s+from\s+['"]@\/api\/([^'"]+)['"]/g;
  const apiCallRegex = /(?:api|API)\.([a-zA-Z]+)/g;
  
  let match;
  
  // Check imports
  while ((match = importRegex.exec(content))) {
    const module = path.basename(match[1], '.ts');
    if (apiModules.includes(module)) {
      usedModules.add(module);
    }
  }
  
  // Check API calls
  while ((match = apiCallRegex.exec(content))) {
    const module = match[1].toLowerCase();
    if (apiModules.includes(module)) {
      usedModules.add(module);
    }
  }
  
  return Array.from(usedModules);
}

function getVueFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getVueFiles(filePath));
    } else if (file.endsWith('.vue')) {
      results.push(filePath);
    }
  });
  return results;
}

function extractTemplate(content) {
  const match = content.match(/<template[\s\S]*?>([\s\S]*?)<\/template>/i);
  return match ? match[1] : '';
}

function extractComponentTags(template) {
  // Match tags that start with uppercase (custom components) or kebab-case
  const tagRegex = /<([A-Z][A-Za-z0-9_\-]*|[a-z][a-z0-9_\-]*)\b/g;
  const tags = new Set();
  let match;
  
  while ((match = tagRegex.exec(template))) {
    // Convert kebab-case to PascalCase
    const tag = match[1];
    const pascalCase = tag.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    
    // Only add if it's not in the excluded list
    if (!excludedComponents.has(pascalCase)) {
      tags.add(pascalCase);
    }
  }
  return Array.from(tags);
}

function getComponentName(filePath) {
  return path.basename(filePath, '.vue');
}

// New: Parse router/index.ts for route components
function getRouteComponents(routerFile) {
  if (!fs.existsSync(routerFile)) return [];
  const content = fs.readFileSync(routerFile, 'utf-8');
  // Match import ... from '.../Settings.vue';
  const importRegex = /import\s+(\w+)\s+from\s+['\"](.+?)(Settings|[A-Z][A-Za-z0-9_]*)\.vue['\"]/g;
  const routeRegex = /component:\s*(\w+)/g;
  const imports = {};
  let match;
  while ((match = importRegex.exec(content))) {
    imports[match[1]] = match[3];
  }
  const routeComponents = new Set();
  while ((match = routeRegex.exec(content))) {
    const comp = match[1];
    if (imports[comp]) {
      routeComponents.add(imports[comp]);
    } else {
      routeComponents.add(comp);
    }
  }
  return Array.from(routeComponents);
}

// New: Detect slot usage
function extractSlotComponentTags(template) {
  // Match <template v-slot:name> or <template #name>
  const slotRegex = /<template\s+(v-slot:|#)([\w-]+)[^>]*>([\s\S]*?)<\/template>/g;
  const slotUsages = [];
  let match;
  while ((match = slotRegex.exec(template))) {
    const slotContent = match[3];
    // Find all component tags in slot content
    const tagRegex = /<([A-Z][A-Za-z0-9_\-]*|[a-z][a-z0-9_\-]*)\b/g;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(slotContent))) {
      const tag = tagMatch[1];
      const pascalCase = tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
      // Only add if it's not in the excluded list
      if (!excludedComponents.has(pascalCase)) {
        slotUsages.push(pascalCase);
      }
    }
  }
  return slotUsages;
}

const ROUTER_FILE = path.join(process.cwd(), 'src', 'router', 'index.ts');
const routeComponents = getRouteComponents(ROUTER_FILE);

// Build usage map
const vueFiles = getVueFiles(SRC_DIR);
const usageMap = {};
const slotUsageMap = {};
const storeUsageMap = {};
const apiUsageMap = {};

vueFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const template = extractTemplate(content);
  const usedComponents = extractComponentTags(template);
  const slotComponents = extractSlotComponentTags(template);
  const storeModules = detectStoreUsage(content);
  const apiModules = detectApiUsage(content);
  const componentName = getComponentName(file);
  
  usageMap[componentName] = usedComponents;
  if (slotComponents.length > 0) {
    slotUsageMap[componentName] = slotComponents;
  }
  if (storeModules.length > 0) {
    storeUsageMap[componentName] = storeModules;
  }
  if (apiModules.length > 0) {
    apiUsageMap[componentName] = apiModules;
  }
});

// Build reverse usage map to find singletons
const reverseUsage = {};
for (const [parent, children] of Object.entries(usageMap)) {
  for (const child of children) {
    if (!reverseUsage[child]) reverseUsage[child] = new Set();
    reverseUsage[child].add(parent);
  }
}
for (const [parent, children] of Object.entries(slotUsageMap)) {
  for (const child of children) {
    if (!reverseUsage[child]) reverseUsage[child] = new Set();
    reverseUsage[child].add(parent);
  }
}
for (const comp of routeComponents) {
  if (!reverseUsage[comp]) reverseUsage[comp] = new Set();
  reverseUsage[comp].add('Router');
}

// Only include components that are used somewhere or are parents
const allUsed = new Set([
  ...Object.keys(usageMap),
  ...Object.keys(slotUsageMap),
  ...routeComponents
]);

// Filter out excluded components from allUsed
for (const excluded of excludedComponents) {
  allUsed.delete(excluded);
}

// Add children to allUsed, but only if they're not excluded
for (const children of Object.values(usageMap)) {
  for (const child of children) {
    if (!excludedComponents.has(child)) {
      allUsed.add(child);
    }
  }
}
for (const children of Object.values(slotUsageMap)) {
  for (const child of children) {
    if (!excludedComponents.has(child)) {
      allUsed.add(child);
    }
  }
}

// Build DOT graph
let dot = 'digraph VueComponentUsage {\n';
dot += '  graph [rankdir=LR, size="8,11", ratio=fill];\n';
dot += '  "Router" [shape=box, style=filled, fillcolor="#e0e0e0"];\n';
dot += '  "App" [shape=box, style=filled, fillcolor="#e0e0e0"];\n';
dot += '  "Store" [shape=box, style=filled, fillcolor="#e0e0e0"];\n';
dot += '  "API" [shape=box, style=filled, fillcolor="#e0e0e0"];\n';

// Add store modules
const storeModules = getStoreModules();
storeModules.forEach(module => {
  dot += `  "Store" -> "${module}" [style=dotted];\n`;
});

// Add API modules
const apiModules = getApiModules();
apiModules.forEach(module => {
  dot += `  "API" -> "${module}" [style=dotted];\n`;
});

// Add edges for regular component usage
for (const [parent, children] of Object.entries(usageMap)) {
  if (!allUsed.has(parent)) continue;
  for (const child of children) {
    if (!allUsed.has(child)) continue;
    dot += `  "${parent}" -> "${child}";\n`;
  }
  if (children.length === 0 && allUsed.has(parent)) {
    dot += `  "${parent}";\n`;
  }
}

// Add edges for slot usage with dashed lines
for (const [parent, children] of Object.entries(slotUsageMap)) {
  if (!allUsed.has(parent)) continue;
  for (const child of children) {
    if (!allUsed.has(child)) continue;
    dot += `  "${parent}" -> "${child}" [style=dashed, color=gray];\n`;
  }
}

// Add edges for store usage
for (const [component, modules] of Object.entries(storeUsageMap)) {
  if (!allUsed.has(component)) continue;
  for (const module of modules) {
    dot += `  "${component}" -> "${module}" [style=dotted, color=blue];\n`;
  }
}

// Add edges for API usage
for (const [component, modules] of Object.entries(apiUsageMap)) {
  if (!allUsed.has(component)) continue;
  for (const module of modules) {
    dot += `  "${component}" -> "${module}" [style=dotted, color=green];\n`;
  }
}

// Add edges for route components
for (const comp of routeComponents) {
  if (allUsed.has(comp)) {
    dot += `  "Router" -> "${comp}";\n`;
  }
}
dot += '}\n';

fs.writeFileSync(DOT_FILE, dot, 'utf-8');

// Generate SVG using Graphviz
try {
  execSync(`dot -Tsvg "${DOT_FILE}" -o "${SVG_FILE}"`);
  // Validate SVG
  const svg = fs.readFileSync(SVG_FILE, 'utf-8');
  if (svg.startsWith('<?xml') && svg.includes('<svg')) {
    console.log('SVG generated and validated:', SVG_FILE);
    process.exit(0);
  } else {
    throw new Error('SVG file is invalid.');
  }
} catch (err) {
  console.error('Error generating SVG:', err);
  process.exit(1);
} 