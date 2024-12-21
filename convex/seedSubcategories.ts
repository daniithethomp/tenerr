import { mutation, query } from './_generated/server';

const subcategories = [
    'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Web Design',
  'E-commerce Development',
  
  'Logo Design',
  'Illustration',
  'UI/UX Design',
  'Branding',
  'Print Design',
  
  'Blog Writing',
  'Copywriting',
  'Technical Writing',
  'Ghostwriting',
  'Editing & Proofreading',
  
  'Social Media Marketing',
  'Email Marketing',
  'Content Marketing',
  'PPC Advertising',
  'Affiliate Marketing',
  
  'Video Production',
  'Motion Graphics',
  'Animation',
  'Post-Production',
  'Color Grading',
  
  'iOS Development',
  'Android Development',
  'Cross-Platform Development',
  'Mobile UI/UX Design',
  'App Store Optimization',
  
  'On-Page SEO',
  'Off-Page SEO',
  'Technical SEO',
  'Local SEO',
  'SEO Audits',
  
  'Administrative Support',
  'Email Management',
  'Calendar Management',
  'Customer Service',
  'Research',
  
  'Data Collection',
  'Data Cleaning',
  'Data Analysis',
  'Spreadsheet Management',
  'Database Management',
  
  'Technical Support',
  'Live Chat Support',
  'Email Support',
  'Phone Support',
  'Help Desk Support'
];

export const create = mutation({
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error('Unauthorized');
        }

        const categories = await ctx.db.query("categories").collect();
        const subcategoriesCheck = await ctx.db.query("subcategories").collect();

        if (subcategoriesCheck.length > 0) return;

        await Promise.all(
            categories.flatMap((category,index) => {
                const categorySubcategories = subcategories.slice(index * 5, (index + 1) * 5);
                return categorySubcategories.map((subcategoryName) => {
                    ctx.db.insert("subcategories", {
                        name: subcategoryName,
                        categoryId: category._id
                    })
                })
            })
        );

        return;
    }
})