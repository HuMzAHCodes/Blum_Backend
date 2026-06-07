import { ZodError } from "zod";
/**
 * ── Request Validation Middleware ────────────────────────────
 * Validates request data (body, query, and params) using Zod.
 * Returns formatted validation errors directly to the client.
 */
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            // Perform validation and auto-parse fields
            const validatedData = await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            // Override request fields with validated (typed) objects
            req.body = validatedData.body;
            req.query = validatedData.query;
            req.params = validatedData.params;
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                // Format validation messages
                const errorDetails = error.errors.map((validationError) => ({
                    field: validationError.path.slice(1).join("."), // removes top level wrapper 'body'/'query'/'params'
                    message: validationError.message,
                }));
                res.status(400).json({
                    status: "error",
                    statusCode: 400,
                    message: "Request validation failed",
                    errors: errorDetails,
                });
                return;
            }
            next(error);
        }
    };
};
//# sourceMappingURL=validate.js.map