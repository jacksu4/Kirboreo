'use server';

import { getStockChart, TimeRange } from '@/lib/yahoo';

export async function fetchStockChart(ticker: string, range: TimeRange) {
    const data = await getStockChart(ticker, range);
    return data;
}
