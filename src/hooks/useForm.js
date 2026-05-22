import { useState } from 'react';

/**
 * Custom hook for standard form management and validation.
 * 
 * @param {Object} initialValues - Initial state of the form fields
 * @param {Object} validate - Validation rules for each field
 * @param {Function} onSubmit - Function to call on successful submission
 */
export const useForm = (initialValues = {}, validate = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setValues({
      ...values,
      [name]: val
    });

    // Clear error for this field as user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    Object.keys(validate).forEach(field => {
      const rules = validate[field];
      const value = values[field];

      if (rules.required && !value) {
        formErrors[field] = 'This field is required';
        isValid = false;
      } else if (rules.email && !/\S+@\S+\.\S+/.test(value)) {
        formErrors[field] = 'Please enter a valid email';
        isValid = false;
      } else if (rules.minLength && value.length < rules.minLength) {
        formErrors[field] = `Must be at least ${rules.minLength} characters`;
        isValid = false;
      } else if (rules.pattern && !rules.pattern.test(value)) {
        formErrors[field] = rules.message || 'Invalid format';
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    setValues,
    setErrors
  };
};

export default useForm;
