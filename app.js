
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const form = document.getElementById('registrationForm');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');
  const clearBtn = document.getElementById('clearBtn');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const usersContainer = document.getElementById('usersContainer');
  const userCountBadge = document.getElementById('userCount');
  const emptyState = document.getElementById('emptyState');

  // Inputs list for real-time validation
  const inputs = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    username: document.getElementById('username'),
    password: passwordInput,
    dob: document.getElementById('dob'),
    mobile: document.getElementById('mobile'),
    pinCode: document.getElementById('pinCode'),
    address: document.getElementById('address')
  };

  // Eye icon paths for Toggle Password (visible / hidden)
  const eyeOpenSvg = `
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  `;
  const eyeClosedSvg = `
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
    <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" stroke-width="2"/>
  `;

  // Toggle Password Visibility
  togglePasswordBtn.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.innerHTML = isPassword ? eyeClosedSvg : eyeOpenSvg;
    togglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide Password' : 'Show Password');
  });

  // Validation helper: Set success/error classes
  function showStatus(input, isValid, errorMsgElement = null) {
    const group = input.closest('.input-group');
    if (isValid) {
      group.classList.remove('error');
      group.classList.add('success');
    } else {
      group.classList.remove('success');
      group.classList.add('error');
    }
  }

  // Clear validation classes
  function clearStatus(input) {
    const group = input.closest('.input-group');
    group.classList.remove('success', 'error');
  }

  // Validator functions
  const validators = {
    firstName: (val) => val.trim().length > 0,
    lastName: (val) => val.trim().length > 0,
    username: (val) => val.trim().length > 0,
    password: (val) => val.length >= 4,
    dob: (val) => {
      if (!val) return false;
      const birthDate = new Date(val);
      const today = new Date();
      return birthDate < today; // must be in the past
    },
    mobile: (val) => {
      // Allow any phone numbers with length between 5 and 15 digits
      const cleaned = val.replace(/\D/g, '');
      return cleaned.length >= 5 && cleaned.length <= 15;
    },
    pinCode: (val) => {
      // Standard 6 digit PIN code validation
      return /^\d{6}$/.test(val.trim());
    },
    address: (val) => val.trim().length > 0
  };

  // Add event listeners for real-time validation on input/blur
  Object.keys(inputs).forEach(key => {
    const input = inputs[key];
    
    input.addEventListener('input', () => {
      const isValid = validators[key](input.value);
      // Only show error style once user has entered at least a character or if it is already in error state
      if (isValid || input.value.trim().length > 0) {
        showStatus(input, isValid);
      }
    });

    input.addEventListener('blur', () => {
      const isValid = validators[key](input.value);
      showStatus(input, isValid);
    });
  });

  // Load and Render Users from LocalStorage
  function getRegisteredUsers() {
    const data = localStorage.getItem('registeredUsers');
    return data ? JSON.parse(data) : [];
  }

  function saveRegisteredUsers(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }

  function renderUsers() {
    const users = getRegisteredUsers();
    
    // Update Badge
    userCountBadge.textContent = users.length;
    
    // Clear display except emptyState
    const cardElements = usersContainer.querySelectorAll('.user-card');
    cardElements.forEach(card => card.remove());

    if (users.length === 0) {
      emptyState.style.display = 'flex';
      clearAllBtn.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    clearAllBtn.style.display = 'inline-block';

    // Render users horizontally
    users.forEach((user, index) => {
      const card = document.createElement('div');
      card.className = 'user-card';
      
      card.innerHTML = `
        <div class="user-card-header">
          <span class="user-title">User ${index + 1}</span>
          <button class="btn-delete-user" data-index="${index}" title="Delete Registrant">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
        <div class="user-details">
          <div class="user-detail-row">
            <span class="label">First Name:</span>
            <span class="value">${escapeHTML(user.firstName)}</span>
          </div>
          <div class="user-detail-row">
            <span class="label">Last Name:</span>
            <span class="value">${escapeHTML(user.lastName)}</span>
          </div>
          <div class="user-detail-row">
            <span class="label">Username:</span>
            <span class="value">${escapeHTML(user.username)}</span>
          </div>
          <div class="user-detail-row">
            <span class="label">Password:</span>
            <span class="value">${escapeHTML(user.password)}</span>
          </div>
          <div class="user-detail-row">
            <span class="label">Date of Birth:</span>
            <span class="value">${escapeHTML(user.dob)}</span>
          </div>
          <div class="user-detail-row">
            <span class="label">Mobile:</span>
            <span class="value">${escapeHTML(user.mobile)}</span>
          </div>
          <div class="user-detail-row">
            <span class="label">Address:</span>
            <span class="value">${escapeHTML(user.address)}</span>
          </div>
          <div class="user-detail-row">
            <span class="label">PIN Code:</span>
            <span class="value">${escapeHTML(user.pinCode)}</span>
          </div>
          <div class="user-detail-row">
            <span class="label">Gender:</span>
            <span class="value">${escapeHTML(user.gender)}</span>
          </div>
        </div>
      `;
      
      // Delete single user handler
      const deleteBtn = card.querySelector('.btn-delete-user');
      deleteBtn.addEventListener('click', (e) => {
        const userIndex = parseInt(deleteBtn.getAttribute('data-index'), 10);
        deleteUser(userIndex);
      });

      usersContainer.appendChild(card);
    });
  }

  // Delete single user
  function deleteUser(index) {
    const users = getRegisteredUsers();
    users.splice(index, 1);
    saveRegisteredUsers(users);
    renderUsers();
  }

  // Clear Form Fields
  function resetForm() {
    form.reset();
    Object.keys(inputs).forEach(key => {
      clearStatus(inputs[key]);
    });
    // reset password toggle view if it was toggle to plain text
    passwordInput.type = 'password';
    eyeIcon.innerHTML = eyeOpenSvg;
  }

  // Form Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    
    // Validate all fields
    Object.keys(inputs).forEach(key => {
      const input = inputs[key];
      const isValid = validators[key](input.value);
      showStatus(input, isValid);
      if (!isValid) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      // Focus on first error element
      const firstError = form.querySelector('.input-group.error input, .input-group.error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Capture gender radio selection
    const gender = form.querySelector('input[name="gender"]:checked').value;

    // Collect data
    const userData = {
      firstName: inputs.firstName.value.trim(),
      lastName: inputs.lastName.value.trim(),
      username: inputs.username.value.trim(),
      password: inputs.password.value,
      dob: inputs.dob.value,
      mobile: inputs.mobile.value.trim(),
      address: inputs.address.value.trim(),
      pinCode: inputs.pinCode.value.trim(),
      gender: gender
    };

    // Save to LocalStorage
    const users = getRegisteredUsers();
    users.push(userData);
    saveRegisteredUsers(users);

    // Refresh UI
    renderUsers();
    resetForm();

    // Scroll horizontal container to show the newly added card (at the end)
    setTimeout(() => {
      usersContainer.scrollLeft = usersContainer.scrollWidth;
    }, 100);
  });

  // Clear Buttons Handlers
  clearBtn.addEventListener('click', () => {
    resetForm();
  });

  clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the entire registered users list?')) {
      localStorage.removeItem('registeredUsers');
      renderUsers();
    }
  });

  // Helper function to prevent HTML Injection
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
renderUsers();
});

