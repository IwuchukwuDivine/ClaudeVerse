/**
 * Lowercase, trim, and collapse whitespace for fair matching.
 * Keeps unicode so "résumé" matches itself.
 */
const normalizeQuery = (q: string): string =>
  q.toLowerCase().trim().replace(/\s+/g, " ");

export default normalizeQuery;
