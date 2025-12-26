export function extractNestedValue(obj: any, path: string): any {
  const keys = path.split(".");
  let value = obj;
  for (const key of keys) {
    if (value === null || value === undefined) return null;
    value = value[key];
  }
  return value;
}

export function formatValue(value: any, format?: string): string {
  if (value === null || value === undefined) return "N/A";

  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(value));
    case "percentage":
      return `${Number(value).toFixed(2)}%`;
    case "number":
      return new Intl.NumberFormat("en-US").format(Number(value));
    default:
      return String(value);
  }
}

export function flattenObject(obj: any, prefix = ""): Record<string, any> {
  const flattened: Record<string, any> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }
  return flattened;
}

export function getFieldPaths(obj: any, prefix = ""): string[] {
  const paths: string[] = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        paths.push(...getFieldPaths(obj[key], newKey));
      } else {
        paths.push(newKey);
      }
    }
  }
  return paths;
}

