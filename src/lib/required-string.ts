import { z } from "zod";

/**
 * This is necessary because "" passes z.string() validation,
 * and react-hook-form's default values are "".
 *
 * This means a string field that should be required is not going to be.
 */
export const requiredString = z.string().trim().nonempty("Required");
