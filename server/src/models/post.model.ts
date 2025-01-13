import mongoose from "mongoose";

export interface PostDocument extends mongoose.Document {
    title: string;
    type: "sale" | "rent";
    price: number;
    photos?: string[];
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        postalCode?: string;
        coordinates?: {
            type: "Point";
            coordinates: [number, number];
        };
    };
    agent: {
        id: mongoose.Types.ObjectId;
        firstName: string;
        lastName: string;
    };
    interior?: {
        bedrooms?: {
            name: string;
            features?: string[];
            level?: string;
            area?: number;
            dimensions?: string;
        }[];
        bathrooms?: number;
        kitchen?: {
            features?: string[];
            level?: string;
            area?: number;
            dimensions?: string;
        };
        livingRoom?: {
            features?: string[];
            level?: string;
            area?: number;
            dimensions?: string;
        };
        diningRoom?: {
            features?: string[];
            level?: string;
            area?: number;
            dimensions?: string;
        };
    };
    heating?: string;
    cooling?: string;
    appliances?: {
        included?: string[];
        laundry?: string;
    };
    features?: {
        flooring?: string;
        hasFireplace?: boolean;
        basement?: string;
        patioAndPorch?: string[];
        exterior?: string[];
    };
    interiorArea?: {
        livingAreaRange?: string;
    };
    parking?: {
        totalSpaces?: number;
        features?: string[];
        hasGarage?: boolean;
    };
    construction?: {
        typeAndStyle?: {
            homeType?: string;
            propertySubtype?: string;
        };
        materials?: string[];
        condition?: string;
        newConstruction?: boolean;
    };
    hoa?: {
        hasHoa?: boolean;
        servicesIncluded?: string[];
    };
    financial?: {
        dateOnMarket?: string;
    };
    location?: {
        region?: string;
        subdivision?: string;
    };
    status: "draft" | "published";
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new mongoose.Schema<PostDocument>(
    {
        title: { type: String, required: true, minlength: 6, maxlength: 255 },
        type: { type: String, enum: ["sale", "rent"], required: true },
        price: { type: Number, required: true, min: 0 },
        photos: {
            type: [String],
            validate: {
                validator: (value: string[]) =>
                    !value || value.every((url) => /^https?:\/\/.+$/.test(url)),
                message: "Invalid URL in photos",
            },
        },
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String },
            postalCode: { type: String, match: /^(\d{5,6}|[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d)$/ },
            coordinates: {
                type: {
                    type: String,
                    enum: ["Point"],
                },
                coordinates: {
                    type: [Number],
                },
            },
        },
        agent: {
            id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
        },
        interior: {
            bedrooms: [
                {
                    name: { type: String },
                    features: { type: [String] },
                    level: { type: String },
                    area: { type: Number },
                    dimensions: { type: String },
                },
            ],
            bathrooms: { type: Number, min: 0 },
            kitchen: {
                features: { type: [String] },
                level: { type: String },
                area: { type: Number },
                dimensions: { type: String },
            },
            livingRoom: {
                features: { type: [String] },
                level: { type: String },
                area: { type: Number },
                dimensions: { type: String },
            },
            diningRoom: {
                features: { type: [String] },
                level: { type: String },
                area: { type: Number },
                dimensions: { type: String },
            },
        },
        heating: { type: String },
        cooling: { type: String },
        appliances: {
            included: { type: [String] },
            laundry: { type: String },
        },
        features: {
            flooring: { type: String },
            hasFireplace: { type: Boolean },
            basement: { type: String },
            patioAndPorch: { type: [String] },
            exterior: { type: [String] },
        },
        interiorArea: {
            livingAreaRange: { type: String },
        },
        parking: {
            totalSpaces: { type: Number, min: 0 },
            features: { type: [String] },
            hasGarage: { type: Boolean },
        },
        construction: {
            typeAndStyle: {
                homeType: { type: String },
                propertySubtype: { type: String },
            },
            materials: { type: [String] },
            condition: { type: String },
            newConstruction: { type: Boolean },
        },
        hoa: {
            hasHoa: { type: Boolean },
            servicesIncluded: { type: [String] },
        },
        financial: {
            dateOnMarket: {
                type: String,
                match: /^\d{4}-\d{2}-\d{2}$/,
            },
        },
        location: {
            region: { type: String },
            subdivision: { type: String },
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            required: true,
            default: "draft",
        },
    },
    { timestamps: true }
);

const PostModel = mongoose.model<PostDocument>("Post", postSchema);
export default PostModel;
