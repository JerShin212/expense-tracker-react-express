import PDFDocument from 'pdfkit';
import { Transaction } from '../models/Transaction.js';
import { Category } from '../models/Category.js';
import { User } from '../models/Users.js';
import { Op } from 'sequelize';

export const exportPDF = async (req, res) => {
    try {
        const { startDate, endDate, type, categoryId } = req.query;

        const whereClause = { userId: req.user.id };

        if (type && (type === 'income' || type === 'expense')) {
            whereClause.type = type;
        }

        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) {
                whereClause.date[Op.gte] = startDate;
            }
            if (endDate) {
                whereClause.date[Op.lte] = endDate;
            }
        }

        const transactions = await Transaction.findAll({
            where: whereClause,
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'color', 'icon', 'type']
                }
            ],
            order: [['date', 'DESC']]
        });

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const balance = totalIncome - totalExpense;

        // Get user info
        const user = await User.findByPk(req.user.id);
        const currency = getCurrencySymbol(user.currency || 'USD');

        // Create PDF
        const doc = new PDFDocument({
            margin: 50,
            size: 'A4'
        });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=transactions-${Date.now()}.pdf`);

        // Pipe PDF to response
        doc.pipe(res);

        // Add content
        generatePDF(doc, transactions, {
            totalIncome,
            totalExpense,
            balance,
            currency,
            user,
            startDate,
            endDate
        });

        // Finalize PDF
        doc.end();
    } catch (error) {
        console.error('Export PDF error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export PDF'
        });
    }
};

// Helper function to generate PDF content
function generatePDF(doc, transactions, data) {
    const { totalIncome, totalExpense, balance, currency, user, startDate, endDate } = data;

    // Colors
    const primaryColor = '#4f46e5'; // Indigo
    const greenColor = '#10b981';
    const redColor = '#ef4444';
    const grayColor = '#6b7280';
    const lightGray = '#f3f4f6';

    // Header with gradient effect
    doc.rect(0, 0, doc.page.width, 150).fill(primaryColor);

    // Logo/Title
    doc.fillColor('white')
        .fontSize(32)
        .font('Helvetica-Bold')
        .text('ExpenseFlow', 50, 40);

    doc.fontSize(16)
        .font('Helvetica')
        .text('Transaction Receipt', 50, 80);

    // Date info
    doc.fontSize(10)
        .text(`Generated: ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`, 50, 110);

    if (startDate || endDate) {
        const dateRange = `Period: ${startDate ? new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Beginning'} - ${endDate ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Present'}`;
        doc.text(dateRange, 50, 125);
    }

    // User info (top right)
    const accountLabel = sanitizeText(user.firstName) || sanitizeText(user.email) || '-';
    const currencyLabel = sanitizeText(currency) || currency;

    doc.fontSize(10)
        .text(`Account: ${accountLabel}`, doc.page.width - 250, 40, { width: 200, align: 'right' })
        .text(`Currency: ${currencyLabel}`, doc.page.width - 250, 55, { width: 200, align: 'right' });

    // Move down after header
    doc.moveDown(6);

    // Summary Section
    const summaryY = 180;

    // Summary box background
    doc.rect(50, summaryY, doc.page.width - 100, 140)
        .fill(lightGray);

    doc.fillColor('#1f2937')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('SUMMARY', 70, summaryY + 20);

    // Summary grid
    const col1X = 70;
    const col2X = doc.page.width / 2;
    const summaryStartY = summaryY + 50;

    // Total Income
    doc.fontSize(10)
        .font('Helvetica')
        .fillColor(grayColor)
        .text('Total Income:', col1X, summaryStartY);

    doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor(greenColor)
        .text(`${currency}${formatNumber(totalIncome)}`, col1X, summaryStartY + 15);

    // Total Expenses
    doc.fontSize(10)
        .font('Helvetica')
        .fillColor(grayColor)
        .text('Total Expenses:', col2X, summaryStartY);

    doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor(redColor)
        .text(`${currency}${formatNumber(totalExpense)}`, col2X, summaryStartY + 15);

    // Balance
    doc.fontSize(10)
        .font('Helvetica')
        .fillColor(grayColor)
        .text('Balance:', col1X, summaryStartY + 50);

    doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor(balance >= 0 ? greenColor : redColor)
        .text(`${currency}${formatNumber(balance)}`, col1X, summaryStartY + 65);

    // Transaction Count
    doc.fontSize(10)
        .font('Helvetica')
        .fillColor(grayColor)
        .text('Transactions:', col2X, summaryStartY + 50);

    doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#1f2937')
        .text(`${transactions.length}`, col2X, summaryStartY + 65);

    // Transactions Section
    let currentY = summaryY + 150;

    doc.fillColor('#1f2937')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('TRANSACTIONS', 50, currentY);

    currentY += 30;

    if (transactions.length === 0) {
        doc.fontSize(10)
            .font('Helvetica')
            .fillColor(grayColor)
            .text('No transactions found for the selected period.', 50, currentY);
    } else {
        // Table headers
        const tableTop = currentY;
        const dateX = 55;
        const categoryX = 120;
        const descX = 250;
        const amountX = doc.page.width - 150;

        // Header background
        doc.rect(50, tableTop, doc.page.width - 100, 25)
            .fill(primaryColor);

        doc.fillColor('white')
            .fontSize(10)
            .font('Helvetica-Bold')
            .text('Date', dateX, tableTop + 8)
            .text('Category', categoryX, tableTop + 8)
            .text('Description', descX, tableTop + 8)
            .text('Amount', amountX, tableTop + 8);

        currentY = tableTop + 30;

        // Transaction rows
        transactions.forEach((transaction, index) => {
            // Check if we need a new page
            if (currentY > doc.page.height - 100) {
                doc.addPage();
                currentY = 50;
            }

            // Alternating row colors
            if (index % 2 === 0) {
                doc.rect(50, currentY - 5, doc.page.width - 100, 25)
                    .fill(lightGray);
            }

            const isIncome = transaction.type === 'income';
            const amountColor = isIncome ? greenColor : redColor;
            const amountPrefix = isIncome ? '+' : '-';

            // Date
            doc.fillColor('#1f2937')
                .fontSize(9)
                .font('Helvetica')
                .text(
                    new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    }),
                    dateX,
                    currentY
                );

            // Category name (emoji-free)
            const categoryName = sanitizeText(transaction.category?.name) || 'Uncategorized';
            doc.text(
                categoryName,
                categoryX,
                currentY,
                { width: 120, ellipsis: true }
            );

            // Description
            const descriptionText = sanitizeText(transaction.description || '') || '-';
            doc.fillColor(grayColor)
                .text(
                    descriptionText,
                    descX,
                    currentY,
                    { width: 150, ellipsis: true }
                );

            // Amount
            doc.fillColor(amountColor)
                .font('Helvetica-Bold')
                .text(
                    `${amountPrefix}${currency}${formatNumber(transaction.amount)}`,
                    amountX,
                    currentY
                );

            currentY += 25;
        });
    }

    // Category Breakdown
    if (transactions.length > 0) {
        currentY += 30;

        // Check if we need a new page
        if (currentY > doc.page.height - 200) {
            doc.addPage();
            currentY = 50;
        }

        doc.fillColor('#1f2937')
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('CATEGORY BREAKDOWN', 50, currentY);

        currentY += 25;

        // Calculate category totals
        const categoryTotals = {};
        transactions.forEach(transaction => {
            const catName = transaction.category?.name || 'Uncategorized';
            const displayName = sanitizeText(catName) || 'Uncategorized';
            const catType = transaction.type;

            if (!categoryTotals[catName]) {
                categoryTotals[catName] = {
                    type: catType,
                    total: 0,
                    displayName
                };
            }
            categoryTotals[catName].total += parseFloat(transaction.amount);
        });

        // Sort by total (descending)
        const sortedCategories = Object.entries(categoryTotals)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10); // Top 10 categories

        // Display categories
        sortedCategories.forEach(([name, data]) => {
            if (currentY > doc.page.height - 50) {
                doc.addPage();
                currentY = 50;
            }

            const displayName = data.displayName || sanitizeText(name) || 'Uncategorized';

            doc.fillColor('#1f2937')
                .fontSize(10)
                .font('Helvetica')
                .text(displayName, 70, currentY);

            doc.fillColor(data.type === 'income' ? greenColor : redColor)
                .font('Helvetica-Bold')
                .text(
                    `${currency}${formatNumber(data.total)}`,
                    doc.page.width - 200,
                    currentY,
                    { width: 100, align: 'right' }
                );

            currentY += 20;
        });
    }

    // Footer
    const footerY = doc.page.height - doc.page.margins.bottom - 15;

    doc.fontSize(8)
        .fillColor(grayColor)
        .font('Helvetica')
        .text(
            'This receipt was generated by ExpenseFlow. For questions, please contact support.',
            doc.page.margins.left,
            footerY,
            {
                width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
                align: 'center'
            }
        );
}

// Helper function to remove emoji/symbols unsupported by default PDF fonts
function sanitizeText(value) {
    if (value === null || value === undefined) {
        return '';
    }
    return String(value)
        .replace(/\p{Extended_Pictographic}/gu, '')
        .replace(/[\u2600-\u27BF]/g, '')
        .replace(/[\uFE0F\u200D]/g, '')
        .trim();
}

// Helper function to format numbers
function formatNumber(num) {
    return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Helper function to get currency symbol
function getCurrencySymbol(code) {
    const symbols = {
        USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥',
        MYR: 'RM', SGD: 'S$', THB: '฿', IDR: 'Rp', PHP: '₱',
        INR: '₹', AUD: 'A$', CAD: 'C$', CHF: 'CHF', KRW: '₩',
        HKD: 'HK$', NZD: 'NZ$', SEK: 'kr', NOK: 'kr', DKK: 'kr',
        ZAR: 'R', BRL: 'R$', MXN: 'Mex$', AED: 'د.إ', SAR: 'SR'
    };
    return symbols[code] || code;
}
