import { z } from "zod";

export const postSchema = z.object({
    title: z.string().min(6).max(255),
    type: z.enum(["sale", "rent"], { required_error: "Type is required" }),
    price: z.number().positive("Price must be greater than 0"),

    address: z.object({
        street: z.string().min(1, "Street is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        country: z.string().min(1, "Country is required"),
        postalCode: z.string().regex(
                /^(\d{5,6}|[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d)$/,
                "Invalid postal code"
            ),
        coordinates: z.object({
            type: z.literal("Point"),
            coordinates: z.tuple([
                z.number().min(-180).max(180),
                z.number().min(-90).max(90),
            ]),
        }),
    }),

    interior: z.object({
        bedrooms: z.array(
            z.object({
                name: z.string(),
                features: z.array(z.string()).optional(),
                level: z.string().optional(),
                area: z.number().optional(),
                dimensions: z.string().optional(),
            })
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
    }),

    heating: z.string(),
    cooling: z.string().optional(),
    appliances: z.object({
        included: z.array(z.string()).optional(),
        laundry: z.string().optional(),
    }),

    features: z.object({
        flooring: z.string().optional(),
        hasFireplace: z.boolean().optional(),
        basement: z.string().optional(),
        patioAndPorch: z.array(z.string()).optional(),
        exterior: z.array(z.string()).optional(),
    }),

    interiorArea: z.object({
        livingAreaRange: z.string().optional(),
    }),

    parking: z.object({
        totalSpaces: z.number().min(0),
        features: z.array(z.string()).optional(),
        hasGarage: z.boolean(),
    }),

    construction: z.object({
        typeAndStyle: z.object({
            homeType: z.string(),
            propertySubtype: z.string(),
        }),
        materials: z.array(z.string()).optional(),
        condition: z.string().optional(),
        newConstruction: z.boolean(),
    }),

    hoa: z.object({
        hasHoa: z.boolean(),
        servicesIncluded: z.array(z.string()).optional(),
    }),

    financial: z.object({
        dateOnMarket: z.string().regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Invalid date format, use YYYY-MM-DD"
        ),
    }),

    location: z.object({
        region: z.string(),
        subdivision: z.string().optional(),
    }),
});
