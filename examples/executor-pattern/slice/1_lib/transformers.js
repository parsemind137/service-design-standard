export function transformFormToDraft(ctx, formValues) {
  const { course } = ctx;

  const base = course || {};

  return {
    id: base.id ?? crypto.randomUUID(),
    title: String(formValues.title ?? "").trim(),
    description: String(formValues.description ?? "").trim(),
    duration: Number(formValues.duration) || 0,
    updatedAt: Date.now(),
  };
}
