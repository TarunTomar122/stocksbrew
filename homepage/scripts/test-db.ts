
import { getSummaries } from '../lib/mongodb';
import * as fs from 'fs';
import * as path from 'path';

// Simple .env loader
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envConfig = fs.readFileSync(envPath, 'utf8');
      envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
          process.env[key] = value;
        }
      });
      console.log('.env loaded');
    } else {
      console.log('.env file not found');
    }
  } catch (e) {
    console.error('Error loading .env:', e);
  }
}

loadEnv();

async function test() {
  console.log('Testing getSummaries...');
  try {
    const summaries = await getSummaries();
    console.log(`Successfully fetched ${summaries.length} summaries.`);
    if (summaries.length > 0) {
      console.log('First summary:', JSON.stringify(summaries[0], null, 2));
      
      // Check if any summary has data
      const firstWithData = summaries.find(s => Object.keys(s.summaries).length > 0);
      if (firstWithData) {
        console.log('First summary with data:', firstWithData.date);
        
        Object.entries(firstWithData.summaries).forEach(([company, summary]) => {
            if (typeof summary.tldr !== 'string') {
                console.error(`[ERROR] ${company} TLDR is not string:`, typeof summary.tldr, summary.tldr);
            }
            
            if (summary.key_points) {
                if (!Array.isArray(summary.key_points)) {
                    console.error(`[ERROR] ${company} key_points is not array:`, typeof summary.key_points);
                } else {
                    summary.key_points.forEach((point, i) => {
                        if (typeof point !== 'string') {
                            console.error(`[ERROR] ${company} key_point[${i}] is not string:`, typeof point, point);
                        }
                    });
                }
            }

            if (summary.action_items) {
                if (!Array.isArray(summary.action_items)) {
                    console.error(`[ERROR] ${company} action_items is not array:`, typeof summary.action_items);
                } else {
                    summary.action_items.forEach((item, i) => {
                        if (typeof item !== 'string') {
                            console.error(`[ERROR] ${company} action_item[${i}] is not string:`, typeof item, item);
                        }
                    });
                }
            }
        });
        console.log('Scan complete.');
      } else {
        console.log('No summaries have data.');
      }
    } else {
      console.log('No summaries found.');
    }
  } catch (error) {
    console.error('Error in test:', error);
  }
  process.exit(0);
}

test();
