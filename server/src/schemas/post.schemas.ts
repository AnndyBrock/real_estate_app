import { z } from "zod";

export const draftPostSchema = z.object({
  title: z.string().min(6).max(255),
  type: z.enum(["sale", "rent"], { required_error: "Type is required" }),
  price: z.number().positive("Price must be greater than 0"),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postalCode: z
      .string()
      .regex(
        /^(\d{5,6}|[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d)$/,
        "Invalid postal code",
      )
      .optional(),
    coordinates: z
      .object({
        type: z.literal("Point").optional(),
        coordinates: z
          .tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)])
          .optional(),
      })
      .optional(),
  }),
});

export const postSchema = draftPostSchema.extend({
  photos: z
    .array(z.string().url("Invalid URL"))
    .min(1, "At least one photo URL is required"),
  interior: z
    .object({
      bedrooms: z.array(
        z.object({
          name: z.string(),
          features: z.array(z.string()).optional(),
          level: z.string().optional(),
          area: z.number().optional(),
          dimensions: z.string().optional(),
        }),
      ),
      bathrooms: z.number().min(0, "Bathrooms cannot be negative"),
      kitchen: z.object({
        features: z.array(z.string()).optional(),
        level: z.string().optional(),
        area: z.number().optional(),
        dimensions: z.string().optional(),
      }),
      livingRoom: z.object({
        features: z.array(z.string()).optional(),
        level: z.string().optional(),
        area: z.number().optional(),
        dimensions: z.string().optional(),
      }),
      diningRoom: z.object({
        features: z.array(z.string()).optional(),
        level: z.string().optional(),
        area: z.number().optional(),
        dimensions: z.string().optional(),
      }),
    })
    .optional(),
  heating: z.string().optional(),
  cooling: z.string().optional(),
  appliances: z
    .object({
      included: z.array(z.string()).optional(),
      laundry: z.string().optional(),
    })
    .optional(),
  features: z
    .object({
      flooring: z.string().optional(),
      hasFireplace: z.boolean().optional(),
      basement: z.string().optional(),
      patioAndPorch: z.array(z.string()).optional(),
      exterior: z.array(z.string()).optional(),
    })
    .optional(),
  interiorArea: z
    .object({
      livingAreaRange: z.string().optional(),
    })
    .optional(),
  parking: z
    .object({
      totalSpaces: z.number().min(0),
      features: z.array(z.string()).optional(),
      hasGarage: z.boolean(),
    })
    .optional(),
  construction: z
    .object({
      typeAndStyle: z.object({
        homeType: z.string(),
        propertySubtype: z.string(),
      }),
      materials: z.array(z.string()).optional(),
      condition: z.string().optional(),
      newConstruction: z.boolean(),
    })
    .optional(),
  hoa: z
    .object({
      hasHoa: z.boolean(),
      servicesIncluded: z.array(z.string()).optional(),
    })
    .optional(),
  financial: z
    .object({
      dateOnMarket: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, use YYYY-MM-DD"),
    })
    .optional(),
  location: z
    .object({
      region: z.string(),
      subdivision: z.string().optional(),
    })
    .optional(),
});
