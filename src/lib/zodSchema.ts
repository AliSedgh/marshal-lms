import z from "zod";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"];
export const courseStatus = ["Draft", "Published", "Archived"];
export const coursesCategories = [
  "Development",
  "Business",
  "It & Software",
  "Office productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Music",
  "Photography",
  "Teaching & Academics",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" })
    .max(1000, { message: "Description must be less than 1000 characters" }),
  price: z
    .number()
    .min(0, { message: "Price is required" })
    .max(10000, { message: "Price must be less than 10000" }),
  fileKey: z.string().min(1, { message: "File is required" }),
  level: z.enum(courseLevels, { message: "Level is required" }),
  status: z.enum(courseStatus, { message: "Status is required" }),
  category: z.enum(coursesCategories, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small description must be at least 3 characters" })
    .max(200, {
      message: "small description must be less than 100 characters",
    }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain only lowercase letters, numbers and hyphens",
    }),
  duration: z
    .number()
    .min(1, { message: "Duration is required" })
    .max(500, { message: "Duration must be less than 500 hours" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
