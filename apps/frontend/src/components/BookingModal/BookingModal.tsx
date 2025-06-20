import React from "react";
import styles from './BookingModal.module.scss';
import { useState } from "react";
import Button from "../Button/Button";

interface BookingModalProps {
    onBook: (date: Date, time: string) => void;
    tableId: number;
}

const BookingModal: React.FC<BookingModalProps> = ({
    onBook,
    tableId
}) => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [availability, setAvailability] = useState<boolean[]>([]);
    const [availableSlots, setAvailableSlots] = useState<number[]>([]);

    const getDateAndTime = (date: string) => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        return `${date}T${hours}:${minutes}:${seconds}+03:00`;
    } 

    async function fetchAvailability(tableId: number, selectedDate: string) {
        try {
            const res = await fetch(`http://localhost:52/bookings/availability?table_id=${tableId}&date=${selectedDate}`);
    
            if (!res.ok) {
                throw new Error(`Ошибка HTTP: ${res.status}`);
            }
    
            const data = await res.json();
            setAvailability(data);
        } catch (error) {
            console.error("Ошибка получения свободных слотов: ", error);
        }
    }
    
    const handleSubmit = () => {
        if (selectedDate) {
            // onBook(selectedDate, selectedTime);
            console.log(selectedDate);
        }
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>Бронирование столика №{tableId}</h2>

                <form onSubmit={handleSubmit}>
                    <div className={styles.formField}>
                        <label>Дата:</label>
                        <input
                            type="date"
                            min={new Date().toISOString()}
                            onChange={(e) => {
                                const fullDate = getDateAndTime(e.target.value);
                                console.log(fullDate);
                                setSelectedDate(fullDate);
                                fetchAvailability(tableId, selectedDate);
                            }}
                            required
                        />
                    </div>
                    <div className={styles.formField}>
                        <label>Время:</label>
                        {/* <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            required
                        >
                            <option value="">Выберите время</option>
                            {timeSlots.map((time) => (
                                <option key={time} value={time}></option>
                            ))}
                        </select> */}
                    </div>

                    <Button visible="visible" variant="primary">Забронировать</Button>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;