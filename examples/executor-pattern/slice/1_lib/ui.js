export function renderCourseCard(ctx) {
  const {
    deps: { logger },
    course,
  } = ctx;

  logger.info(`UI: rendering card for "${course.title}"`);

  return `
    <div class="course-card">
      <h2>${course.title}</h2>
      <p>${course.description ?? ""}</p>
      <span>${course.duration}h</span>
    </div>
  `;
}

export function renderError(ctx) {
  const {
    deps: { logger },
    lastError,
  } = ctx;

  logger.error(`UI: rendering error "${lastError}"`);

  return `<div class="error">${lastError}</div>`;
}
