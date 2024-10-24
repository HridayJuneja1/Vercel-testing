import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import './BookPickup.css';

const BookPickup = () => {
  const { t } = useTranslation(); // Using useTranslation hook to access translations
  const [pickupLocation, setPickupLocation] = useState(''); // Store selected pickup location
  const [selectedDate, setSelectedDate] = useState(null); // Store selected pickup date
  const [availableSlots, setAvailableSlots] = useState([]); // Store available time slots for selected date/location
  const [timeSlot, setTimeSlot] = useState(''); // Store selected time slot
  const [confirmation, setConfirmation] = useState(false); // Track whether confirmation page is shown
  const [scheduledPickup, setScheduledPickup] = useState(null); // Store user's scheduled pickup if it exists
  const [loadingSlots, setLoadingSlots] = useState(false); // Loading state for available slots
  const [loadingPickup, setLoadingPickup] = useState(true); // Loading state for scheduled pickup
  const [error, setError] = useState(null); // Error state

  // Fetch user's scheduled pickup from the API, if it exists
  useEffect(() => {
    const fetchScheduledPickup = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) throw new Error('User not logged in');

        const response = await fetch(`/api/pickup/scheduled?email=${user.email}`);
        const data = await response.json();

        if (data.scheduledPickup) {
          setScheduledPickup(data.scheduledPickup);
          setPickupLocation(data.scheduledPickup.pickupLocation);
          setSelectedDate(new Date(data.scheduledPickup.pickupDate));
          setTimeSlot(data.scheduledPickup.pickupTime);
          setConfirmation(true);
        }
      } catch (err) {
        console.error('Error fetching scheduled pickup:', err);
        setError(t('error_fetching_scheduled_pickup')); // Handle error in translation
      } finally {
        setLoadingPickup(false); // Stop loading
      }
    };

    fetchScheduledPickup();
  }, [t]); // Fetch scheduled pickup on component mount

  // Fetch available time slots when a date and location are selected
  useEffect(() => {
    if (selectedDate && pickupLocation) {
      const fetchAvailableSlots = async () => {
        setLoadingSlots(true); // Start loading
        try {
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const response = await fetch(`/api/pickup/available-slots?pickupDate=${formattedDate}&pickupLocation=${pickupLocation}`);
          const data = await response.json();
          setAvailableSlots(data.availableSlots || []); // Ensure it's always an array
        } catch (err) {
          console.error('Error fetching available slots:', err);
          setError(t('error_fetching_slots')); // Handle error in translation
        } finally {
          setLoadingSlots(false); // Stop loading
        }
      };

      fetchAvailableSlots();
    }
  }, [selectedDate, pickupLocation, t]); // Fetch available slots when date or location changes

  const handleSchedulePickup = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const cartId = urlParams.get('cartId');
      const user = JSON.parse(localStorage.getItem('user'));

      // Ensure selectedDate is converted to ISO format before sending it to the backend
      const formattedPickupDate = selectedDate.toISOString(); // Convert date to ISO string

      const response = await fetch('/api/pickup/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartId, // Pass cartId only
          email: user.email, // Pass user email
          pickupDate: formattedPickupDate, // Pass ISO formatted date
          pickupTime: timeSlot, // Pass the selected time slot
          pickupLocation, // Pass the selected location
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to schedule pickup.');
      }

      window.location.href = '/pickup-confirmed';
    } catch (error) {
      console.error('Error scheduling pickup:', error);
      alert(error.message);
    }
  };



  if (loadingPickup) {
    return <div>{t('loading_pickup_data')}</div>; // Show loading message
  }

  if (error) {
    return <div>{error}</div>; // Show error message if any
  }

  return (
    <div className="book-pickup-container">
      {!confirmation ? (
        <div>
          <h2>{t('schedule_book_pickup')}</h2>

          {/* Pickup location dropdown */}
          <label>
            {t('select_pickup_location')}:
            <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
              <option value="">{t('select_location')}</option>
              <option value="Library 1">Library 1</option>
              <option value="Library 2">Library 2</option>
              <option value="Center A">Center A</option>
              <option value="Center B">Center B</option>
            </select>
          </label>
          <br />
          <br />

          {/* Date selection using DatePicker */}
          <label>
            {t('select_date')}:
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()} // Disable past dates
            />
          </label>
          <br />
          <br />

          {/* Available time slots */}
          {loadingSlots ? (
            <div>{t('loading_slots')}</div>
          ) : availableSlots.length > 0 ? (
            <label>
              {t('select_time_slot')}:
              <div className="time-slot-container">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={`time-slot ${timeSlot === slot ? 'selected' : ''}`}
                    onClick={() => setTimeSlot(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </label>
          ) : (
            <div>{t('no_slots_available')}</div> // Show message if no slots available
          )}

          {/* Schedule button */}
          <button className="schedule-btn" onClick={handleSchedulePickup}>
            {t('schedule_pickup')}
          </button>
        </div>
      ) : (
        <div>
          <h2>{t('pickup_confirmation')}</h2>
          <p>{t('pickup_location')}: {pickupLocation}</p>
          <p>{t('pickup_date')}: {selectedDate?.toLocaleDateString()}</p>
          <p>{t('pickup_time')}: {timeSlot}</p>

          {/* Reschedule button */}
          <button className="reschedule-btn" onClick={() => setConfirmation(false)}>
            {t('reschedule_pickup')}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookPickup;
