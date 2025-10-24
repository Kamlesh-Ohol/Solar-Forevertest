document.addEventListener('DOMContentLoaded', () => {

  // --- PASTE YOUR FIREBASE CONFIG OBJECT HERE ---
  const firebaseConfig = {
    apiKey: "AIzaSyBFazdEmqatvQaFgrEiC7btxohKXbkGOyw",
    authDomain: "solar-forever.firebaseapp.com",
    databaseURL: "https://solar-forever-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "solar-forever",
    storageBucket: "solar-forever.firebasestorage.app", // Corrected bucket name
    messagingSenderId: "15804210993",
    appId: "1:15804210993:web:f031750b9651e609b69a10",
    measurementId: "G-T6955CSP1N"
  };

  // --- Initialize Firebase ---
  try {
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();

    // --- Global State & UI References ---
    let currentUser = null;
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const sellForm = document.getElementById('sell-panel-form'); 
    const buyForm = document.getElementById('buy-form');

    // =================================================================
    // PART 1: MODAL AND UI LOGIC
    // =================================================================

    // --- Modal Helper Functions ---
// --- Modal Helper Functions (UPDATED to prevent background scroll) ---

// --- (NEW) Helper for setting up image previews ---
    function setupImagePreview(inputId, previewId) {
      const input = document.getElementById(inputId);
      const preview = document.getElementById(previewId);
      if (input && preview) {
        input.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            preview.src = URL.createObjectURL(file);
            preview.classList.remove('hidden');
          } else {
            preview.classList.add('hidden');
          }
        });
      }
    }

    // --- (NEW) Activate Image Previews ---
    setupImagePreview('sell-panel-image', 'sell-image-preview');
    setupImagePreview('sell-receipt-image', 'sell-receipt-preview');


    // --- (NEW) Image Compression Function ---
    // Returns a Promise that resolves with a compressed Blob
    function compressImage(file, quality = 0.5, maxWidth = 1024) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Get the compressed blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas toBlob failed.'));
              }
            },
            'image/jpeg', // Force JPEG for compression
            quality       // The compression quality (0.0 - 1.0)
          );
        };
        
        img.onerror = (error) => {
          reject(error);
        };
      });
    }
    // --- (NEW) Helper to Upload a BLOB ---
    // This is the second half of the old uploadCompressedImage function
    function uploadBlob(blob, path, progressElement, fileLabel) {
      // Return a promise that resolves to null if the blob is missing
      if (!blob) {
        return Promise.resolve(null);
      }

      return new Promise((resolve, reject) => {
        const storage = firebase.storage();
        const storageRef = storage.ref(path);
        const uploadTask = storageRef.put(blob);

        uploadTask.on('state_changed',
          (snapshot) => {
            // Update progress
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progressElement) {
              progressElement.textContent = `Uploading ${fileLabel}: ${Math.round(progress)}%`;
            }
          },
          (error) => {
            console.error(`Upload failed for ${fileLabel}:`, error);
            reject(error);
          },
          () => {
            // Upload Complete - Get Download URL
            uploadTask.snapshot.ref.getDownloadURL()
              .then(downloadURL => {
                console.log(`${fileLabel} available at`, downloadURL);
                resolve(downloadURL); // This is the final URL
              })
              .catch(reject);
          }
        );
      });
    }


    // --- (NEW) Helper to Compress and Upload a File ---
    // Returns a Promise that resolves with the Download URL
    // function uploadCompressedImage(file, quality, path, progressElement, fileLabel) {
    //   // Return a promise that resolves to null if the file is missing
    //   if (!file) {
    //     return Promise.resolve(null);
    //   }

    //   return new Promise((resolve, reject) => {
    //     // 1. Compress the image
    //     compressImage(file, quality)
    //       .then(blob => {
    //         // 2. Upload the compressed blob
    //         const storage = firebase.storage();
    //         const storageRef = storage.ref(path);
    //         const uploadTask = storageRef.put(blob);

    //         uploadTask.on('state_changed',
    //           (snapshot) => {
    //             // Update progress
    //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //             if (progressElement) {
    //                progressElement.textContent = `Uploading ${fileLabel}: ${Math.round(progress)}%`;
    //             }
    //           },
    //           (error) => {
    //             // Handle Error
    //             console.error(`Upload failed for ${fileLabel}:`, error);
    //             reject(error);
    //           },
    //           () => {
    //             // 3. Upload Complete - Get Download URL
    //             uploadTask.snapshot.ref.getDownloadURL()
    //               .then(downloadURL => {
    //                 console.log(`${fileLabel} available at`, downloadURL);
    //                 resolve(downloadURL); // This is the final URL
    //               })
    //               .catch(reject);
    //           }
    //         );
    //       })
    //       .catch(reject); // Catch errors from compression
    //   });
    // }

    const openModal = (modalId) => {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open'); // Add class to body
      }
    };

    const closeModal = (modal) => {
      if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open'); // Remove class from body
      }
    };
    // --- Header "Login / Sign Up" Button (Desktop) ---
    const loginSignupBtnDesktop = document.getElementById('login-signup-btn-desktop');
    if (loginSignupBtnDesktop) {
      loginSignupBtnDesktop.addEventListener('click', () => {
        if (currentUser) {
          auth.signOut();
        } else {
          openModal('authModal');
          resetAuthForms();
        }
      });
    }

    // --- Event Listener for Mobile Login/Signup Button ---
    const loginSignupBtnMobile = document.getElementById('login-signup-btn-mobile');
    const mobileMenu = document.getElementById('mobile-menu');
    if (loginSignupBtnMobile) {
      loginSignupBtnMobile.addEventListener('click', () => {
        if (currentUser) {
          auth.signOut();
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
             mobileMenu.classList.add('hidden');
          }
        } else {
          openModal('authModal');
          resetAuthForms();
           if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
             mobileMenu.classList.add('hidden');
          }
        }
      });
    }

    // --- "Get Started" Buttons (Hero and Mobile) ---
    const getStartedBtns = document.querySelectorAll('.get-started-btn');
    getStartedBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        openModal('buyOrSellModal');
      });
    });

    // --- "View Details" Buttons (Dynamic Click Listener) ---
    const marketplaceGrid = document.getElementById('marketplace-grid');
    if (marketplaceGrid) {
      marketplaceGrid.addEventListener('click', async (e) => {
        // Check if the clicked element is a .view-details-btn
        if (e.target.matches('.view-details-btn')) {
          const docId = e.target.dataset.docId;
          if (!docId) return;

          const productDetailModal = document.getElementById('productDetailModal');
          const modalTitle = document.getElementById('modal-product-title');
          const modalImg = document.getElementById('modal-product-img');
          const modalCondition = document.getElementById('modal-product-condition');
          const modalPrice = document.getElementById('modal-product-price');
          const modalWattage = document.getElementById('modal-product-wattage');
          const modalAge = document.getElementById('modal-product-age');

          // Show loading state
          modalTitle.textContent = 'Loading...';
          modalImg.src = '';
          
          openModal('productDetailModal');

          try {
            // Fetch the item's details from Firestore
            const doc = await db.collection('sellQueries').doc(docId).get();
            if (!doc.exists) {
              modalTitle.textContent = 'Error: Item not found.';
              return;
            }
            
            const item = doc.data();

            // --- Populate the modal ---
            // Store product title for the "Interested?" button
            productDetailModal.dataset.productTitle = item.panelParams;

            modalTitle.textContent = item.panelParams;
            modalImg.src = item.panelImageURL;
            modalPrice.textContent = `$${item.price}`;
            
            // Try to extract extra details
            try {
                // (You still need to add 'condition' to your form)
                modalCondition.textContent = 'Condition: (Add field to form)'; 
                modalWattage.textContent = item.panelParams.split('W')[0] + 'W';
                // Calculate age
                const purchaseYear = new Date(item.purchaseDate).getFullYear();
                const currentYear = new Date().getFullYear();
                const age = currentYear - purchaseYear;
                modalAge.textContent = (age <= 0) ? 'Less than 1 year old' : `${age} years old`;
            } catch (err) { /* ignore parsing errors */ }
            
            document.getElementById('modal-product-status').textContent = "Expert Verified";

          } catch (error) {
            console.error("Error fetching item details:", error);
            modalTitle.textContent = 'Error loading details.';
          }
        }
      });
    }

    // --- "Interested?" Button (UPDATED with Profile Check) ---
    const interestedBtn = document.getElementById('interested-btn');
    if (interestedBtn) {
      interestedBtn.addEventListener('click', () => {
        const productDetailModal = document.getElementById('productDetailModal');
        const productTitle = productDetailModal ? productDetailModal.dataset.productTitle : 'Unknown Product';

        // Use the new profile check function
        checkUserProfile(async () => {
          // This code only runs if the user is logged in AND has a profile
          try {
            // We know the doc exists, so we can get it
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            const userName = userDoc.data().name;
            const userLocation = userDoc.data().address;

            // Save data to 'interestedQueries' collection
            await db.collection('interestedQueries').add({
              userId: currentUser.uid,
              userName: userName,
              userLocation: userLocation,
              userPhone: currentUser.phoneNumber,
              productTitle: productTitle,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Successfully saved interest
            console.log('Interest registered for user:', currentUser.uid);
            closeModal(productDetailModal);
            openModal('interestedQueryModal'); // Show success modal

          } catch (error) {
            console.error("Error saving interest: ", error);
            alert("There was an error registering your interest. Please try again.");
            closeModal(productDetailModal);
          }
        });
      });
    }

    // --- All "Close" Buttons ---
    const closeBtns = document.querySelectorAll('.close-modal-btn');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalToClose = e.target.closest('.modal-backdrop');
        if (modalToClose) {
          closeModal(modalToClose);
        }
      });
    });

    // --- Close modal by clicking on the backdrop ---
    const allModals = document.querySelectorAll('.modal-backdrop');
    allModals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal);
        }
      });
    });

    // --- Mobile Menu Button ---
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
    }

    // --- Buy/Sell Modal Buttons (with Login Check) ---
    const buyBtn = document.getElementById('buy-btn');
    const sellBtn = document.getElementById('sell-btn');
    const buyOrSellModal = document.getElementById('buyOrSellModal');

    if (buyBtn && buyOrSellModal) {
      buyBtn.addEventListener('click', () => {
        closeModal(buyOrSellModal);
        if (currentUser) {
           openModal('buyRequestModal');
        } else {
           alert("Please log in or sign up to buy panels.");
           openModal('authModal');
           resetAuthForms();
        }
      });
    }

    if (sellBtn && buyOrSellModal) {
      sellBtn.addEventListener('click', () => {
        closeModal(buyOrSellModal);
        if (currentUser) {
            openModal('sellPanelModal');
        } else {
            alert("Please log in or sign up to sell panels.");
            openModal('authModal');
            resetAuthForms();
        }
      });
    }

    // --- Auth Modal Tabs (Login/Signup) ---
    const loginTab = document.getElementById('login-tab-btn');
    const signupTab = document.getElementById('signup-tab-btn');
    if (loginTab && signupTab && loginForm && signupForm) {
      loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        resetAuthForms();
      });

      signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        resetAuthForms();
      });
    }

    // --- Sticky Header on Scroll ---
    const header = document.getElementById('header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }

    // --- Set current year in footer ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }


    // =================================================================
    // PART 2: FIREBASE AUTH LOGIC & FORM VALIDATION
    // =================================================================

    // --- CORE AUTH LOGIC ---
    auth.onAuthStateChanged(user => {
      currentUser = user;
      const loginBtnDesktop = document.getElementById('login-signup-btn-desktop');
      const loginBtnMobile = document.getElementById('login-signup-btn-mobile');
      if (user) {
        console.log("User is signed in:", user.phoneNumber);
        if (loginBtnDesktop) loginBtnDesktop.textContent = 'Logout';
        if (loginBtnMobile) loginBtnMobile.textContent = 'Logout';
      } else {
        console.log("User is signed out.");
        if (loginBtnDesktop) loginBtnDesktop.textContent = 'Login / Sign Up';
        if (loginBtnMobile) loginBtnMobile.textContent = 'Login / Sign Up';
      }
    });

    // Function to clear old reCAPTCHA
    function clearRecaptcha() {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }

    // Function to reset auth forms
    function resetAuthForms() {
        clearRecaptcha();
        if(loginForm) loginForm.reset();
        const loginPhoneSection = document.getElementById('login-phone-section');
        const loginOtpSection = document.getElementById('login-otp-section');
        const loginButton = document.getElementById('login-button');
        if (loginPhoneSection) loginPhoneSection.classList.remove('hidden');
        if (loginOtpSection) loginOtpSection.classList.add('hidden');
        if (loginButton) loginButton.textContent = 'Send OTP';

        if(signupForm) signupForm.reset();
        const signupDetailsSection = document.getElementById('signup-details-section');
        const signupOtpSection = document.getElementById('signup-otp-section');
        const signupButton = document.getElementById('signup-button');
        if (signupDetailsSection) signupDetailsSection.classList.remove('hidden');
        if (signupOtpSection) signupOtpSection.classList.add('hidden');
        if (signupButton) signupButton.textContent = 'Send OTP & Sign Up';
    }


    // --- Sign-In Flow ---
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loginButton = document.getElementById('login-button');
        const phoneNumberInput = document.getElementById('login-phone');
        const otpInput = document.getElementById('login-otp');

        // Basic Validation
        const rawPhoneNumber = phoneNumberInput.value.trim();
        if (loginButton.textContent.includes('Send')) {
            if (!rawPhoneNumber) {
                alert('Please enter your 10-digit phone number.');
                return;
            }
            if (!/^\d{10}$/.test(rawPhoneNumber)) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }
        }
         if (loginButton.textContent.includes('Verify') && !otpInput.value) {
            alert('Please enter the OTP.');
            return;
        }

        // Proceed with Firebase logic
        if (loginButton.textContent.includes('Send')) {
          clearRecaptcha();
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container-login', { 'size': 'invisible' });
          const phoneNumber = "+91" + phoneNumberInput.value; // Correct variable used
          auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
            .then(confirmationResult => {
              window.confirmationResult = confirmationResult;
              document.getElementById('login-phone-section').classList.add('hidden');
              document.getElementById('login-otp-section').classList.remove('hidden');
              loginButton.textContent = 'Verify OTP';
              alert('OTP sent successfully!');
            }).catch(error => alert("Sign in failed: " + error.message));
        } else {
          const otp = otpInput.value;
          window.confirmationResult.confirm(otp).then(result => {
            alert("Successfully signed in!");
            closeModal(authModal);
            resetAuthForms();
          }).catch(error => {
              alert("Invalid OTP: " + error.message);
          });
        }
      });
    }

    // --- Sign-Up Flow --- (Updated: Removed Firestore save, added existing user check)
    if (signupForm) {
      signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const signupButton = document.getElementById('signup-button');
        const nameInput = document.getElementById('signup-name');
        const addressInput = document.getElementById('signup-address');
        const phoneInput = document.getElementById('signup-phone');
        const otpInput = document.getElementById('signup-otp');

        // Basic Validation
        const rawPhoneNumberSignUp = phoneInput.value.trim();
        if (signupButton.textContent.includes('Send')) {
             if (!nameInput.value || !addressInput.value || !rawPhoneNumberSignUp) {
                alert('Please fill in all required fields (Name, Address, Phone Number).');
                return;
             }
             if (!/^\d{10}$/.test(rawPhoneNumberSignUp)) {
                alert('Please enter a valid 10-digit phone number.');
                return;
             }
        } else {
             if (!otpInput.value) {
                alert('Please enter the OTP.');
                return;
            }
        }

        // Proceed with Firebase logic
        if (signupButton.textContent.includes('Send')) {
          clearRecaptcha();
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container-signup', { 'size': 'invisible' });
          const phoneNumber = "+91" + phoneInput.value; // Correct variable used
          auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
            .then(confirmationResult => {
              window.confirmationResult = confirmationResult;
              document.getElementById('signup-details-section').classList.add('hidden');
              document.getElementById('signup-otp-section').classList.remove('hidden');
              signupButton.textContent = 'Create Account';
              alert('OTP sent successfully!');
            }).catch(error => {
                alert("Sign up failed: " + error.message);
                 document.getElementById('signup-details-section').classList.remove('hidden');
                 document.getElementById('signup-otp-section').classList.add('hidden');
                 signupButton.textContent = 'Send OTP & Sign Up';
            });
        } else {
          // Phase 2: Verify OTP
          const otp = otpInput.value;
          // Get the name and address values again
          const name = document.getElementById('signup-name').value;
          const address = document.getElementById('signup-address').value;

          // Simple validation
          if (!name || !address) {
            alert("An error occurred. Your name and address were missing. Please try signing up again.");
            resetAuthForms();
            return;
          }

          window.confirmationResult.confirm(otp)
            .then(result => {
                const user = result.user;

                // --- THIS IS THE KEY CHANGE ---
                // We will *always* save/update the user's details.
                // .set() with { merge: true } is perfect for this:
                // 1. If the user doc doesn't exist, it creates it.
                // 2. If it *does* exist, it just updates the name/address fields.
                const savePromise = db.collection('users').doc(user.uid).set({
                    name: name,
                    address: address,
                    phone: user.phoneNumber,
                    // This will update the timestamp on each "Sign Up"
                    // but it ensures the data is fresh.
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp() 
                }, { merge: true }); // { merge: true } is crucial

                // Pass the original 'result' object to the next .then()
                return savePromise.then(() => result);
            })
            .then((result) => {
               // Now we check if it was a new user *just for the alert message*
               if (result.additionalUserInfo && !result.additionalUserInfo.isNewUser) {
                   alert("Account details updated! Logging you in.");
               } else {
                   alert("Account created successfully!");
               }
               
               // Close and reset the form
               closeModal(authModal);
               resetAuthForms();
            })
            .catch(error => {
                alert("Account creation/verification failed: " + error.message);
                // Show the details section again on error
                document.getElementById('signup-details-section').classList.remove('hidden');
                document.getElementById('signup-otp-section').classList.add('hidden');
                signupButton.textContent = 'Send OTP & Sign Up';
            });
        }
      });
    }
    // --- Sell Panel Form Validation & Submission ---
    // --- Sell Panel Form Validation & Submission --- (UPDATED for 2 IMAGES + COMPRESSION)
    // --- Sell Panel Form Validation & Submission --- (UPDATED for better UI feedback)
    // --- Sell Panel Form Validation & Submission --- (UPDATED for Price)
    if (sellForm) {
        // --- This function will reset your form after success ---
        window.resetSellForm = () => {
            sellForm.reset();
            document.getElementById('sell-image-preview').classList.add('hidden');
            document.getElementById('sell-receipt-preview').classList.add('hidden'); 
            document.getElementById('sell-success').classList.add('hidden');
            sellForm.classList.remove('hidden');
            const submitButton = document.getElementById('sell-submit-button');
            submitButton.disabled = false;
            submitButton.textContent = 'Submit for Review';
        }

        sellForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Get form elements and values
            const purchaseDateInput = document.getElementById('sell-purchase-date');
            const purchasedFromInput = document.getElementById('sell-purchased-from');
            const panelParamsInput = document.getElementById('sell-panel-params');
            const priceInput = document.getElementById('sell-price'); // <-- ADDED
            const panelImageInput = document.getElementById('sell-panel-image');
            const receiptImageInput = document.getElementById('sell-receipt-image');
            const submitButton = document.getElementById('sell-submit-button');
            const progressText = document.getElementById('upload-progress');
            
            const panelFile = panelImageInput.files[0];
            const receiptFile = receiptImageInput.files[0];
            const price = priceInput.value; // <-- ADDED

            // 2. Validation
            if (!purchaseDateInput.value || !purchasedFromInput.value || !panelParamsInput.value || !price || !panelFile) { // <-- ADDED !price
                alert('Please fill in all required fields, including price and panel image.');
                return;
            }
            
            // 3. Check for logged-in user
            if (!currentUser) {
                alert("You must be logged in to sell a panel.");
                closeModal(document.getElementById('sellPanelModal'));
                openModal('authModal');
                return;
            }

            // 4. Disable button and show progress
            submitButton.disabled = true;
            submitButton.textContent = 'Compressing...';
            progressText.classList.remove('hidden');
            progressText.textContent = 'Compressing images...';

            // 5. Define compression settings
            const compressionQuality = 0.7; 
            const compressionMaxWidth = 800;
            
            // 6. Create compression promises
            const panelCompressPromise = compressImage(panelFile, compressionQuality, compressionMaxWidth);
            const receiptCompressPromise = receiptFile ? compressImage(receiptFile, compressionQuality, compressionMaxWidth) : Promise.resolve(null);

            // 7. Wait for compression to finish
            Promise.all([panelCompressPromise, receiptCompressPromise])
                .then(([panelBlob, receiptBlob]) => {
                    
                    submitButton.textContent = 'Uploading...';
                    progressText.textContent = 'Upload started...';

                    // 8. Create upload promises
                    const panelPath = `sell-images/${currentUser.uid}/${Date.now()}-panel-${panelFile.name}`;
                    const receiptPath = receiptFile ? `sell-images/${currentUser.uid}/${Date.now()}-receipt-${receiptFile.name}` : null;

                    const panelUploadPromise = uploadBlob(panelBlob, panelPath, progressText, 'Panel');
                    const receiptUploadPromise = uploadBlob(receiptBlob, receiptPath, progressText, 'Receipt');

                    // 9. Wait for uploads to finish
                    return Promise.all([panelUploadPromise, receiptUploadPromise]);
                })
                .then(([panelImageURL, receiptImageURL]) => {
                    // 10. Save data to Firestore
                    submitButton.textContent = 'Saving Details...';
                    return db.collection('sellQueries').add({
                        sellerId: currentUser.uid,
                        sellerPhone: currentUser.phoneNumber,
                        purchaseDate: purchaseDateInput.value,
                        purchasedFrom: purchasedFromInput.value,
                        panelParams: panelParamsInput.value,
                        price: Number(price), // <-- ADDED
                        panelImageURL: panelImageURL, 
                        receiptImageURL: receiptImageURL || null, 
                        status: 'pending_review',
                        submittedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                })
                .then(() => {
                    // 11. SUCCESS: Show success message
                    console.log("Sell query successfully submitted with images!");
                    sellForm.classList.add('hidden');
                    progressText.classList.add('hidden');
                    document.getElementById('sell-success').classList.remove('hidden');
                })
                .catch((error) => {
                    // 12. ERROR: Handle all errors
                    console.error("Submission failed: ", error);
                    alert("There was an error during submission. Check the console (F12) for details.");
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit for Review';
                    progressText.classList.add('hidden');
                });
        });
    }

    // --- Buy Request Form Validation & Submission ---
    // --- Buy Request Form Validation & Submission --- (UPDATED WITH FIREBASE)
    if (buyForm) {
        buyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form elements
            const wattageInput = buyForm.querySelector('input[placeholder*="5000 W"]');
            const budgetInput = buyForm.querySelector('input[placeholder*="2000"]');
            const preferenceInput = buyForm.querySelector('input[placeholder*="Canadian Solar"]');
            const submitButton = buyForm.querySelector('button[type="submit"]');

            // Get form values
            const wattage = wattageInput.value;
            const budget = budgetInput.value;
            const preference = preferenceInput.value || 'N/A'; // Use 'N/A' if empty

            // 1. Validation
            if (!wattage || !budget) {
                alert('Please fill in the required wattage and budget.');
                return;
            }

            // 2. Check for logged-in user (should be available in `currentUser`)
            if (!currentUser) {
                alert("You must be logged in to submit a request.");
                closeModal(document.getElementById('buyRequestModal'));
                openModal('authModal');
                return;
            }
            
            // 3. Disable button to prevent double clicks
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            // 4. Add data to Firestore
            db.collection('buyQueries').add({
                buyerId: currentUser.uid,
                buyerPhone: currentUser.phoneNumber,
                requiredWattage: Number(wattage), // Save as a number
                budget: Number(budget),           // Save as a number
                preference: preference,
                status: 'pending_review',
                submittedAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                // 5. SUCCESS: Show success message
                console.log("Buy query successfully submitted to Firestore.");
                buyForm.classList.add('hidden');
                
                // You can pick which message to show, or keep your random logic.
                // I'll just show the 'found' one for this example.
                document.getElementById('buy-result-found').classList.remove('hidden');
                
                // 6. Reset form for next time
                buyForm.reset();
                submitButton.disabled = false;
                submitButton.textContent = 'Find a Match';
            })
            .catch((error) => {
                // 7. ERROR: Show error and re-enable button
                console.error("Error adding buy query: ", error);
                alert("There was an error submitting your request. Please try again.");
                submitButton.disabled = false;
                submitButton.textContent = 'Find a Match';
            });
        });

        // --- (NEW) Load Main Marketplace ---
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

// --- Call the new function ---
loadMainMarketplace();
    }


  } catch (error) {
    console.error("Firebase initialization failed:", error);
    alert("Could not connect to services. Please try again later.");
  }
});