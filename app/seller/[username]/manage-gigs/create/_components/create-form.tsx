"use client"

import { z } from "zod"
import { useState } from "react"
import { useQuery } from "convex/react"
import { useApiMutation } from "@/hooks/use-api-mutation"
import { api } from "@/convex/_generated/api"
import { Doc, Id } from "@/convex/_generated/dataModel"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateFormProps {
    username: string;
}

const CreateFormSchema = z.object({
    title: z.string()
        .min(20, {message: "Title must be at least 20 characters long"})
        .max(100, {message: "Title must be at most 100 characters long"}),
    category: z.string({required_error: "Please select a category"}),
    subcategory: z.string({required_error: "Please select a subcategory"}),
});

type CreateFormValues = z.infer<typeof CreateFormSchema>;

const defaultValues: Partial<CreateFormValues> = {
    title: "",
}

export const CreateForm = ({
    username
} : CreateFormProps) => {
    const categories = useQuery(api.categories.get);
    const [subcategories, setSubcategories] = useState<Doc<"subcategories">[]>([]);
    const {
        mutate,
        pending
    } = useApiMutation(api.gig.create)
    const router = useRouter();

    const form = useForm<CreateFormValues>({
        resolver: zodResolver(CreateFormSchema),
        defaultValues,
        mode: "onChange",
    });

    function handleCategoryChange(categoryName: string) {
        if (categories === undefined) return;
        const selectedCategory = categories.find(category => category.name === categoryName);
        if (selectedCategory) {
            setSubcategories(selectedCategory.subcategories);
        }
    }

    function onSubmit(data: CreateFormValues) {
        mutate({
            title: data.title,
            description: "",
            subcategory: data.subcategory,
        }).then((gigId: Id<"gigs">) => {
            toast.info("Gig created successfully");
            router.push(`/seller/${username}/manage-gigs/edit/${gigId}`);
        }).catch(() => {
            toast.error("Failed to create gig");
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="My gig title" {...field} />
                            </FormControl>
                            <FormDescription>
                                Create a catchy title for your gig that summarises what you offer.
                            </FormDescription>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                                onValueChange={(categoryName: string) =>{
                                    field.onChange(categoryName);
                                    handleCategoryChange(categoryName);
                                }}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category">
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                                {categories && (
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem 
                                                key={category._id} 
                                                value={category.name}>
                                                    {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                )}
                            </Select>
                            <FormDescription>
                               Select the most relevant category for your gig.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="subcategory"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Subcategory</FormLabel>
                            <Select 
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subcategory" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subcategories.map((subcategories, index) => (
                                        <SelectItem key={index} value={subcategories._id}>
                                            {subcategories.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Select the most relevant subcategory for your gig.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={pending}>Save</Button>
            </form>
        </Form>
    )
}