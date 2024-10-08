import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import './BookPickup.css';

const BookPickup = () => {
  const { t } = useTranslation(); // Using useTranslation hook to access translations
  const [pickupLocation, setPickupLocation] = useState(''); // State to store the selected pickup location
  const [selectedDate, setSelectedDate] = useState(null); // State to store the selected pickup date
  const [availableSlots, setAvailableSlots] = useState([]); // State to store available time slots for the selected date and location
  const [timeSlot, setTimeSlot] = useState(''); // State to store the selected time slot
  const [confirmation, setConfirmation] = useState(false); // State to track whether the confirmation page is shown
  const [scheduledPickup, setScheduledPickup] = useState(null); // State to store the user's scheduled pickup if it exists

  // Effect to fetch the user's scheduled pickup from the API, if it exists
  useEffect(() => {
    const fetchScheduledPickup = async () => {
      try {
        // Retrieve user details from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        // Fetch the user's scheduled pickup from the backend using their email
        const response = await fetch(`/api/pickup/scheduled?email=${user.email}`);
        const data = await response.json();
        // If the user has a scheduled pickup, update the states accordingly
        if (data.scheduledPickup) {
          setScheduledPickup(data.scheduledPickup); // Store the scheduled pickup
          setPickupLocation(data.scheduledPickup.pickupLocation); // Set the previously selected location
          setSelectedDate(new Date(data.scheduledPickup.pickupDate)); // Set the previously selected date
          setTimeSlot(data.scheduledPickup.pickupTime); // Set the previously selected time slot
          setConfirmation(true); // Show the confirmation page if a pickup is scheduled
        }
      } catch (error) {
        console.error('Error fetching scheduled pickup:', error); // Log any error that occurs while fetching the pickup
      }
    };

    fetchScheduledPickup(); // Call the function to fetch the scheduled pickup
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Effect to fetch available time slots when a date and location are selected
  useEffect(() => {
    if (selectedDate && pickupLocation) {
      const fetchAvailableSlots = async () => {
        try {
          // Format the selected date into YYYY-MM-DD format
          const formattedDate = selectedDate.toISOString().split('T')[0];
          // Fetch available slots for the selected date and location
          const response = await fetch(`/api/pickup/available-slots?pickupDate=${formattedDate}&pickupLocation=${pickupLocation}`);
          const data = await response.json();
          setAvailableSlots(data.availableSlots); // Update the available time slots
        } catch (error) {
          console.error('Error fetching available slots:', error); // Log any error that occurs while fetching time slots
        }
      };

      fetchAvailableSlots(); // Call the function to fetch the available time slots
    }
  }, [selectedDate, pickupLocation]); // Effect depends on selectedDate and pickupLocation

  // Function to handle the scheduling of a pickup
  const handleSchedulePickup = async () => {
    // Check if location, date, and time slot are selected
    if (pickupLocation && selectedDate && timeSlot) {
      try {
        // Extract cartId from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const cartId = urlParams.get('cartId');
        // Retrieve user details from localStorage
        const user = JSON.parse(localStorage.getItem('user'));

        // Send a request to the server to schedule the pickup
        await fetch('/api/pickup/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartId, // Cart ID of the user
            email: user.email, // User email
            pickupDate: selectedDate, // Selected date for the pickup
            pickupTime: timeSlot, // Selected time slot
            pickupLocation: pickupLocation, // Selected pickup location
          }),
        });

        setConfirmation(true); // Show the confirmation page once the pickup is successfully scheduled
      } catch (error) {
        console.error('Error scheduling pickup:', error); // Log any error that occurs during pickup scheduling
      }
    } else {
      alert(t('select_all_options')); // Show an alert if the user hasn't selected all options, with translation support
    }
  };

  return (
    <div className="book-pickup-container">
      {/* If the pickup isn't confirmed, show the scheduling form */}
      {!confirmation ? (
        <div>
          <h2>{t('schedule_book_pickup')}</h2> {/* Title: Schedule Book Pickup */}

          {/* Pickup location dropdown */}
          <label>
            {t('select_pickup_location')}: {/* Label: Select Pickup Location */}
            <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
              <option value="">{t('select_location')}</option> {/* Default option: Select Location */}
              <option value="Library 1">Library 1</option> {/* Option 1: Library 1 */}
              <option value="Library 2">Library 2</option> {/* Option 2: Library 2 */}
              <option value="Center A">Center A</option> {/* Option 3: Center A */}
              <option value="Center B">Center B</option> {/* Option 4: Center B */}
            </select>
          </label>
          <br />
          <br />
          
          {/* Date selection using DatePicker */}
          <label>
            {t('select_date')}: {/* Label: Select Date */}
            <DatePicker
              selected={selectedDate} // Selected date state
              onChange={(date) => setSelectedDate(date)} // Update state on date selection
              minDate={new Date()} // Disable past dates
            />
          </label>
          <br />
          <br />

          {/* Display available time slots if any */}
          {availableSlots.length > 0 && (
            <label>
              {t('select_time_slot')}: {/* Label: Select Time Slot */}
              <div className="time-slot-container">
                {/* Loop through available slots and render each as a button */}
                {availableSlots.map((slot, index) => (
                  <button
                    key={index} // Unique key for each button
                    className={`time-slot ${timeSlot === slot ? 'selected' : ''}`} // Add selected class if the time slot is selected
                    onClick={() => setTimeSlot(slot)} // Update timeSlot state on button click
                  >
                    {slot} {/* Display time slot */}
                  </button>
                ))}
              </div>
            </label>
          )}

          {/* Button to schedule the pickup */}
          <button className="schedule-btn" onClick={handleSchedulePickup}>
            {t('schedule_pickup')} {/* Button text: Schedule Pickup */}
          </button>
        </div>
      ) : (
        // If pickup is confirmed, show the confirmation details
        <div>
          <h2>{t('pickup_confirmation')}</h2> {/* Title: Pickup Confirmation */}
          <p>{t('pickup_location')}: {pickupLocation}</p> {/* Display selected pickup location */}
          <p>{t('pickup_date')}: {selectedDate?.toLocaleDateString()}</p> {/* Display selected pickup date */}
          <p>{t('pickup_time')}: {timeSlot}</p> {/* Display selected pickup time */}
          
          {/* Button to reschedule the pickup */}
          <button className="reschedule-btn" onClick={() => setConfirmation(false)}>
            {t('reschedule_pickup')} {/* Button text: Reschedule Pickup */}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookPickup;