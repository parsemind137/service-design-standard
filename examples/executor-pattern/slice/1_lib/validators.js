export function validateCourse(ctx) {
  const { draft } = ctx;

  const errors = [];

  if (!draft) {
    errors.push("Draft is missing");

    return { errors };
  }

  if (!draft.title) errors.push("Title is required");

  if (draft.title && draft.title.length < 3)
    errors.push("Title must be at least 3 characters");

  if (draft.duration <= 0) errors.push("Duration must be positive");

  return { errors };
}
