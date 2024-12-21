import { mutation, query } from './_generated/server';
import { Id } from './_generated/dataModel';

const categories = [
    { name: 'Web Development' },
    { name: 'Graphic Design' },
    { name: 'Content Writing' },
    { name: 'Digital Marketing' },
    { name: 'Video Editing' },
    { name: 'Mobile App Development' },
    { name: 'SEO' },
    { name: 'Virtual Assistance' },
    { name: 'Data Entry' },
    { name: 'Customer Support' }
];

export const create = mutation({
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Unauthorized');
        }

        categories.map(async (category) => {
            await ctx.db.insert("categories", {
                name: category.name
            })
        })

        return;
    }
});