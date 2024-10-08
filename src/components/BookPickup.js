import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next'; // Importing useTranslation hook
import 'react-datepicker/dist/react-datepicker.css';
import './BookPickup.css';

const BookPickup = () => {
  const { t } = useTranslation(); // Using useTranslation hook
  const [pickupLocation, setPickupLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [scheduledPickup, setScheduledPickup] = useState(null);

  // Fetch the user's scheduled pickup (if it exists)
  useEffect(() => {
    const fetchScheduledPickup = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await fetch(`/api/pickup/scheduled?email=${user.email}`);
        const data = await response.json();
        if (data.scheduledPickup) {
          setScheduledPickup(data.scheduledPickup);
          setPickupLocation(data.scheduledPickup.pickupLocation);
          setSelectedDate(new Date(data.scheduledPickup.pickupDate));
          setTimeSlot(data.scheduledPickup.pickupTime);
          setConfirmation(true); // Automatically show the confirmation page
        }
      } catch (error) {
        console.error('Error fetching scheduled pickup:', error);
      }
    };

    fetchScheduledPickup();
  }, []);

  // Fetch available slots when a date and location are selected
  useEffect(() => {
    if (selectedDate && pickupLocation) {
      const fetchAvailableSlots = async () => {
        try {
          const formattedDate = selectedDate.toISOString().split('T')[0];
          const response = await fetch(`/api/pickup/available-slots?pickupDate=${formattedDate}&pickupLocation=${pickupLocation}`);
          const data = await response.json();
          setAvailableSlots(data.availableSlots);
        } catch (error) {
          console.error('Error fetching available slots:', error);
        }
      };

      fetchAvailableSlots();
    }
  }, [selectedDate, pickupLocation]);

  const handleSchedulePickup = async () => {
    if (pickupLocation && selectedDate && timeSlot) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const cartId = urlParams.get('cartId');
        const user = JSON.parse(localStorage.getItem('user'));

        await fetch('/api/pickup/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartId,
            email: user.email,
            pickupDate: selectedDate,
            pickupTime: timeSlot,
            pickupLocation: pickupLocation,
          }),
        });

        setConfirmation(true);
      } catch (error) {
        console.error('Error scheduling pickup:', error);
      }
    } else {
      alert(t('select_all_options')); // Translation for alert
    }
  };

  return (
    <div className="book-pickup-container">
      {!confirmation ? (
        <div>
          <h2>{t('schedule_book_pickup')}</h2> {/* Translation for "Schedule Book Pickup" */}

          <label>
            {t('select_pickup_location')}: {/* Translation for "Select Pickup Location" */}
            <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)}>
              <option value="">{t('select_location')}</option> {/* Translation for "Select Location" */}
              <option value="Library 1">Library 1</option>
              <option value="Library 2">Library 2</option>
              <option value="Center A">Center A</option>
              <option value="Center B">Center B</option>
            </select>
          </label>
          <br />
          <br />
          <label>
            {t('select_date')}: {/* Translation for "Select Date" */}
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
            />
          </label>
          <br />
          <br />
          {availableSlots.length > 0 && (
            <label>
              {t('select_time_slot')}: {/* Translation for "Select Time Slot" */}
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
          )}

          <button className="schedule-btn" onClick={handleSchedulePickup}>
            {t('schedule_pickup')} {/* Translation for "Schedule Pickup" */}
          </button>
        </div>
      ) : (
        <div>
          <h2>{t('pickup_confirmation')}</h2> {/* Translation for "Pickup Confirmation" */}
          <p>{t('pickup_location')}: {pickupLocation}</p> {/* Translation for "Pickup Location" */}
          <p>{t('pickup_date')}: {selectedDate?.toLocaleDateString()}</p> {/* Translation for "Pickup Date" */}
          <p>{t('pickup_time')}: {timeSlot}</p> {/* Translation for "Pickup Time" */}
          <button className="reschedule-btn" onClick={() => setConfirmation(false)}>
            {t('reschedule_pickup')} {/* Translation for "Reschedule Pickup" */}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookPickup;
