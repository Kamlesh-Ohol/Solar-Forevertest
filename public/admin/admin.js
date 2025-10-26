// // // Wait for the DOM to be ready
// // document.addEventListener('DOMContentLoaded', () => {

// //   // Get Firebase services from your firebase.js (assuming it's initialized there)
// //   const auth = firebase.auth();
// //   const db = firebase.firestore();

// //   // Get Page Sections
// //   const loginSection = document.getElementById('admin-login-section');
// //   const dashboardSection = document.getElementById('admin-dashboard-section');
  
// //   // Get Login Form
// //   const loginForm = document.getElementById('admin-login-form');
// //   const loginError = document.getElementById('admin-login-error');
  
// //   // Get Logout Button
// //   const logoutBtn = document.getElementById('admin-logout-btn');

// //   // =================================================================
// //   // 1. AUTHENTICATION
// //   // =================================================================

// //   // --- Handle Login ---
// //   if (loginForm) {
// //     loginForm.addEventListener('submit', (e) => {
// //       e.preventDefault();
// //       const email = loginForm['admin-email'].value;
// //       const password = loginForm['admin-password'].value;

// //       auth.signInWithEmailAndPassword(email, password)
// //         .then((userCredential) => {
// //           // Success! Handled by onAuthStateChanged
// //           console.log("Admin logged in", userCredential.user);
// //         })
// //         .catch((error) => {
// //           loginError.textContent = `Login failed: ${error.message}`;
// //           loginError.classList.remove('hidden');
// //         });
// //     });
// //   }

// //   // --- Handle Logout ---
// //   if (logoutBtn) {
// //     logoutBtn.addEventListener('click', () => {
// //       auth.signOut();
// //     });
// //   }

// //   // --- Auth State Listener ---
// //   // This controls showing/hiding the login page vs. the dashboard
// //   auth.onAuthStateChanged((user) => {
// //     if (user) {
// //       // User is logged in
// //       loginSection.classList.add('hidden');
// //       dashboardSection.classList.remove('hidden');
// //       // Load all the dynamic data for the dashboard
// //       loadPendingVerifications();
// //       loadBuyerQueries();
// //       loadMarketplaceItems();
// //     } else {
// //       // User is logged out
// //       loginSection.classList.remove('hidden');
// //       dashboardSection.classList.add('hidden');
// //     }
// //   });

// //   // =================================================================
// //   // 2. LOAD PENDING SELLER VERIFICATIONS (Answers your question)
// //   // =================================================================

// //   async function loadPendingVerifications() {
// //     const tableBody = document.querySelector('#seller-queries tbody');
// //     if (!tableBody) return;

// //     // Clear static/old data
// //     tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Loading...</td></tr>';

// //     try {
// //       const querySnapshot = await db.collection('sellQueries')
// //                                     .where('status', '==', 'pending_review')
// //                                     .orderBy('submittedAt', 'desc')
// //                                     .get();

// //       if (querySnapshot.empty) {
// //         tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">No pending verifications.</td></tr>';
// //         return;
// //       }
      
// //       let html = ''; // Build the HTML string

// //       // Loop through each pending query
// //       for (const doc of querySnapshot.docs) {
// //         const query = doc.data();
        
// //         // --- THIS IS THE "LINK" ---
// //         // Fetch the seller's name from the 'users' collection using sellerId
// //         let userName = 'Unknown User';
// //         try {
// //           const userDoc = await db.collection('users').doc(query.sellerId).get();
// //           if (userDoc.exists) {
// //             userName = userDoc.data().name || 'N/A';
// //           }
// //         } catch (e) {
// //           console.error("Error fetching user data:", e);
// //         }
        
// //         // Get submission date
// //         const date = query.submittedAt ? new Date(query.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A';

// //         // Add a new row to the HTML string
// //         html += `
// //           <tr class="border-b">
// //             <td class="p-4">${userName}</td>
// //             <td class="p-4">${query.panelParams || 'N/A'}</td>
// //             <td class="p-4 text-sm text-gray-500">${date}</td>
// //             <td class="p-4">
// //               <button class="view-details-btn bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-blue-200" 
// //                       data-doc-id="${doc.id}" 
// //                       data-modal-target="sellerQueryModal">
// //                 View Details
// //               </button>
// //             </td>
// //           </tr>
// //         `;
// //       }

// //       tableBody.innerHTML = html; // Add all new rows to the table at once

// //     } catch (error) {
// //       console.error("Error loading pending verifications: ", error);
// //       tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-500">Error loading data.</td></tr>';
// //     }
// //   }

// //   // =================================================================
// //   // 3. HANDLE MODAL CLICKS (To show the images)
// //   // =================================================================
// //   // =================================================================
// //   // 3. HANDLE MODAL CLICKS (To show the images)
// //   // =================================================================

// // // --- LISTENER 1: Opening the modal (clicks INSIDE the dashboard) ---
// //   dashboardSection.addEventListener('click', async (e) => {
    
// //     // Check if a "View Details" button was clicked
// //     if (e.target.matches('.view-details-btn') && e.target.dataset.modalTarget === 'sellerQueryModal') {
// //       const docId = e.target.dataset.docId;
// //       if (!docId) return;

// //       // Get the one modal from your HTML
// //       const modal = document.getElementById('sellerQueryModal1');
// //       if (!modal) return;
      
// //       // Show loading state
// //       modal.classList.remove('hidden');
// //       modal.querySelector('.modal-content').innerHTML = '<div class="p-8 text-center">Loading details...</div>';

// //       try {
// //         // Fetch the FULL data for this *one* document
// //         const queryDoc = await db.collection('sellQueries').doc(docId).get();
// //         if (!queryDoc.exists) throw new Error("Document not found.");
        
// //         const query = queryDoc.data();
        
// //         // Fetch the linked user's data
// //         const userDoc = await db.collection('users').doc(query.sellerId).get();
// //         const user = userDoc.exists ? userDoc.data() : {};

// //         // --- DYNAMICALLY BUILD THE MODAL CONTENT ---
// //         const modalContent = `
// //           <div class="flex justify-between items-center p-4 border-b">
// //             <h3 class="text-xl font-bold">Seller Verification</h3>
// //             <button data-modal-close="sellerQueryModal1" class="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
// //           </div>
          
// //           <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
// //             <div class="space-y-3">
// //               <h4 class="font-semibold text-lg border-b pb-2">Seller Information</h4>
// //               <div><strong>Name:</strong> ${user.name || 'N/A'}</div>
// //               <div><strong>Phone:</strong> ${query.sellerPhone || 'N/A'}</div>
// //               <div><strong>Address:</strong> ${user.address || 'N/A'}</div>
// //             </div>
            
// //             <div class="space-y-3">
// //               <h4 class="font-semibold text-lg border-b pb-2">Panel Information</h4>
// //               <div><strong>Parameters:</strong> ${query.panelParams || 'N/A'}</div>
// //               <div><strong>Purchased From:</strong> ${query.purchasedFrom || 'N/A'}</div>
// //               <div><strong>Purchase Date:</strong> ${query.purchaseDate || 'N/A'}</div>
// //               <div><strong>Price:</strong> ₹${query.price || 'N/A'}</div>

// //             <div class="space-y-2">
// //               <h4 class="font-semibold text-lg">Panel Image</h4>
// //               <a href="${query.panelImageURL}" target="_blank">
// //                 <img src="${query.panelImageURL}" alt="Panel Image" class="w-full h-48 object-cover rounded border">
// //               </a>
// //             </div>
            
// //             <div class="space-y-2">
// //               <h4 class="font-semibold text-lg">Receipt Image</h4>
// //               ${query.receiptImageURL ? `
// //                 <a href="${query.receiptImageURL}" target="_blank">
// //                   <img src="${query.receiptImageURL}" alt="Receipt Image" class="w-full h-48 object-cover rounded border">
// //                 </a>
// //               ` : '<p class="text-gray-500">No receipt uploaded.</p>'}
// //             </div>
// //           </div>
          
// //           <div class="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg gap-3">
// //             <button class="action-btn bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700"
// //                     data-action="disapprove" data-doc-id="${docId}">
// //               Disapprove Listing
// //             </button>
// //             <button class="action-btn bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
// //                     data-action="approve" data-doc-id="${docId}">
// //               Approve Listing
// //             </button>
// //           </div>
// //         `;
        
// //         // Inject the new content into the modal
// //         modal.querySelector('.modal-content').innerHTML = modalContent;

// //       } catch (error) {
// //         console.error("Error loading query details: ", error);
// //         modal.querySelector('.modal-content').innerHTML = `<div class="p-8 text-center text-red-500">Error: ${error.message}</div>`;
// //       }
// //     }

// //     // You can add the marketplace button logic here too
// //     if (e.target.matches('.view-marketplace-item-btn')) {
// //         // TODO: Add logic for opening the marketplace item modal
// //         console.log("Marketplace item clicked. Doc ID:", e.target.dataset.docId);
// //     }
// //   });


// //     // --- Handle Approval/Disapproval ---
// //     if (e.target.matches('.action-btn')) {
// //         const button = e.target;
// //         const action = button.dataset.action;
// //         const docId = button.dataset.docId; // Get docId from the button
        
// //         if (!action || !docId) {
// //             console.error("Action button missing action or docId");
// //             return;
// //         }

// //         const newStatus = (action === 'approve') ? 'approved' : (action === 'disapprove') ? 'rejected' : null;

// //         if (!newStatus) {
// //             console.error("Unknown action:", action);
// //             return;
// //         }

// //         button.disabled = true;
// //         button.textContent = 'Updating...';

// //         try {
// //             await db.collection('sellQueries').doc(docId).update({
// //                 status: newStatus
// //             });
            
// //             alert(`Listing ${newStatus} successfully!`);
            
// //             // Close the modal
// //             const modal = button.closest('.modal');
// //             if (modal) modal.classList.add('hidden');
            
// //             // Reload both lists
// //             loadPendingVerifications(); 
// //             loadMarketplaceItems(); 

// //         } catch (error) {
// //             console.error("Error updating status: ", error);
// //             alert(`Failed to update status: ${error.message}`);
            
// //             // Re-enable the button on error
// //             button.disabled = false;
// //             button.textContent = (action === 'approve') ? 'Approve Listing' : 'Disapprove Listing';
// //         }
// //     }

// //     // --- Handle closing modal by clicking backdrop ---
// //     if (e.target.matches('.modal')) {
// //         e.target.classList.add('hidden');
// //     }
// //     // --- Handle Approval/Disapproval ---
// //     if (e.target.matches('.action-btn')) {
// //         const button = e.target;
// //         const action = button.dataset.action;
// //         const docId = button.dataset.docId; // Get docId from the button

// //         if (!action || !docId) {
// //             console.error("Action button missing action or docId");
// //             return;
// //         }

// //         const newStatus = (action === 'approve') ? 'approved' : (action === 'disapprove') ? 'rejected' : null;

// //         if (!newStatus) {
// //             console.error("Unknown action:", action);
// //             return;
// //         }

// //         button.disabled = true;
// //         button.textContent = 'Updating...';

// //         try {
// //             await db.collection('sellQueries').doc(docId).update({
// //                 status: newStatus
// //             });

// //             alert(`Listing ${newStatus} successfully!`);

// //             // Close the modal
// //             const modal = button.closest('.modal');
// //             if (modal) modal.classList.add('hidden');

// //             // Reload both lists
// //             loadPendingVerifications(); 
// //             loadMarketplaceItems(); 

// //         } catch (error) {
// //             console.error("Error updating status: ", error);
// //             alert(`Failed to update status: ${error.message}`);

// //             // Re-enable the button on error
// //             button.disabled = false;
// //             button.textContent = (action === 'approve') ? 'Approve Listing' : 'Disapprove Listing';
// //         }
// //     }
// //   });

// //   // --- STUB FUNCTIONS (You need to build these next) ---
// //   function loadBuyerQueries() {
// //     console.log("Loading buyer queries...");
// //     // TODO: Write a function similar to loadPendingVerifications()
// //     // 1. Query 'buyQueries' and 'interestedQueries'
// //     // 2. Fetch linked user data from 'users'
// //     // 3. Build HTML and add it to the '#buyer-queries tbody'
// //   }
  
// //  // --- (NEW) Load Main Marketplace ---
// //     async function loadMarketplaceItems() {
// //     const container = document.getElementById('marketplace-management');
// //     if (!container) return;

// //     const grid = container.querySelector('.grid');
// //     if (!grid) return;

// //     grid.innerHTML = '<p class="col-span-4 text-center">Loading marketplace items...</p>';

// //     try {
// //       // Fetch all items that are NOT rejected or sold (i.e., approved or pending)
// //       const querySnapshot = await db.collection('sellQueries')
// //                                     .where('status', 'in', ['approved', 'pending_review'])
// //                                     .orderBy('submittedAt', 'desc')
// //                                     .get();
      
// //       if (querySnapshot.empty) {
// //         grid.innerHTML = '<p class="col-span-4 text-center">No items are currently in the marketplace.</p>';
// //         return;
// //       }

// //       let html = '';
// //       for (const doc of querySnapshot.docs) {
// //         const item = doc.data();
// //         const docId = doc.id;

// //         const isPending = item.status === 'pending_review';
        
// //         // Dynamically set styles based on status
// //         const badgeClass = isPending ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
// //         const badgeText = isPending ? 'Pending Verification' : 'Expert Verified';
// //         const cardStyle = isPending ? 'style="opacity:0.65;"' : '';
// //         const btnClass = isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700';
        
// //         html += `
// //           <div class="bg-white rounded-lg overflow-hidden shadow-md border flex flex-col" ${cardStyle}>
// //             <img src="${item.panelImageURL || 'https/via.placeholder.com/300'}" class="w-full h-48 object-cover" alt="Solar Panel">
// //             <div class="p-4 flex-1 flex flex-col">
// //               <span class="text-xs ${badgeClass} px-2 py-1 rounded-full self-start">${badgeText}</span>
// //               <h3 class="font-bold mt-2 text-lg text-gray-800">${item.panelParams}</h3>
// //               <p class="text-gray-600 text-sm">Condition: (Add field to form)</p>
// //               <p class="text-blue-700 font-bold text-xl mt-2">₹${item.price || 'N/A'}</p>
// //               <div class="mt-4 flex-1 flex items-end">
// //                 <button data-modal-target="marketplaceModal" data-doc-id="${docId}"
// //                   class="view-marketplace-item-btn w-full text-white font-semibold py-2 rounded-lg transition-colors ${btnClass}"
// //                   ${isPending ? 'disabled' : ''}>
// //                   View Details
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         `;
// //       }
// //       grid.innerHTML = html;

// //     } catch (error) {
// //       console.error("Error loading marketplace items: ", error);
// //       grid.innerHTML = `<p class="col-span-4 text-center text-red-500">Error loading items. Check console (F12) for an index error.</p>`;
// //     }
// //   }

// // });

// document.addEventListener('DOMContentLoaded', () => {

//   const auth = firebase.auth();
//   const db = firebase.firestore();

//   const loginSection = document.getElementById('admin-login-section');
//   const dashboardSection = document.getElementById('admin-dashboard-section');
//   const loginForm = document.getElementById('admin-login-form');
//   const loginError = document.getElementById('admin-login-error');
//   const logoutBtn = document.getElementById('admin-logout-btn');

//   // =================================================================
//   // 1. AUTHENTICATION
//   // =================================================================
//   if (loginForm) {
//     loginForm.addEventListener('submit', (e) => {
//       e.preventDefault();
//       const email = loginForm['admin-email'].value;
//       const password = loginForm['admin-password'].value;
//       auth.signInWithEmailAndPassword(email, password)
//         .then((userCredential) => console.log("Admin logged in"))
//         .catch((error) => {
//           loginError.textContent = `Login failed: ${error.message}`;
//           loginError.classList.remove('hidden');
//         });
//     });
//   }

//   if (logoutBtn) {
//     logoutBtn.addEventListener('click', () => auth.signOut());
//   }

//   auth.onAuthStateChanged((user) => {
//     if (user) {
//       loginSection.classList.add('hidden');
//       dashboardSection.classList.remove('hidden');
//       loadPendingVerifications();
//       loadBuyerQueries();
//       loadMarketplaceItems();
//       loadInterestedQueries();
//       loadSoldItems(); // <-- ADDED
//     } else {
//       loginSection.classList.remove('hidden');
//       dashboardSection.classList.add('hidden');
//     }
//   });

//   // =================================================================
//   // 2. LOAD DATA FUNCTIONS
//   // =================================================================
// // --- NEW: Load Interested Queries (Similar to loadPendingVerifications) ---
//   async function loadInterestedQueries() {
//     const tableBody = document.querySelector('#interested-queries tbody');
//     if (!tableBody) return;
//     tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Loading...</td></tr>';

//     try {
//       const querySnapshot = await db.collection('interestedQueries')
//                                     .orderBy('timestamp', 'desc')
//                                     .get();

//       if (querySnapshot.empty) {
//         tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">No current interest queries.</td></tr>';
//         return;
//       }
      
//       let html = ''; 
//       for (const doc of querySnapshot.docs) {
//         const item = doc.data();
//         // Use the name saved directly in the query for simplicity
//         const buyerName = item.userName || 'N/A'; 
//         const productTitle = item.productTitle || 'N/A';
//         const date = item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'N/A';

//         html += `
//           <tr class="border-b">
//             <td class="p-4">${buyerName}</td>
//             <td class="p-4 text-sm">${productTitle}</td>
//             <td class="p-4 text-sm text-gray-500">${date}</td>
//             <td class="p-4">
//               <button class="view-interested-btn bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-yellow-200" 
//                       data-doc-id="${doc.id}" 
//                       data-modal-target="interestedQueryModal">
//                 View
//               </button>
//             </td>
//           </tr>
//         `;
//       }
//       tableBody.innerHTML = html; 
//     } catch (error) {
//       console.error("Error loading interested queries: ", error);
//       tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-500">Error loading data.</td></tr>';
//     }
//   }
//   // --- NEW: Function to Load Interested Query Detail Modal ---
// // --- NEW: Function to Load Interested Query Detail Modal ---
// async function openInterestedQueryModal(docId) {
//     const modal = document.getElementById('interestedQueryModal');
//     if (!modal) return;
    
//     modal.classList.remove('hidden');
//     modal.querySelector('.modal-content').innerHTML = '<div class="p-8 text-center">Loading interest details...</div>';

//     try {
//         const doc = await db.collection('interestedQueries').doc(docId).get();
//         if (!doc.exists) throw new Error("Interest record not found.");
//         const item = doc.data();
        
//         const queryDate = item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleString() : 'N/A';

//         const modalContent = `
//             <div class="flex justify-between items-center p-4 border-b">
//                 <h3 class="text-xl font-bold">Interested Query Details</h3>
//                 <button data-modal-close="interestedQueryModal" class="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
//             </div>
//             <div class="p-6 space-y-4">
//                 <div class="space-y-3">
//                     <h4 class="font-semibold text-lg border-b pb-2">Buyer Information</h4>
//                     <div><strong>Name:</strong> ${item.userName || 'N/A'}</div>
//                     <div><strong>Phone:</strong> ${item.userPhone || 'N/A'}</div>
//                     <div><strong>Location:</strong> ${item.userLocation || 'N/A'}</div>
//                     <div><strong>Query Date:</strong> ${queryDate}</div>
//                 </div>
//                 <div class="space-y-3">
//                     <h4 class="font-semibold text-lg border-b pb-2">Panel of Interest</h4>
//                     <p class="text-lg font-medium">${item.productTitle || 'N/A'}</p>
//                     <p class="text-sm text-gray-600">This user clicked the "Interested?" button on the marketplace for this listing.</p>
//                 </div>
//             </div>
//             <div class="flex justify-between items-center p-4 bg-gray-50 border-t rounded-b-lg">
//                 <button class="action-btn bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
//                         data-action="find-match-interested" data-interested-query-id="${docId}" data-buyer-uid="${item.userId}">
//                   Sell/Match to Panel
//                 </button>
//                 <button data-modal-close="interestedQueryModal" class="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600">Close</button>
//             </div>
//         `;
//         modal.querySelector('.modal-content').innerHTML = modalContent;

//     } catch (error) {
//         console.error("Error loading interested query details:", error);
//         modal.querySelector('.modal-content').innerHTML = `<div class="p-8 text-center text-red-500">Error: ${error.message}</div>`;
//     }
// }

// // --- Function to Load Sold Item into Detail Modal ---
// async function loadSoldItemDetails(docId) {
//     const modal = document.getElementById('soldDetailModal');
//     if (!modal) return;
    
//     // Show the modal and a loading state
//     modal.classList.remove('hidden');
//     modal.querySelector('.modal-content').innerHTML = '<div class="p-8 text-center">Loading sale details...</div>';

//     try {
//         const doc = await db.collection('SoldSolar').doc(docId).get();
//         if (!doc.exists) throw new Error("Sale record not found.");
//         const item = doc.data();

//         const saleDate = item.saleDate ? new Date(item.saleDate.seconds * 1000).toLocaleDateString() : 'N/A';

//         const modalContent = `
//             <div class="flex justify-between items-center p-4 border-b">
//                 <h3 class="text-xl font-bold">Sold Item Details</h3>
//                 <button data-modal-close="soldDetailModal" class="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
//             </div>
//             <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
//                 <div class="space-y-3">
//                     <h4 class="font-semibold text-lg border-b pb-2">Panel & Sale Info</h4>
//                     <div><strong>Item:</strong> ${item.panelInfo.panelParams || 'N/A'}</div>
//                     <div><strong>Sale Price:</strong> ₹${item.salePrice || 'N/A'}</div>
//                     <div><strong>Sale Date:</strong> ${saleDate}</div>
//                     <div><strong>Original Price:</strong> ₹${item.panelInfo.price || 'N/A'}</div>
//                 </div>
//                 <div class="space-y-3">
//                     <h4 class="font-semibold text-lg border-b pb-2">Buyer Information</h4>
//                     <div><strong>Name:</strong> ${item.buyerInfo.name || 'N/A'}</div>
//                     <div><strong>Phone:</strong> ${item.buyerInfo.phone || 'N/A'}</div>
//                     <div><strong>Address:</strong> ${item.buyerInfo.address || 'N/A'}</div>
//                 </div>
//                 <div class="space-y-3 md:col-span-2">
//                     <h4 class="font-semibold text-lg border-b pb-2">Seller Information</h4>
//                     <div><strong>Name:</strong> ${item.sellerInfo.name || 'N/A'}</div>
//                     <div><strong>Phone:</strong> ${item.sellerInfo.phone || 'N/A'}</div>
//                     <div><strong>Address:</strong> ${item.sellerInfo.address || 'N/A'}</div>
//                 </div>
//                 <div class="space-y-2 md:col-span-2"><h4 class="font-semibold text-lg">Panel Image</h4>
//                     <a href="${item.panelInfo.panelImageURL}" target="_blank">
//                       <img src="${item.panelInfo.panelImageURL}" alt="Panel Image" class="w-full h-64 object-cover rounded border">
//                     </a>
//                 </div>
//             </div>
//             <div class="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg">
//                 <button data-modal-close="soldDetailModal" class="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600">Close</button>
//             </div>
//         `;
//         modal.querySelector('.modal-content').innerHTML = modalContent;

//     } catch (error) {
//         console.error("Error loading sold item details:", error);
//         modal.querySelector('.modal-content').innerHTML = `<div class="p-8 text-center text-red-500">Error: ${error.message}</div>`;
//     }
// }
//   async function loadPendingVerifications() {
//     const tableBody = document.querySelector('#seller-queries tbody');
//     if (!tableBody) return;
//     tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Loading...</td></tr>';
//     try {
//       const querySnapshot = await db.collection('sellQueries')
//                                     .where('status', '==', 'pending_review')
//                                     .orderBy('submittedAt', 'desc')
//                                     .get();
//       if (querySnapshot.empty) {
//         tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">No pending verifications.</td></tr>';
//         return;
//       }
//       let html = ''; 
//       for (const doc of querySnapshot.docs) {
//         const query = doc.data();
//         let userName = 'Unknown User';
//         try {
//           const userDoc = await db.collection('users').doc(query.sellerId).get();
//           if (userDoc.exists) userName = userDoc.data().name || 'N/A';
//         } catch (e) { console.error("Error fetching user:", e); }
//         const date = query.submittedAt ? new Date(query.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A';
//         html += `
//           <tr class="border-b">
//             <td class="p-4">${userName}</td><td class="p-4">${query.panelParams || 'N/A'}</td>
//             <td class="p-4 text-sm text-gray-500">${date}</td>
//             <td class="p-4">
//               <button class="view-details-btn bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-blue-200" 
//                       data-doc-id="${doc.id}" data-modal-target="sellerQueryModal">View Details</button>
//             </td>
//           </tr>`;
//       }
//       tableBody.innerHTML = html; 
//     } catch (error) {
//       console.error("Error loading pending verifications: ", error);
//       tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-500">Error loading data.</td></tr>';
//     }
//   }

//   async function loadBuyerQueries() {
//     const tableBody = document.querySelector('#buyer-queries tbody');
//     if (!tableBody) return;
//     tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Loading...</td></tr>';
//     try {
//       const querySnapshot = await db.collection('buyQueries')
//                                     .where('status', '==', 'pending_review') 
//                                     .orderBy('submittedAt', 'desc')
//                                     .get();
//       if (querySnapshot.empty) {
//         tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">No pending buyer queries.</td></tr>';
//         return;
//       }
//       let html = ''; 
//       for (const doc of querySnapshot.docs) {
//         const query = doc.data();
//         let userName = 'Unknown User';
//         try {
//           const userDoc = await db.collection('users').doc(query.buyerId).get();
//           if (userDoc.exists) userName = userDoc.data().name || 'N/A';
//         } catch (e) { console.error("Error fetching user:", e); }
//         const date = query.submittedAt ? new Date(query.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A';
//         html += `
//           <tr class="border-b">
//             <td class="p-4">${userName}</td><td class="p-4">Req: ${query.requiredWattage}W</td>
//             <td class="p-4 text-sm text-gray-500">${date}</td>
//             <td class="p-4">
//               <button class="view-buyer-btn bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-green-200" 
//                       data-doc-id="${doc.id}" data-modal-target="buyerQueryModal1">View</button>
//             </td>
//           </tr>`;
//       }
//       tableBody.innerHTML = html; 
//     } catch (error) {
//       console.error("Error loading buyer queries: ", error);
//       tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-500">Error loading data.</td></tr>';
//     }
//   }

// // --- Function to Load Marketplace Item into Edit Modal ---
// async function loadMarketplaceItemForEdit(docId) {
//     const modal = document.getElementById('editMarketplaceModal');
//     const form = document.getElementById('edit-marketplace-form');
//     if (!modal || !form) return;

//     modal.classList.remove('hidden');

//     try {
//         const doc = await db.collection('sellQueries').doc(docId).get();
//         if (!doc.exists) throw new Error("Listing not found.");
//         const data = doc.data();

//         // Populate Form Fields
//         document.getElementById('edit-market-doc-id').value = docId;
//         document.getElementById('edit-market-params').value = data.panelParams || '';
//         document.getElementById('edit-market-price').value = data.price || 0;
        
//         // --- ADDED: Populate the hidden sell-item button with the document ID ---
//         document.getElementById('sell-item-market-btn').dataset.sellQueryId = docId;


//     } catch (error) {
//         console.error("Error loading marketplace item:", error);
//         alert(`Error loading data: ${error.message}`);
//         modal.classList.add('hidden');
//     }
// }

//   // --- (NEW) Load Sold Items History ---
//   async function loadSoldItems() {
//     const tableBody = document.querySelector('#sold-items tbody');
//     if (!tableBody) return;
//     tableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center">Loading...</td></tr>';

//     try {
//       const querySnapshot = await db.collection('SoldSolar')
//                                     .orderBy('saleDate', 'desc')
//                                     .get();

//       if (querySnapshot.empty) {
//         tableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center">No items have been sold.</td></tr>';
//         return;
//       }
      
//       let html = ''; 
//       for (const doc of querySnapshot.docs) {
//         const item = doc.data();
//         html += `
//           <tr class="border-b">
//             <td class="p-4">${item.panelInfo.panelParams || 'N/A'}</td>
//             <td class="p-4">₹${item.salePrice || 'N/A'}</td>
//             <td class="p-4 text-sm">${item.buyerInfo.name || 'N/A'}</td>
//             <td class="p-4 text-sm">${item.sellerInfo.name || 'N/A'}</td>
//             <td class="p-4">
//               <button class="view-sold-btn bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-gray-200" 
//                       data-doc-id="${doc.id}" 
//                       data-modal-target="soldDetailModal">
//                 View
//               </button>
//             </td>
//           </tr>
//         `;
//       }
//       tableBody.innerHTML = html; 
//     } catch (error) {
//       console.error("Error loading sold items: ", error);
//       tableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-red-500">Error loading data.</td></tr>';
//     }
//   }

//   // --- Function to Load Marketplace Item into Edit Modal ---
// async function loadMarketplaceItemForEdit(docId) {
//     const modal = document.getElementById('editMarketplaceModal');
//     const form = document.getElementById('edit-marketplace-form');
//     if (!modal || !form) return;

//     modal.classList.remove('hidden');

//     try {
//         const doc = await db.collection('sellQueries').doc(docId).get();
//         if (!doc.exists) throw new Error("Listing not found.");
//         const data = doc.data();

//         // Populate Form Fields
//         document.getElementById('edit-market-doc-id').value = docId;
//         document.getElementById('edit-market-params').value = data.panelParams || '';
//         document.getElementById('edit-market-price').value = data.price || 0;
        
//     } catch (error) {
//         console.error("Error loading marketplace item:", error);
//         alert(`Error loading data: ${error.message}`);
//         modal.classList.add('hidden');
//     }
// }


// // --- Function to Save/Update Marketplace Item ---
// async function saveMarketplaceChanges(e) {
//     e.preventDefault();
//     const docId = document.getElementById('edit-market-doc-id').value;
//     const newPanelParams = document.getElementById('edit-market-params').value;
//     const newPrice = Number(document.getElementById('edit-market-price').value);
//     const saveButton = document.getElementById('save-marketplace-btn');
    
//     if (!docId || !newPanelParams || isNaN(newPrice)) {
//         alert("Please provide valid data.");
//         return;
//     }

//     saveButton.disabled = true;
//     saveButton.textContent = 'Saving...';

//     try {
//         await db.collection('sellQueries').doc(docId).update({
//             panelParams: newPanelParams,
//             price: newPrice,
//             // You could optionally set the status back to pending_review 
//             // if you require re-verification after any edit, but for small 
//             // edits like price/name, we'll keep it 'approved' for now.
//         });

//         alert("Listing updated successfully!");
//         document.getElementById('editMarketplaceModal').classList.add('hidden');
//         loadMarketplaceItems(); // Refresh the list
//     } catch (error) {
//         console.error("Error updating marketplace item:", error);
//         alert(`Update failed: ${error.message}`);
//     } finally {
//         saveButton.disabled = false;
//         saveButton.textContent = 'Save Changes';
//     }
// }

//   // =================================================================
//   // 3. MODAL AND ACTION LISTENERS
//   // =================================================================

  
//   // --- LISTENER 1: Opening modals (clicks INSIDE the dashboard) ---
//   dashboardSection.addEventListener('click', async (e) => {
//     // --- Handle "Sell Item" from Marketplace Edit Modal ---
//     if (e.target.matches('#sell-item-market-btn')) {
//         const sellQueryId = e.target.dataset.sellQueryId;
//         if (!sellQueryId) return console.error("Sell button missing sellQueryId");
        
//         // Close the edit modal
//         document.getElementById('editMarketplaceModal').classList.add('hidden');
        
//         // Open the match modal, but pass the sellQueryId this time
//         await openMatchModalForSale(sellQueryId);
//     }

//     // --- Handle Buyer "Find Match" ---
//     if (e.target.matches('.action-btn') && e.target.dataset.action === 'find-match') {
// // ... (existing logic)
//     // --- Handle Seller "View Details" button ---
//     if (e.target.matches('.view-details-btn')) {
//       const docId = e.target.dataset.docId;
//       if (!docId) return;
//       const modal = document.getElementById('sellerQueryModal1');
//       if (!modal) return;
//       modal.classList.remove('hidden');
//       modal.querySelector('.modal-content').innerHTML = '<div class="p-8 text-center">Loading details...</div>';
//       try {
//         const queryDoc = await db.collection('sellQueries').doc(docId).get();
//         if (!queryDoc.exists) throw new Error("Document not found.");
//         const query = queryDoc.data();
//         const userDoc = await db.collection('users').doc(query.sellerId).get();
//         const user = userDoc.exists ? userDoc.data() : {};
//         const modalContent = `
//           <div class="flex justify-between items-center p-4 border-b">
//             <h3 class="text-xl font-bold">Seller Verification</h3>
//             <button data-modal-close="sellerQueryModal1" class="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
//           </div>
//           <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
//             <div class="space-y-3"><h4 class="font-semibold text-lg border-b pb-2">Seller Information</h4>
//               <div><strong>Name:</strong> ${user.name || 'N/A'}</div>
//               <div><strong>Phone:</strong> ${query.sellerPhone || 'N/A'}</div>
//               <div><strong>Address:</strong> ${user.address || 'N/A'}</div>
//             </div>
//             <div class="space-y-3"><h4 class="font-semibold text-lg border-b pb-2">Panel Information</h4>
//               <div><strong>Parameters:</strong> ${query.panelParams || 'N/A'}</div>
//               <div><strong>Purchased From:</strong> ${query.purchasedFrom || 'N/A'}</div>
//               <div><strong>Purchase Date:</strong> ${query.purchaseDate || 'N/A'}</div>
//               <div><strong>Price:</strong> ₹${query.price || 0}</div> 
//             </div>
//             <div class="space-y-2"><h4 class="font-semibold text-lg">Panel Image</h4>
//               <a href="${query.panelImageURL}" target="_blank"><img src="${query.panelImageURL}" alt="Panel Image" class="w-full h-48 object-cover rounded border"></a>
//             </div>
//             <div class="space-y-2"><h4 class="font-semibold text-lg">Receipt Image</h4>
//               ${query.receiptImageURL ? `<a href="${query.receiptImageURL}" target="_blank"><img src="${query.receiptImageURL}" alt="Receipt Image" class="w-full h-48 object-cover rounded border"></a>` : '<p class="text-gray-500">No receipt uploaded.</p>'}
//             </div>
//           </div>
//           <div class="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg gap-3">
//             <button class="action-btn bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700"
//                     data-action="disapprove" data-doc-id="${docId}">Disapprove Listing</button>
//             <button class="action-btn bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
//                     data-action="approve" data-doc-id="${docId}">Approve Listing</button>
//           </div>`;
//         modal.querySelector('.modal-content').innerHTML = modalContent;
//       } catch (error) {
//         console.error("Error loading query details: ", error);
//         modal.querySelector('.modal-content').innerHTML = `<div class="p-8 text-center text-red-500">Error: ${error.message}</div>`;
//       }
//     }
//     // --- NEW: Handle Interested Query "View" button ---
//     if (e.target.matches('.view-interested-btn')) {
//         const docId = e.target.dataset.docId;
//         if (!docId) return;
//         await openInterestedQueryModal(docId); // <-- NEW FUNCTION CALL
//     }

//     // --- Handle Marketplace "Edit Listing" button ---
// // ... (rest of the existing listener logic continues below)

//     // --- Handle Buyer "View" button ---
//     if (e.target.matches('.view-buyer-btn')) {
//       const docId = e.target.dataset.docId;
//       if (!docId) return;
//       const modal = document.getElementById('buyerQueryModal1');
//       if (!modal) return;
//       modal.classList.remove('hidden');
//       modal.querySelector('.modal-content').innerHTML = '<div class="p-8 text-center">Loading details...</div>';
//       try {
//         const queryDoc = await db.collection('buyQueries').doc(docId).get();
//         if (!queryDoc.exists) throw new Error("Document not found.");
//         const query = queryDoc.data();
//         const userDoc = await db.collection('users').doc(query.buyerId).get();
//         const user = userDoc.exists ? userDoc.data() : {};
//         const modalContent = `
//           <div class="flex justify-between items-center p-4 border-b">
//             <h3 class="text-xl font-bold">Buyer Inquiry</h3>
//             <button data-modal-close="buyerQueryModal1" class="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
//           </div>
//           <div class="p-6 space-y-3">
//             <h4 class="font-semibold text-lg border-b pb-2">Buyer Information</h4>
//             <div><strong>Name:</strong> ${user.name || 'N/A'}</div>
//             <div><strong>Phone:</strong> ${query.buyerPhone || 'N/A'}</div>
//             <div><strong>Address:</strong> ${user.address || 'N/A'}</div>
//             <hr>
//             <h4 class="font-semibold text-lg pt-2">Requirements</h4>
//             <div class="text-sm space-y-2">
//               <p><strong>Required Wattage:</strong> ${query.requiredWattage} W</p>
//               <p><strong>Budget:</strong> ₹${query.budget}</p>
//               <p><strong>Preference:</strong> ${query.preference}</p>
//             </div>
//           </div>
//           <div class="flex justify-between items-center p-4 bg-gray-50 border-t rounded-b-lg">
//             <button class="action-btn bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
//                     data-action="find-match" data-buy-query-id="${docId}">
//               Find Match & Sell
//             </button>
//             <button data-modal-close="buyerQueryModal1"
//               class="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600">Close</button>
//           </div>`;
//         modal.querySelector('.modal-content').innerHTML = modalContent;
//       } catch (error) {
//         console.error("Error loading buyer query details: ", error);
//         modal.querySelector('.modal-content').innerHTML = `<div class="p-8 text-center text-red-500">Error: ${error.message}</div>`;
//       }
//     }

//     // --- (NEW) Handle Sold Item "View" button ---
//     // --- Handle Marketplace "Edit Listing" button ---
//     if (e.target.matches('.edit-marketplace-btn')) {
//         const docId = e.target.dataset.docId;
//         if (!docId) return;
//         loadMarketplaceItemForEdit(docId);
//     }
//     if (e.target.matches('.view-sold-btn')) {
//         const docId = e.target.dataset.docId;
//         if (!docId) return;
//         await loadSoldItemDetails(docId); // <-- CALL THE NEW FUNCTION
//     }
//     // --- Handle Unpublish/Remove button in Edit Modal ---
//     if (e.target.matches('#unpublish-marketplace-btn')) {
//         const docId = document.getElementById('edit-market-doc-id').value;
//         if (!docId) return;
        
//         if (confirm("Are you sure you want to unpublish this listing? It will be moved back to the Pending Verifications list.")) {
//             try {
//                 await db.collection('sellQueries').doc(docId).update({ status: 'pending_review' });
//                 alert("Listing unpublished and moved to Pending Verifications.");
//                 document.getElementById('editMarketplaceModal').classList.add('hidden');
//                 loadMarketplaceItems(); 
//                 loadPendingVerifications();
//             } catch (error) {
//                 console.error("Error unpublishing item:", error);
//                 alert(`Unpublish failed: ${error.message}`);
//             }
//         }
//     }
// }); // End of dashboardSection.addEventListener('click', ...)

// // --- Add the Save form submission listener OUTSIDE the main click listener ---
// document.getElementById('edit-marketplace-form').addEventListener('submit', saveMarketplaceChanges);
  


//   // --- LISTENER 2: Modal Actions (clicks ANYWHERE on the page) ---
//   document.addEventListener('click', async (e) => {
//     // --- Handle "Sell/Match to Panel" from Interested Modal ---
//     if (e.target.matches('.action-btn') && e.target.dataset.action === 'find-match-interested') {
//         const interestedQueryId = e.target.dataset.interestedQueryId;
//         if (!interestedQueryId) return console.error("Find Match button missing interestedQueryId");
        
//         // Close the interested modal
//         document.getElementById('interestedQueryModal').classList.add('hidden');
        
//         // Open match modal, passing the query ID as the "buy" ID to maintain flow
//         await openMatchModalForSale(interestedQueryId);
//     }
    
//     // --- Handle "Select This Panel" from Match Modal (original buyer flow) ---
//     if (e.target.matches('.select-panel-btn')) {
//         // ... (existing logic) ...
//         const button = e.target;
//         const sellQueryId = button.dataset.sellId;
//         const buyQueryId = button.dataset.buyId;

//         if (!sellQueryId || !buyQueryId) return console.error("Select button missing IDs");

//         button.disabled = true;
//         button.textContent = 'Processing...';
//         await processSale(buyQueryId, sellQueryId, 'buyQueries'); // <--- NOTE THE NEW ARGUMENT
//     }
    
//     // --- NEW: Handle "Select Buyer/Interest" from Match Modal (new sale flow) ---
//     if (e.target.matches('.select-buyer-btn')) {
//         const button = e.target;
//         const sellQueryId = button.dataset.sellId;
//         const buyQueryId = button.dataset.buyId; // This can be buyQuery ID OR interestedQuery ID
//         const type = button.dataset.type || 'buyQueries'; // Default is buyQueries
        
//         if (!sellQueryId || !buyQueryId) return console.error("Select buyer button missing IDs");
        
//         button.disabled = true;
//         button.textContent = 'Processing...';
//         await processSale(buyQueryId, sellQueryId, type); // <--- NOTE THE NEW ARGUMENT
//     }
//     // --- Handle closing the modal (with the 'x' button or backdrop) ---
//     if (e.target.matches('[data-modal-close]')) {
//       const modalId = e.target.dataset.modalClose;
//       const modal = document.getElementById(modalId);
//       if (modal) modal.classList.add('hidden');
//     }
//     if (e.target.matches('.modal')) {
//         e.target.classList.add('hidden');
//     }

//     // --- Handle Seller Approve/Disapprove ---
//     if (e.target.matches('.action-btn') && (e.target.dataset.action === 'approve' || e.target.dataset.action === 'disapprove')) {
//         const button = e.target;
//         const action = button.dataset.action;
//         const docId = button.dataset.docId;
        
//         if (!docId) return console.error("Action button missing docId");

//         const newStatus = (action === 'approve') ? 'approved' : 'rejected';
//         button.disabled = true;
//         button.textContent = 'Updating...';

//         try {
//             await db.collection('sellQueries').doc(docId).update({ status: newStatus });
//             alert(`Listing ${newStatus} successfully!`);
//             const modal = button.closest('.modal');
//             if (modal) modal.classList.add('hidden');
//             loadPendingVerifications(); 
//             loadMarketplaceItems(); 
//         } catch (error) {
//             console.error("Error updating status: ", error);
//             alert(`Failed to update status: ${error.message}`);
//             button.disabled = false;
//             button.textContent = (action === 'approve') ? 'Approve Listing' : 'Disapprove Listing';
//         }
//     }
    
//     // --- Handle Buyer "Find Match" ---
//     if (e.target.matches('.action-btn') && e.target.dataset.action === 'find-match') {
//         const buyQueryId = e.target.dataset.buyQueryId;
//         if (!buyQueryId) return console.error("Find Match button missing buyQueryId");
//         await openMatchModal(buyQueryId);
//     }

//     // --- Handle "Select This Panel" from Match Modal ---
//     if (e.target.matches('.select-panel-btn')) {
//         const button = e.target;
//         const sellQueryId = button.dataset.sellId;
//         const buyQueryId = button.dataset.buyId;

//         if (!sellQueryId || !buyQueryId) return console.error("Select button missing IDs");

//         button.disabled = true;
//         button.textContent = 'Processing...';
//         await processSale(buyQueryId, sellQueryId);
//     }
//   });

//   // =================================================================
//   // 4. SELL/MATCH LOGIC
//   // =================================================================
//   // --- Update 2025-10-26: processSale function now handles both buyQueries and interestedQueries ---
// async function processSale(buyQueryId, sellQueryId, buyerQueryCollection = 'buyQueries') {
//     try {
//       // 1. Get all documents
//       const sellQueryDoc = await db.collection('sellQueries').doc(sellQueryId).get();
//       if (!sellQueryDoc.exists) throw new Error("Seller query not found.");
//       const sellQuery = sellQueryDoc.data();

//       // Determine the buyer's query collection
//       const buyerCollection = (buyerQueryCollection === 'interested') ? 'interestedQueries' : 'buyQueries';
//       const buyerQueryDoc = await db.collection(buyerCollection).doc(buyQueryId).get();

//       if (!buyerQueryDoc.exists) throw new Error("Buyer query not found.");
//       const buyerQuery = buyerQueryDoc.data();

//       // Fetch user data
//       const buyerUID = buyerQuery.buyerId || buyerQuery.userId; // Use userId for interestedQueries
//       const buyerPhone = buyerQuery.buyerPhone || buyerQuery.userPhone;
      
//       const buyerUserDoc = await db.collection('users').doc(buyerUID).get();
//       const sellerUserDoc = await db.collection('users').doc(sellQuery.sellerId).get();

//       const buyerUser = buyerUserDoc.exists ? buyerUserDoc.data() : {};
//       const sellerUser = sellerUserDoc.exists ? sellerUserDoc.data() : {};

//       // 2. Create the new SoldSolar object
//       const soldItem = {
//         saleDate: firebase.firestore.FieldValue.serverTimestamp(),
//         salePrice: sellQuery.price || 0,
//         panelInfo: { ...sellQuery },
//         buyerInfo: {
//           uid: buyerUID,
//           name: buyerUser.name || buyerQuery.userName || 'N/A', // Use name from user doc or query doc
//           phone: buyerPhone || 'N/A',
//           address: buyerUser.address || buyerQuery.userLocation || 'N/A',
//           requirements: {
//             // Conditionally include requirements for buyQueries
//             wattage: buyerQuery.requiredWattage || 'N/A',
//             budget: buyerQuery.budget || 'N/A',
//             preference: buyerQuery.preference || 'N/A'
//           },
//           source: buyerCollection // Indicate if it came from buyQueries or interestedQueries
//         },
//         sellerInfo: {
//           uid: sellQuery.sellerId,
//           name: sellerUser.name || 'N/A',
//           phone: sellQuery.sellerPhone,
//           address: sellerUser.address || 'N/A'
//         }
//       };

//       // 3. Save the new document
//       await db.collection('SoldSolar').add(soldItem);

//       // 4. Update the statuses of the original queries
//       await db.collection('sellQueries').doc(sellQueryId).update({ status: 'sold' });
      
//       // Update the buyer query status
//       if (buyerCollection === 'buyQueries') {
//         await db.collection('buyQueries').doc(buyQueryId).update({ status: 'completed' });
//       } else {
//         // For interestedQueries, we can set a status or simply delete it if completed
//         // For this example, we'll mark it as 'completed'
//         await db.collection('interestedQueries').doc(buyQueryId).update({ status: 'completed' }); 
//       }
      
//       // 5. Success
//       alert('Sale processed successfully! Panel marked as sold and buyer query completed.');
      
//       // 6. Close modals and refresh lists
//       document.getElementById('matchModal').classList.add('hidden');
//       document.getElementById('buyerQueryModal1').classList.add('hidden');
//       document.getElementById('interestedQueryModal').classList.add('hidden');

//       loadBuyerQueries();
//       loadMarketplaceItems();
//       loadSoldItems(); 
//       loadInterestedQueries(); // Refresh the interested queries list

//     } catch (error) {
//       console.error("Error processing sale:", error);
//       alert(`Sale failed: ${error.message}`);
      
//       // Re-enable the button if it failed (Logic is simplified)
//       const button = document.querySelector(`.select-buyer-btn[data-sell-id="${sellQueryId}"]`) || 
//                      document.querySelector(`.select-panel-btn[data-sell-id="${sellQueryId}"]`);
//       if(button) {
//         button.disabled = false;
//         button.textContent = 'Select This Panel';
//       }
//     }
// }
//   async function openMatchModal(buyQueryId) {
//     const modal = document.getElementById('matchModal');
//     const container = document.getElementById('match-list-container');
//     if (!modal || !container) return;

//     modal.classList.remove('hidden');
//     container.innerHTML = '<p class="text-center">Loading available panels...</p>';

//     try {
//       const querySnapshot = await db.collection('sellQueries')
//                                     .where('status', '==', 'approved')
//                                     .get();

//       if (querySnapshot.empty) {
//         container.innerHTML = '<p class="text-center">No approved panels are available to sell.</p>';
//         return;
//       }

//       let html = '<ul class="divide-y divide-gray-200">';
//       querySnapshot.forEach(doc => {
//         const item = doc.data();
//         html += `
//           <li class="p-4 flex justify-between items-center">
//             <div>
//               <p class="font-semibold">${item.panelParams}</p>
//               <p class="text-sm text-gray-600">Price: ₹${item.price || 0}</p>
//             </div>
//             <button class="select-panel-btn bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
//                     data-sell-id="${doc.id}"
//                     data-buy-id="${buyQueryId}">
//               Select This Panel
//             </button>
//           </li>
//         `;
//       });
//       html += '</ul>';
//       container.innerHTML = html;

//     } catch (error) {
//       console.error("Error fetching approved panels:", error);
//       container.innerHTML = '<p class="text-center text-red-500">Error loading panels.</p>';
//     }
//   }
// // --- NEW: Function to open Match Modal when starting from a Panel ---
// async function openMatchModalForSale(sellQueryId) {
//     const modal = document.getElementById('matchModal');
//     const container = document.getElementById('match-list-container');
//     if (!modal || !container) return;

//     modal.classList.remove('hidden');
//     container.innerHTML = '<p class="text-center">Loading all available buyers...</p>';
    
//     // Store the panel ID to be used in the sale process
//     modal.dataset.sellQueryId = sellQueryId;

//     try {
//         // Query active buyer inquiries (from buyQueries)
//         const buySnapshot = await db.collection('buyQueries')
//                                     .where('status', '==', 'pending_review')
//                                     .get();
//         // Query users who showed interest (from interestedQueries)
//         const interestedSnapshot = await db.collection('interestedQueries')
//                                             // Order by timestamp to show latest interest first
//                                             .orderBy('timestamp', 'desc') 
//                                             .get();

//         if (buySnapshot.empty && interestedSnapshot.empty) {
//             container.innerHTML = '<p class="text-center">No active buyer inquiries or interested parties available.</p>';
//             return;
//         }

//         let html = '<ul class="divide-y divide-gray-200">';
        
//         // 1. List Pending Buy Queries
//         buySnapshot.forEach(doc => {
//             const item = doc.data();
//             html += `
//               <li class="p-4 flex justify-between items-center bg-blue-50/50">
//                 <div>
//                   <p class="font-semibold">BUY REQUEST: ${item.requiredWattage}W Panel</p>
//                   <p class="text-sm text-gray-600">Budget: ₹${item.budget || 0} (Query ID: ${doc.id})</p>
//                 </div>
//                 <button class="select-buyer-btn bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
//                         data-buy-id="${doc.id}" data-sell-id="${sellQueryId}">
//                   Select for Sale
//                 </button>
//               </li>
//             `;
//         });
        
//         // 2. List Interested Queries
//         interestedSnapshot.forEach(doc => {
//             const item = doc.data();
//             html += `
//               <li class="p-4 flex justify-between items-center">
//                 <div>
//                   <p class="font-semibold">INTEREST: ${item.productTitle}</p>
//                   <p class="text-sm text-gray-600">User: ${item.userName || 'N/A'} (Interested ID: ${doc.id})</p>
//                 </div>
//                 <button class="select-buyer-btn bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700"
//                         data-buy-id="${doc.id}" data-sell-id="${sellQueryId}" data-type="interested">
//                   Select for Sale
//                 </button>
//               </li>
//             `;
//         });
        
//         html += '</ul>';
//         container.innerHTML = html;

//     } catch (error) {
//         console.error("Error fetching buyers/interests:", error);
//         container.innerHTML = '<p class="text-center text-red-500">Error loading buyers.</p>';
//     }
// }
//   async function processSale(buyQueryId, sellQueryId) {
//     try {
//       // 1. Get all 4 documents
//       const buyQueryDoc = await db.collection('buyQueries').doc(buyQueryId).get();
//       const sellQueryDoc = await db.collection('sellQueries').doc(sellQueryId).get();

//       if (!buyQueryDoc.exists || !sellQueryDoc.exists) {
//         throw new Error("Buyer or Seller query not found.");
//       }

//       const buyQuery = buyQueryDoc.data();
//       const sellQuery = sellQueryDoc.data();

//       const buyerUserDoc = await db.collection('users').doc(buyQuery.buyerId).get();
//       const sellerUserDoc = await db.collection('users').doc(sellQuery.sellerId).get();

//       const buyerUser = buyerUserDoc.exists ? buyerUserDoc.data() : {};
//       const sellerUser = sellerUserDoc.exists ? sellerUserDoc.data() : {};

//       // 2. Create the new SoldSolar object
//       const soldItem = {
//         saleDate: firebase.firestore.FieldValue.serverTimestamp(),
//         salePrice: sellQuery.price || 0, // Fallback to 0 if price is undefined
//         panelInfo: {
//           ...sellQuery // Copies all panel data
//         },
//         buyerInfo: {
//           uid: buyQuery.buyerId,
//           name: buyerUser.name || 'N/A',
//           phone: buyQuery.buyerPhone,
//           address: buyerUser.address || 'N/A',
//           requirements: {
//             wattage: buyQuery.requiredWattage,
//             budget: buyQuery.budget,
//             preference: buyQuery.preference
//           }
//         },
//         sellerInfo: {
//           uid: sellQuery.sellerId,
//           name: sellerUser.name || 'N/A',
//           phone: sellQuery.sellerPhone,
//           address: sellerUser.address || 'N/A'
//         }
//       };

//       // 3. Save the new document
//       await db.collection('SoldSolar').add(soldItem);

//       // 4. Update the statuses of the original queries
//       await db.collection('sellQueries').doc(sellQueryId).update({ status: 'sold' });
//       await db.collection('buyQueries').doc(buyQueryId).update({ status: 'completed' });

//       // 5. Success
//       alert('Sale processed successfully! Panel marked as sold and buyer query completed.');
      
//       // 6. Close modals and refresh lists
//       document.getElementById('matchModal').classList.add('hidden');
//       document.getElementById('buyerQueryModal1').classList.add('hidden');
//       loadBuyerQueries();
//       loadMarketplaceItems();
//       loadSoldItems(); // <-- ADDED

//     } catch (error) {
//       console.error("Error processing sale:", error);
//       alert(`Sale failed: ${error.message}`);
//       // Re-enable the button if it failed
//       const button = document.querySelector(`.select-panel-btn[data-sell-id="${sellQueryId}"]`);
//       if(button) {
//         button.disabled = false;
//         button.textContent = 'Select This Panel';
//       }
//     }
//   }
//   });




document.addEventListener('DOMContentLoaded', () => {

  // Get Firebase services from your firebase.js
  const auth = firebase.auth();
  const db = firebase.firestore();

  const loginSection = document.getElementById('admin-login-section');
  const dashboardSection = document.getElementById('admin-dashboard-section');
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('admin-login-error');
  const logoutBtn = document.getElementById('admin-logout-btn');

  // =================================================================
  // 1. AUTHENTICATION
  // =================================================================
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm['admin-email'].value;
      const password = loginForm['admin-password'].value;
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => console.log("Admin logged in"))
        .catch((error) => {
          loginError.textContent = `Login failed: ${error.message}`;
          loginError.classList.remove('hidden');
        });
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => auth.signOut());
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      loginSection.classList.add('hidden');
      dashboardSection.classList.remove('hidden');
      loadPendingVerifications();
      loadBuyerQueries();
      loadMarketplaceItems();
      loadInterestedQueries();
      loadSoldItems(); 
    } else {
      loginSection.classList.remove('hidden');
      dashboardSection.classList.add('hidden');
    }
  });

  // =================================================================
  // 2. LOAD DATA FUNCTIONS
  // =================================================================
// --- NEW: Load Interested Queries (Similar to loadPendingVerifications) ---
  async function loadInterestedQueries() {
    const tableBody = document.querySelector('#interested-queries tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Loading...</td></tr>';

    try {
      const querySnapshot = await db.collection('interestedQueries')
                                    .orderBy('timestamp', 'desc')
                                    .get();

      if (querySnapshot.empty) {
        tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">No current interest queries.</td></tr>';
        return;
      }
      
      let html = ''; 
      for (const doc of querySnapshot.docs) {
        const item = doc.data();
        // Use the name saved directly in the query for simplicity
        const buyerName = item.userName || 'N/A'; 
        const productTitle = item.productTitle || 'N/A';
        const date = item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleDateString() : 'N/A';

        html += `
          <tr class="border-b">
            <td class="p-4">${buyerName}</td>
            <td class="p-4 text-sm">${productTitle}</td>
            <td class="p-4 text-sm text-gray-500">${date}</td>
            <td class="p-4">
              <button class="view-interested-btn bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-yellow-200" 
                      data-doc-id="${doc.id}" 
                      data-modal-target="interestedQueryModal">
                View
              </button>
            </td>
          </tr>
        `;
      }
      tableBody.innerHTML = html; 
    } catch (error) {
      console.error("Error loading interested queries: ", error);
      tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-500">Error loading data.</td></tr>';
    }
  }
  
// --- NEW: Function to Load Interested Query Detail Modal (with Sell/Match button) ---
async function openInterestedQueryModal(docId) {
    const modal = document.getElementById('interestedQueryModal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    modal.querySelector('.modal-content').innerHTML = '<div class="p-8 text-center">Loading interest details...</div>';

    try {
        const doc = await db.collection('interestedQueries').doc(docId).get();
        if (!doc.exists) throw new Error("Interest record not found.");
        const item = doc.data();
        
        const queryDate = item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleString() : 'N/A';

        const modalContent = `
            <div class="flex justify-between items-center p-4 border-b">
                <h3 class="text-xl font-bold">Interested Query Details</h3>
                <button data-modal-close="interestedQueryModal" class="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
            </div>
            <div class="p-6 space-y-4">
                <div class="space-y-3">
                    <h4 class="font-semibold text-lg border-b pb-2">Buyer Information</h4>
                    <div><strong>Name:</strong> ${item.userName || 'N/A'}</div>
                    <div><strong>Phone:</strong> ${item.userPhone || 'N/A'}</div>
                    <div><strong>Location:</strong> ${item.userLocation || 'N/A'}</div>
                    <div><strong>Query Date:</strong> ${queryDate}</div>
                </div>
                <div class="space-y-3">
                    <h4 class="font-semibold text-lg border-b pb-2">Panel of Interest</h4>
                    <p class="text-lg font-medium">${item.productTitle || 'N/A'}</p>
                    <p class="text-sm text-gray-600">This user clicked the "Interested?" button on the marketplace for this listing.</p>
                </div>
            </div>
            <div class="flex justify-between items-center p-4 bg-gray-50 border-t rounded-b-lg">
                <button class="action-btn bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
                        data-action="find-match-interested" data-interested-query-id="${docId}" data-buyer-uid="${item.userId}">
                  Sell/Match to Panel
                </button>
                <button data-modal-close="interestedQueryModal" class="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600">Close</button>
            </div>
        `;
        modal.querySelector('.modal-content').innerHTML = modalContent;

    } catch (error) {
        console.error("Error loading interested query details:", error);
        modal.querySelector('.modal-content').innerHTML = `<div class="p-8 text-center text-red-500">Error: ${error.message}</div>`;
    }
}

// --- Function to Load Sold Item into Detail Modal ---
async function loadSoldItemDetails(docId) {
    const modal = document.getElementById('soldDetailModal');
    if (!modal) return;
    
    // Show the modal and a loading state
    modal.classList.remove('hidden');
    modal.querySelector('.modal-content').innerHTML = '<div class="p-8 text-center">Loading sale details...</div>';

    try {
        const doc = await db.collection('SoldSolar').doc(docId).get();
        if (!doc.exists) throw new Error("Sale record not found.");
        const item = doc.data();

        const saleDate = item.saleDate ? new Date(item.saleDate.seconds * 1000).toLocaleDateString() : 'N/A';

        const modalContent = `
            <div class="flex justify-between items-center p-4 border-b">
                <h3 class="text-xl font-bold">Sold Item Details</h3>
                <button data-modal-close="soldDetailModal" class="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
            </div>
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                <div class="space-y-3">
                    <h4 class="font-semibold text-lg border-b pb-2">Panel & Sale Info</h4>
                    <div><strong>Item:</strong> ${item.panelInfo.panelParams || 'N/A'}</div>
                    <div><strong>Sale Price:</strong> ₹${item.salePrice || 'N/A'}</div>
                    <div><strong>Sale Date:</strong> ${saleDate}</div>
                    <div><strong>Original Price:</strong> ₹${item.panelInfo.price || 'N/A'}</div>
                </div>
                <div class="space-y-3">
                    <h4 class="font-semibold text-lg border-b pb-2">Buyer Information</h4>
                    <div><strong>Name:</strong> ${item.buyerInfo.name || 'N/A'}</div>
                    <div><strong>Phone:</strong> ${item.buyerInfo.phone || 'N/A'}</div>
                    <div><strong>Address:</strong> ${item.buyerInfo.address || 'N/A'}</div>
                </div>
                <div class="space-y-3 md:col-span-2">
                    <h4 class="font-semibold text-lg border-b pb-2">Seller Information</h4>
                    <div><strong>Name:</strong> ${item.sellerInfo.name || 'N/A'}</div>
                    <div><strong>Phone:</strong> ${item.sellerInfo.phone || 'N/A'}</div>
                    <div><strong>Address:</strong> ${item.sellerInfo.address || 'N/A'}</div>
                </div>
                <div class="space-y-2 md:col-span-2"><h4 class="font-semibold text-lg">Panel Image</h4>
                    <a href="${item.panelInfo.panelImageURL}" target="_blank">
                      <img src="${item.panelInfo.panelImageURL}" alt="Panel Image" class="w-full h-64 object-cover rounded border">
                    </a>
                </div>
            </div>
            <div class="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg">
                <button data-modal-close="soldDetailModal" class="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600">Close</button>
            </div>
        `;
        modal.querySelector('.modal-content').innerHTML = modalContent;

    } catch (error) {
        console.error("Error loading sold item details:", error);
        modal.querySelector('.modal-content').innerHTML = `<div class="p-8 text-center text-red-500">Error: ${error.message}</div>`;
    }
}
  async function loadPendingVerifications() {
    const tableBody = document.querySelector('#seller-queries tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Loading...</td></tr>';
    try {
      const querySnapshot = await db.collection('sellQueries')
                                    .where('status', '==', 'pending_review')
                                    .orderBy('submittedAt', 'desc')
                                    .get();
      if (querySnapshot.empty) {
        tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">No pending verifications.</td></tr>';
        return;
      }
      let html = ''; 
      for (const doc of querySnapshot.docs) {
        const query = doc.data();
        let userName = 'Unknown User';
        try {
          const userDoc = await db.collection('users').doc(query.sellerId).get();
          if (userDoc.exists) userName = userDoc.data().name || 'N/A';
        } catch (e) { console.error("Error fetching user:", e); }
        const date = query.submittedAt ? new Date(query.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A';
        html += `
          <tr class="border-b">
            <td class="p-4">${userName}</td><td class="p-4">${query.panelParams || 'N/A'}</td>
            <td class="p-4 text-sm text-gray-500">${date}</td>
            <td class="p-4">
              <button class="view-details-btn bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-blue-200" 
                      data-doc-id="${doc.id}" data-modal-target="sellerQueryModal">View Details</button>
            </td>
          </tr>`;
      }
      tableBody.innerHTML = html; 
    } catch (error) {
      console.error("Error loading pending verifications: ", error);
      tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-500">Error loading data.</td></tr>';
    }
  }

  async function loadBuyerQueries() {
    const tableBody = document.querySelector('#buyer-queries tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">Loading...</td></tr>';
    try {
      const querySnapshot = await db.collection('buyQueries')
                                    .where('status', '==', 'pending_review') 
                                    .orderBy('submittedAt', 'desc')
                                    .get();
      if (querySnapshot.empty) {
        tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center">No pending buyer queries.</td></tr>';
        return;
      }
      let html = ''; 
      for (const doc of querySnapshot.docs) {
        const query = doc.data();
        let userName = 'Unknown User';
        try {
          const userDoc = await db.collection('users').doc(query.buyerId).get();
          if (userDoc.exists) userName = userDoc.data().name || 'N/A';
        } catch (e) { console.error("Error fetching user:", e); }
        const date = query.submittedAt ? new Date(query.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A';
        html += `
          <tr class="border-b">
            <td class="p-4">${userName}</td><td class="p-4">Req: ${query.requiredWattage}W</td>
            <td class="p-4 text-sm text-gray-500">${date}</td>
            <td class="p-4">
              <button class="view-buyer-btn bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-green-200" 
                      data-doc-id="${doc.id}" data-modal-target="buyerQueryModal1">View</button>
            </td>
          </tr>`;
      }
      tableBody.innerHTML = html; 
    } catch (error) {
      console.error("Error loading buyer queries: ", error);
      tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-500">Error loading data.</td></tr>';
    }
  }

// --- Function to Load Marketplace Item into Edit Modal ---
async function loadMarketplaceItemForEdit(docId) {
    const modal = document.getElementById('editMarketplaceModal');
    const form = document.getElementById('edit-marketplace-form');
    if (!modal || !form) return;

    modal.classList.remove('hidden');

    try {
        const doc = await db.collection('sellQueries').doc(docId).get();
        if (!doc.exists) throw new Error("Listing not found.");
        const data = doc.data();

        // Populate Form Fields
        document.getElementById('edit-market-doc-id').value = docId;
        document.getElementById('edit-market-params').value = data.panelParams || '';
        document.getElementById('edit-market-price').value = data.price || 0;
        
        // --- ADDED: Populate the hidden sell-item button with the document ID ---
        document.getElementById('sell-item-market-btn').dataset.sellQueryId = docId;


    } catch (error) {
        console.error("Error loading marketplace item:", error);
        alert(`Error loading data: ${error.message}`);
        modal.classList.add('hidden');
    }
}

  // --- (NEW) Load Sold Items History ---
  async function loadSoldItems() {
    const tableBody = document.querySelector('#sold-items tbody');
    if (!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center">Loading...</td></tr>';

    try {
      const querySnapshot = await db.collection('SoldSolar')
                                    .orderBy('saleDate', 'desc')
                                    .get();

      if (querySnapshot.empty) {
        tableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center">No items have been sold.</td></tr>';
        return;
      }
      
      let html = ''; 
      for (const doc of querySnapshot.docs) {
        const item = doc.data();
        html += `
          <tr class="border-b">
            <td class="p-4">${item.panelInfo.panelParams || 'N/A'}</td>
            <td class="p-4">₹${item.salePrice || 'N/A'}</td>
            <td class="p-4 text-sm">${item.buyerInfo.name || 'N/A'}</td>
            <td class="p-4 text-sm">${item.sellerInfo.name || 'N/A'}</td>
            <td class="p-4">
              <button class="view-sold-btn bg-gray-100 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-gray-200" 
                      data-doc-id="${doc.id}" 
                      data-modal-target="soldDetailModal">
                View
              </button>
            </td>
          </tr>
        `;
      }
      tableBody.innerHTML = html; 
    } catch (error) {
      console.error("Error loading sold items: ", error);
      tableBody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-red-500">Error loading data.</td></tr>';
    }
  }


// --- Function to Save/Update Marketplace Item ---
async function saveMarketplaceChanges(e) {
    e.preventDefault();
    const docId = document.getElementById('edit-market-doc-id').value;
    const newPanelParams = document.getElementById('edit-market-params').value;
    const newPrice = Number(document.getElementById('edit-market-price').value);
    const saveButton = document.getElementById('save-marketplace-btn');
    
    if (!docId || !newPanelParams || isNaN(newPrice)) {
        alert("Please provide valid data.");
        return;
    }

    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    try {
        await db.collection('sellQueries').doc(docId).update({
            panelParams: newPanelParams,
            price: newPrice,
        });

        alert("Listing updated successfully!");
        document.getElementById('editMarketplaceModal').classList.add('hidden');
        loadMarketplaceItems(); // Refresh the list
    } catch (error) {
        console.error("Error updating marketplace item:", error);
        alert(`Update failed: ${error.message}`);
    } finally {
        saveButton.disabled = false;
        saveButton.textContent = 'Save Changes';
    }
}

  // --- Load Marketplace Items (Updated to show pending/approved) ---
  async function loadMarketplaceItems() {
    const container = document.getElementById('marketplace-management');
    if (!container) return;
    const grid = container.querySelector('.grid');
    if (!grid) return;
    grid.innerHTML = '<p class="col-span-4 text-center">Loading marketplace items...</p>';

    try {
      const querySnapshot = await db.collection('sellQueries')
                                    .where('status', 'in', ['approved', 'pending_review'])
                                    .orderBy('submittedAt', 'desc')
                                    .get();
      
      if (querySnapshot.empty) {
        grid.innerHTML = '<p class="col-span-4 text-center">No items are currently in the marketplace.</p>';
        return;
      }

      let html = '';
      for (const doc of querySnapshot.docs) {
        const item = doc.data();
        const docId = doc.id;

        const isPending = item.status === 'pending_review';
        
        // Dynamically set styles based on status
        const badgeClass = isPending ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800';
        const badgeText = isPending ? 'Pending Verification' : 'Expert Verified';
        const cardStyle = isPending ? 'opacity:0.65;' : '';
        const btnClass = isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700';
        
        html += `
          <div class="bg-white rounded-lg overflow-hidden shadow-md border flex flex-col" style="${cardStyle}">
            <img src="${item.panelImageURL || 'https/via.placeholder.com/300'}" class="w-full h-48 object-cover" alt="Solar Panel">
            <div class="p-4 flex-1 flex flex-col">
              <span class="text-xs ${badgeClass} px-2 py-1 rounded-full self-start">${badgeText}</span>
              <h3 class="font-bold mt-2 text-lg text-gray-800">${item.panelParams}</h3>
              <p class="text-gray-600 text-sm">Condition: (Add field to form)</p>
              <p class="text-blue-700 font-bold text-xl mt-2">₹${item.price || 'N/A'}</p>
              <div class="mt-4 flex-1 flex items-end">
                <button data-doc-id="${docId}"
                  class="edit-marketplace-btn w-full text-white font-semibold py-2 rounded-lg transition-colors ${btnClass}"
                  ${isPending ? 'disabled' : ''}>
                  ${isPending ? 'View Pending Details' : 'Edit Listing'}
                </button>
              </div>
            </div>
          </div>
        `;
      }
      grid.innerHTML = html;

    } catch (error) {
      console.error("Error loading marketplace items: ", error);
      grid.innerHTML = `<p class="col-span-4 text-center text-red-500">Error loading items. Check console (F12) for an index error.</p>`;
    }
  }


  // =================================================================
  // 3. MODAL AND ACTION LISTENERS
  // =================================================================

  
  // --- LISTENER 1: Opening modals (clicks INSIDE the dashboard) ---
  dashboardSection.addEventListener('click', async (e) => {
    
    // --- Handle "Sell Item" from Marketplace Edit Modal (Now in Listener 2) ---

    // --- Handle Seller "View Details" button ---
    if (e.target.matches('.view-details-btn')) {
      const docId = e.target.dataset.docId;
      if (!docId) return;
      const modal = document.getElementById('sellerQueryModal1');
      if (!modal) return;
      modal.classList.remove('hidden');
      modal.querySelector('.modal-content').innerHTML = '<div class="p-8 text-center">Loading details...</div>';
      try {
        const queryDoc = await db.collection('sellQueries').doc(docId).get();
        if (!queryDoc.exists) throw new Error("Document not found.");
        const query = queryDoc.data();
        const userDoc = await db.collection('users').doc(query.sellerId).get();
        const user = userDoc.exists ? userDoc.data() : {};
        const modalContent = `
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-xl font-bold">Seller Verification</h3>
            <button data-modal-close="sellerQueryModal1" class="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
            <div class="space-y-3"><h4 class="font-semibold text-lg border-b pb-2">Seller Information</h4>
              <div><strong>Name:</strong> ${user.name || 'N/A'}</div>
              <div><strong>Phone:</strong> ${query.sellerPhone || 'N/A'}</div>
              <div><strong>Address:</strong> ${user.address || 'N/A'}</div>
            </div>
            <div class="space-y-3"><h4 class="font-semibold text-lg border-b pb-2">Panel Information</h4>
              <div><strong>Parameters:</strong> ${query.panelParams || 'N/A'}</div>
              <div><strong>Purchased From:</strong> ${query.purchasedFrom || 'N/A'}</div>
              <div><strong>Purchase Date:</strong> ${query.purchaseDate || 'N/A'}</div>
              <div><strong>Price:</strong> ₹${query.price || 0}</div> 
            </div>
            <div class="space-y-2"><h4 class="font-semibold text-lg">Panel Image</h4>
              <a href="${query.panelImageURL}" target="_blank"><img src="${query.panelImageURL}" alt="Panel Image" class="w-full h-48 object-cover rounded border"></a>
            </div>
            <div class="space-y-2"><h4 class="font-semibold text-lg">Receipt Image</h4>
              ${query.receiptImageURL ? `<a href="${query.receiptImageURL}" target="_blank"><img src="${query.receiptImageURL}" alt="Receipt Image" class="w-full h-48 object-cover rounded border"></a>` : '<p class="text-gray-500">No receipt uploaded.</p>'}
            </div>
          </div>
          <div class="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg gap-3">
            <button class="action-btn bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700"
                    data-action="disapprove" data-doc-id="${docId}">Disapprove Listing</button>
            <button class="action-btn bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
                    data-action="approve" data-doc-id="${docId}">Approve Listing</button>
          </div>`;
        modal.querySelector('.modal-content').innerHTML = modalContent;
      } catch (error) {
        console.error("Error loading query details: ", error);
        modal.querySelector('.modal-content').innerHTML = `<div class="p-8 text-center text-red-500">Error: ${error.message}</div>`;
      }
    }
    
    // --- Handle Buyer "View" button ---
    if (e.target.matches('.view-buyer-btn')) {
      const docId = e.target.dataset.docId;
      if (!docId) return;
      const modal = document.getElementById('buyerQueryModal1');
      if (!modal) return;
      modal.classList.remove('hidden');
      modal.querySelector('.modal-content').innerHTML = '<div class="p-8 text-center">Loading details...</div>';
      try {
        const queryDoc = await db.collection('buyQueries').doc(docId).get();
        if (!queryDoc.exists) throw new Error("Document not found.");
        const query = queryDoc.data();
        const userDoc = await db.collection('users').doc(query.buyerId).get();
        const user = userDoc.exists ? userDoc.data() : {};
        const modalContent = `
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-xl font-bold">Buyer Inquiry</h3>
            <button data-modal-close="buyerQueryModal1" class="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
          </div>
          <div class="p-6 space-y-3">
            <h4 class="font-semibold text-lg border-b pb-2">Buyer Information</h4>
            <div><strong>Name:</strong> ${user.name || 'N/A'}</div>
            <div><strong>Phone:</strong> ${query.buyerPhone || 'N/A'}</div>
            <div><strong>Address:</strong> ${user.address || 'N/A'}</div>
            <hr>
            <h4 class="font-semibold text-lg pt-2">Requirements</h4>
            <div class="text-sm space-y-2">
              <p><strong>Required Wattage:</strong> ${query.requiredWattage} W</p>
              <p><strong>Budget:</strong> ₹${query.budget}</p>
              <p><strong>Preference:</strong> ${query.preference}</p>
            </div>
          </div>
          <div class="flex justify-between items-center p-4 bg-gray-50 border-t rounded-b-lg">
            <button class="action-btn bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
                    data-action="find-match" data-buy-query-id="${docId}">
              Find Match & Sell
            </button>
            <button data-modal-close="buyerQueryModal1"
              class="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600">Close</button>
          </div>`;
        modal.querySelector('.modal-content').innerHTML = modalContent;
      } catch (error) {
        console.error("Error loading buyer query details: ", error);
        modal.querySelector('.modal-content').innerHTML = `<div class="p-8 text-center text-red-500">Error: ${error.message}</div>`;
      }
    }

    // --- NEW: Handle Interested Query "View" button ---
    if (e.target.matches('.view-interested-btn')) {
        const docId = e.target.dataset.docId;
        if (!docId) return;
        await openInterestedQueryModal(docId); 
    }

    // --- Handle Marketplace "Edit Listing" button ---
    if (e.target.matches('.edit-marketplace-btn')) {
        const docId = e.target.dataset.docId;
        if (!docId) return;
        loadMarketplaceItemForEdit(docId);
    }
    
    // --- (NEW) Handle Sold Item "View" button ---
    if (e.target.matches('.view-sold-btn')) {
        const docId = e.target.dataset.docId;
        if (!docId) return;
        await loadSoldItemDetails(docId); 
    }
    // --- Handle Unpublish/Remove button in Edit Modal ---
    if (e.target.matches('#unpublish-marketplace-btn')) {
        const docId = document.getElementById('edit-market-doc-id').value;
        if (!docId) return;
        
        if (confirm("Are you sure you want to unpublish this listing? It will be moved back to the Pending Verifications list.")) {
            try {
                await db.collection('sellQueries').doc(docId).update({ status: 'pending_review' });
                alert("Listing unpublished and moved to Pending Verifications.");
                document.getElementById('editMarketplaceModal').classList.add('hidden');
                loadMarketplaceItems(); 
                loadPendingVerifications();
            } catch (error) {
                console.error("Error unpublishing item:", error);
                alert(`Unpublish failed: ${error.message}`);
            }
        }
    }
}); // End of dashboardSection.addEventListener('click', ...)

// --- Add the Save form submission listener OUTSIDE the main click listener ---
document.getElementById('edit-marketplace-form').addEventListener('submit', saveMarketplaceChanges);
  


  // --- LISTENER 2: Modal Actions (clicks ANYWHERE on the page) ---
  document.addEventListener('click', async (e) => {
    
    // --- Handle "Sell Item" from Marketplace Edit Modal (NEW) ---
    if (e.target.matches('#sell-item-market-btn')) {
        const sellQueryId = e.target.dataset.sellQueryId;
        if (!sellQueryId) return console.error("Sell button missing sellQueryId");
        
        // Close the edit modal
        document.getElementById('editMarketplaceModal').classList.add('hidden');
        
        // Open the match modal, passing the panel ID
        await openMatchModalForSale(sellQueryId);
    }
    
    // --- Handle "Sell/Match to Panel" from Interested Modal (NEW) ---
    if (e.target.matches('.action-btn') && e.target.dataset.action === 'find-match-interested') {
        const interestedQueryId = e.target.dataset.interestedQueryId;
        if (!interestedQueryId) return console.error("Find Match button missing interestedQueryId");
        
        // Close the interested modal
        document.getElementById('interestedQueryModal').classList.add('hidden');
        
        // Open match modal, passing the interested query ID as the "buy" ID
        await openMatchModalForSale(interestedQueryId);
    }
    
    // --- Handle "Select Buyer/Interest" from Match Modal (NEW sale flow) ---
    if (e.target.matches('.select-buyer-btn')) {
        const button = e.target;
        const sellQueryId = button.dataset.sellId;
        const buyQueryId = button.dataset.buyId; 
        const type = button.dataset.type || 'buyQueries'; // 'interested' or 'buyQueries'
        
        if (!sellQueryId || !buyQueryId) return console.error("Select buyer button missing IDs");
        
        button.disabled = true;
        button.textContent = 'Processing...';
        await processSale(buyQueryId, sellQueryId, type); 
    }
    
    // --- Handle "Select This Panel" from Match Modal (Original buy flow) ---
    if (e.target.matches('.select-panel-btn')) {
        const button = e.target;
        const sellQueryId = button.dataset.sellId;
        const buyQueryId = button.dataset.buyId;

        if (!sellQueryId || !buyQueryId) return console.error("Select button missing IDs");

        button.disabled = true;
        button.textContent = 'Processing...';
        await processSale(buyQueryId, sellQueryId, 'buyQueries');
    }

    // --- Handle closing the modal (with the 'x' button or backdrop) ---
    if (e.target.matches('[data-modal-close]')) {
      const modalId = e.target.dataset.modalClose;
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('hidden');
    }
    if (e.target.matches('.modal')) {
        e.target.classList.add('hidden');
    }

    // --- Handle Seller Approve/Disapprove ---
    if (e.target.matches('.action-btn') && (e.target.dataset.action === 'approve' || e.target.dataset.action === 'disapprove')) {
        const button = e.target;
        const action = button.dataset.action;
        const docId = button.dataset.docId;
        
        if (!docId) return console.error("Action button missing docId");

        const newStatus = (action === 'approve') ? 'approved' : 'rejected';
        button.disabled = true;
        button.textContent = 'Updating...';

        try {
            await db.collection('sellQueries').doc(docId).update({ status: newStatus });
            alert(`Listing ${newStatus} successfully!`);
            const modal = button.closest('.modal');
            if (modal) modal.classList.add('hidden');
            loadPendingVerifications(); 
            loadMarketplaceItems(); 
        } catch (error) {
            console.error("Error updating status: ", error);
            alert(`Failed to update status: ${error.message}`);
            button.disabled = false;
            button.textContent = (action === 'approve') ? 'Approve Listing' : 'Disapprove Listing';
        }
    }
    
    // --- Handle Buyer "Find Match" ---
    if (e.target.matches('.action-btn') && e.target.dataset.action === 'find-match') {
        const buyQueryId = e.target.dataset.buyQueryId;
        if (!buyQueryId) return console.error("Find Match button missing buyQueryId");
        await openMatchModal(buyQueryId);
    }
  });

  // =================================================================
  // 4. SELL/MATCH LOGIC
  // =================================================================
  // --- Update 2025-10-26: processSale function now handles both buyQueries and interestedQueries ---
async function processSale(buyQueryId, sellQueryId, buyerQueryCollection = 'buyQueries') {
    try {
      // 1. Get all documents
      const sellQueryDoc = await db.collection('sellQueries').doc(sellQueryId).get();
      if (!sellQueryDoc.exists) throw new Error("Seller query not found.");
      const sellQuery = sellQueryDoc.data();

      // Determine the buyer's query collection
      const buyerCollection = (buyerQueryCollection === 'interested') ? 'interestedQueries' : 'buyQueries';
      const buyerQueryDoc = await db.collection(buyerCollection).doc(buyQueryId).get();

      if (!buyerQueryDoc.exists) throw new Error("Buyer query not found.");
      const buyerQuery = buyerQueryDoc.data();

      // Fetch user data
      const buyerUID = buyerQuery.buyerId || buyerQuery.userId; // Use userId for interestedQueries
      const buyerPhone = buyerQuery.buyerPhone || buyerQuery.userPhone;
      
      const buyerUserDoc = await db.collection('users').doc(buyerUID).get();
      const sellerUserDoc = await db.collection('users').doc(sellQuery.sellerId).get();

      const buyerUser = buyerUserDoc.exists ? buyerUserDoc.data() : {};
      const sellerUser = sellerUserDoc.exists ? sellerUserDoc.data() : {};

      // 2. Create the new SoldSolar object
      const soldItem = {
        saleDate: firebase.firestore.FieldValue.serverTimestamp(),
        salePrice: sellQuery.price || 0,
        panelInfo: { ...sellQuery },
        buyerInfo: {
          uid: buyerUID,
          name: buyerUser.name || buyerQuery.userName || 'N/A', // Use name from user doc or query doc
          phone: buyerPhone || 'N/A',
          address: buyerUser.address || buyerQuery.userLocation || 'N/A',
          requirements: {
            // Conditionally include requirements for buyQueries
            wattage: buyerQuery.requiredWattage || 'N/A',
            budget: buyerQuery.budget || 'N/A',
            preference: buyerQuery.preference || 'N/A'
          },
          source: buyerCollection // Indicate if it came from buyQueries or interestedQueries
        },
        sellerInfo: {
          uid: sellQuery.sellerId,
          name: sellerUser.name || 'N/A',
          phone: sellQuery.sellerPhone,
          address: sellerUser.address || 'N/A'
        }
      };

      // 3. Save the new document
      await db.collection('SoldSolar').add(soldItem);

      // 4. Update the statuses of the original queries
      await db.collection('sellQueries').doc(sellQueryId).update({ status: 'sold' });
      
      // Update the buyer query status
      if (buyerCollection === 'buyQueries') {
        await db.collection('buyQueries').doc(buyQueryId).update({ status: 'completed' });
      } else {
        // For interestedQueries, we'll mark it as 'completed'
        await db.collection('interestedQueries').doc(buyQueryId).update({ status: 'completed' }); 
      }
      
      // 5. Success
      alert('Sale processed successfully! Panel marked as sold and buyer query completed.');
      
      // 6. Close modals and refresh lists
      document.getElementById('matchModal').classList.add('hidden');
      document.getElementById('buyerQueryModal1').classList.add('hidden');
      document.getElementById('interestedQueryModal').classList.add('hidden');

      loadBuyerQueries();
      loadMarketplaceItems();
      loadSoldItems(); 
      loadInterestedQueries(); // Refresh the interested queries list

    } catch (error) {
      console.error("Error processing sale:", error);
      alert(`Sale failed: ${error.message}`);
      
      // Re-enable the button if it failed (Logic is simplified)
      const button = document.querySelector(`.select-buyer-btn[data-sell-id="${sellQueryId}"]`) || 
                     document.querySelector(`.select-panel-btn[data-sell-id="${sellQueryId}"]`);
      if(button) {
        button.disabled = false;
        button.textContent = 'Select This Panel';
      }
    }
}
  async function openMatchModal(buyQueryId) {
    const modal = document.getElementById('matchModal');
    const container = document.getElementById('match-list-container');
    if (!modal || !container) return;

    modal.classList.remove('hidden');
    container.innerHTML = '<p class="text-center">Loading available panels...</p>';

    try {
      const querySnapshot = await db.collection('sellQueries')
                                    .where('status', '==', 'approved')
                                    .get();

      if (querySnapshot.empty) {
        container.innerHTML = '<p class="text-center">No approved panels are available to sell.</p>';
        return;
      }

      let html = '<ul class="divide-y divide-gray-200">';
      querySnapshot.forEach(doc => {
        const item = doc.data();
        html += `
          <li class="p-4 flex justify-between items-center">
            <div>
              <p class="font-semibold">${item.panelParams}</p>
              <p class="text-sm text-gray-600">Price: ₹${item.price || 0}</p>
            </div>
            <button class="select-panel-btn bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                    data-sell-id="${doc.id}"
                    data-buy-id="${buyQueryId}">
              Select This Panel
            </button>
          </li>
        `;
      });
      html += '</ul>';
      container.innerHTML = html;

    } catch (error) {
      console.error("Error fetching approved panels:", error);
      container.innerHTML = '<p class="text-center text-red-500">Error loading panels.</p>';
    }
  }
// --- NEW: Function to open Match Modal when starting from a Panel ---
async function openMatchModalForSale(sellQueryId) {
    const modal = document.getElementById('matchModal');
    const container = document.getElementById('match-list-container');
    if (!modal || !container) return;

    modal.classList.remove('hidden');
    container.innerHTML = '<p class="text-center">Loading all available buyers...</p>';
    
    // Store the panel ID to be used in the sale process
    modal.dataset.sellQueryId = sellQueryId;

    try {
        // Query active buyer inquiries (from buyQueries)
        const buySnapshot = await db.collection('buyQueries')
                                    .where('status', '==', 'pending_review')
                                    .get();
        // Query users who showed interest (from interestedQueries)
        const interestedSnapshot = await db.collection('interestedQueries')
                                            // Order by timestamp to show latest interest first
                                            .orderBy('timestamp', 'desc') 
                                            .get();

        if (buySnapshot.empty && interestedSnapshot.empty) {
            container.innerHTML = '<p class="text-center">No active buyer inquiries or interested parties available.</p>';
            return;
        }

        let html = '<ul class="divide-y divide-gray-200">';
        
        // 1. List Pending Buy Queries
        buySnapshot.forEach(doc => {
            const item = doc.data();
            html += `
              <li class="p-4 flex justify-between items-center bg-blue-50/50">
                <div>
                  <p class="font-semibold">BUY REQUEST: ${item.requiredWattage}W Panel</p>
                  <p class="text-sm text-gray-600">Budget: ₹${item.budget || 0} (Query ID: ${doc.id})</p>
                </div>
                <button class="select-buyer-btn bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                        data-buy-id="${doc.id}" data-sell-id="${sellQueryId}">
                  Select for Sale
                </button>
              </li>
            `;
        });
        
        // 2. List Interested Queries
        interestedSnapshot.forEach(doc => {
            const item = doc.data();
            html += `
              <li class="p-4 flex justify-between items-center">
                <div>
                  <p class="font-semibold">INTEREST: ${item.productTitle}</p>
                  <p class="text-sm text-gray-600">User: ${item.userName || 'N/A'} (Interested ID: ${doc.id})</p>
                </div>
                <button class="select-buyer-btn bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-700"
                        data-buy-id="${doc.id}" data-sell-id="${sellQueryId}" data-type="interested">
                  Select for Sale
                </button>
              </li>
            `;
        });
        
        html += '</ul>';
        container.innerHTML = html;

    } catch (error) {
        console.error("Error fetching buyers/interests:", error);
        container.innerHTML = '<p class="text-center text-red-500">Error loading buyers.</p>';
    }
}
  });