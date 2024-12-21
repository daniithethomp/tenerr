"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { CreateForm } from "./_components/create-form";
import { useEffect } from "react";

interface CreateGigProps {
    params: { 
        username: string;
    }
}

const CreateGig = ({
    params
} : CreateGigProps) => {
    
    // Seed categories
    // const insertCategory = useMutation(api.seedCategories.create);
    // useEffect(() => {
    //     insertCategory({});
    // });

    // Seed subcategories
    // const insertSubcategory = useMutation(api.seedSubcategories.create);
    // useEffect(() => {
    //     insertSubcategory({});
    // });
    return (
        <div className="flex justify-center">
            <CreateForm username={params.username} />
        </div>
    )
}

export default CreateGig;