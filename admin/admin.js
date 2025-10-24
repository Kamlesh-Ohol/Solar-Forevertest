// document.addEventListener('DOMContentLoaded', function () {
//   const adminLoginSection = document.getElementById('admin-login-section');
//   const adminDashboardSection = document.getElementById('admin-dashboard-section');
//   const adminLoginForm = document.getElementById('admin-login-form');
//   const adminLoginError = document.getElementById('admin-login-error');
//   const logoutBtn = document.getElementById('admin-logout-btn');
//   const confirmationMessage = document.getElementById('confirmation-message');

//   // Admin Login
//   adminLoginForm.addEventListener('submit', function (e) {
//     e.preventDefault();
//     const email = e.target.email.value;
//     const password = e.target.password.value;

//     /*    // Simple validation (replace with actual auth)
//         if (email === 'adminuser@gmail.com' && password === 'solar@2025') {
//           adminLoginSection.classList.add('hidden');
//           adminDashboardSection.classList.remove('hidden');
//         } else {
//           adminLoginError.classList.remove('hidden');
//         }
//       });
//     */
//     // Firebase Email/Password Auth
//     firebase.auth().signInWithEmailAndPassword(email, password)
//       .then((userCredential) => {
//         adminLoginSection.classList.add('hidden');
//         adminDashboardSection.classList.remove('hidden');
//         console.log('Logged in as:', userCredential.user.email);
//       })
//       .catch((error) => {
//         adminLoginError.classList.remove('hidden');
//         console.error('Login error:', error);
//       });
//   });
//   logoutBtn?.addEventListener('click', () => {
//     firebase.auth().signOut().catch(console.error);
//   });

//   firebase.auth().onAuthStateChanged(user => {
//   if (user) {
//     adminLoginSection.classList.add('hidden');
//     adminDashboardSection.classList.remove('hidden');
//     adminLoginError.classList.add('hidden');
//   } else {
//     adminDashboardSection.classList.add('hidden');
//     adminLoginSection.classList.remove('hidden');

//     // Clear email and password fields on logout
//     adminLoginForm.email.value = '';
//     adminLoginForm.password.value = '';
//   }
// });

// // Modal Logic
// const openModalButtons = document.querySelectorAll('[data-modal-target]');
// const closeModalButtons = document.querySelectorAll('[data-modal-close]');

// openModalButtons.forEach(button => {
//   button.addEventListener('click', () => {
//     const modal = document.getElementById(button.dataset.modalTarget);
//     modal.classList.remove('hidden');
//   });
// });

// closeModalButtons.forEach(button => {
//   button.addEventListener('click', () => {
//     const modal = document.getElementById(button.dataset.modalClose);
//     modal.classList.add('hidden');
//   });
// });

// // Close modal by clicking on the background overlay
// document.querySelectorAll('.modal').forEach(modal => {
//   modal.addEventListener('click', (e) => {
//     if (e.target === modal) {
//       modal.classList.add('hidden');
//     }
//   });
// });

// // Show confirmation message function
// function showConfirmation(message) {
//   confirmationMessage.textContent = message;
//   confirmationMessage.classList.remove('hidden', 'translate-x-full');
//   confirmationMessage.classList.add('translate-x-0');
//   setTimeout(() => {
//     confirmationMessage.classList.remove('translate-x-0');
//     confirmationMessage.classList.add('translate-x-full');
//     setTimeout(() => {
//       confirmationMessage.classList.add('hidden');
//     }, 300); // Wait for transition to finish
//   }, 3000); // Message visible for 3 seconds
// }

// // Backend API call to update panel status
// async function adminAction(panelId, actionType) {
//   const endpointMap = {
//     approve: `/api/admin/panels/${panelId}/approve`,
//     disapprove: `/api/admin/panels/${panelId}/disapprove`,
//     sold: `/api/admin/panels/${panelId}/sold`,
//     delist: `/api/admin/panels/${panelId}/delist`
//   };
//   const url = endpointMap[actionType];
//   if (!url) {
//     showConfirmation('Unknown action.');
//     return;
//   }
//   try {
//     const response = await fetch(url, { method: 'POST' });
//     const data = await response.json();
//     showConfirmation(data.message || 'Action completed.');
//   } catch (error) {
//     showConfirmation('Error performing action.');
//     console.error(error);
//   }
// }

// // Listen for admin action button clicks inside modals
// document.querySelectorAll('.modal .action-btn').forEach(button => {
//   button.addEventListener('click', function () {
//     const panelId = button.getAttribute('data-panel-id');
//     const actionType = button.getAttribute('data-action');
//     if (panelId && actionType) {
//       adminAction(panelId, actionType);
//     }
//   });
// });

// // Also update confirmation for marketplace management buttons (if needed)
// const marketplaceActionButtons = document.querySelectorAll('#marketplace-management .action-btn');
// marketplaceActionButtons.forEach(button => {
//   button.addEventListener('click', () => {
//     let message = 'Panel status updated.';
//     if (button.textContent.includes('Sold')) message = 'Panel marked as sold.';
//     if (button.textContent.includes('De-list')) message = 'Panel has been de-listed.';
//     showConfirmation(message);
//   });
// });
// });
// // Note: Ensure your backend server (e.g., Express with Firebase Admin SDK) is set up to handle the API requests made in adminAction function.
// // Example backend setup (not included in this file):
// // const express = require('express');
// // const admin = require('firebase-admin');
// // const app = express();
// // app.use(express.json());
// // app.post('/api/admin/panels/:id/:action', async (req, res) => {
// //   const { id, action } = req.params;
// //   try {
// //     // Perform the action using Firebase Admin SDK
// //     await admin.firestore().collection('panels').doc(id).update({ status: action });
// //     res.json({ message: 'Action successful.' });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Error performing action.' });
// //   }
// // });

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', () => {

  // Get Firebase services from your firebase.js (assuming it's initialized there)
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Get Page Sections
  const loginSection = document.getElementById('admin-login-section');
  const dashboardSection = document.getElementById('admin-dashboard-section');
  
  // Get Login Form
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('admin-login-error');
  
  // Get Logout Button
  const logoutBtn = document.getElementById('admin-logout-btn');

  // =================================================================
  // 1. AUTHENTICATION
  // =================================================================

  // --- Handle Login ---
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm['admin-email'].value;
      const password = loginForm['admin-password'].value;

      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Success! Handled by onAuthStateChanged
          console.log("Admin logged in", userCredential.user);
        })
        .catch((error) => {
          loginError.textContent = `Login failed: ${error.message}`;
          loginError.classList.remove('hidden');
        });
    });
  }

  // --- Handle Logout ---
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.signOut();
    });
  }

  // --- Auth State Listener ---
  // This controls showing/hiding the login page vs. the dashboard
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      loginSection.classList.add('hidden');
      dashboardSection.classList.remove('hidden');
      // Load all the dynamic data for the dashboard
      loadPendingVerifications();
      loadBuyerQueries();
      loadMarketplaceItems();
    } else {
      // User is logged out
      loginSection.classList.remove('hidden');
      dashboardSection.classList.add('hidden');
    }
  });

  // =================================================================
  // 2. LOAD PENDING SELLER VERIFICATIONS (Answers your question)
  // =================================================================

  async function loadPendingVerifications() {
    const tableBody = document.querySelector('#seller-queries tbody');
    if (!tableBody) return;

    // Clear static/old data
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
      
      let html = ''; // Build the HTML string

      // Loop through each pending query
      for (const doc of querySnapshot.docs) {
        const query = doc.data();
        
        // --- THIS IS THE "LINK" ---
        // Fetch the seller's name from the 'users' collection using sellerId
        let userName = 'Unknown User';
        try {
          const userDoc = await db.collection('users').doc(query.sellerId).get();
          if (userDoc.exists) {
            userName = userDoc.data().name || 'N/A';
          }
        } catch (e) {
          console.error("Error fetching user data:", e);
        }
        
        // Get submission date
        const date = query.submittedAt ? new Date(query.submittedAt.seconds * 1000).toLocaleDateString() : 'N/A';

        // Add a new row to the HTML string
        html += `
          <tr class="border-b">
            <td class="p-4">${userName}</td>
            <td class="p-4">${query.panelParams || 'N/A'}</td>
            <td class="p-4 text-sm text-gray-500">${date}</td>
            <td class="p-4">
              <button class="view-details-btn bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-blue-200" 
                      data-doc-id="${doc.id}" 
                      data-modal-target="sellerQueryModal">
                View Details
              </button>
            </td>
          </tr>
        `;
      }

      tableBody.innerHTML = html; // Add all new rows to the table at once

    } catch (error) {
      console.error("Error loading pending verifications: ", error);
      tableBody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-500">Error loading data.</td></tr>';
    }
  }

  // =================================================================
  // 3. HANDLE MODAL CLICKS (To show the images)
  // =================================================================
  // =================================================================
  // 3. HANDLE MODAL CLICKS (To show the images)
  // =================================================================

// --- LISTENER 1: Opening the modal (clicks INSIDE the dashboard) ---
  dashboardSection.addEventListener('click', async (e) => {
    
    // Check if a "View Details" button was clicked
    if (e.target.matches('.view-details-btn') && e.target.dataset.modalTarget === 'sellerQueryModal') {
      const docId = e.target.dataset.docId;
      if (!docId) return;

      // Get the one modal from your HTML
      const modal = document.getElementById('sellerQueryModal1');
      if (!modal) return;
      
      // Show loading state
      modal.classList.remove('hidden');
      modal.querySelector('.modal-content').innerHTML = '<div class="p-8 text-center">Loading details...</div>';

      try {
        // Fetch the FULL data for this *one* document
        const queryDoc = await db.collection('sellQueries').doc(docId).get();
        if (!queryDoc.exists) throw new Error("Document not found.");
        
        const query = queryDoc.data();
        
        // Fetch the linked user's data
        const userDoc = await db.collection('users').doc(query.sellerId).get();
        const user = userDoc.exists ? userDoc.data() : {};

        // --- DYNAMICALLY BUILD THE MODAL CONTENT ---
        const modalContent = `
          <div class="flex justify-between items-center p-4 border-b">
            <h3 class="text-xl font-bold">Seller Verification</h3>
            <button data-modal-close="sellerQueryModal1" class="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
          </div>
          
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
            <div class="space-y-3">
              <h4 class="font-semibold text-lg border-b pb-2">Seller Information</h4>
              <div><strong>Name:</strong> ${user.name || 'N/A'}</div>
              <div><strong>Phone:</strong> ${query.sellerPhone || 'N/A'}</div>
              <div><strong>Address:</strong> ${user.address || 'N/A'}</div>
            </div>
            
            <div class="space-y-3">
              <h4 class="font-semibold text-lg border-b pb-2">Panel Information</h4>
              <div><strong>Parameters:</strong> ${query.panelParams || 'N/A'}</div>
              <div><strong>Purchased From:</strong> ${query.purchasedFrom || 'N/A'}</div>
              <div><strong>Purchase Date:</strong> ${query.purchaseDate || 'N/A'}</div>
              <div><strong>Price:</strong> ₹${query.price || 'N/A'}</div>

            <div class="space-y-2">
              <h4 class="font-semibold text-lg">Panel Image</h4>
              <a href="${query.panelImageURL}" target="_blank">
                <img src="${query.panelImageURL}" alt="Panel Image" class="w-full h-48 object-cover rounded border">
              </a>
            </div>
            
            <div class="space-y-2">
              <h4 class="font-semibold text-lg">Receipt Image</h4>
              ${query.receiptImageURL ? `
                <a href="${query.receiptImageURL}" target="_blank">
                  <img src="${query.receiptImageURL}" alt="Receipt Image" class="w-full h-48 object-cover rounded border">
                </a>
              ` : '<p class="text-gray-500">No receipt uploaded.</p>'}
            </div>
          </div>
          
          <div class="flex justify-end items-center p-4 bg-gray-50 border-t rounded-b-lg gap-3">
            <button class="action-btn bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700"
                    data-action="disapprove" data-doc-id="${docId}">
              Disapprove Listing
            </button>
            <button class="action-btn bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700"
                    data-action="approve" data-doc-id="${docId}">
              Approve Listing
            </button>
          </div>
        `;
        
        // Inject the new content into the modal
        modal.querySelector('.modal-content').innerHTML = modalContent;

      } catch (error) {
        console.error("Error loading query details: ", error);
        modal.querySelector('.modal-content').innerHTML = `<div class="p-8 text-center text-red-500">Error: ${error.message}</div>`;
      }
    }

    // You can add the marketplace button logic here too
    if (e.target.matches('.view-marketplace-item-btn')) {
        // TODO: Add logic for opening the marketplace item modal
        console.log("Marketplace item clicked. Doc ID:", e.target.dataset.docId);
    }
  });

  // --- LISTENER 2: Modal Actions (clicks ANYWHERE on the page) ---
  document.addEventListener('click', async (e) => {
    
    // --- Handle closing the modal (with the 'x' button) ---
    if (e.target.matches('[data-modal-close]')) {
      const modalId = e.target.dataset.modalClose;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('hidden');
      }
    }

    // --- Handle Approval/Disapproval ---
    if (e.target.matches('.action-btn')) {
        const button = e.target;
        const action = button.dataset.action;
        const docId = button.dataset.docId; // Get docId from the button
        
        if (!action || !docId) {
            console.error("Action button missing action or docId");
            return;
        }

        const newStatus = (action === 'approve') ? 'approved' : (action === 'disapprove') ? 'rejected' : null;

        if (!newStatus) {
            console.error("Unknown action:", action);
            return;
        }

        button.disabled = true;
        button.textContent = 'Updating...';

        try {
            await db.collection('sellQueries').doc(docId).update({
                status: newStatus
            });
            
            alert(`Listing ${newStatus} successfully!`);
            
            // Close the modal
            const modal = button.closest('.modal');
            if (modal) modal.classList.add('hidden');
            
            // Reload both lists
            loadPendingVerifications(); 
            loadMarketplaceItems(); 

        } catch (error) {
            console.error("Error updating status: ", error);
            alert(`Failed to update status: ${error.message}`);
            
            // Re-enable the button on error
            button.disabled = false;
            button.textContent = (action === 'approve') ? 'Approve Listing' : 'Disapprove Listing';
        }
    }

    // --- Handle closing modal by clicking backdrop ---
    if (e.target.matches('.modal')) {
        e.target.classList.add('hidden');
    }
    // --- Handle Approval/Disapproval ---
    if (e.target.matches('.action-btn')) {
        const button = e.target;
        const action = button.dataset.action;
        const docId = button.dataset.docId; // Get docId from the button

        if (!action || !docId) {
            console.error("Action button missing action or docId");
            return;
        }

        const newStatus = (action === 'approve') ? 'approved' : (action === 'disapprove') ? 'rejected' : null;

        if (!newStatus) {
            console.error("Unknown action:", action);
            return;
        }

        button.disabled = true;
        button.textContent = 'Updating...';

        try {
            await db.collection('sellQueries').doc(docId).update({
                status: newStatus
            });

            alert(`Listing ${newStatus} successfully!`);

            // Close the modal
            const modal = button.closest('.modal');
            if (modal) modal.classList.add('hidden');

            // Reload both lists
            loadPendingVerifications(); 
            loadMarketplaceItems(); 

        } catch (error) {
            console.error("Error updating status: ", error);
            alert(`Failed to update status: ${error.message}`);

            // Re-enable the button on error
            button.disabled = false;
            button.textContent = (action === 'approve') ? 'Approve Listing' : 'Disapprove Listing';
        }
    }
  });

  // --- STUB FUNCTIONS (You need to build these next) ---
  function loadBuyerQueries() {
    console.log("Loading buyer queries...");
    // TODO: Write a function similar to loadPendingVerifications()
    // 1. Query 'buyQueries' and 'interestedQueries'
    // 2. Fetch linked user data from 'users'
    // 3. Build HTML and add it to the '#buyer-queries tbody'
  }
  
 // --- (NEW) Load Main Marketplace ---
    async function loadMainMarketplace() {
      const grid = document.getElementById('marketplace-grid');
      if (!grid) return;

      grid.innerHTML = '<p class="col-span-4 text-center">Loading available panels...</p>';

      try {
        const querySnapshot = await db.collection('sellQueries')
                                      .where('status', '==', 'approved')
                                      .orderBy('submittedAt', 'desc')
                                      .get();
        
        if (querySnapshot.empty) {
          grid.innerHTML = '<p class="col-span-4 text-center">No panels are available right now. Check back soon!</p>';
          return;
        }

        let html = '';
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          const docId = doc.id; // We'll need this for the "View Details" button

          html += `
            <div class="bg-white rounded-lg overflow-hidden shadow-lg group border">
              <img src="${item.panelImageURL}" class="w-full h-48 object-cover" alt="Solar Panel">
              <div class="p-4">
                <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Expert Verified</span>
                <h3 class="font-bold mt-2 text-lg text-gray-800" style="width:250px;height:56px;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">
                  ${item.panelParams}
                </h3>
                <p class="text-gray-600 text-sm">Condition: (Add field to form)</p>
                <p class="text-blue-700 font-bold text-xl mt-2">$${item.price}</p>
                <button class="view-details-btn w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors" data-doc-id="${docId}">
                  View Details
                </button>
              </div>
            </div>
          `;
        });
        grid.innerHTML = html;

      } catch (error) {
        console.error("Error loading marketplace: ", error);
        grid.innerHTML = '<p class="col-span-4 text-center text-red-500">Could not load panels. Please try again later.</p>';
      }
    }

});