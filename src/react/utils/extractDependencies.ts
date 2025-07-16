/**
 * Recursively extracts field dependencies from condition objects
 * Used for memoization - fields only re-render when their dependencies change
 */
export function extractDependencies(condition: any): Set<string> {
  const dependencies = new Set<string>();

  function extract(cond: any): void {
    if (!cond || typeof cond !== 'object') {
      return;
    }

    // Direct field reference
    if (cond.field && typeof cond.field === 'string') {
      dependencies.add(cond.field);
    }

    // Recursive cases for logical operators
    if (cond.all && Array.isArray(cond.all)) {
      cond.all.forEach(extract);
    }

    if (cond.any && Array.isArray(cond.any)) {
      cond.any.forEach(extract);
    }

    if (cond.none && Array.isArray(cond.none)) {
      cond.none.forEach(extract);
    }

    // If-then-else logic
    if (cond.if) {
      extract(cond.if);
    }
    if (cond.then) {
      extract(cond.then);
    }
    if (cond.else) {
      extract(cond.else);
    }

    // Array conditions that might reference fields
    if (cond.field && cond.operator) {
      // Check if value references another field (path-based comparison)
      if (typeof cond.value === 'string' && cond.value.startsWith('$.')) {
        const fieldPath = cond.value.slice(2); // Remove '$.'
        dependencies.add(fieldPath);
      }
    }
  }

  extract(condition);
  return dependencies;
}

/**
 * Get dependency values from form values for memoization
 */
export function getDependencyValues(
  dependencies: Set<string>, 
  values: Record<string, any>
): any[] {
  return Array.from(dependencies).map(dep => {
    // Handle nested paths like 'user.profile.name'
    const keys = dep.split('.');
    let value = values;
    
    for (const key of keys) {
      value = value?.[key];
    }
    
    return value;
  });
}