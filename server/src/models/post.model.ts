import mongoose from "mongoose";

export interface PostDocument extends mongoose.Document {
    title: string;
    type: "sale" | "rent";
    price: number;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string;
        coordinates: {
            type: "Point";
            coordinates: [number, number];
        };
    };
    agent: {
        id: mongoose.Types.ObjectId;
        firstName: string;
        lastName: string;
    };
    interior: {
        bedrooms: {
            name: string;
            features?: string[];
            level?: string;
            area?: number;
            dimensions?: string;
        }[];
        bathrooms: number;
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
    heating: string;
    cooling?: string;
    appliances: {
        included?: string[];
        laundry?: string;
    };
    features: {
        flooring?: string;
        hasFireplace?: boolean;
        basement?: string;
        patioAndPorch?: string[];
        exterior?: string[];
    };
    interiorArea?: {
        livingAreaRange?: string;
    };
    parking: {
        totalSpaces: number;
        features?: string[];
        hasGarage: boolean;
    };
    construction: {
        typeAndStyle: {
            homeType: string;
            propertySubtype: string;
        };
        materials?: string[];
        condition?: string;
        newConstruction: boolean;
    };
    hoa: {
        hasHoa: boolean;
        servicesIncluded?: string[];
    };
    financial: {
        dateOnMarket: string;
    };
    location: {
        region: string;
        subdivision?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new mongoose.Schema<PostDocument>(
    {
        title: { type: String, required: true, minlength: 6, maxlength: 255 },
        type: { type: String, enum: ["sale", "rent"], required: true },
        price: { type: Number, required: true, min: 0 },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            country: { type: String, required: true },
            postalCode: { type: String, required: true, minlength: 4, maxlength: 6 },
            coordinates: {
                type: {
                    type: String,
                    enum: ["Point"],
                    required: true,
                },
                coordinates: {
                    type: [Number],
                    required: true,
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
                    name: { type: String, required: true },
                    features: { type: [String] },
                    level: { type: String },
                    area: { type: Number },
                    dimensions: { type: String },
                },
            ],
            bathrooms: { type: Number, required: true, min: 0 },
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
        heating: { type: String, required: true },
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
            totalSpaces: { type: Number, required: true, min: 0 },
            features: { type: [String] },
            hasGarage: { type: Boolean, required: true },
        },
        construction: {
            typeAndStyle: {
                homeType: { type: String, required: true },
                propertySubtype: { type: String, required: true },
            },
            materials: { type: [String] },
            condition: { type: String },
            newConstruction: { type: Boolean, required: true },
        },
        hoa: {
            hasHoa: { type: Boolean, required: true },
            servicesIncluded: { type: [String] },
        },
        financial: {
            dateOnMarket: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
        },
        location: {
            region: { type: String, required: true },
            subdivision: { type: String },
        },
    },
    { timestamps: true }
);

const PostModel = mongoose.model<PostDocument>("Post", postSchema);
export default PostModel;
