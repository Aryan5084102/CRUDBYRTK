import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { verifyPAN, fetchPostcodeDetails, addCustomer, editCustomer } from '../slices/customerSlice';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';

const CustomerForm = ({ customer, onClose }) => {
  const dispatch = useDispatch();
  const panVerification = useSelector((state) => state.customers.panVerification);
  const postcodeDetails = useSelector((state) => state.customers.postcodeDetails);

  const initialValues = {
    pan: customer?.pan || '',
    fullName: customer?.fullName || '',
    email: customer?.email || '',
    mobile: customer?.mobile || '',
    addresses: customer?.addresses || [{ addressLine1: '', addressLine2: '', postcode: '', state: '', city: '' }],
  };

  const validationSchema = Yup.object({
    pan: Yup.string().required('PAN is required').matches(/[A-Z]{5}[0-9]{4}[A-Z]{1}/, 'Invalid PAN format').max(10, 'PAN should be 10 characters long'),
    fullName: Yup.string().required('Full Name is required').max(140, 'Full Name can be at most 140 characters long'),
    email: Yup.string().required('Email is required').email('Invalid email format').max(255, 'Email can be at most 255 characters long'),
    mobile: Yup.string().required('Mobile Number is required').matches(/^[6-9]\d{9}$/, 'Invalid Mobile Number format').max(10, 'Mobile Number should be 10 digits long'),
    addresses: Yup.array().of(
      Yup.object({
        addressLine1: Yup.string().required('Address Line 1 is required'),
        addressLine2: Yup.string(),
        postcode: Yup.string().required('Postcode is required').matches(/^[0-9]{6}$/, 'Invalid Postcode format').max(6, 'Postcode should be 6 digits long'),
        state: Yup.string().required('State is required'),
        city: Yup.string().required('City is required'),
      })
    ),
  });

  useEffect(() => {
    if (panVerification?.isValid) {
      setFieldValue('fullName', panVerification.fullName);
    }
  }, [panVerification]);

  useEffect(() => {
    if (postcodeDetails?.status === 'Success') {
      const address = { ...values.addresses[0] };
      address.state = postcodeDetails.state[0].name;
      address.city = postcodeDetails.city[0].name;
      setFieldValue('addresses[0]', address);
    }
  }, [postcodeDetails]);

  const handleSubmit = (values) => {
    if (customer) {
      dispatch(editCustomer({ ...customer, ...values }));
    } else {
      dispatch(addCustomer(values));
    }
    onClose();
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <div>
        <Form className='p-5'>
          <div className="mx-5  mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className=" sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                PAN Number
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="pan"
                  type='text'
                  onBlur={(e) => dispatch(verifyPAN(e.target.value))}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="fullName"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="email"
                  type="text"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                Mobile Number
              </label>
              <div className="mt-2">
                <input
                  id="first-name"
                  name="mobile"
                  type="number"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          <FieldArray name="addresses">
            {({ push, remove }) => (
              <>
                {values.addresses.map((address, index) => (
                  <div>
                  <div key={index} className="mx-5  mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="mb-4 sm:col-span-3">
                      <label className="block text-sm font-medium leading-6 text-gray-900">Address Line 1</label>
                      <Field
                        name={`addresses[${index}].addressLine1`}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="mb-4 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                      <Field
                        name={`addresses[${index}].addressLine2`}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="mb-4 sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                      <Field
                        name={`addresses[${index}].postcode`}
                        onBlur={(e) => dispatch(fetchPostcodeDetails(e.target.value))}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className='grid grid-cols- gap-x-6 gap-y-8 sm:grid-cols-6'>
                      <div className="mb-4 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <Field
                          as="select"
                          name={`addresses[${index}].state`}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value="">Select State</option>
                          {postcodeDetails?.state?.map((state) => (
                            <option key={state.id} value={state.name}>
                              {state.name}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <div className="mb-4 sm:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <Field
                          as="select"
                          name={`addresses[${index}].city`}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option value="">Select City</option>
                          {postcodeDetails?.city?.map((city) => (
                            <option key={city.id} value={city.name}>
                              {city.name}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>
                  </div>
                <div className='text-center'>
                  <button
                    type="button"
                    onClick={() => push({ addressLine1: '', addressLine2: '', postcode: '', state: '', city: '' })}
                    className="mt-4 mr-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Address
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-2 mr-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove Address
                  </button>
                </div>
                </div>
                ))}
              </>

            )}
          </FieldArray>
        </Form>
          <button
            type="submit"
            className="mt-4 mr-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Save Customer
          </button>
          </div>
      )}
    </Formik>

  )
}

export default CustomerForm