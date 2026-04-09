import { logger } from "~5_infrastructure/logger";
import { database } from "~5_infrastructure/db";
import { cache } from "~5_infrastructure/cache";

import {
  fetchCourse,
  saveCourse,
  validateCourse,
  transformFormToDraft,
  renderCourseCard,
  renderError,
} from "../1_lib";

function createExecutor() {
  const deps = { logger, database, cache };

  let ctx = extendCtx({ deps });

  return {
    getContext() {
      return ctx;
    },

    async load(courseId) {
      const { logger } = ctx.deps;

      logger.info(`Loading course: ${courseId}`);

      const { data, error } = await fetchCourse(ctx, courseId);

      if (error) {
        ctx = extendCtx(ctx, { lastError: error });

        logger.error(`Load failed: ${error}`);

        return { ok: false, html: renderError(ctx) };
      }

      ctx = extendCtx(ctx, { course: data, lastError: null });

      return { ok: true, html: renderCourseCard(ctx) };
    },

    async submit(formValues) {
      const { logger } = ctx.deps;

      const draft = transformFormToDraft(ctx, formValues);

      ctx = extendCtx(ctx, { draft });

      const { errors } = validateCourse(ctx);

      if (errors.length) {
        ctx = extendCtx(ctx, { lastError: errors[0] });

        logger.error(`Validation: ${errors[0]}`);

        return { ok: false, html: renderError(ctx) };
      }

      logger.info(`Saving draft: ${draft.title}`);

      const saved = await saveCourse(ctx);

      ctx = extendCtx(ctx, { course: saved, draft: null, lastError: null });

      return { ok: true, html: renderCourseCard(ctx) };
    },
  };
}

function extendCtx(base, patch) {
  return Object.freeze({ ...base, ...patch });
}

const executor = createExecutor();

export { executor };
