// 'use client';

// import { useEffect } from 'react';

// export default function PaymentProcessor({ sessionId }: { sessionId: string }) {
//   useEffect(() => {
//     const processPayment = async () => {
//       try {
//         await fetch('/api/payment-success', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ sessionId }),
//         });
//       } catch (error) {
//         console.error('Payment processing error:', error);
//       }
//     };

//     processPayment();
//   }, [sessionId]);

//   return null; // no UI needed
//}
