import { User } from "../models/Users.js";
import { validationResult } from 'express-validator';
import { currencies } from "../config/currencies.js";

export const getSettings = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        res.status(200).json({
            success: true,
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                currency: user.currency
            }
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings'
        });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const user = await User.findByPk(req.user.id);
        const { firstName, lastName, currency } = req.body;

        // Validate currency code
        if (currency) {
            const validCurrency = currencies.find(c => c.code === currency);
            if (!validCurrency) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid currency code'
                });
            }
        }

        await user.update({
            firstName: firstName !== undefined ? firstName : user.firstName,
            lastName: lastName !== undefined ? lastName : user.lastName,
            currency: currency || user.currency
        });

        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            data: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                currency: user.currency
            }
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings'
        });
    }
};

export const getCurrencies = async (req, res) => {
    res.status(200).json({
        success: true,
        data: currencies
    });
}