import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError, httpStatus } from "~/utils";

/**
 *
 * @param schema Zod schema to validate the request against
 * @returns Middleware function that validates the request body, query, and params
 */
export const validate =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        // Directly parse the request body
        req.body = await schema.body.parseAsync(req.body);
      }

      if (schema.query) {
        // Directly parse the query params (no need to wrap in object)
        req.query = await schema.query.parseAsync(req.query);
      }

      if (schema.params) {
        // Directly parse the route params (no need to wrap in object)
        req.params = await schema.params.parseAsync(req.params);
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Create a more detailed error message
        const errorMessage = error.errors
          .map((err) => {
            const path = err.path.length > 0 ? err.path.join(".") : "root";
            return `${path}: ${err.message}`;
          })
          .join(", ");
        // Pass the detailed error message to ApiError
        throw new ApiError(
          `Validation Error: ${errorMessage}`,
          httpStatus.BAD_REQUEST
        );
      }
      return next(error);
    }
  };
