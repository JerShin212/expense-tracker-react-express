import api from './api.js';

// Export transactions to PDF
export const exportPDF = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/export/pdf?${queryString}` : '/export/pdf';

        const response = await api.get(url, {
            responseType: 'blob' // Important for file download
        });

        // Create blob from response
        const blob = new Blob([response.data], { type: 'application/pdf' });

        // Create download link
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        link.download = `ExpenseFlow-Receipt-${timestamp}.pdf`;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        return { success: true };
    } catch (error) {
        throw error.response?.data || { message: 'Failed to export PDF' };
    }
};