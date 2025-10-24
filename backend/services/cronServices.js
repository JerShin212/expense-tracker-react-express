import cron from 'node-cron';
import { RecurringTransaction } from '../models/RecurringTransaction.js';
import { Transaction } from '../models/Transaction.js';
import { Op } from 'sequelize';

// Helper function to calculate next date
function calculateNextDate(currentDate, frequency) {
    const date = new Date(currentDate);

    switch (frequency) {
        case 'daily':
            date.setDate(date.getDate() + 1);
            break;
        case 'weekly':
            date.setDate(date.getDate() + 7);
            break;
        case 'monthly':
            date.setMonth(date.getMonth() + 1);
            break;
        case 'yearly':
            date.setFullYear(date.getFullYear() + 1);
            break;
    }

    return date.toISOString().split('T')[0];
}

// Function to generate recurring transactions
async function generateRecurringTransactions() {
    try {
        console.log('🔄 Running recurring transaction generation...');

        const today = new Date().toISOString().split('T')[0];

        // Find all active recurring transactions that are due
        const dueRecurring = await RecurringTransaction.findAll({
            where: {
                isActive: true,
                nextDate: {
                    [Op.lte]: today
                },
                [Op.or]: [
                    { endDate: null },
                    { endDate: { [Op.gte]: today } }
                ]
            }
        });

        console.log(`📋 Found ${dueRecurring.length} recurring transactions to process`);

        let generatedCount = 0;
        let errorCount = 0;

        for (const recurring of dueRecurring) {
            try {
                // Create the transaction
                await Transaction.create({
                    userId: recurring.userId,
                    categoryId: recurring.categoryId,
                    type: recurring.type,
                    amount: recurring.amount,
                    description: `${recurring.description} (Auto-generated)`,
                    date: recurring.nextDate
                });

                generatedCount++;

                // Update recurring transaction
                recurring.lastGenerated = recurring.nextDate;
                recurring.nextDate = calculateNextDate(recurring.nextDate, recurring.frequency);

                // Check if we've passed the end date
                if (recurring.endDate && recurring.nextDate > recurring.endDate) {
                    recurring.isActive = false;
                    console.log(`⏸️  Deactivated recurring: ${recurring.description} (end date reached)`);
                }

                await recurring.save();
            } catch (err) {
                console.error(`❌ Error generating transaction for recurring ${recurring.id}:`, err.message);
                errorCount++;
            }
        }

        console.log(`✅ Generated ${generatedCount} transactions, ${errorCount} errors`);

        return {
            generated: generatedCount,
            errors: errorCount
        };
    } catch (error) {
        console.error('❌ Cron job error:', error);
        return {
            generated: 0,
            errors: 1
        };
    }
}

// Initialize cron jobs
function initializeCronJobs() {
    // Run every day at 00:01 (1 minute past midnight)
    cron.schedule('1 0 * * *', async () => {
        console.log('⏰ Daily cron job triggered at', new Date().toISOString());
        await generateRecurringTransactions();
    }, {
        timezone: "Asia/Kuala_Lumpur" // Set to your timezone
    });

    // Optional: Run every hour (for testing or more frequent generation)
    // Uncomment this if you want hourly checks
    /*
    cron.schedule('0 * * * *', async () => {
      console.log('⏰ Hourly cron job triggered at', new Date().toISOString());
      await generateRecurringTransactions();
    }, {
      timezone: "Asia/Kuala_Lumpur"
    });
    */

    console.log('✅ Cron jobs initialized');
    console.log('📅 Recurring transactions will be generated daily at 00:01');
}

export { initializeCronJobs, generateRecurringTransactions };