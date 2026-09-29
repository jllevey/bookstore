// Edit these numbers to change how bills are calculated.
module.exports = {
  taxRate: 0.05,            // 5% demo tax. Change to 0 or your own rate.
  deliveryFee: 40,          // charged when the book total is below the free-delivery amount
  freeDeliveryOver: 500     // book total (in rupees) at which delivery becomes free
};
