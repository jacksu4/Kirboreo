import { defineField, defineType } from 'sanity'

export const stockAnalysisType = defineType({
    name: 'stockAnalysis',
    title: 'Stock Analysis',
    type: 'document',
    fields: [
        defineField({
            name: 'ticker',
            title: 'Ticker Symbol',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'companyName',
            title: 'Company Name',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'kirboreoScore',
            title: 'Kirboreo Score (0-10)',
            type: 'number',
            validation: (rule) => rule.required().min(0).max(10),
        }),
        defineField({
            name: 'scoreLabel',
            title: 'Score Label',
            type: 'string',
            options: {
                list: [
                    { title: 'Bullish', value: 'Bullish' },
                    { title: 'Neutral', value: 'Neutral' },
                    { title: 'Bearish', value: 'Bearish' },
                ],
            },
        }),
        defineField({
            name: 'metrics',
            title: 'Score Metrics',
            type: 'object',
            fields: [
                defineField({ name: 'growth', title: 'Growth (0-100)', type: 'number' }),
                defineField({ name: 'value', title: 'Value (0-100)', type: 'number' }),
                defineField({ name: 'momentum', title: 'Momentum (0-100)', type: 'number' }),
            ],
        }),
    ],
    preview: {
        select: {
            title: 'ticker',
            subtitle: 'companyName',
        },
    },
})
