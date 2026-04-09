export async function fetchCourse(ctx, courseId) {
  const { logger, database } = ctx.deps;

  try {
    logger.info(`API: fetching course ${courseId}`);

    const data = await database.findById("courses", courseId);

    if (!data) return { data: null, error: "Course not found" };

    return { data, error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

export async function saveCourse(ctx) {
  const {
    deps: { logger, database, cache },
    draft,
  } = ctx;

  logger.info(`API: saving course "${draft.title}"`);

  await database.save("courses", draft);

  await cache.invalidate(`course:${draft.id}`);

  return { ...draft, savedAt: Date.now() };
}
