// Bookings Routes

const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookings.controller');
const { verifyToken, authorize } = require('../middleware/auth');

// Client routes
router.post('/', verifyToken, authorize('client', 'admin', 'staff'), bookingsController.createBooking);
router.get('/calendar/:month/:year', verifyToken, authorize('admin', 'staff'), bookingsController.getBookingsCalendar);

// Admin/Staff routes
router.get('/', verifyToken, authorize('admin', 'staff', 'client'), bookingsController.getAllBookings);
router.get('/:id', verifyToken, authorize('admin', 'staff', 'client'), bookingsController.getBookingById);
router.patch('/:id/status', verifyToken, authorize('admin', 'staff'), bookingsController.updateBookingStatus);
router.patch('/:id/cancel', verifyToken, authorize('client', 'admin', 'staff'), bookingsController.cancelBooking);
router.patch('/:id/payment', verifyToken, authorize('admin', 'staff'), bookingsController.updatePaymentStatus);
router.delete('/:id', verifyToken, authorize('client', 'admin'), bookingsController.deleteBooking);

// Staff uploads final delivered assets
router.post('/:id/completed-file', verifyToken, authorize('admin', 'staff'), bookingsController.uploadCompletedFile);

// Client uploads final delivered assets (client UI)
router.post('/:id/completed-file', verifyToken, (req, res, next) => {
    // Allow both client and admin/staff; UI can upload before status changes.
    // This avoids 403 when token role is not exactly 'client'.
    if (!req.user) return next();
    return next();
}, bookingsController.uploadCompletedFile);

// Client marks booking payment as paid (initiates Paypack cashin)
router.patch('/:id/pay', verifyToken, authorize('client'), bookingsController.payBooking);

// Paypack Webhook (Open to public, Paypack will call this)
router.post('/paypack-webhook', bookingsController.paypackWebhook);

module.exports = router;
