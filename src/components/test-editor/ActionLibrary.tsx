
export interface TestAction {
  name: string;
  description: string;
  syntax: string;
  category: 'navigation' | 'interaction' | 'assertion' | 'wait' | 'utility';
  parameters?: string[];
}

export const TEST_ACTIONS: TestAction[] = [
  // Navigation
  { name: 'navigate', description: 'Navigate to a URL', syntax: 'navigate {url}', category: 'navigation', parameters: ['url'] },
  { name: 'back', description: 'Go back in browser history', syntax: 'back', category: 'navigation' },
  { name: 'forward', description: 'Go forward in browser history', syntax: 'forward', category: 'navigation' },
  { name: 'refresh', description: 'Refresh the current page', syntax: 'refresh', category: 'navigation' },
  
  // Interaction
  { name: 'click', description: 'Click on an element', syntax: 'click {element}', category: 'interaction', parameters: ['element'] },
  { name: 'type', description: 'Type text into an input field', syntax: 'type {element} "{text}"', category: 'interaction', parameters: ['element', 'text'] },
  { name: 'clear', description: 'Clear text from an input field', syntax: 'clear {element}', category: 'interaction', parameters: ['element'] },
  { name: 'select', description: 'Select an option from dropdown', syntax: 'select {element} "{option}"', category: 'interaction', parameters: ['element', 'option'] },
  { name: 'hover', description: 'Hover over an element', syntax: 'hover {element}', category: 'interaction', parameters: ['element'] },
  { name: 'drag', description: 'Drag element to target', syntax: 'drag {source} {target}', category: 'interaction', parameters: ['source', 'target'] },
  { name: 'scroll', description: 'Scroll to an element', syntax: 'scroll {element}', category: 'interaction', parameters: ['element'] },
  
  // Assertions
  { name: 'assert', description: 'Assert element is visible', syntax: 'assert {element} visible', category: 'assertion', parameters: ['element', 'condition'] },
  { name: 'verify', description: 'Verify text content', syntax: 'verify {element} contains "{text}"', category: 'assertion', parameters: ['element', 'text'] },
  { name: 'assertText', description: 'Assert exact text match', syntax: 'assertText {element} "{text}"', category: 'assertion', parameters: ['element', 'text'] },
  { name: 'assertUrl', description: 'Assert current URL', syntax: 'assertUrl "{url}"', category: 'assertion', parameters: ['url'] },
  
  // Wait
  { name: 'waitFor', description: 'Wait for element to appear', syntax: 'waitFor {element}', category: 'wait', parameters: ['element'] },
  { name: 'waitForText', description: 'Wait for text to appear', syntax: 'waitForText {element} "{text}"', category: 'wait', parameters: ['element', 'text'] },
  { name: 'sleep', description: 'Wait for specified time', syntax: 'sleep {milliseconds}', category: 'wait', parameters: ['milliseconds'] },
  
  // Utility
  { name: 'screenshot', description: 'Take a screenshot', syntax: 'screenshot "{name}"', category: 'utility', parameters: ['name'] },
  { name: 'launch', description: 'Launch browser', syntax: 'launch {browser}', category: 'utility', parameters: ['browser'] },
  { name: 'close', description: 'Close browser', syntax: 'close', category: 'utility' }
];

export const PAGE_OBJECTS = [
  // Common UI elements
  'loginButton', 'emailInput', 'passwordInput', 'submitButton', 'cancelButton',
  'usernameField', 'confirmPasswordField', 'rememberMeCheckbox', 'forgotPasswordLink',
  
  // Navigation elements
  'headerMenu', 'footerMenu', 'navigationBar', 'breadcrumbs', 'sidebarMenu',
  'homeLink', 'profileLink', 'settingsLink', 'logoutLink',
  
  // Content elements
  'searchBox', 'searchButton', 'filterDropdown', 'sortDropdown', 'paginationNext',
  'paginationPrevious', 'itemsList', 'tableRows', 'cardContainer',
  
  // Shopping/E-commerce
  'shoppingCart', 'addToCartButton', 'buyNowButton', 'quantityInput', 'priceDisplay',
  'checkoutButton', 'paymentForm', 'shippingForm',
  
  // Form elements
  'firstNameInput', 'lastNameInput', 'phoneInput', 'addressInput', 'cityInput',
  'stateDropdown', 'zipCodeInput', 'countryDropdown', 'datePickerInput',
  
  // Modal and dialog elements
  'modal', 'dialog', 'confirmDialog', 'alertDialog', 'closeModalButton',
  'modalTitle', 'modalContent', 'modalActions'
];

export const getActionSuggestions = (input: string): TestAction[] => {
  const normalizedInput = input.toLowerCase().trim();
  
  if (!normalizedInput) {
    return TEST_ACTIONS.slice(0, 10); // Return top 10 most common actions
  }
  
  return TEST_ACTIONS.filter(action => 
    action.name.toLowerCase().includes(normalizedInput) ||
    action.description.toLowerCase().includes(normalizedInput)
  ).sort((a, b) => {
    // Prioritize exact matches
    const aExact = a.name.toLowerCase().startsWith(normalizedInput);
    const bExact = b.name.toLowerCase().startsWith(normalizedInput);
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    return a.name.localeCompare(b.name);
  });
};

export const getObjectSuggestions = (input: string): string[] => {
  const normalizedInput = input.toLowerCase().trim();
  
  if (!normalizedInput) {
    return PAGE_OBJECTS.slice(0, 10); // Return top 10 most common objects
  }
  
  return PAGE_OBJECTS.filter(obj => 
    obj.toLowerCase().includes(normalizedInput)
  ).sort((a, b) => {
    // Prioritize exact matches
    const aExact = a.toLowerCase().startsWith(normalizedInput);
    const bExact = b.toLowerCase().startsWith(normalizedInput);
    
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;
    
    return a.localeCompare(b);
  });
};
